import { useQuery } from "@tanstack/react-query";
import { fetchReviewLocationsService, fetchReviewStatusService, fetchReviewsService } from "@/services/reviews";

export const useReviewStatus = () => useQuery({ queryKey: ["review-status"], queryFn: fetchReviewStatusService });

export const useReviewLocations = (enabled: boolean) =>
  useQuery({ queryKey: ["review-locations"], queryFn: fetchReviewLocationsService, enabled, retry: false });

export const useReviews = (enabled: boolean) =>
  useQuery({ queryKey: ["reviews"], queryFn: fetchReviewsService, enabled, retry: false, staleTime: 60_000 });
