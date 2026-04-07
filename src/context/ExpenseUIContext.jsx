import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const ExpenseUIContext = createContext(null);

export function ExpenseUIProvider({ children }) {
  const navigate = useNavigate();
  const [expenseSearchQuery, setExpenseSearchQuery] = useState("");
  const openAddModalRef = useRef(null);

  const registerOpenAddExpenseModal = useCallback((fn) => {
    openAddModalRef.current = fn;
  }, []);

  const requestOpenAddExpenseModal = useCallback(() => {
    if (openAddModalRef.current) {
      openAddModalRef.current();
      return;
    }
    navigate("/expenses", { state: { openAdd: true } });
  }, [navigate]);

  const value = useMemo(
    () => ({
      expenseSearchQuery,
      setExpenseSearchQuery,
      registerOpenAddExpenseModal,
      requestOpenAddExpenseModal,
    }),
    [
      expenseSearchQuery,
      registerOpenAddExpenseModal,
      requestOpenAddExpenseModal,
    ]
  );

  return (
    <ExpenseUIContext.Provider value={value}>
      {children}
    </ExpenseUIContext.Provider>
  );
}

export function useExpenseUI() {
  const ctx = useContext(ExpenseUIContext);
  if (!ctx) {
    throw new Error("useExpenseUI must be used within ExpenseUIProvider");
  }
  return ctx;
}
