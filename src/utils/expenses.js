/** Replace edited row and drop duplicates when backend returns a new id on update. */
export function mergeExpenseAfterEdit(prev, editingExpense, updated) {
  const oldId = editingExpense?.id ?? editingExpense?._id;
  const newId = updated?.id ?? updated?._id;
  return prev
    .filter((e) => (e.id || e._id) !== oldId)
    .filter((e) => (e.id || e._id) !== newId)
    .concat([updated]);
}

export function sortExpensesByDateDesc(list) {
  return [...list].sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return (Number.isNaN(db) ? 0 : db) - (Number.isNaN(da) ? 0 : da);
  });
}

export function topRecentExpenses(expenses, n = 5) {
  const list = Array.isArray(expenses) ? expenses : [];
  return sortExpensesByDateDesc(list).slice(0, n);
}
