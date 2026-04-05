"use client";

import { CostSummary } from "@/lib/types";

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "\u00a3",
  USD: "$",
  EUR: "\u20ac",
  AUD: "A$",
  CAD: "C$",
  JPY: "\u00a5",
};

function sym(currency: string) {
  return CURRENCY_SYMBOLS[currency] || currency + " ";
}

export function CostSummaryCards({ summaries }: { summaries: CostSummary[] }) {
  if (summaries.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6 text-center text-gray-500">
        Add subscriptions to see your spending summary
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {summaries.map((summary) => (
        <div key={summary.currency} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            [
              ["Daily", summary.daily],
              ["Weekly", summary.weekly],
              ["Monthly", summary.monthly],
              ["Yearly", summary.yearly],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              className="bg-white rounded-lg border p-4 shadow-sm"
            >
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900">
                {sym(summary.currency)}
                {value.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1">{summary.currency}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
