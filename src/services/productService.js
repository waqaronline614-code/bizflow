import { db } from "../firebase/firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    runTransaction,
} from "firebase/firestore";

const productsRef = collection(db, "products");

// --------------------------------
// Add a new product
// --------------------------------
export const addProduct = async (data) => {
    const docRef = await addDoc(productsRef, {
        ...data,
        stock: 0, // every product starts at 0
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

// --------------------------------
// Adjust one product's stock by a delta
// delta > 0 -> add stock (purchase)
// delta < 0 -> remove stock (sale)
// --------------------------------
export const adjustProductStock = async (productId, delta) => {
    const productDoc = doc(db, "products", productId);

    await runTransaction(db, async (transaction) => {
        const productSnap = await transaction.get(productDoc);

        if (!productSnap.exists()) {
            console.warn("Product not found for stock update:", productId);
            return;
        }

        const currentStock = productSnap.data().stock || 0;
        const newStock = currentStock + delta;

        transaction.update(productDoc, {
            stock: newStock < 0 ? 0 : newStock,
        });
    });
};

// --------------------------------
// Adjust stock for a whole list of items
// direction: "increase" (purchase) or "decrease" (sale)
// --------------------------------
export const adjustStockForItems = async (items, direction) => {
    for (const item of items) {
        const delta =
            direction === "increase"
                ? Number(item.quantity)
                : -Number(item.quantity);

        await adjustProductStock(item.productId, delta);
    }
};