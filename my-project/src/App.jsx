import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit, FaPlus, FaChartPie, FaTimes } from "react-icons/fa";
import { PieChart } from "@mui/x-charts/PieChart";
import { publicRequest } from "./requestMethod";
import axios from "axios";

function App() {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [showSignup, setShowSignup] = useState(false);

  const fetchExpenses = async () => {
    try {
      const res = await publicRequest.get("/expenses");
      setExpenses(res.data.expenses || []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    axios
      .get("https://backend-project-mpxb.onrender.com/isLoggedIn", {
        withCredentials: true,
      })
      .then((res) => setIsLoggedIn(res.data.loggedIn))
      .catch((err) => console.error(err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://backend-project-mpxb.onrender.com/login",
        {
          username: form.username,
          password: form.password,
        },
        { withCredentials: true }
      );
      console.log("Login successful", res.data);
      setIsLoggedIn(true);
      fetchExpenses();
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://backend-project-mpxb.onrender.com/signup",
        {
          username: form.username,
          password: form.password,
        },
        { withCredentials: true }
      );
      console.log("Signup successful", res.data);
      setIsLoggedIn(true);
      fetchExpenses();
    } catch (err) {
      console.error("Signup failed", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://backend-project-mpxb.onrender.com/logout",
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await publicRequest.put(`/expenses/${editId}`, {
          label,
          value: amount,
          date,
        });
      } else {
        await publicRequest.post("/expenses", {
          label,
          value: amount,
          date,
        });
      }
      resetForm();
      fetchExpenses();
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleEdit = (expense) => {
    setEditId(expense._id);
    setLabel(expense.label);
    setAmount(expense.value);
    setDate(expense.date);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setEditId(null);
    setLabel("");
    setAmount(0);
    setDate("");
    setShowAddForm(false);
  };

  const filtered = expenses.filter((e) =>
    e.label.toLowerCase().includes(search.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">
        <form
          onSubmit={showSignup ? handleSignup : handleLogin}
          className="bg-zinc-800 p-6 rounded-lg w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-teal-300">
            {showSignup ? "Sign Up" : "Login"}
          </h2>
          <input
            className="w-full p-2 mb-3 bg-zinc-700 rounded"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            className="w-full p-2 mb-3 bg-zinc-700 rounded"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="bg-blue-500 w-full py-2 rounded hover:bg-blue-600"
          >
            {showSignup ? "Sign Up" : "Login"}
          </button>
          <p className="text-sm mt-4 text-center">
            {showSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              className="text-teal-400 underline cursor-pointer"
              onClick={() => setShowSignup(!showSignup)}
            >
              {showSignup ? "Login" : "Sign Up"}
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
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
      >
        Logout
      </button>

      <header className="flex flex-col items-center justify-center mb-10">
        <h1 className="text-4xl font-bold text-teal-400 mb-4 animate-pulse">
          Track Your Spending
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
          >
            <FaPlus className="inline mr-2" /> {editId ? "Edit" : "Add"} Expense
          </button>
          <button
            onClick={() => setShowReport(!showReport)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
          >
            <FaChartPie className="inline mr-2" /> View Report
          </button>
        </div>
      </header>

      {showReport && (
        <div className="bg-zinc-800 p-6 rounded-lg w-full lg:w-1/3 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center text-indigo-300">
            Expense Breakdown
          </h2>
          <PieChart
            series={[
              {
                data: filtered.map((e, i) => ({
                  id: i,
                  value: e.value,
                  label: e.label,
                  color: `hsl(${i * 40}, 70%, 60%)`,
                })),
                innerRadius: 40,
                outerRadius: 100,
              },
            ]}
            width={300}
            height={250}
            sx={{ backgroundColor: "#18181b", borderRadius: 8 }}
          />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {showAddForm && (
          <div className="bg-zinc-800 p-6 rounded-lg w-full lg:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {editId ? "Edit" : "Add"} Expense
              </h2>
              <FaTimes
                className="cursor-pointer text-red-400"
                onClick={resetForm}
              />
            </div>
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
            />
            <input
              className="w-full p-2 mb-3 bg-zinc-700 rounded"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button
              className="bg-blue-500 w-full py-2 rounded hover:bg-blue-600"
              onClick={handleSave}
            >
              {editId ? "Update" : "Submit"}
            </button>
          </div>
        )}

        <div className="flex-1 space-y-4">
          <input
            type="text"
            placeholder="Search expenses..."
            className="p-2 w-full mb-4 bg-zinc-700 rounded"
            onChange={(e) => setSearch(e.target.value)}
          />
          {filtered.map((item) => (
            <div
              key={item._id}
              className="bg-zinc-800 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold text-teal-300">
                  {item.label}
                </h3>
                <p className="text-sm text-zinc-400">{item.date}</p>
              </div>
              <div className="text-green-400 font-bold text-lg">
                ${item.value}
              </div>
              <div className="flex gap-3">
                <FaEdit
                  className="text-yellow-400 cursor-pointer hover:scale-110"
                  onClick={() => handleEdit(item)}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer hover:scale-110"
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
