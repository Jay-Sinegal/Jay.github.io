import rss from "@astrojs/rss";
import { ARTICLES } from "../data/articles";

const host = "https://jaylensinegal.com";

export const GET = () =>
  rss({
    title: "Jaylen Sinegal Blog",
    description:
      "Brand strategy, sports and entertainment, student-athletes, and Louisiana storytelling from Jaylen Sinegal.",
    site: host,
    items: ARTICLES.map((article) => ({
      title: article.title,
      description: article.dek,
      link: `${host}/blog/${article.slug}.html`,
      pubDate: new Date(article.date),
      categories: article.pillar.split(" · "),
      author: "Jaylen Sinegal",
    })),
    customData: `<language>en-us</language>`,
  });