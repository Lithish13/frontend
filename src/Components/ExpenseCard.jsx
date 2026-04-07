import React, { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Film,
  Zap,
  User,
  Pencil,
} from "lucide-react";
import { parseExpenseCategories } from "../utils/categoryHelpers";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const ICONS_BY_KEY = {
  shoppingbag: ShoppingBag,
  coffee: Coffee,
  car: Car,
  home: Home,
  film: Film,
  zap: Zap,
  user: User,
};

let categoriesCachePromise = null;
function fetchCategoriesCached() {
  if (!categoriesCachePromise) {
    categoriesCachePromise = API.get("/categories")
      .then((res) => res?.data)
      .catch(() => []);
  }
  return categoriesCachePromise;
}

function normalizeKey(val) {
  return (val ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function chipStyle(metaMap, name) {
  const meta = metaMap?.[name];
  const color =
    typeof meta?.color === "string" && meta.color.trim()
      ? meta.color.trim()
      : "text-gray-600";
  const bg =
    typeof meta?.bg === "string" && meta.bg.trim()
      ? meta.bg.trim()
      : "bg-gray-100";
  return `${bg} ${color}`;
}

export default function ExpenseCard({ expense, onDelete, onEdit }) {
  const { user } = useAuth();
  if (!expense) return null;
  const { title, amount, date, category } = expense;
  const categoryNames = parseExpenseCategories(expense);
  const primaryCategory = categoryNames[0] || category;

  const [categoryMetaByName, setCategoryMetaByName] = useState({});

  useEffect(() => {
    let alive = true;
    fetchCategoriesCached().then((raw) => {
      if (!alive) return;

      const items = Array.isArray(raw) ? raw : [];
      const map = {};
      for (const item of items) {
        if (typeof item === "string") {
          const name = item.trim();
          if (name) map[name] = { name };
          continue;
        }
        const name = item?.name?.toString?.().trim?.();
        if (!name) continue;
        map[name] = {
          name,
          color: item?.color,
          bg: item?.bg,
          icon: item?.icon,
        };
      }
      setCategoryMetaByName(map);
    });
    return () => {
      alive = false;
    };
  }, []);

  const config = useMemo(() => {
    const meta = categoryMetaByName?.[primaryCategory] || null;
    const iconKey = normalizeKey(meta?.icon);
    const Icon = ICONS_BY_KEY[iconKey] || ShoppingBag;

    const color =
      typeof meta?.color === "string" && meta.color.trim()
        ? meta.color.trim()
        : "text-gray-500";
    const bg =
      typeof meta?.bg === "string" && meta.bg.trim() ? meta.bg.trim() : "bg-gray-100";

    return { Icon, color, bg };
  }, [primaryCategory, categoryMetaByName]);

  const formattedAmount = isNaN(amount) ? "0.00" : Number(amount).toFixed(2);
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

  return (
    <div className="group bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex items-center justify-between overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          <config.Icon size={22} className={config.color} />
        </div>
        <div>
          <h4 className="text-gray-900 font-semibold text-[17px] tracking-tight">
            {title || primaryCategory || "Expense"}
          </h4>
          <p className="text-sm text-gray-400 mt-0.5">
            {formattedDate !== "Invalid Date" ? formattedDate : date}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-gray-900 font-bold text-lg tracking-tight">
            -₹{formattedAmount}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-1 mt-1 max-w-[14rem]">
            {categoryNames.length > 0 ? (
              categoryNames.map((name) => (
                <span
                  key={name}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${chipStyle(
                    categoryMetaByName,
                    name
                  )}`}
                >
                  {name}
                </span>
              ))
            ) : (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${config.bg} ${config.color}`}
              >
                {category || "Other"}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={() => onEdit && onEdit(expense)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
            aria-label="Edit expense"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              const id = expense.id || expense._id;
              if (!id) return;
              if (onDelete) {
                if (confirm("Delete this expense?")) onDelete(id);
              }
            }}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Delete expense"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
