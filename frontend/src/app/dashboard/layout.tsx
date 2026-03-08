"use client";

import { SidebarProvider, useSidebar } from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/utils/contexts/AuthContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, toggleSidebar } = useSidebar();

  return (
    <div className={`relative bg-gray-100 flex min-h-screen ${isExpanded ? "overflow-hidden" : ""}`}>
      <Navbar/>
      <Sidebar />
      {/* Dark Overlay: Only visible on mobile when sidebar is expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar} // Close sidebar when clicking outside
            className="fixed inset-0 bg-black/60 z-50 md:hidden"
          />
        )}
      </AnimatePresence>


      <motion.main
        className={`flex-1 pt-5 pl-6 pr-3 md:p-8 transition-all min-h-screen overflow-x-hidden ${
          isExpanded ? "md:ml-55" : "ml-15 md:ml-15"
        } ${isExpanded ? "max-md:pointer-events-none" : ""}`}
      >
        {children}
      </motion.main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </AuthProvider>
  );
}