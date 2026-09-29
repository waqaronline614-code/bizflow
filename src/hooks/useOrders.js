import { useCallback, useEffect, useMemo, useState } from "react";
import { useCustomers } from "./useCustomer";
import { useProducts } from "./useProducts";
import { usePurchases } from "./usePurchases";
import { usePayments } from "./usePayments";
import { addOrder, getOrders, updateOrder, deleteOrder } from "../services/orderService";

const ORDERS_PER_PAGE = 6;

export function useOrders() {
    const { customers, isLoading: customersLoading, error: customersError } = useCustomers();
    const { products, isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts();
    const { purchases, isLoading: purchasesLoading, error: purchasesError } = usePurchases();
    const { fetchByRelated } = usePayments();

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);

    // --------------------------------
    // Load orders — pulled out so it can also be called manually
    // (e.g. from ReceivedPayments, after a payment changes an order's balance)
    // --------------------------------
    const refetchOrders = useCallback(async () => {
        try {
            setOrdersLoading(true);
            const data = await getOrders();
            setOrders(data);
            setOrdersError(null);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setOrdersError("Failed to load orders. Please try again.");
        } finally {
            setOrdersLoading(false);
        }
    }, []);

    useEffect(() => {
        refetchOrders();
    }, [refetchOrders]);

    const isLoading = customersLoading || productsLoading || purchasesLoading || ordersLoading;
    const error = customersError || productsError || purchasesError || ordersError;

    // --------------------------------
    // Pagination
    // --------------------------------
    const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
        return orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
    }, [orders, currentPage]);

    // --------------------------------
    // Save (Add / Update)
    // --------------------------------
    const saveOrder = async (orderData, editingOrder) => {
        try {
            if (editingOrder) {
                const updatedOrder = await updateOrder(
                    editingOrder.id,
                    orderData,
                    editingOrder.items
                );

                setOrders((prev) =>
                    prev.map((order) =>
                        order.id === editingOrder.id ? updatedOrder : order
                    )
                );
            } else {
                const newOrder = await addOrder(orderData);
                setOrders((prev) => [newOrder, ...prev]);
                setCurrentPage(1);
            }

            // stock changed either way -- refresh products
            await refetchProducts();

            return true;
        } catch (err) {
            console.error("Failed to save order:", err);
            setOrdersError("Failed to save order. Please try again.");
            return false;
        }
    };

    // --------------------------------
    // Edit — fetch the linked payment method before opening the modal,
    // since the order doc itself has no paymentMethod field
    // --------------------------------
    const getOrderForEdit = async (order) => {
        const linkedPayments = await fetchByRelated(order.id, "order");
        const paymentMethod = linkedPayments.length > 0 ? linkedPayments[0].method : "Cash";
        return { ...order, paymentMethod };
    };

    // --------------------------------
    // Delete
    // --------------------------------
    const removeOrder = async (order) => {
        try {
            await deleteOrder(order.id, order.items);

            setOrders((prev) => prev.filter((o) => o.id !== order.id));

            await refetchProducts();

            setCurrentPage(1);
            return true;
        } catch (err) {
            console.error("Failed to delete order:", err);
            setOrdersError("Failed to delete order. Please try again.");
            return false;
        }
    };

    return {
        isLoading,
        error,
        customers,
        products,
        purchases,
        orders: paginatedOrders,
        allOrders: orders, // unpaginated — needed by pages that just need the raw list (e.g. ReceivedPayments)
        totalOrders: orders.length,
        ordersPerPage: ORDERS_PER_PAGE,
        currentPage,
        totalPages,
        setCurrentPage,
        saveOrder,
        getOrderForEdit,
        removeOrder,
        refetchOrders,
    };
}