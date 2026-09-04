// Lightweight dependency-free SVG charts tuned for the FIN-SENTINEL dark ground.

export function RadarChart({
  axes,
  values,
  color = "#22d3ee",
  size = 260,
}: {
  axes: string[];
  values: number[]; // 0-100 per axis
  color?: string;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 42;
  const n = axes.length;

  const point = (i: number, radius: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const dataPts = values.map((v, i) => point(i, (v / 100) * r));
  const dataPath = dataPts.map((p) => p.join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height={size}>
      {rings.map((ring, ri) => (
        <polygon
          key={ri}
          points={axes.map((_, i) => point(i, r * ring).join(",")).join(" ")}
          fill="none"
          stroke="#27272a"
          strokeWidth={1}
        />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, r);
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#1f1f22" strokeWidth={1} />
        );
      })}
      <polygon
        points={dataPath}
        fill={`color-mix(in srgb, ${color} 18%, transparent)`}
        stroke={color}
        strokeWidth={1.5}
      />
      {dataPts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill={color} />
      ))}
      {axes.map((label, i) => {
        const [x, y] = point(i, r + 18);
        return (
          <text
            key={label}
            x={x}
            y={y}
            fill="#a1a1aa"
            fontSize={10}
            fontFamily="JetBrains Mono, monospace"
            textAnchor={x < cx - 4 ? "end" : x > cx + 4 ? "start" : "middle"}
            dominantBaseline="middle"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export function AreaChart({
  series,
  color = "#22d3ee",
  height = 200,
  markerIndex,
  compareSeries,
  compareColor = "#52525b",
}: {
  series: number[];
  color?: string;
  height?: number;
  markerIndex?: number;
  compareSeries?: number[];
  compareColor?: string;
}) {
  const w = 800;
  const h = height;
  const all = [...series, ...(compareSeries ?? [])];
  const min = Math.min(...all) * 0.9;
  const max = Math.max(...all) * 1.05;
  const range = max - min || 1;

  const toPath = (data: number[]) =>
    data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((d - min) / range) * (h - 8) - 4;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  const line = toPath(series);
  const area = `${line} L${w},${h} L0,${h} Z`;
  const gid = `grad-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1={0}
          y1={h * g}
          x2={w}
          y2={h * g}
          stroke="#1f1f22"
          strokeWidth={1}
        />
      ))}
      {compareSeries && (
        <path
          d={toPath(compareSeries)}
          fill="none"
          stroke={compareColor}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />
      )}
      <path d={area} fill={`url(#${gid})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        vectorEffect="non-scaling-stroke"
      />
      {markerIndex != null && (
        <line
          x1={(markerIndex / (series.length - 1)) * w}
          y1={0}
          x2={(markerIndex / (series.length - 1)) * w}
          y2={h}
          stroke={color}
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.5}
        />
      )}
    </svg>
  );
}
