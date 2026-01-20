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
            message: "Failed to create Event"
        }
    }
}