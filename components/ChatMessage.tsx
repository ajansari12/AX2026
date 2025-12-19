import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser }) => {
  if (isUser) {
    return <p className="text-sm whitespace-pre-wrap">{content}</p>;
  }

  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className="text-sm mb-2 last:mb-0">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="text-sm list-disc list-inside mb-2 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="text-sm list-decimal list-inside mb-2 space-y-1">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-sm">{children}</li>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 underline hover:no-underline"
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-x-auto text-xs font-mono mb-2">
            {children}
          </pre>
        ),
        h1: ({ children }) => (
          <h1 className="text-base font-bold mb-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-sm font-bold mb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold mb-1">{children}</h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-gray-300 dark:border-gray-600 pl-3 italic text-sm mb-2">
            {children}
          </blockquote>
        ),
        hr: () => (
          <hr className="border-gray-300 dark:border-gray-600 my-2" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
