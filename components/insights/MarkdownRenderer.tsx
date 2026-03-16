'use client';

import React, { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const processMarkdown = async () => {
      try {
        const processedContent = await remark()
          .use(html)
          .use(remarkGfm)
          .process(content);

        setHtmlContent(processedContent.toString());
      } catch (error) {
        console.error('Error processing markdown:', error);
        setHtmlContent(content);
      }
    };

    processMarkdown();
  }, [content]);

  return (
    <div
      className={cn(
        "blog-content max-w-none px-4",
        "prose prose-slate prose-lg md:prose-xl",
        "prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-headings:mb-8 prose-headings:mt-12",
        "prose-h1:text-4xl md:prose-h1:text-6xl",
        "prose-h2:text-3xl md:prose-h2:text-5xl",
        "prose-h3:text-2xl md:prose-h3:text-3xl",
        "prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:text-lg md:prose-p:text-xl prose-p:mb-10 prose-p:mt-0 font-medium",
        "prose-a:text-blue-600 prose-a:underline prose-a:underline-offset-4 prose-a:decoration-2 prose-a:decoration-blue-200 hover:prose-a:decoration-blue-600 transition-all",
        "prose-strong:text-slate-900 prose-strong:font-black",
        "prose-ul:list-disc prose-ul:mb-10 prose-ol:list-decimal prose-ol:mb-10",
        "prose-li:text-slate-600 prose-li:text-lg md:prose-li:text-xl prose-li:mb-4",
        "prose-blockquote:border-l-8 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:py-10 prose-blockquote:px-12 prose-blockquote:rounded-[2rem] prose-blockquote:not-italic prose-blockquote:text-slate-900 prose-blockquote:text-2xl prose-blockquote:font-bold prose-blockquote:mb-12",
        "prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:border-8 prose-img:border-white prose-img:my-16",
        "prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-blue-600 prose-code:font-mono prose-code:text-base",
        "prose-pre:bg-slate-900 prose-pre:rounded-[2rem] prose-pre:shadow-2xl prose-pre:p-8",
        "prose-hr:border-slate-200 prose-hr:my-20",
        className
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;

