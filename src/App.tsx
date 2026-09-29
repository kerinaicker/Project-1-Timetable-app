/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenState, TestSessionResult, QuestionItem } from './types.ts';
import { soundManager } from './utils/audio.ts';
import { Header } from './components/Header.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';
import { TableSelectScreen } from './components/TableSelectScreen.tsx';
import { Step1CountingScreen } from './components/Step1CountingScreen.tsx';
import { Step2InOrderScreen } from './components/Step2InOrderScreen.tsx';
import { Step3OutOfOrderScreen } from './components/Step3OutOfOrderScreen.tsx';
import { TestScreen } from './components/TestScreen.tsx';
import { ResultsScreen } from './components/ResultsScreen.tsx';
import { CompletionScreen } from './components/CompletionScreen.tsx';

export default function App() {
  const [learnerName, setLearnerName] = useState<string>(() => {
    return localStorage.getItem('ttm_learner_name') || '';
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenState>(() => {
    const savedName = localStorage.getItem('ttm_learner_name');
    return savedName ? 'select_table' : 'login';
  });

  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [completedTables, setCompletedTables] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('ttm_completed_tables');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundManager.isEnabled());

  // Test & Retest state
  const [lastResult, setLastResult] = useState<TestSessionResult | null>(null);
  const [retestQuestions, setRetestQuestions] = useState<QuestionItem[]>([]);
  const [retestRound, setRetestRound] = useState<number>(0);
  const [totalAttemptsCount, setTotalAttemptsCount] = useState<number>(0);

  // Sync completed tables to localStorage
  useEffect(() => {
    localStorage.setItem('ttm_completed_tables', JSON.stringify(completedTables));
  }, [completedTables]);

  const handleLogin = (name: string) => {
    setLearnerName(name);
    localStorage.setItem('ttm_learner_name', name);
    setCurrentScreen('select_table');
  };

  const handleSignOut = () => {
    setLearnerName('');
    localStorage.removeItem('ttm_learner_name');
    setSelectedTable(null);
    setCurrentScreen('login');
  };

  const handleToggleSound = () => {
    const newVal = soundManager.toggle();
    setSoundEnabled(newVal);
  };

  const handleSelectTable = (num: number) => {
    setSelectedTable(num);
    setRetestRound(0);
    setLastResult(null);
    setRetestQuestions([]);
    setCurrentScreen('step_counting');
  };

  const handleSwitchTable = () => {
    setSelectedTable(null);
    setCurrentScreen('select_table');
  };

  // Step 1 -> Step 2
  const handleStep1Complete = () => {
    setCurrentScreen('step_in_order');
  };

  // Step 2 -> Step 3
  const handleStep2Complete = () => {
    setCurrentScreen('step_out_of_order');
  };

  // Step 3 -> Test
  const handleStep3Complete = () => {
    setRetestRound(0);
    setRetestQuestions([]);
    setCurrentScreen('test');
  };

  // Test finished (either initial test or retest)
  const handleTestFinished = (result: TestSessionResult) => {
    setTotalAttemptsCount((prev) => prev + result.totalQuestions);
    setLastResult(result);

    if (result.missedQuestions.length === 0) {
      // 100% correct! Add table to completed list if not already
      if (selectedTable !== null && !completedTables.includes(selectedTable)) {
        setCompletedTables((prev) => [...prev, selectedTable]);
      }
      setCurrentScreen('completed');
    } else {
      // Has missed questions, show results and allow retest
      setRetestQuestions(result.missedQuestions);
      // We will render results screen via 'test' with result or a dedicated screen
      // We can use a screen state for results
      setCurrentScreen('retest'); // We will show results or retest
    }
  };

  // Triggering retest from results
  const handleStartRetestRound = () => {
    if (!lastResult) return;
    setRetestQuestions(lastResult.missedQuestions);
    setRetestRound((prev) => prev + 1);
    // Switch to retest running state
    setCurrentScreen('test');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Header
        learnerName={learnerName}
        currentScreen={currentScreen}
        selectedTable={selectedTable}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onSwitchTable={handleSwitchTable}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 flex flex-col">
        {currentScreen === 'login' && (
          <LoginScreen initialName={learnerName} onLogin={handleLogin} />
        )}

        {currentScreen === 'select_table' && (
          <TableSelectScreen
            learnerName={learnerName}
            completedTables={completedTables}
            onSelectTable={handleSelectTable}
          />
        )}

        {currentScreen === 'step_counting' && selectedTable !== null && (
          <Step1CountingScreen
            tableNumber={selectedTable}
            learnerName={learnerName}
            onNextStep={handleStep1Complete}
            onBackToTables={handleSwitchTable}
          />
        )}

        {currentScreen === 'step_in_order' && selectedTable !== null && (
          <Step2InOrderScreen
            tableNumber={selectedTable}
            learnerName={learnerName}
            onNextStep={handleStep2Complete}
            onPrevStep={() => setCurrentScreen('step_counting')}
          />
        )}

        {currentScreen === 'step_out_of_order' && selectedTable !== null && (
          <Step3OutOfOrderScreen
            tableNumber={selectedTable}
            learnerName={learnerName}
            onNextStep={handleStep3Complete}
            onPrevStep={() => setCurrentScreen('step_in_order')}
          />
        )}

        {/* Regular test or active retest run */}
        {currentScreen === 'test' && selectedTable !== null && (
          <TestScreen
            tableNumber={selectedTable}
            learnerName={learnerName}
            isRetest={retestRound > 0 && retestQuestions.length > 0}
            roundNumber={retestRound}
            customQuestions={retestRound > 0 ? retestQuestions : undefined}
            onFinishTest={handleTestFinished}
            onCancelTest={handleSwitchTable}
          />
        )}

        {/* Results Screen after test/retest with missed questions */}
        {currentScreen === 'retest' && lastResult && (
          <ResultsScreen
            result={lastResult}
            learnerName={learnerName}
            onStartRetest={handleStartRetestRound}
            onGoToCompletion={() => setCurrentScreen('completed')}
            onReviewSteps={() => setCurrentScreen('step_counting')}
            onChooseOtherTable={handleSwitchTable}
          />
        )}

        {/* Completion Screen when 100% mastery reached */}
        {currentScreen === 'completed' && selectedTable !== null && (
          <CompletionScreen
            tableNumber={selectedTable}
            learnerName={learnerName}
            totalAttemptsCount={totalAttemptsCount}
            retestRoundsCount={retestRound}
            onChooseNewTable={handleSwitchTable}
            onRetakeTest={() => {
              setRetestRound(0);
              setRetestQuestions([]);
              setLastResult(null);
              setCurrentScreen('test');
            }}
          />
        )}
      </main>

      {/* Quiet, minimalist footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-4 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Times Tables Master · Practice and memorize multiplication 1 to 12</span>
          <span>Adaptive retesting loop ensures 100% mastery</span>
        </div>
      </footer>
    </div>
  );
}
