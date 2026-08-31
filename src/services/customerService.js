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

const customersRef = collection(db, "customers");

// --------------------------------
// Add a new customer
// --------------------------------
export const addCustomer = async (data) => {
    const docRef = await addDoc(customersRef, {
        ...data,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

// --------------------------------
// Get all customers
// --------------------------------
export const getCustomers = async () => {
    const snapshot = await getDocs(customersRef);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

// --------------------------------
// Update an existing customer
// --------------------------------
export const updateCustomer = async (id, data) => {
    const customerDoc = doc(db, "customers", id);
    await updateDoc(customerDoc, data);
};

// --------------------------------
// Delete a customer
// --------------------------------
export const deleteCustomer = async (id) => {
    const customerDoc = doc(db, "customers", id);
    await deleteDoc(customerDoc);
};