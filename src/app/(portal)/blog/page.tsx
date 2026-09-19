"use client";

import { useState } from "react";
import { IconBlog, IconEdit, IconPlus, IconSparkle, IconTrash } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { useBlogPosts } from "@/hooks/blog/query";
import { useDeleteBlogPost } from "@/hooks/blog/mutation";
import { timeAgo } from "@/lib/format";
import type { BlogPost } from "@/types/models";

export default function BlogPage() {
  const { data, isLoading } = useBlogPosts();
  const deletePost = useDeleteBlogPost();
  const [deleting, setDeleting] = useState<BlogPost | null>(null);
  const posts: BlogPost[] = data?.posts ?? [];

  function confirmDelete() {
    if (!deleting) return;
    deletePost.mutate(deleting.id, { onSettled: () => setDeleting(null) });
  }

  return (
    <>
      <PageHead
        eyebrow="Content"
        title={<>AI <em>Blog</em></>}
        sub="Write once with AI, publish straight to your website."
        actions={<Button href="/blog/new" icon={<IconSparkle size={15} />}>Write with AI</Button>}
      />

      {isLoading && <ListSkeleton />}

      {!isLoading && posts.length === 0 && (
        <div className="pnl">
          <EmptyState
            icon={<IconBlog size={26} />}
            title="No posts yet"
            text="Type a topic and let AI write your first post — then publish it to your website in one click."
            action={<Button href="/blog/new" icon={<IconPlus size={15} />}>Write with AI</Button>}
          />
        </div>
      )}

      {!isLoading && posts.length > 0 && (
        <div className="pnl">
          {posts.map((post) => (
            <div key={post.id} className={`li ${post.status === "published" ? "live" : ""}`}>
              <div className="li-main">
                <div className="li-title">
                  {post.title}
                  <span className={`pp ${post.status === "published" ? "w" : "c"}`}>{post.status === "published" ? "● LIVE" : "DRAFT"}</span>
                  {post.aiGenerated && <IconSparkle size={14} style={{ color: "var(--primary)" }} />}
                </div>
                <div className="li-sub">{post.excerpt || "No excerpt"} · {timeAgo(post.createdAt)} ago</div>
              </div>
              <div className="li-act">
                <Button href={`/blog/new?id=${post.id}`} variant="secondary" size="sm" icon={<IconEdit size={14} />}>Edit</Button>
                <button className="iconbtn" onClick={() => setDeleting(post)} aria-label="Delete post"><IconTrash size={17} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete this post?"
        message={deleting ? `"${deleting.title}" will be removed, including from your website. This can't be undone.` : ""}
        confirmText="Delete post"
        isLoading={deletePost.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
