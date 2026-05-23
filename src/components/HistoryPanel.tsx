import React, { useState, useMemo } from 'react';
import { History, Flame, Snowflake, Plus, Trash2, AlertCircle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Combination } from '../types';
import { cn } from '../lib/utils';

interface Props {
  history: Combination[];
  onAdd: (draw: Combination) => void;
  onRemove: (idx: number) => void;
}

export function HistoryPanel({ history, onAdd, onRemove }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    // Extraer números separados por comas, espacios o guiones
    const parts = inputValue.split(/[\s,\-]+/);
    const nums = parts.map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= 25);
    const unique = Array.from(new Set(nums)).sort((a, b) => a - b);
    
    if (unique.length === 14) {
      onAdd(unique);
      setInputValue('');
      setError('');
    } else {
      setError(`Debes ingresar exactamente 14 números únicos entre 1 y 25. Detectados: ${unique.length}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const trends = useMemo(() => {
    if (history.length === 0) return null;

    const freqs = Array(25).fill(0);
    history.forEach(draw => {
      draw.forEach(num => {
        if (num >= 1 && num <= 25) freqs[num - 1]++;
      });
    });

    const stats = freqs.map((count, i) => ({ num: i + 1, count }));
    
    // Agrupar por frecuencia
    const sorted = [...stats].sort((a, b) => b.count - a.count);
    
    const maxCount = sorted[0].count;
    const minCount = sorted[sorted.length - 1].count;

    // Hot: Los más frecuentes (top 5 aprox)
    const hot = sorted.filter(s => s.count > 0).slice(0, 5);
    // Cold: Los menos frecuentes (bottom 5, incluso si su cuenta es 0)
    const cold = [...sorted].sort((a, b) => a.count - b.count).slice(0, 5);

    return { hot, cold, freqs, maxCount };
  }, [history]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <History className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Historial y Tendencias</h3>
        </div>
        {history.length > 0 && (
          <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1 rounded-md">
            {history.length} sorteos
          </span>
        )}
      </div>
      
      <div className="p-5 space-y-4">
        {/* Input area */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Añadir Sorteo Anterior</label>
          <div className="flex gap-2 relative">
            <input 
              type="text" 
              placeholder="Ej: 1, 4, 7, 12, 14, 15, 18, 19, 20, 21, 23, 24, 25" 
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-slate-50 border border-slate-200 text-sm rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono"
            />
            <button 
              onClick={handleAdd}
              disabled={!inputValue}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white p-2 rounded-xl transition-colors shrink-0"
              title="Añadir a historial"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trends Visualization */}
        {trends ? (
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" /> Números Calientes
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {trends.hot.map((stat, i) => (
                  <div key={`hot-${stat.num}`} className="flex flex-col items-center justify-center bg-orange-50 border border-orange-200 rounded-lg w-10 h-10 shadow-sm relative group cursor-help">
                    <span className="font-bold text-orange-700 text-sm">{stat.num}</span>
                    {/* Tooltip de frecuencia */}
                    <div className="absolute bottom-full mb-1 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">
                      {stat.count} apariciones
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Snowflake className="w-4 h-4 text-blue-500" /> Números Fríos
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {trends.cold.map((stat, i) => (
                  <div key={`cold-${stat.num}`} className="flex flex-col items-center justify-center bg-blue-50 border border-blue-200 rounded-lg w-10 h-10 shadow-sm relative group cursor-help">
                    <span className="font-bold text-blue-700 text-sm">{stat.num}</span>
                    <div className="absolute bottom-full mb-1 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">
                      {stat.count} apariciones
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t border-slate-100 py-6 text-center text-sm text-slate-400 font-medium">
            Agrega resultados anteriores para calcular tendencias.
          </div>
        )}

        {/* History List */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 mb-2">SORTEOS GUARDADOS</h4>
            <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
              {history.map((draw, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2 rounded-lg text-xs hover:bg-slate-100 transition-colors">
                  <div className="font-mono text-slate-600 truncate mr-2">
                    {draw.join(', ')}
                  </div>
                  <button 
                    onClick={() => onRemove(idx)} 
                    className="text-red-400 hover:text-red-600 transition-colors shrink-0" 
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
