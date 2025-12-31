import React, { useState } from 'react';
import { Twitter, Linkedin, Link2, Check, Share2 } from 'lucide-react';

interface SocialShareProps {
  title: string;
  url?: string;
  description?: string;
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  title,
  url,
  description = '',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  const buttonClass =
    'p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-1">Share:</span>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on Twitter"
        title="Share on Twitter"
      >
        <Twitter size={18} />
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </a>

      <button
        onClick={copyToClipboard}
        className={buttonClass}
        aria-label={copied ? 'Link copied!' : 'Copy link'}
        title={copied ? 'Link copied!' : 'Copy link'}
      >
        {copied ? <Check size={18} className="text-emerald-500" /> : <Link2 size={18} />}
      </button>

      {typeof navigator !== 'undefined' && navigator.share && (
        <button
          onClick={handleNativeShare}
          className={buttonClass}
          aria-label="Share"
          title="Share"
        >
          <Share2 size={18} />
        </button>
      )}
    </div>
  );
};
