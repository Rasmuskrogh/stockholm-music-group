import Section from "@/components/ui/Section/Section";
import Container from "@/components/ui/Container/Container";
import ContactForm from "./ContactForm";

//import styles from "./Contact.module.css";

function Contact() {
  return (
    <Section id="contact">
      <Container>
        <h2>Var med och tävla</h2>
        <ContactForm />
      </Container>
    </Section>
  );
}

export default Contact;
