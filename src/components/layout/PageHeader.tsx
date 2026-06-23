import { Eyebrow } from '@/components/ui/Section';

/** Minimal, text-only page hero used by interior marketing pages (doc 03 §8). */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="px-6 pb-12 pt-40 md:px-16">
      <div className="mx-auto max-w-site">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 font-display text-display-lg font-light leading-tight text-tp-white">
          {title}
        </h1>
        {subtitle && <p className="mt-5 max-w-prose text-lg leading-relaxed text-tp-gray">{subtitle}</p>}
      </div>
    </header>
  );
}
