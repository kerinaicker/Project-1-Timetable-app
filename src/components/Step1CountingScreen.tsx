/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Pause, RotateCcw, Eye, ArrowLeft, Lightbulb } from 'lucide-react';
import { VisualArray } from './VisualArray.tsx';
import { soundManager } from '../utils/audio.ts';

interface Step1CountingScreenProps {
  tableNumber: number;
  learnerName: string;
  onNextStep: () => void;
  onBackToTables: () => void;
}

export const Step1CountingScreen: React.FC<Step1CountingScreenProps> = ({
  tableNumber,
  learnerName,
  onNextStep,
  onBackToTables,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showVisualArray, setShowVisualArray] = useState<boolean>(false);

  const totalSteps = 12;
  const multiples = Array.from({ length: totalSteps }, (_, i) => ({
    step: i + 1,
    value: (i + 1) * tableNumber,
  }));

  // Auto-play rhythm counting
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying) {
      if (activeStep < totalSteps) {
        timer = setTimeout(() => {
          setActiveStep((prev) => {
            const next = prev + 1;
            soundManager.playStep();
            return next;
          });
        }, 850);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, activeStep, totalSteps]);

  const handleStepClick = (stepNum: number) => {
    setIsPlaying(false);
    setActiveStep(stepNum);
    soundManager.playStep();
  };

  const handleNextStep = () => {
    if (activeStep < totalSteps) {
      setActiveStep((prev) => prev + 1);
      soundManager.playStep();
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
      soundManager.playStep();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep(1);
    soundManager.playStep();
  };

  const handleContinue = () => {
    soundManager.playStep();
    onNextStep();
  };

  const currentMultiple = multiples[activeStep - 1];

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      {/* Top step header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            Step 1 of 3 · Counting Exercise
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Skip-Counting the {tableNumber}× Table
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Count by {tableNumber}s all the way up to {tableNumber * 12}. Say each number out loud!
          </p>
        </div>

        <button
          onClick={onBackToTables}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Tables</span>
        </button>
      </div>

      {/* Main interactive counting stage */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
        {/* Current Active Number Spotlight */}
        <div className="text-center py-6 sm:py-8 bg-slate-50/70 rounded-2xl border border-slate-100 mb-8">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Multiple #{currentMultiple.step} of 12
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl sm:text-7xl font-extrabold font-display text-indigo-600 tabular-nums">
              {currentMultiple.value}
            </span>
          </div>

          <div className="mt-3 text-sm text-slate-600 font-medium">
            <span className="font-mono tabular-nums">{currentMultiple.step} × {tableNumber}</span>
            <span className="mx-2 text-slate-400" aria-hidden="true">=</span>
            <span className="font-mono tabular-nums">{currentMultiple.value}</span>
            <span className="mx-2 text-slate-400" aria-hidden="true">·</span>
            <span className="text-indigo-600">+{tableNumber} from previous</span>
          </div>
        </div>

        {/* Multiples Grid / Sequence */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Multiples Sequence</span>
            <span className="text-slate-400 font-normal">Click any number to jump</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {multiples.map((m) => {
              const isActive = m.step === activeStep;
              const isPast = m.step < activeStep;

              return (
                <button
                  key={m.step}
                  onClick={() => handleStepClick(m.step)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-105 z-10'
                      : isPast
                      ? 'bg-indigo-50/60 text-indigo-900 border-indigo-200 hover:bg-indigo-100/70'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`text-[10px] font-mono leading-none mb-1 ${
                      isActive ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {m.step}×
                  </div>
                  <div className="text-xl font-bold font-display tabular-nums">
                    {m.value}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Playback & Step Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Rhythm' : 'Chant Rhythm (Auto)'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Reset to 1st multiple"
              aria-label="Reset to 1st multiple"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStep}
              disabled={activeStep <= 1}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={handleNextStep}
              disabled={activeStep >= totalSteps}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next Multiple
            </button>

            <button
              onClick={() => setShowVisualArray(!showVisualArray)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showVisualArray ? 'Hide Dots' : 'Show Dots'}</span>
            </button>
          </div>
        </div>

        {/* Visual Array toggle */}
        {showVisualArray && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <VisualArray
              rows={currentMultiple.step}
              cols={tableNumber}
              interactive={true}
            />
          </div>
        )}
      </div>

      {/* Tip & Next Step Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong>Practice Tip:</strong> Try reciting the pattern without looking: {multiples.slice(0, 4).map(m => m.value).join(', ')}...
          </span>
        </div>

        <button
          onClick={handleContinue}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer whitespace-nowrap text-sm"
        >
          <span>Step 2: In-Order Practice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
