import LoginForm from "./LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col items-center justify-center p-6 sm:p-12 relative selection:bg-primary selection:text-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Sign in
          </h1>
        </div>

        {/* Login Form Card */}
        <div className="panel-elevated p-8 sm:p-10 bg-surface shadow-xl shadow-primary/5 ring-1 ring-primary/5 rounded-xl">
          <LoginForm />
        </div>

        <div className="text-center pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted/40">
            Secure Access • v2.4.0
          </p>
        </div>
      </div>
    </div>
  );
}
