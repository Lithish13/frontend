import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Expenses", path: "/expenses", icon: Receipt },
    { name: "Insights", path: "/insights", icon: PieChart },
    { name: "Budget", path: "/budget", icon: Target },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-xl flex flex-col border-r border-gray-100 hidden md:flex sticky top-0 overflow-hidden">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Spendiq
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                size={22}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-blue-500"
                }`}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 mt-auto">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group"
        >
          <Settings
            size={22}
            className={`transition-colors duration-200 ${
              location.pathname === "/settings" ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
            }`}
          />
          <span className="font-medium">Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group cursor-pointer text-left"
        >
          <LogOut
            size={22}
            className="text-gray-400 group-hover:text-red-500"
          />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
