/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Trophy, Sparkles, CheckCircle2, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti.ts';
import { soundManager } from '../utils/audio.ts';

interface CompletionScreenProps {
  tableNumber: number;
  learnerName: string;
  totalAttemptsCount: number;
  retestRoundsCount: number;
  onChooseNewTable: () => void;
  onRetakeTest: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  tableNumber,
  learnerName,
  totalAttemptsCount,
  retestRoundsCount,
  onChooseNewTable,
  onRetakeTest,
}) => {
  useEffect(() => {
    soundManager.playFanfare();
    fireCelebrationConfetti();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-6 text-center">
      {/* Trophy Badge */}
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-500 shadow-sm animate-bounce">
          <Trophy className="w-12 h-12 sm:w-16 sm:h-16" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1.5 shadow-sm">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2">
        Full Mastery Achieved!
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
        Congratulations, {learnerName}!
      </h1>
      <p className="text-slate-600 text-base sm:text-lg mt-2 max-w-md mx-auto">
        You answered all 12 questions correctly and conquered the{' '}
        <span className="font-bold text-indigo-600">{tableNumber}× Times Table</span>!
      </p>

      {/* Mastery Certificate Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 my-8 text-left max-w-lg mx-auto relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span className="font-bold font-display text-slate-900">
              Mastery Certificate
            </span>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            100% Score
          </span>
        </div>

        <div className="py-4 space-y-3">
          <div className="flex justify-between items-baseline text-sm">
            <span className="text-slate-500 font-medium">Learner</span>
            <span className="font-bold text-slate-900 font-display text-base">
              {learnerName}
            </span>
          </div>

          <div className="flex justify-between items-baseline text-sm">
            <span className="text-slate-500 font-medium">Times Table</span>
            <span className="font-mono font-bold text-indigo-600">
              {tableNumber}× Table (1×{tableNumber} to 12×{tableNumber})
            </span>
          </div>

          <div className="flex justify-between items-baseline text-sm">
            <span className="text-slate-500 font-medium">Questions Cleared</span>
            <span className="font-mono tabular-nums text-slate-800">
              12 of 12 Correct
            </span>
          </div>

          {retestRoundsCount > 0 && (
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-slate-500 font-medium">Retest Persistence</span>
              <span className="text-xs text-indigo-600 font-semibold">
                Completed after {retestRoundsCount} {retestRoundsCount === 1 ? 'retest' : 'retests'}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Times Tables Master Session</span>
          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <Sparkles className="w-3 h-3" />
            <span>Verified Ready</span>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
        <button
          onClick={onChooseNewTable}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer text-sm"
        >
          <span>Practice Another Table</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onRetakeTest}
          className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Full {tableNumber}× Test</span>
        </button>
      </div>
    </div>
  );
};
