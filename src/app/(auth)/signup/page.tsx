import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col items-center justify-center p-6 sm:p-12 relative selection:bg-primary selection:text-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-muted">
            Join the Hostel Portal to manage your stay.
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="panel-elevated p-8 sm:p-10 bg-surface shadow-xl shadow-primary/5 ring-1 ring-primary/5 rounded-xl">
          <SignupForm />
        </div>

        <div className="text-center pt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted/40">
            Secure Enrollment • v2.4.0
          </p>
        </div>
      </div>
    </div>
  );
}
