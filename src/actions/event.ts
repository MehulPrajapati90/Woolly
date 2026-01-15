"use server";

import { CreateServerType } from "@/types";

const createEvent = async ({ description, endDate, eventTime, name, startDate, visibility, location, coverMediaType, coverMediaUrl }: CreateServerType) => {
    try {

    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Failed to create Event"
        }
    }
};