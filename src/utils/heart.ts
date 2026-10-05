export type HeartPoint = { x: number; y: number; rotate: number; scale: number };

export function makeHeartPoints(count: number): HeartPoint[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const t = i * goldenAngle;
    const r = Math.sqrt((i + 1) / count);
    const xCurve = 16 * Math.pow(Math.sin(t), 3);
    const yCurve = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const x = 50 + (xCurve / 18) * 43 * r;
    const y = 46 - (yCurve / 18) * 39 * r;
    return {
      x,
      y,
      rotate: ((i * 29) % 9) - 4,
      scale: 0.82 + ((i * 17) % 22) / 100,
    };
  });
}
