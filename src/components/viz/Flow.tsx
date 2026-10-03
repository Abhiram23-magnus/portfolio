/** Responsive data-flow diagram: boxes joined by links with a travelling signal dot. */
export default function Flow({
  nodes,
  label,
  keepHorizontal = false,
  className = "",
}: {
  nodes: string[];
  label: string;
  keepHorizontal?: boolean;
  className?: string;
}) {
  return (
    <ol
      className={`flow ${keepHorizontal ? "keep-h" : ""} ${className}`}
      aria-label={label}
      style={{ listStyle: "none", margin: 0, padding: 0 }}
    >
      {nodes.flatMap((n, i) => {
        const items = [
          <li key={`n${i}`} className="flow-node">
            {n}
          </li>,
        ];
        if (i < nodes.length - 1) {
          items.push(
            <li
              key={`l${i}`}
              aria-hidden="true"
              className="flow-link"
              style={{ ["--d" as string]: `${i * 0.25}s` }}
            />,
          );
        }
        return items;
      })}
    </ol>
  );
}
