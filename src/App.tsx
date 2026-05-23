import React, { useState } from 'react';
import { NumberGrid } from './components/NumberGrid';
import { CombinationGenerator } from './components/CombinationGenerator';
import { StatsPanel } from './components/StatsPanel';
import { GeneratedList } from './components/GeneratedList';
import { HistoryPanel } from './components/HistoryPanel';
import { Combination } from './types';
import { Dices, Trash2 } from 'lucide-react';
import { generateRandom } from './lib/math';

export default function App() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [generatedCombinaciones, setGeneratedCombinaciones] = useState<Combination[]>([]);
  const [history, setHistory] = useState<Combination[]>([]);

  const handleAzar = () => {
    setSelectedNumbers(generateRandom());
  };

  const handleBorrar = () => {
    setSelectedNumbers([]);
  };

  const appendCombinaciones = (combos: Combination[]) => {
    setGeneratedCombinaciones(prev => [...combos, ...prev]);
  };

  const clearCombinaciones = () => {
    setGeneratedCombinaciones([]);
  };

  const addHistoryDraw = (draw: Combination) => {
    setHistory(prev => [draw, ...prev]);
  };

  const removeHistoryDraw = (idx: number) => {
    setHistory(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">
      {/* Header Premium */}
      <header className="bg-red-700 bg-gradient-to-r from-red-800 to-red-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-red-800 font-black text-xl italic tracking-tighter pr-1">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tight drop-shadow-md">SUERTUDO PRO</h1>
              <p className="text-xs font-medium text-red-200 tracking-wider uppercase">Generador Inteligente</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Columna Izquierda: Grid de Números */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-red-600 bg-gradient-to-b from-red-600 to-red-700 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <NumberGrid 
                selected={selectedNumbers} 
                onChange={setSelectedNumbers} 
              />

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={handleAzar}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-red-950 font-bold py-3 sm:py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/30 transition-all active:scale-95"
                >
                  <Dices className="w-5 h-5" />
                  AZAR
                </button>
                <button 
                  onClick={handleBorrar}
                  disabled={selectedNumbers.length === 0}
                  className="flex-1 bg-red-800/50 hover:bg-red-800 text-white font-bold py-3 sm:py-4 px-4 rounded-xl flex items-center justify-center gap-2 border border-red-500 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  <Trash2 className="w-5 h-5" />
                  BORRAR
                </button>
              </div>
            </div>

            <CombinationGenerator 
              baseSelection={selectedNumbers}
              existingCombinations={generatedCombinaciones}
              onGenerate={appendCombinaciones}
            />
          </div>

          {/* Columna Derecha: Probabilidades y Resultados */}
          <div className="lg:col-span-5 space-y-6">
            <HistoryPanel 
              history={history}
              onAdd={addHistoryDraw}
              onRemove={removeHistoryDraw}
            />

            <StatsPanel />
            
            {generatedCombinaciones.length > 0 && (
              <div className="h-[600px]">
                <GeneratedList 
                  combinations={generatedCombinaciones} 
                  onClear={clearCombinaciones}
                />
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}

