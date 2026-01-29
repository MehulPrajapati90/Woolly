"use client";

import { useGetEventDetailsById, useCancelRegisterEvents } from "@/hooks/query/event";
import { useCurrentUser } from "@/hooks/query/auth";
import { Button } from "@/components/ui/button";
import { RegisterEventModal } from "./register-event-modal";
import Image from "next/image";
import { format } from "date-fns";
import {
    Calendar,
    MapPin,
    User,
    ArrowRight,
    Ticket,
    UserPlus,
    Mail,
    ArrowLeft,
    AlertCircle,
    X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Separator } from "../ui/separator";

interface CurrentUser {
    id: string;
    name: string;
    email: string;
}

interface EventDiscoverProps {
    eventId: string
    currentUser: CurrentUser
}

const EventDiscoverPage = ({ eventId, currentUser }: EventDiscoverProps) => {
    const { data: EventDetails, isPending } = useGetEventDetailsById({ eventId });
    const router = useRouter();
    const { mutateAsync: cancelRegistration, isPending: isCanceling } = useCancelRegisterEvents();

    if (isPending) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-neutral-400">Loading event details...</div>
            </div>
        );
    }

    if (!EventDetails?.event) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-destructive">Event not found</div>
            </div>
        );
    }

    const event = EventDetails.event;
    const startDate = new Date(event.eventStartDate);
    const endDate = new Date(event.eventEndDate);
    const isLive = new Date() >= startDate && new Date() <= endDate;
    const isHost = event.host?.user?.id === currentUser.id;

    const isRegistered = event.registerEvents.find((reg: any) => reg?.userId === currentUser?.id);

    const formatTime = (date: Date) => {
        return format(date, 'h:mm a');
    };

    const formatDate = (date: Date) => {
        return format(date, 'EEEE, MMMM d');
    };

    const formatShortDate = (date: Date) => {
        return format(date, 'MMM d').toUpperCase();
    };

    const handleManageEvent = () => {
        if (isHost) {
            return router.push(`/home/events/${eventId}`);
        }
    };

    return (
        <div className='flex flex-1 flex-col p-10 max-w-7xl mx-auto w-full'>
            {/* Header */}
            <div className='mb-6'>
                <h1 className='text-4xl font-semibold font-sans tracking-[-0.5px] mb-2'>
                    Event — {event.name}
                </h1>
                <button
                    onClick={() => event.calendar && router.push(`/home/calendars/${event.calendar.id}`)}
                    className='text-sm font-medium hover:underline cursor-pointer'
                >
                    <span className='text-neutral-400'>Calendar</span> {event.calendar?.name}
                </button>
            </div>

            <Separator className='mb-6' />
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Event Image */}
                        {event.coverMediaUrl && (
                            <div className="rounded-lg overflow-hidden">
                                <Image
                                    src={event.coverMediaUrl}
                                    width={600}
                                    height={400}
                                    alt={event.name}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        {/* Presented By */}
                        {event.calendar && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-neutral-400">Presented by</span>
                                        <button
                                            onClick={() => router.push(`/home/calendars/${event.calendar?.id}`)}
                                            className="font-medium hover:underline flex items-center gap-1"
                                        >
                                            {event.calendar.name}
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="w-full">
                                    Subscribe
                                </Button>
                                {isHost && (
                                    <Button variant="outline" onClick={handleManageEvent} size="sm" className="w-full">
                                        Manage Event
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Hosted By */}
                        {event.host?.user && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <User className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-neutral-400">Hosted By</span>{' '}
                                        <span className="font-medium">{event.host.user.name}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <button className="text-sm text-neutral-400 hover:text-white transition-colors">
                                        Contact the Host
                                    </button>
                                    <div>
                                        <button className="text-sm text-neutral-400 hover:text-white transition-colors">
                                            Report Event
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Event Title */}
                        <div>
                            <h1 className="text-4xl font-bold mb-6">{event.name}</h1>
                        </div>

                        {/* Date & Time */}
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-neutral-400 mt-1 shrink-0" />
                            <div className="space-y-1">
                                <div className="inline-block bg-neutral-800 px-2 py-1 rounded text-sm font-medium">
                                    {formatShortDate(startDate)}
                                </div>
                                <div className="text-sm text-neutral-300">
                                    {formatDate(startDate)}
                                </div>
                                <div className="text-sm text-neutral-300">
                                    {formatTime(startDate)} - {formatTime(endDate)}
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-neutral-400 mt-1 shrink-0" />
                            <div className="text-sm text-neutral-300">
                                {isRegistered ? (
                                    event.locationUrl ? (
                                        <a
                                            href={event.locationUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                        >
                                            {event.locationUrl}
                                        </a>
                                    ) : (
                                        <span>To Be Announced</span>
                                    )
                                ) : (
                                    <span>Register to See Address</span>
                                )}
                            </div>
                        </div>

                        {/* Registration Section */}
                        {isRegistered ? (
                            <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <User className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-lg font-semibold">You&apos;re In</div>
                                    </div>
                                    {isLive && (
                                        <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                            LIVE
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 mb-4">
                                    <Button variant="outline" className="flex-1">
                                        <Ticket className="w-4 h-4 mr-2" />
                                        My Ticket
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Invite a Friend
                                    </Button>
                                </div>
                                <p className="text-sm text-neutral-400">
                                    No longer able to attend? Notify the host by canceling your registration.
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={async () => {
                                        const response = await cancelRegistration({
                                            eventId,
                                            eventVisibility: event.visibility as "PUBLIC" | "PRIVATE" | "UNLISTED"
                                        });
                                        if (response.success) {
                                            toast.success("Registration canceled successfully");
                                        } else {
                                            toast.error(response.message || "Failed to cancel registration");
                                        }
                                    }}
                                    disabled={isCanceling}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    {isCanceling ? "Canceling..." : "Cancel Registration"}
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
                                <h3 className="text-lg font-semibold mb-2">Registration</h3>
                                <p className="text-sm text-neutral-400 mb-4">
                                    Welcome! To join the event, please register below.
                                </p>

                                {currentUser && (
                                    <div className="mb-4 p-3 bg-neutral-800 rounded text-sm">
                                        <div className="font-medium">{currentUser.name}</div>
                                        <div className="text-neutral-400">{currentUser.email}</div>
                                    </div>
                                )}

                                {event.visibility === "PUBLIC" ? (
                                    <RegisterEventModal
                                        eventName={event.name}
                                        HostName={event.host?.user?.name ?? ""}
                                        eventId={eventId}
                                        eventVisibility={event.visibility as "PUBLIC" | "PRIVATE" | "UNLISTED"}
                                    >
                                        <Button className="w-full" size="lg">
                                            One-Click RSVP
                                        </Button>
                                    </RegisterEventModal>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-yellow-500">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>This event is not publicly available for registration.</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Get Ready Section */}
                        {isRegistered && (
                            <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm">
                                            <div className="font-medium">Profile Complete</div>
                                            <div className="text-neutral-400 text-xs">Reminder: Email</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-neutral-400" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-neutral-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-sm text-neutral-400">
                            <button className="hover:text-white transition-colors">Discover</button>
                            <button className="hover:text-white transition-colors">Pricing</button>
                            <button className="hover:text-white transition-colors">Help</button>
                        </div>
                        <div className="text-sm text-neutral-400">
                            <button className="hover:text-white transition-colors flex items-center gap-1">
                                Host your event with Woolly
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDiscoverPage;