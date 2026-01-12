"use client";

import { useState, useEffect, use } from "react";
import { VideoRoom, VideoRoomSkeleton } from "@/components/video/video-room";
import { PreJoin } from "@/components/video/pre-join";
import { useSession } from "@/lib/auth-client";

interface CallPageProps {
  params: Promise<{ roomId: string }>;
}

export default function CallPage({ params }: CallPageProps) {
  const { roomId } = use(params);
  const { data: session } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "";

  const handleJoin = async (participantName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: roomId,
          participantName,
          participantIdentity: session?.user?.id || participantName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to get access token");
      }

      const data = await response.json();
      setToken(data.token);
      setHasJoined(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="mb-2 text-xl font-semibold text-white">Unable to join</h1>
          <p className="mb-6 text-zinc-400">{error}</p>
          <button
            onClick={() => setError(null)}
            className="rounded-lg bg-violet-500 px-6 py-2 text-white hover:bg-violet-600"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!hasJoined) {
    return (
      <PreJoin
        roomName={roomId}
        onJoin={handleJoin}
        isLoading={isLoading}
        defaultName={session?.user?.name || ""}
      />
    );
  }

  if (!token) {
    return <VideoRoomSkeleton />;
  }

  return (
    <VideoRoom
      token={token}
      serverUrl={serverUrl}
      roomName={roomId}
    />
  );
}

