import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogUrl, fetchPublicPost, formatDate } from "@/lib/publicBlog";

type Props = { params: Promise<{ site: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site, slug } = await params;
  const found = await fetchPublicPost(site, slug);
  if (!found) return { title: "Post not found", robots: { index: false } };
  const { post, businessName } = found;
  const url = blogUrl(site, slug);
  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url,
      type: "article",
      siteName: businessName,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
    },
    twitter: { card: "summary", title: post.seoTitle, description: post.seoDescription },
  };
}

const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export default async function PublicBlogPost({ params }: Props) {
  const { site, slug } = await params;
  const found = await fetchPublicPost(site, slug);
  if (!found) notFound();
  const { post, businessName } = found;

  const blocks = post.content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const structured = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle,
    description: post.seoDescription,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    mainEntityOfPage: blogUrl(site, slug),
    author: { "@type": "Organization", name: businessName },
    publisher: { "@type": "Organization", name: businessName },
  };

  return (
    <article className="pb-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
      <header className="pb-head">
        <Link href={`/b/${site}`}>{businessName}</Link>
        <Link href={`/b/${site}`}>All posts</Link>
      </header>
      <h1>{post.title}</h1>
      <div className="pb-date">{formatDate(post.publishedAt)}</div>
      {blocks.map((block, i) =>
        /^##\s+/.test(block) ? <h2 key={i}>{block.replace(/^##\s+/, "")}</h2> : <p key={i}>{block}</p>,
      )}
    </article>
  );
}
