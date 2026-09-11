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
import { generateSequentialId } from "./counterService"
import { adjustStockForItems } from "./productService";

const purchasesRef = collection(db, "purchases");

// --------------------------------
// Add a new purchase
// --------------------------------
export const addPurchase = async (data) => {
    const purchaseNo = await generateSequentialId("purchases", "PUR");

    const docRef = await addDoc(purchasesRef, {
        ...data,
        purchaseNo,
        createdAt: serverTimestamp(),
    });

    // purchase happened -> increase stock for each item purchased
    await adjustStockForItems(data.items, "increase");

    return { id: docRef.id, purchaseNo };
};

//---------------------------------
// Get all purchases
//---------------------------------
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
    await updateDoc(purchaseDoc, data);

    if (oldItems) {
        await adjustStockForItems(oldItems, "decrease"); // undo old purchase
    }
    await adjustStockForItems(data.items, "increase"); // apply new purchase
};

// --------------------------------
// Delete a purchase
// --------------------------------
export const deletePurchase = async (id, items) => {
    const purchaseDoc = doc(db, "purchases", id);

    // Check the purchase still exists before doing anything. If it was
    // already deleted (e.g. a duplicate/double click), skip entirely so
    // stock doesn't get removed a second time.
    const purchaseSnap = await getDoc(purchaseDoc);
    if (!purchaseSnap.exists()) {
        return;
    }

    await deleteDoc(purchaseDoc);

    if (items) {
        await adjustStockForItems(items, "decrease"); // remove the stock it added
    }
};