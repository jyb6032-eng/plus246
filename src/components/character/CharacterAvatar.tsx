import React from 'react';
import { CharacterData, JobType } from '../../types';
import { SHOP_ITEMS } from '../../services/gameData';

interface Props {
  character: CharacterData;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  animated?: boolean;
}

export const CharacterAvatar: React.FC<Props> = ({
  character,
  size = 'md',
  showBadge = true,
  animated = false,
}) => {
  const { appearance, job, level, equipment, activeTitle } = character;

  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-20 h-20 text-sm',
    lg: 'w-28 h-28 text-base',
    xl: 'w-36 h-36 text-lg',
  };

  const jobColors: Record<JobType, { ring: string; bg: string; icon: string; name: string }> = {
    warrior: { ring: 'ring-amber-500', bg: 'bg-amber-100', icon: '⚔️', name: '전사' },
    wizard: { ring: 'ring-purple-500', bg: 'bg-purple-100', icon: '🔮', name: '마법사' },
    healer: { ring: 'ring-emerald-500', bg: 'bg-emerald-100', icon: '🌿', name: '힐러' },
    explorer: { ring: 'ring-sky-500', bg: 'bg-sky-100', icon: '🏹', name: '탐험가' },
  };

  const jobTheme = jobColors[job] || jobColors.warrior;

  // Find equipped items info
  const equippedWeapon = SHOP_ITEMS.find(i => i.id === equipment.weapon);
  const equippedHead = SHOP_ITEMS.find(i => i.id === equipment.head);
  const equippedAccessory = SHOP_ITEMS.find(i => i.id === equipment.accessory);

  const hairColorHex: Record<string, string> = {
    black: '#1f2937',
    brown: '#78350f',
    blonde: '#fbbf24',
    blue: '#3b82f6',
    pink: '#ec4899',
  };

  const hairColor = hairColorHex[appearance?.hairColor || 'black'] || '#1f2937';

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {/* Outer Glow / Aura for High Levels */}
      <div
        className={`relative rounded-full flex items-center justify-center ${sizeClasses[size]} ${jobTheme.bg} ring-4 ${jobTheme.ring} shadow-md overflow-hidden transition-transform duration-200 ${
          animated ? 'hover:scale-105' : ''
        }`}
      >
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-black/10 pointer-events-none" />

        {/* SVG Custom Avatar Drawing */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Face */}
          <circle cx="50" cy="50" r="32" fill="#fde047" opacity="0.35" />
          <circle cx="50" cy="50" r="30" fill="#fed7aa" />

          {/* Cheeks */}
          <circle cx="34" cy="55" r="4" fill="#f43f5e" opacity="0.3" />
          <circle cx="66" cy="55" r="4" fill="#f43f5e" opacity="0.3" />

          {/* Eyes */}
          <circle cx="38" cy="46" r="3.5" fill="#1e293b" />
          <circle cx="62" cy="46" r="3.5" fill="#1e293b" />
          <circle cx="39.5" cy="44.5" r="1.2" fill="#ffffff" />
          <circle cx="63.5" cy="44.5" r="1.2" fill="#ffffff" />

          {/* Smile */}
          <path
            d="M 43 56 Q 50 62 57 56"
            stroke="#1e293b"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Hair Styles */}
          {appearance?.hairStyle === 'twin' ? (
            <g fill={hairColor}>
              {/* Twin tails */}
              <path d="M 22 45 Q 12 35 18 22 Q 28 32 30 40 Z" />
              <path d="M 78 45 Q 88 35 82 22 Q 72 32 70 40 Z" />
              {/* Bangs */}
              <path d="M 25 35 Q 50 20 75 35 Q 60 22 50 28 Q 40 22 25 35 Z" />
            </g>
          ) : appearance?.hairStyle === 'curly' ? (
            <g fill={hairColor}>
              <circle cx="32" cy="28" r="9" />
              <circle cx="50" cy="24" r="10" />
              <circle cx="68" cy="28" r="9" />
              <path d="M 28 35 Q 50 28 72 35 Q 50 20 28 35 Z" />
            </g>
          ) : appearance?.hairStyle === 'wild' ? (
            <g fill={hairColor}>
              <polygon points="30,35 20,20 40,26 50,14 60,26 80,20 70,35" />
            </g>
          ) : (
            // Default Short
            <path
              d="M 24 38 Q 50 18 76 38 Q 65 24 50 24 Q 35 24 24 38 Z"
              fill={hairColor}
            />
          )}

          {/* Body / Outfit */}
          <path
            d="M 28 80 Q 50 68 72 80 L 75 100 L 25 100 Z"
            fill={
              appearance?.outfit === 'robe'
                ? '#8b5cf6'
                : appearance?.outfit === 'formal'
                ? '#334155'
                : appearance?.outfit === 'sporty'
                ? '#0ea5e9'
                : '#f59e0b'
            }
          />
        </svg>

        {/* Equipped Head item overlay */}
        {equippedHead && (
          <div className="absolute top-0 text-center text-sm md:text-xl drop-shadow">
            {equippedHead.icon}
          </div>
        )}

        {/* Equipped Accessory */}
        {equippedAccessory && (
          <div className="absolute top-2 right-1 text-xs md:text-base drop-shadow animate-bounce">
            {equippedAccessory.icon}
          </div>
        )}

        {/* Equipped Weapon Overlay */}
        {equippedWeapon && (
          <div className="absolute bottom-0 right-0 text-sm md:text-2xl drop-shadow transform translate-x-1 translate-y-1">
            {equippedWeapon.icon}
          </div>
        )}
      </div>

      {/* Level & Job Badge */}
      {showBadge && (
        <div className="mt-1 flex items-center gap-1">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-amber-300 shadow">
            Lv.{level}
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-white text-slate-800 border border-slate-300 shadow-sm">
            {jobTheme.icon} {jobTheme.name}
          </span>
        </div>
      )}

      {/* Active Title */}
      {activeTitle && size !== 'sm' && (
        <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md mt-0.5 border border-sky-200 truncate max-w-[130px]">
          {activeTitle}
        </span>
      )}
    </div>
  );
};
