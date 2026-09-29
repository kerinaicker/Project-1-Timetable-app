/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio.ts';

interface TableSelectScreenProps {
  learnerName: string;
  completedTables: number[];
  onSelectTable: (tableNum: number) => void;
}

export const TableSelectScreen: React.FC<TableSelectScreenProps> = ({
  learnerName,
  completedTables,
  onSelectTable,
}) => {
  const [filter, setFilter] = useState<'all' | 'foundations' | 'core' | 'challenge'>('all');

  const allTables = Array.from({ length: 12 }, (_, i) => i + 1);

  const getCategory = (num: number) => {
    if ([1, 2, 5, 10].includes(num)) return 'foundations';
    if ([3, 4, 11].includes(num)) return 'core';
    return 'challenge';
  };

  const filteredTables = allTables.filter((num) => {
    if (filter === 'all') return true;
    return getCategory(num) === filter;
  });

  const handleSelect = (num: number) => {
    soundManager.playStep();
    onSelectTable(num);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Welcome banner */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
              Welcome, {learnerName}!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Select which times table you want to practice and master today.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 py-2 px-3.5 rounded-xl self-start sm:self-auto">
            <span className="font-semibold text-slate-700">{completedTables.length} of 12</span>
            <span aria-hidden="true">·</span>
            <span>Mastered this session</span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 mt-6 p-1 bg-slate-200/70 rounded-xl w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Tables (1–12)
          </button>
          <button
            onClick={() => setFilter('foundations')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'foundations'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Starter (1, 2, 5, 10)
          </button>
          <button
            onClick={() => setFilter('core')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'core'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Core (3, 4, 11)
          </button>
          <button
            onClick={() => setFilter('challenge')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'challenge'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Challenge (6, 7, 8, 9, 12)
          </button>
        </div>
      </div>

      {/* Grid of times tables */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredTables.map((num) => {
          const isMastered = completedTables.includes(num);
          const multiples = [num * 1, num * 2, num * 3, num * 4, num * 12];

          return (
            <button
              key={num}
              onClick={() => handleSelect(num)}
              className={`group relative text-left p-5 rounded-2xl border transition-all cursor-pointer bg-white hover:border-indigo-400 hover:shadow-md ${
                isMastered
                  ? 'border-emerald-300 ring-1 ring-emerald-200'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl font-extrabold font-display text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {num}×
                </span>
                {isMastered ? (
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Done</span>
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-500 font-mono tabular-nums leading-relaxed">
                {multiples.slice(0, 4).join(', ')} ... {multiples[4]}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">12 Questions</span>
                <span className="text-indigo-600 font-semibold group-hover:underline">
                  Practice →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick session info */}
      <div className="mt-12 p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>How it works:</strong> Each table takes you through 3 quick learning steps, followed by a test with smart retesting for any tricky questions!
          </span>
        </div>
      </div>
    </div>
  );
};
