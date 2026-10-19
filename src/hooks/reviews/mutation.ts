import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  chooseReviewLocationService,
  connectReviewsService,
  disconnectReviewsService,
  regenerateReviewDraftService,
  sendReviewReplyService,
  skipReviewService,
  syncReviewsService,
} from "@/services/reviews";
import type { GoogleLocation, GoogleReview } from "@/types/models";

const patchReview = (queryClient: ReturnType<typeof useQueryClient>, review: GoogleReview) =>
  queryClient.setQueryData<{ reviews: GoogleReview[] } | undefined>(["reviews"], (old) =>
    old ? { reviews: old.reviews.map((r) => (r.id === review.id ? review : r)) } : old
  );

export const useConnectReviews = () =>
  useMutation({
    mutationFn: connectReviewsService,
    onSuccess: (res) => {
      window.location.href = res.url;
    },
  });

export const useChooseReviewLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (location: GoogleLocation) => chooseReviewLocationService(location),
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

export const useSendReviewReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => sendReviewReplyService(id, text),
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
