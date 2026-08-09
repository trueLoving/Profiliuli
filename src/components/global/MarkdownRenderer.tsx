import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Import theme file directly — barrel `styles/prism` breaks under Vite ESM resolution.
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Shared Markdown renderer for Handbook (and future long-form surfaces).
 * Supports GFM tables/lists and Prism syntax highlighting.
 */
export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const code = String(children).replace(/\n$/, '');
            const isBlock = Boolean(match) || code.includes('\n');

            if (isBlock) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match?.[1] || 'text'}
                  PreTag="div"
                  customStyle={{
                    margin: '1rem 0',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              );
            }

            return (
              <code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-200 mt-8 mb-4 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-gray-200 mt-6 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-200 mt-4 mb-2">{children}</h3>
          ),
          p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-5 text-gray-300 mb-4 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-5 text-gray-300 mb-4 space-y-2">{children}</ol>
          ),
          li: ({ children }) => <li className="text-gray-300 leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-4">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm text-left text-gray-300 border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-800/80 text-gray-200">{children}</thead>,
          th: ({ children }) => (
            <th className="border border-gray-700 px-3 py-2 font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-700 px-3 py-2 align-top">{children}</td>
          ),
          hr: () => <hr className="border-gray-700 my-8" />,
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="rounded-lg max-w-full my-4 border border-gray-700"
              loading="lazy"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
