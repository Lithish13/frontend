import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { readOAuthTokenFromUrl, readOAuthErrorFromUrl } from "../utils/oauth";

export default function AuthCallback() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const error = readOAuthErrorFromUrl();
    if (error) {
      console.error("OAuth Error:", error);
      navigate("/login", { state: { error: `Authentication failed: ${error}` }, replace: true });
      return;
    }

    const token = readOAuthTokenFromUrl();
    if (token) {
      // Execute the login and then redirect
      Promise.resolve(login({ token }))
        .then(() => {
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.error("Login failed after oauth", err);
          navigate("/login", { state: { error: "Login failed after authentication." }, replace: true });
        });
    } else {
      navigate("/", { state: { error: "No token received from authentication provider." }, replace: true });
    }
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Authenticating...</h2>
        <p className="text-gray-500">Please wait while we complete your sign in.</p>
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}