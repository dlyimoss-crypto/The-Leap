export function Step({
  label,
  children,
  lang,
}: {
  label: string;
  children: React.ReactNode;
  /** Language of the body text when it differs from the interface (an untranslated original). */
  lang?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-primary">
        {label}
      </p>
      <p lang={lang} className="whitespace-pre-line text-foreground">
        {children}
      </p>
    </div>
  );
}
