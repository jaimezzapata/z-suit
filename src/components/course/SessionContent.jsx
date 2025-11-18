'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy, Check, BookOpen } from 'lucide-react';
import { useState } from 'react';

export function SessionContent({ session, currentSession }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Si no hay documentación, mostrar mensaje
  if (!session?.documentation) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Contenido no disponible
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          La documentación para esta sesión aún no ha sido generada por el profesor.
        </p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl">
      {/* Título de la sesión */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
          <BookOpen className="w-4 h-4" />
          Sesión {currentSession + 1}
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {session.title}
        </h1>
      </div>

      {/* Separador decorativo */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-12"></div>

      {/* Contenido Markdown */}
      <div className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-20
        prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:text-[var(--text-primary)]
        prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:pb-2 prose-h2:border-b prose-h2:border-[var(--border-color)] prose-h2:text-[var(--text-primary)]
        prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-[var(--text-primary)]
        prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-4 prose-h4:text-[var(--text-primary)]
        prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed prose-p:my-4
        prose-a:text-[var(--accent-primary)] prose-a:no-underline hover:prose-a:underline
        prose-strong:text-[var(--text-primary)] prose-strong:font-bold
        prose-code:text-[var(--accent-primary)] prose-code:bg-[var(--bg-medium)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-[var(--bg-darkest)] prose-pre:border prose-pre:border-[var(--border-color)] prose-pre:rounded-lg prose-pre:my-6 prose-pre:p-0
        prose-ul:my-4 prose-ul:text-[var(--text-secondary)]
        prose-ol:my-4 prose-ol:text-[var(--text-secondary)]
        prose-li:my-1
        prose-li:marker:text-[var(--accent-primary)]
        prose-blockquote:border-l-4 prose-blockquote:border-[var(--accent-primary)] prose-blockquote:bg-[var(--bg-medium)] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r prose-blockquote:my-6 prose-blockquote:not-italic
        prose-img:rounded-lg prose-img:my-6 prose-img:border prose-img:border-[var(--border-color)]
        prose-hr:my-8 prose-hr:border-[var(--border-color)]
        prose-table:border prose-table:border-[var(--border-color)] prose-table:rounded-lg prose-table:my-6
        prose-th:bg-[var(--bg-medium)] prose-th:text-[var(--text-primary)] prose-th:font-bold prose-th:py-2 prose-th:px-4
        prose-td:border prose-td:border-[var(--border-color)] prose-td:py-2 prose-td:px-4 prose-td:text-[var(--text-secondary)]
      ">
        <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Agregar IDs a los headers para el TOC
          h1: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return <h1 id={id} {...props}>{children}</h1>;
          },
          h2: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return <h2 id={id} {...props}>{children}</h2>;
          },
          h3: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return <h3 id={id} {...props}>{children}</h3>;
          },
          // Syntax highlighting para code blocks
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const codeIndex = `${match?.[1]}-${codeString.substring(0, 20)}`;
            
            return !inline && match ? (
              <div className="relative group">
                <button
                  onClick={() => copyToClipboard(codeString, codeIndex)}
                  className="absolute right-2 top-2 p-2 rounded bg-[var(--bg-dark)] border border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--bg-medium)]"
                  title="Copiar código"
                >
                  {copiedCode === codeIndex ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                  )}
                </button>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--bg-darkest)',
                  }}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Links externos se abren en nueva pestaña
          a: ({ node, children, href, ...props }) => {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {session.documentation}
      </ReactMarkdown>
      </div>
    </article>
  );
}
