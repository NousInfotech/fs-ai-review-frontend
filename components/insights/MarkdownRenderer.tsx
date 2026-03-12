'use client';

import React, { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

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
      className={`blog-content ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;

