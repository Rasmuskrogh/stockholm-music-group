"use client";
import { useState } from "react";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    message: "",
    date: "",
    place: "",
    music: "",
    terms: false,
    agree: false,
    info: false,
    website: "", // honeypot – ska vara tom
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          tel: "",
          message: "",
          date: "",
          place: "",
          music: "",
          terms: false,
          agree: false,
          info: false,
          website: "",
        });
        setStatus("success");
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(
          typeof data?.message === "string" ? data.message : ""
        );
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("");
      setStatus("error");
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Honeypot – dolt för användare, bottar fyller ofta i */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="website">Lämna tom</label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <label className={styles.label}>
          {/*     <span className={styles.labelText}>Name</span> */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Namn *"
          />
        </label>

        <label className={styles.label}>
          {/*      <span className={styles.labelText}>Email</span> */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="E-postadress *"
          />
        </label>
        <label className={styles.label}>
          <input
            type="tel"
            name="tel"
            value={formData.tel}
            onChange={handleChange}
            className={styles.input}
            placeholder="Telefonnummer"
          />
        </label>
        <label className={styles.label}>
          {/*  <span className={styles.labelText}>Message</span> */}
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Datum för bröllopet *"
          />
        </label>
        <label className={styles.label}>
          {/*  <span className={styles.labelText}>Message</span> */}
          <input
            type="text"
            name="place"
            value={formData.place}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Plats för bröllopet (stad/region) *"
          />
        </label>
        <label className={styles.label}>
          {/*  <span className={styles.labelText}>Message</span> */}
          <input
            type="text"
            name="music"
            value={formData.music}
            onChange={handleChange}
            className={styles.input}
            placeholder="Önskad låt eller musikstil"
          />
        </label>
        {/* <div className={styles.checkboxRow}>
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            className={styles.checkbox}
            required
          />
          <label htmlFor="terms" className={styles.checkboxLabel}>
            Jag godkänner tävlingsvillkoren *
          </label>
        </div>
        <div className={styles.checkboxRow}>
          <input
            type="checkbox"
            id="agree"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className={styles.checkbox}
            required
          />
          <label htmlFor="agree" className={styles.checkboxLabel}>
            Jag samtycker till att SMG behandlar mina personuppgifter för att
            administrera tävlingen *
          </label>
        </div> */}
        <div className={styles.checkboxRow}>
          <input
            type="checkbox"
            id="info"
            name="info"
            checked={formData.info}
            onChange={handleChange}
            className={styles.checkbox}
          />
          <label htmlFor="info" className={styles.checkboxLabel}>
            Jag samtycker till att SMG kontaktar mig med information om
            framtida spelningar och erbjudanden
          </label>
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className={styles.submitButton}
        >
          {status === "submitting" ? "Skickar..." : "Skicka"}
        </button>

        {status === "success" && (
          <div className={styles.successMessage}>
            Tack! Ditt meddelande har skickats.
          </div>
        )}

        {status === "error" && (
          <div className={styles.errorMessage}>
            {errorMessage ||
              "Jag ber om ursäkt, det blev ett fel när ditt meddelande skulle skickas. Vänligen försök igen."}
          </div>
        )}
      </form>
    </div>
  );
}
