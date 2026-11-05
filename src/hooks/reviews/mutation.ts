import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  chooseBusinessService,
  copyReviewReplyService,
  disconnectReviewsService,
  regenerateReviewDraftService,
  searchBusinessService,
  skipReviewService,
  syncReviewsService,
} from "@/services/reviews";
import type { BusinessMatch, GoogleReview } from "@/types/models";

const patchReview = (queryClient: ReturnType<typeof useQueryClient>, review: GoogleReview) =>
  queryClient.setQueryData<{ reviews: GoogleReview[] } | undefined>(["reviews"], (old) =>
    old ? { reviews: old.reviews.map((r) => (r.id === review.id ? review : r)) } : old
  );

export const useSearchBusiness = () => useMutation({ mutationFn: (q: string) => searchBusinessService(q) });

export const useChooseBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (match: BusinessMatch) => chooseBusinessService(match),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-status"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useSyncReviews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncReviewsService,
    onSuccess: (res) => queryClient.setQueryData(["reviews"], res),
  });
};

export const useRegenerateReviewDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => regenerateReviewDraftService(id),
    onSuccess: (res) => patchReview(queryClient, res.review),
  });
};

export const useSkipReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => skipReviewService(id),
    onSuccess: (res) => patchReview(queryClient, res.review),
  });
};

export const useCopyReviewReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => copyReviewReplyService(id, text),
    onSuccess: (res) => patchReview(queryClient, res.review),
  });
};

export const useDisconnectReviews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectReviewsService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-status"] });
      queryClient.removeQueries({ queryKey: ["reviews"] });
    },
  });
};
