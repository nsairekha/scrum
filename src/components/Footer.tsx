import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-surface/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Hostel<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Premium hostel management workspace designed for modern educational institutions. 
              Simplify operations, enhance student experience, and optimize resource allocation.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#features" className="text-sm text-muted hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#faq" className="text-sm text-muted hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            &copy; {currentYear} HostelHub. All rights reserved. Built with precision for premium management.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-muted hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
