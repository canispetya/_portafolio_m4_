import { typeColors } from '../data/typeColors';

export default function TypeBadge({ type }) {
  const bg = typeColors[type] || typeColors.normal;

  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider text-white shadow-md transition-transform duration-200 hover:scale-110 cursor-default"
      style={{ backgroundColor: bg, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
    >
      {type}
    </span>
  );
}
