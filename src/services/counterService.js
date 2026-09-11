import { db } from "../firebase/firebase";
import { doc, runTransaction } from "firebase/firestore";

// --------------------------------
// Generates a sequential, human-readable ID like "ORD001", "PURCH001"
// prefix: e.g. "ORD" or "PURCH"
// counterName: Firestore doc id under "counters", e.g. "orders" or "purchases"
// padLength: how many digits to pad to (3 -> 001, 012, 123)
// --------------------------------
export const generateSequentialId = async (counterName, prefix, padLength = 3) => {
    const counterRef = doc(db, "counters", counterName);

    const nextNumber = await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);

        const currentNumber = counterDoc.exists()
            ? counterDoc.data().lastNumber
            : 0;

        const newNumber = currentNumber + 1;

        transaction.set(counterRef, { lastNumber: newNumber });

        return newNumber;
    });

    return `${prefix}${String(nextNumber).padStart(padLength, "0")}`;
};