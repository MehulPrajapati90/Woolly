"use client";

import CreateEventModal from '@/components/event/create-event-modal';
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useGetEventsForUser } from '@/hooks/query/event'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type EventStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "POSTPONED" | "RESCHEDULED";
type LocationType = "GOOGLE" | "ZOOM" | "TEAMS";
type VisibilityType = "PUBLIC" | "PRIVATE" | "UNLISTED";
type CoverMediaType = "IMAGE" | "VIDEO";

interface Events {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    status: EventStatus;
    hostId: string;
    eventStartDate: Date;
    eventEndDate: Date;
    locationUrl: string | null;
    locationType: LocationType | null;
    visibility: VisibilityType;
    coverMedia: CoverMediaType | null;
    coverMediaUrl: string | null;
    calendarId: string | null;
}

const EventsPage = () => {
    const { data: events, isPending } = useGetEventsForUser();

    console.log(events)

    const router = useRouter();

    const handleRedirect = (eventId: string) => {
        router.push(`/home/events/${eventId}`);
    }

    if (isPending) {
        return <div className='flex-1 flex items-center justify-center w-full'>
            <Spinner />
        </div>
    }

    return (
        <div className='p-10'>
            <div className='w-full py-6 flex items-center gap-3'>
                <p className='text-4xl font-semibold font-sans tracking-tight'>Events</p>
            </div>

            <div className='p-2 py-5 font-sans flex flex-col gap-6'>
                <div className='flex items-center justify-between'>
                    <p className='text-lg font-medium'>Your Events</p>
                    <CreateEventModal>
                        <Button className='flex items-center w-40'>
                            <p>Create Events</p>
                            <Plus size={16} />
                        </Button>
                    </CreateEventModal>
                </div>

                <div className=''>
                    {events?.events?.length === 0 ? (
                        <div className='space-y-4 h-100 flex justify-center items-center'>
                            <p className='text-sm text-muted-foreground'>No Event found. Create one to get started!</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-5 gap-4 mt-6 '>
                            {events?.events?.map((event: Events) => (
                                <div key={event?.id} onClick={() => handleRedirect(event?.id)} className='border p-4 rounded-md hover:shadow-md cursor-pointer bg-neutral-950 hover:bg-neutral-900 duration-200 transition-all ease-in-out'>
                                    <Image unoptimized src={event?.coverMediaUrl! || ""} alt='Calendar Image' width={100} height={100} className='w-full h-25 object-cover rounded-md mb-4' />
                                    <p className='font-medium text-lg'>{event.name}</p>
                                    <p className='text-sm text-muted-foreground mt-1'>{event.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EventsPage