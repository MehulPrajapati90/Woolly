"use server";

import client from "@/lib/db";
import { currentUser } from "@/utils/auth-utils";

export const getDiscoverData = async () => {
    const user = await currentUser();

    if (!user) {
        return {
            success: false,
            message: "User not authenticated.",
            discovery: {
                calendars: [],
                calendarCategories: [],
            }
        }
    }

    try {
        const calendars = await client.eventCalendar.findMany({
            take: 12,
        });

        const calendarCategories = await client.eventsCategory.findMany({
            take: 12,
        });

        const discovery = {
            calendars,
            calendarCategories,
        };

        return {
            success: true,
            message: "Discover data fetched successfully.",
            discovery,
            userRole: user?.role,
        }
    } catch (e) {
        return {
            success: false,
            message: "Failed to fetch discover data.",
            discovery: {
                calendars: [],
                calendarCategories: [],
            }
        }
    }
};