import React from 'react';

const SAFE_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

export function getSafeHref(rawUrl: string | null | undefined): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed, 'https://remotive.com');
    if (SAFE_URL_PROTOCOLS.has(parsed.protocol)) {
      return parsed.href;
    }
    return null;
  } catch {
    return null;
  }
}

export function stripHtmlToPreview(html: string | undefined, maxLength = 170): string {
  if (!html || typeof html !== 'string') return '';
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trimEnd()}...`;
  } catch {
    const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return plain.length <= maxLength ? plain : `${plain.slice(0, maxLength).trimEnd()}...`;
  }
}

function renderDomNode(node: ChildNode, keyPrefix: string): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  // Drop unsafe or non-content tags entirely
  if (['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'svg'].includes(tag)) {
    return null;
  }

  const children = Array.from(el.childNodes).map((child, idx) =>
    renderDomNode(child, `${keyPrefix}-${idx}`)
  );

  switch (tag) {
    case 'h1':
    case 'h2':
      return (
        <h3 key={keyPrefix} className="mt-5 mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">
          {children}
        </h3>
      );
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return (
        <h4 key={keyPrefix} className="mt-4 mb-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {children}
        </h4>
      );
    case 'p':
      return (
        <p key={keyPrefix} className="mb-3 leading-relaxed text-slate-700 dark:text-slate-300">
          {children}
        </p>
      );
    case 'ul':
      return (
        <ul key={keyPrefix} className="mb-3 ml-5 list-disc space-y-1.5 text-slate-700 dark:text-slate-300">
          {children}
        </ul>
      );
    case 'ol':
      return (
        <ol key={keyPrefix} className="mb-3 ml-5 list-decimal space-y-1.5 text-slate-700 dark:text-slate-300">
          {children}
        </ol>
      );
    case 'li':
      return <li key={keyPrefix} className="leading-relaxed">{children}</li>;
    case 'strong':
    case 'b':
      return (
        <strong key={keyPrefix} className="font-semibold text-slate-900 dark:text-slate-100">
          {children}
        </strong>
      );
    case 'em':
    case 'i':
      return <em key={keyPrefix}>{children}</em>;
    case 'br':
      return <br key={keyPrefix} />;
    case 'blockquote':
      return (
        <blockquote
          key={keyPrefix}
          className="my-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
        >
          {children}
        </blockquote>
      );
    case 'code':
      return (
        <code
          key={keyPrefix}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200"
        >
          {children}
        </code>
      );
    case 'a': {
      const safeHref = getSafeHref(el.getAttribute('href'));
      if (!safeHref) {
        return <span key={keyPrefix}>{children}</span>;
      }
      return (
        <a
          key={keyPrefix}
          href={safeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {children}
        </a>
      );
    }
    default:
      return <React.Fragment key={keyPrefix}>{children}</React.Fragment>;
  }
}

export function renderSafeHtml(html: string | undefined): React.ReactNode {
  if (!html || typeof html !== 'string') {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No detailed job description was provided by the listing source.
      </p>
    );
  }

  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const nodes = Array.from(doc.body.childNodes).map((node, index) =>
      renderDomNode(node, `safe-html-${index}`)
    );
    return <div className="text-sm">{nodes}</div>;
  } catch {
    return (
      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {stripHtmlToPreview(html, 4000)}
      </p>
    );
  }
}
