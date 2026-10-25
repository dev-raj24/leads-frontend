import "./blog.css";

export default function PublicBlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="pb">{children}</div>;
}
