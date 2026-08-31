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

const suppliersRef = collection(db, "supplier");

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