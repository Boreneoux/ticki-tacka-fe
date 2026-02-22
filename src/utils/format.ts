export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/** Like formatCurrency but returns 'Free' for zero-price items (used on event cards & listings). */
export function formatEventPrice(value: number): string {
  if (value === 0) return 'Free';
  return formatCurrency(value);
}
