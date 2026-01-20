import { currentUser, requireAuth } from "@/utils/auth-utils";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const useRequireAuth = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => await requireAuth(),
    })
};

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => await currentUser(),
    })
};