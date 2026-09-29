import { db } from "../firebase/firebase";
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";
import { generateSequentialId } from "./counterService";
import { adjustStockForItems } from "./productService";
import {
    addPayment,
    updatePayment,
    deletePayment,
    getPaymentsByRelated,
} from "./paymentsService";
import { getAccounts, adjustAccountBalance } from "./Accountsservice";

const ordersRef = collection(db, "orders");

// --------------------------------
// Helper: paymentMethod is stored as the account NAME on the payment
// record, so look up its id before adjusting the balance.
// --------------------------------
const findAccountIdByName = async (name) => {
    if (!name) return null;
    const accounts = await getAccounts();
    const account = accounts.find((a) => a.name === name);
    return account ? account.id : null;
};

// --------------------------------
// Add a new order
// --------------------------------
export const addOrder = async (data) => {

    const orderNo = await generateSequentialId("orders", "ORD");

    // paidAmount / paymentMethod don't get saved on the order doc directly.
    // The order always starts at amountPaid: 0; addPayment() below creates
    // the one payment record that represents what was paid at order time.
    const { paidAmount, paymentMethod, referenceNote,...orderFields } = data;

    const docRef = await addDoc(ordersRef, {
        ...orderFields,
        amountPaid: 0,
        balance: orderFields.grandTotal,
        orderNo,
        createdAt: serverTimestamp(),
    });

    // sale happened -> reduce stock for each item sold
    await adjustStockForItems(data.items, "decrease");

    if (paidAmount > 0) {
        await addPayment({
            type: "received",
            partyType: "customer",
            partyId: data.customerId,
            relatedType: "order",
            relatedId: docRef.id,
            amount: paidAmount,
            date: data.orderDate,
            method: paymentMethod || "Cash",
            reference: referenceNote || "Payment recorded at order creation",
        });

        // a received payment is money IN -> credit the account
        const accountId = await findAccountIdByName(paymentMethod || "Cash");
        if (accountId) {
            await adjustAccountBalance(accountId, paidAmount);
        }
    }

    // Re-fetch so the caller gets the TRUE final state — amountPaid/balance/
    // paymentStatus were just set by addPayment() above.
    const finalSnap = await getDoc(docRef);
    return { id: docRef.id, ...finalSnap.data() };
};

//---------------------------------
// Get all orders
//---------------------------------
export const getOrders = async () => {
    const snapshot = await getDocs(ordersRef);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

// --------------------------------
// Update an existing order
// --------------------------------
export const updateOrder = async (id, data, oldItems) => {
    const orderDoc = doc(db, "orders", id);

    // paidAmount is the FULL amount the form shows (not a delta). It syncs
    // the order's one payment record to match — updating it if it exists,
    // creating it if it doesn't, deleting it if the amount was cleared.
    const { paidAmount, paymentMethod, referenceNote ,...orderFields } = data;

    await updateDoc(orderDoc, orderFields);

    if (oldItems) {
        await adjustStockForItems(oldItems, "increase"); // undo old sale
    }
    await adjustStockForItems(data.items, "decrease"); // apply new sale

    const existingPayments = await getPaymentsByRelated(id, "order");
    const existingPayment = existingPayments[0];

    // capture the OLD payment's account + amount before syncing, so we
    // can reverse its balance effect
    const oldAccountId = existingPayment
        ? await findAccountIdByName(existingPayment.method)
        : null;
    const oldAmount = existingPayment ? Number(existingPayment.amount) || 0 : 0;

    if (paidAmount > 0) {
        if (existingPayment) {
            // update the order's existing payment instead of creating a new one
            await updatePayment(existingPayment.id, {
                amount: paidAmount,
                method: paymentMethod || existingPayment.method,
            });
        } else {
            await addPayment({
                type: "received",
                partyType: "customer",
                partyId: orderFields.customerId,
                relatedType: "order",
                relatedId: id,
                amount: paidAmount,
                date: orderFields.orderDate,
                method: paymentMethod || "Cash",
                reference:  referenceNote || "Payment recorded during order edit",
            });
        }
    } else if (existingPayment) {
        // amount was cleared to 0 — remove the payment record entirely
        await deletePayment(existingPayment.id);
    }

    // --------------------------------
    // Balance sync: reverse the old credit, then apply the new one.
    // Handles every case — amount changed, account changed, cleared to 0,
    // or a payment added where none existed before.
    // --------------------------------
    if (oldAccountId && oldAmount > 0) {
        await adjustAccountBalance(oldAccountId, -oldAmount);
    }
    if (paidAmount > 0) {
        const newAccountId = await findAccountIdByName(
            paymentMethod || existingPayment?.method || "Cash"
        );
        if (newAccountId) {
            await adjustAccountBalance(newAccountId, paidAmount);
        }
    }

    const finalSnap = await getDoc(orderDoc);
    return { id, ...finalSnap.data() };
};

// --------------------------------
// Delete an order
// --------------------------------
export const deleteOrder = async (id, items) => {
    const orderDoc = doc(db, "orders", id);

    const orderSnap = await getDoc(orderDoc);
    if (!orderSnap.exists()) {
        return;
    }

    // remove any payments linked to this order BEFORE deleting the order
    // itself, since recalcRelatedTotals (called inside deletePayment) needs
    // the order doc to still exist.
    const linkedPayments = await getPaymentsByRelated(id, "order");
    for (const payment of linkedPayments) {
        // a received payment being removed reverses its credit -> debit
        // the account back out
        const accountId = await findAccountIdByName(payment.method);
        const amount = Number(payment.amount) || 0;

        await deletePayment(payment.id);

        if (accountId && amount > 0) {
            await adjustAccountBalance(accountId, -amount);
        }
    }

    await deleteDoc(orderDoc);

    if (items) {
        await adjustStockForItems(items, "increase"); // give stock back
    }
};