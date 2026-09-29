/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, BookOpen, CheckCircle2, Trophy } from 'lucide-react';
import { soundManager } from '../utils/audio.ts';

interface LoginScreenProps {
  initialName: string;
  onLogin: (name: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ initialName, onLogin }) => {
  const [name, setName] = useState(initialName || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Please enter your first name to begin.');
      soundManager.playIncorrect();
      return;
    }
    if (cleanName.length > 24) {
      setError('Please enter a shorter first name.');
      return;
    }
    soundManager.playStep();
    onLogin(cleanName);
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 text-center">
        {/* Playful badge icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <BookOpen className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mb-2">
          Master Your Times Tables
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-md mx-auto">
          Learn numbers 1 through 12 step by step with counting, guided practice, and smart retesting.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto text-left">
          <div>
            <label
              htmlFor="learner-name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Learner's First Name
            </label>
            <input
              id="learner-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Maya or Oliver"
              autoFocus
              autoComplete="given-name"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400 text-base"
            />
            {error && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm text-base cursor-pointer"
          >
            <span>Let's Start Practicing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-3 gap-3 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1 to 3</span>
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              Skip-counting, in-order, and shuffled review
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Typed Test</span>
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              Type your answers for all 12 questions
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Smart Retest</span>
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              Target missed questions until 100% correct
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
