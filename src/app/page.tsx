import Hero from "../components/hero";
import FeaturedListings from "../components/featured-listings";
import HowItWorks from "../components/how-it-works";
import Categories from "../components/categories";
import Stats from "../components/stats";
import AIHighlight from "../components/ai-highlight";
import Testimonials from "../components/testimonials";
import NewsletterFAQ from "../components/newsletter-faq";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedListings />
      <HowItWorks />
      <Categories />
      <Stats />
      <AIHighlight />
      <Testimonials />
      <NewsletterFAQ />
    </>
  );
}
