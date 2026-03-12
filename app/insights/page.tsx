import InsightsList from "@/components/landing/InsightsList";

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-500 mb-3">
            Insights
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
            Insights on audit, reporting & compliance
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            Articles adapted from the VACEI website to match the same UI and content,
            focused on governance, financial reporting and compliance topics.
          </p>
        </div>
      </section>
      <InsightsList />
    </main>
  );
}

