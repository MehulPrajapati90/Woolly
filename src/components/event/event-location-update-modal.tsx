"use client";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react";
import { Video, Loader2 } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { useUpdateEventLocation } from "@/hooks/query/event";

type LocationType = "GOOGLE" | "ZOOM" | "TEAMS";

const locationTypes = [
    {
        value: "GOOGLE",
        label: "Google"
    },
    {
        value: "ZOOM",
        label: "Zoom"
    },
    {
        value: "TEAMS",
        label: "Teams"
    }
];

export function EventLocationUpdateModal({ children, eventName, eventDescription, eventStartDate, eventEndDate, eventId, LocationUrl, LocationType }: { children: React.ReactNode, eventName: string, eventDescription: string, eventStartDate: string, eventEndDate: string, eventId: string, LocationUrl: string, LocationType: LocationType }) {

    const { mutateAsync, isPending } = useUpdateEventLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [locationType, setLocationType] = useState<LocationType>(LocationType ? LocationType : "GOOGLE");
    const [locationUrl, setLocationUrl] = useState<string>(LocationUrl);
    const [isCreatingMeet, setIsCreatingMeet] = useState(false);
    const [meetError, setMeetError] = useState<string | null>(null);

    // Check for authorization callback when modal opens
    useEffect(() => {
        if (isOpen) {
            const params = new URLSearchParams(window.location.search);
            const authorized = params.get("authorized");
            const error = params.get("error");

            if (authorized === "true") {
                // Clear the URL parameter and automatically create the Meet
                window.history.replaceState({}, "", window.location.pathname);
                handleCreateMeet();
            } else if (error) {
                setMeetError(getErrorMessage(error));
                // Clear the URL parameter
                window.history.replaceState({}, "", window.location.pathname);
            }
        }
    }, [isOpen]);

    const handleCreateMeet = async () => {
        setIsCreatingMeet(true);
        setMeetError(null);

        try {
            const response = await fetch("/api/google/calendar", {
                method: "POST",
                body: JSON.stringify({ eventName, eventDescription, eventStartDate, eventEndDate }),
            });
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

            // Success! Auto-set location type and URL
            setLocationType("GOOGLE");
            setLocationUrl(data.meetLink);
            setMeetError(null);
        } catch (err: any) {
            setMeetError(err.message || "Failed to create Google Meet link");
        } finally {
            setIsCreatingMeet(false);
        }
    };

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

    const handleSaveLocationChanges = async () => {
        console.log(10)
        if (locationType !== "GOOGLE") {
            return toast.error("Google Meets is only available for Now.");
        };

        const response = await mutateAsync({ eventId, locationUrl, locationType });
        if (response.success) {
            toast.success("Event location updated successfully!");
        } else {
            toast.error(response.message || "Failed to update event location.");
        }

        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] w-full">
                <DialogHeader>
                    <DialogTitle>Edit Event Location</DialogTitle>
                    <DialogDescription>
                        Edit the event location here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-3">
                    <div className="grid gap-3">
                        <Label htmlFor="location-type">Location Type</Label>
                        <Select value={locationType} onValueChange={(value) => setLocationType(value as LocationType)}>
                            <SelectTrigger id="location-type" className="w-full max-w-full">
                                <SelectValue placeholder="Select a location type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Location Types</SelectLabel>
                                    {locationTypes.map((location) => (
                                        <SelectItem key={location.value} value={location.value}>{location.label}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {locationType === "GOOGLE" && (
                        <div className="grid gap-3 w-full">
                            <div className="flex flex-col items-start justify-center gap-3 w-full">
                                <Label htmlFor="location-url">Create Google Meet</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleCreateMeet}
                                    disabled={isCreatingMeet}
                                >
                                    {isCreatingMeet ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Video className="mr-2 h-4 w-4" />
                                            Create Google Meet
                                        </>
                                    )}
                                </Button>
                            </div>

                            <Label htmlFor="location-url">Location URL</Label>
                            <Input
                                id="location-url"
                                type="text"
                                placeholder="Enter location URL or create Google Meet link"
                                value={locationUrl}
                                onChange={(e) => setLocationUrl(locationUrl)}
                                className="w-full"
                            />
                            {meetError && (
                                <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                                    {meetError}
                                </div>
                            )}
                        </div>
                    )}

                    {locationType !== "GOOGLE" && (
                        <div className="grid gap-3">
                            <Label htmlFor="location-url">Location URL</Label>
                            <Input
                                id="location-url"
                                type="text"
                                placeholder="Enter location URL"
                                value={locationUrl}
                                onChange={(e) => setLocationUrl(e.target.value)}
                                className="w-full"
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" size={"sm"} disabled={isCreatingMeet || !locationUrl || isPending} onClick={handleSaveLocationChanges}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};
