import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportService, UpdateSupportTicketDTO } from "@/services/support.service";

export const useSupportTickets = (status?: string) => {
  const queryClient = useQueryClient();

  const ticketsQuery = useQuery({
    queryKey: ["supportTickets", status],
    queryFn: () => supportService.getTickets(status),
  });

  const updateTicketMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSupportTicketDTO }) =>
      supportService.updateTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
    },
  });

  return {
    tickets: ticketsQuery.data || [],
    isLoading: ticketsQuery.isLoading,
    isError: ticketsQuery.isError,
    updateTicket: updateTicketMutation.mutateAsync,
    isUpdating: updateTicketMutation.isPending,
  };
};
