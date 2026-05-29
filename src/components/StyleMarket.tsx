/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Star, Download, Coins, Tag, UploadCloud, FileText, Check, DollarSign, BarChart3, Users, PlusCircle } from 'lucide-react';
import { MarketItem } from '../types';
import { MARKET_ITEMS } from '../data';

interface StyleMarketProps {
  marketItems: MarketItem[];
  setMarketItems: React.Dispatch<React.SetStateAction<MarketItem[]>>;
}

export default function StyleMarket({ marketItems, setMarketItems }: StyleMarketProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'creator-console'>('browse');
  
  // Browsing/Unlocking States
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Creator Dashboard Config States
  const [currentArtist, setCurrentArtist] = useState<'巧芯' | '俊億' | '自己'>('巧芯');
  
  // New Upload Form values
  const [uploadName, setUploadName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<MarketItem['category']>('sticker');
  const [uploadPrice, setUploadPrice] = useState('免費');
  const [showUploadAlert, setShowUploadAlert] = useState(false);

  // Purchase trigger
  const triggerUnlockItem = (item: MarketItem) => {
    setMarketItems(prev => prev.map(m => {
      if (m.id === item.id) {
        return { ...m, isUnlocked: true };
      }
      return m;
    }));
    setPurchaseSuccess(true);
    setTimeout(() => {
      setPurchaseSuccess(false);
      setSelectedItem(null);
    }, 1800);
  };

  // Upload trigger
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) return;

    const newMarketAsset: MarketItem = {
      id: `market-${Date.now()}`,
      name: uploadName,
      creator: currentArtist === '巧芯' ? '袁巧芯' : currentArtist === '俊億' ? '余俊億' : '您自己',
      avatarColor: currentArtist === '巧芯' ? 'from-amber-200 to-orange-300' : currentArtist === '俊億' ? 'from-indigo-300 to-purple-400' : 'from-emerald-400 to-teal-500',
      category: uploadCategory,
      price: uploadPrice,
      stars: 5.0,
      downloads: '0',
      isUnlocked: currentArtist === '自己'
    };

    setMarketItems(prev => [newMarketAsset, ...prev]);
    setUploadName('');
    setShowUploadAlert(true);
    setTimeout(() => setShowUploadAlert(false), 2000);
  };

  const getCreatorStats = (artist: string) => {
    switch (artist) {
      case '巧芯':
        return { uploads: 4, downloads: '3.0k', rating: 4.9, earnings: 'NT$ 36,000' };
      case '俊億':
        return { uploads: 3, downloads: '4.0k', rating: 4.8, earnings: 'NT$ 12,500' };
      default:
        const ownUploads = marketItems.filter(m => m.creator === '您自己');
        return {
          uploads: ownUploads.length,
          downloads: `${ownUploads.length * 28} 次`,
          rating: 5.0,
          earnings: `NT$ ${ownUploads.reduce((acc, current) => {
            const priceNum = parseInt(current.price.replace(/[^\d]/g, ''), 10) || 0;
            return acc + (priceNum * 28);
          }, 0)}`
        };
    }
  };

  const stats = getCreatorStats(currentArtist);

  return (
    <div className="flex flex-col gap-5" id="style-market-panel">
      
      {/* Tab Selectors */}
      <div className="flex items-center justify-between border-b-2 border-dashed border-[#D2C5B4] pb-3">
        <div className="flex bg-amber-100/60 p-1 rounded-2xl border border-amber-200 shadow-inner">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-colors ${
              activeTab === 'browse'
                ? 'bg-[#8E7E6A] text-white shadow-xs'
                : 'text-amber-900 hover:bg-white/40'
            }`}
          >
            🎨 瀏覽風格市集
          </button>
          
          <button
            onClick={() => setActiveTab('creator-console')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-colors ${
              activeTab === 'creator-console'
                ? 'bg-[#8E7E6A] text-white shadow-xs'
                : 'text-amber-900 hover:bg-white/40'
            }`}
          >
            💼 創作者投稿與營收後台
          </button>
        </div>

        <span className="text-[10px] bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-dashed border-[#D2C5B4] font-mono font-bold uppercase tracking-wider">
          Creator Ecosystem
        </span>
      </div>

      {activeTab === 'browse' ? (
        /* Market Browse grid */
        <div className="space-y-4">
          <div className="p-3 bg-amber-50/50 rounded-2xl border border-dashed border-[#D2C5B4] text-xs text-amber-900 font-serif leading-relaxed">
            🖌️ <span className="font-bold">市集宗旨</span>：大忙人串連多名文創手寫與插畫家，在此下載的貼畫將一秒解鎖到您的「一鍵生成桌面」庫存中。您也可以前往「投稿後台」上架您自己的精美裝飾貼哦！
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {marketItems.map(item => (
              <div
                key={item.id}
                className="bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-3xl p-4 shadow-xs relative overflow-hidden transition-transform hover:-translate-y-0.5 flex flex-col justify-between"
              >
                {/* Visual Circle avatar to replace empty mock images */}
                <div className="w-full h-24 rounded-2xl bg-[#FCFAF2] border-2 border-dashed border-[#E3D6C5] flex items-center justify-center relative overflow-hidden mb-3">
                  <div className={`absolute w-12 h-12 rounded-full bg-gradient-to-tr ${item.avatarColor} opacity-50 blur-xs`} />
                  
                  {/* Category Stamp info */}
                  <span className="text-[10px] text-amber-900/60 font-mono tracking-widest font-bold uppercase bg-white/80 py-1 px-2.5 rounded-full border shadow-xs z-10">
                    {item.category === 'sticker' && ' स्टिकर Sticker'}
                    {item.category === 'background' && '📇 Wallpaper Base'}
                    {item.category === 'font' && '✒️ Calligraphy Font'}
                    {item.category === 'widget' && '📱 Daily Widget'}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-amber-800 bg-[#EFE3D0]/60 px-2 py-0.5 rounded border border-[#DECDB7]/40">
                      ✍️ 創作者：{item.creator}
                    </span>
                    <span className="text-xs font-bold text-rose-600 font-serif">{item.price}</span>
                  </div>

                  <h4 className="text-sm font-bold text-amber-950 font-serif mb-3 line-clamp-1">{item.name}</h4>

                  {/* Rating Stars / Download counts */}
                  <div className="flex items-center justify-between text-[11px] text-amber-900/40 font-mono font-semibold border-t pt-2.5">
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{item.stars} 星級</span>
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Download className="w-3.5 h-3.5" />
                      <span>{item.downloads} 人下載</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedItem(item)}
                  className={`mt-4 w-full py-2 rounded-xl text-xs font-serif font-bold transition-colors ${
                    item.isUnlocked
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
                      : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                  }`}
                >
                  {item.isUnlocked ? '✓ 已同步至桌布庫存' : '詳細資訊 / 取得風格'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Creator Hub Backend Panel */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Creator Profile Selector / Metrics Overview */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-3xl p-5 shadow-xs relative overflow-hidden">
              <h3 className="font-serif text-base font-bold text-amber-950 mb-3 flex items-center gap-1 border-b pb-2">
                <BarChart3 className="w-5 h-5 text-amber-800" />
                <span>請選取文創創作者切換看帳本</span>
              </h3>

              <div className="flex gap-2.5 mb-5 bg-[#FAF6EE] p-1.5 rounded-2xl border">
                <button
                  onClick={() => setCurrentArtist('巧芯')}
                  className={`flex-1 py-2 text-xs font-serif font-bold rounded-xl transition-all ${
                    currentArtist === '巧芯' ? 'bg-[#8E7E6A] text-white shadow-xs' : 'text-amber-900 hover:bg-white/20'
                  }`}
                >
                  袁巧芯 (袁老師)
                </button>
                <button
                  onClick={() => setCurrentArtist('俊億')}
                  className={`flex-1 py-2 text-xs font-serif font-bold rounded-xl transition-all ${
                    currentArtist === '俊億' ? 'bg-[#8E7E6A] text-white shadow-xs' : 'text-amber-900 hover:bg-white/20'
                  }`}
                >
                  余俊億 (余老師)
                </button>
                <button
                  onClick={() => setCurrentArtist('自己')}
                  className={`flex-1 py-2 text-xs font-serif font-bold rounded-xl transition-all ${
                    currentArtist === '自己' ? 'bg-[#8E7E6A] text-white shadow-xs' : 'text-[#8E7E6A] hover:bg-amber-200/40 border border-transparent'
                  }`}
                >
                  您自己 (自主發布)
                </button>
              </div>

              {/* Statistics Panel Blocks */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-amber-50/40 border border-[#EBE3D5] rounded-2xl p-3 text-center">
                  <p className="text-[10px] text-amber-800/40 uppercase font-mono font-semibold">上架組件數</p>
                  <p className="font-serif text-lg font-bold text-amber-950 mt-1">{stats.uploads} 包</p>
                </div>

                <div className="bg-amber-50/40 border border-[#EBE3D5] rounded-2xl p-3 text-center">
                  <p className="text-[10px] text-amber-800/40 uppercase font-mono font-semibold">下載總數據</p>
                  <p className="font-serif text-lg font-bold text-amber-950 mt-1">{stats.downloads}</p>
                </div>

                <div className="bg-amber-50/40 border border-[#EBE3D5] rounded-2xl p-3 text-center">
                  <p className="text-[10px] text-amber-800/40 uppercase font-mono font-semibold">風格評鑑</p>
                  <p className="font-serif text-lg font-bold text-amber-950 mt-1 flex items-center justify-center gap-0.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {stats.rating}
                  </p>
                </div>

                <div className="bg-emerald-50 text-emerald-900 border border-emerald-200/60 rounded-2xl p-3 text-center">
                  <p className="text-[10px] text-emerald-800/60 uppercase font-mono font-semibold">分潤銷售利潤</p>
                  <p className="font-serif text-sm font-bold mt-1 text-emerald-800">{stats.earnings}</p>
                </div>
              </div>
            </div>

            {/* List current artist uploads */}
            <div className="bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-3xl p-5 shadow-xs">
              <h4 className="font-serif text-xs font-bold text-amber-950 mb-3">已發表文創列表</h4>

              <div className="space-y-2 max-h-[180px] overflow-y-auto">
                {marketItems
                  .filter(m => m.creator === (currentArtist === '巧芯' ? '袁巧芯' : currentArtist === '俊億' ? '余俊億' : '您自己'))
                  .map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 border rounded-2xl bg-white text-xs">
                      <div>
                        <p className="font-bold text-amber-900">{m.name}</p>
                        <p className="text-[10px] text-amber-800/50 font-mono">類別：{m.category} • 單價：{m.price}</p>
                      </div>
                      <span className="text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-mono px-2.5 py-1 rounded-full font-bold">
                        累計 {m.downloads} 載
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Illustrator Asset Submission Form */}
          <div className="lg:col-span-5 bg-[#FFFDF9] border-2 border-[#D2C5B4] rounded-3xl p-5 shadow-xs">
            <h3 className="font-serif text-base font-bold text-amber-950 mb-3 flex items-center gap-1 border-b pb-2">
              <PlusCircle className="w-5 h-5 text-amber-800" />
              <span>投稿自製手帳風格貼</span>
            </h3>

            <p className="text-xs text-amber-800/60 mb-4 font-serif">
              在此上傳手繪去背 png 貼紙、莫蘭迪手札背景圖、或是自寫的手寫字體。審核通過會立刻發布到大忙人風格市集。
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-amber-900 mb-1">組件名稱</label>
                <input
                  type="text"
                  required
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="例如：日系水彩手繪下午茶點心包"
                  className="w-full text-xs p-2.5 rounded-xl border border-dashed border-[#D2C5B4] text-amber-950 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">組件種類</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as MarketItem['category'])}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D2C5B4] bg-[#FCFCFA] focus:outline-none text-amber-950"
                  >
                    <option value="sticker">🎏 去背貼紙</option>
                    <option value="background">📇 手帳背景</option>
                    <option value="font">✒️ 書法字體</option>
                    <option value="widget">📱 桌面組件</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">設定價格 / 免費</label>
                  <select
                    value={uploadPrice}
                    onChange={(e) => setUploadPrice(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D2C5B4] bg-[#FCFCFA] focus:outline-none text-amber-950"
                  >
                    <option value="免費">完全免費</option>
                    <option value="NT$15">NT$15 元</option>
                    <option value="NT$30">NT$30 元</option>
                    <option value="NT$45">NT$45 元</option>
                    <option value="NT$60">NT$60 元</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-900 mb-1">上傳圖檔 (模擬檔案選取)</label>
                <div className="border-2 border-dashed border-[#BDB09E]/40 rounded-2xl p-5 text-center bg-white/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-amber-50/20">
                  <UploadCloud className="w-8 h-8 text-amber-800/40" />
                  <p className="text-[10px] font-semibold text-amber-900/60">長按或點選選擇與拖曳 PNG/TTF 檔案</p>
                  <p className="text-[9px] text-amber-800/40">支援去背透明格式與 1790x3200 像素解析</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8E7E6A] hover:bg-[#786955] text-white font-serif font-bold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>提報上架至市集審查</span>
              </button>
            </form>

            <AnimatePresence>
              {showUploadAlert && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 bg-emerald-50 text-emerald-800 text-[11px] p-2.5 rounded-xl border border-emerald-200 font-serif font-semibold text-center"
                >
                  🎉 提報成功！組件已經立刻新增至市集瀏覽欄供大忙人使用者下載。
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      )}

      {/* Item Detail View popup modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#FFFDF6] border-4 border-[#C7B599] rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center relative"
            >
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-300">
                <ShoppingBag className="w-7 h-7 text-amber-800" />
              </div>

              <h3 className="font-serif text-base font-bold text-amber-950 mb-1">{selectedItem.name}</h3>
              <p className="text-xs text-amber-800/50 font-serif mb-4">創作者：{selectedItem.creator}</p>

              <div className="bg-amber-50 rounded-2xl p-3 border text-xs text-left text-amber-950 mb-5 space-y-2 font-mono">
                <div className="flex justify-between">
                  <span>分類：</span>
                  <span className="font-bold">{selectedItem.category.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>單價：</span>
                  <span className="font-bold text-rose-600">{selectedItem.price}</span>
                </div>
                <p className="text-[10px] text-amber-800/60 leading-relaxed border-t pt-2 mt-2 font-sans font-serif">
                  取得此風格授權後，您可以將它無限制貼在「手機桌面一鍵匯出」的背景中。
                </p>
              </div>

              {purchaseSuccess ? (
                <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-2xl text-emerald-800 text-xs font-serif font-bold animate-pulse">
                  🛒 交易模擬成功！風格已加入您的桌布工藝庫。
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => triggerUnlockItem(selectedItem)}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold text-xs py-3 rounded-xl transition-colors"
                  >
                    模擬授權並取得
                  </button>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-full border border-amber-600 bg-white text-amber-800 hover:bg-amber-50 font-serif font-bold text-xs py-3 rounded-xl transition-colors"
                  >
                    取消選取
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
