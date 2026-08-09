import {
  ArrowRight,
  BarChart3,
  ReceiptIndianRupee,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router";
import DemoAnalytics from "../components/home/DemoAnalytics";

const features = [
  {
    icon: BarChart3,
    title: "See the whole picture",
    description:
      "Turn everyday sales and purchase data into clear, useful business signals.",
  },
  {
    icon: ReceiptIndianRupee,
    title: "Stay ahead of receivables",
    description:
      "Keep invoices, returns, and outstanding amounts visible before they become a problem.",
  },
  {
    icon: WalletCards,
    title: "Make decisions with confidence",
    description:
      "Track revenue, cash flow, and party performance from one calm workspace.",
  },
];

export default function HomePage() {
  return (
    <>
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 via-[#f7faf9] to-[#f7faf9] px-4 pb-20 pt-16 sm:pb-12 sm:pt-24">
          <div className="absolute left-1/2 top-0 -z-0 h-[32rem] w-[70rem] -translate-x-1/2 rounded-full bg-teal-200/35 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-6xl text-center">
            <p className="inline-flex rounded-full border border-teal-200 bg-white/75 px-4 py-1.5 text-sm font-semibold text-teal-800 shadow-sm">
              Prana — Breathing Life into Businesses
            </p>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              Know what your business is saying, before it has to shout.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Prana brings sales, purchases, collections, and outstanding
              balances into one simple view—so every decision starts with
              clarity.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-800">
                Start with Prana <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-300 hover:text-teal-800">
                Sign in to your workspace
              </Link>
            </div>
            <Link to="/demo/dashboard-summary" className="mt-4 inline-flex text-sm font-semibold text-teal-800 underline-offset-4 hover:underline">
              View demo business summary
            </Link>
            <div className="mt-12 sm:mt-16"><DemoAnalytics /></div>
          </div>
        </section>
        <section className="px-4 py-20 sm:py-6">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Built for everyday business</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Less hunting for numbers. More room to move forward.</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="inline-flex rounded-xl bg-teal-50 p-3 text-teal-700"><Icon size={22} /></span>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm text-slate-500">Prana — Breathing Life into Businesses.</footer>
    </>
  );
}
