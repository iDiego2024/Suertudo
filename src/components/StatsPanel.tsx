import React, { useMemo } from 'react';
import { probabilidadAcierto } from '../lib/math';
import { motion } from 'motion/react';
import { Target, Trophy, Percent, TrendingUp } from 'lucide-react';

export function StatsPanel() {
  const stats = useMemo(() => {
    return [
      { name: '14 Aciertos', prob: probabilidadAcierto(25, 14, 14, 14), label: 'Kino', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
      { name: '13 Aciertos', prob: probabilidadAcierto(25, 14, 14, 13), label: '13 Aciertos', icon: Target, color: 'text-orange-400', bg: 'bg-orange-400/10' },
      { name: '12 Aciertos', prob: probabilidadAcierto(25, 14, 14, 12), label: '12 Aciertos', icon: Target, color: 'text-orange-500', bg: 'bg-orange-500/10' },
      { name: '11 Aciertos', prob: probabilidadAcierto(25, 14, 14, 11), label: '11 Aciertos', icon: Target, color: 'text-red-400', bg: 'bg-red-400/10' },
      { name: '10 Aciertos', prob: probabilidadAcierto(25, 14, 14, 10), label: '10 Aciertos', icon: Target, color: 'text-red-500', bg: 'bg-red-500/10' },
    ]
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Probabilidades Matemáticas</h3>
      </div>
      
      <div className="space-y-3">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.name} 
            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="font-semibold text-slate-700">{stat.label}</span>
            </div>
            
            <div className="text-right flex flex-col">
              <span className="font-mono font-bold text-sm text-slate-900">
                1 en {Math.round(1 / stat.prob).toLocaleString('es-CL')}
              </span>
              <span className="text-xs font-medium text-slate-400 flex items-center justify-end gap-1">
                <Percent className="w-3 h-3" />
                {(stat.prob * 100).toFixed(6)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl">
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Las probabilidades están calculadas con base en fórmulas combinatorias reales para un pozo de 25 números de los cuales se sortean 14. 
          <br/><br/>
          Total de combinaciones posibles: <strong className="text-slate-700 font-mono">4.457.400</strong>
        </p>
      </div>
    </div>
  )
}
