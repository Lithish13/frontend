/** Parse categories from an expense (array, or legacy comma-separated `category`). */
export function parseExpenseCategories(expense) {
  if (!expense) return [];
  if (Array.isArray(expense.categories) && expense.categories.length) {
    return expense.categories
      .map((c) => String(c).trim())
      .filter(Boolean);
  }
  const raw = expense.category;
  if (raw == null || raw === "") return [];
  return String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const STORAGE_KEY = "spendiq_user_categories";

export function getUserCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr)
      ? arr.filter((x) => typeof x === "string" && x.trim())
      : [];
  } catch {
    return [];
  }
}

export function saveUserCategory(name) {
  const n = name.trim();
  if (!n) return false;
  const curr = getUserCategories();
  if (curr.includes(n)) return true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...curr, n]));
  return true;
}

export function mergeCategoryOptions(defaultList, apiList, userList, selected) {
  const merged = [
    ...defaultList,
    ...(apiList || []),
    ...(userList || []),
    ...(selected || []),
  ];
  const seen = new Set();
  const out = [];
  for (const item of merged) {
    const s = String(item ?? "")
      .trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

/** API payload: string for legacy backends + array when supported. */
export function categoriesToPayload(names) {
  const list = [...new Set(names.map((n) => String(n).trim()).filter(Boolean))];
  return {
    category: list.join(", "),
    categories: list,
  };
}
