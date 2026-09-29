import { useCallback, useEffect, useState } from "react";
import { getSuppliers } from "../services/supplierService";

export function useSuppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSuppliers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getSuppliers();
            setSuppliers(data);
        } catch (err) {
            console.error("Failed to fetch suppliers:", err);
            setError("Failed to load suppliers. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    return {
        suppliers,
        isLoading,
        error,
        refetch: fetchSuppliers,
    };
}