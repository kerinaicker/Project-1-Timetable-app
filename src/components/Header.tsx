/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, RotateCcw, User, ArrowLeft } from 'lucide-react';
import { ScreenState } from '../types.ts';

interface HeaderProps {
  learnerName: string;
  currentScreen: ScreenState;
  selectedTable: number | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSwitchTable: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  learnerName,
  currentScreen,
  selectedTable,
  soundEnabled,
  onToggleSound,
  onSwitchTable,
  onSignOut,
}) => {
  const steps = [
    { id: 'select_table', label: 'Select Table' },
    { id: 'step_counting', label: '1. Counting' },
    { id: 'step_in_order', label: '2. In-Order' },
    { id: 'step_out_of_order', label: '3. Shuffled' },
    { id: 'test', label: '4. Test' },
  ];

  const getStepIndex = (screen: ScreenState) => {
    if (screen === 'select_table') return 0;
    if (screen === 'step_counting') return 1;
    if (screen === 'step_in_order') return 2;
    if (screen === 'step_out_of_order') return 3;
    if (screen === 'test' || screen === 'retest' || screen === 'completed') return 4;
    return -1;
  };

  const currentStepIdx = getStepIndex(currentScreen);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            if (learnerName && currentScreen !== 'login') {
              onSwitchTable();
            }
          }}
          className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-display hover:text-indigo-600 transition-colors whitespace-nowrap text-left"
          title="Return to Times Table Selection"
        >
          Times Tables Master
        </button>

        {/* Zone 2: Flow breadcrumb / nav links */}
        {learnerName && currentScreen !== 'login' && (
          <nav
            aria-label="Progress Breadcrumb"
            className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500"
          >
            {steps.map((st, i) => {
              const isActive = currentStepIdx === i;
              const isPast = currentStepIdx > i;
              return (
                <React.Fragment key={st.id}>
                  {i > 0 && <span className="text-slate-300" aria-hidden="true">→</span>}
                  <span
                    className={`transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-indigo-600 font-semibold'
                        : isPast
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {learnerName && currentScreen !== 'login' && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100/90 py-1.5 px-3 rounded-lg border border-slate-200">
              <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate max-w-[120px]">{learnerName}</span>
            </div>
          )}

          {learnerName && selectedTable !== null && currentScreen !== 'select_table' && currentScreen !== 'login' && (
            <button
              onClick={onSwitchTable}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors whitespace-nowrap"
              title="Pick a different times table"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Change Table</span>
              <span className="sm:hidden">{selectedTable}×</span>
            </button>
          )}

          {/* Sound toggle button */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute audio sound effects' : 'Unmute audio sound effects'}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title={soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {learnerName && currentScreen !== 'login' && (
            <button
              onClick={onSignOut}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Switch user"
              aria-label="Switch user"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
