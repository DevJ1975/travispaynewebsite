export interface DividerBlockProps {
  color?: 'border' | 'gold';
}

export function DividerBlock({ color = 'border' }: DividerBlockProps) {
  return (
    <div className="px-6 md:px-16">
      <hr
        className={`mx-auto max-w-site border-t ${color === 'gold' ? 'border-tp-gold/40' : 'border-tp-border'}`}
      />
    </div>
  );
}
