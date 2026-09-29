import { useState, useEffect, useCallback } from "react";
import {getCustomers} from '../services/customerService'


export function useCustomers() {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getCustomers();
            setCustomers(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch Customers:", err);
            setError("Failed to load customers. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { customers, setCustomers, isLoading, error, refetch };
}