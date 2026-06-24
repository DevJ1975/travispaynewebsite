import { heightClass, type SpacingPreset } from '@/lib/puck/tokens';

export interface SpacerBlockProps {
  size?: SpacingPreset;
}

export function SpacerBlock({ size = 'md' }: SpacerBlockProps) {
  return <div aria-hidden className={heightClass[size]} />;
}
