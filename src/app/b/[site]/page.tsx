import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogUrl, fetchPublicBlog, formatDate } from "@/lib/publicBlog";

type Props = { params: Promise<{ site: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site } = await params;
  const blog = await fetchPublicBlog(site);
  if (!blog) return { title: "Blog not found", robots: { index: false } };
  const title = `${blog.businessName} blog`;
  const description = `Articles and advice from ${blog.businessName}.`;
  return {
    title,
    description,
    alternates: { canonical: blogUrl(site) },
    openGraph: { title, description, url: blogUrl(site), type: "website" },
  };
}

export default async function PublicBlogIndex({ params }: Props) {
  const { site } = await params;
  const blog = await fetchPublicBlog(site);
  if (!blog) notFound();

  return (
    <div className="pb-wrap">
      <header className="pb-head">
        <Link href={`/b/${site}`}>{blog.businessName}</Link>
      </header>
      <h1>{blog.businessName} blog</h1>
      <p style={{ marginBottom: 24 }}>Articles and advice from our team.</p>
      {blog.posts.length === 0 && <p className="pb-empty">No posts yet.</p>}
      {blog.posts.map((post) => (
        <Link key={post.id} href={`/b/${site}/${post.slug}`} className="pb-card">
          <h2>{post.title}</h2>
          <div className="pb-date">{formatDate(post.publishedAt)}</div>
          <p>{post.seoDescription}</p>
        </Link>
      ))}
    </div>
  );
}
