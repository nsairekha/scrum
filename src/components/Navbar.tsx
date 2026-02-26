"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="w-full border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground uppercase">
              Hostel<span className="text-primary italic">Mari</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors">
              Management
            </Link>
            <Link href="#faq" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors">
              Guidance
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <Link
            href="/login"
            className="btn-bespoke text-xs uppercase tracking-widest"
          >
            Access Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
