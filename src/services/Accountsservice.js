import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const accountsCollection = collection(db, "accounts");
const paymentsCollection = collection(db, "payments");

const normalize = (s) => String(s || "").trim().toLowerCase();

/**
 * Does this payment belong to this account?
 *  - new payments: matched by accountId
 *  - your existing payments have no accountId, only method: "Cash In Hand",
 *    so they are matched by comparing the method with the account name
 */
const paymentBelongsToAccount = (payment, account) => {
  if (payment.accountId) return payment.accountId === account.id;
  return normalize(payment.method) === normalize(account.name);
};

/**
 * The balance is CALCULATED from the records, never trusted from a stored
 * number that other code adds to and subtracts from:
 *
 *   balance = openingBalance + payments received - payments made
 *
 * (If expenses or owner capital also move money in/out of an account, add
 * them to this function so they are counted too.)
 */
const calculateBalance = (account, payments) => {
  const opening = Number(account.openingBalance) || 0;
  const net = payments
    .filter((p) => paymentBelongsToAccount(p, account))
    .reduce((sum, p) => {
      const amount = Number(p.amount) || 0;
      return sum + (p.type === "received" ? amount : -amount);
    }, 0);
  return opening + net;
};

const loadAccountsAndPayments = async () => {
  const [accountsSnap, paymentsSnap] = await Promise.all([
    getDocs(accountsCollection),
    getDocs(paymentsCollection),
  ]);
  const accounts = accountsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const payments = paymentsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Helps you spot payments whose method doesn't match any account name
  const unmatched = payments.filter(
    (p) => !accounts.some((a) => paymentBelongsToAccount(p, a))
  );
  if (unmatched.length > 0) {
    console.warn(
      `${unmatched.length} payment(s) don't match any account (check method / accountId):`,
      unmatched.map((p) => ({ paymentNo: p.paymentNo, method: p.method }))
    );
  }

  return { accounts, payments };
};

// Fetch all accounts, with currentBalance calculated from the payments
export const getAccounts = async () => {
  const { accounts, payments } = await loadAccountsAndPayments();
  return accounts.map((account) => ({
    ...account,
    currentBalance: calculateBalance(account, payments),
  }));
};

// Add a new account
export const addAccount = async (accountData) => {
  const docRef = await addDoc(accountsCollection, {
    ...accountData,
    currentBalance: accountData.openingBalance || 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Update an existing account's details (name, type, openingBalance).
// currentBalance is never taken from the form: it is always recalculated.
export const updateAccount = async (id, accountData) => {
  const { currentBalance, ...safeData } = accountData; // ignore any balance sent from the form
  const accountRef = doc(db, "accounts", id);
  await updateDoc(accountRef, safeData);
  await recalculateAccountBalance(id);
};

// Delete an account
export const deleteAccount = async (id) => {
  const accountRef = doc(db, "accounts", id);
  await deleteDoc(accountRef);
};

/**
 * Recalculate one account's balance from its payments and save it.
 * Safe to call any number of times: the result is always the same.
 */
export const recalculateAccountBalance = async (id) => {
  const { accounts, payments } = await loadAccountsAndPayments();
  const account = accounts.find((a) => a.id === id);
  if (!account) return 0;

  const balance = calculateBalance(account, payments);
  await updateDoc(doc(db, "accounts", id), { currentBalance: balance });
  return balance;
};

/**
 * Recalculate every account and save the result. Run this once to repair
 * balances that are already wrong (for example the -50k account).
 */
export const recalculateAllAccountBalances = async () => {
  const { accounts, payments } = await loadAccountsAndPayments();
  await Promise.all(
    accounts.map((account) =>
      updateDoc(doc(db, "accounts", account.id), {
        currentBalance: calculateBalance(account, payments),
      })
    )
  );
};

/**
 * Old helper, kept so existing imports don't break. It logs every call with
 * its caller, so you can find and remove the code that still uses it.
 * The balances shown by getAccounts no longer depend on it.
 */
export const adjustAccountBalance = async (id, delta) => {
  console.trace("adjustAccountBalance called (remove this call)", { id, delta });

  const accountRef = doc(db, "accounts", id);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(accountRef);
    if (!snap.exists()) throw new Error("Account not found");
    const current = snap.data().currentBalance || 0;
    transaction.update(accountRef, { currentBalance: current + delta });
  });
};