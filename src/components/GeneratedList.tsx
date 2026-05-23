import React, { useState } from 'react';
import { Combination } from '../types';
import { Download, FileText, Copy, Trash2, List, Mail, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  combinations: Combination[];
  onClear: () => void;
}

export function GeneratedList({ combinations, onClear }: Props) {
  const [copied, setCopied] = useState(-1);

  if (combinations.length === 0) return null;

  const handleCopy = (idx: number, combo: Combination) => {
    navigator.clipboard.writeText(combo.join(', '));
    setCopied(idx);
    setTimeout(() => setCopied(-1), 2000);
  };

  const exportText = () => {
    const text = combinations.map((c, i) => `Jugada ${i + 1}: ${c.join(', ')}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kino_combinaciones.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const header = Array.from({length: 14}, (_, i) => `N${i+1}`).join(',');
    const text = [header, ...combinations.map(c => c.join(','))].join('\n');
    const blob = new Blob([text], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kino_combinaciones.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportWhatsApp = () => {
    const combs = combinations.slice(0, 50);
    const text = combs.map((c, i) => `Jugada ${i + 1}: ${c.join(', ')}`).join('%0A');
    let message = `Mis combinaciones de Suertudo Pro:%0A%0A${text}`;
    if (combinations.length > 50) {
      message += `%0A%0A(Mostrando 50 de ${combinations.length} combinaciones completas)`;
    }
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const exportEmail = () => {
    const combs = combinations.slice(0, 200);
    const text = combs.map((c, i) => `Jugada ${i + 1}: ${c.join(', ')}`).join('%0A');
    let subject = 'Mis combinaciones - Suertudo Pro';
    let body = `Aquí están tus combinaciones generadas con Suertudo Pro:%0A%0A${text}`;
    if (combinations.length > 200) {
        body += `%0A%0A(Mostrando 200 de ${combinations.length} combinaciones completas)`;
    }
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col h-full max-h-[800px]">
      <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <List className="text-blue-500 w-5 h-5" />
            Resultados Generados
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            <span className="text-slate-800 font-bold">{combinations.length}</span> combinaciones listas
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={exportText} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors" title="Descargar como Texto">
             <FileText className="w-3.5 h-3.5" /> TXT
          </button>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors" title="Descargar CSV">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button onClick={exportWhatsApp} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors" title="Enviar por WhatsApp">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </button>
          <button onClick={exportEmail} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors" title="Enviar por Correo">
            <Mail className="w-3.5 h-3.5" /> Correo
          </button>
          <button onClick={onClear} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition-colors ml-auto sm:ml-0" title="Limpiar todo">
            <Trash2 className="w-3.5 h-3.5" /> Limpiar
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 bg-slate-50/50">
        <AnimatePresence>
          {combinations.slice(0, 500).map((combo, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.5) }}
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 transition-colors group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-400 bg-slate-100 rounded-md px-2 py-1 min-w-[3rem] text-center">
                  #{idx + 1}
                </span>
                <div className="flex flex-wrap gap-1">
                  {combo.map(num => (
                    <span 
                      key={Math.random()} 
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm font-bold text-slate-700"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => handleCopy(idx, combo)}
                className="self-end sm:self-auto p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
                title="Copiar"
              >
                {copied === idx ? <span className="text-xs font-bold text-emerald-500">¡Copiado!</span> : <Copy className="w-4 h-4" />}
              </button>
            </motion.div>
          ))}
          
          {combinations.length > 500 && (
            <div className="p-4 text-center text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-xl">
              Mostrando las primeras 500 combinaciones en pantalla. Utiliza las opciones de exportación para descargar el total de {combinations.length}.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
