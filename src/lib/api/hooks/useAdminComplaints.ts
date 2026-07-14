import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminComplaintRepo, AdminComplaintRow } from "@/lib/api/repositories/adminComplaintRepo";

export function useAdminComplaints() {
  return useQuery({ queryKey: ["admin-complaints"], queryFn: adminComplaintRepo.list });
}

export function useUpdateComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AdminComplaintRow> }) => adminComplaintRepo.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-complaints"] }),
  });
}