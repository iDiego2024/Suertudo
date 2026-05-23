export function combinaciones(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let c = 1;
  for (let i = 0; i < k; i++) {
    c = c * (n - i) / (i + 1);
  }
  return c;
}

export function probabilidadAcierto(n: number, totalDrawn: number, chosen: number, aciertos: number): number {
  // n = total numbers (25)
  // totalDrawn = numbers drawn in lottery (14)
  // chosen = numbers we chose (14)
  const formasAcierto = combinaciones(totalDrawn, aciertos);
  const formasFallo = combinaciones(n - totalDrawn, chosen - aciertos);
  const casosPosibles = combinaciones(n, totalDrawn);
  
  return (formasAcierto * formasFallo) / casosPosibles;
}

// Generate simple random
export function generateRandom(): number[] {
  const pool = Array.from({length: 25}, (_, i) => i + 1);
  const result: number[] = [];
  for (let i = 0; i < 14; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return result.sort((a, b) => a - b);
}

// Balanced Generator (tries to balance odds/evens 7/7 or 6/8 and high/lows)
export function generateBalanced(): number[] {
  let best: number[] = [];
  let bestScore = Infinity;
  for (let i = 0; i < 10; i++) {
    const candidate = generateRandom();
    const evens = candidate.filter(x => x % 2 === 0).length;
    const odds = candidate.length - evens;
    const highs = candidate.filter(x => x > 13).length; // >13 is high
    const lows = candidate.length - highs;
    
    // perfect is 7 evens, 7 odds, 7 highs, 7 lows
    const score = Math.abs(evens - 7) + Math.abs(highs - 7);
    if(score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}

// Smart Mutation (based on base selection)
export function generateBasedOn(base: number[], numChanges: number = 4): number[] {
  if (base.length !== 14) return generateBalanced();
  const keep = [...base];
  const all = Array.from({length: 25}, (_, i) => i + 1);
  const available = all.filter(n => !keep.includes(n));
  
  // replace 'numChanges' items
  for(let i=0; i<numChanges; i++) {
    if (keep.length === 0 || available.length === 0) break;
    const dropIdx = Math.floor(Math.random() * keep.length);
    keep.splice(dropIdx, 1);
    const addIdx = Math.floor(Math.random() * available.length);
    keep.push(available[addIdx]);
    available.splice(addIdx, 1);
  }
  
  return keep.sort((a, b) => a - b);
}

export function generateCombinations(count: number, mode: import('../types').GeneratorMode, baseSelection?: number[]): number[][] {
  const results = new Set<string>();
  const parsedResults: number[][] = [];
  
  let attempts = 0;
  const maxAttempts = count * 20;
  
  while(parsedResults.length < count && attempts < maxAttempts) {
    let candidate: number[];
    if (mode === 'balanceado') {
      candidate = generateBalanced();
    } else if (mode === 'basado-seleccion' && baseSelection?.length === 14) {
      candidate = generateBasedOn(baseSelection, Math.floor(Math.random() * 5) + 2);
    } else {
      candidate = generateRandom();
    }
    
    const key = candidate.join(',');
    if (!results.has(key)) {
      results.add(key);
      parsedResults.push(candidate);
    }
    attempts++;
  }
  
  return parsedResults;
}
