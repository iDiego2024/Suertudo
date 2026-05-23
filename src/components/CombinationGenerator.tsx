import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Download, Sparkles, Shuffle, BarChart3, Fingerprint, Layers, Check, ChevronDown } from 'lucide-react';
import { GeneratorMode, Combination } from '../types';
import { generateCombinations } from '../lib/math';
import { cn } from '../lib/utils';

interface Props {
  baseSelection: number[];
  existingCombinations: Combination[];
  onGenerate: (combinations: Combination[]) => void;
}

export function CombinationGenerator({ baseSelection, existingCombinations, onGenerate }: Props) {
  const [count, setCount] = useState<number>(10);
  const [mode, setMode] = useState<GeneratorMode>('balanceado');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Use timeout to allow UI update before heavy calculation
    setTimeout(() => {
      const results = generateCombinations(count, mode, baseSelection, existingCombinations);
      onGenerate(results);
      setIsGenerating(false);
    }, 100);
  };

  const modes: { id: GeneratorMode, label: string, icon: any, desc: string }[] = [
    { id: 'aleatorio', label: '100% Aleatorio', icon: Shuffle, desc: 'Pura suerte sin filtros' },
    { id: 'balanceado', label: 'Modo Balanceado', icon: BarChart3, desc: 'Distribuye pares/impares y altos/bajos' },
    { id: 'basado-seleccion', label: 'Basado en Selección', icon: Fingerprint, desc: 'Toma tu base y aplica mutaciones ligeras' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/5" />
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2 relative z-10">
          <Layers className="text-blue-400" />
          Generador Múltiple
        </h3>
        <p className="text-slate-300 text-sm relative z-10">Crea cientos de combinaciones al instante</p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Cantidad a generar</label>
          <div className="relative">
            <input 
              type="number" 
              min="1" 
              max="10000"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xl font-black rounded-xl px-4 py-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              {[10, 50, 100].map(val => (
                <button
                  key={val}
                  onClick={() => setCount(val)}
                  className="px-3 py-2 sm:px-2 sm:py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg sm:rounded-md transition-colors"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-slate-500" />
              <span className="font-semibold text-slate-700">Configuración Avanzada</span>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", showOptions && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {showOptions && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2">
                  {modes.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
                        mode === m.id 
                          ? "border-blue-500 bg-blue-50/50 shadow-sm" 
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg",
                        mode === m.id ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                      )}>
                        <m.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={cn("font-bold text-sm", mode === m.id ? "text-blue-900" : "text-slate-700")}>
                            {m.label}
                          </span>
                          {mode === m.id && <Check className="w-4 h-4 text-blue-500" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleGenerate}
          disabled={count <= 0 || isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 group"
        >
          {isGenerating ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Sparkles className="w-6 h-6" />
            </motion.div>
          ) : (
            <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
          )}
          {isGenerating ? 'GENERANDO...' : 'GENERAR COMBINACIONES'}
        </button>
      </div>
    </div>
  );
}
