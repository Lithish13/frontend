import { Activity } from "lucide-react";

export default function Loader() {
  return (
    <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
          <Activity size={32} className="text-blue-600 animate-bounce" />
        </div>
        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-sm font-medium text-gray-400 animate-pulse tracking-wide">
        Loading...
      </p>
    </div>
  );
}
