import React, { useState } from 'react';
import { StudentData, ItemCategory } from '../../types';
import { SHOP_ITEMS } from '../../services/gameData';
import { GameService } from '../../services/gameService';
import { triggerConfetti } from '../common/ConfettiEffect';
import { Store, Coins, Check, Lock, Sparkles, X, Shield, Sword, Crown, Glasses } from 'lucide-react';

interface Props {
  student: StudentData;
  onClose: () => void;
  onUpdate: (updated: StudentData) => void;
}

export const ShopModal: React.FC<Props> = ({ student, onClose, onUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [purchaseNotice, setPurchaseNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const availableItems = SHOP_ITEMS.filter(item => !item.isSpecialDrop);
  const filteredItems = selectedCategory === 'all'
    ? availableItems
    : availableItems.filter(item => item.category === selectedCategory);

  const handleBuy = (itemId: string) => {
    setPurchaseNotice(null);
    const res = GameService.purchaseItem(student.account.id, itemId);

    if (res.success && res.student) {
      setPurchaseNotice({ type: 'success', message: res.message });
      triggerConfetti('small');
      onUpdate(res.student);
    } else {
      setPurchaseNotice({ type: 'error', message: res.message });
    }
  };

  const categoryTabs: { id: ItemCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: '전체 상품', icon: <Store className="w-4 h-4" /> },
    { id: 'weapon', label: '무기', icon: <Sword className="w-4 h-4" /> },
    { id: 'armor', label: '갑옷/로브', icon: <Shield className="w-4 h-4" /> },
    { id: 'head', label: '모자/왕관', icon: <Crown className="w-4 h-4" /> },
    { id: 'accessory', label: '장신구/펫', icon: <Glasses className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-6 py-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-yellow-100" />
            <h2 className="text-xl md:text-2xl font-bold font-jua">🏪 모험가의 대장간 & 보물 상점</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Gold Balance Pill */}
            <div className="flex items-center gap-1.5 bg-slate-900/70 px-3 py-1.5 rounded-full border border-yellow-300 text-yellow-300 font-bold text-sm shadow-inner">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{student.character.gold.toLocaleString()} Gold</span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Purchase Status Notice Banner */}
        {purchaseNotice && (
          <div
            className={`px-6 py-2.5 text-xs font-bold flex items-center justify-between ${
              purchaseNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            <span>{purchaseNotice.message}</span>
            <button onClick={() => setPurchaseNotice(null)} className="text-xs opacity-60 hover:opacity-100">
              닫기
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col overflow-hidden">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4 overflow-x-auto">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-1 flex-1">
            {filteredItems.map((item) => {
              const isOwned = student.character.inventory.includes(item.id);
              const isJobMatch = !item.jobRequirement || item.jobRequirement === 'all' || item.jobRequirement === student.character.job;
              const isLevelMet = !item.requiredLevel || student.character.level >= item.requiredLevel;
              const canAfford = student.character.gold >= item.price;
              const canBuy = !isOwned && isJobMatch && isLevelMet && canAfford;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border-2 flex flex-col justify-between transition-all bg-white relative ${
                    isOwned
                      ? 'border-slate-200 bg-slate-50 opacity-90'
                      : !isJobMatch || !isLevelMet
                      ? 'border-slate-200 opacity-75'
                      : 'border-amber-200 hover:border-amber-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Item Top Row */}
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-4xl p-2 rounded-xl bg-amber-50 border border-amber-100">
                        {item.icon}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-slate-100 text-slate-700">
                        {item.rarity}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                    <p className="text-xs font-semibold text-amber-700 mt-2 bg-amber-50 px-2 py-1 rounded">
                      ✨ {item.statDescription}
                    </p>

                    {/* Requirements Tags */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.jobRequirement && item.jobRequirement !== 'all' && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            isJobMatch ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.jobRequirement === 'warrior' ? '전사 전용' : item.jobRequirement === 'wizard' ? '마법사 전용' : item.jobRequirement === 'healer' ? '힐러 전용' : '탐험가 전용'}
                        </span>
                      )}
                      {item.requiredLevel && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            isLevelMet ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          Lv.{item.requiredLevel} 이상
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Purchase Button / Owned Status */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-amber-600 text-sm">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span>{item.price} G</span>
                    </div>

                    {isOwned ? (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> 보유중
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBuy(item.id)}
                        disabled={!canBuy}
                        className={`rpg-btn px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow transition-all ${
                          canBuy
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {!isLevelMet || !isJobMatch ? (
                          <>
                            <Lock className="w-3.5 h-3.5" /> 구매불가
                          </>
                        ) : !canAfford ? (
                          '골드 부족'
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" /> 구매하기
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
