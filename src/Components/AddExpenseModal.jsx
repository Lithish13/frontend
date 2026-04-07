import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { DEFAULT_CATEGORIES } from "../constants/defaultCategories";
import {
  parseExpenseCategories,
  mergeCategoryOptions,
  categoriesToPayload,
  getUserCategories,
  saveUserCategory,
} from "../utils/categoryHelpers";

function toggleInList(list, name) {
  const n = name.trim();
  if (!n) return list;
  return list.includes(n) ? list.filter((x) => x !== n) : [...list, n];
}

export default function AddExpenseModal({ onClose, onAdd, expense, onSaved }) {
  const isEdit = Boolean(expense);
  const expenseId = expense?.id ?? expense?._id;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [apiCategories, setApiCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [userCategories, setUserCategories] = useState(() =>
    getUserCategories()
  );
  const [selected, setSelected] = useState(() =>
    DEFAULT_CATEGORIES.length ? [DEFAULT_CATEGORIES[0]] : []
  );
  const [customInput, setCustomInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allOptions = useMemo(
    () =>
      mergeCategoryOptions(
        DEFAULT_CATEGORIES,
        apiCategories,
        userCategories,
        selected
      ),
    [apiCategories, userCategories, selected]
  );

  useEffect(() => {
    if (!expense) return;
    setTitle(expense.title?.trim() || "");
    setAmount(expense.amount != null ? String(expense.amount) : "");
    const raw = expense.date;
    if (raw) {
      const d = new Date(raw);
      if (!Number.isNaN(d.getTime())) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        setDate(`${y}-${m}-${day}`);
      } else {
        setDate("");
      }
    } else {
      setDate("");
    }
    const parsed = parseExpenseCategories(expense);
    setSelected(parsed.length ? parsed : DEFAULT_CATEGORIES.slice(0, 1));
    setError("");
  }, [expense]);

  useEffect(() => {
    let alive = true;
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await API.get("/categories");
        const raw = res?.data;
        const normalized = Array.isArray(raw)
          ? raw
              .map((c) => (typeof c === "string" ? c : c?.name))
              .filter((c) => typeof c === "string" && c.trim().length > 0)
              .map((c) => c.trim())
          : [];
        if (!alive) return;
        setApiCategories(normalized);
      } catch (err) {
        if (!alive) return;
        setApiCategories([]);
      } finally {
        if (!alive) return;
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
    return () => {
      alive = false;
    };
  }, []);

  const reset = () => {
    setTitle("");
    setAmount("");
    setDate("");
    setSelected(DEFAULT_CATEGORIES.length ? [DEFAULT_CATEGORIES[0]] : []);
    setCustomInput("");
    setError("");
  };

  const addCustomCategory = () => {
    const name = customInput.trim();
    if (!name) return;
    saveUserCategory(name);
    setUserCategories(getUserCategories());
    setSelected((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setCustomInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Title is required.");
    if (!amount || Number(amount) <= 0)
      return setError("Enter a valid amount.");
    if (!selected.length) return setError("Select at least one category.");

    const { category, categories } = categoriesToPayload(selected);
    const payload = {
      title: title.trim(),
      amount: Number(amount),
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      category,
      categories,
    };
    try {
      setLoading(true);
      if (isEdit && expenseId) {
        const res = await API.put(`/expenses/${expenseId}`, payload);
        onSaved && onSaved(res.data);
      } else {
        const res = await API.post("/expenses", payload);
        onAdd && onAdd(res.data);
        reset();
      }
      onClose && onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          (isEdit ? "Failed to update expense." : "Failed to add expense.")
      );
    } finally {
      setLoading(false);
    }
  };

  const submitBlocked = loading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg my-8">
        <h3 className="text-lg font-semibold mb-4">
          {isEdit ? "Edit Expense" : "Add Expense"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="border p-2 rounded-lg"
          />
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            type="number"
            step="0.01"
            className="border p-2 rounded-lg"
          />
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Date"
            type="date"
            className="border p-2 rounded-lg"
          />

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Categories — select one or more
            </p>
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selected.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() =>
                      setSelected((prev) => prev.filter((x) => x !== name))
                    }
                    className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-100 hover:bg-blue-100"
                  >
                    {name}
                    <span className="text-blue-600" aria-hidden>
                      ×
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div
              className="border rounded-lg p-2 max-h-48 overflow-y-auto space-y-2 bg-gray-50/80"
              role="group"
              aria-label="Category options"
            >
              {categoriesLoading && (
                <p className="text-xs text-gray-500 px-1">Loading more…</p>
              )}
              {allOptions.map((name) => (
                <label
                  key={name}
                  className="flex items-center gap-2 text-sm cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(name)}
                    onChange={() =>
                      setSelected((prev) => toggleInList(prev, name))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomCategory();
                }
              }}
              placeholder="Add your own category"
              className="border p-2 rounded-lg flex-1 min-w-0"
            />
            <button
              type="button"
              onClick={addCustomCategory}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 shrink-0"
            >
              Add
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                if (!isEdit) reset();
                onClose && onClose();
              }}
              className="px-4 py-2 rounded-xl bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitBlocked}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-60"
            >
              {loading
                ? isEdit
                  ? "Saving..."
                  : "Adding..."
                : isEdit
                  ? "Save changes"
                  : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
