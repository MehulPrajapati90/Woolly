import EventDiscoverPage from '@/components/event/event-discover-page';
import { currentUser } from '@/utils/auth-utils';
import { redirect } from 'next/navigation';
import React from 'react'

interface CurrentUser {
    id: string;
    name: string;
    email: string;
}

interface EventProps {
    params: Promise<{
        eventId: string;
    }>
}


const Events = async ({ params }: EventProps) => {
    const { eventId } = await params;
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <EventDiscoverPage eventId={eventId} currentUser={user as CurrentUser} />
    )
}

export default Events;