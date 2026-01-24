import EventHostPage from '@/components/event/event-host-page';

interface HostEventProps {
    params: Promise<{
        eventId: string;
    }>
}


const HostEvents = async ({ params }: HostEventProps) => {
    const { eventId } = await params;
    return (
        <div className='p-4'>
            <EventHostPage eventId={eventId} />
        </div>
    )
}

export default HostEvents;