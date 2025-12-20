import Hero from "@/components/sections/Hero/Hero";
import Bio from "@/components/sections/Bio/Bio";
import Contact from "@/components/sections/Contact/Contact";
import Footer from "@/components/sections/Footer/Footer";

function page() {
  return (
    <div>
      <Hero />
      <Bio />
      <Contact />
      <Footer />
    </div>
  );
}

export default page;
