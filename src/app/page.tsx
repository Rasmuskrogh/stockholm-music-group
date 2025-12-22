import Hero from "@/components/sections/Hero/Hero";
import Bio from "@/components/sections/Bio/Bio";
import Contact from "@/components/sections/Contact/Contact";
import Footer from "@/components/sections/Footer/Footer";
import Media from "@/components/sections/Media/Media";
import Gallery from "@/components/sections/Gallery/Gallery";

function page() {
  return (
    <div>
      <Hero />
      <Bio />
      <Media />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}

export default page;
