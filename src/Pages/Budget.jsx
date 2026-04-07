import { useEffect, useState } from "react";
import API from "../services/api";

export default function Budget() {
  const [budget, setBudget] = useState({ monthlyBudget: 0 });
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    API.get("/budget")
      .then((res) => {
        const monthly = Number(res.data?.monthlyBudget ?? 0);
        setBudget(res.data);
        setAmount(monthly > 0 ? String(monthly) : "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching budget:", err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const value = Number(amount);
    if (Number.isNaN(value) || value < 0) {
      setError("Enter a valid monthly budget (0 or more).");
      return;
    }
    try {
      setSaving(true);
      const res = await API.put("/budget", { monthlyBudget: value });
      const next = res.data ?? { monthlyBudget: value };
      setBudget(next);
      setAmount(String(next.monthlyBudget ?? value));
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not save budget. Try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
      <p className="text-gray-500 mt-1 text-sm">
        Set your monthly spending limit.
      </p>

      {loading ? (
        <div className="mt-6 text-gray-500">Loading budget...</div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-2xl w-full max-w-md">
            <h3 className="text-gray-500 text-sm font-medium">Current monthly budget</h3>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              ₹{Number(budget?.monthlyBudget ?? 0).toLocaleString("en-IN")}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 shadow-sm border border-gray-100 rounded-2xl w-full max-w-md space-y-4"
          >
            <h3 className="text-gray-900 font-semibold">Set monthly budget</h3>
            <div>
              <label htmlFor="monthlyBudget" className="block text-sm text-gray-600 mb-1">
                Amount (₹)
              </label>
              <input
                id="monthlyBudget"
                type="number"
                min="0"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 25000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm">Budget saved.</p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              {saving ? "Saving..." : "Save budget"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
