import React from 'react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

const parseInlineMarkdown = (text: string): React.ReactNode[] => {
  const result: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

    let nextMatch: { index: number; length: number; node: React.ReactNode } | null = null;

    if (boldMatch && boldMatch.index !== undefined) {
      const candidate = {
        index: boldMatch.index,
        length: boldMatch[0].length,
        node: <strong key={key++} className="font-semibold">{boldMatch[1]}</strong>
      };
      if (!nextMatch || candidate.index < nextMatch.index) {
        nextMatch = candidate;
      }
    }

    if (linkMatch && linkMatch.index !== undefined) {
      const candidate = {
        index: linkMatch.index,
        length: linkMatch[0].length,
        node: (
          <a
            key={key++}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 underline hover:no-underline"
          >
            {linkMatch[1]}
          </a>
        )
      };
      if (!nextMatch || candidate.index < nextMatch.index) {
        nextMatch = candidate;
      }
    }

    if (nextMatch) {
      if (nextMatch.index > 0) {
        result.push(remaining.slice(0, nextMatch.index));
      }
      result.push(nextMatch.node);
      remaining = remaining.slice(nextMatch.index + nextMatch.length);
    } else {
      result.push(remaining);
      break;
    }
  }

  return result;
};

const parseMarkdown = (content: string): React.ReactNode[] => {
  const lines = content.split('\n');
  const result: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let key = 0;

  const flushList = () => {
    if (currentList) {
      const ListTag = currentList.type === 'ul' ? 'ul' : 'ol';
      const listClass = currentList.type === 'ul'
        ? 'text-sm list-disc list-inside mb-2 space-y-1'
        : 'text-sm list-decimal list-inside mb-2 space-y-1';
      result.push(
        <ListTag key={key++} className={listClass}>
          {currentList.items.map((item, i) => (
            <li key={i} className="text-sm">{parseInlineMarkdown(item)}</li>
          ))}
        </ListTag>
      );
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      flushList();
      continue;
    }

    const ulMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      if (currentList?.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (currentList?.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(olMatch[1]);
      continue;
    }

    flushList();

    if (trimmed.startsWith('### ')) {
      result.push(
        <h3 key={key++} className="text-sm font-semibold mb-1">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      result.push(
        <h2 key={key++} className="text-sm font-bold mb-2">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith('# ')) {
      result.push(
        <h1 key={key++} className="text-base font-bold mb-2">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h1>
      );
    } else {
      result.push(
        <p key={key++} className="text-sm mb-2 last:mb-0">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }
  }

  flushList();
  return result;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser }) => {
  if (isUser) {
    return <p className="text-sm whitespace-pre-wrap">{content}</p>;
  }

  return <div className="space-y-0">{parseMarkdown(content)}</div>;
};
