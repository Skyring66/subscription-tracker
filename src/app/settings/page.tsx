import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/login/actions";
import { AvatarUpload } from "@/components/AvatarUpload";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";
import Link from "next/link";

export default async function Settings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;

  const provider =
    user.app_metadata?.provider ||
    user.identities?.[0]?.provider ||
    "unknown";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              &larr; Dashboard
            </Link>
            <h1 className="text-xl font-bold text-gray-900">
              Account Settings
            </h1>
          </div>
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

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Profile / Avatar */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <AvatarUpload
            currentAvatarUrl={avatarUrl}
            userId={user.id}
            userName={user.user_metadata?.full_name || user.email || "User"}
          />
        </div>

        {/* Email */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Email</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg border">
              {user.email}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your email is managed by your Google account and cannot be changed
            here.
          </p>
        </div>

        {/* Authentication */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Authentication
          </h2>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-sm text-gray-700">
              Signed in via <span className="font-medium capitalize">{provider}</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your password is managed by Google. To change it, visit your{" "}
            <a
              href="https://myaccount.google.com/security"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Google Account settings
            </a>
            .
          </p>
        </div>

        {/* Danger Zone */}
        <DeleteAccountSection userEmail={user.email || ""} />
      </main>
    </div>
  );
}
