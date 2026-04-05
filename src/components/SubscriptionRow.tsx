"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Subscription } from "@/lib/types";
import {
  updateSubscription,
  deleteSubscription,
} from "@/app/dashboard/actions";
import { SubscriptionForm } from "./SubscriptionForm";

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "\u00a3",
  USD: "$",
  EUR: "\u20ac",
  AUD: "A$",
  CAD: "C$",
  JPY: "\u00a5",
};

export function SubscriptionRow({
  subscription,
}: {
  subscription: Subscription;
}) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const sym = CURRENCY_SYMBOLS[subscription.currency] || subscription.currency + " ";

  async function handleDelete() {
    if (!confirm(`Delete "${subscription.name}"?`)) return;
    setDeleting(true);
    const fd = new FormData();
    fd.set("id", subscription.id);
    fd.set("name", subscription.name);
    try {
      const result = await deleteSubscription(fd);
      if (result?.error) alert(result.error);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3">
          <div className="font-medium text-gray-900">{subscription.name}</div>
          {subscription.url && (
            <a
              href={subscription.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              Manage
            </a>
          )}
        </td>
        <td className="px-4 py-3 text-right font-mono">
          {sym}
          {Number(subscription.amount).toFixed(2)}
        </td>
        <td className="px-4 py-3 capitalize text-gray-600">
          {subscription.period}
        </td>
        <td className="px-4 py-3 text-gray-600">
          {new Date(subscription.renewal_date + "T00:00:00").toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </td>
        <td className="px-4 py-3 text-gray-600">
          {subscription.payment_method || "—"}
        </td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => setEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-xs mr-3"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-800 text-xs disabled:opacity-50"
          >
            {deleting ? "..." : "Delete"}
          </button>
        </td>
      </tr>
      {editing &&
        createPortal(
          <SubscriptionForm
            action={updateSubscription}
            onClose={() => setEditing(false)}
            title="Edit Subscription"
            subscription={subscription}
          />,
          document.body
        )}
    </>
  );
}
