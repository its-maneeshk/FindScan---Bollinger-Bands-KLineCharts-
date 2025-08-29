export type BBSettings = {
  length: number;
  multiplier: number;
  offset: number;
  maType: 'SMA';
  source: 'close';
  showUpper: boolean;
  showBasis: boolean;
  showLower: boolean;
  upperColor: string;
  basisColor: string;
  lowerColor: string;
  lineWidth: number;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  showBackground: boolean;
  backgroundOpacity: number; // 0..1
};
