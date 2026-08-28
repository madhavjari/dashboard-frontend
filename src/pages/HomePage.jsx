import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  FileText,
  MonitorUp,
  PackageSearch,
  ReceiptIndianRupee,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import DemoAnalytics from "../components/home/DemoAnalytics";

const outcomes = [
  {
    icon: BarChart3,
    question: "Are sales moving in the right direction?",
    answer: "Compare net sales, returns, invoices, customers, products, and month-by-month performance without rebuilding a spreadsheet.",
    link: "/demo/sales-dashboard",
    linkLabel: "See sales reporting",
  },
  {
    icon: CircleDollarSign,
    question: "Which customer balances need attention first?",
    answer: "See open invoices by customer, amount, and invoice age—then move directly into the customer ledger.",
    link: "/demo/sales-outstanding-dashboard",
    linkLabel: "See receivables",
  },
  {
    icon: ReceiptIndianRupee,
    question: "What do we owe suppliers?",
    answer: "Review purchase performance, supplier balances, and open commitments before they become last-minute surprises.",
    link: "/demo/purchase-outstanding-dashboard",
    linkLabel: "See payables",
  },
];

const roles = [
  { icon: Building2, role: "Business owners", focus: "Sales, purchases, receivables, payables, and the net position in one opening view." },
  { icon: FileText, role: "Accountants", focus: "Invoice-level balances, returns, payment timing, and party ledgers that are quick to verify." },
  { icon: Users, role: "Sales & purchase teams", focus: "Customer, supplier, and item performance with direct paths from summary to detail." },
];

const steps = [
  { number: "01", icon: Building2, title: "Create your workspace", detail: "Set up the account that will hold your business reporting." },
  { number: "02", icon: MonitorUp, title: "Connect your accounting computer", detail: "Generate a private credential and register the accounting company you want to synchronize." },
  { number: "03", icon: Sparkles, title: "Review what needs attention", detail: "Open Prana to scan performance, outstanding balances, parties, items, and transactions." },
];

const faqs = [
  { question: "What can I see in Prana?", answer: "Prana currently reports sales, purchases, returns, invoices, customer and supplier performance, item performance, receivables, payables, and party or item transaction detail." },
  { question: "Can I review more than one accounting company?", answer: "Yes. A workspace can include multiple accounting companies, and dashboard reports can combine or filter the companies available to your account." },
  { question: "Is the public demo showing real company information?", answer: "No. Every company, invoice, payment, and value in the public demo is synthetic. It is there so you can evaluate the product without signing in." },
  { question: "How does my accounting data get connected?", answer: "After creating an account, Prana guides you through generating a private sync credential and registering the accounting company from the computer where your accounting records are available." },
  { question: "Does Prana replace my accounting system?", answer: "Prana is a reporting and decision workspace built around synchronized accounting records. Your accounting system remains the source where operational records originate." },
];

