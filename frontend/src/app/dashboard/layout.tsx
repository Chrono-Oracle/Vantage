"use client";

import { SidebarProvider, useSidebar } from "@/components/sidebar-context";
import { Sidebar } from "@/components/Sidebar";
import { motion } from "framer-motion";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();

  return (
    <motion.main
      className={`min-h-screen p-8 transition-all ${isExpanded ? "ml-60" : "ml-20"}`}
    >
      {children}
    </motion.main>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <DashboardContent>
          {children}
        </DashboardContent>
      </div>
    </SidebarProvider>
  );
}