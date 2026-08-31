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

const purchasesRef = collection(db, "purchases");

// --------------------------------
// Add a new purchase
// --------------------------------
export const addPurchase = async (data) => {
    const docRef = await addDoc(purchasesRef, {
        ...data,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
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
export const updatePurchase = async (id, data) => {
    const purchaseDoc = doc(db, "purchases", id);
    await updateDoc(purchaseDoc, data);
};

// --------------------------------
// Delete a purchase
// --------------------------------
export const deletePurchase = async (id) => {
    const purchaseDoc = doc(db, "purchases", id);
    await deleteDoc(purchaseDoc);
};