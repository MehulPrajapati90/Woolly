"use server";

import { auth } from "@/lib/auth";
import { client } from "@/lib/db";
import { headers } from "next/dist/server/request/headers";

export const dbUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        return null;
    }
    try {
        const user = await client.user.findFirst({
            where: {
                id: session.user.id,
            },
            select: {
                id: true,
                name: true,
                image: true,
                host: {
                    select: {
                        id: true,
                        userId: true,
                    }
                }
            }
        });

        return user;
    } catch (e) {
        console.log(e);
        return null;
    }
};