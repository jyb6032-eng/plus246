import React, { useState } from 'react';
import { StudentData, ItemCategory } from '../../types';
import { SHOP_ITEMS } from '../../services/gameData';
import { GameService } from '../../services/gameService';
import { CharacterAvatar } from './CharacterAvatar';
import { Backpack, Check, X, Shield, Sparkles, Sword, Crown, Glasses } from 'lucide-react';

interface Props {
  student: StudentData;
  onClose: () => void;
  onUpdate: (updated: StudentData) => void;
}

export const InventoryModal: React.FC<Props> = ({ student, onClose, onUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Get owned items details
  const ownedItems = SHOP_ITEMS.filter(item => student.character.inventory.includes(item.id));
  const filteredItems = selectedCategory === 'all'
    ? ownedItems
    : ownedItems.filter(item => item.category === selectedCategory);

  const selectedItem = SHOP_ITEMS.find(i => i.id === selectedItemId) || filteredItems[0] || null;

  const isEquipped = (itemId: string): boolean => {
    return Object.values(student.character.equipment).includes(itemId);
  };

  const handleEquip = (itemId: string) => {
    const res = GameService.equipItem(student.account.id, itemId);
    if (res.success && res.student) {
      onUpdate(res.student);
    }
  };

  const handleUnequip = (category: ItemCategory) => {
    const res = GameService.unequipItem(student.account.id, category);
    if (res.success && res.student) {
      onUpdate(res.student);
    }
  };

  const handleTitleSelect = (title: string) => {
    student.character.activeTitle = title;
    GameService.applyRewards(student.account.id, { expGained: 0, goldGained: 0, isLevelUp: false });
    onUpdate({ ...student });
  };

  const categoryButtons: { id: ItemCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: '전체', icon: <Backpack className="w-4 h-4" /> },
    { id: 'weapon', label: '무기', icon: <Sword className="w-4 h-4" /> },
    { id: 'armor', label: '갑옷/로브', icon: <Shield className="w-4 h-4" /> },
    { id: 'head', label: '모자/왕관', icon: <Crown className="w-4 h-4" /> },
    { id: 'accessory', label: '장신구/펫', icon: <Glasses className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Backpack className="w-6 h-6 text-yellow-200" />
            <h2 className="text-xl md:text-2xl font-bold font-jua">🎒 마법 인벤토리 & 장비 관리</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto flex-1">
          {/* Left: Avatar & Equipped Gear Summary */}
          <div className="md:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center">
            <h3 className="text-sm font-bold text-slate-600 mb-2">현재 착용 모습</h3>
            <CharacterAvatar character={student.character} size="xl" />

            {/* Currently Equipped Slots */}
            <div className="w-full mt-4 space-y-2">
              {(['weapon', 'armor', 'head', 'accessory'] as ItemCategory[]).map((cat) => {
                const eqId = student.character.equipment[cat];
                const eqItem = SHOP_ITEMS.find(i => i.id === eqId);
                const labels = { weapon: '무기', armor: '갑옷', head: '모자', accessory: '장신구' };
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                  >
                    <span className="font-bold text-slate-500">{labels[cat]}</span>
                    {eqItem ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{eqItem.icon} {eqItem.name}</span>
                        <button
                          onClick={() => handleUnequip(cat)}
                          className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 font-bold hover:bg-rose-100"
                        >
                          해제
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">미착용</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Title Selection */}
            <div className="w-full mt-4 p-3 rounded-lg bg-white border border-slate-200">
              <span className="block text-xs font-bold text-slate-700 mb-1">칭호 선택</span>
              <div className="flex flex-wrap gap-1">
                {student.character.titles.map((title) => (
                  <button
                    key={title}
                    onClick={() => handleTitleSelect(title)}
                    className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                      student.character.activeTitle === title
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Owned Items Grid & Details */}
          <div className="md:col-span-8 flex flex-col">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4 overflow-x-auto">
              {categoryButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedCategory(btn.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    selectedCategory === btn.id
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            {filteredItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Backpack className="w-12 h-12 mb-2 stroke-1" />
                <p className="font-bold text-sm">보유 중인 아이템이 없습니다.</p>
                <p className="text-xs text-slate-400 mt-1">상점에서 멋진 장비와 꾸미기 아이템을 구매해 보세요!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
                {filteredItems.map((item) => {
                  const equipped = isEquipped(item.id);
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`p-3 rounded-xl border-2 text-left relative transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-300'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {equipped && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-white flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> 장착중
                        </span>
                      )}
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div>
                        <p className="font-bold text-xs text-slate-800 line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.statDescription}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected Item Detail Panel */}
            {selectedItem && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedItem.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      {selectedItem.name}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                        {selectedItem.rarity.toUpperCase()}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">{selectedItem.description}</p>
                    <p className="text-xs text-amber-600 font-bold mt-1">✨ {selectedItem.statDescription}</p>
                  </div>
                </div>

                <div>
                  {isEquipped(selectedItem.id) ? (
                    <button
                      onClick={() => handleUnequip(selectedItem.category as ItemCategory)}
                      className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-colors"
                    >
                      장착 해제
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEquip(selectedItem.id)}
                      className="rpg-btn px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> 장착하기
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
