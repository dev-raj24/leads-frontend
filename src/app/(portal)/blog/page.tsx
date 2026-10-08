"use client";

import { useState } from "react";
import { IconBlog, IconEdit, IconPlus, IconSparkle, IconTrash } from "@/components/icons";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { Button } from "@/components/ui/Button";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Table, type Column } from "@/components/ui/Table";
import { useBlogPosts } from "@/hooks/blog/query";
import { useTenant } from "@/hooks/tenant/query";
import { useMySite } from "@/hooks/sites/query";
import { IconLock } from "@/components/icons";
import { useDeleteBlogPost } from "@/hooks/blog/mutation";
import { timeAgo } from "@/lib/format";
import type { BlogPost } from "@/types/models";

export default function BlogPage() {
  const { data, isLoading } = useBlogPosts();
  const { data: tenantData } = useTenant();
  const isPro = tenantData?.tenant.plan === "pro";
  const { data: siteData } = useMySite();
  const siteSlug = siteData?.site.publicSlug ?? null;
  const deletePost = useDeleteBlogPost();
  const [deleting, setDeleting] = useState<BlogPost | null>(null);
  const posts: BlogPost[] = data?.posts ?? [];

  const columns: Column<BlogPost>[] = [
    {
      key: "post",
      header: "Post",
      width: "minmax(0, 2fr)",
      sort: (p) => p.title.toLowerCase(),
      cell: (p) => (
        <div className="cell-t">
          <strong>{p.title} {p.aiGenerated && <IconSparkle size={13} style={{ color: "var(--primary)", verticalAlign: "-1px" }} />}</strong>
          <small>{p.excerpt || "No excerpt"}</small>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "110px",
      sort: (p) => p.status,
      cell: (p) => <span className={`pp ${p.status === "published" ? "w" : "c"}`}>{p.status === "published" ? "● LIVE" : "DRAFT"}</span>,
    },
    {
      key: "created",
      header: "Created",
      width: "110px",
      hideOnMobile: true,
      sort: (p) => new Date(p.createdAt).getTime(),
      cell: (p) => <span className="ago" style={{ textAlign: "left" }}>{timeAgo(p.createdAt)} ago</span>,
    },
    {
      key: "actions",
      header: "",
      width: "150px",
      align: "right",
      cell: (p) => (
        <div className="row-actions">
          {p.status === "published" && isPro && siteSlug && (
            <a className="btn line sm" href={`/b/${siteSlug}/${p.slug}`} target="_blank" rel="noreferrer">View</a>
          )}
          {isPro && <Button href={`/blog/new?id=${p.id}`} variant="secondary" size="sm" icon={<IconEdit size={14} />}>Edit</Button>}
          <Button variant="ghost" size="sm" iconOnly ariaLabel="Delete post" icon={<IconTrash size={16} />} onClick={() => setDeleting(p)} />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHead
        eyebrow="Content"
        title={<>AI <em>Blog</em></>}
        sub="Write once with AI, publish straight to your website."
        actions={isPro ? <Button href="/blog/new" icon={<IconSparkle size={15} />}>Write with AI</Button> : undefined}
      />

      {tenantData && !isPro && (
        <div className="pnl" style={{ marginBottom: 18 }}>
          <EmptyState
            icon={<IconLock size={26} />}
            title="The blog is a Pro feature"
            text={posts.length > 0 ? "Your posts are saved, but they are not shown on your website until you are back on Pro." : "Upgrade to Pro to write posts with AI and publish them straight to your website."}
            action={<Button href="/account">View plans</Button>}
          />
        </div>
      )}

      {isLoading && <ListSkeleton />}

      {isPro && !isLoading && posts.length === 0 && (
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
        <Table columns={columns} rows={posts} rowKey={(p) => p.id} pageSize={10} defaultSort={{ key: "created", dir: "desc" }} itemLabel="posts" />
      )}

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete this post?"
        message={deleting ? `"${deleting.title}" will be removed, including from your website. This can't be undone.` : ""}
        confirmText="Delete post"
        isLoading={deletePost.isPending}
        onConfirm={() => deleting && deletePost.mutate(deleting.id, { onSettled: () => setDeleting(null) })}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
