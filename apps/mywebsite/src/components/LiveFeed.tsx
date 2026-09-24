import { useEffect, useRef, useState } from "react";
import { clamp, seededRandom, useInView, useReducedMotion } from "../lib/hooks";
import { StatusDot } from "./Hud";
import { Sparkline } from "./Sparkline";

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
};

const LINKS: Record<LinkId, LinkProfile> = {
  fibre: { label: "Fibre", g2g: 128, rtt: 16, jitter: 2.2, bitrate: 8.4, loss: 0.02, ctrl: 21, spikeChance: 0.03, candidate: "host/udp" },
  "4g": { label: "4G", g2g: 168, rtt: 54, jitter: 10, bitrate: 4.6, loss: 0.6, ctrl: 39, spikeChance: 0.1, candidate: "srflx/udp" },
  starlink: { label: "Starlink", g2g: 150, rtt: 36, jitter: 6.5, bitrate: 6.2, loss: 0.25, ctrl: 31, spikeChance: 0.06, candidate: "srflx/udp" }
};

const LINK_IDS: LinkId[] = ["fibre", "4g", "starlink"];

type Stats = {
  g2g: number;
  rtt: number;
  jitter: number;
  bitrate: number;
  fps: number;
  loss: number;
  ctrl: number;
};

const HISTORY = 48;

