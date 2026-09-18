export function Step({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-primary">
        {label}
      </p>
      <p className="whitespace-pre-line text-foreground">{children}</p>
    </div>
  );
}
