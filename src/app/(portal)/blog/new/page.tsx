"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconSparkle } from "@/components/icons";
import { Button } from "@/components/Button";
import { useBlogPost } from "@/hooks/blog/query";
import { useGenerateBlogDraft, useCreateBlogPost, useUpdateBlogPost } from "@/hooks/blog/mutation";

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
    return <div className="p-card" style={{ padding: 20, fontSize: 13, color: "#98A2B3" }}>Loading…</div>;
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button href="/blog" variant="outline">
          ← Back to Blog
        </Button>
      </div>

      <div className="p-mh">
        <span className="p-mt">
          {editId ? "Edit Post" : "Write with AI"}
          <em>{editId ? "update this post" : "type a topic, AI drafts it"}</em>
        </span>
      </div>

      {!hasDraft && (
        <div className="p-card" style={{ padding: 24, marginBottom: 20 }}>
          <form onSubmit={handleGenerate}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 6, fontWeight: 700 }}>
              What should this post be about?
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How to care for your teeth after a root canal"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.5px solid var(--ink)",
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 14,
              }}
            />
            {error && (
              <div style={{ color: "#D92D20", fontSize: 12.5, fontWeight: 700, marginBottom: 10 }}>{error}</div>
            )}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Button type="submit" disabled={generateMutation.isPending || !topic.trim()} icon={<IconSparkle size={14} />}>
                {generateMutation.isPending ? "Writing…" : "Generate with AI"}
              </Button>
              <span
                style={{ fontSize: 12, color: "#98A2B3", cursor: "pointer", fontWeight: 700 }}
                onClick={() => {
                  setTitle(topic || "Untitled post");
                  setAiGenerated(false);
                  setHasDraft(true);
                }}
              >
                or write it myself →
              </span>
            </div>
          </form>
        </div>
      )}

      {hasDraft && (
        <div className="p-card" style={{ padding: 24, marginBottom: 24 }}>
          {aiGenerated && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#155EEF",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              <IconSparkle size={14} /> AI-generated draft — review and edit before publishing.
            </div>
          )}

          <label style={{ display: "block", fontSize: 12, marginBottom: 4, fontWeight: 700 }}>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              border: "1.5px solid var(--ink)",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 14,
            }}
          />

          <label style={{ display: "block", fontSize: 12, marginBottom: 4, fontWeight: 700 }}>Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            style={{
              width: "100%",
              padding: "9px 12px",
              border: "1.5px solid var(--ink)",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 14,
              fontFamily: "inherit",
            }}
          />

          <label style={{ display: "block", fontSize: 12, marginBottom: 4, fontWeight: 700 }}>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            style={{
              width: "100%",
              padding: 12,
              border: "1.5px solid var(--ink)",
              borderRadius: 8,
              fontSize: 13.5,
              lineHeight: 1.6,
              marginBottom: 16,
              fontFamily: "inherit",
            }}
          />

          {error && <div style={{ color: "#D92D20", fontSize: 12.5, fontWeight: 700, marginBottom: 10 }}>{error}</div>}

          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="secondary" disabled={saving} onClick={() => handleSave("draft")}>
              {saving ? "Saving…" : "Save as Draft"}
            </Button>
            <Button disabled={saving} onClick={() => handleSave("published")}>
              {saving ? "Publishing…" : "Publish to Website"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default function BlogFormPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <BlogFormContent />
    </Suspense>
  );
}
