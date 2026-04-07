import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import ExpenseCard from "../Components/ExpenseCard";
import AddExpenseModal from "../Components/AddExpenseModal";
import { useExpenseUI } from "../context/ExpenseUIContext";
import { mergeExpenseAfterEdit } from "../utils/expenses";
import { parseExpenseCategories } from "../utils/categoryHelpers";

function expenseMatchesQuery(expense, q) {
  if (!q) return true;
  const title = (expense.title ?? "").toString().toLowerCase();
  const cat = (expense.category ?? "").toString().toLowerCase();
  const amountStr = (expense.amount ?? "").toString().toLowerCase();
  const cats = parseExpenseCategories(expense)
    .join(" ")
    .toLowerCase();
  return (
    title.includes(q) ||
    cat.includes(q) ||
    cats.includes(q) ||
    amountStr.includes(q)
  );
}

export default function Expenses() {
  const location = useLocation();
  const navigate = useNavigate();
  const listRef = useRef(null);
  const {
    expenseSearchQuery,
    registerOpenAddExpenseModal,
    requestOpenAddExpenseModal,
  } = useExpenseUI();

  const [expenses, setExpenses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const filteredExpenses = useMemo(() => {
    const q = expenseSearchQuery.trim().toLowerCase();
    return expenses.filter((e) => expenseMatchesQuery(e, q));
  }, [expenses, expenseSearchQuery]);

  useEffect(() => {
    registerOpenAddExpenseModal(() => setShowAdd(true));
    return () => registerOpenAddExpenseModal(null);
  }, [registerOpenAddExpenseModal]);

  const handleDelete = async (id) => {
    try {
      setExpenses((prev) => prev.filter((e) => (e.id || e._id) !== id));
      await API.delete(`/expenses/${id}`);
    } catch (err) {
      console.error("Failed to delete", err);
      API.get("/expenses")
        .then((res) => setExpenses(res.data))
        .catch(() => {});
    }
  };

  useEffect(() => {
    API.get("/expenses")
      .then((res) => setExpenses(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const openAdd = location.state?.openAdd;
    const openEdit = location.state?.openEdit;
    if (openAdd) setShowAdd(true);
    if (openEdit) {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (openAdd || openEdit) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const hasAny = expenses.length > 0;
  const hasVisible = filteredExpenses.length > 0;
  const searching = expenseSearchQuery.trim().length > 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <button
          type="button"
          onClick={requestOpenAddExpenseModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm cursor-pointer"
        >
          + Add New
        </button>
      </div>

      {searching && (
        <p className="text-sm text-gray-500 mb-3">
          Showing {filteredExpenses.length} of {expenses.length} expense
          {expenses.length === 1 ? "" : "s"}
        </p>
      )}

      <div ref={listRef} id="expenses-list" className="flex flex-col gap-3">
        {hasVisible ? (
          filteredExpenses.map((exp) => (
            <ExpenseCard
              key={exp.id || exp._id}
              expense={exp}
              onDelete={handleDelete}
              onEdit={(e) => setEditingExpense(e)}
            />
          ))
        ) : hasAny ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500">
              No expenses match &ldquo;{expenseSearchQuery.trim()}
              &rdquo;. Try another letter or clear the search.
            </p>
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500">No expenses found.</p>
          </div>
        )}
      </div>

      {showAdd && (
        <AddExpenseModal
          onClose={() => setShowAdd(false)}
          onAdd={(newExp) => setExpenses((prev) => [newExp, ...prev])}
        />
      )}

      {editingExpense && (
        <AddExpenseModal
          key={editingExpense.id || editingExpense._id}
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSaved={(updated) => {
            setExpenses((prev) =>
              mergeExpenseAfterEdit(prev, editingExpense, updated)
            );
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
}
