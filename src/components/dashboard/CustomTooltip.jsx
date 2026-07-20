import { fmtINR } from "../../utils/format";

export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: p.color || p.fill }}
          />
          <span className="text-gray-300">{p.name}:</span>
          <span className="font-medium">{fmtINR(p.value, 2)}</span>
        </p>
      ))}
    </div>
  );
}
