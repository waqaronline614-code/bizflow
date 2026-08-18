import { FiPlus } from "react-icons/fi";
import { useMemo, useState } from "react";

import ProductTable from "../components/products/ProductTable";
import AddProductModal from "../components/products/AddProductModal";
import DeleteModal from "../components/common/DeleteModal";

function Products() {
 const initialProducts = [
  {
    id: 1,
    productName: "Dell Mouse",
    category: "Accessories",
    supplier: "ABC Traders",
    purchasePrice: 1200,
    sellingPrice: 1600,
    stock: 45,
    status: "In Stock",
  },
];

  const [products, setProducts] = useState(initialProducts);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [productToDelete, setProductToDelete] = useState(null);
  

  // Pagination

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 3;

  const totalPages = Math.ceil(
    products.length / productsPerPage
  );

  const paginatedProducts = useMemo(() => {
    const startIndex =
      (currentPage - 1) * productsPerPage;

    return products.slice(
      startIndex,
      startIndex + productsPerPage
    );
  }, [products, currentPage]);

  // Delete

  const handleDelete = (product) => { 
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = () => {
    setProducts((prev) =>
      prev.filter(
        (product) =>product.id !== productToDelete.id
      )
    );

    setCurrentPage(1);

    setProductToDelete(null);

    setIsDeleteModalOpen(false);
  };

  // Edit

  const handleEditProduct = (product) => {
    setEditingProduct(product);

    setIsEditMode(true);

    setIsModalOpen(true);
  };

  // Save

  const saveProduct = (productData) => {
    if (isEditMode) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? {
              ...product,
              ...productData,
            }
            : product
        )
      );

      setIsEditMode(false);

      setEditingProduct(null);
    } else {
      setProducts((prev) => [
        {
          id: Date.now(),
          ...productData,
        },
        ...prev,
       ]);

      setCurrentPage(1);
    }

    setIsModalOpen(false);
  };

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