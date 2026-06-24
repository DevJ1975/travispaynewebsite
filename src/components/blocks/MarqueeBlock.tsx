import { LogoMarquee } from '@/components/marketing/LogoMarquee';

export interface MarqueeBlockProps {
  label?: string;
  items?: { value: string }[];
}

export function MarqueeBlock({ label, items = [] }: MarqueeBlockProps) {
  const names = items.map((item) => item.value).filter(Boolean);
  return <LogoMarquee items={names.length ? names : ['Add names in the editor']} label={label} />;
}
