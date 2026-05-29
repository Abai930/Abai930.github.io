/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Image as ImageIcon, Heart, ShoppingBag, Clock, Sparkles } from 'lucide-react';

import { INITIAL_SCHEDULE, MARKET_ITEMS } from './data';
import { ScheduleItem, PetState, MarketItem } from './types';

// Importing our modular sub-components
import DailyScheduler from './components/DailyScheduler';
import WallpaperExporter from './components/WallpaperExporter';
import PetCompanion from './components/PetCompanion';
import StyleMarket from './components/StyleMarket';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<'diary' | 'wallpaper' | 'pet' | 'market'>('diary');
  const [selectedDate, setSelectedDate] = React.useState<string>('2026-05-22'); // Anchored on today's localized metadata date!
  const [scheduleList, setScheduleList] = React.useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [marketItems, setMarketItems] = React.useState<MarketItem[]>(MARKET_ITEMS);

  // Digital Pet persistent companionship state
  const [petState, setPetState] = React.useState<PetState>({
    name: '阿吉 (阿吉)',
    level: 2,
    exp: 15,
    maxExp: 45,
    happiness: 80,
    energy: 75,
    statusText: '在行事曆旁邊呼呼大睡中 💤',
    moodEmoji: '🐕',
  });

  // Simple clock state
  const [timeStr, setTimeStr] = React.useState<string>('03:07');

  useEffect(() => {
    // Tick current simulated clock (or follow localized clock ratio)
    const interval = setInterval(() => {
      const now = new Date();
      setTimeStr(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Completion task EXP trigger
  const triggerPetLevelUp = () => {
    setPetState(prev => {
      const addedExp = 12;
      const totalExp = prev.exp + addedExp;
      let currentLevel = prev.level;
      let currentMaxExp = prev.maxExp;
      let finalExp = totalExp;

      if (totalExp >= currentMaxExp) {
        currentLevel += 1;
        finalExp = totalExp - currentMaxExp;
        currentMaxExp = Math.floor(currentMaxExp * 1.5);
      }

      return {
        ...prev,
        level: currentLevel,
        exp: finalExp,
        maxExp: currentMaxExp,
        happiness: Math.min(100, prev.happiness + 15),
        statusText: '看到你完成代辦事項超有成就感！🚀',
      };
    });
  };

  // Get active selected schedules list for current day
  const currentDayEvents = scheduleList.filter(item => item.date === selectedDate);

  return (
    <div className="min-h-screen bg-[#FCFAF2] py-8 px-4 text-amber-950 font-sans relative antialiased selection:bg-amber-200/50 selection:text-amber-900" id="applet-core">
      
      {/* Handcrafted Ledger Visual details backing */}
      <div className="absolute top-0 left-0 w-full h-[15px] bg-[#EE6B60]/80 z-20 pointer-events-none" />
      <div className="absolute top-[15px] left-0 w-full h-[5px] bg-[#EE6B60]/30 z-20 pointer-events-none" />

      <main className="max-w-6xl mx-auto bg-[#FCFAF2] relative z-10" id="workspace-container">
        
        {/* Header Block with display handwriting style */}
        <header className="flex flex-col md:flex-row items-center justify-between border-b-2 border-dashed border-[#D2C5B4] pb-6 mb-8 gap-4">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-800/60 uppercase">
              ★ Busy Go-Getter Companion ★
            </span>
            <div className="flex items-center gap-2.5 mt-1 justify-center md:justify-start">
              <h1 className="text-3xl font-bold font-serif text-amber-950 tracking-tight">
                大忙人行程手帳
              </h1>
              <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 font-bold shadow-xs">
                手帳風風格管理
              </span>
            </div>
          </div>

          {/* Clock Card with actual time pairing to reflect high craft */}
          <div className="bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-2xl py-3 px-5 shadow-sm flex items-center gap-4 relative overflow-hidden">
            {/* Hanging clip pin simulation */}
            <div className="absolute top-0 left-4 w-2.5 h-1.5 bg-[#EE6B60]/70 rounded-b" />
            
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#8A7E6B]" />
              <div className="font-mono">
                <p className="text-[9px] text-amber-800/50 uppercase font-semibold">Current local time</p>
                <p className="text-sm font-bold tracking-tight text-amber-950 mt-0.5">2026 年 5 月 22 日</p>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-amber-200" />

            <div className="text-center font-mono">
              <span className="text-[9px] text-amber-800/50 block font-semibold">TICK-CLOCK</span>
              <span className="text-base font-bold text-amber-950">{timeStr}</span>
            </div>
          </div>
        </header>

        {/* Tab Selection Row (Simulating sticky bullet journal tabs) */}
        <div className="flex flex-wrap gap-2.5 mb-6 relative" id="tab-ribbon">
          <button
            onClick={() => setActiveTab('diary')}
            className={`flex items-center gap-1.5 px-5 py-3 rounded-2xl text-xs font-serif font-bold transition-all ${
              activeTab === 'diary'
                ? 'bg-amber-600 text-white shadow-md scale-102 border-2 border-amber-700'
                : 'bg-[#FFFDF9] border-2 border-[#D2C5B4] hover:bg-amber-50 text-amber-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>✍️ 每日日誌 & 行事曆</span>
          </button>

          <button
            onClick={() => setActiveTab('wallpaper')}
            className={`flex items-center gap-1.5 px-5 py-3 rounded-2xl text-xs font-serif font-bold transition-all ${
              activeTab === 'wallpaper'
                ? 'bg-[#E39074] text-white shadow-md scale-102 border-2 border-[#D47E61]'
                : 'bg-[#FFFDF9] border-2 border-[#D2C5B4] hover:bg-amber-50 text-amber-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>📱 一鍵匯出風格桌布</span>
          </button>

          <button
            onClick={() => setActiveTab('pet')}
            className={`flex items-center gap-1.5 px-5 py-3 rounded-2xl text-xs font-serif font-bold transition-all ${
              activeTab === 'pet'
                ? 'bg-[#6B9E78] text-white shadow-md scale-102 border-2 border-[#598C66]'
                : 'bg-[#FFFDF9] border-2 border-[#D2C5B4] hover:bg-amber-50 text-amber-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>🐾 柴柴阿吉辦公室</span>
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-1.5 px-5 py-3 rounded-2xl text-xs font-serif font-bold transition-all ${
              activeTab === 'market'
                ? 'bg-[#8F73A4] text-white shadow-md scale-102 border-2 border-[#795C8F]'
                : 'bg-[#FFFDF9] border-2 border-[#D2C5B4] hover:bg-amber-50 text-amber-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>🎨 創作者風格市集</span>
          </button>
        </div>

        {/* Dynamic Tab view rendering with animations */}
        <div className="relative mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="relative z-10"
            >
              {activeTab === 'diary' && (
                <DailyScheduler
                  scheduleList={scheduleList}
                  setScheduleList={setScheduleList}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  triggerPetLevelUp={triggerPetLevelUp}
                />
              )}

              {activeTab === 'wallpaper' && (
                <WallpaperExporter
                  currentDayEvents={currentDayEvents}
                  selectedDate={selectedDate}
                />
              )}

              {activeTab === 'pet' && (
                <PetCompanion
                  petState={petState}
                  setPetState={setPetState}
                  scheduleList={scheduleList}
                />
              )}

              {activeTab === 'market' && (
                <StyleMarket
                  marketItems={marketItems}
                  setMarketItems={setMarketItems}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Unified, Humble footer without unrequested system ports or developer details */}
        <footer className="border-t border-[#D2C5B4] pt-6 pb-12 flex flex-col md:flex-row items-center justify-between text-[#8E7E6A] text-xs gap-4 xl:px-2 relative">
          <div className="flex items-center gap-2 font-serif font-bold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>大忙人行程手帳 (Busy Go-Getter's Ledger)</span>
          </div>
          <p className="font-mono text-[10px] opacity-75">
            Designed for 袁巧芯 (113707201) & 余俊億 (114102524) • Copyright 2026.
          </p>
        </footer>
      </main>

    </div>
  );
}
