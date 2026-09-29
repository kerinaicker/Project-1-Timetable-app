/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface VisualArrayProps {
  rows: number;
  cols: number;
  maxDisplay?: number;
  interactive?: boolean;
}

export const VisualArray: React.FC<VisualArrayProps> = ({
  rows,
  cols,
  interactive = false,
}) => {
  const total = rows * cols;
  const isLarge = total > 72;

  // Dot colors based on column to show the groups
  const colors = [
    'bg-indigo-500',
    'bg-sky-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-violet-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-lime-500',
    'bg-purple-500',
  ];

  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-slate-100/80 rounded-xl border border-slate-200">
      <div className="text-xs text-slate-500 mb-2 font-medium">
        <span>{rows} {rows === 1 ? 'group' : 'groups'} of {cols}</span>
        <span className="mx-1.5" aria-hidden="true">·</span>
        <span className="font-mono tabular-nums">{total} total items</span>
      </div>

      <div
        className="grid gap-1 sm:gap-1.5 items-center justify-center"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: rows }).map((_, rIdx) => (
          <React.Fragment key={`row-${rIdx}`}>
            {Array.from({ length: cols }).map((_, cIdx) => {
              const dotColor = colors[cIdx % colors.length];
              return (
                <div
                  key={`dot-${rIdx}-${cIdx}`}
                  className={`${isLarge ? 'w-3 h-3 sm:w-4 sm:h-4' : 'w-4 h-4 sm:w-5 sm:h-5'} rounded-full ${dotColor} transition-transform ${
                    interactive ? 'hover:scale-125 cursor-pointer shadow-xs' : ''
                  }`}
                  title={`Row ${rIdx + 1}, Col ${cIdx + 1}`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
