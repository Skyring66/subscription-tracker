import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Subscription, ActivityLog } from "@/lib/types";
import { calculateCostSummary } from "@/lib/costs";
import { signOut } from "@/app/login/actions";
import { CostSummaryCards } from "@/components/CostSummaryCards";
import { SubscriptionList } from "@/components/SubscriptionList";
import { ActivityLogList } from "@/components/ActivityLogList";
import { AddSubscriptionButton } from "@/components/AddSubscriptionButton";

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
            <span className="text-sm text-gray-500">{user.email}</span>
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
