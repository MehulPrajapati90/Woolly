"use client";

import { useGetEventDetailsById } from '@/hooks/query/event';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import Image from 'next/image';
import {
    Calendar,
    MapPin,
    ExternalLink,
    Copy,
    Edit,
    ImageIcon,
    AlertTriangle,
    User,
    CheckCheck,
    FileText,
    Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { RegisterEventModal } from './register-event-modal';
import UpdateEventModal from './update-event-modal';
import { EventLocationUpdateModal } from './event-location-update-modal';
import { toast } from 'sonner';

interface EventHostProps {
    eventId: string
}

type LocationType = "GOOGLE" | "ZOOM" | "TEAMS";

const EventHostPage = ({ eventId }: EventHostProps) => {
    const { data: EventDetails, isPending } = useGetEventDetailsById({ eventId });
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const isRegisteredInEvent = EventDetails?.event?.registerEvents.find((v: any) => v.userId === EventDetails.event?.host.user.id);

    if (isPending) {
        return (
            <div className='flex flex-1 items-center justify-center p-3'>
                <div className='text-muted-foreground'>Loading event details...</div>
            </div>
        );
    }

    if (!EventDetails?.event) {
        return (
            <div className='flex flex-1 items-center justify-center p-3'>
                <div className='text-destructive'>Event not found</div>
            </div>
        );
    }

    const event = EventDetails.event;
    const startDate = new Date(event.eventStartDate);
    const endDate = new Date(event.eventEndDate);
    const isToday = format(startDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    const formatTime = (date: Date) => {
        return format(date, 'h:mm a');
    };

    const formatDate = (date: Date) => {
        return format(date, 'EEEE, MMMM d');
    };

    const formatShortDate = (date: Date) => {
        return format(date, 'MMM d');
    };

    const eventLink = typeof window !== 'undefined' ? `${window.location.origin}/home/discover/events/${eventId}` : '';

    const handleCopyLink = () => {
        if (eventLink) {
            navigator.clipboard.writeText(eventLink);
            toast.success("Copied to clipboard!");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRedirectToLocation = (locationUrl: string) => {
        window.open(locationUrl, '_blank');
        toast.success("Redirecting to location...");
    };

    return (
        <div className='flex flex-1 flex-col p-6 max-w-7xl mx-auto w-full'>
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

            {/* Main Content */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Left Column - Event Details */}
                <div className='lg:col-span-2 space-y-6'>
                    {/* Event Cover and Basic Info */}
                    <div className='bg-neutral-900 rounded-lg p-6 border border-neutral-700/60'>
                        <div className='flex flex-col md:flex-row gap-6'>
                            {event.coverMediaUrl && (
                                <div className='shrink-0'>
                                    <Image
                                        src={event.coverMediaUrl}
                                        width={320}
                                        height={320}
                                        alt='Event Cover'
                                        className='w-full md:w-80 h-80 object-cover rounded-lg border border-neutral-700 shadow-2xl'
                                    />
                                </div>
                            )}

                            <div className='flex-1 space-y-4'>
                                <div>
                                    <h2 className='text-xl font-semibold mb-4'>Event Details</h2>

                                    <div className='space-y-3'>
                                        {/* Event Name */}
                                        {event.name && (
                                            <div className='flex items-start gap-3'>
                                                <Tag className='w-5 h-5 text-neutral-400 mt-0.5 shrink-0' />
                                                <div className='flex-1'>
                                                    <div className='text-sm font-medium'>{event.name}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Event Description */}
                                        {event.description && (
                                            <div className='flex items-start gap-3'>
                                                <FileText className='w-5 h-5 text-neutral-400 mt-0.5 shrink-0' />
                                                <div className='flex-1'>
                                                    <div className='text-sm text-neutral-400 whitespace-pre-wrap'>{event.description}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Date & Time */}
                                        <div className='flex items-start gap-3'>
                                            <Calendar className='w-5 h-5 text-neutral-400 mt-0.5 shrink-0' />
                                            <div>
                                                <div className='font-medium'>{formatShortDate(startDate).toUpperCase()}</div>
                                                <div className='text-sm text-neutral-400'>
                                                    {formatDate(startDate)}
                                                </div>
                                                <div className='text-sm text-neutral-400'>
                                                    {formatTime(startDate)} - {formatTime(endDate)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className='flex items-start gap-3'>
                                            <MapPin className='w-5 h-5 text-neutral-400 mt-0.5 shrink-0' />
                                            <div>
                                                {event.locationUrl ? (
                                                    <div className='text-sm'>{event.locationUrl}</div>
                                                ) : (
                                                    <div className='text-sm text-neutral-400'>
                                                        Register to See Address
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Presented By */}
                                        {event.calendar && (
                                            <div className='flex items-center gap-3'>
                                                <div className='w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0'>
                                                    <div className='w-2 h-2 rounded-full bg-green-500' />
                                                </div>
                                                <div className='text-sm'>
                                                    <span className='text-neutral-400'>Presented by</span>{' '}
                                                    <span className='font-medium'>{event.calendar.name}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Hosted By */}
                                        {event.host.user && (
                                            <div className='flex items-center gap-3'>
                                                <div className='w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0'>
                                                    <User className='w-4 h-4 text-red-500' />
                                                </div>
                                                <div className='text-sm'>
                                                    <span className='text-neutral-400'>Hosted By</span>{' '}
                                                    <span className='font-medium'>{event.host.user.email}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Section */}
                    <div className='bg-neutral-900 rounded-lg p-6 border border-neutral-700/60'>
                        <h3 className='text-lg font-semibold mb-2'>Registration</h3>
                        <p className='text-sm text-neutral-400 mb-4'>
                            Welcome! To join the event, please register below.
                        </p>

                        {event.host.user && (
                            <div className='space-y-3 mb-4'>
                                <div className='text-sm'>
                                    <div className='font-medium'>{event.host.user.name}</div>
                                    <div className='text-neutral-400'>{event.host.user.email}</div>
                                </div>
                            </div>
                        )}

                        {isRegisteredInEvent ? (
                            <Button className='w-full' size='lg'>
                                Already Registered
                            </Button>
                        ) : (
                            <RegisterEventModal eventName={event.name} HostName={event.host.user?.name ?? ""} eventId={eventId} eventVisibility={event.visibility as "PUBLIC" | "PRIVATE" | "UNLISTED"}>
                                <Button className='w-full' size='lg'>
                                    One-Click RSVP
                                </Button>
                            </RegisterEventModal>
                        )}
                    </div>

                    {/* Event Link */}
                    {eventLink && (
                        <div className='bg-neutral-900 rounded-lg p-6 border border-neutral-700/60'>
                            <div className='flex items-center justify-between gap-4'>
                                <div className='flex items-center gap-2 text-sm text-neutral-400'>
                                    <ExternalLink className='w-4 h-4' />
                                    <span className='font-mono text-[13px]'>{eventLink}</span>
                                </div>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCopyLink}
                                >
                                    {copied ? (
                                        <CheckCheck className='w-4 h-4' />
                                    ) : (
                                        <Copy className='w-4 h-4' />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className='flex gap-3'>
                        <UpdateEventModal>
                            <Button variant='outline' className='flex-1'>
                                <Edit className='w-4 h-4 mr-2' />
                                Edit Event
                            </Button>
                        </UpdateEventModal>
                        <Button variant='outline' className='flex-1'>
                            <ImageIcon className='w-4 h-4 mr-2' />
                            Change Photo
                        </Button>
                    </div>
                </div>

                {/* Right Column - When & Where Summary */}
                <div className='lg:col-span-1'>
                    <div className='bg-neutral-900 rounded-lg p-6 border border-neutral-700/60 sticky top-6'>
                        <h3 className='text-lg font-semibold mb-4'>When & Where</h3>

                        <div className='space-y-4'>
                            {/* Date & Time Summary */}
                            <div className='flex items-start gap-3'>
                                <Calendar className='w-5 h-5 text-neutral-400 mt-0.5 shrink-0' />
                                <div className='text-sm'>
                                    <div className='font-medium mb-1'>
                                        {isToday ? 'Today' : formatShortDate(startDate).toUpperCase()}
                                    </div>
                                    <div className='text-neutral-400'>
                                        {formatTime(startDate)} - {formatTime(endDate)} GMT+5:30
                                    </div>
                                </div>
                            </div>

                            {/* Location Warning */}
                            {!event.locationUrl && (
                                <div className='bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4'>
                                    <div className='flex items-start justify-between gap-3 mb-0.5'>
                                        <AlertTriangle className='w-5 h-5 text-yellow-500 shrink-0 mt-0.5' />
                                        <div className='text-sm'>
                                            <div className='font-medium text-yellow-500 mb-1'>Location Missing</div>
                                            <div className='text-neutral-400'>
                                                Please enter the location of the event before it starts.
                                            </div>
                                        </div>
                                        <EventLocationUpdateModal eventName={event.name} eventDescription={event.description ?? ""} eventStartDate={event.eventStartDate.toISOString()} eventEndDate={event.eventEndDate.toISOString()} eventId={eventId} LocationUrl={event.locationUrl ?? ""} LocationType={event.locationType as LocationType}>
                                            <Button
                                                variant='ghost'
                                                className='h-8 w-8 shrink-0 flex items-center justify-center'
                                            >
                                                <Edit className='w-4 h-4 mb-3' />
                                            </Button>
                                        </EventLocationUpdateModal>
                                    </div>
                                </div>
                            )}

                            {event.locationUrl && (
                                <div className='flex items-start justify-between gap-3'>
                                    <div className='flex items-start gap-3 flex-1'>
                                        <MapPin className='w-5 h-5 text-neutral-400 mt-0.5 shrink-0' />
                                        <div className='text-sm'>
                                            <div onClick={() => handleRedirectToLocation(event?.locationUrl ?? "")} className='text-neutral-400 cursor-pointer hover:underline'>{event.locationUrl}</div>
                                        </div>
                                    </div>
                                    <EventLocationUpdateModal eventName={event.name} eventDescription={event.description ?? ""} eventStartDate={event.eventStartDate.toISOString()} eventEndDate={event.eventEndDate.toISOString()} eventId={eventId} LocationUrl={event.locationUrl ?? ""} LocationType={event.locationType as LocationType}>
                                        <Button
                                            variant='ghost'
                                            className='h-8 w-8 shrink-0 flex items-center justify-center pb-5'
                                        >
                                            <Edit className='w-4 h-4' />
                                        </Button>
                                    </EventLocationUpdateModal>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventHostPage;