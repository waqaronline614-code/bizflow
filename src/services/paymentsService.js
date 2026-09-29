import { db } from "../firebase/firebase";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    runTransaction,
} from "firebase/firestore";
import { generateSequentialId } from "./counterService";

const paymentsRef = collection(db, "payments");

/**
 * Payment document shape:
 * {
 *   paymentNo: "PAY001",
 *   type: "received" | "made",
 *   partyType: "customer" | "supplier",
 *   partyId: string,
 *   accountId: string | null,      // <-- NEW: which cash/bank account the money went in/out of
 *   relatedType: "order" | "purchase" | null,
 *   relatedId: string | null,
 *   amount: number,
 *   date: string,
 *   method: string,
 *   reference: string,
 *   createdAt: serverTimestamp
 * }
 */

// received = money into the account (+), made = money out of the account (-)
const signedAmount = (p) =>
    (p.type === "received" ? 1 : -1) * (Number(p.amount) || 0);

// --------------------------------
// Add a new payment
// The payment write and the account balance change happen in ONE transaction,
// so they can never get out of sync.
// --------------------------------
export const addPayment = async (data) => {
    const paymentNo = await generateSequentialId("payments", "PAY");
    const paymentDoc = doc(paymentsRef); // create the id first

    await runTransaction(db, async (tx) => {
        // all reads first
        let accountRef = null;
        let accountSnap = null;
        if (data.accountId) {
            accountRef = doc(db, "accounts", data.accountId);
            accountSnap = await tx.get(accountRef);
        }

        // then writes
        tx.set(paymentDoc, {
            ...data,
            paymentNo,
            createdAt: serverTimestamp(),
        });

        if (accountSnap && accountSnap.exists()) {
            tx.update(accountRef, {
                currentBalance:
                    (accountSnap.data().currentBalance || 0) + signedAmount(data),
            });
        }
    });

    if (data.relatedType && data.relatedId) {
        try {
            await recalcRelatedTotals(data.relatedType, data.relatedId);
        } catch (err) {
            // The payment itself is already written — don't let a recalc
            // failure (missing index, bad related doc, etc.) look like the
            // whole save failed. Log it loudly so it still gets fixed.
            console.error(
                `Payment ${paymentNo} saved, but recalculating totals for ${data.relatedType} ${data.relatedId} failed:`,
                err
            );
        }
    }

    return { id: paymentDoc.id, paymentNo };
};

// --------------------------------
// Update an existing payment (amount, method, date, reference, account)
// Reverses the old effect on the account and applies the new one, in one
// transaction. Handles amount changes and account changes.
// --------------------------------
export const updatePayment = async (id, updates) => {
    const paymentDoc = doc(db, "payments", id);

    const existing = await runTransaction(db, async (tx) => {
        const snap = await tx.get(paymentDoc);
        if (!snap.exists()) return null;

        const old = snap.data();
        const next = { ...old, ...updates };

        // net change per account
        const changes = new Map();
        if (old.accountId) {
            changes.set(old.accountId, -signedAmount(old));
        }
        if (next.accountId) {
            changes.set(
                next.accountId,
                (changes.get(next.accountId) || 0) + signedAmount(next)
            );
        }

        // all reads first
        const accountIds = [...changes.keys()];
        const accountRefs = accountIds.map((aid) => doc(db, "accounts", aid));
        const accountSnaps = await Promise.all(accountRefs.map((r) => tx.get(r)));

        // then writes
        accountSnaps.forEach((accSnap, i) => {
            const delta = changes.get(accountIds[i]);
            if (accSnap.exists() && delta) {
                tx.update(accountRefs[i], {
                    currentBalance: (accSnap.data().currentBalance || 0) + delta,
                });
            }
        });

        tx.update(paymentDoc, updates);
        return old;
    });

    if (!existing) return;

    // relatedType/relatedId don't change on an update — reuse the existing ones
    if (existing.relatedType && existing.relatedId) {
        try {
            await recalcRelatedTotals(existing.relatedType, existing.relatedId);
        } catch (err) {
            console.error(
                `Payment ${id} updated, but recalculating totals for ${existing.relatedType} ${existing.relatedId} failed:`,
                err
            );
        }
    }
};

// --------------------------------
// Recalculate amountPaid / balance / paymentStatus on the linked order or
// purchase by SUMMING every payment linked to it. Recomputing from scratch
// (rather than incrementing/decrementing) keeps this correct no matter how
// many payments exist or in what order they were added/edited/deleted.
// --------------------------------
const recalcRelatedTotals = async (relatedType, relatedId) => {
    const collectionName = relatedType === "purchase" ? "purchases" : "orders";
    const relatedDocRef = doc(db, collectionName, relatedId);
    const relatedSnap = await getDoc(relatedDocRef);
    if (!relatedSnap.exists()) return;

    const linkedPaymentsQuery = query(
        paymentsRef,
        where("relatedId", "==", relatedId),
        where("relatedType", "==", relatedType)
    );
    const linkedPaymentsSnap = await getDocs(linkedPaymentsQuery);
    const totalPaid = linkedPaymentsSnap.docs.reduce(
        (sum, d) => sum + (d.data().amount || 0),
        0
    );

    // Purchases are built from items + totalDiscount rather than a stored
    // grandTotal (see AddPurchaseModal), so fall back to computing it the
    // same way if grandTotal isn't present on the doc.
    const relatedData = relatedSnap.data();
    let total = relatedData.grandTotal;
    if (total === undefined || total === null) {
        const items = Array.isArray(relatedData.items) ? relatedData.items : [];
        const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const discountPct = Number(relatedData.totalDiscount) || 0;
        total = subtotal - (subtotal * discountPct) / 100;
    }

    const balance = total - totalPaid;
    const paymentStatus =
        total <= 0
            ? "unpaid"
            : totalPaid <= 0
                ? "unpaid"
                : totalPaid >= total
                    ? "paid"
                    : "partial";

    await updateDoc(relatedDocRef, { amountPaid: totalPaid, balance, paymentStatus });
};

// --------------------------------
// Get all payments (optionally filtered by type)
// --------------------------------
export const getPayments = async (type) => {
    const q = type
        ? query(paymentsRef, where("type", "==", type), orderBy("date", "desc"))
        : query(paymentsRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
};

// --------------------------------
// Get all payments for a specific customer or supplier
// --------------------------------
export const getPaymentsByParty = async (partyId, partyType) => {
    const q = query(
        paymentsRef,
        where("partyId", "==", partyId),
        where("partyType", "==", partyType),
        orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
};

// --------------------------------
// Get all payments linked to a specific order or purchase
// --------------------------------
export const getPaymentsByRelated = async (relatedId, relatedType) => {
    const q = query(
        paymentsRef,
        where("relatedId", "==", relatedId),
        where("relatedType", "==", relatedType),
        orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
};

// --------------------------------
// Delete a payment
// Deletes the payment and reverses its effect on the account in ONE
// transaction. If the payment is already gone, nothing happens, so the
// balance can never be reversed twice.
// --------------------------------
export const deletePayment = async (id) => {
    const paymentDoc = doc(db, "payments", id);

    const existing = await runTransaction(db, async (tx) => {
        const snap = await tx.get(paymentDoc);
        if (!snap.exists()) return null; // already deleted -> do nothing

        const data = snap.data();

        // read first
        let accountRef = null;
        let accountSnap = null;
        if (data.accountId) {
            accountRef = doc(db, "accounts", data.accountId);
            accountSnap = await tx.get(accountRef);
        }

        // then writes
        if (accountSnap && accountSnap.exists()) {
            tx.update(accountRef, {
                currentBalance:
                    (accountSnap.data().currentBalance || 0) - signedAmount(data),
            });
        }
        tx.delete(paymentDoc);

        return data;
    });

    if (!existing) return;

    if (existing.relatedType && existing.relatedId) {
        try {
            await recalcRelatedTotals(existing.relatedType, existing.relatedId);
        } catch (err) {
            console.error(
                `Payment ${id} deleted, but recalculating totals for ${existing.relatedType} ${existing.relatedId} failed:`,
                err
            );
        }
    }
};