function gaussian() {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

function nextStats(previous: Stats | null, profile: LinkProfile): { stats: Stats; spike: boolean } {
  const base = previous ?? {
    g2g: profile.g2g,
    rtt: profile.rtt,
    jitter: profile.jitter,
    bitrate: profile.bitrate,
    fps: 30,
    loss: profile.loss,
    ctrl: profile.ctrl
  };
  const spike = Math.random() < profile.spikeChance;
  const revert = (value: number, target: number, noise: number, rate = 0.3) => value + (target - value) * rate + gaussian() * noise;

  const g2g = clamp(revert(base.g2g, profile.g2g, profile.jitter * 1.4) + (spike ? 18 + Math.random() * 14 : 0), 104, 196);
  const rtt = clamp(revert(base.rtt, profile.rtt, profile.jitter * 0.8) + (spike ? 12 : 0), 6, 120);
  const jitter = clamp(revert(base.jitter, profile.jitter, profile.jitter * 0.25) + (spike ? profile.jitter * 0.8 : 0), 0.4, 40);
  const bitrate = clamp(revert(base.bitrate, profile.bitrate, 0.25) - (spike ? 0.9 : 0), 1.2, 12);
  const fps = spike && profile.spikeChance > 0.05 ? 27 + Math.round(Math.random() * 2) : Math.random() < 0.08 ? 29 : 30;
  const loss = clamp(revert(base.loss, profile.loss, profile.loss * 0.3 + 0.01) + (spike ? profile.loss + 0.3 : 0), 0, 3);
  const ctrl = clamp(revert(base.ctrl, profile.ctrl, profile.jitter * 0.5) + (spike ? 6 : 0), 8, 48);

  return { stats: { g2g, rtt, jitter, bitrate, fps, loss, ctrl }, spike };
}

const HANDSHAKE_STEPS = (profile: LinkProfile) => [
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

export function LiveFeed() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const glitchRef = useRef(0);
  const startRef = useRef(0);

  const inView = useInView(rootRef);
  const reducedMotion = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [link, setLink] = useState<LinkId>("fibre");
  const [step, setStep] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<number[]>(PLACEHOLDER_HISTORY);

  const profile = LINKS[link];
  const steps = HANDSHAKE_STEPS(profile);
  const live = mounted && step >= steps.length;

  useEffect(() => {
    startRef.current = performance.now();
    setMounted(true);
  }, []);

  // Handshake sequence: runs on load and whenever the link changes.
  useEffect(() => {
    if (!mounted) {
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
  }, [mounted, link, reducedMotion]);

  // Telemetry ticks. Slower under reduced motion; paused off-screen or before the link is live.
  useEffect(() => {
    if (!live || !inView) {
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
      if (timecodeRef.current && reducedMotion) {
        timecodeRef.current.textContent = formatTimecode(performance.now() - startRef.current);
      }
    };
    tick();
    const id = window.setInterval(tick, reducedMotion ? 2000 : 500);
    return () => window.clearInterval(id);
  }, [live, inView, profile, reducedMotion]);

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
    const skyline = Array.from({ length: 90 }, (_, index) => ({
      x: -60 + index * 1.35,
      h: 2 + skylineRandom() * (skylineRandom() > 0.7 ? 16 : 7)
    }));

    let frame = 0;
    let last = performance.now();
    let distance = 0;
    let oncomingZ = 70;

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
      const project = (x: number, y: number, z: number) => ({
        x: width / 2 + ((x - sway) / z) * k,
        y: horizon + ((camH - y) / z) * k
      });

      context.clearRect(0, 0, width, height);

      const sky = context.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, "#050807");
      sky.addColorStop(1, "#0b1a13");
      context.fillStyle = sky;
      context.fillRect(0, 0, width, horizon);
      context.fillStyle = "#040605";
      context.fillRect(0, horizon, width, height - horizon);

      // Distant skyline as sparse point columns.
      for (const building of skyline) {
        const z = 80;
        const base = project(building.x, 0, z);
        const top = project(building.x, building.h, z);
        context.fillStyle = "rgba(92, 242, 160, 0.16)";
        for (let y = base.y; y > top.y; y -= 3) {
          context.fillRect(base.x, y, 1, 1);
        }
      }

      context.strokeStyle = "rgba(92, 242, 160, 0.35)";
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
        const alpha = clamp(1 - z / 62, 0, 1) * 0.75;
        const size = clamp(2.2 - z / 22, 0.8, 2.2);
        for (let x = -12; x <= 12; x += 0.6) {
          const onRoad = x > -5.6 && x < 2;
          const p = project(x, 0, z);
          if (p.x < -2 || p.x > width + 2 || p.y > height + 2) {
            continue;
          }
          context.fillStyle = onRoad ? `rgba(92, 242, 160, ${alpha * 0.45})` : `rgba(92, 242, 160, ${alpha})`;
          context.fillRect(p.x, p.y, size, size);
        }
      }

      // Lane markings.
      const drawLine = (x: number, dashed: boolean) => {
        const dash = 2.2;
        const gap = 3.2;
        const cycle = dash + gap;
        const start = dashed ? -(distance % cycle) : 0;
        context.strokeStyle = "rgba(181, 249, 211, 0.75)";
        context.lineWidth = 1.2;
        context.beginPath();
        if (dashed) {
          for (let z = 1.4 + start; z < 70; z += cycle) {
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
          const alpha = clamp(1 - z / 70, 0, 1) * 0.8;
          context.fillStyle = `rgba(92, 242, 160, ${alpha})`;
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
        context.fillStyle = "rgba(92, 242, 160, 0.08)";
        context.fillRect(bl.x, tr.y, w, h);
        context.fillStyle = "rgba(92, 242, 160, 0.55)";
        const stepPx = Math.max(2, w / 10);
        for (let px = bl.x; px <= tr.x; px += stepPx) {
          for (let py = tr.y; py <= bl.y; py += stepPx) {
            context.fillRect(px, py, 1, 1);
          }
        }
        const pad = 4;
        const c = Math.max(4, Math.min(10, w * 0.25));
        context.strokeStyle = tone;
        context.lineWidth = 1;
        context.beginPath();
        const x0 = bl.x - pad;
        const y0 = tr.y - pad;
        const x1 = tr.x + pad;
        const y1 = bl.y + pad;
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
          context.font = "10px 'JetBrains Mono', ui-monospace, monospace";
          context.fillStyle = tone;
          context.fillText(`${label} ${z.toFixed(1)}m`, x0, labelBelow ? y1 + 12 : y0 - 4);
        }
      };
      drawVehicle(0.1, 13 + Math.sin(t * 0.4) * 3, "LEAD", "rgba(255, 181, 71, 0.9)");
      drawVehicle(-3.7, oncomingZ, "ONC", "rgba(92, 242, 160, 0.8)", true);

      // Brief packet-loss artefact after a network spike.
      const sinceGlitch = now - glitchRef.current;
      if (sinceGlitch < 180) {
        for (let i = 0; i < 3; i += 1) {
          const y = Math.random() * height;
          const h = 2 + Math.random() * 10;
          context.drawImage(canvas, 0, y * (canvas.height / height), canvas.width, h * (canvas.height / height), 8 + Math.random() * 16, y, width, h);
          context.fillStyle = "rgba(92, 242, 160, 0.06)";
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

    const running = inView && !reducedMotion;
    if (!running) {
      draw(performance.now());
      return () => observer.disconnect();
    }

    const loop = (now: number) => {
      if (!document.hidden) {
        draw(now);
      } else {
        last = now;
      }
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [mounted, inView, reducedMotion]);

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
    <div ref={rootRef} className="corners min-w-0 border border-line">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2 sm:px-4">
        <span className="hud-label truncate text-zinc-400">Cam_front · AV-07 · Remote assist</span>
        <span className="hud-label flex shrink-0 items-center gap-1.5 text-alert">
          <span aria-hidden="true" className={`inline-block size-1.5 rounded-full bg-alert ${live ? "animate-blink" : "opacity-30"}`} />
          Rec
        </span>
      </div>

      <div className="relative aspect-[16/11] overflow-hidden bg-[#040605] sm:aspect-[16/10]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full"
          role="img"
          aria-label="Simulated front camera feed of a road, rendered as a LiDAR-style point grid"
        />
        <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(0_0_0/0.55))]"
        />

        {/* HUD overlays */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2.5 font-mono text-[10px] tracking-wider text-phos-200 uppercase sm:p-3 sm:text-[11px]">
          <span className="flex items-center gap-1.5 bg-ink-950/60 px-1.5 py-0.5">
            <StatusDot tone={live ? "ok" : "warn"} />
            {live ? "Live" : "Negotiating"} · {profile.label}
          </span>
          <span ref={timecodeRef} className="bg-ink-950/60 px-1.5 py-0.5 tabular-nums">
            --:--:--:--
          </span>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 opacity-50">
          <span className="absolute top-0 left-0 h-2 w-2 border-t border-l border-phos-200" />
          <span className="absolute top-0 right-0 h-2 w-2 border-t border-r border-phos-200" />
          <span className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-phos-200" />
          <span className="absolute right-0 bottom-0 h-2 w-2 border-r border-b border-phos-200" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5 sm:p-3">
          <div className="bg-ink-950/65 px-2 py-1">
            <p className="font-mono text-[9px] tracking-[0.18em] text-zinc-400 uppercase sm:text-[10px]">Glass-to-glass</p>
            <p className="font-mono text-xl leading-tight text-phos tabular-nums sm:text-2xl">
              {fmt(stats?.g2g)}
              <span className="ml-1 text-xs text-zinc-400">ms</span>
            </p>
          </div>
          <p className="bg-ink-950/65 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-zinc-400 uppercase">
            WebRTC · UDP
          </p>
        </div>

        {/* Handshake overlay */}
        {!live ? (
          <div className="absolute inset-0 grid place-items-center bg-ink-950/70 p-4">
            <ol className="w-full max-w-xs space-y-1 font-mono text-[11px] sm:text-xs" aria-live="polite">
              {steps.map((item, index) => {
                const done = mounted && index < step;
                const active = mounted && index === step;
                return (
                  <li key={item.tag + item.text} className={`flex items-baseline gap-2 ${done || active ? "text-zinc-300" : "text-zinc-600"}`}>
                    <span className={`w-9 shrink-0 ${done ? "text-phos" : active ? "text-amber" : ""}`}>{item.tag}</span>
                    <span className="min-w-0 flex-1 truncate">{item.text}</span>
                    <span className={`shrink-0 ${done ? "text-phos" : "text-zinc-600"}`}>
                      {done ? item.result : active ? "…" : ""}
                    </span>
                  </li>
                );
              })}
              {!mounted ? <li className="pt-1 text-zinc-500">Awaiting signal</li> : null}
            </ol>
          </div>
        ) : null}
      </div>

      <div className="border-t border-line p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="hud-label">Transport link</span>
          <div role="group" aria-label="Simulated network link" className="flex border border-line-strong">
            {LINK_IDS.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={link === id}
                onClick={() => setLink(id)}
                className={`px-2.5 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-colors sm:px-3 ${
                  link === id ? "bg-phos text-ink-950" : "text-zinc-400 hover:bg-ink-800 hover:text-zinc-100"
                }`}
              >
                {LINKS[id].label}
              </button>
            ))}
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-3 border-t border-l border-line sm:grid-cols-6">
          {readouts.map((item) => (
            <div key={item.label} className="border-r border-b border-line px-2 py-2">
              <dt className="font-mono text-[9px] tracking-[0.16em] text-zinc-500 uppercase sm:text-[10px]">{item.label}</dt>
              <dd className="mt-0.5 font-mono text-sm text-zinc-100 tabular-nums">
                {item.value}
                <span className="ml-0.5 text-[10px] text-zinc-500">{item.unit}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <span className="hud-label">G2G latency · 24s</span>
            <span className="hud-label text-amber/80">200ms budget</span>
          </div>
          <Sparkline className="mt-1.5 h-10 w-full" values={history} min={100} max={210} threshold={200} />
        </div>
      </div>
    </div>
  );
}
