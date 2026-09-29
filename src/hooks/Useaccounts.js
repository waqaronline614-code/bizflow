import { useState, useEffect, useCallback } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase"; // same path your services use
import { getAccounts } from "../services/Accountsservice";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live listener: any change to an account (expense, payment, capital...)
  // updates every component that uses this hook, no manual refresh needed.
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "accounts"),
      (snap) => {
        setAccounts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load accounts:", err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Kept so existing callers of refresh() still work
  const refresh = useCallback(async () => {
    try {
      setAccounts(await getAccounts());
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const totalCash = accounts
    .filter((a) => a.type === "cash")
    .reduce((sum, a) => sum + (a.currentBalance || 0), 0);

  const totalBank = accounts
    .filter((a) => a.type === "bank")
    .reduce((sum, a) => sum + (a.currentBalance || 0), 0);

  // No longer needed with the live listener; kept so nothing that calls it breaks
  const applyLocalDelta = (accountId, delta) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === accountId
          ? { ...a, currentBalance: (a.currentBalance || 0) + delta }
          : a
      )
    );
  };

  return { accounts, loading, error, refresh, totalCash, totalBank, applyLocalDelta };
};