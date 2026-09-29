import { useState, useEffect, useCallback } from "react";
import { getPurchase } from "../services/purchaseService";

export function usePurchases() {
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getPurchase();
            setPurchases(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch purchases:", err);
            setError("Failed to load purchases. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return {
        purchases,
        setPurchases,
        allPurchases: purchases, // alias — MadePayments.jsx reads the raw list under this name
        isLoading,
        error,
        refetch,
        refetchPurchases: refetch, // alias — MadePayments.jsx calls this after a payment changes a purchase's balance
    };
}