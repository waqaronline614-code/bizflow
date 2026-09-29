import { db } from "../firebase/firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";
import { getPaymentsByParty } from "./paymentsService";

const suppliersRef = collection(db, "supplier");
const purchasesRef = collection(db, "purchases");

//---------------------------------
// Add new supplier
//---------------------------------
export const addSupplier = async (data) => {
    const docRef = await addDoc(suppliersRef, {
        ...data,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

// --------------------------------
// Get all suppliers
// --------------------------------
export const getSuppliers = async () => {
    const snapshot = await getDocs(suppliersRef);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

// --------------------------------
// Update an existing supplier
// --------------------------------
export const updateSupplier = async (id, data) => {
    const supplierDoc = doc(db, "supplier", id);
    await updateDoc(supplierDoc, data);
};

// --------------------------------
// Delete a supplier
// --------------------------------
export const deleteSupplier = async (id) => {
    const supplierDoc = doc(db, "supplier", id);
    await deleteDoc(supplierDoc);
};

// --------------------------------
// Purchase docs have no grandTotal field — the net total is computed
// from items + totalDiscount, same as the order-side pattern
// --------------------------------
const safeNum = (value) => {
    const num = Number(value);
    return Number.isNaN(num) ? 0 : num;
};

const getPurchaseNetTotal = (purchase) => {
    const items = Array.isArray(purchase.items) ? purchase.items : [];
    const gross = items.reduce((sum, item) => sum + safeNum(item.amount), 0);
    const discountPercent = safeNum(purchase.totalDiscount);
    const discountAmount = gross * (discountPercent / 100);
    return gross - discountAmount;
};

// --------------------------------
// Get a single supplier's real outstanding balance:
// total of all purchases from them MINUS every payment made to them,
// whether applied to a specific purchase or left "on account"
// --------------------------------
export const getSupplierBalance = async (supplierId) => {
    const purchasesSnap = await getDocs(purchasesRef);

    const totalPurchased = purchasesSnap.docs
        .map((d) => d.data())
        .filter((p) => p.supplierId === supplierId)
        .reduce((sum, p) => sum + getPurchaseNetTotal(p), 0);

    const payments = await getPaymentsByParty(supplierId, "supplier");
    const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return totalPurchased - totalPaid;
};

// --------------------------------
// Balances for ALL suppliers at once — one purchases read + one
// payments read total, instead of two reads per supplier row
// --------------------------------
export const getAllSupplierBalances = async (suppliers) => {
    const [purchasesSnap, paymentsSnap] = await Promise.all([
        getDocs(purchasesRef),
        getDocs(collection(db, "payments")),
    ]);

    const purchases = purchasesSnap.docs.map((d) => d.data());
    const payments = paymentsSnap.docs.map((d) => d.data());

    return suppliers.map((s) => {
        const totalPurchased = purchases
            .filter((p) => p.supplierId === s.id)
            .reduce((sum, p) => sum + getPurchaseNetTotal(p), 0);

        const totalPaid = payments
            .filter((p) => p.partyId === s.id && p.partyType === "supplier")
            .reduce((sum, p) => sum + (p.amount || 0), 0);

        return { ...s, balance: totalPurchased - totalPaid };
    });
};