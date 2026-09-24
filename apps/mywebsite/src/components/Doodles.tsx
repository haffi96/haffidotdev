type DoodleProps = Readonly<{ className?: string }>;

/** Hand-drawn style sketch: a latency line nose-diving under the 200ms bar. Decorative only. */
export function LatencyDoodle({ className = "" }: DoodleProps) {
  return (
    <svg className={className} viewBox="0 0 260 150" fill="none" aria-hidden="true">
      <path d="M22 12v112h226" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 96h222" stroke="#1d4aff" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" />
      <text x="206" y="90" fill="#1d4aff" fontSize="11" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
        200ms
      </text>
      <path
        d="M28 30c14-6 20 10 32 4s14-18 28-10 10 22 24 20 16-8 26 6 12 44 24 50 22-2 34 0 18 6 28 4"
        stroke="#f54e00"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="244" cy="104" r="5" fill="#f7a501" stroke="currentColor" strokeWidth="2" />
      <path d="M150 20c10-4 26-4 34 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m180 18 5 6-7 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <text x="96" y="16" fill="currentColor" fontSize="11" fontFamily="IBM Plex Mono, monospace">
        before coffee
      </text>
      <text x="170" y="142" fill="currentColor" fontSize="11" fontFamily="IBM Plex Mono, monospace">
        after WebRTC
      </text>
    </svg>
  );
}

/** A little server with sunglasses, unbothered by traffic spikes. */
export function ChillServerDoodle({ className = "" }: DoodleProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect x="26" y="18" width="68" height="84" rx="6" fill="#eb9d2a" stroke="#151515" strokeWidth="2.5" />
      <path d="M26 46h68M26 74h68" stroke="#151515" strokeWidth="2.5" />
      <circle cx="80" cy="88" r="3.5" fill="#6aa84f" stroke="#151515" strokeWidth="1.5" />
      <circle cx="80" cy="60" r="3.5" fill="#6aa84f" stroke="#151515" strokeWidth="1.5" />
      <path d="M34 30h14a4 4 0 0 1-4 6h-6a4 4 0 0 1-4-6zm20 0h14a4 4 0 0 1-4 6h-6a4 4 0 0 1-4-6z" fill="#151515" />
      <path d="M48 31h6" stroke="#151515" strokeWidth="2" />
      <path d="M44 40c4 3 10 3 14 0" stroke="#151515" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 30c6 2 10 8 10 14M104 22c10 4 14 12 14 22" stroke="#1d4aff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 108h92" stroke="#151515" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
