import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-indigo-300 transition-all">
                SpendIQ
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Empowering individuals and teams to take control of their finances with intelligent tracking, automated insights, and bank-grade security.
            </p>
          </div>

          {/* Product Column */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg">Product</h4>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/expenses" className="hover:text-blue-400 transition-colors">Expense Tracking</Link></li>
              <li><Link to="/budget" className="hover:text-blue-400 transition-colors">Budget Management</Link></li>
              <li><Link to="/insights" className="hover:text-blue-400 transition-colors">AI Insights</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg">Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-blue-400" />
                <span>support@spendiq.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-blue-400" />
                <span>+1 (555) 000-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-blue-400" />
                <span>123 Finance Way, Tech City</span>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Security Overview</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SpendIQ. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 cursor-default hover:text-gray-300 transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              System Status: Operational
            </span>
            <p>Built with ❤️ for better finance.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
