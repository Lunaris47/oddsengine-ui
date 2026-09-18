export function parseOddsList(value) {
  const parts = value.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2)
    throw new Error("Enter at least two values, comma-separated.");

  return parts.map((p) => {
    const n = parseInt(p, 10);
    if (Number.isNaN(n)) throw new Error(`"${p}" is not a valid number.`);
    return n;
  });
}
