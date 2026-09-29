/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Delete, CheckCircle2, AlertCircle } from 'lucide-react';
import { QuestionItem, QuestionAttempt, TestSessionResult } from '../types.ts';
import { soundManager } from '../utils/audio.ts';

interface TestScreenProps {
  tableNumber: number;
  learnerName: string;
  isRetest?: boolean;
  roundNumber?: number;
  customQuestions?: QuestionItem[];
  onFinishTest: (result: TestSessionResult) => void;
  onCancelTest: () => void;
}

export const TestScreen: React.FC<TestScreenProps> = ({
  tableNumber,
  learnerName,
  isRetest = false,
  roundNumber = 0,
  customQuestions,
  onFinishTest,
  onCancelTest,
}) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [inputError, setInputError] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<{
    shown: boolean;
    isCorrect: boolean;
    entered: number;
    correct: number;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize questions
  useEffect(() => {
    let pool: QuestionItem[] = [];

    if (customQuestions && customQuestions.length > 0) {
      // Retest mode: use only the passed missed questions
      pool = [...customQuestions];
    } else {
      // Full test: generate all 12
      pool = Array.from({ length: 12 }, (_, i) => ({
        id: `test-${i + 1}-${tableNumber}`,
        multiplier: i + 1,
        baseTable: tableNumber,
        correctAnswer: (i + 1) * tableNumber,
      }));
    }

    // Shuffle pool using Fisher-Yates
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    setQuestions(pool);
    setCurrentIndex(0);
    setAttempts([]);
    setInputValue('');
    setShowFeedback(null);
  }, [tableNumber, customQuestions]);

  // Focus input automatically on question change
  useEffect(() => {
    if (!showFeedback && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, showFeedback]);

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round((currentIndex / questions.length) * 100);

  const handleProcessAnswer = (valStr: string) => {
    const trimmed = valStr.trim();
    if (!trimmed) {
      setInputError('Please type a number.');
      return;
    }

    const numericAnswer = parseInt(trimmed, 10);
    if (isNaN(numericAnswer)) {
      setInputError('Please enter valid digits only.');
      return;
    }

    setInputError('');
    const isCorrect = numericAnswer === currentQ.correctAnswer;

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playIncorrect();
    }

    const attempt: QuestionAttempt = {
      question: currentQ,
      userAnswer: numericAnswer,
      isCorrect,
    };

    const newAttempts = [...attempts, attempt];
    setAttempts(newAttempts);

    // Provide momentary feedback to learner before next question
    setShowFeedback({
      shown: true,
      isCorrect,
      entered: numericAnswer,
      correct: currentQ.correctAnswer,
    });

    setTimeout(() => {
      setShowFeedback(null);
      setInputValue('');

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Complete the test!
        const correctCount = newAttempts.filter((a) => a.isCorrect).length;
        const missed = newAttempts
          .filter((a) => !a.isCorrect)
          .map((a) => a.question);

        onFinishTest({
          tableNumber,
          totalQuestions: questions.length,
          correctCount,
          attempts: newAttempts,
          missedQuestions: missed,
          roundNumber: isRetest ? roundNumber : 0,
        });
      }
    }, 750);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showFeedback) return;
    handleProcessAnswer(inputValue);
  };

  // Touch keypad buttons handler
  const handleKeypadPress = (digit: string) => {
    if (showFeedback) return;
    setInputError('');
    if (digit === 'BACK') {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (digit === 'ENTER') {
      handleProcessAnswer(inputValue);
    } else {
      if (inputValue.length < 5) {
        setInputValue((prev) => prev + digit);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            {isRetest ? `Retest Round ${roundNumber}` : `Official Test · ${tableNumber}× Table`}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            {isRetest ? 'Retesting Missed Questions' : `Testing: ${tableNumber}× Times Table`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isRetest
              ? `Only ${questions.length} questions to fix. You've got this, ${learnerName}!`
              : `Type the correct product for all 12 questions.`}
          </p>
        </div>

        <button
          onClick={onCancelTest}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          Exit Test
        </button>
      </div>

      {/* Test Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 text-center relative overflow-hidden">
        {/* Progress track */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="font-mono tabular-nums">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Question */}
        <div className="my-8">
          <div className="text-4xl sm:text-6xl font-extrabold font-display text-slate-900 flex items-center justify-center gap-3 sm:gap-5">
            <span className="font-mono tabular-nums">{currentQ.multiplier}</span>
            <span className="text-slate-400 font-sans">×</span>
            <span className="font-mono tabular-nums text-indigo-600">{currentQ.baseTable}</span>
            <span className="text-slate-400 font-sans">=</span>

            {/* Answer Display / Input */}
            <div className="relative inline-block">
              {showFeedback ? (
                <div
                  className={`inline-flex items-center gap-2 px-4 py-1 rounded-xl text-3xl sm:text-5xl font-mono tabular-nums font-bold ${
                    showFeedback.isCorrect
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-300'
                      : 'bg-rose-50 text-rose-600 border border-rose-300'
                  }`}
                >
                  <span>{showFeedback.entered}</span>
                  {showFeedback.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" />
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="inline-block">
                  <input
                    ref={inputRef}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (inputError) setInputError('');
                    }}
                    placeholder="?"
                    disabled={showFeedback !== null}
                    className="w-24 sm:w-32 py-1 px-2 text-center text-3xl sm:text-5xl font-mono font-bold text-slate-900 bg-slate-50 border-2 border-indigo-400 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 tabular-nums placeholder:text-slate-300"
                  />
                </form>
              )}
            </div>
          </div>

          {inputError && (
            <p className="mt-3 text-xs text-rose-600 font-medium">{inputError}</p>
          )}

          {showFeedback && !showFeedback.isCorrect && (
            <p className="mt-3 text-xs font-semibold text-rose-600">
              Not quite! The correct answer is {showFeedback.correct}.
            </p>
          )}

          {showFeedback && showFeedback.isCorrect && (
            <p className="mt-3 text-xs font-semibold text-emerald-600">
              Correct! Great job!
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="max-w-xs mx-auto mb-8">
          <button
            onClick={() => handleProcessAnswer(inputValue)}
            disabled={showFeedback !== null || !inputValue}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer text-sm"
          >
            <span>Submit Answer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-slate-400 mt-2">
            Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-[10px]">Enter ↵</kbd> on your keyboard to submit
          </p>
        </div>

        {/* On-Screen Number Pad (convenient for touchscreens/tablets) */}
        <div className="max-w-xs mx-auto pt-6 border-t border-slate-100">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-3">
            On-Screen Keypad
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit)}
                className="py-2.5 rounded-xl font-mono text-lg font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleKeypadPress('BACK')}
              className="py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              title="Backspace"
              aria-label="Backspace"
            >
              <Delete className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="py-2.5 rounded-xl font-mono text-lg font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('ENTER')}
              className="py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors cursor-pointer flex items-center justify-center"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
