import type { ReactNode } from "react";

export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2
        id={`${id}-title`}
        className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--muted)]">
          {description}
        </p>
      )}
      <div className="mt-10">{children}</div>
    </section>
  );
}
