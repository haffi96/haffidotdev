import { Line, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  Color,
  CubicBezierCurve3,
  DoubleSide,
  Float32BufferAttribute,
  type Group,
  type InstancedMesh,
  MathUtils,
  type Mesh,
  Object3D,
  ShaderMaterial,
  Vector3
} from "three";
import type { SceneProps } from "../SceneBackdrop";
import { usePointer } from "./usePointer";

const RADIUS = 2;
const NEON = new Color("#3cf0ff");
const FLARE = new Color("#ff4fd8");

// Places tied to the story: UK roles plus the regions an AV fleet talks across.
const NODES: { name: string; lat: number; lon: number; hub?: boolean }[] = [
  { name: "Oxford", lat: 51.75, lon: -1.26, hub: true },
  { name: "London", lat: 51.5, lon: -0.12 },
  { name: "Leeds", lat: 53.8, lon: -1.55 },
  { name: "Frankfurt", lat: 50.1, lon: 8.7 },
  { name: "New York", lat: 40.7, lon: -74 },
  { name: "San Francisco", lat: 37.77, lon: -122.4 },
  { name: "Sao Paulo", lat: -23.5, lon: -46.6 },
  { name: "Lagos", lat: 6.5, lon: 3.4 },
  { name: "Mumbai", lat: 19, lon: 72.8 },
  { name: "Singapore", lat: 1.35, lon: 103.8 },
  { name: "Tokyo", lat: 35.7, lon: 139.7 },
  { name: "Sydney", lat: -33.9, lon: 151.2 },
  { name: "Reykjavik", lat: 64.1, lon: -21.9 }
];

const LINKS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 7],
  [0, 8],
  [0, 12],
  [3, 9],
  [4, 6],
  [8, 9],
  [9, 10],
  [10, 11],
  [5, 10],
  [3, 8]
];

function latLonToVector(lat: number, lon: number, radius: number) {
  const phi = MathUtils.degToRad(90 - lat);
  const theta = MathUtils.degToRad(lon + 180);
  return new Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
}

