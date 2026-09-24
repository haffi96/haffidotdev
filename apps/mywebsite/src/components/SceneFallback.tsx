// Static, zero-JS stand-ins for the WebGL scenes. Rendered during SSR, while three.js
// loads, and permanently when WebGL is unavailable.

const meridians = [0.18, 0.42, 0.64, 0.84];
const parallels = [-0.66, -0.36, 0, 0.36, 0.66];

export function GlobeFallback() {
  return (
    <div className="absolute inset-0">
      <div className="absolute top-[42%] left-1/2 aspect-square w-[118vw] -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:left-[69%] md:h-[78vh] md:w-auto">
        <div className="absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgb(60_240_255/0.18),transparent_62%)]" />
        <svg viewBox="-110 -110 220 220" className="relative h-full w-full" fill="none">
          <defs>
            <radialGradient id="globe-fill" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#0f2233" />
              <stop offset="100%" stopColor="#04060b" />
            </radialGradient>
          </defs>
          <circle r="100" fill="url(#globe-fill)" stroke="rgb(60 240 255 / 0.45)" strokeWidth="0.6" />
          {meridians.map((scale) => (
            <ellipse key={scale} rx={100 * scale} ry="100" stroke="rgb(60 240 255 / 0.16)" strokeWidth="0.4" />
          ))}
          {parallels.map((offset) => {
            const half = Math.sqrt(1 - offset * offset) * 100;
            return (
              <ellipse key={offset} cy={offset * 100} rx={half} ry={half * 0.12} stroke="rgb(60 240 255 / 0.16)" strokeWidth="0.4" />
            );
          })}
          <path d="M-42 -38 Q -5 -95 48 -30" stroke="#ff4fd8" strokeOpacity="0.8" strokeWidth="0.8" />
          <path d="M-42 -38 Q -70 10 -20 52" stroke="#3cf0ff" strokeOpacity="0.7" strokeWidth="0.8" />
          <path d="M-42 -38 Q 30 -20 62 40" stroke="#3cf0ff" strokeOpacity="0.5" strokeWidth="0.6" />
          {[
            [-42, -38, "#ff4fd8"],
            [48, -30, "#3cf0ff"],
            [-20, 52, "#3cf0ff"],
            [62, 40, "#3cf0ff"]
          ].map(([cx, cy, color]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.2" fill={color as string} />
          ))}
        </svg>
      </div>
    </div>
  );
}

export function NetworkFallback() {
  return (
    <div className="absolute inset-0">
      <div className="bg-grid absolute inset-0" />
      <div className="absolute -top-40 left-1/2 h-[28rem] w-[60rem] max-w-[160vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(60_240_255/0.12),transparent_65%)]" />
      <div className="absolute top-20 -right-40 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgb(255_79_216/0.1),transparent_65%)]" />
    </div>
  );
}
