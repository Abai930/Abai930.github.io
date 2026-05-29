/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScheduleItem, MarketItem, CanvasSticker } from './types';

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 's1',
    title: '錄音備忘：買杯熱黑糖拿鐵，今天天氣好晴朗 ☕',
    time: '08:30',
    completed: true,
    type: 'personal',
    note: '手語轉錄成功，自動轉換至早安行程！',
    date: '2026-05-22',
  },
  {
    id: 's2',
    title: '帶柴柴(阿吉)去動物醫院打預防針 🐕',
    time: '10:00',
    completed: true,
    type: 'pet',
    note: '阿吉今天很乖沒有亂叫，餵了兩個零食',
    date: '2026-05-22',
  },
  {
    id: 's3',
    title: '與獨立插畫插畫家巧芯進行線上手帳風格授權討論',
    time: '14:30',
    completed: false,
    type: 'work',
    note: '準備簡報，討論 20% 分潤方案與背景規格。',
    date: '2026-05-22',
  },
  {
    id: 's4',
    title: '和俊億慶祝期末專題發表成功 🎉',
    time: '19:00',
    completed: false,
    type: 'social',
    note: '記得帶他最喜歡的手繪插畫卡片！',
    date: '2026-05-22',
  },
  {
    id: 's5',
    title: '錄製本週個人心靈手帳隨筆 🎙️',
    time: '22:30',
    completed: false,
    type: 'personal',
    note: '睡前放鬆用語音快速記錄一天的感謝。',
    date: '2026-05-22',
  },
  // Future dates
  {
    id: 's6',
    title: '整理手帳風桌面並發布到社群分享 📸',
    time: '11:00',
    completed: false,
    type: 'social',
    date: '2026-05-23',
  },
  {
    id: 's7',
    title: '柴柴阿吉一週健康狀態確認與美容',
    time: '15:00',
    completed: false,
    type: 'pet',
    date: '2026-05-24',
  }
];

export const MARKET_ITEMS: MarketItem[] = [
  {
    id: 'm1',
    name: '巧芯的暖洋洋手繪熊熊貼紙包',
    creator: '袁巧芯',
    avatarColor: 'from-amber-200 to-orange-300',
    category: 'sticker',
    price: 'NT$30',
    stars: 4.9,
    downloads: '1.2k',
    isUnlocked: false,
  },
  {
    id: 'm2',
    name: '文青必備！昭和復古木質手帳背景',
    creator: '風格工坊',
    avatarColor: 'from-amber-600 to-amber-800',
    category: 'background',
    price: 'NT$45',
    stars: 4.8,
    downloads: '850',
    isUnlocked: false,
  },
  {
    id: 'm3',
    name: '太空柴柴全套桌面小組件',
    creator: '余俊億',
    avatarColor: 'from-indigo-300 to-purple-400',
    category: 'widget',
    price: '免費',
    stars: 5.0,
    downloads: '3.4k',
    isUnlocked: true,
  },
  {
    id: 'm4',
    name: '圓滾滾麻糬手寫字體',
    creator: '貓咪打字機',
    avatarColor: 'from-emerald-200 to-teal-300',
    category: 'font',
    price: 'NT$35',
    stars: 4.7,
    downloads: '420',
    isUnlocked: false,
  },
  {
    id: 'm5',
    name: '微雨清晨莫蘭迪網格背景包',
    creator: '袁巧芯',
    avatarColor: 'from-amber-200 to-orange-300',
    category: 'background',
    price: '免費',
    stars: 4.9,
    downloads: '1.8k',
    isUnlocked: true,
  },
  {
    id: 'm6',
    name: '呆萌恐龍與小幸運草黏貼裝飾',
    creator: '俊億插畫',
    avatarColor: 'from-indigo-300 to-purple-400',
    category: 'sticker',
    price: 'NT$15',
    stars: 4.6,
    downloads: '640',
    isUnlocked: false,
  }
];

export const WALLPAPER_THEMES = [
  { id: 'cream', name: '暖心奶油格紋', bg: '#FFFDF0', border: '#E7DCC4', pattern: 'grid' },
  { id: 'peach', name: '浪漫蜜桃粉橘', bg: '#FFF0ED', border: '#F2D3CC', pattern: 'grid' },
  { id: 'forest', name: '愜意森林暖綠', bg: '#F1F6F0', border: '#CFDDC9', pattern: 'dots' },
  { id: 'lavender', name: '夢幻粉紫泡泡', bg: '#F5F3FA', border: '#DCD4E9', pattern: 'blank' },
  { id: 'cosmic', name: '深夜寂靜星芒', bg: '#292B30', border: '#4E525E', pattern: 'blank', isDark: true }
];

export const PET_DIALOGUES = {
  idle: [
    '今天的事項進行得怎麼樣了呀？加油喔！',
    '忙碌之餘，也要記得喝杯水休息一下～ 🍵',
    '摸摸我的手提日曆，今天我也陪你一起大忙！',
    '今天我們一起把代辦清單貼滿滿吧 🌟',
    '聽說巧芯老師上架了新的熊熊貼紙，好想要喔～'
  ],
  fed: [
    '嚼嚼嚼... 好吃！能量充滿！等一下更賣力幫你做手帳！ 🍯',
    '哇！這是愛心小點心嗎？我的幸福感提升了！ ❤️',
    '呼～肚子飽飽，今天的行事曆交給我守護！'
  ],
  pet: [
    '嘿嘿，好舒服喔...（柴柴搖尾巴） 🐕',
    '我就知道你最疼我了！等下幫你把一鍵匯出的桌布畫得更漂亮！',
    '摸摸頭～充滿活力！今天的事情我們一起消滅它！'
  ],
  completedAll: [
    '太神奇了！今天的行程全部完成！給你一個超大讚卡片 🏆',
    '我們是最棒的夥伴！忙碌的日子過得非常有儀式感呢！'
  ]
};
