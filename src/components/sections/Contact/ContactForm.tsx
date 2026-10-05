"use client";
import { useState } from "react";
import {
  DEFAULT_SUBMIT_LABEL,
  DEFAULT_SUCCESS_MESSAGE,
  HTML_INPUT_TYPE,
  displayLabel,
  isRequired,
  type BookingFormConfig,
} from "@/lib/bookingForm";
import styles from "./ContactForm.module.css";

type Values = Record<string, string | boolean>;

/** Fields come from the Studio (contactSection.fields), keyed by their _key. */
export default function ContactForm({ config }: { config: BookingFormConfig }) {
  const emptyValues = (): Values =>
    Object.fromEntries(
      config.fields.map((f) => [
        f._key,
        f._type === "formCheckbox" ? false : "",
      ]),
    );

  const [values, setValues] = useState<Values>(emptyValues);
  const [website, setWebsite] = useState(""); // honeypot – ska vara tom
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setValues({ ...values, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values, website }),
      });

      if (response.ok) {
        setValues(emptyValues());
        setWebsite("");
        setStatus("success");
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(typeof data?.message === "string" ? data.message : "");
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
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {config.fields.map((field) => {
          const text = displayLabel(field);
          const required = isRequired(field);

          if (field._type === "formCheckbox") {
            const id = `field-${field._key}`;
            return (
              <div key={field._key} className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  id={id}
                  name={field._key}
                  checked={values[field._key] === true}
                  onChange={handleChange}
                  className={styles.checkbox}
                  required={required}
                />
                <label htmlFor={id} className={styles.checkboxLabel}>
                  {text}
                </label>
              </div>
            );
          }

          return (
            <label key={field._key} className={styles.label}>
              {field.kind === "textarea" ? (
                <textarea
                  name={field._key}
                  value={String(values[field._key] ?? "")}
                  onChange={handleChange}
                  required={required}
                  className={`${styles.input} ${styles.textareaTall}`}
                  placeholder={text}
                  rows={4}
                />
              ) : (
                <>
                  {/* A date input can't show a placeholder, so its text goes above it. */}
                  {field.kind === "date" ? (
                    <span className={styles.dateCaption}>{text}</span>
                  ) : null}
                  <input
                    type={HTML_INPUT_TYPE[field.kind] ?? "text"}
                    name={field._key}
                    value={String(values[field._key] ?? "")}
                    onChange={handleChange}
                    required={required}
                    className={styles.input}
                    placeholder={text}
                    aria-label={text}
                  />
                </>
              )}
            </label>
          );
        })}

        <button
          type="submit"
          disabled={status === "submitting"}
          className={styles.submitButton}
        >
          {status === "submitting"
            ? "Skickar..."
            : config.submitLabel || DEFAULT_SUBMIT_LABEL}
        </button>

        {status === "success" && (
          <div className={styles.successMessage}>
            {config.successMessage || DEFAULT_SUCCESS_MESSAGE}
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
