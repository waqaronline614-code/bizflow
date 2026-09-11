import { useState, useEffect, useCallback } from "react";
import { getOrders } from "../services/orderService";

/**
 * Loads and manages the orders list.
 * Same shape as useProducts/usePurchases so pages can use them consistently.
 */
export function useOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getOrders();
            setOrders(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setError("Failed to load orders. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { orders, setOrders, isLoading, error, refetch };
}