import { useQuery } from "@tanstack/react-query";
import { fetchCustomersService, fetchCustomerService } from "@/services/customers";

export const useCustomers = () =>
  useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomersService,
  });

export const useCustomer = (contact: string) =>
  useQuery({
    queryKey: ["customer", contact],
    queryFn: () => fetchCustomerService(contact),
    enabled: !!contact,
  });
