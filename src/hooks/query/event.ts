import { cancelEventRegistration, createEvent, getAllEvents, getEventDetailsById, getEventsForUser, registerEvent, updateEvent, updateEventLocation } from "@/actions/event";
import { CancelEventType, CreateServerType, EventRegisterType, GetEventDetailsByIdType, UpdateEventLocationType, UpdateEventType } from "@/types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const useCreateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ ...data }: CreateServerType) => await createEvent({ ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        }
    })
};

export const useGetEventsForUser = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => getEventsForUser(),
    });
};

export const useGetEventDetailsById = ({ ...data }: GetEventDetailsByIdType) => {
    return useQuery({
        queryKey: ['events-details'],
        queryFn: async () => await getEventDetailsById({ ...data }),
    })
};

export const useRegisterEvents = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ eventId, eventVisibility }: EventRegisterType) => await registerEvent({ eventId, eventVisibility }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events-details'] });
        }
    })
};

export const useCancelRegisterEvents = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ eventId, eventVisibility }: CancelEventType) => await cancelEventRegistration({ eventId, eventVisibility }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events-details'] });
        }
    })
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ ...data }: UpdateEventType) => await updateEvent({ ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events-details'] });
        }
    })
};

export const useUpdateEventLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ ...data }: UpdateEventLocationType) => await updateEventLocation({ ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events-details'] });
        }
    })
};