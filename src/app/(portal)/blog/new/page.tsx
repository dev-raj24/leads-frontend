"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconSparkle } from "@/components/icons";
import Link from "next/link";
import { PageHead } from "@/components/portal/PageHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBlogPost } from "@/hooks/blog/query";
import { useGenerateBlogDraft, useCreateBlogPost, useUpdateBlogPost } from "@/hooks/blog/mutation";
import { Button } from "@/components/ui/Button";

function BlogFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const { data: existingPost, isLoading: loadingExisting } = useBlogPost(editId ?? "");
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

  useEffect(() => {
    if (existingPost?.post) {
      setTitle(existingPost.post.title);
      setExcerpt(existingPost.post.excerpt ?? "");
      setContent(existingPost.post.content);
      setAiGenerated(existingPost.post.aiGenerated);
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
      updateMutation.mutate({ id: editId, title, excerpt, content, status }, onSettled);
    } else {
      createMutation.mutate({ title, excerpt, content, status, aiGenerated }, onSettled);
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  if (editId && loadingExisting) {
    return <div className="pnl pad"><Skeleton width="40%" height={24} /></div>;
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
          {error && <div className="auth-err">{error}</div>}
          <div className="form-foot">
            <Button type="submit" icon={<IconSparkle size={15} />} disabled={!topic.trim()} loading={generateMutation.isPending} loadingText="Writing…">
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
