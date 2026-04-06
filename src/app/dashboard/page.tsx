import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Subscription, ActivityLog } from "@/lib/types";
import { calculateCostSummary } from "@/lib/costs";
import { signOut } from "@/app/login/actions";
import { CostSummaryCards } from "@/components/CostSummaryCards";
import { SubscriptionList } from "@/components/SubscriptionList";
import { ActivityLogList } from "@/components/ActivityLogList";
import { AddSubscriptionButton } from "@/components/AddSubscriptionButton";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .order("renewal_date", { ascending: true });

  const { data: activityLog } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;

  const subs = (subscriptions || []) as Subscription[];
  const logs = (activityLog || []) as ActivityLog[];
  const costSummaries = calculateCostSummary(subs);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            Subscription Tracker
          </h1>
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {(user.email || "U")[0].toUpperCase()}
              </div>
            )}
            <span className="text-sm text-gray-500">{user.email}</span>
            <Link
              href="/settings"
              className="text-sm text-gray-500 hover:text-gray-700"
              title="Account Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-red-600 hover:text-red-800"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <CostSummaryCards summaries={costSummaries} />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Subscriptions ({subs.length})
          </h2>
          <AddSubscriptionButton />
        </div>

        <SubscriptionList subscriptions={subs} />

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Activity Log
          </h2>
          <ActivityLogList logs={logs} />
        </div>
      </main>
    </div>
  );
}
