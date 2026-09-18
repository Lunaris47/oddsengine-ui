import { useState } from "react";

/**
 * A labelled input with optional "?" help that expands in place.
 * Replaces the label + input boilerplate in every calculator.
 */
export default function Field({ label, help, value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <label className="field">
      <span className="field-label">
        {label}
        {help && (
          <button
            type="button"
            className="field-help-toggle"
            aria-expanded={open}
            aria-label={`Explain: ${label}`}
            onClick={() => setOpen(!open)}
          >
            ?
          </button>
        )}
      </span>

      {help && open && <span className="field-help-body">{help}</span>}

      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
