import { createCalendarCategory } from "@/actions/admin";
import { getDiscoverData } from "@/actions/discover";
import { CreateCalendarCategory } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useDiscoverData = () => {
    return useQuery({
        queryKey: ["discover"],
        queryFn: async () => await getDiscoverData(),
    });
};

export const useCreateCalendarCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ ...data }: CreateCalendarCategory) => await createCalendarCategory({ ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['discover'] })
        }
    })
};