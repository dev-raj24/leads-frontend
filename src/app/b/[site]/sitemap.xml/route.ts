import { blogUrl, fetchPublicBlog } from "@/lib/publicBlog";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET(_req: Request, { params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;
  const blog = await fetchPublicBlog(site);
  if (!blog) return new Response("Not found", { status: 404 });

  const urls = [
    `<url><loc>${esc(blogUrl(site))}</loc></url>`,
    ...blog.posts.map((p) => `<url><loc>${esc(blogUrl(site, p.slug))}</loc><lastmod>${new Date(p.updatedAt).toISOString()}</lastmod></url>`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=600" } });
}
