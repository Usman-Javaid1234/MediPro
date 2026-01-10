import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import FeaturedProducts from "@/components/FeaturedProducts";
import ValueProposition from "@/components/ValueProposition";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustBadges />
      {/* <FeaturedProducts /> */}
      <ValueProposition />
      <Newsletter />
      <Footer />
    </div>
  );
}
