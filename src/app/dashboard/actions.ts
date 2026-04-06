"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Period } from "@/lib/types";

export async function addSubscription(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const currency = (formData.get("currency") as string) || "GBP";
  const period = formData.get("period") as Period;
  const renewal_date = formData.get("renewal_date") as string;
  const url = (formData.get("url") as string) || null;
  const payment_method = (formData.get("payment_method") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  const { error } = await supabase.from("subscriptions").insert({
    user_id: user.id,
    name,
    amount,
    currency,
    period,
    renewal_date,
    url,
    payment_method,
    notes,
  });

  if (error) return { error: error.message };

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: "added",
    subscription_name: name,
    details: `${currency} ${amount} ${period}`,
  });

  revalidatePath("/dashboard");
  return { error: null };
}

export async function updateSubscription(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const currency = (formData.get("currency") as string) || "GBP";
  const period = formData.get("period") as Period;
  const renewal_date = formData.get("renewal_date") as string;
  const url = (formData.get("url") as string) || null;
  const payment_method = (formData.get("payment_method") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  const { error } = await supabase
    .from("subscriptions")
    .update({ name, amount, currency, period, renewal_date, url, payment_method, notes })
    .eq("id", id);

  if (error) return { error: error.message };

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: "modified",
    subscription_name: name,
    details: `Updated to ${currency} ${amount} ${period}`,
  });

  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteSubscription(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: "deleted",
    subscription_name: name,
    details: "Subscription removed",
  });

  revalidatePath("/dashboard");
  return { error: null };
}
