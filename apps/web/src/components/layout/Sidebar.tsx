"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Search, Shield, Fingerprint, FileText, 
  Settings, PlayCircle, ChevronLeft, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLayoutStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Media Forensics", href: "/media-forensics", icon: Fingerprint },
  { title: "Live Web Guardian", href: "/live-web-guardian", icon: Shield },
  { title: "SafeScan", href: "/safescan", icon: Search },
  { title: "Reports Center", href: "/reports", icon: FileText },
];

const bottomNavItems = [
  { title: "Demo Mode", href: "/demo", icon: PlayCircle },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useLayoutStore();

  return (
    <motion.div 
      initial={false}
      animate={{ width: isSidebarCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex h-screen flex-col border-r border-border bg-base z-20 shrink-0"
    >
      <div className="flex h-16 items-center px-6 border-b border-border justify-between">
        <div className="flex items-center overflow-hidden">
          <Shield className="h-6 w-6 text-blue-500 shrink-0" />
          <AnimatePresence initial={false}>
            {!isSidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-2 text-lg font-bold text-text-primary whitespace-nowrap"
              >
                TrustShield AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-4 top-20 h-8 w-8 rounded-full border border-border-muted bg-surface text-text-muted hover:text-text-primary z-50 hover:bg-muted"
      >
        {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2" aria-label="Main navigation">
        <AnimatePresence initial={false}>
          {!isSidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"
            >
              Modules
            </motion.div>
          )}
        </AnimatePresence>

        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.title : undefined}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-blue-600/10 text-blue-500"
                  : "text-text-muted hover:bg-muted hover:text-text-primary",
                isSidebarCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", !isSidebarCollapsed && "mr-3", isActive ? "text-blue-500" : "text-text-muted group-hover:text-text-primary")} />
              
              <AnimatePresence initial={false}>
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>

              {isActive && !isSidebarCollapsed && (
                <motion.div 
                  layoutId="sidebar-active" 
                  className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md" 
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        {bottomNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.title : undefined}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors group",
                isActive
                  ? "bg-muted text-text-primary"
                  : "text-text-muted hover:bg-muted hover:text-text-primary",
                isSidebarCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", !isSidebarCollapsed && "mr-3")} />
              <AnimatePresence initial={false}>
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
