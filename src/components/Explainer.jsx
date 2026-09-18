/**
 * Collapsed-by-default explanation. Uses native <details> so it's
 * keyboard accessible with no JavaScript and costs one quiet line
 * of space when closed.
 */
export default function Explainer({ title = "How this works", children }) {
  return (
    <details className="explainer">
      <summary>{title}</summary>
      <div className="explainer-body">{children}</div>
    </details>
  );
}
