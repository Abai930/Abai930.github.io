/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Image as ImageIcon, Check, Paintbrush, RotateCw, Plus, Minus, Move, Trash2, Sliders, CheckSquare, Sparkles } from 'lucide-react';
import { ScheduleItem, CanvasSticker } from '../types';
import { WALLPAPER_THEMES } from '../data';

interface WallpaperExporterProps {
  currentDayEvents: ScheduleItem[];
  selectedDate: string;
}

export default function WallpaperExporter({ currentDayEvents, selectedDate }: WallpaperExporterProps) {
  const [selectedThemeId, setSelectedThemeId] = useState('cream');
  const [showTasks, setShowTasks] = useState(true);
  const [showCalendar, setShowCalendar] = useState(true);
  const [showPet, setShowPet] = useState(true);
  const [wallpaperNote, setWallpaperNote] = useState('「今天也要加油呀！」');
  
  // Immersive export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportPhase, setExportPhase] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);

  // Placed decorations state
  const [placedStickers, setPlacedStickers] = useState<CanvasSticker[]>([
    { id: 'st-1', type: 'tape', x: 50, y: 15, scale: 1.1, rotate: -2 },
    { id: 'st-2', type: 'star', x: 22, y: 38, scale: 0.9, rotate: 15 },
    { id: 'st-3', type: 'coffee', x: 80, y: 82, scale: 1.0, rotate: -10 }
  ]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const activeTheme = WALLPAPER_THEMES.find(t => t.id === selectedThemeId) || WALLPAPER_THEMES[0];

  // Placed sticker utilities
  const addNewSticker = (type: string) => {
    const newSticker: CanvasSticker = {
      id: `sticker-${Date.now()}`,
      type,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      scale: 1.0,
      rotate: Math.floor(Math.random() * 40) - 20 // -20 to 20
    };
    setPlacedStickers(prev => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const removeSticker = (id: string) => {
    setPlacedStickers(prev => prev.filter(s => s.id !== id));
    if (selectedStickerId === id) setSelectedStickerId(null);
  };

  const updateStickerProperty = (id: string, prop: keyof CanvasSticker, amount: number) => {
    setPlacedStickers(prev => prev.map(s => {
      if (s.id === id) {
        let val = Number(s[prop]) + amount;
        if (prop === 'scale') val = Math.max(0.4, Math.min(2.5, val));
        if (prop === 'x' || prop === 'y') val = Math.max(5, Math.min(95, val));
        return { ...s, [prop]: val };
      }
      return s;
    }));
  };

  const getStickerVisual = (type: string) => {
    switch (type) {
      case 'tape':
        return (
          <div className="w-24 h-5 bg-amber-400/40 rounded-sm border-x-2 border-dashed border-amber-600/50 shadow-sm flex items-center justify-center">
            <span className="text-[7px] text-amber-900/60 font-mono tracking-widest uppercase">WASHI</span>
          </div>
        );
      case 'star':
        return <span className="text-3xl filter drop-shadow">⭐</span>;
      case 'heart':
        return <span className="text-3xl filter drop-shadow">❤️</span>;
      case 'coffee':
        return <span className="text-3xl filter drop-shadow">☕</span>;
      case 'flower':
        return <span className="text-3xl filter drop-shadow font-serif">🌸</span>;
      case 'planet':
        return <span className="text-3xl filter drop-shadow">🪐</span>;
      default:
        return <span className="text-2xl">✨</span>;
    }
  };

  // Trigger Wallpaper compile sequence
  const startExportSequence = () => {
    setIsExporting(true);
    setExportPhase(0);

    // Timeline phases simulation
    const phases = [
      '🖌️ 正在拼貼底紙圖樣、剪切格線...',
      '📎 正在對齊並剪裁 Washi Tapes 水彩膠帶...',
      '🐾 正在將陪伴柴柴與今日待辦整合至預設位置...',
      '✨ 正在疊加手繪星芒、咖啡杯手札貼紙...',
      '📱 輸出完成！正在烘焙超高畫質 (1240 × 2688) 手機專屬桌布...'
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < phases.length) {
        setExportPhase(current);
      } else {
        clearInterval(interval);
        setIsExporting(false);
        setShowExportModal(true);
      }
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="exporter-viewport">
      
      {/* Simulation Controls Sidebar (Left Column) */}
      <div className="xl:col-span-6 flex flex-col gap-5">
        
        {/* Step 1 Style presets selector */}
        <div className="bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-3xl p-5 shadow-sm">
          <h3 className="font-serif text-base font-bold text-amber-950 mb-3 flex items-center gap-1.5 border-b border-[#EDE4D5] pb-2">
            <Paintbrush className="w-5 h-5 text-amber-800" />
            <span>步驟一：選擇風格底紙</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {WALLPAPER_THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => setSelectedThemeId(theme.id)}
                className={`flex flex-col items-center p-2 rounded-2xl border-2 transition-all ${
                  selectedThemeId === theme.id
                    ? 'border-amber-600 bg-amber-50/50 scale-102 shadow-sm'
                    : 'border-[#EBE3D5] hover:border-amber-300'
                }`}
              >
                <div
                  className="w-full aspect-square rounded-xl mb-2 flex items-center justify-center relative overflow-hidden border border-black/5"
                  style={{ backgroundColor: theme.bg }}
                >
                  {/* Grid / Dots previews */}
                  {theme.pattern === 'grid' && (
                    <div className="absolute inset-0 opacity-10" style={{ backgroundSize: '6px 6px', backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)' }} />
                  )}
                  {theme.pattern === 'dots' && (
                    <div className="absolute inset-0 opacity-15" style={{ backgroundSize: '10px 10px', backgroundImage: 'radial-gradient(circle, #5b5 1px, transparent 1px)' }} />
                  )}
                  {selectedThemeId === theme.id && (
                    <div className="bg-amber-600 text-white rounded-full p-0.5 z-10 scale-90">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-amber-950 leading-tight text-center">{theme.name}</span>
                {theme.isDark && <span className="text-[8px] bg-slate-800 text-slate-100 px-1 py-0.5 rounded mt-0.5">深夜版</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 Widget layout toggle */}
        <div className="bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-3xl p-5 shadow-sm">
          <h3 className="font-serif text-base font-bold text-amber-950 mb-3 flex items-center gap-1.5 border-b border-[#EDE4D5] pb-2">
            <Sliders className="w-5 h-5 text-amber-800" />
            <span>步驟二：拼貼組件開關與自訂隨筆</span>
          </h3>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setShowCalendar(prev => !prev)}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-colors ${
                showCalendar ? 'bg-[#FAF6EE] border-amber-600 text-amber-950 font-bold' : 'bg-transparent border-[#EBE3D5] text-[#C0B4A0]'
              }`}
            >
              <CheckSquare className={`w-4 h-4 ${showCalendar ? 'text-amber-700' : 'text-transparent'}`} />
              <span className="text-xs">手帳日曆</span>
            </button>

            <button
              onClick={() => setShowTasks(prev => !prev)}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-colors ${
                showTasks ? 'bg-[#FAF6EE] border-amber-600 text-amber-950 font-bold' : 'bg-transparent border-[#EBE3D5] text-[#C0B4A0]'
              }`}
            >
              <CheckSquare className={`w-4 h-4 ${showTasks ? 'text-amber-700' : 'text-transparent'}`} />
              <span className="text-xs">今日事項卡</span>
            </button>

            <button
              onClick={() => setShowPet(prev => !prev)}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-colors ${
                showPet ? 'bg-[#FAF6EE] border-amber-600 text-amber-950 font-bold' : 'bg-transparent border-[#EBE3D5] text-[#C0B4A0]'
              }`}
            >
              <CheckSquare className={`w-4 h-4 ${showPet ? 'text-amber-700' : 'text-transparent'}`} />
              <span className="text-xs">阿吉陪伴</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1.5 font-serif">今日勵志小短句 (手寫風呈现)</label>
            <input
              type="text"
              value={wallpaperNote}
              onChange={(e) => setWallpaperNote(e.target.value)}
              placeholder="輸入顯示在桌布的祝福手手寫句..."
              className="w-full text-xs p-2.5 rounded-xl border border-dashed border-[#D2C5B4] text-amber-950 focus:outline-none bg-[#FCFCFA]"
            />
          </div>
        </div>

        {/* Step 3 Add stamps & Stickers */}
        <div className="bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-3xl p-5 shadow-sm">
          <h3 className="font-serif text-base font-bold text-amber-950 mb-3 flex items-center gap-1.5 border-b border-[#EDE4D5] pb-2">
            <Sparkles className="w-5 h-5 text-amber-800" />
            <span>步驟三：貼上裝飾貼紙</span>
          </h3>
          <p className="text-xs text-amber-800/60 mb-3 font-serif">
            點選以下創作者設計的質感貼飾，貼紙會浮在手機畫面上，您可在下方微調它們的位置、方向、與大小。
          </p>

          <div className="flex flex-wrap gap-2.5 mb-4 justify-center bg-[#FAF6EE] p-3 rounded-2xl border border-dashed border-[#D2C5B4]">
            <button onClick={() => addNewSticker('tape')} className="p-2 bg-white rounded-xl border border-[#D2C5B4] text-xs font-bold hover:bg-amber-50 text-amber-950 flex items-center gap-1">
              <span>🎏 彩色膠帶</span>
            </button>
            <button onClick={() => addNewSticker('star')} className="p-2 bg-white rounded-xl border border-[#D2C5B4] text-xs font-bold hover:bg-amber-50 text-amber-950">
              ⭐ 金色小星芒
            </button>
            <button onClick={() => addNewSticker('heart')} className="p-2 bg-white rounded-xl border border-[#D2C5B4] text-xs font-bold hover:bg-amber-50 text-amber-950">
              ❤️ 手繪暖心
            </button>
            <button onClick={() => addNewSticker('coffee')} className="p-2 bg-white rounded-xl border border-[#D2C5B4] text-xs font-bold hover:bg-amber-50 text-amber-950">
              ☕ 柴柴熱拿鐵
            </button>
            <button onClick={() => addNewSticker('flower')} className="p-2 bg-white rounded-xl border border-[#D2C5B4] text-xs font-bold hover:bg-amber-50 text-amber-950">
              🌸 幸運櫻花
            </button>
            <button onClick={() => addNewSticker('planet')} className="p-2 bg-white rounded-xl border border-[#D2C5B4] text-xs font-bold hover:bg-amber-50 text-amber-950">
              🪐 星空幻想
            </button>
          </div>

          {/* Active Stickers Manager list */}
          {placedStickers.length > 0 && (
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-amber-950 mb-1 font-serif">調整已貼貼紙 ({placedStickers.length})</label>
              
              <div className="max-h-[140px] overflow-y-auto space-y-2 border border-[#E9E1D2] p-2.5 rounded-xl bg-white/50">
                {placedStickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    onClick={() => setSelectedStickerId(sticker.id)}
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedStickerId === sticker.id
                        ? 'border-amber-600 bg-amber-50/70 shadow-inner'
                        : 'border-[#EBE3D5] hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="scale-75 inline-block">{getStickerVisual(sticker.type)}</span>
                      <span className="font-mono text-[11px] text-[#8C7A63]">
                        貼紙 ({sticker.type}) • X:{sticker.x}% Y:{sticker.y}% Scale:{sticker.scale}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button onClick={() => updateStickerProperty(sticker.id, 'x', -5)} className="p-1 bg-white hover:bg-amber-100 rounded border" title="往左"><Move className="w-3 h-3 text-amber-800" /></button>
                      <button onClick={() => updateStickerProperty(sticker.id, 'x', 5)} className="p-1 bg-white hover:bg-amber-100 rounded border" title="往右"><Sliders className="w-3 h-3 text-amber-800" /></button>
                      <button onClick={() => updateStickerProperty(sticker.id, 'scale', 0.1)} className="p-1 bg-white hover:bg-amber-100 rounded border" title="推大"><Plus className="w-3 h-3 text-amber-800" /></button>
                      <button onClick={() => updateStickerProperty(sticker.id, 'scale', -0.1)} className="p-1 bg-white hover:bg-amber-100 rounded border" title="縮小"><Minus className="w-3 h-3 text-amber-800" /></button>
                      <button onClick={() => updateStickerProperty(sticker.id, 'rotate', 15)} className="p-1 bg-white hover:bg-amber-100 rounded border" title="旋轉"><RotateCw className="w-3 h-3 text-amber-800" /></button>
                      <button onClick={() => removeSticker(sticker.id)} className="p-1 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 text-rose-600" title="撕下"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Smartphone Wallpaper Live Emulator Output (Right Column) */}
      <div className="xl:col-span-6 flex flex-col items-center">
        
        {/* Phone Frame wrapper */}
        <div className="w-[300px] h-[610px] rounded-[48px] border-[10px] border-slate-800 shadow-2xl relative bg-black flex flex-col overflow-hidden ring-4 ring-offset-2 ring-slate-800/20">
          
          {/* Dynamic Speaker notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-b-2xl z-40 flex items-center justify-center">
            <div className="w-12 h-1 bg-neutral-800 rounded-full" />
          </div>

          {/* Wallpaper screen surface */}
          <div
            className={`w-full h-full p-4 pt-10 flex flex-col justify-between relative transition-colors duration-500 overflow-hidden ${
              activeTheme.isDark ? 'text-slate-100' : 'text-slate-900'
            }`}
            style={{ backgroundColor: activeTheme.bg }}
          >
            {/* Background design pattern */}
            {activeTheme.pattern === 'grid' && (
              <div className="absolute inset-0 opacity-15" style={{ backgroundSize: '16px 16px', backgroundImage: 'radial-gradient(circle, #8A7E6B 1px, transparent 1px)' }} />
            )}
            {activeTheme.pattern === 'dots' && (
              <div className="absolute inset-0 opacity-20" style={{ backgroundSize: '24px 24px', backgroundImage: 'radial-gradient(circle, #8FA885 1.5px, transparent 1.5px)' }} />
            )}

            {/* Top Row: Clock & Date */}
            <div className="relative z-10 text-center flex flex-col items-center mt-2">
              <span className={`text-[10px] font-mono tracking-widest px-2.5 py-0.5 rounded-full uppercase ${activeTheme.isDark ? 'bg-white/10 text-white/80' : 'bg-black/5 text-[#5D5243]'}`}>
                {selectedDate.replace(/-/g, ' / ')}
              </span>
              <h2 className="text-3xl font-bold font-serif tracking-tight mt-1.5 leading-none">12:30</h2>
              <p className="text-[10px] font-bold mt-1 tracking-wide">星期五 • 大忙人極簡手帳</p>
            </div>

            {/* Middle Section Stack: Widgets */}
            <div className="relative z-10 flex-1 my-4 flex flex-col gap-3 justify-center items-center">
              
              {/* Optional Widget: Calendar Month grid preview */}
              {showCalendar && (
                <div className={`w-[230px] p-2.5 rounded-2xl border-2 border-dashed shadow-sm text-[9px] ${
                  activeTheme.isDark ? 'bg-black/35 border-white/10 text-white/90' : 'bg-white/90 border-[#D2C5B4] text-amber-950'
                }`}>
                  <p className="font-bold border-b pb-1 mb-1 font-serif text-center">2026 年 5 月</p>
                  <div className="grid grid-cols-7 gap-0.5 text-center font-mono font-bold font-sans scale-90">
                    <span className="opacity-50">S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span className="opacity-50">S</span>
                    {Array.from({ length: 5 }, (_, idx) => <span key={`em-${idx}`} className="opacity-0">.</span>)}
                    {Array.from({ length: 9 }, (_, idx) => (
                      <span key={`v-${idx}`} className={idx + 1 === 22 ? 'bg-amber-400 text-black rounded-full font-bold px-0.5' : ''}>
                        {idx + 1}
                      </span>
                    ))}
                    <span className="opacity-40">...</span>
                  </div>
                </div>
              )}

              {/* Optional Widget: Handwritten Note quote */}
              {wallpaperNote && (
                <div className={`w-[230px] py-1.5 px-3 rounded-xl border border-dashed text-center ${
                  activeTheme.isDark ? 'bg-black/20 border-white/20 text-white/80' : 'bg-amber-100/30 border-amber-900/10 text-amber-900'
                }`}>
                  <p className="font-serif italic text-xs font-semibold select-none">“ {wallpaperNote} ”</p>
                </div>
              )}

              {/* Optional Widget: Styled Daily task sheet */}
              {showTasks && (
                <div className={`w-[240px] p-3 rounded-2xl border shadow-sm ${
                  activeTheme.isDark ? 'bg-[#212327]/90 border-neutral-700' : 'bg-white/95 border-[#E2D4C0]'
                }`}>
                  <div className="flex items-center justify-between pb-1.5 border-b mb-1.5 opacity-80">
                    <span className="text-[9px] font-mono tracking-wider font-bold">🗒️ TODAY PLAN</span>
                    <span className="text-[8px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-mono">2026-05-22</span>
                  </div>
                  <div className="space-y-1.5 max-h-[110px] overflow-hidden">
                    {currentDayEvents.length === 0 ? (
                      <p className="text-[10px] italic text-[#CFCAC0] text-center py-2 font-serif">今天沒有任何安排喔</p>
                    ) : (
                      currentDayEvents.slice(0, 3).map((t, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.completed ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          <span className={`${t.completed ? 'line-through opacity-40' : 'font-medium'} truncate`}>
                            {t.time} {t.title}
                          </span>
                        </div>
                      ))
                    )}
                    {currentDayEvents.length > 3 && (
                      <p className="text-[8px] opacity-40 text-right italic">+ 還有 {currentDayEvents.length - 3} 筆行程</p>
                    )}
                  </div>
                </div>
              )}

              {/* Optional Widget: Floating Mascot Dog sticker */}
              {showPet && (
                <div className="absolute bottom-8 right-2 flex flex-col items-center">
                  <div className="bg-white text-black text-[8px] font-bold font-serif py-1 px-2 rounded-xl mb-1 border border-neutral-300 shadow-sm relative animate-bounce animate-duration-1000">
                    陪你忙喔！🐕
                    <div className="absolute -bottom-1 right-3 w-1.5 h-1.5 bg-white border-r border-b border-neutral-300 rotate-45" />
                  </div>
                  <div className="w-12 h-12 bg-amber-50 rounded-full border border-amber-300 shadow-inner overflow-hidden flex items-center justify-center p-0.5">
                    <img
                      src="/src/assets/images/cute_shiba_mascot_1779419365956.png"
                      alt="柴柴"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Row Area: Wallpaper Custom Stickers Layer Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {placedStickers.map(sticker => (
                <div
                  key={sticker.id}
                  className={`absolute transition-transform ${
                    selectedStickerId === sticker.id ? 'ring-2 ring-amber-500 ring-offset-1 rounded-sm' : ''
                  }`}
                  style={{
                    left: `${sticker.x}%`,
                    top: `${sticker.y}%`,
                    transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotate}deg)`,
                  }}
                >
                  {getStickerVisual(sticker.type)}
                </div>
              ))}
            </div>

            {/* Bottom Screen Text/Decorative Tape */}
            <div className="relative z-10 text-center text-[8px] font-bold opacity-30 select-none pb-1 uppercase font-mono tracking-widest">
              ★ Busy Go-Getter Companion ★
            </div>
          </div>
        </div>

        {/* Generate Trigger Button */}
        <button
          onClick={startExportSequence}
          disabled={isExporting}
          className="mt-5 w-[300px] bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold text-sm py-3 px-6 rounded-2xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 animate-bounce" />
          <span>一鍵匯出我的手帳桌布</span>
        </button>

      </div>

      {/* Full Screen Loading Sequencer overlay while Exporting */}
      <AnimatePresence>
        {isExporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FFFDF6]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-[120px] h-[120px] rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin mb-6" />
            
            <h3 className="font-serif text-xl font-bold text-amber-950 mb-2">手帳桌布一鍵渲染中...</h3>
            <p className="text-xs text-amber-800/60 max-w-sm font-serif mb-6 leading-relaxed">
              系統正在使用風格底色、貼膜貼裝、與您的行程卡及阿吉狀態重新進行高畫質裁切拼布。
            </p>

            <div className="w-64 h-2 bg-amber-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-600"
                initial={{ width: '0%' }}
                animate={{ width: `${(exportPhase + 1) * 20}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>

            {/* Current Phase Statement */}
            <p className="text-sm font-bold text-amber-800 mt-4 transition-all">
              {exportPhase === 0 && '🖌️ 正在拼貼底紙圖樣、剪切幾何格線...'}
              {exportPhase === 1 && '📎 正在對齊並剪裁 Washi Tapes 水彩膠帶...'}
              {exportPhase === 2 && '🐾 正在將陪伴柴柴與今日待辦整合至預設位置...'}
              {exportPhase === 3 && '✨ 正在疊加手繪星芒、咖啡杯手札貼紙...'}
              {exportPhase === 4 && '📱 輸出完成！正在烘焙超高畫質 (1240 × 2688) 手機專屬桌布...'}
            </p>
          </motion.div>
        )}

        {/* Export Completed Mock Download Modal */}
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#FFFDF6] border-4 border-[#C7B599] rounded-3xl p-6 shadow-2xl max-w-md w-full relative"
            >
              <h3 className="font-serif text-lg font-bold text-center text-amber-950 mb-2">🎉 手帳桌布烘焙完成！</h3>
              <p className="text-xs text-center text-amber-800/60 mb-5 font-serif">
                您的生活手帳桌布已經完美誕生，可以長按下方圖片儲存，或點選下方的下載按鈕。
              </p>

              {/* Layout Visual Mockup representing full exported canvas background */}
              <div className="aspect-[9/16] w-[180px] mx-auto rounded-3xl border-4 border-slate-700 shadow-md relative overflow-hidden mb-5">
                <div className="absolute inset-0" style={{ backgroundColor: activeTheme.bg }}>
                  {/* Fake full render render of details so they feel the aesthetic */}
                  <div className="absolute inset-0 opacity-15" style={{ backgroundSize: '10px 10px', backgroundImage: 'radial-gradient(circle, #5b5 1.5px, transparent 1.5px)' }} />
                  <div className="absolute top-8 w-full text-center">
                    <span className="text-[7px] text-amber-900 bg-amber-200/50 px-1 py-0.2 rounded font-mono">2026-05-22</span>
                    <h4 className="text-lg font-bold font-serif leading-none mt-1 text-amber-950">12:30</h4>
                  </div>
                  <div className="absolute inset-x-2 top-20 bg-white/90 rounded-xl border p-1 text-[7px] scale-90">
                    <span className="font-bold border-b pb-0.5 block">🗒️ TODAY PLAN</span>
                    <p className="opacity-80">08:30 黑糖拿鐵 ☕</p>
                    <p className="opacity-80">14:00 與插畫家巧芯討論 🐻</p>
                  </div>
                  <div className="absolute bottom-6 right-2 flex flex-col items-center">
                    <span className="bg-white text-[5px] px-1 rounded border scale-[0.8] mb-0.5">陪你忙！🐕</span>
                    <img src="/src/assets/images/cute_shiba_mascot_1779419365956.png" className="w-8 h-8" alt="shiba" referrerPolicy="no-referrer" />
                  </div>
                  <div className="absolute top-24 left-6 scale-90">⭐</div>
                  <div className="absolute top-48 right-4 scale-75">☕</div>
                  <div className="absolute top-12 left-20 w-12 h-2.5 bg-amber-400/40 rounded border-x border-[#E9E1D2] rotate-6" />
                </div>
              </div>

              {/* Simulated saved notification and download actions */}
              <div className="space-y-3">
                <div className="bg-emerald-50 text-emerald-800 text-xs font-serif p-3 rounded-2xl border border-emerald-200/80 leading-relaxed text-center">
                  ✨ 桌面已同步與本地相簿整合成功！感謝您對「大忙人手帳」獨立創作者創作底紙的喜愛。
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      // Trigger real static dummy download of image
                      const link = document.createElement('a');
                      link.href = '/src/assets/images/journal_wasitape_stickers_1779419388392.png';
                      link.download = 'my-busy-journal-wallpaper.png';
                      link.click();
                    }}
                    className="w-full bg-[#8E7E6A] hover:bg-[#786955] text-white font-serif font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>儲存檔案 (PNG)</span>
                  </button>

                  <button
                    onClick={() => setShowExportModal(false)}
                    className="w-full border border-amber-600 bg-white text-amber-800 hover:bg-amber-50 font-serif font-bold text-xs py-3 px-4 rounded-xl transition-colors"
                  >
                    回到編輯面板
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
