import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { TrackMatrix } from "@/components/TrackMatrix";
import { ThoughtFeed } from "@/components/ThoughtFeed";
import { LeadEngine } from "@/components/LeadEngine";
import { Footer } from "@/components/Footer";
import { BlogFeedJsonLd } from "@/components/BlogFeedJsonLd";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <TrackMatrix />
        <ThoughtFeed />
        <LeadEngine />
      </main>
      <Footer />
      <BlogFeedJsonLd />
    </>
  );
}