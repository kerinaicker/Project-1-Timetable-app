/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Lightbulb, Grid } from 'lucide-react';
import { VisualArray } from './VisualArray.tsx';
import { soundManager } from '../utils/audio.ts';

interface Step2InOrderScreenProps {
  tableNumber: number;
  learnerName: string;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const Step2InOrderScreen: React.FC<Step2InOrderScreenProps> = ({
  tableNumber,
  learnerName,
  onNextStep,
  onPrevStep,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showArray, setShowArray] = useState<boolean>(true);

  const totalCards = 12;
  const cards = Array.from({ length: totalCards }, (_, i) => {
    const multiplier = i + 1;
    const answer = multiplier * tableNumber;
    return {
      multiplier,
      base: tableNumber,
      answer,
      addition: Array(multiplier).fill(tableNumber).join(' + '),
    };
  });

  const current = cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
      soundManager.playStep();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      soundManager.playStep();
    }
  };

  const handleJump = (idx: number) => {
    setCurrentIndex(idx);
    soundManager.playStep();
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      {/* Step header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            Step 2 of 3 · In-Order Practice
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Reviewing the {tableNumber}× Table in Order
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Study each question and answer from 1× to 12×. Look at how multiplication is repeated addition.
          </p>
        </div>

        <button
          onClick={onPrevStep}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Step 1: Counting</span>
        </button>
      </div>

      {/* Main Study Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 mb-6 text-center">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 text-xs text-slate-500 font-medium">
          <span>Card {currentIndex + 1} of {totalCards}</span>
          <div className="flex items-center gap-1.5">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleJump(idx)}
                aria-label={`Jump to ${idx + 1} times ${tableNumber}`}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'bg-indigo-600 scale-125'
                    : idx < currentIndex
                    ? 'bg-indigo-200 hover:bg-indigo-300'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="font-mono tabular-nums">{Math.round(((currentIndex + 1) / totalCards) * 100)}%</span>
        </div>

        {/* Large Equation */}
        <div className="my-6">
          <div className="inline-flex items-center justify-center gap-3 sm:gap-6 text-4xl sm:text-6xl font-extrabold font-display text-slate-900">
            <span className="text-slate-900 font-mono tabular-nums">{current.multiplier}</span>
            <span className="text-slate-400 font-sans">×</span>
            <span className="text-indigo-600 font-mono tabular-nums">{current.base}</span>
            <span className="text-slate-400 font-sans">=</span>
            <span className="text-emerald-600 font-mono tabular-nums">{current.answer}</span>
          </div>

          {/* Repeated addition breakdown */}
          <div className="mt-4 text-xs sm:text-sm text-slate-500 font-medium font-mono">
            {current.multiplier > 1 ? (
              <span>{current.addition} = {current.answer}</span>
            ) : (
              <span>Single group of {current.base} = {current.answer}</span>
            )}
          </div>
        </div>

        {/* Visual Array */}
        {showArray && (
          <div className="mt-8 mb-4 max-w-md mx-auto">
            <VisualArray
              rows={current.multiplier}
              cols={current.base}
              interactive={false}
            />
          </div>
        )}

        {/* Card Controls */}
        <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setShowArray(!showArray)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{showArray ? 'Hide Visual Dots' : 'Show Visual Dots'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === totalCards - 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation to Step 3 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            {currentIndex === totalCards - 1
              ? "Awesome! You've reached 12×. Ready to test yourself out of order?"
              : "Review all 12 cards, then proceed to the randomized practice round."}
          </span>
        </div>

        <button
          onClick={() => {
            soundManager.playStep();
            onNextStep();
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer whitespace-nowrap text-sm"
        >
          <span>Step 3: Shuffled Practice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
