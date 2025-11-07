export function formatPrice(
  value: number | string,
  currency: string = "INR"
): string {
  const num = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(num)) return String(value);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(num);
}
