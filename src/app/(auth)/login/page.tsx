import LoginForm from "./LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Branding Sidebar / Section */}
      <div className="lg:w-1/3 bg-primary p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/20">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-background flex items-center justify-center">
            <span className="text-primary font-bold text-lg">H</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-background uppercase">
            Hostel<span className="italic font-serif font-light opacity-80">Mari</span>
          </span>
        </Link>
        <div className="hidden lg:block space-y-6">
          <h2 className="text-4xl font-extrabold tracking-tighter text-background leading-none">
            Institutional <br />
            <span className="italic font-serif font-light opacity-80">Access Portal.</span>
          </h2>
          <p className="text-sm text-background/70 leading-relaxed border-l border-background/20 pl-6">
            Secure entry for students, wardens, and administrative staff. Precision management starts here.
          </p>
        </div>
        <div className="hidden lg:block">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-background/40">
            System v2.4.0
          </span>
        </div>
      </div>

      {/* Main Login Area */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-stone-50/50">
        <div className="w-full max-w-sm space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tighter text-foreground uppercase">
              Authentication
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              Enter your institutional credentials to access the management workspace.
            </p>
          </div>
          
          <div className="panel p-8 sm:p-10 bg-surface">
            <LoginForm />
          </div>

          <div className="text-center">
            <p className="text-xs text-muted uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
