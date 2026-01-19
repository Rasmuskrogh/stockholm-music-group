import Hero from "@/components/sections/Hero/Hero";
import Bio from "@/components/sections/Bio/Bio";
import Contact from "@/components/sections/Contact/Contact";
import Footer from "@/components/sections/Footer/Footer";
import Media from "@/components/sections/Media/Media";
import Gallery from "@/components/sections/Gallery/Gallery";
import ScrollToTop from "@/components/ui/ScrollToTop/ScrollToTop";

function page() {
  return (
    <div>
      <Hero />
      <Bio />
      <Media />
      <Contact />
      <Gallery />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default page;
