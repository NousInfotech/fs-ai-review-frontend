"use client";

import React, { useState, useMemo } from "react";
import InsightCard, { InsightArticle } from "./InsightCard";

const insightCategories = [
  "All",
  "Accounting & Finance",
  "Tax & Compliance",
  "Audit & Assurance",
  "Corporate & Structuring",
  "International",
  "Governance & Risk",
  "Business & Growth",
];

const insightsData: InsightArticle[] = [
  {
    id: "1",
    slug: "why-fragmented-compliance-creates-risk",
    title: "Why Fragmented Compliance Creates Risk in Growing Companies",
    subtitle: "As companies expand, compliance becomes more complex.",
    description:
      "When legal, accounting, tax, and regulatory functions operate in silos, inconsistencies and reporting gaps can emerge. Fragmented oversight increases operational friction and regulatory exposure.",
    category: "Tax & Compliance",
    publishDate: "February 20, 2026",
    readTime: "5 min read",
    author: "Cleven",
  },
  {
    id: "2",
    slug: "hidden-cost-poor-financial-reporting",
    title: "The Hidden Cost of Poor Financial Reporting in Growing Companies",
    subtitle: "Financial reporting is more than a compliance exercise.",
    description:
      "For growing companies, it underpins governance, investor confidence, and banking stability. When reporting is delayed or inconsistent, decision making slows, risks go undetected, and credibility weakens.",
    category: "Accounting & Finance",
    publishDate: "February 25, 2026",
    readTime: "6 min read",
    author: "Cleven",
  },
  {
    id: "3",
    slug: "cross-border-structuring-economic-substance",
    title: "Cross-Border Structuring and the Importance of Economic Substance in the EU",
    subtitle: "Legal form must reflect economic substance.",
    description:
      "In today’s regulatory environment, decision-making, operational presence, and governance coherence determine whether a structure is sustainable. Incorporation alone is no longer sufficient.",
    category: "International",
    publishDate: "February 23, 2026",
    readTime: "6 min read",
    author: "Cleven",
  },
  {
    id: "4",
    slug: "eu-expansion-structure-not-registration",
    title: "EU Expansion Is a Structure Issue, Not a Registration Issue",
    subtitle: "Expanding into the EU is not simply a matter of incorporating.",
    description:
      "While registration may be straightforward, sustainable operation requires aligned governance, tax planning, banking readiness, and reporting discipline. EU expansion is ultimately a structural decision.",
    category: "International",
    publishDate: "February 19, 2026",
    readTime: "5 min read",
    author: "Cleven",
  },
  {
    id: "5",
    slug: "why-banks-reject-companies-onboarding",
    title: "Why Banks Reject Companies and How to Prepare for Bank Onboarding",
    subtitle: "Opening a corporate bank account is no longer routine.",
    description:
      "Banks are required to conduct structured risk assessments before onboarding any company. Issues such as unclear beneficial ownership often trigger rejections.",
    category: "Governance & Risk",
    publishDate: "February 24, 2026",
    readTime: "6 min read",
    author: "Cleven",
  },
  {
    id: "6",
    slug: "compliance-is-becoming-a-systems-problem-not-a-paperwork-problem",
    title: "Compliance Is Becoming a Systems Problem, Not a Paperwork Problem",
    subtitle: "Regulatory compliance now depends on digital infrastructure.",
    description:
      "As regulators move toward real-time, digital reporting, compliance is shifting away from static documents and toward the systems that generate structured financial data.",
    category: "Tax & Compliance",
    publishDate: "March 13, 2026",
    readTime: "7 min read",
    author: "Cleven",
  },
  {
    id: "7",
    slug: "the-end-of-spreadsheet-accounting-how-automation-is-reshaping-financial-operations",
    title:
      "The End of Spreadsheet Accounting: How Automation Is Reshaping Financial Operations",
    subtitle: "Accounting is moving from files to infrastructure.",
    description:
      "Manual spreadsheet workflows struggle to keep pace with growing data volumes and regulatory expectations. Automated, integrated systems are becoming the new foundation of financial operations.",
    category: "Accounting & Finance",
    publishDate: "March 13, 2026",
    readTime: "8 min read",
    author: "Cleven",
  },
  {
    id: "8",
    slug: "the-rise-of-platform-based-professional-services",
    title: "The Rise of Platform-Based Professional Services",
    subtitle: "Advisors are becoming infrastructure providers.",
    description:
      "Instead of fragmented advisors working in separate tools, integrated platforms now connect accounting, corporate services, tax, and audit into a single digital environment.",
    category: "Business & Growth",
    publishDate: "March 12, 2026",
    readTime: "7 min read",
    author: "Cleven",
  },
];

const InsightsList = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") {
      return insightsData;
    }
    return insightsData.filter((article) => article.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {insightCategories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                isActive
                  ? "text-white bg-blue-600 shadow-lg shadow-blue-500/30 scale-105"
                  : "text-slate-600 bg-white border border-slate-200 hover:border-blue-500/50 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredArticles.map((article) => (
          <InsightCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default InsightsList;

