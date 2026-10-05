import Section from "@/components/ui/Section/Section";
import Container from "@/components/ui/Container/Container";
import type { BookingFormConfig } from "@/lib/bookingForm";
import ContactForm from "./ContactForm";

function Contact({ title, form }: { title?: string; form: BookingFormConfig }) {
  return (
    <Section id="contact">
      <Container>
        <h2>{title || "BOKA OSS"}</h2>
        <ContactForm config={form} />
      </Container>
    </Section>
  );
}

export default Contact;
