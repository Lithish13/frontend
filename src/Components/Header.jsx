import { Bell, User, Search, LogOut, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useExpenseUI } from "../context/ExpenseUIContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    expenseSearchQuery,
    setExpenseSearchQuery,
    requestOpenAddExpenseModal,
  } = useExpenseUI();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Spendiq
          </div>
        </Link>

        {user ? (
          <>
            {/* Navigation */}
            <nav className="hidden md:flex gap-6 text-gray-500 font-medium text-sm">
              <Link
                to="/dashboard"
                className="hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/expenses"
                className="hover:text-blue-600 transition-colors"
              >
                Expenses
              </Link>
              <Link
                to="/insights"
                className="hover:text-blue-600 transition-colors"
              >
                Insights
              </Link>
              <Link
                to="/budget"
                className="hover:text-blue-600 transition-colors"
              >
                Budget
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <div className="flex min-w-0 w-36 sm:w-44 md:w-56 lg:w-64 items-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                <Search size={16} className="text-gray-400 shrink-0" />
                <input
                  type="search"
                  autoComplete="off"
                  value={expenseSearchQuery}
                  onChange={(e) => setExpenseSearchQuery(e.target.value)}
                  placeholder="Search expenses..."
                  aria-label="Search expenses"
                  className="outline-none px-2 text-sm bg-transparent min-w-0 flex-1"
                />
              </div>

              <div className="flex items-center gap-2">
                
                <button
                  type="button"
                  onClick={requestOpenAddExpenseModal}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-xl hover:bg-blue-700 font-medium text-sm shadow-sm transition-colors cursor-pointer"
                >
                  + New
                </button>
              </div>

              <div className="flex items-center gap-3 border-l border-gray-100 pl-4 relative">
              <Link to="/insights" className="text-gray-400 hover:text-gray-600 transition-colors relative">
                  <Bell size={18}  />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </Link>

                {/* User Dropdown Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      const menu = document.getElementById("user-menu");
                      menu.classList.toggle("hidden");
                    }}
                    className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors ring-2 ring-transparent focus:ring-blue-100 outline-none"
                  >
                    <User size={16} />
                  </button>

                  {/* Dropdown Box */}
                  <div
                    id="user-menu"
                    className="hidden absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-xl shadow-blue-900/5 rounded-2xl overflow-hidden py-2"
                  >
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">
                          {user.name || "User"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.email || "user@example.com"}
                        </span>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/settings"
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium"
                      >
                        <User size={16} /> Profile Settings
                      </Link>
                    </div>

                    <div className="border-t border-gray-50 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-600 font-medium hover:text-blue-600 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-white bg-blue-600 hover:bg-blue-700 font-medium px-5 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition-all"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