export default function HeroScene({ compact, reducedMotion, onReady }: SceneProps) {
  return (
    <Canvas
      dpr={compact ? [1, 1.5] : [1, 2]}
      frameloop={reducedMotion ? "demand" : "always"}
      camera={{ position: [0, 0, 6.5], fov: 45, near: 0.1, far: 200 }}
      gl={{ antialias: !compact, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      onCreated={() => onReady()}
    >
      <Globe compact={compact} reducedMotion={reducedMotion} />
      <Stars radius={60} depth={40} count={compact ? 500 : 1400} factor={3} saturation={0} fade speed={reducedMotion ? 0 : 0.4} />
    </Canvas>
  );
}

function Globe({ compact, reducedMotion }: Readonly<{ compact: boolean; reducedMotion: boolean }>) {
  const rig = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const autoRotation = useRef(0.9);
  const pointer = usePointer();
  const { size, camera } = useThree();

  useFrame((_state, delta) => {
    if (!rig.current || !spin.current) {
      return;
    }
    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 2);
    const aspect = size.width / size.height;
    const halfHeight = Math.tan(MathUtils.degToRad(22.5)) * 6.5;
    const halfWidth = halfHeight * aspect;
    const wide = aspect > 1.05;

    const scale = wide ? Math.min(0.86, (halfHeight * 0.66) / RADIUS) : Math.min(0.9, (halfWidth * 1.1) / RADIUS);
    const targetX = wide ? Math.min(halfWidth * 0.5, 2.8) - scroll * 0.5 : 0;
    const targetY = wide ? 0 : halfHeight * 0.16;
    const targetCameraZ = 6.5 + scroll * 1.4;
    const targetCameraY = -scroll * 0.6;

    if (!reducedMotion) {
      autoRotation.current += delta * 0.07;
    }

    // With reduced motion, snap straight to the target instead of easing.
    const step = Math.min(delta, 0.1);
    const approach = (current: number, target: number, lambda = 3) =>
      reducedMotion ? target : MathUtils.damp(current, target, lambda, step);

    rig.current.position.x = approach(rig.current.position.x, targetX);
    rig.current.position.y = approach(rig.current.position.y, targetY);
    rig.current.scale.setScalar(approach(rig.current.scale.x, scale));
    rig.current.rotation.x = approach(rig.current.rotation.x, 0.32 + pointer.current.y * 0.12 + scroll * 0.15);
    spin.current.rotation.y = approach(spin.current.rotation.y, autoRotation.current + pointer.current.x * 0.35 + scroll * 0.9, 4);

    camera.position.z = approach(camera.position.z, targetCameraZ);
    camera.position.y = approach(camera.position.y, targetCameraY);
    camera.lookAt(0, camera.position.y * 0.5, 0);
  });

  const nodes = useMemo(() => NODES.map((node) => ({ ...node, position: latLonToVector(node.lat, node.lon, RADIUS * 1.005) })), []);

  const arcs = useMemo(
    () =>
      LINKS.map(([from, to]) => {
        const start = nodes[from]!.position;
        const end = nodes[to]!.position;
        const lift = RADIUS + start.distanceTo(end) * 0.38;
        const control1 = start.clone().lerp(end, 0.25).normalize().multiplyScalar(lift);
        const control2 = start.clone().lerp(end, 0.75).normalize().multiplyScalar(lift);
        const curve = new CubicBezierCurve3(start, control1, control2, end);
        return { curve, points: curve.getPoints(56), hub: from === 0 };
      }),
    [nodes]
  );

  return (
    <group ref={rig}>
      <group ref={spin}>
        <mesh>
          <sphereGeometry args={[RADIUS * 0.985, 64, 64]} />
          <meshBasicMaterial color="#050b15" />
        </mesh>
        <DotShell count={compact ? 1400 : 2800} />
        <Graticule />
        {arcs.map((arc, index) => (
          <Line
            key={index}
            points={arc.points}
            color={arc.hub ? FLARE : NEON}
            lineWidth={compact ? 1 : 1.4}
            transparent
            opacity={arc.hub ? 0.55 : 0.35}
            depthWrite={false}
          />
        ))}
        <Packets curves={arcs.map((arc) => arc.curve)} perArc={compact ? 1 : 2} reducedMotion={reducedMotion} />
        {nodes.map((node) => (
          <NodeMarker key={node.name} position={node.position} hub={node.hub} reducedMotion={reducedMotion} />
        ))}
      </group>
      <Atmosphere />
    </group>
  );
}

function DotShell({ count }: Readonly<{ count: number }>) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let index = 0; index < count; index++) {
      const y = 1 - (index / (count - 1)) * 2;
      const ring = Math.sqrt(1 - y * y);
      const theta = golden * index;
      positions[index * 3] = Math.cos(theta) * ring * RADIUS;
      positions[index * 3 + 1] = y * RADIUS;
      positions[index * 3 + 2] = Math.sin(theta) * ring * RADIUS;
    }
    const buffer = new BufferGeometry();
    buffer.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return buffer;
  }, [count]);

  return (
    <points geometry={geometry}>
      <pointsMaterial color="#5fdcff" size={0.034} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

function Graticule() {
  const geometry = useMemo(() => {
    const vertices: number[] = [];
    const segments = 96;
    const r = RADIUS * 1.001;
    for (const lat of [-60, -30, 0, 30, 60]) {
      for (let index = 0; index < segments; index++) {
        const a = latLonToVector(lat, (index / segments) * 360, r);
        const b = latLonToVector(lat, ((index + 1) / segments) * 360, r);
        vertices.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    for (let lon = 0; lon < 360; lon += 30) {
      for (let index = 0; index < segments / 2; index++) {
        const a = latLonToVector(-90 + (index / (segments / 2)) * 180, lon, r);
        const b = latLonToVector(-90 + ((index + 1) / (segments / 2)) * 180, lon, r);
        vertices.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const buffer = new BufferGeometry();
    buffer.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    return buffer;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#3cf0ff" transparent opacity={0.07} depthWrite={false} />
    </lineSegments>
  );
}

function Packets({
  curves,
  perArc,
  reducedMotion
}: Readonly<{ curves: CubicBezierCurve3[]; perArc: number; reducedMotion: boolean }>) {
  const cores = useRef<InstancedMesh>(null);
  const halos = useRef<InstancedMesh>(null);
  const count = curves.length * perArc;
  const packets = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        curve: curves[index % curves.length]!,
        offset: (index * 0.618) % 1,
        speed: 0.12 + ((index * 37) % 10) / 60,
        color: index % 3 === 0 ? FLARE : NEON
      })),
    [count, curves]
  );
  const dummy = useMemo(() => new Object3D(), []);
  const point = useMemo(() => new Vector3(), []);

  useLayoutEffect(() => {
    packets.forEach((packet, index) => {
      cores.current?.setColorAt(index, packet.color);
      halos.current?.setColorAt(index, packet.color);
    });
    if (cores.current?.instanceColor) cores.current.instanceColor.needsUpdate = true;
    if (halos.current?.instanceColor) halos.current.instanceColor.needsUpdate = true;
  }, [packets]);

  useFrame((state) => {
    const time = reducedMotion ? 0 : state.clock.elapsedTime;
    packets.forEach((packet, index) => {
      const progress = (packet.offset + time * packet.speed) % 1;
      packet.curve.getPointAt(progress, point);
      const fade = Math.sin(progress * Math.PI);
      dummy.position.copy(point);
      dummy.scale.setScalar(0.028 * (0.4 + fade * 0.6));
      dummy.updateMatrix();
      cores.current?.setMatrixAt(index, dummy.matrix);
      dummy.scale.multiplyScalar(3.2);
      dummy.updateMatrix();
      halos.current?.setMatrixAt(index, dummy.matrix);
    });
    if (cores.current) cores.current.instanceMatrix.needsUpdate = true;
    if (halos.current) halos.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={cores} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={halos} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.22} blending={AdditiveBlending} depthWrite={false} />
      </instancedMesh>
    </>
  );
}

function NodeMarker({ position, hub, reducedMotion }: Readonly<{ position: Vector3; hub?: boolean; reducedMotion: boolean }>) {
  const ring = useRef<Mesh>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const color = hub ? FLARE : NEON;

  useLayoutEffect(() => {
    ring.current?.lookAt(position.clone().multiplyScalar(2));
  }, [position]);

  useFrame((state) => {
    if (!ring.current) {
      return;
    }
    const cycle = reducedMotion ? 0.4 : (state.clock.elapsedTime * 0.6 + phase) % 1;
    ring.current.scale.setScalar(1 + cycle * (hub ? 3 : 2));
    (ring.current.material as { opacity: number }).opacity = (1 - cycle) * 0.8;
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[hub ? 0.045 : 0.03, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.05, 0.062, 32]} />
        <meshBasicMaterial color={color} transparent depthWrite={false} side={DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Atmosphere() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { glowColor: { value: NEON } },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 glowColor;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            // Bright where the halo meets the globe, fading out to the rim.
            float facing = abs(dot(vNormal, vView));
            float intensity = pow(smoothstep(0.05, 0.6, facing), 2.2);
            gl_FragColor = vec4(glowColor, intensity * 0.26);
          }
        `,
        side: BackSide,
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false
      }),
    []
  );

  return (
    <mesh material={material} scale={1.12}>
      <sphereGeometry args={[RADIUS, 64, 64]} />
    </mesh>
  );
}
