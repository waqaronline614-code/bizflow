import { FiPlus, FiSearch } from "react-icons/fi";
import CustomerTable from '../components/customers/CustomerTable'
import AddCustomerModal from "../components/customers/AddCustomerModal";
import { useState } from "react";

function Customers() {

  const [isModalOpen, setIsModalOpen] = useState(false);
    const initialCustomers = [
  {
    id: 1,
    name: "Ali Khan",
    phone: "+92 300 1234567",
    email: "ali@gmail.com",
    address: "Peshawar",
    status: "Active",
  },
];
  const [customers, setCustomers] = useState(initialCustomers);
  const addCustomer =
   (newCustomer) => { 
                      setCustomers((prev) => [
                      {
                          id: Date.now(),
                            ...newCustomer,
                        },
                          ...prev,
                              ]);
                     };
   
  return (
    <div>

      {/* Heading */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Customers
          </h1>
        </div>

        <button className="mt-4 md:mt-0 flex items-center gap-2
         bg-blue-600 hover:bg-blue-700 text-white px-5
          py-3 rounded-xl transition" onClick={()=>setIsModalOpen(true)}
          >
          <FiPlus />
          Add Customer
        </button>

      </div>
        <CustomerTable 
         customers ={customers} />
        <AddCustomerModal
         isOpen = {isModalOpen}
         onClose={()=>setIsModalOpen(false)}
         onAddCustomer={addCustomer}
         />
    </div>
  );
}

export default Customers;