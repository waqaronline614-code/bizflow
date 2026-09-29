import { useCallback, useEffect, useState } from "react";
import {
  getExpenses, addExpense, updateExpense, deleteExpense,
} from "../services/expensesService"; // adjust path

// One hook per entity, same pattern as your purchase/order hooks
export default function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setExpenses(await getExpenses());
      setError(null);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async (data) => { await addExpense(data); await load(); };
  const update = async (id, data) => { await updateExpense(id, data); await load(); };
  const remove = async (id) => { await deleteExpense(id); await load(); };

  return { expenses, loading, error, create, update, remove, reload: load };
}