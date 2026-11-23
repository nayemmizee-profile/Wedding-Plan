import Hero from "@/Hero/Hero";
import WeddingJourney from "@/Home3rdsection/3rdSEction";
import WeddingGallery from "@/Home3rdsection/4thSection";
import LoveStories from "@/Home3rdsection/5thSection";
import WeddingInspiration from "@/Home3rdsection/6thSection";
import ServiceSection from "@/ServiceSection/servicesCard";
import HomeCTA from "@/ServiceSection/servicesCSS";

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceSection />
      <HomeCTA />
      <WeddingJourney />
      <WeddingGallery />
      <LoveStories />
      <WeddingInspiration />
    </>
  );
}
