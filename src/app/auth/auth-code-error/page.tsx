import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-4">
          Something went wrong during sign in. Please try again.
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:underline"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
