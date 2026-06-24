import { Markdown } from '@/components/blog/Markdown';
import { bgClass, pbClass, ptClass, type BackgroundVariant, type SpacingPreset } from '@/lib/puck/tokens';

export interface RichTextBlockProps {
  body?: string;
  alignment?: 'left' | 'center';
  spacingTop?: SpacingPreset;
  spacingBottom?: SpacingPreset;
  backgroundVariant?: BackgroundVariant;
}

export function RichTextBlock({
  body = '',
  alignment = 'left',
  spacingTop = 'md',
  spacingBottom = 'md',
  backgroundVariant = 'surface',
}: RichTextBlockProps) {
  return (
    <section
      className={`${bgClass[backgroundVariant]} ${ptClass[spacingTop]} ${pbClass[spacingBottom]} px-6 md:px-16`}
    >
      <div className={`mx-auto max-w-prose ${alignment === 'center' ? 'text-center' : ''}`}>
        <Markdown>{body}</Markdown>
      </div>
    </section>
  );
}
