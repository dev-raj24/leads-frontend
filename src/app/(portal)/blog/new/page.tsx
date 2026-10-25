"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconLock, IconSparkle } from "@/components/icons";
import Link from "next/link";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBlogPost } from "@/hooks/blog/query";
import { useGenerateBlogDraft, useCreateBlogPost, useUpdateBlogPost } from "@/hooks/blog/mutation";
import { useTenant } from "@/hooks/tenant/query";
import { useMySite } from "@/hooks/sites/query";
import { Button } from "@/components/ui/Button";

const origin = typeof window === "undefined" ? "" : window.location.host;
const slugPreview = (title: string) => title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "post";

function BlogFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const { data: existingPost, isLoading: loadingExisting } = useBlogPost(editId ?? "");
  const { data: tenantData } = useTenant();
  const isPro = tenantData?.tenant.plan === "pro";
  const generateMutation = useGenerateBlogDraft();
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();

  const [topic, setTopic] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [hasDraft, setHasDraft] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [aiGenerated, setAiGenerated] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const { data: siteData } = useMySite();
  const publicSlug = siteData?.site.publicSlug ?? "your-site";

  useEffect(() => {
    if (existingPost?.post) {
      setTitle(existingPost.post.title);
      setExcerpt(existingPost.post.excerpt ?? "");
      setContent(existingPost.post.content);
      setAiGenerated(existingPost.post.aiGenerated);
      setMetaTitle(existingPost.post.metaTitle ?? "");
      setMetaDescription(existingPost.post.metaDescription ?? "");
      setHasDraft(true);
    }
  }, [existingPost]);

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setError(null);
    generateMutation.mutate(topic.trim(), {
      onSuccess: (res) => {
        setTitle(res.draft.title);
        setExcerpt(res.draft.excerpt);
        setContent(res.draft.content);
        setMetaTitle(res.draft.metaTitle ?? "");
        setMetaDescription(res.draft.metaDescription ?? "");
        setAiGenerated(true);
        setHasDraft(true);
      },
      onError: () => {
        setError("AI generation failed — make sure the backend has an AI key configured, or write the post manually below.");
        setTitle(topic);
        setAiGenerated(false);
        setHasDraft(true);
      },
    });
  }

  function handleSave(status: "draft" | "published") {
    if (!title.trim() || !content.trim()) {
      setError("Title and content can't be empty.");
      return;
    }
    setError(null);

    const onSettled = {
      onSuccess: () => router.push("/blog"),
      onError: () => setError("Couldn't save the post — is leadworks-api running?"),
    };

    if (editId) {
      updateMutation.mutate({ id: editId, title, excerpt, content, status, metaTitle, metaDescription }, onSettled);
    } else {
      createMutation.mutate({ title, excerpt, content, status, aiGenerated, metaTitle, metaDescription }, onSettled);
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  if (editId && loadingExisting) {
    return <div className="pnl pad"><Skeleton width="40%" height={24} /></div>;
  }

  if (tenantData && !isPro) {
    return (
      <>
        <Link href="/blog" className="back">← All posts</Link>
        <div className="pnl">
          <EmptyState icon={<IconLock size={26} />} title="The blog is a Pro feature" text="Upgrade to Pro to write posts and publish them to your website." action={<Button href="/account">View plans</Button>} />
        </div>
      </>
    );
  }

  return (
    <>
      <Link href="/blog" className="back">← All posts</Link>
      <PageHead
        eyebrow={editId ? "Editing" : "New post"}
        title={editId ? "Edit post" : <>Write with <em>AI</em></>}
        sub={editId ? "Update this post and publish the changes." : "Type a topic and AI drafts the whole post for you."}
      />

      {!hasDraft && (
        <form className="pnl pad" onSubmit={handleGenerate} style={{ maxWidth: 760 }}>
          <div className="field">
            <label className="flabel" htmlFor="topic">What should this post be about?</label>
            <input id="topic" className="finput" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. How to care for your teeth after a root canal" />
          </div>
          {!isPro && (
            <p className="hint">
              <IconLock size={12} style={{ verticalAlign: "-1px", marginRight: 4 }} />
              AI writing is a Pro feature. <Link href="/account">Upgrade to Pro →</Link>
            </p>
          )}
          {error && <div className="auth-err">{error}</div>}
          <div className="form-foot">
            <Button
              type="submit"
              icon={isPro ? <IconSparkle size={15} /> : <IconLock size={13} />}
              disabled={!topic.trim() || !isPro}
              loading={generateMutation.isPending}
              loadingText="Writing…"
            >
              Generate with AI
            </Button>
            <Button variant="secondary" onClick={() => { setTitle(topic || "Untitled post"); setAiGenerated(false); setHasDraft(true); }}>
              Write it myself
            </Button>
          </div>
        </form>
      )}

      {hasDraft && (
        <div className="pnl pad" style={{ maxWidth: 820 }}>
          {aiGenerated && <div className="ai-flag"><IconSparkle size={15} /> AI-generated draft — review and edit before publishing.</div>}

          <div className="field">
            <label className="flabel" htmlFor="title">Title</label>
            <input id="title" className="finput" value={title} onChange={(e) => setTitle(e.target.value)} style={{ fontWeight: 600 }} />
          </div>
          <div className="field">
            <label className="flabel" htmlFor="excerpt">Excerpt</label>
            <textarea id="excerpt" className="finput" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </div>
          <div className="field">
            <label className="flabel" htmlFor="content">Content</label>
            <textarea id="content" className="finput" rows={16} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>

          <div className="sec-t" style={{ marginTop: 8 }}>How it looks on Google</div>
          <div className="serp" aria-label="Search result preview">
            <div className="serp-url">{origin}/b/{publicSlug}/{slugPreview(title)}</div>
            <div className="serp-title">{(metaTitle || title || "Your post title").slice(0, 60)}</div>
            <div className="serp-desc">{(metaDescription || excerpt || content.replace(/\s+/g, " ").slice(0, 155) || "Your description appears here.").slice(0, 160)}</div>
          </div>
          <div className="field">
            <label className="flabel" htmlFor="meta-title">SEO title <span className={`count ${metaTitle.length > 60 ? "over" : ""}`}>{metaTitle.length}/60</span></label>
            <input id="meta-title" className="finput" maxLength={70} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={title || "Defaults to the post title"} />
          </div>
          <div className="field">
            <label className="flabel" htmlFor="meta-desc">SEO description <span className={`count ${metaDescription.length > 160 ? "over" : ""}`}>{metaDescription.length}/160</span></label>
            <textarea id="meta-desc" className="finput" rows={2} maxLength={170} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="One sentence that makes someone click. Defaults to the excerpt." />
          </div>

          {error && <div className="auth-err">{error}</div>}
          <div className="form-foot">
            <Button variant="secondary" loading={saving} loadingText="Saving…" onClick={() => handleSave("draft")}>Save as draft</Button>
            <Button loading={saving} loadingText="Publishing…" onClick={() => handleSave("published")}>Publish to website</Button>
          </div>
        </div>
      )}
    </>
  );
}

export default function BlogFormPage() {
  return (
    <Suspense fallback={null}>
      <BlogFormContent />
    </Suspense>
  );
}
