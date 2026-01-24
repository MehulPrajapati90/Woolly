import EventDiscoverPage from '@/components/event/event-discover-page';
import React from 'react'

interface EventProps {
    params: Promise<{
        eventId: string;
    }>
}


const Events = async ({ params }: EventProps) => {
    const { eventId } = await params;
    return (
        <div className='p-4'>
            <EventDiscoverPage eventId={eventId} />
        </div>
    )
}

export default Events;