import { ARTICLES } from "@/lib/articles";

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://jaylensinegal.com/#blog",
  url: "https://jaylensinegal.com/blog/",
  name: "Jaylen Sinegal Blog",
  description:
    "Long-form brand strategy, media IP, and sports entertainment thinking from Jaylen Sinegal.",
  blogPost: ARTICLES.map((a) => ({
    "@type": "BlogPosting",
    headline: a.title,
    url: `https://jaylensinegal.com/blog/${a.slug}.html`,
    datePublished: a.date,
    author: { "@id": "https://jaylensinegal.com/#person" },
  })),
};

export function BlogFeedJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
    />
  );
}