export default function HomePage() {
  return (
    <>
      <a href="#main-content" className="sr-only z-50 rounded-lg bg-white px-4 py-3 font-semibold text-slate-900 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to main content</a>
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-slate-200 bg-[#f6faf9] px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24">
          <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(#dce8e5 1px, transparent 1px), linear-gradient(90deg, #dce8e5 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "linear-gradient(to bottom, black, transparent 75%)" }} />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[58rem] -translate-x-1/2 rounded-full bg-teal-200/35 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-teal-800 shadow-sm">
                <Sparkles size={14} aria-hidden="true" /> Business reporting from synced accounting data
              </p>
              <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.5rem]">
                Sales, purchases, and money due—clear in one view.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Prana turns everyday accounting records into a focused business workspace, so you can see performance and act on outstanding balances without hunting through reports.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-700" aria-label="Key product benefits">
                {["See business health in seconds", "Find the oldest open invoices", "Move from summary to party or item detail"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800"><Check size={13} strokeWidth={3} /></span>{item}</li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/demo/dashboard-summary" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-950/15 transition hover:-translate-y-0.5 hover:bg-teal-800">Explore the live demo <ArrowRight size={17} /></Link>
                <Link to="/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-teal-400 hover:text-teal-800">Create a workspace</Link>
              </div>
              <p className="mt-3 text-xs text-slate-500">The demo needs no sign-in and contains synthetic data only.</p>
            </div>
            <div className="relative min-w-0">
              <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-200/45 to-amber-100/40 blur-2xl" />
              <div className="relative"><DemoAnalytics /></div>
            </div>
          </div>
        </section>

        <section aria-label="Product coverage" className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4">
            {[{ label: "One opening view", detail: "Sales & purchases" }, { label: "Invoice-level", detail: "Outstanding visibility" }, { label: "Multi-company", detail: "Combined reporting" }, { label: "Financial-year", detail: "Focused filters" }].map((item) => (
              <div key={item.label}><p className="text-sm font-bold text-slate-900">{item.label}</p><p className="mt-0.5 text-xs text-slate-500">{item.detail}</p></div>
            ))}
          </div>
        </section>

        <section id="outcomes" className="scroll-mt-20 bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Answers before reports</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Start with the business question.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">Prana organizes accounting data around decisions people make every day—not around a maze of report names.</p>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {outcomes.map(({ icon: Icon, question, answer, link, linkLabel }) => (
                <article key={question} className="group flex flex-col rounded-2xl border border-slate-200 bg-[#fbfdfc] p-6 transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-slate-950/5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Icon size={21} /></span>
                  <h3 className="mt-5 text-lg font-bold leading-7 text-slate-950">{question}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{answer}</p>
                  <Link to={link} className="mt-6 inline-flex min-h-10 items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-900">{linkLabel} <ChevronRight size={16} /></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="product" className="scroll-mt-20 border-y border-slate-200 bg-[#f4f7f6] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
              <div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">See the product</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">A calm workspace for numbers that need attention.</h2><p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Primary KPIs show the position first. Trends explain what changed. Prioritized balances show where to act. Detailed registers are there when you need exact values.</p></div>
              <Link to="/demo/dashboard-summary" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:border-teal-400 hover:text-teal-800">Open full demo <ArrowRight size={16} /></Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[{ icon: PackageSearch, title: "Drill down without losing context", text: "Move from overview to customer, supplier, item, invoice, or transaction detail." }, { icon: CircleDollarSign, title: "Treat outstanding as a workflow", text: "Search open invoices, filter by age, and prioritize the oldest or largest balances." }, { icon: Building2, title: "Keep companies flexible", text: "Review one accounting company or combine the companies available in your workspace." }].map(({ icon: Icon, title, text }) => <div key={title} className="rounded-xl border border-slate-200 bg-white p-5"><Icon size={19} className="text-teal-700" /><h3 className="mt-3 text-sm font-bold text-slate-900">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-600">{text}</p></div>)}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Made for the people using the numbers</p><h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">One source, different daily priorities.</h2></div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {roles.map(({ icon: Icon, role, focus }) => <article key={role} className="rounded-2xl border border-slate-200 p-6"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Icon size={20} /></span><h3 className="mt-4 font-bold text-slate-950">{role}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{focus}</p></article>)}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 bg-[#102724] px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-300">How it works</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">From accounting records to a daily decision view.</h2><p className="mt-4 text-base leading-7 text-slate-300">The setup is explicit, so you know what happens after registration.</p></div>
            <ol className="mt-10 grid gap-4 lg:grid-cols-3">
              {steps.map(({ number, icon: Icon, title, detail }) => <li key={number} className="relative rounded-2xl border border-white/10 bg-white/5 p-6"><div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-400/15 text-teal-300"><Icon size={21} /></span><span className="font-mono text-sm font-bold text-slate-500">{number}</span></div><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{detail}</p></li>)}
            </ol>
          </div>
        </section>

        <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Questions before you start</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Straight answers, before signup.</h2><p className="mt-4 text-sm leading-6 text-slate-600">No invented customer claims or hidden assumptions. Explore the synthetic demo if you want to verify the workflow yourself.</p></div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {faqs.map((faq) => <details key={faq.question} className="group py-1"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-sm font-bold text-slate-900 marker:content-none">{faq.question}<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-open:rotate-90"><ChevronRight size={15} /></span></summary><p className="max-w-2xl pb-5 pr-10 text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#f4f7f6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl bg-teal-700 px-6 py-10 text-center text-white shadow-xl shadow-teal-950/15 sm:px-12 sm:py-14">
            <p className="text-sm font-bold text-teal-100">See the workflow before you commit</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Open Prana with a complete synthetic business.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-teal-50">Explore sales, purchases, receivables, payables, parties, items, and invoices. No sign-in required.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/demo/dashboard-summary" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-800 hover:bg-teal-50">Explore the live demo <ArrowRight size={17} /></Link><Link to="/register" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Create a workspace</Link></div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-lg font-bold text-slate-950">Prana</p><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Clear business reporting from the accounting data you already use.</p></div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600"><a href="#product" className="hover:text-teal-700">Product</a><a href="#how-it-works" className="hover:text-teal-700">How it works</a><Link to="/demo/dashboard-summary" className="hover:text-teal-700">Demo</Link><Link to="/login" className="hover:text-teal-700">Sign in</Link></div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-slate-100 pt-5 text-xs text-slate-400">© {new Date().getFullYear()} Prana. Business reporting, without the noise.</div>
      </footer>
    </>
  );
}
