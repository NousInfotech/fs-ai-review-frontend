'use client';

import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, User, ArrowLeft, Share2, ArrowUpRight, Bookmark, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/utils/blog';
import MarkdownRenderer from './MarkdownRenderer';
import PageHeader from '@/components/common/PageHeader';
import { cn } from '@/lib/utils';
import { usePerformance } from '@/contexts/ReduceMotionContext';
import { motion } from 'framer-motion';

interface BlogTemplateProps {
  blog: BlogPost;
  relatedBlogs?: BlogPost[];
}

const BlogTemplate: React.FC<BlogTemplateProps> = ({ blog, relatedBlogs = [] }) => {
  const { isIPhone, isLowPerformance } = usePerformance();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // In a real app, we'd use a toast here
      alert('Link copied to clipboard!');
    }
  };

  const breadcrumbs = [
    { label: "Insights", href: "/insights" },
    { label: blog.title }
  ];

  const glassStyle = cn(
    "relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
    !(isIPhone || isLowPerformance) && "backdrop-blur-xl"
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] hardware-accelerated font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-400/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 pt-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <PageHeader
            title={blog.title}
            breadcrumbs={breadcrumbs}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24 mb-24 relative z-20">
        <div className="max-w-6xl mx-auto">
          {/* Featured Image Section - Reduced Width to match max-w-6xl */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="group relative w-full aspect-[21/9] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(15,23,42,0.3)] mb-16 border-8 border-white p-0"
          >
            {blog.featuredImage ? (
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-blue/10 to-blue-500/20" />
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
            {/* Main Content (Left) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-8"
            >
              <article className="max-w-none">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden pb-20">
                   <MarkdownRenderer content={blog.content} />
                </div>

                {/* Bottom Tags (Mobile only) */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="lg:hidden mt-8 flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="px-4 py-1.5 bg-blue-50 text-primary-blue text-xs font-bold rounded-full border border-blue-100/50">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </motion.div>

            {/* Sticky Sidebar (Right) */}
            <aside className="lg:col-span-4">
              <div className="sticky top-32 space-y-10">
                {/* Author Card - Redesigned Static UI */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10"
                >
                  <h4 className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400 mb-8">WRITTEN BY</h4>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
                      </div>
                      <div>
                        <p className="font-extrabold text-2xl text-slate-900 leading-tight">{blog.author}</p>
                        <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-wider">VACEI Insights Team</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-8 border-t border-slate-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-wider">Published</span>
                        <span className="font-black text-slate-900">{format(new Date(blog.date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-wider">Reading Time</span>
                        <span className="font-black text-slate-900">{blog.readingTime}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Share Sidebar Action */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-950/20"
                >
                  <h4 className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400 mb-8">ENGAGE</h4>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleShare}
                      className="w-full h-16 inline-flex items-center justify-center gap-3 bg-blue-600 text-white rounded-[1.25rem] hover:bg-blue-500 transition-all font-black text-sm shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                    >
                      <Share2 className="w-5 h-5" />
                      SHARE INSIGHT
                    </button>
                    <button className="w-full h-16 inline-flex items-center justify-center bg-white/5 border border-white/10 text-white rounded-[1.25rem] hover:bg-white/10 transition-all font-black text-sm active:scale-[0.98]">
                      <Bookmark className="w-5 h-5 mr-2" />
                      SAVE FOR LATER
                    </button>
                  </div>
                </motion.div>

                {/* Platform CTA */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white shadow-2xl shadow-blue-900/40"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <ArrowUpRight className="w-24 h-24" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                       <ArrowUpRight className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-black text-3xl mb-4 leading-tight">Professional <br/>Audit Portal</h4>
                    <p className="text-blue-100 text-sm font-medium leading-relaxed mb-10">Streamline your compliance standards with our world-class auditing platform.</p>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center w-full gap-3 px-8 py-5 bg-white text-blue-600 rounded-[1.25rem] font-black text-sm hover:gap-4 transition-all shadow-xl shadow-blue-900/20"
                    >
                      ACCESS DASHBOARD
                      <ArrowUpRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Suggested Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="bg-slate-900 py-32 relative overflow-hidden">
          {/* Section Decor */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-blue/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                    Related Insights
                  </h2>
                  <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
                    Continue exploring our latest thinking on professional excellence and regulatory compliance.
                  </p>
                </div>
                <Link
                  href="/insights"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all"
                >
                  View all insights
                  <ArrowUpRight className="w-5 h-5 text-primary-blue" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.slice(0, 3).map((relatedBlog, idx) => (
                  <motion.article
                    key={relatedBlog.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={cn(
                      "group relative flex flex-col h-full bg-slate-800/50 backdrop-blur-sm rounded-[2.5rem] border border-white/5 hover:border-primary-blue/50 transition-all duration-500 hover:shadow-[0_24px_48px_rgba(0,0,0,0.4)]",
                      (isIPhone || isLowPerformance) && "hover:translate-y-0"
                    )}
                  >
                    <Link href={`/insights/${relatedBlog.slug}`} className="flex flex-col h-full p-8 md:p-10">
                      <div className="flex items-center justify-between mb-8">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase bg-primary-blue/20 text-blue-400 group-hover:bg-primary-blue group-hover:text-white transition-all duration-300">
                          {relatedBlog.tags ? relatedBlog.tags[0] : 'Insight'}
                        </span>
                        <div className="flex items-center text-xs font-semibold text-slate-500 group-hover:text-slate-300 transition-colors duration-300">
                          <Clock className="w-4 h-4 mr-2" />
                          {relatedBlog.readingTime}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 leading-tight">
                        {relatedBlog.title}
                      </h3>

                      <p className="text-slate-400 text-sm leading-relaxed mb-10 line-clamp-3 group-hover:text-slate-200 transition-colors duration-300">
                        {relatedBlog.excerpt}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/5 group-hover:border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                            <User className="w-5 h-5 text-slate-400" />
                          </div>
                          <span className="text-xs font-bold text-white">{relatedBlog.author}</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-primary-blue flex items-center justify-center transition-all duration-500 transform group-hover:rotate-45">
                          <ArrowUpRight className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogTemplate;
