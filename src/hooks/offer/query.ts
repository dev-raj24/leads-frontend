import { fetchOffersService } from "@/services/offers";
import { useQuery } from "@tanstack/react-query";

export const useGetOffers = () =>
  useQuery({
    queryKey: ["offers"],
    queryFn: fetchOffersService,
  });
