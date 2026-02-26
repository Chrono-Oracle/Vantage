"use client";

import { SidebarProvider, useSidebar } from "@/components/sidebar-context";
import { Sidebar } from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, toggleSidebar } = useSidebar();

  return (
    <div className={`relative flex min-h-screen ${isExpanded ? "overflow-hidden" : ""}`}>
      <Sidebar />
      {/* Dark Overlay: Only visible on mobile when sidebar is expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar} // Close sidebar when clicking outside
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />
        )}
      </AnimatePresence>


      <motion.main
        className={`flex-1 p-8 transition-all min-h-screen overflow-x-hidden ${
          isExpanded ? "md:ml-60" : "ml-15 md:ml-20"
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
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}