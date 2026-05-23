export type Combination = number[]; // length 14
export type GeneratorMode = 'aleatorio' | 'balanceado' | 'estadistico' | 'basado-seleccion';

export interface AppState {
  selectedNumbers: number[];
  generatedCombinations: Combination[];
  isGenerating: boolean;
}
