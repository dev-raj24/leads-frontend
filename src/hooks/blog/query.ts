import { useQuery } from "@tanstack/react-query";
import { fetchBlogPostsService, fetchBlogPostService } from "@/services/blog";

export const useBlogPosts = () =>
  useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPostsService,
  });

export const useBlogPost = (id: string) =>
  useQuery({
    queryKey: ["blog-post", id],
    queryFn: () => fetchBlogPostService(id),
    enabled: !!id,
  });
