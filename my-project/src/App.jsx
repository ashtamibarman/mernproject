import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaPlus, FaChartPie } from "react-icons/fa";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";

const BACKEND_URL = "https://backend-project-mpxb.onrender.com";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/expenses`, {
        withCredentials: true,
      });
      console.log("Backend expenses response:", res.data);

      const allExpenses = res.data.expenses || [];
      allExpenses.forEach((e, i) => console.log(`Expense #${i + 1}:`, e));

      setExpenses(allExpenses);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchExpenses();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/login`, form, {
        withCredentials: true,
      });
      console.log("Login successful:", res.data);
      setIsLoggedIn(true);
      fetchExpenses();
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/signup`, form, {
        withCredentials: true,
      });
      setIsLoggedIn(true);
      fetchExpenses();
    } catch (err) {
      alert("Signup failed");
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setIsLoggedIn(false);
      setExpenses([]);
      setForm({ username: "", password: "" });
    } catch (err) {
      alert("Logout failed");
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!label || !amount || !date) {
      alert("Please fill all fields");
      return;
    }

    const data = { label, value: Number(amount), date };
    console.log("Saving:", data);

    try {
      if (editId) {
        await axios.put(`${BACKEND_URL}/expenses/${editId}`, data, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${BACKEND_URL}/expenses`, data, {
          withCredentials: true,
        });
      }
      resetForm();
      fetchExpenses();
    } catch (error) {
      alert("Error saving expense");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Missing ID, cannot delete.");
      return;
    }

    try {
      await axios.delete(`${BACKEND_URL}/expenses/${id}`, {
        withCredentials: true,
      });
      fetchExpenses();
    } catch (err) {
      alert("Error deleting expense");
      console.error(err);
    }
  };

  const handleEdit = (expense) => {
    setLabel(expense.label);
    setAmount(expense.value);
    setDate(expense.date);
    setEditId(expense._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setLabel("");
    setAmount("");
    setDate("");
    setEditId(null);
    setShowForm(false);
  };

  const filtered = expenses.filter((e) =>
    e.label.toLowerCase().includes(search.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">
        <form
          onSubmit={authMode === "signup" ? handleSignup : handleLogin}
          className="bg-zinc-800 p-6 rounded-lg w-full max-w-sm"
        >
          <h2 className="text-2xl mb-4 text-center text-teal-300">
            {authMode === "signup" ? "Sign Up" : "Login"}
          </h2>
          <input
            className="w-full p-2 mb-3 bg-zinc-700 rounded"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            className="w-full p-2 mb-3 bg-zinc-700 rounded"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="bg-blue-500 w-full py-2 rounded hover:bg-blue-600">
            {authMode === "signup" ? "Sign Up" : "Login"}
          </button>
          <p className="text-sm mt-4 text-center">
            {authMode === "signup"
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <span
              onClick={() =>
                setAuthMode(authMode === "signup" ? "login" : "signup")
              }
              className="text-teal-400 underline cursor-pointer"
            >
              {authMode === "signup" ? "Login" : "Sign Up"}
            </span>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>

      <h1 className="text-4xl text-center text-teal-400 mb-6 font-bold">
        Expense Tracker
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          className="bg-green-600 px-4 py-2 rounded flex items-center gap-2"
          onClick={() => setShowForm(!showForm)}
        >
          <FaPlus />
          {editId ? "Edit" : "Add"} Expense
        </button>
        <button
          className="bg-purple-600 px-4 py-2 rounded flex items-center gap-2"
          onClick={() => setShowReport(!showReport)}
        >
          <FaChartPie />
          Report
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-800 p-4 mb-6 rounded max-w-md mx-auto">
          <input
            className="w-full p-2 mb-3 bg-zinc-700 rounded"
            placeholder="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <input
            className="w-full p-2 mb-3 bg-zinc-700 rounded"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
          />
          <input
            className="w-full p-2 mb-3 bg-zinc-700 rounded"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            className="bg-blue-500 w-full py-2 rounded"
            onClick={handleSave}
          >
            {editId ? "Update" : "Submit"}
          </button>
          <button
            className="mt-2 w-full py-2 rounded bg-gray-600 hover:bg-gray-700"
            onClick={resetForm}
          >
            Cancel
          </button>
        </div>
      )}

      {showReport && (
        <div className="mb-6 max-w-md mx-auto">
          <PieChart
            series={[
              {
                data: filtered.map((e, i) => ({
                  id: e._id || i,
                  value: e.value,
                  label: e.label,
                  color: `hsl(${i * 40}, 70%, 60%)`,
                })),
                innerRadius: 30,
                outerRadius: 100,
              },
            ]}
            width={400}
            height={250}
          />
        </div>
      )}

      <input
        className="w-full max-w-md p-2 mb-4 bg-zinc-700 rounded block mx-auto"
        placeholder="Search by label"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-4 max-w-md mx-auto">
        {filtered.map((item) => (
          <div
            key={item._id || item.label}
            className="bg-zinc-800 p-4 flex justify-between items-center rounded"
          >
            <div>
              <h3 className="text-xl font-bold">{item.label}</h3>
              <p className="text-sm text-gray-400">{item.date}</p>
            </div>
            <div className="font-bold text-green-400">${item.value}</div>
            <div className="flex gap-2">
              <FaEdit
                className="text-yellow-400 cursor-pointer"
                onClick={() => handleEdit(item)}
                title="Edit"
              />
              <FaTrash
                className="text-red-500 cursor-pointer"
                onClick={() => handleDelete(item._id)}
                title="Delete"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
