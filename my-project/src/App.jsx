import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaWindowClose } from "react-icons/fa";
import { PieChart } from "@mui/x-charts/PieChart";
import { publicRequest } from "./requestMethod";

function App() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatedId, setUpdatedId] = useState("");
  const [updatedLabel, setUpdatedLabel] = useState("");
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");

  const handleAddExpense = () => setShowAddExpense(!showAddExpense);
  const handleShowReport = () => setShowReport(!showReport);
  const handleShowEdit = (id) => {
    setShowEdit(true);
    setUpdatedId(id);
  };

  const handleExpense = async () => {
    try {
      await publicRequest.post("/expenses", {
        label,
        date,
        value: amount,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateExpense = async () => {
    try {
      await publicRequest.put(`/expenses/${updatedId}`, {
        label: updatedLabel,
        value: updatedAmount,
        date: updatedDate,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/expenses/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await publicRequest.get("/expenses");
        const data = res.data.expenses || [];
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error.message);
      }
    };
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 min-h-screen py-10 px-4 transition-all duration-300">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-cyan-400 animate-pulse">
          💸 Expense Tracker
        </h1>

        {/* Top Controls */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex gap-4">
            <button
              onClick={handleAddExpense}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition-all duration-300 shadow-lg"
            >
              ➕ Add Expense
            </button>
            <button
              onClick={handleShowReport}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-all duration-300 shadow-lg"
            >
              📊 Expense Report
            </button>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="p-2 w-48 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Add Expense Form */}
        {showAddExpense && (
          <div className="bg-gray-800 p-6 rounded-md mb-6 relative shadow-xl animate-fade-in">
            <FaWindowClose
              className="absolute top-4 right-4 cursor-pointer text-xl text-red-400"
              onClick={handleAddExpense}
            />
            <h2 className="text-2xl font-bold mb-4 text-pink-300">
              ➕ New Expense
            </h2>
            <input
              type="text"
              placeholder="Expense name"
              className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
              onChange={(e) => setLabel(e.target.value)}
            />
            <input
              type="date"
              className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white"
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              onClick={handleExpense}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
            >
              ✅ Submit
            </button>
          </div>
        )}

        {/* Edit Expense Form */}
        {showEdit && (
          <div className="bg-gray-800 p-6 rounded-md mb-6 relative shadow-xl animate-fade-in">
            <FaWindowClose
              className="absolute top-4 right-4 cursor-pointer text-xl text-red-400"
              onClick={() => setShowEdit(false)}
            />
            <h2 className="text-2xl font-bold mb-4 text-yellow-300">
              ✏️ Edit Expense
            </h2>
            <input
              type="text"
              placeholder="Expense name"
              className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
              onChange={(e) => setUpdatedLabel(e.target.value)}
            />
            <input
              type="date"
              className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
              onChange={(e) => setUpdatedDate(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white"
              onChange={(e) => setUpdatedAmount(e.target.value)}
            />
            <button
              onClick={handleUpdateExpense}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-md"
            >
              💾 Update
            </button>
          </div>
        )}

        {/* Pie Chart Report */}
        {showReport && (
          <div className="bg-gray-800 p-6 rounded-md mb-6 shadow-lg relative animate-fade-in">
            <FaWindowClose
              className="absolute top-4 right-4 cursor-pointer text-xl text-red-400"
              onClick={handleShowReport}
            />
            <PieChart
              series={[
                {
                  data: filteredExpenses.map((item, index) => ({
                    id: index,
                    value: item.value,
                    label: item.label,
                    color: `hsl(${index * 45}, 70%, 60%)`,
                  })),
                  innerRadius: 40,
                  outerRadius: 100,
                },
              ]}
              width={400}
              height={300}
              sx={{ backgroundColor: "#1f2937", borderRadius: 8 }}
            />
          </div>
        )}

        {/* Expenses List */}
        <div className="space-y-4">
          {filteredExpenses.map((item) => (
            <div
              key={item._id}
              className="bg-gray-700 flex justify-between items-center p-4 rounded-md shadow-md animate-slide-up"
            >
              <div>
                <h3 className="text-lg font-semibold text-cyan-300">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-400">{item.date}</p>
              </div>
              <span className="text-lg font-bold text-green-400">
                ${item.value}
              </span>
              <div className="flex gap-3">
                <FaEdit
                  className="cursor-pointer text-yellow-400 hover:scale-110 transition-transform"
                  onClick={() => handleShowEdit(item._id)}
                />
                <FaTrash
                  className="cursor-pointer text-red-500 hover:scale-110 transition-transform"
                  onClick={() => handleDelete(item._id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
