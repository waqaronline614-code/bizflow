import { useState, useEffect, useCallback } from "react";
import { getPayments } from "../services/paymentsService";

export function usePayments(type) {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getPayments(type);
            setPayments(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch payments:", err);
            setError("Failed to load payments. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [type]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { payments, setPayments, isLoading, error, refetch };
}