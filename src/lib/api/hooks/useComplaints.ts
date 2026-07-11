import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { complaintRepo, NewComplaint } from "@/lib/api/repositories/complaintRepo";
import { useAuth } from "@/context/AuthContext";

export function useComplaints() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["complaints", user?.id],
    queryFn: () => complaintRepo.listForUser(user!.id),
    enabled: !!user,
  });
}

export function useCreateComplaint() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (input: NewComplaint) => complaintRepo.create(user!.id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["complaints", user?.id] }),
  });
}