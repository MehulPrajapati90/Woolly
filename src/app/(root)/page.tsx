"use client";

import { Shell } from "lucide-react";
import { useRouter } from "next/navigation";

const navItems = ["About", "Features", "Pricing", "Integrations", "FAQ"];

const comparisonPoints = [
  "Real-time attendee communication",
  "Google Meet + Zoom in one flow",
  "Google Calendar sync and reminders",
  "Automated scheduling workflows",
  "Built for creators and event teams",
];

export default function Page() {
  const router = useRouter();
  const handleRedirectToHome = () => {
    router.push("/home");
  }
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-r from-red-700/35 via-orange-500/20 to-black blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-[28rem] h-60 w-[38rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-red-700/45 via-orange-400/55 to-red-900/45 blur-[100px]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <header className="mx-auto flex w-full max-w-4xl items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-sm font-bold">
              <Shell className="p-[0.2px]" />
            </div>
            <span className="text-lg font-semibold font-sans tracking-wide text-white/90">
              Wooly
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-white/70 transition hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          <button onClick={handleRedirectToHome} className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-red-950/40 transition hover:brightness-110">
            Start Hosting
          </button>
        </header>

        <section className="mx-auto mt-16 max-w-4xl text-center sm:mt-20">
          <p className="mx-auto inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70">
            Online events, reimagined for creators and communities
          </p>

          <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Host premium online events
            <span className="block bg-gradient-to-r from-orange-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
              with the tools you already use
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
            This app is built for people who want to host online events like
            Luma. Wooly combines Google Meet, Zoom, and Google Calendar APIs so
            your scheduling, invites, and live sessions work in one smooth flow.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={handleRedirectToHome} className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-red-950/40 transition hover:brightness-110">
              Book a Demo
            </button>
            <button className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">
              See Product Tour
            </button>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-5xl">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-white/45">
            Trusted Integrations
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-sm text-white/70 backdrop-blur-md">
              Google Meet
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-sm text-white/70 backdrop-blur-md">
              Zoom
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-sm text-white/70 backdrop-blur-md">
              Google Calendar
            </div>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-5xl">
          <h2 className="text-center text-3xl font-semibold leading-tight sm:text-4xl">
            Why event teams choose Wooly
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-lg font-medium text-white/80">Other tools</h3>
              <ul className="mt-5 space-y-3 text-sm text-white/50">
                <li>Too many disconnected apps</li>
                <li>Manual invite and calendar updates</li>
                <li>No consistent host workflow</li>
                <li>Hard to scale recurring events</li>
              </ul>
            </article>

            <article className="rounded-3xl border border-orange-400/30 bg-gradient-to-br from-orange-400/20 via-red-500/10 to-black p-6">
              <h3 className="text-lg font-medium text-white">Wooly platform</h3>
              <ul className="mt-5 space-y-3 text-sm text-white/85">
                {comparisonPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-orange-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-4xl space-y-3">
          {[
            "How does Wooly connect with Google Calendar?",
            "Can I host with Zoom and Google Meet both?",
            "Is this suitable for recurring community events?",
          ].map((question) => (
            <details
              key={question}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <summary className="cursor-pointer list-none text-sm font-medium text-white/90">
                {question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Yes. The platform is designed for recurring and one-time online
                events, with built-in calendar sync and meeting link management.
              </p>
            </details>
          ))}
        </section>

        <footer className="mx-auto mt-20 max-w-6xl rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-red-950/20 px-6 py-10 sm:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-sm font-bold">
                  <Shell className="p-[0.2px]" />
                </div>
                <span className="text-lg font-semibold font-sans tracking-wide text-white/90">
                  Wooly
                </span>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                Built for teams and creators who want to run online events like
                Luma, powered by Google Meet, Zoom, and Google Calendar APIs.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white/90">Quick Links</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                <li>
                  <a href="#" className="transition hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white/90">Integrations</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                <li>Google Meet</li>
                <li>Zoom</li>
                <li>Google Calendar</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5 text-xs text-white/45">
            © {new Date().getFullYear()} Wooly Events. All rights reserved.
          </div>
        </footer>
      </div>
    </main>
  );
}
