"use client";

import { Subscription } from "@/lib/types";
import { SubscriptionRow } from "./SubscriptionRow";

export function SubscriptionList({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) {
  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
        No subscriptions yet. Click &quot;+ Add Subscription&quot; to get
        started.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Service
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Amount
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Period
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Renewal
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {subscriptions.map((sub) => (
              <SubscriptionRow key={sub.id} subscription={sub} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
