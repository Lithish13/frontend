import { useState } from "react";
import { User, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function Settings() {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await API.put("/user/profile", formData);
      updateUser(res.data);
      setStatus({ type: "success", message: "Settings updated successfully!" });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "Failed to update settings. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 mt-2">Manage your profile information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status Message */}
        {status.message && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 transition-all ${
            status.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
          }`}>
            {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-medium">{status.message}</p>
          </div>
        )}

        {/* Profile Details */}
        <section className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-xl shadow-blue-900/5 space-y-6 transition-all hover:shadow-blue-900/10">
          <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-gray-700 ml-1">Display Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Ex. John Doe"
              />
            </div>
            <div className="space-y-2 opacity-60 cursor-not-allowed">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none cursor-not-allowed"
              />
              <p className="text-[10px] text-gray-400 ml-1 italic">Email cannot be changed contact support.</p>
            </div>
          </div>
        </section>

        {/* Submit Actions */}
        <div className="flex items-center justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-gray-900/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={20} className="group-hover:scale-110 transition-transform" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      <section className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
        <p className="text-xs text-blue-600 font-medium text-center uppercase tracking-widest mb-2">Account Security</p>
        <p className="text-gray-500 text-sm text-center">
          Looking to change your password? Use the logout option and select "Forgot Password" on the login screen.
        </p>
      </section>
    </div>
  );
}
