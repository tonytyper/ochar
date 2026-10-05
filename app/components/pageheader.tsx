// the title block at the top of every inner page
export default function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="wrap pb-12 pt-14 lg:pb-16 lg:pt-24">
      <p className="eyebrow animate-rise">{eyebrow}</p>
      <h1 className="mt-4 max-w-4xl text-title animate-rise [animation-delay:80ms]">
        {title}
      </h1>
      {children && (
        <div className="mt-6 max-w-2xl text-[1.25rem] leading-relaxed text-ink-soft animate-rise [animation-delay:160ms]">
          {children}
        </div>
      )}
    </header>
  );
}
