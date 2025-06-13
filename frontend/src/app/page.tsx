import Examples from "@/components/Examples";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";

export default function Home() {

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />
      <Examples />
      <Features />
      <Footer />
    </div>
  );
}

export const metadata = {
  title: 'AdGen - AI Video Ad Generator',
  description: 'Transform Amazon product URLs into compelling video advertisements using AI',
}