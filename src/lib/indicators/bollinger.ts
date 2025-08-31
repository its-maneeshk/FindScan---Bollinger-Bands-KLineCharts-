import { Candle } from "../types";

//  Options for Bollinger Bands
export interface BollingerOptions {
  length: number;       
  multiplier: number;  
  offset: number;       
  source: keyof Candle; 
}

//  Output type for Bollinger Bands
export interface BollingerPoint {
  timestamp: number;
  basis: number | null;
  upper: number | null;
  lower: number | null;
}


//  Simple Moving Average
function sma(values: number[]): number {
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

  // Population Standard Deviation
function stddev(values: number[]): number {
  const mean = sma(values);
  const variance =
    values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) /
    values.length;
  return Math.sqrt(variance);
}

//  Compute Bollinger Bands for given OHLCV candles
export function computeBollingerBands(
  data: Candle[],
  opts: BollingerOptions
): BollingerPoint[] {
  const { length, multiplier, offset, source } = opts;
  const results: BollingerPoint[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i + 1 < length) {
      results.push({
        timestamp: data[i].timestamp,
        basis: null,
        upper: null,
        lower: null,
      });
      continue;
    }

    const slice = data.slice(i + 1 - length, i + 1).map((d) => d[source] as number);
    const basis = sma(slice);
    const sd = stddev(slice);
    const upper = basis + multiplier * sd;
    const lower = basis - multiplier * sd;

    results.push({
      timestamp: data[i].timestamp,
      basis,
      upper,
      lower,
    });
  }

  // Apply offset (shift forward/backward by N bars)
  if (offset !== 0) {
    const shifted: BollingerPoint[] = results.map((p, i) => {
      const targetIndex = i + offset;
      if (targetIndex < 0 || targetIndex >= results.length) {
        return { ...p, basis: null, upper: null, lower: null };
      }
      return { ...p, ...results[targetIndex] };
    });
    return shifted;
  }

  return results;
}
