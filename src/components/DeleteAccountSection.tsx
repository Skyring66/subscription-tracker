"use client";

import { useState } from "react";
import { deleteAccount } from "@/app/settings/actions";

export function DeleteAccountSection({ userEmail }: { userEmail: string }) {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const confirmed = confirmText === "DELETE";

  async function handleDelete() {
    if (!confirmed) return;
    if (
      !confirm(
        "This will permanently delete your account and all subscription data. This cannot be undone. Are you absolutely sure?"
      )
    )
      return;

    setDeleting(true);
    try {
      const result = await deleteAccount();
      if (result?.error) {
        alert(result.error);
        setDeleting(false);
      }
      // If successful, the server action redirects
    } catch {
      // redirect() throws a NEXT_REDIRECT error — this is expected
    }
  }

  return (
    <div className="bg-white rounded-lg border-2 border-red-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
      <p className="text-sm text-gray-600 mb-4">
        Permanently delete your account and all associated data including
        subscriptions and activity logs. This action cannot be undone.
      </p>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="font-mono font-bold">DELETE</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full max-w-xs rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Type DELETE"
          />
        </div>
        <button
          onClick={handleDelete}
          disabled={!confirmed || deleting}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {deleting ? "Deleting account..." : "Delete My Account"}
        </button>
      </div>
    </div>
  );
}
