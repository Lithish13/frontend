import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Page not found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn't exist.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-sm shadow-blue-500/20">
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
