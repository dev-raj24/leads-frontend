"use client";

import { useState } from "react";
import { IconPlus, IconSparkle, IconTrash, IconEdit } from "@/components/icons";
import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useBlogPosts } from "@/hooks/blog/query";
import { useDeleteBlogPost } from "@/hooks/blog/mutation";
import type { BlogPost } from "@/types/models";
import { timeAgo } from "@/lib/format";

export default function BlogPage() {
  const { data, isLoading: loading } = useBlogPosts();
  const deleteMutation = useDeleteBlogPost();
  const [deleting, setDeleting] = useState<BlogPost | null>(null);

  const posts: BlogPost[] = data?.posts ?? [];

  function handleConfirmDelete() {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => setDeleting(null),
      onError: () => setDeleting(null),
    });
  }

  return (
    <>
      <div className="p-mh">
        <span className="p-mt">
          AI Blog<em>write once, live on your site</em>
        </span>
        <Button href="/blog/new" icon={<IconPlus size={14} />}>
          Write with AI
        </Button>
      </div>

      {loading && <div className="p-card" style={{ padding: 20, fontSize: 13, color: "#98A2B3" }}>Loading…</div>}

      {!loading && posts.length === 0 && (
        <div className="p-card" style={{ padding: 24, textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>No posts yet</div>
          <div style={{ fontSize: 13, color: "#98A2B3", marginBottom: 16 }}>
            Type a topic and let AI write your first post — publish it straight to your website.
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button href="/blog/new" icon={<IconPlus size={14} />}>
              Write with AI
            </Button>
          </div>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-card"
              style={{
                padding: 16,
                marginBottom: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: post.status === "published" ? "#F5F8FF" : "#fff",
                border: "1.5px solid var(--ink)",
                borderRadius: 14,
                transition: "all 0.2s ease",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  {post.title}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: 100,
                      background: post.status === "published" ? "#DCFCE7" : "#F1F5F9",
                      color: post.status === "published" ? "#15803D" : "#64748B",
                      border: "1px solid var(--ink)",
                    }}
                  >
                    {post.status === "published" ? "● Live on Site" : "Draft"}
                  </span>
                  {post.aiGenerated && <IconSparkle size={13} style={{ color: "#155EEF" }} />}
                </div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                  {post.excerpt || "No excerpt"} · {timeAgo(post.createdAt)} ago
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Button href={`/blog/new?id=${post.id}`} variant="secondary" icon={<IconEdit size={14} />}>
                  Edit
                </Button>
                <button
                  onClick={() => setDeleting(post)}
                  title="Delete Post"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 4,
                    cursor: "pointer",
                    color: "#98A2B3",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#D92D20")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#98A2B3")}
                >
                  <IconTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Post"
        message={deleting ? `Are you sure you want to delete "${deleting.title}"? This action cannot be undone.` : ""}
        confirmText="Delete Post"
        cancelText="Cancel"
        isDanger={true}
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
