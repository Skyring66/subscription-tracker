"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateAvatar, removeAvatar } from "@/app/settings/actions";

interface Props {
  currentAvatarUrl: string | null;
  userId: string;
  userName: string;
}

export function AvatarUpload({ currentAvatarUrl, userId, userName }: Props) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/avatar.${ext}`;

      // Remove old avatar first (different extension maybe)
      await supabase.storage.from("avatars").remove([`${userId}/avatar`]);

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      // Add cache-busting timestamp
      const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;

      const result = await updateAvatar(urlWithCacheBust);
      if (result?.error) {
        alert(result.error);
      } else {
        setAvatarUrl(urlWithCacheBust);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemove() {
    setRemoving(true);
    try {
      const result = await removeAvatar();
      if (result?.error) {
        alert(result.error);
      } else {
        setAvatarUrl(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove avatar");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="flex items-center gap-6">
      {/* Avatar display */}
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold border-2 border-gray-200">
            {initials}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>
          {avatarUrl && (
            <button
              onClick={handleRemove}
              disabled={removing}
              className="rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {removing ? "Removing..." : "Remove"}
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500">
          JPG, PNG or WebP. Max 2MB.
        </p>
      </div>
    </div>
  );
}
