export default function PageFrame({ eyebrow, title, intro, children, dark = false }) {
  return (
    <main className={dark ? "dark" : ""}>
      <section className={`page-frame${dark ? " dark" : ""}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title font-display">{title}</h1>
        {intro && <p className={`page-intro${dark ? " dark" : ""}`}>{intro}</p>}
        {children}
      </section>
    </main>
  );
}
