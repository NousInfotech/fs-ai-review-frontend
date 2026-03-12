'use client';

import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, User, ArrowUpRight, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/utils/blog';
import MarkdownRenderer from './MarkdownRenderer';

interface BlogTemplateProps {
  blog: BlogPost;
  relatedBlogs?: BlogPost[];
}

const BlogTemplate: React.FC<BlogTemplateProps> = ({ blog, relatedBlogs = [] }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero / Header */}
      <div className="bg-slate-50 pt-16 pb-6">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-500 mb-3">
            {blog.tags?.[0] || 'Insight'}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
            {blog.title}
          </h1>
          <p className="text-base md:text-lg text-slate-600 mb-4">
            {blog.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-500" />
              {format(new Date(blog.date), 'MMMM d, yyyy')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              {blog.readingTime}
            </span>
            <span>•</span>
            <span>By {blog.author}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-4 mb-16 relative z-10">
        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl mb-10 border-4 border-white">
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main content */}
          <div className="lg:col-span-8">
            <article className="prose prose-slate prose-lg max-w-none">
              <MarkdownRenderer content={blog.content} />
            </article>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-4">
                Written by
              </h4>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 leading-tight">
                    {blog.author}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Insights Team
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Published</span>
                  <span className="font-semibold text-slate-900">
                    {format(new Date(blog.date), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Reading time</span>
                  <span className="font-semibold text-slate-900">
                    {blog.readingTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-4">
                Share insight
              </h4>
              <button
                onClick={handleShare}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                <Share2 className="w-4 h-4" />
                Copy link
              </button>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-3">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-white text-slate-600 text-xs font-semibold rounded-full border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="relative overflow-hidden rounded-2xl bg-blue-600 p-6 text-white">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ArrowUpRight className="w-20 h-20" />
              </div>
              <div className="relative z-10">
                <h4 className="font-semibold text-lg mb-2">Need an audit?</h4>
                <p className="text-sm text-blue-100 mb-5">
                  Connect with licensed auditors and streamline your financial statement review.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-xl text-sm font-semibold hover:gap-3 transition-all"
                >
                  Get started
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {relatedBlogs.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
                  Related insights
                </h2>
                <p className="text-sm text-slate-600 max-w-xl">
                  More structured thinking on governance, reporting and compliance.
                </p>
              </div>
              <Link
                href="/insights"
                className="hidden md:inline-flex items-center gap-2 text-blue-600 text-sm font-semibold hover:gap-3 transition-all"
              >
                View all insights
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.slice(0, 3).map((related) => (
                <article
                  key={related.slug}
                  className="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-100 hover:border-blue-600 hover:bg-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
                >
                  <Link
                    href={`/insights/${related.slug}`}
                    className="flex flex-col h-full p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      {related.tags && related.tags.length > 0 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-blue-50 text-blue-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                          {related.tags[0]}
                        </span>
                      )}
                      <div className="flex items-center text-[11px] text-slate-500 group-hover:text-white/80 transition-colors">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {format(new Date(related.date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-white transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3 group-hover:text-white/80 transition-colors">
                      {related.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 group-hover:border-white/20 transition-colors">
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-white transition-colors">
                        {related.author}
                      </span>
                      <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-10 text-center md:hidden">
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold"
              >
                View all insights
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogTemplate;

