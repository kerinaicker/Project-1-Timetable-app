/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenState =
  | 'login'
  | 'select_table'
  | 'step_counting'
  | 'step_in_order'
  | 'step_out_of_order'
  | 'test'
  | 'retest'
  | 'completed';

export interface QuestionItem {
  id: string;
  multiplier: number; // e.g., 4 in 4 x 3
  baseTable: number;  // e.g., 3 in 4 x 3
  correctAnswer: number;
}

export interface QuestionAttempt {
  question: QuestionItem;
  userAnswer: number | null;
  isCorrect: boolean;
  timeSpentMs?: number;
}

export interface TestSessionResult {
  tableNumber: number;
  totalQuestions: number;
  correctCount: number;
  attempts: QuestionAttempt[];
  missedQuestions: QuestionItem[];
  roundNumber: number; // 0 for initial test, 1+ for retests
}

export interface LearnerProgress {
  name: string;
  completedTables: number[]; // e.g. [2, 3, 5]
  soundEnabled: boolean;
}
