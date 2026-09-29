import { FiEdit2, FiTrash2 } from "react-icons/fi";

function AccountTable({
  accounts,
  onEditAccount,
  onDeleteAccount,
  currentPage,
  totalPages,
  totalAccounts,
  accountsPerPage,
  onPageChange,
}) {

  const startIndex = (currentPage - 1) * accountsPerPage;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-sm">
          <tr>
            <th className="px-5 py-3 font-medium">Account</th>
            <th className="px-5 py-3 font-medium">Type</th>
            <th className="px-5 py-3 font-medium text-right">Opening Balance</th>
            <th className="px-5 py-3 font-medium text-right">Current Balance</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {accounts.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                No Account added yet.
              </td>
            </tr>
          ) : (
            accounts.map((account) => (
              <tr key={account.id} className="text-sm text-slate-700">
                <td className="px-5 py-3 font-medium text-slate-800">{account.name}</td>
                <td className="px-5 py-3 capitalize">{account.type}</td>
                <td className="px-5 py-3 text-right">
                  {Number(account.openingBalance || 0).toLocaleString()}
                </td>
                <td
                  className={`px-5 py-3 text-right font-semibold ${
                    account.currentBalance <=0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {Number(account.currentBalance || 0).toLocaleString()}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onEditAccount(account)}
                       className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteAccount(account)}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalAccounts > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 text-sm text-slate-500">
          <span>
            Showing {startIndex + 1}-{Math.min(startIndex + accountsPerPage, totalAccounts)} of{" "}
            {totalAccounts}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountTable;