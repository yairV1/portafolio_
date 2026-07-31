/** Fallback estático del avatar (sin WebGL / prefers-reduced-motion). */
export function AvatarStaticFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-accent-border bg-gradient-to-br from-[#1a1330] via-[#221a3d] to-[#140f24] shadow-2xl">
        <div className="absolute inset-3 rounded-full border border-white/5" />
        <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-accent-soft">
          <div className="h-3 w-16 rounded-full bg-accent shadow-[0_0_16px_rgba(168,85,247,0.7)]" />
        </div>
      </div>
    </div>
  );
}
