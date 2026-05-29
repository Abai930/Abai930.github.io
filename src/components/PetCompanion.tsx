/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Battery, Sparkles, Smile, Star, Trophy, BookOpen, Coffee, HelpCircle } from 'lucide-react';
import { PetState, ScheduleItem } from '../types';
import { PET_DIALOGUES } from '../data';

interface PetCompanionProps {
  petState: PetState;
  setPetState: React.Dispatch<React.SetStateAction<PetState>>;
  scheduleList: ScheduleItem[];
}

export default function PetCompanion({ petState, setPetState, scheduleList }: PetCompanionProps) {
  const [bubbleText, setBubbleText] = useState<string>(
    '忙完了嗎？摸我一下！今天的事項都做完了嗎？超棒的！🐶'
  );
  const [animationTrigger, setAnimationTrigger] = useState<string>('idle');
  const [cleanSparkles, setCleanSparkles] = useState(false);

  // Stats calculation
  const totalTasksToday = scheduleList.filter(t => t.date === '2026-05-22').length;
  const completedTasksToday = scheduleList.filter(t => t.date === '2026-05-22' && t.completed).length;

  const triggerDialogue = (category: keyof typeof PET_DIALOGUES) => {
    const list = PET_DIALOGUES[category];
    const item = list[Math.floor(Math.random() * list.length)];
    setBubbleText(item);
  };

  const handleFeed = () => {
    setAnimationTrigger('eating');
    triggerDialogue('fed');

    setPetState(prev => {
      const nextEnergy = Math.min(100, prev.energy + 15);
      const nextHappiness = Math.min(100, prev.happiness + 10);
      const nextExp = prev.exp + 5;
      
      let nextLevel = prev.level;
      let currMaxExp = prev.maxExp;
      let finalExp = nextExp;

      if (nextExp >= currMaxExp) {
        nextLevel += 1;
        finalExp = nextExp - currMaxExp;
        currMaxExp = Math.floor(currMaxExp * 1.5);
        setBubbleText('🐶 哇咧！我升級了耶！主人超讚的，感謝你帶我一起打拼！🏆');
      }

      return {
        ...prev,
        energy: nextEnergy,
        happiness: nextHappiness,
        exp: finalExp,
        maxExp: currMaxExp,
        level: nextLevel,
        statusText: nextEnergy > 80 ? '活力爆棚 ⚡' : '飽餐一頓中 🍯',
        moodEmoji: '💖'
      };
    });

    setTimeout(() => setAnimationTrigger('idle'), 1200);
  };

  const handlePet = () => {
    setAnimationTrigger('happy');
    triggerDialogue('pet');

    setPetState(prev => {
      const nextHappiness = Math.min(100, prev.happiness + 20);
      return {
        ...prev,
        happiness: nextHappiness,
        moodEmoji: '🥰',
        statusText: '被主人摸摸超開心！'
      };
    });

    setTimeout(() => setAnimationTrigger('idle'), 1500);
  };

  const handleClean = () => {
    setAnimationTrigger('happy');
    setCleanSparkles(true);
    setBubbleText('🧹 沙沙沙... 家裡亮晶晶！我的心情又好起來了！✨');

    setPetState(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      statusText: '乾乾淨淨超舒爽 🧼'
    }));

    setTimeout(() => {
      setCleanSparkles(false);
      setAnimationTrigger('idle');
    }, 1800);
  };

  const handleChat = () => {
    setAnimationTrigger('bounce');
    triggerDialogue('idle');

    setPetState(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 3)
    }));

    setTimeout(() => setAnimationTrigger('idle'), 1000);
  };

  // Level progress percentage
  const expPercentage = Math.min(100, (petState.exp / petState.maxExp) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="pet-office">
      
      {/* Left Area: Digital Pet Mascot View Frame with Live Animations */}
      <div className="md:col-span-7 bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[420px]">
        {/* Notebook grid line backing */}
        <div className="absolute inset-0 bg-grid-[#BDB09E]/10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#F2EEE7 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

        {/* Level Banner */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-600 text-white font-serif font-semibold px-3 py-1 text-xs rounded-full shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-100" />
              <span>手帳守護犬：阿吉 (阿吉)</span>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-mono font-bold">LV. {petState.level}</span>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-amber-800/40 uppercase font-mono font-bold leading-none">Task Level bonus</p>
            <p className="text-[11px] font-bold text-amber-900 mt-1 font-serif">
              今日進度：{completedTasksToday} / {totalTasksToday} 項已完成
            </p>
          </div>
        </div>

        {/* Mascot + Speech Bubble center */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-10">
          
          {/* Sparkles effect for sweeps */}
          <AnimatePresence>
            {cleanSparkles && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              >
                <div className="relative w-48 h-48">
                  <span className="absolute text-2xl top-4 left-10 animate-ping">✨</span>
                  <span className="absolute text-xl bottom-6 right-12 animate-ping animate-duration-700">✨</span>
                  <span className="absolute text-3xl bottom-10 left-6 animate-pulse">🧹</span>
                  <span className="absolute text-2xl top-1/2 right-4 animate-ping">🧼</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Dialogue Bubble */}
          <div className="max-w-[340px] bg-white border-2 border-[#D2C5B4] rounded-2xl p-3 shadow-md mb-6 relative animate-bounce animate-duration-1000 select-none">
            <p className="text-xs text-amber-950 font-serif font-medium leading-relaxed">
              {completedTasksToday === totalTasksToday && totalTasksToday > 0 ? (
                <span>🏆 哇！主人今日全部完工！太神啦～ 摸摸我，阿吉給你的手帳貼一千萬個讚！</span>
              ) : (
                bubbleText
              )}
            </p>
            {/* Dialogue bubble arrow tail */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-[#D2C5B4] rotate-45" />
          </div>

          {/* Shiba Inu Interactive Mascot Container */}
          <motion.div
            animate={
              animationTrigger === 'eating'
                ? { scale: [1, 1.1, 1, 1.1, 1], rotate: [0, -4, 4, -4, 0] }
                : animationTrigger === 'happy'
                ? { y: [0, -15, 0, -15, 0], scale: [1, 1.05, 1, 1.05, 1] }
                : animationTrigger === 'bounce'
                ? { y: [0, -20, 0] }
                : {}
            }
            transition={{ duration: 0.8 }}
            className="w-36 h-36 bg-amber-50 rounded-full border-4 border-dashed border-amber-300 shadow-inner flex items-center justify-center p-3 relative bg-amber-100/30"
          >
            <img
              src="/src/assets/images/cute_shiba_mascot_1779419365956.png"
              alt="柴柴阿吉門牌"
              className="w-full h-full object-contain filter drop-shadow-md select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* EXP progress bar bottom */}
        <div className="relative z-10 border-t border-[#EBE3D5] pt-3 mt-4">
          <div className="flex items-center justify-between text-xs text-amber-950 mb-1.5 font-semibold font-serif">
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>阿吉手帳守護經驗：</span>
            </span>
            <span className="font-mono text-[11px] text-[#A69986]">{petState.exp} / {petState.maxExp} EXP</span>
          </div>

          <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden border">
            <motion.div
              className="h-full bg-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${expPercentage}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <p className="text-[10px] text-amber-800/50 mt-1 font-serif text-center">
            💡 <span className="font-semibold">升級秘訣</span>：每當您把日曆上的代辦行程打勾 (完成) 時，阿吉都會獲得經驗值累積喔！
          </p>
        </div>

      </div>

      {/* Right Area: Pet Control Console (Feed, Pet, Sweep actions) */}
      <div className="md:col-span-5 flex flex-col justify-between bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-3xl p-6 shadow-sm">
        
        <div>
          <h3 className="font-serif text-base font-bold text-amber-950 mb-4 flex items-center gap-1.5 border-b pb-2">
            <Smile className="w-5 h-5 text-amber-800" />
            <span>阿吉數值狀態</span>
          </h3>

          <div className="space-y-4">
            {/* Status 1: Happiness */}
            <div>
              <div className="flex items-center justify-between text-xs text-amber-950 mb-1 font-bold font-serif">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
                  <span>幸福度 (決定貼紙稀有加乘)：</span>
                </span>
                <span className="font-mono text-rose-700">{petState.happiness} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${petState.happiness}%` }}
                />
              </div>
            </div>

            {/* Status 2: Energy */}
            <div>
              <div className="flex items-center justify-between text-xs text-amber-950 mb-1 font-bold font-serif">
                <span className="flex items-center gap-1">
                  <Battery className="w-4 h-4 text-emerald-500" />
                  <span>飽食體力：</span>
                </span>
                <span className="font-mono text-emerald-700">{petState.energy} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${petState.energy}%` }}
                />
              </div>
            </div>

            {/* Current statement description status */}
            <div className="p-3 bg-amber-50/50 rounded-2xl border border-dashed text-xs text-amber-900 font-serif leading-relaxed">
              🐾 <span className="font-bold">目前阿吉狀態</span>：{petState.statusText} • 心情值為：{petState.moodEmoji}。
              阿吉高興時，一鍵導出桌面將會有隨機的精美手札裝飾浮水、咖啡貼紙被照映出来。
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="mt-6 pt-4 border-t border-[#EBE3D5] space-y-2.5">
          <h4 className="font-serif text-xs font-bold text-amber-950 mb-2">互動項目</h4>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleFeed}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-serif font-semibold py-2.5 px-3 rounded-xl border border-amber-300 flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95"
            >
              <Coffee className="w-4 h-4 text-amber-700" />
              <span>餵食小餅乾 🍯</span>
            </button>

            <button
              onClick={handlePet}
              className="bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-serif font-semibold py-2.5 px-3 rounded-xl border border-rose-200 flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95"
            >
              <Smile className="w-4 h-4 text-rose-500" />
              <span>摸摸頭安慰 👋</span>
            </button>

            <button
              onClick={handleClean}
              className="bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-serif font-semibold py-2.5 px-3 rounded-xl border border-sky-200 flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>打掃狗屋環境 🧹</span>
            </button>

            <button
              onClick={handleChat}
              className="bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-serif font-semibold py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-neutral-500" />
              <span>跟阿吉扯淡 💬</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
