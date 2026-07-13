export default function BrandMark({
  title = "CipherLedger",
  subtitle = "Enterprise Blockchain Ecosystem",
  showText = true,
  size = "md",
  className = "",
  iconSrc = "/logo.png",
}) {
  const iconSize = size === "sm" ? "w-12 h-12" : size === "lg" ? "w-20 h-20" : "w-16 h-16";
  const titleClass = size === "sm" ? "text-base font-extrabold" : size === "lg" ? "text-2xl font-extrabold" : "text-lg font-extrabold";
  const subtitleClass = size === "sm" ? "text-[10px]" : "text-[11px]";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${iconSize} shrink-0 rounded-2xl bg-slate-950/95 border border-white/10 shadow-[0_0_24px_rgba(6,182,212,0.18)] overflow-hidden p-1`}>
        <img
          src={iconSrc}
          alt="CipherLedger logo"
          className="w-full h-full object-contain select-none pointer-events-none"
          loading="eager"
          draggable="false"
        />
      </div>

      {showText && (
        <div className="min-w-0 leading-tight">
          <div className={`${titleClass} font-bold tracking-[0.16em] text-slate-100 uppercase truncate`}>
            {title}
          </div>
          {subtitle ? (
            <div className={`${subtitleClass} mt-0.5 font-mono text-slate-500 uppercase tracking-[0.24em] truncate`}>
              {subtitle}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}