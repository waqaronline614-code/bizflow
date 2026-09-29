import { db } from "../firebase/firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
} from "firebase/firestore";
import { getPaymentsByParty } from "./paymentsService";

const customersRef = collection(db, "customers");
const ordersRef = collection(db, "orders");

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

// --------------------------------
// Get a single customer's real outstanding balance
// --------------------------------
export const getCustomerBalance = async (customerId) => {
    const ordersQuery = query(ordersRef, where("customerId", "==", customerId));
    const ordersSnap = await getDocs(ordersQuery);
    const totalOrdered = ordersSnap.docs.reduce(
        (sum, d) => sum + (d.data().grandTotal || 0),
        0
    );

    const payments = await getPaymentsByParty(customerId, "customer");
    const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return totalOrdered - totalPaid;
};

// --------------------------------
// Balances for ALL customers at once
// --------------------------------
export const getAllCustomerBalances = async (customers) => {
    const [ordersSnap, paymentsSnap] = await Promise.all([
        getDocs(ordersRef),
        getDocs(collection(db, "payments")),
    ]);

    const orders = ordersSnap.docs.map((d) => d.data());
    const payments = paymentsSnap.docs.map((d) => d.data());


    return customers.map((c) => {
        const totalOrdered = orders
            .filter((o) => o.customerId === c.id)
            .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

        const totalPaid = payments
            .filter((p) => p.partyId === c.id && p.partyType === "customer")
            .reduce((sum, p) => sum + (p.amount || 0), 0);

        return { ...c, balance: totalOrdered - totalPaid };
    });
};