"use server";

import client from "@/lib/db";
import { CreateCalendarCategory } from "@/types";
import { currentUser } from "@/utils/auth-utils";

export const createCalendarCategory = async ({ name, description, imageUrl }: CreateCalendarCategory) => {
    const user = await currentUser();

    if (!user || user?.role !== "ADMIN") {
        return {
            success: false,
            message: "User not authenticated.",
        }
    };

    try {
        const createCategory = await client.eventsCategory.create({
            data: {
                name: name,
                description: description,
                coverImageUrl: imageUrl,
                user: {
                    connect: {
                        id: user?.id
                    }
                }
            }
        });

        return {
            success: true,
            message: "Successfully created category data.",
        }
    } catch (e) {
        console.log(e);
        return {
            success: false,
            message: "Failed to create category data."
        }
    }
};