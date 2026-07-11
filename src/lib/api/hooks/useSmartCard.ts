import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { smartCardRepo } from "@/lib/api/repositories/smartCardRepo";
import { useAuth } from "@/context/AuthContext";

export function useSmartCard() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["smart-card", user?.id],
    queryFn: () => smartCardRepo.getForUser(user!.id),
    enabled: !!user,
  });
}

export function useTransactions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: () => smartCardRepo.listTransactions(user!.id),
    enabled: !!user,
  });
}

export function useRecharge() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ amount, method }: { amount: number; method: string }) =>
      smartCardRepo.recharge(amount, method),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["smart-card", user?.id] });
      qc.invalidateQueries({ queryKey: ["transactions", user?.id] });
    },
  });
}