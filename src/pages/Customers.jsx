import { FiPlus, FiSearch } from "react-icons/fi";
import CustomerTable from '../components/customers/CustomerTable'

function Customers() {
  return (
    <div>

      {/* Heading */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Customers
          </h1>
        </div>

        <button className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition">
          <FiPlus />
          Add Customer
        </button>

      </div>
        <CustomerTable />
    </div>
  );
}

export default Customers;