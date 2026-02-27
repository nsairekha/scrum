import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section - Asymmetrical & Structured */}
        <section className="py-24 md:py-32 lg:flex lg:items-center lg:gap-16 border-b border-border">
          <div className="max-w-3xl space-y-10 lg:w-1/2">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted block">
                Hostel Management & Oversight
              </span>
              <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl text-foreground leading-[0.9]">
                Structured <br />
                <span className="italic font-serif font-light text-primary">Workspace</span> <br />
                for Residences.
              </h1>
            </div>
            
            <p className="max-w-xl text-lg text-muted md:text-xl leading-relaxed border-l-2 border-primary/20 pl-6">
              A bespoke environment for tracking residents, assigning rooms, and coordinating institutional requests. Designed for precision, not automation.
            </p>

            <div className="flex flex-col sm:flex-row gap-0">
              <Link href="/login" className="btn-bespoke py-4 px-12 text-sm uppercase tracking-widest">
                Start Managing
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center justify-center border border-border border-l-0 bg-surface px-12 py-4 text-sm font-bold uppercase tracking-widest transition-colors hover:bg-background"
              >
                System View
              </Link>
            </div>
          </div>

          <div className="hidden lg:block lg:w-1/2">
            <div className="relative aspect-square border border-border bg-stone-100 p-8">
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border border-stone-300" />
                ))}
              </div>
              <div className="relative h-full w-full border-2 border-primary/10 flex flex-col justify-between p-6">
                <div className="space-y-2">
                  <div className="h-1 w-12 bg-primary" />
                  <div className="h-1 w-24 bg-primary/30" />
                </div>
                <div className="space-y-4 self-end text-right">
                  <span className="block text-4xl font-serif italic text-primary/40">01.</span>
                  <span className="block text-xs font-bold tracking-widest uppercase text-muted">Core Infrastructure</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Grid & Logic */}
        <section id="features" className="py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-1 border-border bg-border">
            <div className="md:col-span-4 bg-background p-12 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground uppercase leading-none">
                Specific <br /><span className="text-primary italic font-serif font-light leading-normal">Functionality.</span>
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Tools tailored for institutional oversight, resident comfort, and administrative clarity.
              </p>
            </div>

            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-1">
              <div className="panel p-10 space-y-6 bg-surface">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Residents</span>
                <h3 className="text-xl font-bold text-foreground">Student Portal</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Direct submission of leave requests and complaints. Real-time notifications for room allocations.
                </p>
              </div>
              <div className="panel p-10 space-y-6 bg-surface">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Oversight</span>
                <h3 className="text-xl font-bold text-foreground">Warden Control</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Management of approvals, scheduled inspections, and resident updates through a centralized dash.
                </p>
              </div>
              <div className="panel p-10 space-y-6 bg-surface">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Operations</span>
                <h3 className="text-xl font-bold text-foreground">Admin Oversight</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Full capacity management, role configuration, and institutional-level insights.
                </p>
              </div>
              <div className="panel p-10 space-y-6 bg-stone-100 flex flex-col justify-end">
                <div className="border-t border-primary/20 pt-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Built for Precision.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Minimal & Editorial */}
        <section id="faq" className="py-24 border-t border-border">
          <div className="lg:flex lg:gap-16">
            <div className="lg:w-1/3 mb-12 lg:mb-0">
              <h2 className="text-4xl font-bold tracking-tight text-foreground leading-none">
                Common <br /><span className="italic font-serif font-light text-primary">Inquiries.</span>
              </h2>
            </div>
            <div className="lg:w-2/3 space-y-12">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-foreground">01. Registration & Allocation</h4>
                <p className="text-sm text-muted leading-relaxed border-l border-primary/40 pl-6">
                  Applications are handled through the internal dashboard using verified institutional credentials. Room assignments are managed by the resident wardens.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-foreground">02. Administrative Approvals</h4>
                <p className="text-sm text-muted leading-relaxed border-l border-primary/40 pl-6">
                  Leave requests and complaints are reviewed within 24 hours by the designated staff for each block.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-foreground">03. Technical Requirements</h4>
                <p className="text-sm text-muted leading-relaxed border-l border-primary/40 pl-6">
                  HostelHub is a responsive web application optimized for modern browsers on both desktop and mobile devices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Grounded */}
        <section className="py-24 border-t border-border mb-24">
          <div className="bg-primary p-16 text-center space-y-8">
            <h2 className="text-4xl font-bold text-background tracking-tighter uppercase sm:text-5xl">Ready for structured management?</h2>
            <div className="flex justify-center">
              <Link href="/login" className="bg-background text-primary px-16 py-4 font-bold uppercase tracking-widest hover:bg-stone-100 transition-colors border border-background">
                Access System
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
