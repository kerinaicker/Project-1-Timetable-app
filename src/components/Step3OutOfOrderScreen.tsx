/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Shuffle, CheckCircle, HelpCircle, Eye, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio.ts';

interface Step3OutOfOrderScreenProps {
  tableNumber: number;
  learnerName: string;
  onNextStep: () => void;
  onPrevStep: () => void;
}

interface ShuffledItem {
  id: string;
  multiplier: number;
  base: number;
  answer: number;
}

export const Step3OutOfOrderScreen: React.FC<Step3OutOfOrderScreenProps> = ({
  tableNumber,
  learnerName,
  onNextStep,
  onPrevStep,
}) => {
  const [deck, setDeck] = useState<ShuffledItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [userGuess, setUserGuess] = useState<string>('');
  const [reviewedIndices, setReviewedIndices] = useState<Set<number>>(new Set());

  // Initialize and shuffle
  const shuffleDeck = () => {
    const items: ShuffledItem[] = Array.from({ length: 12 }, (_, i) => ({
      id: `q-${i + 1}-${tableNumber}`,
      multiplier: i + 1,
      base: tableNumber,
      answer: (i + 1) * tableNumber,
    }));

    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    setDeck(items);
    setCurrentIndex(0);
    setIsAnswerRevealed(false);
    setUserGuess('');
    setReviewedIndices(new Set());
    soundManager.playStep();
  };

  useEffect(() => {
    shuffleDeck();
  }, [tableNumber]);

  if (deck.length === 0) return null;

  const current = deck[currentIndex];
  const isReviewed = reviewedIndices.has(currentIndex);

  const handleReveal = () => {
    setIsAnswerRevealed(true);
    setReviewedIndices((prev) => new Set(prev).add(currentIndex));
    soundManager.playStep();
  };

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerRevealed(false);
      setUserGuess('');
      soundManager.playStep();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsAnswerRevealed(false);
      setUserGuess('');
      soundManager.playStep();
    }
  };

  const handleQuickCheck = (e: React.FormEvent) => {
    e.preventDefault();
    handleReveal();
  };

  const allReviewed = reviewedIndices.size === deck.length;

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            Step 3 of 3 · Out-of-Order Practice (Not Scored)
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Shuffled Review: {tableNumber}× Table
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Test your recall with random questions. Think of the answer before revealing it!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={shuffleDeck}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            title="Reshuffle question order"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reshuffle</span>
          </button>
        </div>
      </div>

      {/* Main Flashcard */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 mb-6 text-center">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 text-xs text-slate-500 font-medium">
          <span>Question {currentIndex + 1} of {deck.length}</span>
          <span className="text-slate-400">
            {reviewedIndices.size} of {deck.length} reviewed
          </span>
          <span className="font-mono tabular-nums">
            {Math.round((reviewedIndices.size / deck.length) * 100)}%
          </span>
        </div>

        {/* Big Question Display */}
        <div className="my-8">
          <div className="inline-flex items-center justify-center gap-3 sm:gap-6 text-4xl sm:text-6xl font-extrabold font-display text-slate-900">
            <span className="text-slate-900 font-mono tabular-nums">{current.multiplier}</span>
            <span className="text-slate-400 font-sans">×</span>
            <span className="text-indigo-600 font-mono tabular-nums">{current.base}</span>
            <span className="text-slate-400 font-sans">=</span>

            {isAnswerRevealed ? (
              <span className="text-emerald-600 font-mono tabular-nums animate-in fade-in">
                {current.answer}
              </span>
            ) : (
              <span className="text-slate-300 font-mono">?</span>
            )}
          </div>

          {/* Optional scratchpad / mental guess input */}
          {!isAnswerRevealed && (
            <form onSubmit={handleQuickCheck} className="mt-8 max-w-xs mx-auto flex gap-2">
              <input
                type="number"
                inputMode="numeric"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="Type your guess (optional)"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Check
              </button>
            </form>
          )}

          {isAnswerRevealed && userGuess !== '' && (
            <div className="mt-4 text-xs font-medium">
              {Number(userGuess) === current.answer ? (
                <span className="text-emerald-600 flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4" /> You got it right!
                </span>
              ) : (
                <span className="text-slate-500">
                  Your guess was {userGuess}. The correct product is {current.answer}.
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action button: Reveal or Next */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          {!isAnswerRevealed ? (
            <button
              onClick={handleReveal}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs text-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Reveal Answer</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
              {currentIndex < deck.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs text-sm"
                >
                  <span>Next Card</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>All 12 cards reviewed!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom card stepper */}
        <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <div className="text-xs text-slate-400">
            Card {currentIndex + 1} of {deck.length}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === deck.length - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action to proceed to Test */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            {allReviewed
              ? "You've reviewed all 12 questions! You're ready for the typed test."
              : "Whenever you feel confident, take the real 12-question test!"}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onPrevStep}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Back to Step 2
          </button>
          <button
            onClick={() => {
              soundManager.playStep();
              onNextStep();
            }}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer whitespace-nowrap text-sm"
          >
            <span>Start Test (12 Questions)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
