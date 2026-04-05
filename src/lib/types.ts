export type Period = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  currency: string;
  period: Period;
  renewal_date: string;
  url: string | null;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: "added" | "modified" | "deleted";
  subscription_name: string;
  details: string | null;
  created_at: string;
}

export interface CostSummary {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  currency: string;
}
