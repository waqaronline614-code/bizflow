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

const purchasesRef = collection(db, "purchases");

// --------------------------------
// Add a new purchase
// --------------------------------
export const addPurchase = async (data) => {
    const purchaseNo = await generateSequentialId("purchases", "PUR");

    const docRef = await addDoc(purchasesRef, {
        ...data,

        paymentMethod: data.paymentMethod || "",
        referenceNote: data.referenceNote || "",

        purchaseNo,
        createdAt: serverTimestamp(),
    });

    // Purchase happened -> increase stock
    await adjustStockForItems(data.items, "increase");

    return {
        id: docRef.id,
        purchaseNo,
    };
};

// --------------------------------
// Get all purchases
// --------------------------------
export const getPurchase = async () => {
    const snapshot = await getDocs(purchasesRef);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

// --------------------------------
// Update an existing purchase
// --------------------------------
export const updatePurchase = async (id, data, oldItems) => {
    const purchaseDoc = doc(db, "purchases", id);

    await updateDoc(purchaseDoc, {
        ...data,

        // Make sure updated payment information is saved
        paymentMethod: data.paymentMethod || "",
        referenceNote: data.referenceNote || "",
    });

    // Remove old stock
    if (oldItems) {
        await adjustStockForItems(oldItems, "decrease");
    }

    // Add new stock
    await adjustStockForItems(data.items, "increase");
};

// --------------------------------
// Delete a purchase
// --------------------------------
export const deletePurchase = async (id, items) => {
    const purchaseDoc = doc(db, "purchases", id);

    const purchaseSnap = await getDoc(purchaseDoc);

    if (!purchaseSnap.exists()) {
        return;
    }

    await deleteDoc(purchaseDoc);

    // Remove stock that was added by this purchase
    if (items) {
        await adjustStockForItems(items, "decrease");
    }
};