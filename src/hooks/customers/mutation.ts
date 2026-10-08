import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eraseCustomerService, exportCustomerService } from "@/services/customers";

export const useExportCustomer = () => useMutation({ mutationFn: (contact: string) => exportCustomerService(contact) });

export const useEraseCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contact: string) => eraseCustomerService(contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};
