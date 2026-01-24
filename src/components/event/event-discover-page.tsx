"use client";

import { useGetEventDetailsById } from "@/hooks/query/event";

interface EventDiscoverProps {
    eventId: string
}

const EventDiscoverPage = ({ eventId }: EventDiscoverProps) => {
    const { data: EventDetails, isPending } = useGetEventDetailsById({ eventId });
    
    console.log(EventDetails)
    return (
        <div>{eventId}</div>
    )
}

export default EventDiscoverPage;