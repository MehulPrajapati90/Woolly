import { CoverMediaType, Visibility } from "@prisma/client";

export interface CreateServerType {
    startDate: Date,
    endDate: Date,
    location?: string,
    visibility: Visibility,
    name: string,
    description: string,
    coverMediaUrl: string,
    coverMediaType: CoverMediaType
}

export interface UpdateEventType {
    eventId: string,
    startDate: Date,
    endDate: Date,
    location?: string,
    visibility: Visibility,
    name: string,
    description: string,
    coverMediaUrl: string,
    coverMediaType: CoverMediaType
}

export interface CreateCalendarType {
    name: string,
    description?: string,
    coverImageUrl?: string,
    coverBannerUrl?: string,
    locationUTC?: string,
    timezone?: string
}