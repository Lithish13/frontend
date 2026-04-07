import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExpenseUIProvider } from "./context/ExpenseUIContext";
import Layout from "./Components/Layout";
import Header from "./Components/Header";
import Loader from "./Components/Loader";
import AIChatBot from "./Components/AIChatBot";

// Lazy Loaded Pages
const Landing = lazy(() => import("./Pages/Landing"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Expenses = lazy(() => import("./Pages/Expenses"));
const Insights = lazy(() => import("./Pages/Insights"));
const Budget = lazy(() => import("./Pages/Budget"));
const Login = lazy(() => import("./Pages/Login"));
const Signup = lazy(() => import("./Pages/Signup"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const Settings = lazy(() => import("./Pages/Settings"));
const AuthCallback = lazy(() => import("./Pages/AuthCallback"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));

function AppContent() {
  const location = useLocation();
  const hideChatOnPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];
  const shouldHideChat = hideChatOnPaths.includes(location.pathname);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto bg-gray-50 bg-linear-to-b from-blue-50/20 to-transparent">
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Layout Routes */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {!shouldHideChat && <AIChatBot />}
        </Suspense>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ExpenseUIProvider>
          <AppContent />
        </ExpenseUIProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
