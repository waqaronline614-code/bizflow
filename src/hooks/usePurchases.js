import { useState, useEffect, useCallback } from "react";
import { getPurchase } from "../services/purchaseService";

/**
 * Loads and manages the purchases list.
 * Same shape as useProducts/useOrders so pages can use them consistently.
 */
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

    return { purchases, setPurchases, isLoading, error, refetch };
}