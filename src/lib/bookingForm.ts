/**
 * The booking form is configured in Sanity (contactSection.fields). This
 * module is shared by the form component, the /api/contact route and the
 * schema, so the field kinds and the default form stay in one place.
 */

export type FormInputKind = "name" | "email" | "tel" | "date" | "text" | "textarea";

export type BookingFormInput = {
  _key: string;
  _type: "formInput";
  label: string;
  kind: FormInputKind;
  required?: boolean;
};

export type BookingFormCheckbox = {
  _key: string;
  _type: "formCheckbox";
  label: string;
  required?: boolean;
};

export type BookingFormField = BookingFormInput | BookingFormCheckbox;

export type BookingFormConfig = {
  fields: BookingFormField[];
  submitLabel?: string;
  successMessage?: string;
};

export const FORM_INPUT_KINDS: { title: string; value: FormInputKind }[] = [
  { title: "Namn", value: "name" },
  { title: "E-post", value: "email" },
  { title: "Telefon", value: "tel" },
  { title: "Datum (kalender)", value: "date" },
  { title: "Kort text", value: "text" },
  { title: "Lång text", value: "textarea" },
];

export const HTML_INPUT_TYPE: Record<FormInputKind, string> = {
  name: "text",
  email: "email",
  tel: "tel",
  date: "date",
  text: "text",
  textarea: "text",
};

/**
 * A field is required if its "Obligatoriskt" box is ticked OR its text
 * ends with "*" — editors tend to just type the asterisk. Used by both the
 * form (the `required` attribute) and /api/contact (server-side check), so
 * the two can't disagree.
 */
export function isRequired(field: Pick<BookingFormField, "label" | "required">): boolean {
  return field.required === true || /\*\s*$/.test(field.label ?? "");
}

/** The field's text without a trailing "*" — for emails and error messages. */
export function plainLabel(field: Pick<BookingFormField, "label">): string {
  return (field.label ?? "").replace(/\s*\*\s*$/, "");
}

/** The text shown on the form: the plain text plus one " *" when required. */
export function displayLabel(field: Pick<BookingFormField, "label" | "required">): string {
  return `${plainLabel(field)}${isRequired(field) ? " *" : ""}`;
}

export const DEFAULT_SUBMIT_LABEL = "Skicka";
export const DEFAULT_SUCCESS_MESSAGE = "Tack! Ditt meddelande har skickats.";

/** The form as it was hard-coded before it became editable. */
export const DEFAULT_FORM_FIELDS: BookingFormField[] = [
  { _key: "name", _type: "formInput", label: "Namn", kind: "name", required: true },
  { _key: "email", _type: "formInput", label: "E-postadress", kind: "email", required: true },
  { _key: "tel", _type: "formInput", label: "Telefonnummer", kind: "tel" },
  { _key: "date", _type: "formInput", label: "Datum för eventet", kind: "text", required: true },
  { _key: "place", _type: "formInput", label: "Plats för eventet (stad/region)", kind: "text", required: true },
  { _key: "music", _type: "formInput", label: "Önskad låt eller musikstil", kind: "text" },
  {
    _key: "info",
    _type: "formCheckbox",
    label: "Jag samtycker till att SMG kontaktar mig med information om framtida spelningar och erbjudanden",
  },
];
