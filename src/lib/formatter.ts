export function formatCurrency(amount: number, currency: string) {
  const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
    minimumFractionDigits: 0,
  });
  return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}
