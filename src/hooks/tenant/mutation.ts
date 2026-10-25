import { useMutation, useQueryClient } from "@tanstack/react-query";
import { choosePlanService, updateIndustryService, updateNameService } from "@/services/tenant";
import { setTenant } from "@/lib/session";
import type { Plan, Tenant } from "@/types/models";

export const useUpdateTenantName = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => updateNameService(name),
    onSuccess: (res) => {
      queryClient.setQueryData<{ tenant: Tenant }>(["tenant", "me"], res);
      setTenant(res.tenant);
    },
  });
};

export const useUpdateIndustry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (industry: string) => updateIndustryService(industry),
    onSuccess: (res) => queryClient.setQueryData<{ tenant: Tenant }>(["tenant", "me"], res),
  });
};

export const useChoosePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (plan: Plan) => choosePlanService(plan),
    onSuccess: (res) => queryClient.setQueryData<{ tenant: Tenant }>(["tenant", "me"], res),
  });
};
