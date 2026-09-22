"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-base text-text-primary overflow-hidden">
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
