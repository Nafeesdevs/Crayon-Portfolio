import { hash, rng, CRAYONS } from '../lib/api';

// Unique generative "crayon doodle" cover for projects without an image
export default function CoverArt({ title = '', color = '#FF5A5F' }) {
  const r = rng(hash(title) || 7);
  const pick = () => CRAYONS[Math.floor(r() * CRAYONS.length)];
  const shapes = Array.from({ length: 7 }, (_, i) => ({
    type: Math.floor(r() * 3),
    x: r() * 400,
    y: r() * 300,
    s: 30 + r() * 80,
    rot: r() * 360,
    c: i === 0 ? color : pick(),
  }));
  const squiggle = Array.from({ length: 8 }, (_, i) => `${i * 60} ${150 + (r() - 0.5) * 140}`).join(' L ');

  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill={color} opacity=".22" />
      <defs>
        <pattern id={`dots-${hash(title)}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#17151C" opacity=".18" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#dots-${hash(title)})`} />
      {shapes.map((s, i) =>
        s.type === 0 ? (
          <circle key={i} cx={s.x} cy={s.y} r={s.s / 2} fill={s.c} stroke="#17151C" strokeWidth="3" />
        ) : s.type === 1 ? (
          <rect key={i} x={s.x} y={s.y} width={s.s} height={s.s} rx="10" fill={s.c} stroke="#17151C" strokeWidth="3" transform={`rotate(${s.rot} ${s.x + s.s / 2} ${s.y + s.s / 2})`} />
        ) : (
          <polygon key={i} points={`${s.x},${s.y - s.s / 2} ${s.x + s.s / 2},${s.y + s.s / 2} ${s.x - s.s / 2},${s.y + s.s / 2}`} fill={s.c} stroke="#17151C" strokeWidth="3" transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
        )
      )}
      <path d={`M ${squiggle}`} fill="none" stroke="#17151C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="200" y="170" textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight="800" fontSize="64" fill="#fff" stroke="#17151C" strokeWidth="3" paintOrder="stroke">
        {title.slice(0, 10)}
      </text>
    </svg>
  );
}
