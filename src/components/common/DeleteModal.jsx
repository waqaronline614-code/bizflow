import { FiTrash2 } from "react-icons/fi";

function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Customer",
    message = "Are you sure you want to delete this customer?",
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}

                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-3xl text-slate-400 hover:text-red-500 transition"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}

                <div className="p-6 flex flex-col items-center text-center">

                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <FiTrash2 className="text-red-600 text-3xl" />
                    </div>

                    <p className="text-slate-600">
                        {message}
                    </p>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-4 px-6 py-5 border-t border-slate-200">

                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
                    >
                        Delete
                    </button>

                </div>
            </div>
        </div>
    );
}

export default DeleteModal;