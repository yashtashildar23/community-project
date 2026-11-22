const LABELS = ['Distressed', 'Low', 'Okay', 'Good', 'Great'];

function dailyAverages(moods, days) {
  const byDate = new Map();
  moods.forEach((entry) => {
    if (!byDate.has(entry.date)) byDate.set(entry.date, []);
    byDate.get(entry.date).push(entry.score);
  });

  const today = new Date();
  const result = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = date.toISOString().slice(0, 10);
    const scores = byDate.get(key);
    result.push({
      key,
      label: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      score: scores ? scores.reduce((sum, value) => sum + value, 0) / scores.length : null,
    });
  }
  return result;
}

export default function MoodChart({ moods, days = 14 }) {
  const series = dailyAverages(moods, days);
  const points = series.filter((point) => point.score !== null);

  if (points.length < 2) {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-dashed border-border bg-surface px-4 text-center text-sm text-muted">
        Log at least two days to see your trend.
      </div>
    );
  }

  const x = (index) => 44 + (index * 530) / (series.length - 1);
  const y = (score) => 148 - ((score - 1) / 4) * 118;
  const path = series
    .map((point, index) => (point.score === null ? null : `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(point.score)}`))
    .filter(Boolean)
    .join(' ');

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox="0 0 600 180"
        className="h-auto w-full"
        role="img"
        aria-label={`Mood trend over the last ${days} days`}
      >
        {[1, 2, 3, 4, 5].map((level) => (
          <g key={level}>
            <line
              x1="44"
              x2="574"
              y1={y(level)}
              y2={y(level)}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text x="4" y={y(level) + 4} fontSize="11" fill="var(--muted)">
              {LABELS[level - 1]}
            </text>
          </g>
        ))}

        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

        {series.map((point, index) =>
          point.score === null ? null : (
            <circle key={point.key} cx={x(index)} cy={y(point.score)} r="4.5" fill="var(--accent)">
              <title>{`${point.label}: ${LABELS[Math.round(point.score) - 1]}`}</title>
            </circle>
          )
        )}

        {series.map((point, index) =>
          index % Math.ceil(series.length / 7) === 0 || index === series.length - 1 ? (
            <text key={`label-${point.key}`} x={x(index)} y="172" fontSize="10" textAnchor="middle" fill="var(--muted)">
              {point.label}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
}
