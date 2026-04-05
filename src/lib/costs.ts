import { Period, Subscription, CostSummary } from "./types";

const DAYS_PER_PERIOD: Record<Period, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30.4375,
  quarterly: 91.3125,
  yearly: 365.25,
};

function toDailyRate(amount: number, period: Period): number {
  return amount / DAYS_PER_PERIOD[period];
}

export function calculateCostSummary(
  subscriptions: Subscription[]
): CostSummary[] {
  const byCurrency: Record<string, number> = {};

  for (const sub of subscriptions) {
    const daily = toDailyRate(sub.amount, sub.period);
    byCurrency[sub.currency] = (byCurrency[sub.currency] || 0) + daily;
  }

  return Object.entries(byCurrency).map(([currency, dailyTotal]) => ({
    currency,
    daily: Math.round(dailyTotal * 100) / 100,
    weekly: Math.round(dailyTotal * 7 * 100) / 100,
    monthly: Math.round(dailyTotal * 30.4375 * 100) / 100,
    yearly: Math.round(dailyTotal * 365.25 * 100) / 100,
  }));
}
