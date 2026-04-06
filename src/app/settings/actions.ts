"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateAvatar(avatarUrl: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl, custom_avatar: true },
  });

  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function removeAvatar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Restore Google avatar or clear
  const googleAvatar = user.user_metadata?.picture || null;

  const { error } = await supabase.auth.updateUser({
    data: { avatar_url: googleAvatar, custom_avatar: false },
  });

  if (error) return { error: error.message };

  // Clean up uploaded file
  await supabase.storage
    .from("avatars")
    .remove([`${user.id}/avatar`]);

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return { error: "Server configuration error: service role key not set" };
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );

  // Delete user (cascades to subscriptions and activity_log)
  const { error } = await adminSupabase.auth.admin.deleteUser(user.id);

  if (error) return { error: error.message };

  // Clean up avatar storage
  await adminSupabase.storage
    .from("avatars")
    .remove([`${user.id}/avatar`]);

  // Sign out
  await supabase.auth.signOut();

  redirect("/?deleted=true");
}
