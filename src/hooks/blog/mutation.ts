import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateBlogDraftService,
  createBlogPostService,
  updateBlogPostService,
  deleteBlogPostService,
} from "@/services/blog";
import type { BlogPostPayload } from "@/types/models";

export const useGenerateBlogDraft = () =>
  useMutation({
    mutationFn: (topic: string) => generateBlogDraftService(topic),
  });

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: BlogPostPayload & { title: string; content: string }) => createBlogPostService(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & BlogPostPayload) => updateBlogPostService(id, body),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post", variables.id] });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBlogPostService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
};
