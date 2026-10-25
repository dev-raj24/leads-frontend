import { callApi } from "@/utils/apiUtils";
import blogEndpoints from "@/utils/apiUtils/endpoints/blog";
import { ApiEndpoint } from "@/types/api";
import type { BlogPost, BlogDraft, BlogPostPayload } from "@/types/models";

export async function generateBlogDraftService(topic: string): Promise<{ draft: BlogDraft }> {
  return callApi({
    uriEndPoint: { ...blogEndpoints.generate.v1 } as ApiEndpoint,
    body: { topic },
  });
}

export async function fetchBlogPostsService(): Promise<{ posts: BlogPost[] }> {
  return callApi({
    uriEndPoint: { ...blogEndpoints.list.v1 } as ApiEndpoint,
  });
}

export async function fetchBlogPostService(id: string): Promise<{ post: BlogPost }> {
  return callApi({
    uriEndPoint: { ...blogEndpoints.get.v1 } as ApiEndpoint,
    pathParams: { id },
  });
}

export async function createBlogPostService(body: BlogPostPayload & { title: string; content: string }): Promise<{ post: BlogPost }> {
  return callApi({
    uriEndPoint: { ...blogEndpoints.create.v1 } as ApiEndpoint,
    body: body as unknown as Record<string, unknown>,
  });
}

export async function updateBlogPostService(id: string, body: BlogPostPayload): Promise<{ post: BlogPost }> {
  return callApi({
    uriEndPoint: { ...blogEndpoints.update.v1 } as ApiEndpoint,
    pathParams: { id },
    body: body as Record<string, unknown>,
  });
}

export async function deleteBlogPostService(id: string): Promise<{ ok: boolean }> {
  return callApi({
    uriEndPoint: { ...blogEndpoints.remove.v1 } as ApiEndpoint,
    pathParams: { id },
  });
}
