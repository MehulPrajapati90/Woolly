import { createCalendar, getCalendarsByHostId } from "@/actions/calendar";
import { CreateCalendarType } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export const useGetCalendarsByHostId = () => {
    return useQuery({
        queryKey: ["calendar"],
        queryFn: async () => getCalendarsByHostId(),
    })
};

export const useCreateCalendar = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ["create-calendar"],
        mutationFn: async ({ ...data }: CreateCalendarType) => createCalendar({ ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendar"] });
        }
    });
};