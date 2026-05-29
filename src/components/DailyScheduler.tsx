/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Mic, Plus, Trash2, CheckCircle, Clock, Volume2, Sparkles, BookOpen } from 'lucide-react';
import { ScheduleItem } from '../types';

interface DailySchedulerProps {
  scheduleList: ScheduleItem[];
  setScheduleList: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  triggerPetLevelUp: () => void;
}

export default function DailyScheduler({
  scheduleList,
  setScheduleList,
  selectedDate,
  setSelectedDate,
  triggerPetLevelUp,
}: DailySchedulerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('12:00');
  const [newType, setNewType] = useState<ScheduleItem['type']>('personal');
  const [newNote, setNewNote] = useState('');

  // Voice recording mock phrases to cycle through
  const MOCK_PHRASES = [
    '錄音：今天下午 2 點和俊億約在轉角的咖啡廳，還要買他的生日禮物 🎁',
    '錄音：10:30 要回報主管專案簡報，帶幾本美觀的手帳範例過去 💼',
    '錄音：晚上 8:00 吃完晚餐記得陪阿吉玩飛盤 🥏',
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);

  // May 2026 details (May 1st is Friday)
  const totalDaysInMay = 31;
  const startDayOffset = 5; // Friday is offset 5 in 0-indexed Sun-Sat week

  const calendarDays = Array.from({ length: totalDaysInMay }, (_, i) => i + 1);
  const emptyPreSlots = Array.from({ length: startDayOffset }, (_, i) => i);

  // Group events by date for calendar dots
  const getEventDotsForDay = (day: number) => {
    const dateStr = `2026-05-${day.toString().padStart(2, '0')}`;
    const dayEvents = scheduleList.filter(s => s.date === dateStr);
    return dayEvents.slice(0, 3); // Max 3 dots for visual safety
  };

  const currentDayEvents = scheduleList.filter(s => s.date === selectedDate);

  const toggleTask = (id: string) => {
    let completedStateChangedToTrue = false;
    setScheduleList(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (!item.completed) completedStateChangedToTrue = true;
          return { ...item, completed: !item.completed };
        }
        return item;
      })
    );
    if (completedStateChangedToTrue) {
      triggerPetLevelUp();
    }
  };

  const deleteTask = (id: string) => {
    setScheduleList(prev => prev.filter(item => item.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: ScheduleItem = {
      id: `task-${Date.now()}`,
      title: newTitle,
      time: newTime,
      completed: false,
      type: newType,
      note: newNote || undefined,
      date: selectedDate,
    };

    setScheduleList(prev => [...prev, newTask]);
    setNewTitle('');
    setNewNote('');
  };

  // Simulate Voice Dictation Dictator
  const startVoiceRecording = () => {
    setIsRecording(true);
    setVoiceText('正在偵聽語音中...');
    
    // Simulate speaking process
    setTimeout(() => {
      const selectedPhrase = MOCK_PHRASES[phraseIndex % MOCK_PHRASES.length];
      setVoiceText(selectedPhrase);
      setPhraseIndex(prev => prev + 1);

      // Auto translate/parse simulated dictation and add schedule item after 2.5s
      setTimeout(() => {
        setIsRecording(false);
        // Dumb parser to extract time and contents
        let parsedTime = '15:00';
        let cleanTitle = selectedPhrase.replace('錄音：', '');
        
        if (selectedPhrase.includes('下午 2 點')) parsedTime = '14:00';
        if (selectedPhrase.includes('10:30')) parsedTime = '10:30';
        if (selectedPhrase.includes('晚上 8:00')) parsedTime = '20:00';

        const voiceTask: ScheduleItem = {
          id: `voice-${Date.now()}`,
          title: cleanTitle,
          time: parsedTime,
          completed: false,
          type: selectedPhrase.includes('阿吉') ? 'pet' : selectedPhrase.includes('專案') ? 'work' : 'personal',
          note: '🎙️ 行程用語音錄音快速轉錄產出',
          date: selectedDate,
        };

        setScheduleList(prev => [...prev, voiceTask]);
        setVoiceText('');
      }, 1500);

    }, 1800);
  };

  const getBadgeStyle = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'work':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pet':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'health':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'social':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-pink-100 text-pink-700 border-pink-200';
    }
  };

  const getTypeName = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'work': return '👔 工作';
      case 'pet': return '🐾 寵物';
      case 'health': return '🏃 健康';
      case 'social': return '👥 社交';
      default: return '🍎 生活';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="scheduler-panel">
      {/* Left Column: Hand-drawn Monthly Calendar Grid */}
      <div className="lg:col-span-5 bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-3xl p-5 shadow-sm relative overflow-hidden">
        {/* Tape Decor */}
        <div className="absolute top-0 right-10 w-24 h-6 bg-amber-100/60 skew-x-6 border-b border-[#E1D4AF] flex items-center justify-center text-[9px] text-amber-800 font-mono tracking-widest pointer-events-none uppercase">Washi Tape</div>
        
        <div className="flex items-center justify-between mb-4 border-b-2 border-dashed border-[#D2C5B4] pb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-800" />
            <span className="font-serif text-lg font-bold text-amber-900">2026 年 5 月</span>
          </div>
          <span className="text-xs bg-amber-100 px-2.5 py-1 text-amber-800 rounded-full font-serif font-semibold">手帳格紋版面</span>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs font-bold text-amber-800/70 mb-2">
          <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {emptyPreSlots.map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square bg-transparent" />
          ))}

          {calendarDays.map((day) => {
            const dateStr = `2026-05-${day.toString().padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;
            const dots = getEventDotsForDay(day);

            return (
              <button
                key={`day-${day}`}
                id={`cal-day-${day}`}
                onClick={() => setSelectedDate(dateStr)}
                className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-between text-xs font-semibold relative transition-all border ${
                  isSelected
                    ? 'bg-amber-100 border-[#C1B296] text-amber-950 scale-105 shadow-inner ring-2 ring-[#CDAF95]/45'
                    : 'bg-amber-50/20 border-transparent hover:bg-amber-100/35 text-amber-900/80'
                }`}
              >
                <span>{day}</span>
                {/* Event Dots */}
                <div className="flex gap-0.5 mt-auto">
                  {dots.map((dot, dIdx) => (
                    <span
                      key={dIdx}
                      className={`w-1.5 h-1.5 rounded-full ${
                        dot.completed ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 p-2 bg-amber-50/50 rounded-xl border border-dashed border-[#D2C5B4] text-[11px] text-amber-800/90 leading-relaxed font-serif">
          💡 <span className="font-semibold">操作指引</span>：在上方日曆點選日期即可切換行程。底下有綠點表示已有規劃，綠色代表已圓滿完成，紅色則是待辦喔。
        </div>
      </div>

      {/* Right Column: Actvity Schedule of the Selected Day */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        
        {/* Daily Memo container */}
        <div className="bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-3xl p-5 shadow-sm relative overflow-hidden flex-1">
          {/* Notebook Grid Accent */}
          <div className="absolute inset-0 bg-grid-[#BDB09E]/10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#EFEAE2 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

          <div className="relative z-10 flex items-center justify-between border-b border-[#EBE3D5] pb-3 mb-4">
            <div>
              <p className="text-xs font-mono text-amber-800/60 font-semibold tracking-wider uppercase">Today Note</p>
              <h3 className="font-serif text-lg font-bold text-amber-900">
                {selectedDate === '2026-05-22' ? '⭐ 2026年5月22日 (今天)' : `📅 2026年5月${selectedDate.slice(-2)}日`}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded border border-[#E1D4FA]">
                {currentDayEvents.filter(t => t.completed).length} / {currentDayEvents.length} 已完成
              </span>
            </div>
          </div>

          {/* Schedule List */}
          <div className="relative z-10 space-y-3 max-h-[300px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {currentDayEvents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center rounded-2xl border border-dashed border-[#E1D8CC] bg-amber-50/10 flex flex-col items-center justify-center gap-2"
                >
                  <BookOpen className="w-8 h-8 text-amber-800/40" />
                  <p className="font-serif text-sm text-amber-800/60">今天很悠閒，還沒有安排手帳行程呢！</p>
                  <p className="text-[11px] text-amber-800/40">點擊下方「快速新增行程」或使用「語音錄音」吧</p>
                </motion.div>
              ) : (
                currentDayEvents.map(task => (
                  <motion.div
                    key={task.id}
                    layoutId={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all ${
                      task.completed
                        ? 'bg-emerald-50/40 border-emerald-100/80 hover:bg-emerald-50'
                        : 'bg-white border-[#E9E1D2] hover:border-amber-400/60 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 rounded-full p-0.5 flex items-center justify-center transition-all ${
                          task.completed
                            ? 'text-emerald-500 hover:text-emerald-600'
                            : 'text-[#C7BCAB] hover:text-amber-500'
                        }`}
                      >
                        <CheckCircle className={`w-5.5 h-5.5 ${task.completed ? 'fill-emerald-100/60' : 'fill-none'}`} />
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${getBadgeStyle(task.type)}`}>
                            {getTypeName(task.type)}
                          </span>
                          <span className="text-xs text-amber-900/40 font-mono font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-800/50" /> {task.time}
                          </span>
                        </div>
                        <h4 className={`text-sm font-semibold tracking-tight ${task.completed ? 'line-through text-amber-900/40' : 'text-amber-950'}`}>
                          {task.title}
                        </h4>
                        {task.note && (
                          <p className="text-[11px] text-amber-800/60 bg-amber-50/50 p-1.5 rounded-lg border border-amber-100/30 font-mono mt-1.5">
                            {task.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-[#C7BCAB] hover:text-rose-500 p-1.5 rounded-xl transition-colors hover:bg-rose-50 self-center"
                      title="刪除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Live Voice Memo Simulation Box */}
        <div className="bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-3xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-serif text-sm font-bold text-amber-950 flex items-center gap-2">
              <Mic className="w-4 h-4 text-rose-500" />
              <span>智能手動語音記事 🎙️</span>
            </h4>
            <span className="text-[10px] text-[#A69986] bg-amber-50 px-2 py-0.5 rounded border border-[#E9E1D2]">
              免打字一秒自動生成
            </span>
          </div>

          <p className="text-xs text-amber-800/60 mb-3 font-serif">
            大忙人口頭說出行程，系統會以 Gemini 語音模型自動分析時間、標題、與分類貼紙。
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={startVoiceRecording}
              disabled={isRecording}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-bold font-serif text-xs transition-all shadow-sm ${
                isRecording
                  ? 'bg-rose-100 border border-rose-300 text-rose-800 animate-pulse'
                  : 'bg-rose-500 hover:bg-rose-600 text-white hover:shadow-md'
              }`}
            >
              {isRecording ? (
                <>
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span>聆聽錄音中...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>點我模擬錄製語音</span>
                </>
              )}
            </button>

            <div className="flex-1 bg-amber-50/50 p-2 rounded-xl text-xs text-amber-900 border border-[#E1DBCE] min-h-[38px] flex items-center">
              {isRecording ? (
                <div className="flex items-center gap-1 w-full text-rose-800 font-medium">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping mr-1" />
                  <span className="italic">{voiceText}</span>
                </div>
              ) : voiceText ? (
                <span className="text-emerald-700 font-semibold">{voiceText}</span>
              ) : (
                <span className="text-amber-800/50 font-mono italic">語音分析結果會呈現於此...</span>
              )}
            </div>
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleAddTask} className="bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-3xl p-4 shadow-sm relative z-10">
          <h4 className="font-serif text-sm font-bold text-amber-950 mb-3 flex items-center gap-1">
            <Plus className="w-4 h-4 text-amber-700" /> 快速手動追加行程
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-5">
              <label className="block text-[10px] font-bold text-amber-900 mb-1">行程名稱</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="例如：晚上煮一頓美味的健康沙拉"
                className="w-full text-xs p-2.5 rounded-xl border border-dashed border-[#D2C5B4] bg-[#FDFDFB] text-amber-950 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-amber-900 mb-1">時間</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#D2C5B4] bg-[#FDFDFB] text-amber-950 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-amber-900 mb-1">標籤分類</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as ScheduleItem['type'])}
                className="w-full text-xs p-2 rounded-xl border border-[#D2C5B4] bg-[#FDFDFB] text-amber-950 focus:outline-none"
              >
                <option value="personal">🍎 生活</option>
                <option value="work">👔 工作</option>
                <option value="pet">🐾 寵物</option>
                <option value="health">🏃 健康</option>
                <option value="social">👥 社交</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full bg-[#8E7E6A] hover:bg-[#796A57] text-white px-4 py-2.5 rounded-xl font-bold font-serif text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>追加手帳事項</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
