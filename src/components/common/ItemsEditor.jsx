import { useForm } from "react-hook-form";
import { FiCheck, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useState } from "react";

function ItemsEditor({
    items,
    products,
    append,
    update,
    remove,
    priceField,
    priceLabel = "Price",
    onItemsChanged,
    getAvailableStock,
}) {
    const {
        register: registerDraft,
        watch: watchDraft,
        trigger: triggerDraft,
        getValues: getDraftValues,
        setValue: setDraftValue,
        reset: resetDraft,
        formState: { errors: draftErrors },
    } = useForm({
        defaultValues: {
            productId: "",
            quantity: "",
            [priceField]: "",
            disPrice: "",
        },
    });

    const [editingIndex, setEditingIndex] = useState(null);

    const draftProductId = watchDraft("productId");
    const draftQuantity = watchDraft("quantity");
    const draftPrice = watchDraft(priceField);
    const draftDisPrice = watchDraft("disPrice");

    const safeNum = (value) => {
        const num = Number(value);
        return Number.isNaN(num) ? 0 : num;
    };

    const draftAvailableStock =
        getAvailableStock && draftProductId
            ? getAvailableStock(draftProductId, editingIndex)
            : null;

    const clearDraft = () => {
        resetDraft({
            productId: "",
            quantity: "",
            [priceField]: "",
            disPrice: "",
        });
        setEditingIndex(null);
    };

    const handleProductChange = (e) => {
        const productId = e.target.value;
        const selected = products.find(
            (p) => String(p.id) === String(productId)
        );

        if (selected) {
            const priceFromProduct =
                priceField === "purchasePrice"
                    ? selected.purchasePrice
                    : selected.sellingPrice;

            setDraftValue(priceField, priceFromProduct ?? "", {
                shouldValidate: true,
            });
            setDraftValue("quantity", 1, { shouldValidate: true });
            setDraftValue("disPrice", 0, { shouldValidate: true });
        } else {
            setDraftValue(priceField, "");
            setDraftValue("quantity", "");
            setDraftValue("disPrice", 0);
        }
    };

    const startEdit = (index) => {
        const item = items[index];
        resetDraft({
            productId: item.productId || "",
            quantity: item.quantity || "",
            [priceField]: item[priceField] || "",
            disPrice: item.disPrice || 0,
        });
        setEditingIndex(index);
    };

    const addItem = async () => {
        const valid = await triggerDraft();
        if (!valid) return;

        const values = getDraftValues();
        const product = products.find(
            (p) => String(p.id) === String(values.productId)
        );
        if (!product) return;

        const quantity = safeNum(values.quantity);
        const price = safeNum(values[priceField]);
        const disPrice = safeNum(values.disPrice);

        const subTotal = quantity * price;
        const disAmount = (subTotal * disPrice) / 100;

        const itemData = {
            id: editingIndex !== null ? items[editingIndex].id : Date.now(),
            productId: values.productId,
            productName: product?.productName || "",
            unit: product?.unit || "Piece",
            quantity,
            [priceField]: price,
            disPrice,
            amount: subTotal - disAmount,
        };

        if (editingIndex !== null) {
            update(editingIndex, itemData);
            setEditingIndex(null);
        } else {
            append(itemData);
        }

        clearDraft();
        onItemsChanged?.();
    };

    const handleQuantityKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addItem();
        }
    };

    const deleteItem = (index) => {
        remove(index);
        if (editingIndex === index) clearDraft();
    };

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 min-w-[210px]">
                                Product
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                Quantity
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                {priceLabel}
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                Disc.
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                Amount
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* SAVED ITEMS */}
                        {items.map((item, index) => (
                            <tr key={item.id} className="border-b border-slate-100">
                                <td className="px-4 py-3 text-sm text-slate-700">
                                    {item.productName}
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-slate-700">
                                    {item.quantity} {item.unit}
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-slate-700">
                                    Rs. {safeNum(item[priceField]).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-slate-700">
                                    {item.disPrice} %
                                </td>
                                <td className="px-4 py-3 text-center font-semibold text-slate-800">
                                    Rs. {safeNum(item.amount).toLocaleString()}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            type="button"
                                            className="p-2 rounded-lg text-green-600 hover:bg-green-50"
                                            onClick={() => startEdit(index)}
                                        >
                                            <FiEdit2 size={17} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteItem(index)}
                                            className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                                        >
                                            <FiTrash2 size={17} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {/* DRAFT / NEW ITEM ROW */}
                        <tr className="bg-slate-50">
                            <td className="px-4 py-3">
                                <select
                                    {...registerDraft("productId", {
                                        required: "Select a product",
                                        onChange: handleProductChange,
                                    })}
                                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Product</option>
                                    {products.map((product) => {
                                        if (!getAvailableStock) {
                                            return (
                                                <option key={product.id} value={product.id}>
                                                    {product.productName}
                                                </option>
                                            );
                                        }
                                        const available = getAvailableStock(
                                            product.id,
                                            editingIndex
                                        );
                                        return (
                                            <option
                                                key={product.id}
                                                value={product.id}
                                                disabled={available <= 0}
                                            >
                                                {product.productName}
                                                {available <= 0
                                                    ? " (Out of stock)"
                                                    : ` — ${available} in stock`}
                                            </option>
                                        );
                                    })}
                                </select>
                                {draftErrors.productId && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {draftErrors.productId.message}
                                    </p>
                                )}
                            </td>

                            <td className="px-4 py-3">
                                <input
                                    type="number"
                                    min="1"
                                    {...registerDraft("quantity", {
                                        required: "Required",
                                        min: { value: 1, message: "Min 1" },
                                        validate: (value) => {
                                            if (!getAvailableStock) return true;
                                            const productId = watchDraft("productId");
                                            if (!productId) return true;
                                            const available = getAvailableStock(
                                                productId,
                                                editingIndex
                                            );
                                            return (
                                                safeNum(value) <= available ||
                                                `Only ${available} available`
                                            );
                                        },
                                    })}
                                    onKeyDown={handleQuantityKeyDown}
                                    placeholder="0"
                                    className="w-24 h-10 mx-auto block px-3 rounded-lg border border-slate-300 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {getAvailableStock && draftProductId && (
                                    <p
                                        className={`text-xs mt-1 text-center ${
                                            draftAvailableStock <= 0
                                                ? "text-red-500"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        {draftAvailableStock <= 0
                                            ? "Out of stock"
                                            : `${draftAvailableStock} available`}
                                    </p>
                                )}
                                {draftErrors.quantity && (
                                    <p className="text-xs text-red-500 mt-1 text-center">
                                        {draftErrors.quantity.message}
                                    </p>
                                )}
                            </td>

                            <td className="px-4 py-3">
                                <input
                                    type="number"
                                    min="0"
                                    {...registerDraft(priceField, {
                                        required: `${priceLabel} is required`,
                                        min: { value: 0, message: "Min 0" },
                                    })}
                                    placeholder="0"
                                    className="w-28 h-10 mx-auto block px-3 rounded-lg border border-slate-300 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {draftErrors[priceField] && (
                                    <p className="text-xs text-red-500 mt-1 text-center">
                                        {draftErrors[priceField].message}
                                    </p>
                                )}
                            </td>

                            <td className="px-4 py-3 text-center">
                                <div className="relative w-24 mx-auto">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.5"
                                        {...registerDraft("disPrice", {
                                            min: { value: 0, message: "Min 0" },
                                            max: { value: 100, message: "Max 100" },
                                        })}
                                        placeholder="0"
                                        className="w-full h-10 px-3 pr-7 rounded-lg border border-slate-300 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                                        %
                                    </span>
                                </div>
                                {draftErrors.disPrice && (
                                    <p className="text-xs text-red-500 mt-1 text-center">
                                        {draftErrors.disPrice.message}
                                    </p>
                                )}
                            </td>

                            <td className="px-4 py-3 text-center font-semibold text-slate-700">
                                Rs.{" "}
                                {(() => {
                                    const subtotal =
                                        safeNum(draftQuantity) * safeNum(draftPrice);
                                    const disAmount =
                                        subtotal * (safeNum(draftDisPrice) / 100);
                                    return (subtotal - disAmount).toLocaleString();
                                })()}
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="p-2 rounded-lg text-green-600 hover:bg-green-100 transition"
                                        title={editingIndex !== null ? "Update item" : "Add item"}
                                    >
                                        <FiCheck size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearDraft}
                                        className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition"
                                        title="Clear"
                                    >
                                        <FiX size={20} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ItemsEditor;