import React from 'react'

interface HostEventProps {
    params: Promise<{
        eventId: string;
    }>
}


const HostEvents = async ({ params }: HostEventProps) => {
    const { eventId } = await params;
    return (
        <div className='p-4'>{eventId}</div>
    )
}

export default HostEvents;