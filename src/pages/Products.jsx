import { FiPlus } from "react-icons/fi";
import { useMemo, useState } from "react";

import ProductTable from "../components/products/ProductTable";
import AddProductModal from "../components/products/AddProductModal";
import DeleteModal from "../components/common/DeleteModal";

import { useProducts } from "../hooks/useProducts";
import { addProduct, updateProduct, deleteProduct } from "../services/productService";

function Products() {
  // All fetching/loading/error/refetch logic now lives in this one hook.
  const { products, setProducts, isLoading, error: fetchError, refetch } = useProducts();

  const [saveError, setSaveError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Pagination

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return products.slice(startIndex, startIndex + productsPerPage);
  }, [products, currentPage]);

  // Delete

  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((product) => product.id !== productToDelete.id));
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to delete product:", error);
      setSaveError("Failed to delete product. Please try again.");
    } finally {
      setProductToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  // Edit

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Save

  const saveProduct = async (productData) => {
    try {
      if (isEditMode) {
        await updateProduct(editingProduct.id, productData);

        setProducts((prev) =>
          prev.map((product) =>
            product.id === editingProduct.id
              ? { ...product, ...productData }
              : product
          )
        );

        setIsEditMode(false);
        setEditingProduct(null);
      } else {
        const newId = await addProduct(productData);

        setProducts((prev) => [{ id: newId, stock: 0, ...productData }, ...prev]);

        // A fresh fetch keeps this in sync with whatever the server set
        // (e.g. stock: 0, createdAt) rather than guessing it locally.
        await refetch();

        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Failed to save product:", error);
      setSaveError("Failed to save product. Please try again.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const error = fetchError || saveError;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Products
          </h1>
        </div>

        <button
          className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
          onClick={() => {
            setEditingProduct(null);
            setIsEditMode(false);
            setIsModalOpen(true);
          }}
        >
          <FiPlus />
          Add Product
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-red-500 flex justify-center">Loading products...</p>
      ) : (
        <ProductTable
          products={paginatedProducts}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          totalProducts={products.length}
          productsPerPage={productsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          setIsEditMode(false);
        }}
        onAddProduct={saveProduct}
        editingProduct={editingProduct}
        isEditMode={isEditMode}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.productName}"?`}
      />
    </div>
  );
}

export default Products;