import logoSvg from "../assets/logo.png";

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111111] relative">
      <div className="flex items-center justify-center flex-1 animate-fade-in">
        <img src={logoSvg} alt="" width={120} height={140} />
      </div>

      <div
        className="pb-12 flex flex-col items-center gap-1 animate-fade-up"
        style={{
          animationDelay: "200ms",
          animationFillMode: "both",
          opacity: 0,
        }}
      >
        <span className="font-display font-medium text-white text-4xl/6 tracking-tight">
          BrainBox
        </span>
        <span className="text-[#666] text-sm/6 font-body font-light">Version 1.0</span>
      </div>
    </div>
  );
}
