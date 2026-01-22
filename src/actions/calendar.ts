"use server";

import { CreateCalendarType } from "@/types";
import { dbUser } from "./auth";
import { client } from "@/lib/db";

export const createCalendar = async ({ name, description, coverImageUrl, coverBannerUrl, locationUTC, timezone }: CreateCalendarType) => {
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
        };

        const calendar = await client.eventCalendar.create({
            data: {
                name: name,
                description: description,
                coverImageUrl: coverImageUrl,
                coverBannerUrl: coverBannerUrl,
                locationUTC: locationUTC,
                timezone: timezone,
                host: {
                    connect: {
                        userId: user.id
                    }
                },
            }
        });

        return {
            success: true,
            message: "Calendar created successfully",
            calendar: calendar
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Failed to create Calendar"
        }
    }
};

export const getCalendarsByHostId = async () => {
    const user = await dbUser();

    if (!user) {
        return {
            success: false,
            message: "User not authenticated"
        }
    }

    try {
        const calendars = await client.eventCalendar.findMany({
            where: {
                hostId: user?.host?.id,
            },
            select: {
                id: true,
                name: true,
                description: true,
                coverImageUrl: true,
                coverBannerUrl: true,
                locationUTC: true,
                timezone: true,
            }
        });

        return {
            success: true,
            calendars: calendars
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Failed to fetch calendars"
        }
    }
};