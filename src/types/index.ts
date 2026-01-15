import { CoverMediaType } from "@prisma/client";

export interface CreateServerType {
    startDate: Date,
    endDate: Date,
    eventTime: Date,
    location?: string,
    visibility: string,
    name: string,
    description: string,
    coverMediaUrl: string,
    coverMediaType: CoverMediaType
}