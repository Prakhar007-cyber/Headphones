import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import SoundExperience from "@/components/sections/SoundExperience";
import ProductStory from "@/components/sections/ProductStory";
import Collection from "@/components/sections/Collection";
import Lifestyle from "@/components/sections/Lifestyle";
import Visualizer from "@/components/sections/Visualizer";
import MacroDetails from "@/components/sections/MacroDetails";
import Comparison from "@/components/sections/Comparison";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <Navbar />
      <main>
        <Hero />
        <SoundExperience />
        <ProductStory />
        <Collection />
        <Lifestyle />
        <Visualizer />
        <MacroDetails />
        <Comparison />
        <FinalCta />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
