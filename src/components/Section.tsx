type Props = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: Props) {
  return (
    <section id={id} className="py-20 md:py-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10 md:mb-14">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
            {eyebrow}
          </div>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-2xl text-[color:var(--muted)] leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
