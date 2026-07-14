import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketRepo } from "@/lib/api/repositories/ticketRepo";
import { useAuth } from "@/context/AuthContext";

export function useTickets() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tickets", user?.id],
    queryFn: () => ticketRepo.list(user!.id),
    enabled: !!user,
  });
}

export function useBookTicket() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ticketRepo.book,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets", user?.id] });
      qc.invalidateQueries({ queryKey: ["smart-card", user?.id] });
      qc.invalidateQueries({ queryKey: ["transactions", user?.id] });
    },
  });
}

export function useCancelTicket() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (id: string) => ticketRepo.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets", user?.id] });
      qc.invalidateQueries({ queryKey: ["smart-card", user?.id] });
      qc.invalidateQueries({ queryKey: ["transactions", user?.id] });
    },
  });
}