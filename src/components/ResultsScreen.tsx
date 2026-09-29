/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import { TestSessionResult } from '../types.ts';
import { soundManager } from '../utils/audio.ts';

interface ResultsScreenProps {
  result: TestSessionResult;
  learnerName: string;
  onStartRetest: () => void;
  onGoToCompletion: () => void;
  onReviewSteps: () => void;
  onChooseOtherTable: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  learnerName,
  onStartRetest,
  onGoToCompletion,
  onReviewSteps,
  onChooseOtherTable,
}) => {
  const { tableNumber, totalQuestions, correctCount, attempts, missedQuestions, roundNumber } = result;
  const isPerfect = missedQuestions.length === 0;
  const accuracyPct = Math.round((correctCount / totalQuestions) * 100);

  const handleRetestClick = () => {
    soundManager.playStep();
    onStartRetest();
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
          {roundNumber === 0 ? 'Initial Test Results' : `Retest Round ${roundNumber} Results`}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
          {isPerfect
            ? `Outstanding, ${learnerName}! Perfect Score!`
            : `Good effort, ${learnerName}!`}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          {isPerfect
            ? `You got every single question right on the ${tableNumber}× table!`
            : `You mastered ${correctCount} of ${totalQuestions} questions. Let's fix the remaining ${missedQuestions.length} to achieve 100% mastery!`}
        </p>
      </div>

      {/* Summary Score Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center font-display font-extrabold text-2xl ${
                isPerfect
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
              }`}
            >
              {accuracyPct}%
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900 font-display">
                {correctCount} of {totalQuestions} Correct
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {roundNumber === 0 ? 'Initial Test' : `Retest Round ${roundNumber}`} · {tableNumber}× Times Table
              </div>
            </div>
          </div>

          {!isPerfect && (
            <button
              onClick={handleRetestClick}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retest {missedQuestions.length} Missed {missedQuestions.length === 1 ? 'Question' : 'Questions'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {isPerfect && (
            <button
              onClick={onGoToCompletion}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim Mastery Celebration!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Missed questions section */}
        {!isPerfect && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                Questions Needing Another Try ({missedQuestions.length})
              </span>
              <span className="text-xs text-slate-400">
                These will be in your retest
              </span>
            </div>

            <div className="space-y-2">
              {attempts
                .filter((a) => !a.isCorrect)
                .map((a, idx) => (
                  <div
                    key={`missed-${idx}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-rose-50/60 border border-rose-200/80 rounded-xl gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="font-bold text-slate-900 font-mono text-base">
                        {a.question.multiplier} × {a.question.baseTable}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="text-rose-700">
                        Your answer: <span className="font-bold line-through">{a.userAnswer}</span>
                      </div>
                      <div className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-bold">
                        Correct: {a.question.correctAnswer}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Correctly answered questions section */}
        {correctCount > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-3">
              Questions Answered Correctly ({correctCount})
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {attempts
                .filter((a) => a.isCorrect)
                .map((a, idx) => (
                  <div
                    key={`correct-${idx}`}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/70 rounded-lg text-xs"
                  >
                    <span className="font-medium font-mono text-slate-800">
                      {a.question.multiplier} × {a.question.baseTable} = {a.question.correctAnswer}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Alternative actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <button
          onClick={onReviewSteps}
          className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Review Learning Steps (1–3) Again</span>
        </button>

        <button
          onClick={onChooseOtherTable}
          className="px-3 py-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          Choose a Different Times Table
        </button>
      </div>
    </div>
  );
};
