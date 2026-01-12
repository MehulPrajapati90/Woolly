"use client";

import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  ParticipantTile,
  useParticipants,
  useRoomContext,
  TrackRefContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Loader2, PhoneOff, Copy, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoRoomProps {
  token: string;
  serverUrl: string;
  roomName: string;
  onDisconnect?: () => void;
}

export function VideoRoom({ token, serverUrl, roomName, onDisconnect }: VideoRoomProps) {
  const router = useRouter();

  const handleDisconnect = useCallback(() => {
    onDisconnect?.();
    router.push("/");
  }, [router, onDisconnect]);

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={true}
      audio={true}
      onDisconnected={handleDisconnect}
      data-lk-theme="default"
      className="h-screen w-full bg-zinc-950"
    >
      <RoomContent roomName={roomName} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function RoomContent({ roomName }: { roomName: string }) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  const participants = useParticipants();
  const room = useRoomContext();
  const [copied, setCopied] = useState(false);

  const copyRoomLink = async () => {
    const url = `${window.location.origin}/call/${roomName}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-white">{roomName}</h1>
            <p className="text-sm text-zinc-400">
              {participants.length} participant{participants.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={copyRoomLink}
          className="border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy invite link
            </>
          )}
        </Button>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div
          className={`grid h-full gap-4 ${tracks.length === 1
            ? "grid-cols-1"
            : tracks.length === 2
              ? "grid-cols-2"
              : tracks.length <= 4
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
        >
          {tracks.map((track) => (
            <TrackRefContext.Provider value={track} key={track.participant.sid + track.source}>
              <ParticipantTile className="rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800" />
            </TrackRefContext.Provider>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="border-t border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur-sm">
        <ControlBar
          variation="verbose"
          controls={{
            camera: true,
            microphone: true,
            screenShare: true,
            leave: true,
            chat: false,
            settings: false,
          }}
          className="flex items-center justify-center gap-3"
        />
      </div>
    </div>
  );
}

export function VideoRoomSkeleton() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-20" />
          <Loader2 className="absolute inset-0 m-auto h-10 w-10 animate-spin text-violet-400" />
        </div>
        <p className="text-lg font-medium text-zinc-400">Connecting to room...</p>
      </div>
    </div>
  );
}

