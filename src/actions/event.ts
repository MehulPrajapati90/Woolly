"use server";

import client from "@/lib/db";
import { CancelEventType, CreateServerType, EventRegisterType, GetEventDetailsByIdType, UpdateEventLocationType, UpdateEventType } from "@/types";
import { dbUser } from "./auth";
import { currentUser } from "@/utils/auth-utils";

export const createEvent = async ({ description, endDate, name, startDate, visibility, locationUrl, coverMediaType, coverMediaUrl, calendarId }: CreateServerType) => {
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
                locationUrl: locationUrl,
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

export const getAllEvents = async () => {
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

export const updateEvent = async ({ eventId, startDate, endDate, locationUrl, visibility, name, description, coverMediaUrl, coverMediaType }: UpdateEventType) => {
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
                locationUrl: locationUrl,
            }
        });

        return {
            success: true,
            message: "Event Updated successfully"
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Failed to update Event"
        }
    }
};

export const registerEvent = async ({ eventId, eventVisibility }: EventRegisterType) => {
    const user = await currentUser();

    if (!user) {
        return {
            success: false,
            message: "User not authenticated"
        }
    }

    if (eventVisibility !== "PUBLIC") {
        return {
            success: false,
            message: "Event is not a Public Event"
        }
    }

    try {
        const register = await client.registerEvents.create({
            data: {
                userId: user?.id,
                eventId: eventId,
            }
        });

        return {
            success: true,
            message: "User Register for Event Successfully",
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Failed to fetch Event"
        }
    }
};

export const cancelEventRegistration = async ({ eventId, eventVisibility }: CancelEventType) => {
    const user = await currentUser();

    if (!user) {
        return {
            success: false,
            message: "User not authenticated"
        }
    }

    if (eventVisibility !== "PUBLIC") {
        return {
            success: false,
            message: "Event is not a Public Event"
        }
    }

    try {
        const register = await client.registerEvents.delete({
            where: {
                userId_eventId: {
                    eventId: eventId,
                    userId: user?.id,
                }
            },
        });

        return {
            success: true,
            message: "User Successfully UnRegistered for Event",
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Failed to cancel Event Registration"
        }
    }
};

export const getEventDetailsById = async ({ eventId }: GetEventDetailsByIdType) => {
    const user = await currentUser();

    if (!user) {
        return {
            success: false,
            message: "User not authenticated"
        }
    }

    try {
        const event = await client.event.findFirst({
            where: {
                id: eventId,
            },
            include: {
                host: {
                    include: {
                        user: true
                    }
                },
                calendar: true,
                registerEvents: {
                    include: {
                        user: true
                    }
                },
            }
        });

        return {
            success: true,
            message: "Event fetched Successfully",
            event: event,
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Failed to fetch event"
        }
    }
};

export const updateEventLocation = async ({ eventId, locationUrl, locationType }: UpdateEventLocationType) => {
    const user = await currentUser();
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
                    userId: user?.id
                }
            },
            data: {
                locationUrl: locationUrl,
                locationType: locationType
            }
        });

        return {
            success: true,
            message: "Event location updated successfully"
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Failed to update event location"
        }
    }
};