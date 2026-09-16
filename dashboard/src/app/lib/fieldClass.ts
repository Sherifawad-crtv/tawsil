/**
 * BoardUI's input recipe (base/input): a tertiary-filled control with a
 * transparent inset ring that turns accent on focus — no border. Every form
 * control shares it (text, textarea, select, file, search) so a form reads as
 * one set of fields rather than several.
 *
 * Toolbar controls are deliberately different: a filter Select outside a form
 * uses BoardUI's white button trigger, matching the buttons beside it.
 */
export const FIELD_BASE =
  "w-full h-9 rounded-2lg bg-grey-light text-body-regular text-navy ring-2 ring-inset ring-transparent transition-[background-color,box-shadow] duration-150 ease focus:outline-none focus:ring-blue focus:bg-white";

/** The standard field: base plus its own horizontal padding. */
export const FIELD_CLASS = `${FIELD_BASE} px-3 placeholder:text-muted`;

/** Label above a field. */
export const FIELD_LABEL_CLASS = "block text-body-2-semibold text-navy mb-1.5";
