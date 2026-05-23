import React, { useCallback, useMemo } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface NumberGridProps {
  selected: number[];
  onChange: (selected: number[]) => void;
}

export function NumberGrid({ selected, onChange }: NumberGridProps) {
  const toggleNumber = useCallback((num: number) => {
    if (selected.includes(num)) {
      onChange(selected.filter(n => n !== num));
    } else {
      if (selected.length < 14) {
        onChange([...selected, num].sort((a, b) => a - b));
      }
    }
  }, [selected, onChange]);

  const numbers = useMemo(() => Array.from({length: 25}, (_, i) => i + 1), []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">Tu Jugada</h2>
          <p className="text-sm sm:text-base text-red-100">Elige 14 números para tu base</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="bg-red-800 rounded-lg px-3 py-1 flex items-baseline gap-1 shadow-inner border border-red-700">
            <span className={cn(
              "text-2xl font-black drop-shadow-md transition-colors", 
              selected.length === 14 ? "text-yellow-400" : "text-white"
            )}>
              {selected.length}
            </span>
            <span className="text-red-200 text-sm font-semibold">/ 14</span>
          </div>
          {selected.length === 14 && (
            <motion.span 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs text-yellow-300 font-medium mt-1 drop-shadow-md"
            >
              ¡Completado!
            </motion.span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-4 justify-items-center">
        {numbers.map(num => {
          const isSelected = selected.includes(num);
          return (
            <motion.button
              key={num}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleNumber(num)}
              className={cn(
                "relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg sm:text-2xl font-black transition-all cursor-pointer shadow-lg",
                isSelected 
                  ? "bg-gradient-to-br from-yellow-300 to-yellow-500 text-red-950 scale-105 border-2 border-yellow-200/50 shadow-yellow-500/40" 
                  : "bg-white text-slate-800 hover:bg-slate-50 border-2 border-transparent hover:border-slate-300"
              )}
            >
              <span className="drop-shadow-sm">{num}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
