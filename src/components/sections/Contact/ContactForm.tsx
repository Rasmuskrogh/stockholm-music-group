"use client";
import { useState } from "react";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setFormData({ name: "", email: "", tel: "", message: "" });
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          {/*     <span className={styles.labelText}>Name</span> */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Ditt namn *"
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
            placeholder="Din e-post *"
          />
        </label>
        {/* <label className={styles.label}>
          <span className={styles.labelText}>Phone number</span>
          <input
            type="tel"
            name="tel"
            value={formData.tel}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Your phone number"
          />
        </label> */}
        <label className={styles.label}>
          {/*  <span className={styles.labelText}>Message</span> */}
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className={styles.textarea}
            placeholder="Ditt meddelande *"
          ></textarea>
        </label>

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
            Jag ber om ursäkt, det blev ett fel när ditt meddelande skulle
            skickas. Vänligen forsök igen.
          </div>
        )}
      </form>
    </div>
  );
}
