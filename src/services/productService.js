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

const productsRef = collection(db, "products");

// --------------------------------
// Add a new product
// --------------------------------
export const addProduct = async (data) => {
    const docRef = await addDoc(productsRef, {
        ...data,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

// --------------------------------
// Get all products
// --------------------------------
export const getProducts = async () => {
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

// --------------------------------
// Update an existing product
// --------------------------------
export const updateProduct = async (id, data) => {
    const productDoc = doc(db, "products", id);
    await updateDoc(productDoc, data);
};

// --------------------------------
// Delete a product
// --------------------------------
export const deleteProduct = async (id) => {
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
};