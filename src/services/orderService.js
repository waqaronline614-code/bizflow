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

const ordersRef = collection(db, "orders");

// --------------------------------
// Add a new order
// --------------------------------
export const addOrder = async (data) => {
    const orderNo = await generateSequentialId("orders", "ORD");

    const docRef = await addDoc(ordersRef, {
        ...data,
        orderNo,
        createdAt: serverTimestamp(),
    });

    // sale happened -> reduce stock for each item sold
    await adjustStockForItems(data.items, "decrease");

    return { id: docRef.id, orderNo };
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
    await updateDoc(orderDoc, data);

    if (oldItems) {
        await adjustStockForItems(oldItems, "increase"); // undo old sale
    }
    await adjustStockForItems(data.items, "decrease"); // apply new sale
};

// --------------------------------
// Delete an order
// --------------------------------
export const deleteOrder = async (id, items) => {
    const orderDoc = doc(db, "orders", id);

    // Check the order still exists before doing anything. If it was
    // already deleted (e.g. a duplicate/double click), skip entirely so
    // stock doesn't get added back a second time.
    const orderSnap = await getDoc(orderDoc);
    if (!orderSnap.exists()) {
        return;
    }

    await deleteDoc(orderDoc);

    if (items) {
        await adjustStockForItems(items, "increase"); // give stock back
    }
};