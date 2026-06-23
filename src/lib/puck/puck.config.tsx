import type { Config } from '@measured/puck';
import { HeroBlock } from '@/components/blocks/HeroBlock';
import { RichTextBlock } from '@/components/blocks/RichTextBlock';
import { MarqueeBlock } from '@/components/blocks/MarqueeBlock';
import { StatsBlock } from '@/components/blocks/StatsBlock';
import { GalleryBlock } from '@/components/blocks/GalleryBlock';
import { CTABlock } from '@/components/blocks/CTABlock';
import { SpacerBlock } from '@/components/blocks/SpacerBlock';
import { DividerBlock } from '@/components/blocks/DividerBlock';
import { BG_VARIANTS, SPACING_PRESETS } from '@/lib/puck/tokens';

// Block library for the visual page builder (doc 06 §3). Every visual choice is a
// preset list (no raw CSS), so pages stay on-brand. The same components render in
// the editor preview and on the public site.
const bgField = { type: 'select' as const, label: 'Background', options: [...BG_VARIANTS] };
const spacingTopField = { type: 'select' as const, label: 'Top spacing', options: [...SPACING_PRESETS] };
const spacingBottomField = { type: 'select' as const, label: 'Bottom spacing', options: [...SPACING_PRESETS] };

export const puckConfig: Config = {
  categories: {
    sections: { title: 'Sections', components: ['Hero', 'CTASection', 'StatsBar', 'Marquee'] },
    content: { title: 'Content', components: ['RichText', 'ImageGallery'] },
    layout: { title: 'Layout', components: ['Spacer', 'Divider'] },
  },
  components: {
    Hero: {
      label: 'Hero',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        headline: { type: 'text', label: 'Headline' },
        subheadline: { type: 'textarea', label: 'Sub-headline' },
        ctaLabel: { type: 'text', label: 'CTA label' },
        ctaHref: { type: 'text', label: 'CTA URL' },
        backgroundVariant: bgField,
      },
      defaultProps: {
        eyebrow: 'Eyebrow',
        headline: 'Architect of Cultural Moments',
        subheadline: '',
        ctaLabel: 'View Productions',
        ctaHref: '/productions',
        backgroundVariant: 'black',
      },
      render: ({ eyebrow, headline, subheadline, ctaLabel, ctaHref, backgroundVariant }) => (
        <HeroBlock
          eyebrow={eyebrow}
          headline={headline}
          subheadline={subheadline}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
          backgroundVariant={backgroundVariant}
        />
      ),
    },

    CTASection: {
      label: 'CTA Section',
      fields: {
        heading: { type: 'text', label: 'Heading' },
        subheading: { type: 'textarea', label: 'Sub-heading' },
        ctaLabel: { type: 'text', label: 'CTA label' },
        ctaHref: { type: 'text', label: 'CTA URL' },
        backgroundVariant: bgField,
      },
      defaultProps: {
        heading: 'Let us create something extraordinary',
        subheading: '',
        ctaLabel: 'Get in touch',
        ctaHref: '/contact',
        backgroundVariant: 'black',
      },
      render: ({ heading, subheading, ctaLabel, ctaHref, backgroundVariant }) => (
        <CTABlock
          heading={heading}
          subheading={subheading}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
          backgroundVariant={backgroundVariant}
        />
      ),
    },

    StatsBar: {
      label: 'Stats Bar',
      fields: {
        stats: {
          type: 'array',
          label: 'Stats',
          arrayFields: {
            value: { type: 'text', label: 'Value' },
            label: { type: 'text', label: 'Label' },
          },
        },
        backgroundVariant: bgField,
      },
      defaultProps: {
        stats: [
          { value: '30+', label: 'Years' },
          { value: '50+', label: 'Productions' },
        ],
        backgroundVariant: 'surface',
      },
      render: ({ stats, backgroundVariant }) => (
        <StatsBlock stats={stats} backgroundVariant={backgroundVariant} />
      ),
    },

    Marquee: {
      label: 'Marquee',
      fields: {
        label: { type: 'text', label: 'Label' },
        items: {
          type: 'array',
          label: 'Names',
          arrayFields: { value: { type: 'text', label: 'Name' } },
        },
      },
      defaultProps: {
        label: 'In Partnership With',
        items: [{ value: 'Michael Jackson' }, { value: 'Beyoncé' }],
      },
      render: ({ label, items }) => <MarqueeBlock label={label} items={items} />,
    },

    RichText: {
      label: 'Rich Text',
      fields: {
        body: { type: 'textarea', label: 'Content (Markdown)' },
        alignment: {
          type: 'radio',
          label: 'Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Centered', value: 'center' },
          ],
        },
        spacingTop: spacingTopField,
        spacingBottom: spacingBottomField,
        backgroundVariant: bgField,
      },
      defaultProps: {
        body: '## Edit me\n\nWrite content in Markdown here.',
        alignment: 'left',
        spacingTop: 'md',
        spacingBottom: 'md',
        backgroundVariant: 'surface',
      },
      render: ({ body, alignment, spacingTop, spacingBottom, backgroundVariant }) => (
        <RichTextBlock
          body={body}
          alignment={alignment}
          spacingTop={spacingTop}
          spacingBottom={spacingBottom}
          backgroundVariant={backgroundVariant}
        />
      ),
    },

    ImageGallery: {
      label: 'Image Gallery',
      fields: {
        images: {
          type: 'array',
          label: 'Images',
          arrayFields: {
            url: { type: 'text', label: 'Image URL' },
            alt: { type: 'text', label: 'Alt text' },
            caption: { type: 'text', label: 'Caption' },
          },
        },
        columns: {
          type: 'select',
          label: 'Columns',
          options: [
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
          ],
        },
        aspectRatio: {
          type: 'select',
          label: 'Aspect ratio',
          options: [
            { label: '16:9', value: '16/9' },
            { label: '4:3', value: '4/3' },
            { label: '1:1', value: '1/1' },
            { label: '3:4', value: '3/4' },
          ],
        },
      },
      defaultProps: { images: [], columns: '3', aspectRatio: '16/9' },
      render: ({ images, columns, aspectRatio }) => (
        <GalleryBlock images={images} columns={columns} aspectRatio={aspectRatio} />
      ),
    },

    Spacer: {
      label: 'Spacer',
      fields: { size: { type: 'select', label: 'Size', options: [...SPACING_PRESETS] } },
      defaultProps: { size: 'md' },
      render: ({ size }) => <SpacerBlock size={size} />,
    },

    Divider: {
      label: 'Divider',
      fields: {
        color: {
          type: 'select',
          label: 'Color',
          options: [
            { label: 'Border', value: 'border' },
            { label: 'Gold', value: 'gold' },
          ],
        },
      },
      defaultProps: { color: 'border' },
      render: ({ color }) => <DividerBlock color={color} />,
    },
  },
};
