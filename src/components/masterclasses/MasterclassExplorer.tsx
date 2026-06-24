'use client';

import { useState } from 'react';
import { MASTERCLASS_LEVELS, type Masterclass } from '@/lib/types/masterclass';
import { MasterclassCard } from '@/components/cards/MasterclassCard';
import { cn } from '@/lib/utils/cn';

/** Masterclass grid with level filter (doc 03 §8.11). */
export function MasterclassExplorer({ classes }: { classes: Masterclass[] }) {
  const [level, setLevel] = useState<string>('All');
  const list = level === 'All' ? classes : classes.filter((c) => c.level === level);

  return (
    <div>
      <div role="tablist" aria-label="Filter by level" className="mb-10 flex flex-wrap gap-3">
        {MASTERCLASS_LEVELS.map((option) => {
          const selected = level === option;
          return (
            <button
              key={option}
              role="tab"
              aria-selected={selected}
              onClick={() => setLevel(option)}
              className={cn(
                'rounded-tp-full border px-4 py-2 text-xs capitalize tracking-wider transition-colors',
                selected
                  ? 'border-tp-gold bg-tp-gold text-tp-black'
                  : 'border-tp-border text-tp-gray hover:border-tp-gold hover:text-tp-gold',
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {list.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((masterclass) => (
            <MasterclassCard key={masterclass.id} masterclass={masterclass} />
          ))}
        </div>
      ) : (
        <p className="text-tp-gray">No classes at this level yet.</p>
      )}
    </div>
  );
}
