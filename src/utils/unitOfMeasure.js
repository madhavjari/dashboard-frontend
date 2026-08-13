const UNIT_DEFINITIONS = [
  {
    key: "weight",
    aliases: ["W", "N"],
    quantityField: "weight",
    label: "kg",
  },
  {
    key: "metre",
    aliases: ["M", "MTR"],
    quantityField: "meters",
    label: "metre",
  },
  {
    key: "pieces",
    aliases: ["P", "PCS"],
    quantityField: "pcs",
    label: "pcs",
  },
];

const DEFAULT_UNIT = UNIT_DEFINITIONS.find((unit) => unit.key === "pieces");
const UNIT_BY_ALIAS = new Map(
  UNIT_DEFINITIONS.flatMap((unit) =>
    unit.aliases.map((alias) => [alias, unit]),
  ),
);

export function normalizeUnitCode(per) {
  return String(per ?? "").trim().toUpperCase();
}

export function getUnitDefinition(per) {
  return UNIT_BY_ALIAS.get(normalizeUnitCode(per)) ?? DEFAULT_UNIT;
}

export function getUnitKey(per) {
  const code = normalizeUnitCode(per);
  if (!code) return null;

  return UNIT_BY_ALIAS.get(code)?.key ?? `unknown:${code}`;
}

export function getUnitLabel(per) {
  const code = normalizeUnitCode(per);
  if (!code) return DEFAULT_UNIT.label;

  return UNIT_BY_ALIAS.get(code)?.label ?? DEFAULT_UNIT.label;
}

export function getQuantityForUnit(record) {
  const unit = getUnitDefinition(record?.per);
  return record?.[unit.quantityField];
}

export function getNumericQuantityForUnit(record) {
  return Number(getQuantityForUnit(record)) || 0;
}
