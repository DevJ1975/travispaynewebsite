import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Renders a markdown body with Tailwind Typography prose styling (doc 04 §Blog Rendering). */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-light prose-a:text-tp-gold prose-blockquote:border-tp-gold prose-blockquote:text-tp-white prose-strong:text-tp-white">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
