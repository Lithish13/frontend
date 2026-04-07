import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, PieChart, Shield, Zap } from "lucide-react";
import Footer from "../Components/Footer";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-linear-to-b from-blue-50/50 via-white to-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {user ? (
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight max-w-4xl">
              Welcome back, {user.name || user.email}
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl">
              Your dashboard is ready — view recent activity and manage your
              expenses.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all text-md"
              >
                Open Dashboard
              </Link>
              <Link
                to="/expenses"
                className="bg-white hover:bg-gray-50 text-gray-900 font-semibold flex items-center justify-center px-6 py-3 rounded-xl shadow-sm border border-gray-200 transition-all text-md"
              >
                View Expenses
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight max-w-4xl relative z-10">
              Smart Expense Intelligence for{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                Modern Teams
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-2xl relative z-10">
              Track expenses, analyze spending patterns, and manage your budget
              with our powerful, intuitive platform.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 relative z-10">
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/40 text-lg"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="bg-white hover:bg-gray-50 text-gray-900 font-semibold flex items-center justify-center px-8 py-4 rounded-xl shadow-sm border border-gray-200 transition-all text-lg"
              >
                View Live Demo
              </Link>
            </div>
          </>
        )}
      </main>

      {/* Features Outline */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <PieChart size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Deep Insights
              </h3>
              <p className="text-gray-500">
                Analyze your spending with automatically categorized
                transactions and smart charts.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Bank-grade Security
              </h3>
              <p className="text-gray-500">
                Your financial data is encrypted and protected with
                enterprise-level security protocols.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-500">
                Built on modern architecture ensuring your dashboard loads
                instantly, every single time.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
