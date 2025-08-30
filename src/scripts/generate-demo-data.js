const fs = require('fs');
const path = require('path');

function gen(seed=1000, n=400) {
  const out = [];
  let lastClose = seed;
  const start = Date.now() - n * 60 * 60 * 1000; // hourly candles
  for (let i = 0; i < n; i++) {
    const timestamp = start + i * 60 * 60 * 1000;
    const volatility = Math.max(0.5, Math.abs((Math.sin(i/10) + Math.random()*0.6) * 1.5));
    const open = lastClose;
    const change = (Math.random() * 2 - 1) * volatility;
    const close = +(open + change).toFixed(2);
    const high = Math.max(open, close) + +(Math.random() * volatility).toFixed(2);
    const low = Math.min(open, close) - +(Math.random() * volatility).toFixed(2);
    const volume = Math.round(100 + Math.random() * 1000);
    out.push({ timestamp, open, high, low, close, volume });
    lastClose = close;
  }
  return out;
}

const data = gen(100, 400);
const dst = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(dst)) fs.mkdirSync(dst, {recursive:true});
fs.writeFileSync(path.join(dst, 'ohlcv.json'), JSON.stringify(data, null, 2));
console.log('wrote public/data/ohlcv.json with', data.length, 'candles');
