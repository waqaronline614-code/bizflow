import { FiPlus } from "react-icons/fi";
import AddOrderModal from "../components/Orders/AddOrderModal";
import OrderTable from "../components/Orders/OrdersTable";
import OrderViewModal from "../components/Orders/OrderViewModal";
import DeleteModal from "../components/common/DeleteModal";
import { useEffect, useMemo, useState } from "react";
import { getCustomers } from "../services/customerService";
import { getProducts } from "../services/productService";
import { getPurchase } from "../services/purchaseService";
import { getPaymentsByRelated } from "../services/paymentsService";
import {
    addOrder,
    getOrders,
    updateOrder,
    deleteOrder,
} from "../services/orderService";

function Orders() {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [purchases, setPurchases] = useState([]);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    // View
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingOrder, setViewingOrder] = useState(null);

    const handleIsModalOpen = () => setIsAddModalOpen(true);

    const handleIsModalClose = () => {
        setIsAddModalOpen(false);
        setEditingOrder(null);
        setIsEditing(false);
    };

    // Fetch customers, products, and orders

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setIsLoading(true);

                const [customersData, productsData, ordersData, purchaseData] = await Promise.all([
                    getCustomers(),
                    getProducts(),
                    getOrders(),
                    getPurchase()
                ]);
                setCustomers(customersData);
                setProducts(productsData);
                setOrders(ordersData);
                setPurchases(purchaseData)
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAll();
    }, []);

    // --------------------------------
    // Pagination
    // --------------------------------

    const [currentPage, setCurrentPage] = useState(1);

    const ordersPerPage = 6;

    const totalPages = Math.ceil(
        orders.length / ordersPerPage
    );

    const paginatedOrders = useMemo(() => {
        const startIndex =
            (currentPage - 1) * ordersPerPage;

        return orders.slice(
            startIndex,
            startIndex + ordersPerPage
        );
    }, [orders, currentPage]);

    // --------------------------------
    // Save (Add / Update)
    // --------------------------------

    const saveOrders = async (orderData) => {
        try {
            if (isEditing && editingOrder) {
                const updatedOrder = await updateOrder(editingOrder.id, orderData, editingOrder.items);

                setOrders((prev) =>
                    prev.map((order) =>
                        order.id === editingOrder.id
                            ? updatedOrder
                            : order
                    )
                );

                const updatedProducts = await getProducts();
                setProducts(updatedProducts);

                setIsEditing(false);
                setEditingOrder(null);
            } else {
                const newOrder = await addOrder(orderData);

                setOrders((prev) => [
                    newOrder,
                    ...prev,
                ]);

                const updatedProducts = await getProducts();
                setProducts(updatedProducts);

                setCurrentPage(1);
            }
        } catch (err) {
            console.error("Failed to save order:", err);
            setError("Failed to save order. Please try again.");
        } finally {
            setIsAddModalOpen(false);
        }
    };

    // --------------------------------
    // Edit
    // --------------------------------

    const handleEditOrder = async (order) => {
        try {
            const linkedPayments = await getPaymentsByRelated(order.id, "order");
            const paymentMethod = linkedPayments.length > 0 ? linkedPayments[0].method : "Cash";
            setEditingOrder({ ...order, paymentMethod });
        } catch (err) {
            console.error("Failed to fetch payment method:", err);
            setEditingOrder(order);
        }
        setIsEditing(true);
        setIsAddModalOpen(true);
    };

    // --------------------------------
    // View
    // --------------------------------

    const handleViewOrder = (order) => {
        setViewingOrder(order);
        setIsViewModalOpen(true);
    };

    // --------------------------------
    // Delete
    // --------------------------------

    const handleDeleteOrder = (order) => {
        setOrderToDelete(order);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteOrder = async () => {
        try {
            await deleteOrder(orderToDelete.id, orderToDelete.items);

            setOrders((prev) =>
                prev.filter((order) => order.id !== orderToDelete.id)
            );

            const updatedProducts = await getProducts();
            setProducts(updatedProducts);

            setCurrentPage(1);
        } catch (err) {
            console.error("Failed to delete order:", err);
            setError("Failed to delete order. Please try again.");
        } finally {
            setOrderToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Orders
                    </h1>
                </div>

                <button
                    className="mt-4 md:mt-0 flex items-center gap-2
                     bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
                    onClick={handleIsModalOpen}
                >
                    <FiPlus />
                    Add Order
                </button>
            </div>

            {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                    {error}
                </div>
            )}

            {isLoading ? (
                <p className="text-red-500 flex justify-center">Loading orders...</p>
            ) : (
                <OrderTable
                    orders={paginatedOrders}
                    customers={customers}
                    onView={handleViewOrder}
                    onEdit={handleEditOrder}
                    onDelete={handleDeleteOrder}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalOrders={orders.length}
                    ordersPerPage={ordersPerPage}
                    onPageChange={setCurrentPage}
                />
            )}

            <AddOrderModal
                isOpen={isAddModalOpen}
                onClose={handleIsModalClose}
                isEdit={isEditing}
                editingOrder={editingOrder}
                customers={customers}
                products={products}
                purchases={purchases}
                onAddOrder={saveOrders}
            />

            <OrderViewModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setViewingOrder(null);
                }}
                order={viewingOrder}
                customers={customers}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setOrderToDelete(null);
                }}
                onConfirm={confirmDeleteOrder}
                title="Delete Order"
                message={`Are you sure you want to delete order "${orderToDelete?.orderNo || `#${orderToDelete?.id}`}"?`}
            />
        </div>
    );
}

export default Orders;