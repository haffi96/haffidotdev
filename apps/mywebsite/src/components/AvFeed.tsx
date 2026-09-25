import { useEffect, useRef, useState } from "react";
import { clamp, seededRandom, useInView, usePageVisible, useReducedMotion } from "../lib/hooks";
import { Sparkline } from "./Sparkline";
import { Window } from "./Window";

/*
 * A simulated remote-assist camera feed. Real Oxa footage is confidential, so this is a
 * LiDAR-style road rendered on a canvas plus made-up (but realistic) WebRTC telemetry.
 *
 * SSR renders a static "awaiting signal" state; everything live starts after mount, so
 * there is nothing to mismatch during hydration. The animation pauses off-screen and in
 * hidden tabs, and reduced-motion visitors get a single still frame.
 */

type LinkId = "fibre" | "4g" | "starlink";

type LinkProfile = {
  label: string;
  g2g: number;
  rtt: number;
  jitter: number;
  bitrate: number;
  loss: number;
  ctrl: number;
  spikeChance: number;
  candidate: string;
  quip: string;
};

const LINKS: Record<LinkId, LinkProfile> = {
  fibre: {
    label: "Fibre",
    g2g: 128,
    rtt: 16,
    jitter: 2.2,
    bitrate: 8.4,
    loss: 0.02,
    ctrl: 21,
    spikeChance: 0.03,
    candidate: "host/udp",
    quip: "Fibre: smooth, boring, perfect."
  },
  "4g": {
    label: "4G",
    g2g: 168,
    rtt: 54,
    jitter: 10,
    bitrate: 4.6,
    loss: 0.6,
    ctrl: 39,
    spikeChance: 0.1,
    candidate: "srflx/udp",
    quip: "4G: someone nearby just started a video call."
  },
  starlink: {
    label: "Starlink",
    g2g: 150,
    rtt: 36,
    jitter: 6.5,
    bitrate: 6.2,
    loss: 0.25,
    ctrl: 31,
    spikeChance: 0.06,
    candidate: "srflx/udp",
    quip: "Starlink: routed via space, still under budget."
  }
};

const LINK_IDS: LinkId[] = ["fibre", "4g", "starlink"];

type Stats = { g2g: number; rtt: number; jitter: number; bitrate: number; fps: number; loss: number; ctrl: number };

const HISTORY = 48;

// Canvas palette: site accent colours on a navy "screen" that stays dark in both themes.
const SAND = "238, 239, 233";
const YELLOW = "247, 165, 1";
const BLUE = "124, 155, 255";
const RED = "245, 78, 0";

