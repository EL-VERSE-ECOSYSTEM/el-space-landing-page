// Fixed exchange rates for EL SPACE (Mocked for MVP, should ideally use an API)
// All rates are relative to 1 USD

export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  NGN: 1550, // 1 USD = 1550 NGN
  GBP: 0.78, // 1 USD = 0.78 GBP
  EUR: 0.92, // 1 USD = 0.92 EUR
  GHS: 14.5, // 1 USD = 14.5 GHS
  KES: 130.0, // 1 USD = 130 KES
  INR: 83.5, // 1 USD = 83.5 INR
  CAD: 1.37, // 1 USD = 1.37 CAD
  ZAR: 18.2, // 1 USD = 18.2 ZAR
  USDT: 1,    // Stablecoin
  SOL: 0.0068, // Example: 1 USD = 0.0068 SOL (Rate: $147/SOL)
  ETH: 0.00032, // Example: 1 USD = 0.00032 ETH (Rate: $3100/ETH)
};

/**
 * Converts an amount from one currency to another
 * @param amount Amount to convert
 * @param from Base currency
 * @param to Target currency
 * @returns Converted amount
 */
export function convertCurrency(amount: number, from: string, to: string): number {
  if (from === to) return amount;

  const fromRate = EXCHANGE_RATES[from.toUpperCase()];
  const toRate = EXCHANGE_RATES[to.toUpperCase()];

  if (!fromRate || !toRate) {
    console.error(`Missing exchange rate for ${from} or ${to}`);
    return amount; // Fallback to original amount
  }

  // Convert to USD first then to target
  const inUSD = amount / fromRate;
  return inUSD * toRate;
}

/**
 * Formats a currency amount for display
 */
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}
