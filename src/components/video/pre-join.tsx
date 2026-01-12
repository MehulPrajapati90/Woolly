"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, VideoOff, Mic, MicOff, ArrowRight, Loader2 } from "lucide-react";

interface PreJoinProps {
  roomName: string;
  onJoin: (participantName: string) => void;
  isLoading?: boolean;
  defaultName?: string;
}

export function PreJoin({ roomName, onJoin, isLoading, defaultName = "" }: PreJoinProps) {
  const [name, setName] = useState(defaultName);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoEnabled,
          audio: audioEnabled,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    getMedia();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [videoEnabled, audioEnabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      stream?.getTracks().forEach((track) => track.stop());
      onJoin(name.trim());
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !videoEnabled;
      });
    }
    setVideoEnabled(!videoEnabled);
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !audioEnabled;
      });
    }
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      <Card className="relative w-full max-w-lg border-zinc-800 bg-zinc-900/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Video className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Ready to join?</CardTitle>
          <CardDescription className="text-zinc-400">
            You're joining room: <span className="font-mono text-violet-400">{roomName}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video Preview */}
            <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-800 border border-zinc-700">
              {videoEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-700">
                    <VideoOff className="h-10 w-10 text-zinc-500" />
                  </div>
                </div>
              )}

              {/* Media Controls */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                <Button
                  type="button"
                  variant={videoEnabled ? "secondary" : "destructive"}
                  size="icon"
                  onClick={toggleVideo}
                  className="h-11 w-11 rounded-full"
                >
                  {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
                <Button
                  type="button"
                  variant={audioEnabled ? "secondary" : "destructive"}
                  size="icon"
                  onClick={toggleAudio}
                  className="h-11 w-11 rounded-full"
                >
                  {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">
                Your name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
                required
              />
            </div>

            {/* Join Button */}
            <Button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="h-12 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  Join call
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

