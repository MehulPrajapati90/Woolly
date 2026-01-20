import { createEvent } from "@/actions/event";
import { CreateServerType } from "@/types";
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