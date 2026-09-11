import { useState, useEffect, useCallback } from "react";
import { getProducts } from "../services/productService";

/**
 * Loads and manages the products list.
 * Handles loading/error state and gives back a `refetch` function
 * to call after anything (purchase, order, product edit) changes stock.
 */
export function useProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError("Failed to load products. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { products, setProducts, isLoading, error, refetch };
}