function gaussian() {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

function nextStats(previous: Stats | null, profile: LinkProfile): { stats: Stats; spike: boolean } {
  const base = previous ?? { g2g: profile.g2g, rtt: profile.rtt, jitter: profile.jitter, bitrate: profile.bitrate, fps: 30, loss: profile.loss, ctrl: profile.ctrl };
  const spike = Math.random() < profile.spikeChance;
  const revert = (value: number, target: number, noise: number, rate = 0.3) => value + (target - value) * rate + gaussian() * noise;

  const g2g = clamp(revert(base.g2g, profile.g2g, profile.jitter * 1.4) + (spike ? 18 + Math.random() * 14 : 0), 118, 192);
  const rtt = clamp(revert(base.rtt, profile.rtt, profile.jitter * 0.8) + (spike ? 12 : 0), 6, 120);
  const jitter = clamp(revert(base.jitter, profile.jitter, profile.jitter * 0.25) + (spike ? profile.jitter * 0.8 : 0), 0.4, 40);
  const bitrate = clamp(revert(base.bitrate, profile.bitrate, 0.25) - (spike ? 0.9 : 0), 1.2, 12);
  const fps = spike && profile.spikeChance > 0.05 ? 27 + Math.round(Math.random() * 2) : Math.random() < 0.08 ? 29 : 30;
  const loss = clamp(revert(base.loss, profile.loss, profile.loss * 0.3 + 0.01) + (spike ? profile.loss + 0.3 : 0), 0, 3);
  const ctrl = clamp(revert(base.ctrl, profile.ctrl, profile.jitter * 0.5) + (spike ? 6 : 0), 8, 48);

  return { stats: { g2g, rtt, jitter, bitrate, fps, loss, ctrl }, spike };
}

const handshakeSteps = (profile: LinkProfile) => [
  { tag: "ICE", text: "gathering candidates", result: "3 found" },
  { tag: "ICE", text: "connectivity checks", result: profile.candidate },
  { tag: "DTLS", text: "handshake", result: "1.2 ok" },
  { tag: "SRTP", text: "keys derived", result: "AES_CM_128" },
  { tag: "RTP", text: "H.264 720p30 track", result: "live" }
];

function formatTimecode(ms: number) {
  const totalFrames = Math.floor(ms / (1000 / 30));
  const frames = totalFrames % 30;
  const totalSeconds = Math.floor(ms / 1000);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(Math.floor(totalSeconds / 3600))}:${pad(Math.floor(totalSeconds / 60) % 60)}:${pad(totalSeconds % 60)}:${pad(frames)}`;
}

// Initial placeholder series, identical on server and client.
const PLACEHOLDER_HISTORY = (() => {
  const random = seededRandom(7);
  return Array.from({ length: HISTORY }, () => 128 + (random() - 0.5) * 10);
})();

export function AvFeed() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const glitchRef = useRef(0);
  const startRef = useRef(0);

  const inView = useInView(rootRef);
  const pageVisible = usePageVisible();
  const reducedMotion = useReducedMotion();
  const running = inView && pageVisible;

  const [mounted, setMounted] = useState(false);
  const [link, setLink] = useState<LinkId>("fibre");
  const [step, setStep] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<number[]>(PLACEHOLDER_HISTORY);

  const profile = LINKS[link];
  const steps = handshakeSteps(profile);
  const live = mounted && step >= steps.length;

  useEffect(() => {
    startRef.current = performance.now();
    setMounted(true);
  }, []);

  // Handshake sequence: runs once the feed is first on screen, and again whenever the link changes.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (mounted && inView) {
      setArmed(true);
    }
  }, [mounted, inView]);

  useEffect(() => {
    if (!armed) {
      return;
    }
    if (reducedMotion) {
      setStep(steps.length);
      return;
    }
    setStep(0);
    let current = 0;
    const id = window.setInterval(() => {
      current += 1;
      setStep(current);
      if (current >= steps.length) {
        window.clearInterval(id);
      }
    }, 380);
    return () => window.clearInterval(id);
  }, [armed, link, reducedMotion, steps.length]);

  // Telemetry ticks every 500ms. Paused off-screen, in hidden tabs and before the link is live.
  // Reduced motion gets a single reading instead of a ticking one.
  useEffect(() => {
    if (!live || (!running && !reducedMotion)) {
      return;
    }
    let previous: Stats | null = null;
    const tick = () => {
      const { stats: next, spike } = nextStats(previous, profile);
      previous = next;
      if (spike) {
        glitchRef.current = performance.now();
      }
      setStats(next);
      setHistory((current) => [...current.slice(1), next.g2g]);
    };
    tick();
    if (reducedMotion) {
      return;
    }
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [live, running, profile, reducedMotion]);

  // Canvas renderer.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mounted) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const skylineRandom = seededRandom(42);
    const skyline = Array.from({ length: 90 }, (_, index) => ({ x: -60 + index * 1.35, h: 2 + skylineRandom() * (skylineRandom() > 0.7 ? 16 : 7) }));

    let frame = 0;
    let last = performance.now();
    // Start a little way down the road so the still (reduced-motion) frame looks mid-drive.
    let distance = 7;
    let oncomingZ = 26;

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      distance += dt * 13;
      oncomingZ -= dt * 24;
      if (oncomingZ < 1.5) {
        oncomingZ = 70 + Math.random() * 40;
      }

      const t = (now - startRef.current) / 1000;
      const horizon = height * 0.4;
      const k = Math.max(width * 0.75, (height - horizon) * 1.6);
      const camH = 1.5;
      const sway = Math.sin(t * 0.35) * 0.18;
      const project = (x: number, y: number, z: number) => ({ x: width / 2 + ((x - sway) / z) * k, y: horizon + ((camH - y) / z) * k });

      context.clearRect(0, 0, width, height);

      const sky = context.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, `rgba(${BLUE}, 0)`);
      sky.addColorStop(1, `rgba(${BLUE}, 0.12)`);
      context.fillStyle = sky;
      context.fillRect(0, 0, width, horizon);

      // Distant skyline as sparse point columns.
      for (const building of skyline) {
        const base = project(building.x, 0, 80);
        const top = project(building.x, building.h, 80);
        context.fillStyle = `rgba(${BLUE}, 0.3)`;
        for (let y = base.y; y > top.y; y -= 3) {
          context.fillRect(base.x, y, 1, 1);
        }
      }

      context.strokeStyle = `rgba(${SAND}, 0.3)`;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, horizon + 0.5);
      context.lineTo(width, horizon + 0.5);
      context.stroke();

      // LiDAR-like ground grid, scrolling toward the camera.
      const spacing = 1.4;
      const offset = distance % spacing;
      for (let zi = 0; zi < 44; zi += 1) {
        const z = 1.6 + zi * spacing - offset;
        if (z <= 1.2) {
          continue;
        }
        const alpha = clamp(1 - z / 62, 0, 1) * 0.7;
        const size = clamp(2.2 - z / 22, 0.8, 2.2);
        for (let x = -12; x <= 12; x += 0.6) {
          const onRoad = x > -5.6 && x < 2;
          const p = project(x, 0, z);
          if (p.x < -2 || p.x > width + 2 || p.y > height + 2) {
            continue;
          }
          context.fillStyle = onRoad ? `rgba(${SAND}, ${alpha * 0.4})` : `rgba(${SAND}, ${alpha})`;
          context.fillRect(p.x, p.y, size, size);
        }
      }

      // Lane markings.
      const drawLine = (x: number, dashed: boolean) => {
        const dash = 2.2;
        const cycle = dash + 3.2;
        context.strokeStyle = `rgba(${YELLOW}, 0.85)`;
        context.lineWidth = 1.4;
        context.beginPath();
        if (dashed) {
          for (let z = 1.4 - (distance % cycle); z < 70; z += cycle) {
            const z0 = Math.max(1.3, z);
            const z1 = z + dash;
            if (z1 <= 1.3) {
              continue;
            }
            const a = project(x, 0, z0);
            const b = project(x, 0, z1);
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
          }
        } else {
          const a = project(x, 0, 1.3);
          const b = project(x, 0, 90);
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
        }
        context.stroke();
      };
      drawLine(2, false);
      drawLine(-1.8, true);
      drawLine(-5.6, false);

      // Roadside poles as vertical point columns.
      const poleSpacing = 9;
      const poleOffset = distance % poleSpacing;
      for (let i = 0; i < 8; i += 1) {
        const z = 3 + i * poleSpacing - poleOffset;
        if (z < 1.6 || z > 48) {
          continue;
        }
        for (const side of [4.2, -8]) {
          context.fillStyle = `rgba(${SAND}, ${clamp(1 - z / 70, 0, 1) * 0.8})`;
          for (let y = 0; y < 4.5; y += 0.28) {
            const p = project(side, y, z);
            context.fillRect(p.x, p.y, 1.4, 1.4);
          }
        }
      }

      // Tracked objects: lead vehicle and oncoming traffic.
      const drawVehicle = (x: number, z: number, label: string, tone: string, labelBelow = false) => {
        if (z < 2 || z > 80) {
          return;
        }
        const bl = project(x - 0.9, 0, z);
        const tr = project(x + 0.9, 1.5, z);
        const w = tr.x - bl.x;
        const h = bl.y - tr.y;
        context.fillStyle = `rgba(${SAND}, 0.06)`;
        context.fillRect(bl.x, tr.y, w, h);
        context.fillStyle = `rgba(${SAND}, 0.55)`;
        const stepPx = Math.max(2, w / 10);
        for (let px = bl.x; px <= tr.x; px += stepPx) {
          for (let py = tr.y; py <= bl.y; py += stepPx) {
            context.fillRect(px, py, 1, 1);
          }
        }
        const pad = 4;
        const c = Math.max(4, Math.min(10, w * 0.25));
        const x0 = bl.x - pad;
        const y0 = tr.y - pad;
        const x1 = tr.x + pad;
        const y1 = bl.y + pad;
        context.strokeStyle = tone;
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(x0, y0 + c);
        context.lineTo(x0, y0);
        context.lineTo(x0 + c, y0);
        context.moveTo(x1 - c, y0);
        context.lineTo(x1, y0);
        context.lineTo(x1, y0 + c);
        context.moveTo(x1, y1 - c);
        context.lineTo(x1, y1);
        context.lineTo(x1 - c, y1);
        context.moveTo(x0 + c, y1);
        context.lineTo(x0, y1);
        context.lineTo(x0, y1 - c);
        context.stroke();
        if (width > 280 && z < 42) {
          context.font = "600 10px 'IBM Plex Mono', ui-monospace, monospace";
          context.fillStyle = tone;
          context.fillText(`${label} ${z.toFixed(1)}m`, x0, labelBelow ? y1 + 12 : y0 - 4);
        }
      };
      drawVehicle(0.1, 13 + Math.sin(t * 0.4) * 3, "LEAD", `rgba(${RED}, 0.95)`);
      drawVehicle(-3.7, oncomingZ, "ONC", `rgba(${BLUE}, 0.95)`, true);

      // Brief packet-loss artefact after a network spike.
      if (now - glitchRef.current < 180) {
        for (let i = 0; i < 3; i += 1) {
          const y = Math.random() * height;
          const h = 2 + Math.random() * 10;
          context.drawImage(canvas, 0, y * (canvas.height / height), canvas.width, h * (canvas.height / height), 8 + Math.random() * 16, y, width, h);
          context.fillStyle = `rgba(${YELLOW}, 0.08)`;
          context.fillRect(0, y, width, h);
        }
      }

      if (timecodeRef.current) {
        timecodeRef.current.textContent = formatTimecode(now - startRef.current);
      }
    };

    const observer = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    observer.observe(canvas);

    if (!running || reducedMotion) {
      draw(performance.now());
      return () => observer.disconnect();
    }

    const loop = (now: number) => {
      draw(now);
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [mounted, running, reducedMotion]);

  const fmt = (value: number | undefined, digits = 0) => (value === undefined || !live ? "--" : value.toFixed(digits));
  const readouts = [
    { label: "RTT", value: fmt(stats?.rtt), unit: "ms" },
    { label: "Jitter", value: fmt(stats?.jitter, 1), unit: "ms" },
    { label: "Bitrate", value: fmt(stats?.bitrate, 1), unit: "Mb/s" },
    { label: "FPS", value: fmt(stats?.fps), unit: "" },
    { label: "Loss", value: fmt(stats?.loss, 2), unit: "%" },
    { label: "Ctrl", value: fmt(stats?.ctrl), unit: "ms" }
  ];

  return (
    <Window title="av_feed.exe" accent="green" bodyClassName="p-0" labelledBy="feed-heading">
      <div ref={rootRef} className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        {/* The "screen". Stays dark in both themes, like a real monitor. */}
        <div className="relative aspect-[16/11] min-w-0 overflow-hidden border-b-[1.5px] border-edge bg-[#1d1f27] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[400px] lg:border-r-[1.5px] lg:border-b-0 dark:bg-[#111218]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 size-full"
            role="img"
            aria-label="Simulated front camera feed of a road, rendered as a LiDAR-style point grid with a tracked lead vehicle"
          />
          <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(0_0_0/0.5))]" />

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2.5 font-mono text-[10px] font-semibold tracking-wider text-[#eeefe9] uppercase sm:p-3 sm:text-[11px]">
            <span className="flex min-w-0 items-center gap-1.5 rounded bg-black/55 px-1.5 py-0.5">
              <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${live ? "bg-hm-green" : "bg-hm-yellow"}`} />
              <span className="truncate">
                {live ? "Live" : "Negotiating"} · {profile.label} · Cam_front AV-07
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2 rounded bg-black/55 px-1.5 py-0.5">
              <span className="flex items-center gap-1 text-[#ff8a57]">
                <span aria-hidden="true" className={`inline-block size-1.5 rounded-full bg-hm-red ${live ? "animate-blink" : "opacity-40"}`} />
                Rec
              </span>
              <span ref={timecodeRef} className="hidden tabular-nums min-[420px]:inline">
                --:--:--:--
              </span>
            </span>
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 opacity-60">
            <span className="absolute top-0 left-0 size-2 border-t-[1.5px] border-l-[1.5px] border-hm-yellow" />
            <span className="absolute top-0 right-0 size-2 border-t-[1.5px] border-r-[1.5px] border-hm-yellow" />
            <span className="absolute bottom-0 left-0 size-2 border-b-[1.5px] border-l-[1.5px] border-hm-yellow" />
            <span className="absolute right-0 bottom-0 size-2 border-r-[1.5px] border-b-[1.5px] border-hm-yellow" />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5 sm:p-3">
            <div className="rounded bg-black/60 px-2 py-1">
              <p className="font-mono text-[9px] tracking-[0.16em] text-[#c9cbc0] uppercase sm:text-[10px]">Glass-to-glass</p>
              <p className="font-mono text-xl leading-tight font-semibold text-hm-yellow tabular-nums sm:text-2xl">
                {fmt(stats?.g2g)}
                <span className="ml-1 text-xs font-normal text-[#c9cbc0]">ms</span>
              </p>
            </div>
            <p className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-[#c9cbc0] uppercase">WebRTC · UDP</p>
          </div>

          {!live ? (
            <div className="absolute inset-0 grid place-items-center bg-[#16171d]/75 p-4">
              <ol className="w-full max-w-[17rem] space-y-1 font-mono text-[11px] sm:text-xs" aria-live="polite">
                {steps.map((item, index) => {
                  const done = armed && index < step;
                  const active = armed && index === step;
                  return (
                    <li key={item.tag + item.text} className={`flex items-baseline gap-2 ${done || active ? "text-[#eeefe9]" : "text-[#6b6e7a]"}`}>
                      <span className={`w-9 shrink-0 font-semibold ${done ? "text-hm-green" : active ? "text-hm-yellow" : ""}`}>{item.tag}</span>
                      <span className="min-w-0 flex-1 truncate">{item.text}</span>
                      <span className={`shrink-0 ${done ? "text-hm-green" : ""}`}>{done ? item.result : active ? "…" : ""}</span>
                    </li>
                  );
                })}
                {!armed ? <li className="pt-1 text-[#a2a49a]">Awaiting signal (and permission from legal)</li> : null}
              </ol>
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col p-4 sm:p-5">
          <p className="font-mono text-xs font-semibold tracking-wider text-hm-red uppercase">Day job, dramatised</p>
          <h2 id="feed-heading" className="mt-1 text-2xl leading-tight font-bold tracking-tight text-ink">
            Driving a car from a long way away
          </h2>
          <p className="mt-2 text-[0.95rem] text-body">
            Roughly what a remote operator sees. The real feed is confidential, so this one is drawn live in your browser. The
            latency budget is real, though.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Transport link</span>
            <div role="group" aria-label="Simulated network link" className="flex gap-1.5">
              {LINK_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={link === id}
                  onClick={() => setLink(id)}
                  className={`btn-3d px-2.5 py-1 font-mono text-[0.7rem] tracking-wider uppercase ${link === id ? "btn-orange" : "btn-plain"}`}
                >
                  {LINKS[id].label}
                </button>
              ))}
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-3 overflow-hidden rounded-md border-[1.5px] border-edge">
            {readouts.map((item, index) => (
              <div
                key={item.label}
                className={`bg-desk px-2.5 py-2 ${index % 3 !== 2 ? "border-r-[1.5px] border-dashed border-line" : ""} ${index < 3 ? "border-b-[1.5px] border-dashed border-line" : ""}`}
              >
                <dt className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">{item.label}</dt>
                <dd className="mt-0.5 font-mono text-sm font-semibold text-ink tabular-nums">
                  {item.value}
                  <span className="ml-0.5 text-[10px] font-normal text-muted">{item.unit}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4">
            <div className="flex items-center justify-between font-mono text-[10px] font-semibold tracking-wider uppercase">
              <span className="text-muted">G2G latency · last 24s</span>
            </div>
            <Sparkline className="mt-1.5 h-12 w-full" values={history} min={100} max={210} />
          </div>

          <p className="mt-auto pt-4 font-mono text-xs text-muted">{live ? profile.quip : "Not actual footage. No cars were harmed."}</p>
        </div>
      </div>
    </Window>
  );
}
