import { CoverMediaType, LocationType, Visibility } from "@prisma/client";

export interface CreateServerType {
    startDate: Date,
    endDate: Date,
    locationUrl?: string,
    visibility: Visibility,
    name: string,
    description: string,
    coverMediaUrl: string,
    coverMediaType: CoverMediaType,
    calendarId: string
}

export interface UpdateEventType {
    eventId: string,
    startDate: Date,
    endDate: Date,
    locationUrl?: string,
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

export interface CreateCalendarCategory {
    name: string,
    description?: string,
    imageUrl?: string
}

export interface EventRegisterType {
    eventId: string,
    eventVisibility: Visibility,
}

export interface CancelEventType {
    eventId: string,
    eventVisibility: Visibility,
}

export interface GetEventDetailsByIdType {
    eventId: string
}

export interface UpdateEventLocationType {
    eventId: string,
    locationUrl: string,
    locationType: LocationType
}