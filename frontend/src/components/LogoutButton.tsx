"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/user/logout", {
        method: "POST",
        credentials: "include", // send cookies
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    // Clear local data you currently use
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Navigate to login and replace history so Back doesn't return here
    router.replace("/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                 text-red-500 hover:text-red-600
                 hover:bg-red-50 active:bg-red-100
                 transition-colors duration-150 w-full cursor-pointer"
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );
}
