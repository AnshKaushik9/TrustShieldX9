"use client";

import { Bell, Search, Moon, Sun, Plus, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useLayoutStore } from "@/lib/store";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toggleSidebar } = useLayoutStore();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Create a beautiful page title from the pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const title = pathSegments.length > 0 
    ? pathSegments[0].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Dashboard';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-md px-6 z-10">
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold text-text-primary">{title}</div>
        
        {pathSegments.length > 1 && (
          <div className="hidden md:flex items-center text-sm text-text-muted">
            <span className="mx-2">/</span>
            <span className="text-text-secondary capitalize">{pathSegments[1].replace('-', ' ')}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden text-text-muted" onClick={toggleSidebar} aria-label="Toggle menu">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
          <Input 
            placeholder="Search IOCs, URLs, or Hashes..." 
            className="pl-9 h-9 bg-base border-border-muted"
            aria-label="Search IOCs, URLs, or Hashes"
          />
          <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
            <kbd className="inline-flex h-4 items-center gap-1 rounded border border-border-muted bg-muted px-1.5 font-mono text-[10px] font-medium text-text-muted">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        <Badge variant="outline" className="hidden lg:inline-flex border-blue-500/30 text-blue-400 h-6">
          Demo Mode
        </Badge>

        <Button 
          variant="ghost" 
          size="icon" 
          className="text-text-muted" 
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {mounted && theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button variant="ghost" size="icon" className="relative text-text-muted" aria-label="Notifications" disabled title="No new notifications">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="h-8 w-px bg-muted mx-1" />

        <Button size="sm" className="hidden sm:flex ml-1" asChild>
          <Link href="/media-forensics">
            <Plus className="h-4 w-4 mr-1.5" /> Quick Scan
          </Link>
        </Button>
        
        <Link href="/settings" className="h-8 w-8 ml-2 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-slate-600 overflow-hidden flex items-center justify-center shrink-0" aria-label="User menu">
          <span className="text-xs font-bold text-white">AD</span>
        </Link>
      </div>
    </header>
  );
}
