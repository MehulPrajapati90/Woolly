"use server";

import client from "@/lib/db";
import { CreateServerType, UpdateEventType } from "@/types";
import { dbUser } from "./auth";

export const createEvent = async ({ description, endDate, name, startDate, visibility, location, coverMediaType, coverMediaUrl, calendarId }: CreateServerType) => {
    const user = await dbUser();

    if (!user) {
        return {
            success: false,
            message: "User not authenticated"
        }
    }
    try {
        const isHostId = user.host?.id;

        let newHost;
        if (!user?.host || !isHostId) {
            newHost = await client.host.create({
                data: {
                    userId: user.id,
                }
            });
        }

        const event = await client.event.create({
            data: {
                name: name,
                description: description,
                eventStartDate: startDate,
                eventEndDate: endDate,
                status: "CONFIRMED",
                coverMedia: coverMediaType,
                coverMediaUrl: coverMediaUrl,
                hostId: newHost?.id || isHostId!,
                visibility: visibility,
                location: location,
                calendarId: calendarId
            }
        });

        return {
            success: true,
            message: "Event created successfully",
            event: event
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Failed to create Event"
        }
    }
};

export const getEventsForUser = async () => {
    const user = await dbUser();

    if (!user) {
        return {
            success: false,
            message: "User not authenticated"
        }
    }

    try {
        const events = await client.event.findMany({
            where: {
                host: {
                    userId: user.id
                }
            },
            orderBy: {
                eventStartDate: 'asc'
            }
        });

        return {
            success: true,
            message: "Events fetched successfully",
            events: events
        };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Failed to fetch Event"
        }
    }
};

export const getAllEvents = async (eventId: string) => {
    const user = await dbUser();

    if (!user) {
        return {
            success: false,
            message: "User not authenticated"
        }
    }

    try {
        const events = await client.event.findMany({
            where: {
                visibility: "PUBLIC",
            }
        });

        return {
            success: true,
            message: "Events fetched successfully",
            events: events
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Failed to fetch Event"
        }
    }
};

export const updateEvent = async ({ eventId, startDate, endDate, location, visibility, name, description, coverMediaUrl, coverMediaType }: UpdateEventType) => {
    const user = await dbUser();
    if (!user) {
        return {
            success: false,
            message: "User not authenticated"
        }
    }

    try {
        const event = await client.event.update({
            where: {
                id: eventId,
                host: {
                    userId: user.id
                }
            },
            data: {
                name: name,
                description: description,
                eventStartDate: startDate,
                eventEndDate: endDate,
                status: "CONFIRMED",
                coverMedia: coverMediaType,
                coverMediaUrl: coverMediaUrl,
                hostId: user?.host?.id!,
                visibility: visibility,
                location: location
            }
        });
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Failed to update Event"
        }
    }
};