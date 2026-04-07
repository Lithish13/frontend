import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Wallet,
  TrendingUp,
  Sparkles,
  Activity,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useExpenseUI } from "../context/ExpenseUIContext";
import ExpenseCard from "../Components/ExpenseCard";
import AddExpenseModal from "../Components/AddExpenseModal";
import { topRecentExpenses } from "../utils/expenses";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { requestOpenAddExpenseModal } = useExpenseUI();
  const [data, setData] = useState({
    totalSpent: 0,
    budgetLeft: 0,
    topCategory: "None",
  });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    if (location.pathname !== "/dashboard") return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, expensesRes] = await Promise.all([
          API.get("/dashboard").catch(() => ({
            data: { totalSpent: 0, budgetLeft: 0, topCategory: "None" },
          })),
          API.get("/expenses").catch(() => ({ data: [] })),
        ]);

        setData(dashboardRes.data);
        setRecentExpenses(topRecentExpenses(expensesRes.data, 5));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [location.pathname]);

  const handleRecentDelete = async (id) => {
    try {
      setRecentExpenses((prev) =>
        prev.filter((e) => (e.id || e._id) !== id)
      );
      await API.delete(`/expenses/${id}`);
      const [dashRes, expRes] = await Promise.all([
        API.get("/dashboard").catch(() => null),
        API.get("/expenses").catch(() => ({ data: [] })),
      ]);
      if (dashRes?.data) setData(dashRes.data);
      setRecentExpenses(topRecentExpenses(expRes.data, 5));
    } catch (err) {
      console.error("Failed to delete expense", err);
      API.get("/expenses")
        .then((res) => setRecentExpenses(topRecentExpenses(res.data, 5)))
        .catch(() => {});
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            Welcome back, {user?.name || "User"}{" "}
            <Sparkles className="text-yellow-400" size={24} />
          </h1>
          <p className="text-gray-500 mt-1">
            Here is the overview of your finances today.
          </p>
        </div>
        <button
          type="button"
          onClick={requestOpenAddExpenseModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
        >
          + Add Expense
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white h-32 rounded-3xl border border-gray-100 shadow-sm"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 shadow-xl shadow-blue-900/5 border border-white/60 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-100 transition-colors" />
              <div className="relative">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Activity size={24} />
                </div>
                <h3 className="text-gray-500 font-medium">Total Spent</h3>
                <div className="flex items-end gap-3 mt-1">
                  <p className="text-4xl font-black text-gray-900 tracking-tight">
                    ₹{data.totalSpent || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-6 shadow-xl shadow-indigo-900/20 rounded-3xl relative overflow-hidden text-white group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-colors" />
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Wallet size={24} className="text-white" />
                </div>
                <h3 className="text-blue-100 font-medium">Budget Left</h3>
                <div className="flex items-end gap-3 mt-1">
                  <p className="text-4xl font-black tracking-tight">
                    ₹{data.budgetLeft || 0}
                  </p>
                  <span className="flex items-center text-sm font-medium text-emerald-300 bg-black/20 px-2 py-0.5 rounded-lg mb-1">
                    <ArrowUpRight size={16} /> Good
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 shadow-xl shadow-blue-900/5 border border-white/60 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-orange-100 transition-colors" />
              <div className="relative">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-gray-500 font-medium">Top Category</h3>
                <div className="flex items-end gap-3 mt-1">
                  <p className="text-3xl font-black text-gray-900 tracking-tight capitalize">
                    {data.topCategory || "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Transactions
                </h2>
                <Link
                  to="/expenses"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {recentExpenses.length > 0 ? (
                  recentExpenses.map((exp) => (
                    <ExpenseCard
                      key={exp.id || exp._id}
                      expense={exp}
                      onDelete={handleRecentDelete}
                      onEdit={(e) => setEditingExpense(e)}
                    />
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity size={28} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No recent transactions to show.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <button
                  type="button"
                  onClick={() => navigate("/budget")}
                  className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-colors group flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-blue-700">
                      Add Budget
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Set monthly limits
                    </p>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-gray-400 group-hover:text-blue-600"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/insights")}
                  className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition-colors group flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-indigo-700">
                      View Insights
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Analyze spending
                    </p>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-gray-400 group-hover:text-indigo-600"
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {editingExpense && (
        <AddExpenseModal
          key={editingExpense.id || editingExpense._id}
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSaved={async () => {
            setEditingExpense(null);
            try {
              const [dashRes, expRes] = await Promise.all([
                API.get("/dashboard"),
                API.get("/expenses"),
              ]);
              setData(dashRes.data);
              setRecentExpenses(topRecentExpenses(expRes.data, 5));
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}
    </div>
  );
}
