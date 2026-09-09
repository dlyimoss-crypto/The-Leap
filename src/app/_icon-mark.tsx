// Shared visual for the generated app icons (apple-icon, icon-192/512 for
// the manifest). Kept out of routing via the `_` prefix.
export function IconMark({ mark }: { mark: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1c1a18",
      }}
    >
      <svg width={mark} height={(mark * 160) / 240} viewBox="0 0 240 160">
        <path fill="#FF7A00" d="M15 10h62l72 62-72 62H15l72-62-72-62z" />
        <path fill="#7A7A7A" d="M91 10h62l72 62-72 62H91l72-62-72-62z" />
      </svg>
    </div>
  );
}
