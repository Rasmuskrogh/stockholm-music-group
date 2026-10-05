import Section from "@/components/ui/Section/Section";
import Container from "@/components/ui/Container/Container";
import ContactForm from "./ContactForm";

//import styles from "./Contact.module.css";

function Contact({ title }: { title?: string }) {
  return (
    <Section id="contact">
      <Container>
        <h2>{title || "BOKA OSS"}</h2>
        <ContactForm />
      </Container>
    </Section>
  );
}

export default Contact;
