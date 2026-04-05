"use client";

import { ActivityLog } from "@/lib/types";

const ACTION_COLORS = {
  added: "text-green-700 bg-green-50",
  modified: "text-blue-700 bg-blue-50",
  deleted: "text-red-700 bg-red-50",
};

export function ActivityLogList({ logs }: { logs: ActivityLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6 text-center text-gray-500 text-sm">
        No activity yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <ul className="divide-y">
        {logs.map((log) => (
          <li key={log.id} className="px-4 py-3 flex items-center gap-3">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${ACTION_COLORS[log.action]}`}
            >
              {log.action}
            </span>
            <span className="text-sm text-gray-900 font-medium">
              {log.subscription_name}
            </span>
            {log.details && (
              <span className="text-sm text-gray-500">{log.details}</span>
            )}
            <span className="ml-auto text-xs text-gray-400">
              {new Date(log.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
