"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Video, Loader2, ExternalLink } from "lucide-react";

export default function EventPage() {
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateMeet = async () => {
    setIsLoading(true);
    setError(null);
    setMeetLink(null);

    try {
      const response = await fetch("/api/google/calendar");
      const data = await response.json();

      if (!response.ok) {
        // Check if authorization is required
        if (data.requiresAuth && data.authUrl) {
          // Redirect to authorization endpoint
          window.location.href = data.authUrl;
          return;
        }
        throw new Error(data.error || "Failed to create Google Meet");
      }

      setMeetLink(data.meetLink);
    } catch (err: any) {
      setError(err.message || "Failed to create Google Meet link");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get user-friendly error messages
  const getErrorMessage = (error: string) => {
    const errorMessages: Record<string, string> = {
      authorization_denied: "Authorization was denied. Please try again.",
      invalid_request: "Invalid authorization request. Please try again.",
      invalid_state: "Security validation failed. Please try again.",
      account_not_found: "Google account not found. Please sign in with Google first.",
      callback_failed: "Failed to complete authorization. Please try again.",
    };
    return errorMessages[error] || "An error occurred during authorization.";
  };

  // Check for authorization callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authorized = params.get("authorized");
    const error = params.get("error");

    if (authorized === "true") {
      // Clear the URL parameter and automatically create the Meet
      window.history.replaceState({}, "", window.location.pathname);
      handleCreateMeet();
    } else if (error) {
      setError(getErrorMessage(error));
      // Clear the URL parameter
      window.history.replaceState({}, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Google Meet Integration</h1>
          <p className="text-muted-foreground">
            Create a Google Meet link instantly
          </p>
        </div>

        <Button
          onClick={handleCreateMeet}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Meet...
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Create Google Meet
            </>
          )}
        </Button>

        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {meetLink && (
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Google Meet Link Created!</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Meet Link:</p>
                  <a
                    href={meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline break-all"
                  >
                    {meetLink}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
            <Button
              asChild
              className="w-full"
              variant="outline"
            >
              <a href={meetLink} target="_blank" rel="noopener noreferrer">
                Join Meeting
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}