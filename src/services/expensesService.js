import {
  collection, getDocs, doc, runTransaction, increment,
  query, orderBy, limit, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase"; 

const COL = "expenses";
const ACCOUNTS = "accounts"; 

// Expenses saved before account selection existed only have paymentMethod
const accountIdOf = (exp) =>
  exp.accountId || (exp.paymentMethod === "Cash" ? "cash" : "bank");

export const getNextExpenseNo = async () => {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return "EXP001";
  const last = snap.docs[0].data().expenseNo || "EXP000";
  const n = parseInt(last.replace("EXP", ""), 10) || 0;
  return `EXP${String(n + 1).padStart(3, "0")}`;
};

export const getExpenses = async () => {
  const q = query(collection(db, COL), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// data must include accountId and accountName (chosen in the modal)
export const addExpense = async (data) => {
  const expenseNo = await getNextExpenseNo();
  const amount = Number(data.amount);
  const expenseRef = doc(collection(db, COL));
  const accountRef = doc(db, ACCOUNTS, data.accountId);

  await runTransaction(db, async (tx) => {
    tx.set(expenseRef, { ...data, expenseNo, amount, createdAt: serverTimestamp() });
    tx.update(accountRef, { currentBalance: increment(-amount) });
  });
  return { id: expenseRef.id, expenseNo, ...data, amount };
};

// Edit: refund the old account, charge the newly selected one
export const updateExpense = async (id, data) => {
  const expenseRef = doc(db, COL, id);
  const newAmount = Number(data.amount);

  await runTransaction(db, async (tx) => {
    const old = (await tx.get(expenseRef)).data();
    const oldAcc = doc(db, ACCOUNTS, accountIdOf(old));
    const newAcc = doc(db, ACCOUNTS, data.accountId);

    tx.update(oldAcc, { currentBalance: increment(Number(old.amount)) });
    tx.update(newAcc, { currentBalance: increment(-newAmount) });
    tx.update(expenseRef, { ...data, amount: newAmount, updatedAt: serverTimestamp() });
  });
};

// Delete: refund the account the expense was paid from
export const deleteExpense = async (id) => {
  const expenseRef = doc(db, COL, id);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(expenseRef);
    if (!snap.exists()) return;
    const exp = snap.data();
    tx.update(doc(db, ACCOUNTS, accountIdOf(exp)), { currentBalance: increment(Number(exp.amount)) });
    tx.delete(expenseRef);
  });
};