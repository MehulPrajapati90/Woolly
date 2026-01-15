"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Video,
  Plus,
  ArrowRight,
  LogOut,
  Sparkles,
  Users,
  Shield,
  Zap,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const generateRoomId = () => {
    const roomId = crypto.randomUUID();
    return roomId;
  };

  const handleCreateRoom = () => {
    setIsCreating(true);
    const roomId = generateRoomId();
    router.push(`/call/${roomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      // Extract room ID from URL or use as-is
      let roomId = roomCode.trim();
      if (roomId.includes("/call/")) {
        roomId = roomId.split("/call/").pop() || roomId;
      }
      router.push(`/call/${roomId}`);
    }
  };

  const handleSignIn = () => {
    signIn.social({ provider: "google" });
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <Video className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Wooly</span>
          </div>

          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-9 w-9 rounded-full border-2 border-zinc-700"
                  />
                )}
                <span className="hidden text-sm font-medium text-zinc-300 sm:block">
                  {session.user.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-zinc-400 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleSignIn}
              className="bg-white text-zinc-900 hover:bg-zinc-200"
            >
              Sign in with Google
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <Sparkles className="h-4 w-4" />
            Crystal-clear video calls
          </div>
          <h1 className="mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            Video calls that
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text">
              just work
            </span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-zinc-400">
            Connect face-to-face with anyone, anywhere. No downloads required.
            Just create a room and share the link.
          </p>

          {/* Action Cards */}
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {/* Create New Room */}
            <Card className="group border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all hover:border-violet-500/50 hover:bg-zinc-900/80">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 transition-transform group-hover:scale-110">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Create a new room</CardTitle>
                <CardDescription className="text-zinc-400">
                  Start a video call instantly and invite others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleCreateRoom}
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
                >
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating...
                    </span>
                  ) : (
                    <>
                      Create room
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Join Room */}
            <Card className="group border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all hover:border-violet-500/50 hover:bg-zinc-900/80">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 transition-transform group-hover:scale-110">
                  <Users className="h-6 w-6 text-violet-400" />
                </div>
                <CardTitle className="text-white">Join a room</CardTitle>
                <CardDescription className="text-zinc-400">
                  Enter a room code or paste an invite link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoinRoom} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Room code or link"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className="h-10 flex-1 border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
                  />
                  <Button
                    type="submit"
                    disabled={!roomCode.trim()}
                    variant="secondary"
                    className="bg-zinc-800 text-white hover:bg-zinc-700"
                  >
                    Join
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
              <Zap className="h-7 w-7 text-violet-400" />
            </div>
            <h3 className="mb-2 font-semibold text-white">Instant connection</h3>
            <p className="text-sm text-zinc-400">
              No sign-up required. Just create a room and start calling.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-500/10">
              <Shield className="h-7 w-7 text-fuchsia-400" />
            </div>
            <h3 className="mb-2 font-semibold text-white">End-to-end secure</h3>
            <p className="text-sm text-zinc-400">
              Your calls are encrypted and private by default.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
              <Video className="h-7 w-7 text-violet-400" />
            </div>
            <h3 className="mb-2 font-semibold text-white">HD video & audio</h3>
            <p className="text-sm text-zinc-400">
              Crystal-clear quality powered by LiveKit.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 py-8 text-center text-sm text-zinc-500">
        <p>Built with LiveKit & Next.js</p>
      </footer>
    </div>
  );
}
