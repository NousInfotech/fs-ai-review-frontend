"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";

export interface InsightArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  publishDate: string;
  readTime?: string;
  author: string;
}

interface InsightCardProps {
  article: InsightArticle;
}

const InsightCard = ({ article }: InsightCardProps) => {
  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 hover:border-blue-600/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
      <Link href={`/insights/${article.slug}`} className="flex flex-col h-full p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
            {article.category}
          </span>
          <div className="flex items-center text-xs text-slate-400">
            <Calendar className="w-3 h-3 mr-1" />
            {article.publishDate}
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {article.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">
              {article.author}
            </span>
            {article.readTime && (
              <span className="flex items-center text-xs text-slate-500 mt-1">
                <Clock className="w-3 h-3 mr-1" />
                {article.readTime}
              </span>
            )}
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default InsightCard;

