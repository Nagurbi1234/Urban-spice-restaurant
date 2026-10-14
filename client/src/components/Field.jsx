export default function Field({ label, value, onChange, type = "text", required = false, dark = false, ...rest }) {
  return (
    <label className="field">
      <span className={`field-label${dark ? " dark" : ""}`}>{label}</span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`field-input${dark ? " dark" : ""}`}
        data-testid={`input-${label.toLowerCase().replaceAll(" ", "-")}`}
        {...rest}
      />
    </label>
  );
}
