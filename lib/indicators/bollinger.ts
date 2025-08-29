
import type { Indicator, KLineData } from 'klinecharts'

/**
 * Custom Bollinger Bands indicator 'BB' for KLineCharts v9.
 * - Basis = SMA(length, source)
 * - SD = population standard deviation over the same window
 * - Upper = Basis + multiplier * SD
 * - Lower = Basis - multiplier * SD
 *
 * calcParams: [length, multiplier, offset]
 */
function sma(values: number[], length: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null)
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    sum += values[i]
    if (i >= length) sum -= values[i - length]
    if (i >= length - 1) out[i] = sum / length
  }
  return out
}

function populationStd(values: number[], length: number, means: (number | null)[]): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null)
  for (let i = 0; i < values.length; i++) {
    if (i >= length - 1 && means[i] != null) {
      let v = 0
      for (let j = i - length + 1; j <= i; j++) {
        const d = values[j] - (means[i] as number)
        v += d * d
      }
      out[i] = Math.sqrt(v / length) // population
    }
  }
  return out
}

export const BBIndicator: Indicator = {
  name: 'BB',
  shortName: 'BB',
  calcParams: [20, 2, 0],
  figures: [
    { key: 'upper', title: 'Upper', type: 'line' },
    { key: 'basis', title: 'Basis', type: 'line' },
    { key: 'lower', title: 'Lower', type: 'line' },
    // A virtual figure used by draw() to read background styles
    { key: 'background', title: 'Background', type: 'line' },
  ],
  series: 'price',
  shouldOhlc: false,
  precision: 4,
  minValue: 'normal',
  maxValue: 'normal',
  calc: (kList: KLineData[], { params }) => {
    const length = Math.max(1, (params?.[0] ?? 20) as number)
    const multiplier = (params?.[1] ?? 2) as number
    const offset = Math.trunc((params?.[2] ?? 0) as number)

    const closes = kList.map(k => k.close)
    const mean = sma(closes, length)
    const sd = populationStd(closes, length, mean)

    const basisArr: (number | null)[] = []
    const upperArr: (number | null)[] = []
    const lowerArr: (number | null)[] = []

    for (let i = 0; i < kList.length; i++) {
      const m = mean[i]
      const s = sd[i]
      if (m == null || s == null) {
        basisArr.push(null); upperArr.push(null); lowerArr.push(null)
      } else {
        basisArr.push(m)
        upperArr.push(m + multiplier * s)
        lowerArr.push(m - multiplier * s)
      }
    }

    // apply offset by shifting results by 'offset' bars
    const shift = (arr: (number | null)[], off: number) => {
      if (!off) return arr
      const out = new Array(arr.length).fill(null) as (number | null)[]
      for (let i = 0; i < arr.length; i++) {
        const j = i + off
        if (j >= 0 && j < arr.length) out[j] = arr[i]
      }
      return out
    }

    const basis = shift(basisArr, offset)
    const upper = shift(upperArr, offset)
    const lower = shift(lowerArr, offset)

    return basis.map((_, i) => ({
      basis: basis[i] ?? undefined,
      upper: upper[i] ?? undefined,
      lower: lower[i] ?? undefined,
    }))
  },

  // Optional: draw background fill between upper and lower when visible.
  // Uses v9 draw context; if your installed version differs, you can remove this block.
  // The Chart component updates the 'background' figure's styles (color, opacity, visible).
  // We apply canvas globalAlpha for opacity and let utils.drawPolygon handle the fill.
  draw: ({ ctx, visibleRange, xAxis, yAxis, indicator, utils, dataSource }) => {
    try {
      const results: any[] = (dataSource && (dataSource as any).indicatorDatas) || []
      if (!results || results.length === 0) return
      const fig = (indicator.figures || []).find(f => f.key === 'background') as any
      const styles = (fig && fig.styles) || {}
      const visible = styles.visible !== false
      const opacity = typeof styles.opacity === 'number' ? Math.max(0, Math.min(1, styles.opacity)) : 0
      if (!visible || opacity <= 0) return

      const { from, to } = visibleRange
      const uppers: Array<{x:number;y:number}> = []
      const lowers: Array<{x:number;y:number}> = []

      for (let i = from; i <= to; i++) {
        const v = results[i]
        if (!v || v.upper == null || v.lower == null) continue
        const x = xAxis.convertToPixel(i)
        uppers.push({ x, y: yAxis.convertToPixel(v.upper) })
      }
      for (let i = to; i >= from; i--) {
        const v = results[i]
        if (!v || v.upper == null || v.lower == null) continue
        const x = xAxis.convertToPixel(i)
        lowers.push({ x, y: yAxis.convertToPixel(v.lower) })
      }

      const polygon = { coordinates: [...uppers, ...lowers] }
      const baseColor = styles.color || '#22d3ee'
      const alphaPrev = ctx.globalAlpha
      ctx.globalAlpha = opacity
      utils.drawPolygon(ctx, polygon, { style: 'fill', color: baseColor })
      ctx.globalAlpha = alphaPrev
    } catch {}
  },
}
