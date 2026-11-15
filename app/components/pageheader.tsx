// the title block at the top of every inner page
export default function PageHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="wrap pb-12 pt-14 lg:pb-16 lg:pt-20">
      <h1 className="max-w-4xl text-title animate-rise">{title}</h1>
      {children && (
        <div className="mt-6 max-w-2xl text-[1.25rem] leading-relaxed text-ink-soft animate-rise [animation-delay:100ms]">
          {children}
        </div>
      )}
    </header>
  );
}
