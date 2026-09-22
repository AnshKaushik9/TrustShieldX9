"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useLayoutStore } from "@/lib/store";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed, toggleSidebar } = useLayoutStore();

  return (
    <div className="flex h-screen w-full bg-base text-text-primary overflow-hidden">
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300 relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
