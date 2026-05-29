/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScheduleItem {
  id: string;
  title: string;
  time: string; // e.g., "14:00" or "09:30"
  completed: boolean;
  type: 'work' | 'personal' | 'health' | 'pet' | 'social';
  note?: string;
  date: string; // "YYYY-MM-DD"
}

export interface PetState {
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  happiness: number; // 0 - 100
  energy: number; // 0 - 100
  statusText: string;
  moodEmoji: string;
}

export interface MarketItem {
  id: string;
  name: string;
  creator: string;
  avatarColor: string;
  category: 'sticker' | 'font' | 'background' | 'widget';
  price: string; // Free or "NT$30"
  stars: number;
  downloads: string;
  isUnlocked: boolean;
}

export interface CanvasSticker {
  id: string;
  type: string; // 'star' | 'heart' | 'tape' | 'pet' | 'coffee' | 'flower'
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  scale: number; // e.g., 1.0, 1.2
  rotate: number; // in degrees
}
