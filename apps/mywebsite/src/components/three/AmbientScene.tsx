import { Canvas, useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  type Group,
  type InstancedMesh,
  MathUtils,
  Object3D,
  Vector3
} from "three";
import type { SceneProps } from "../SceneBackdrop";
import { usePointer } from "./usePointer";

/** A light-weight drifting network graph used behind the list pages. */
export default function AmbientScene({ compact, reducedMotion, onReady }: SceneProps) {
  return (
    <Canvas
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      frameloop={reducedMotion ? "demand" : "always"}
      camera={{ position: [0, 0, 9], fov: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      style={{ pointerEvents: "none" }}
      onCreated={() => onReady()}
    >
      <Network count={compact ? 46 : 90} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function Network({ count, reducedMotion }: Readonly<{ count: number; reducedMotion: boolean }>) {
  const group = useRef<Group>(null);
  const packetsRef = useRef<InstancedMesh>(null);
  const pointer = usePointer();

  const { points, edges, pointGeometry, edgeGeometry } = useMemo(() => {
    const random = seeded(7);
    const nodes = Array.from(
      { length: count },
      () => new Vector3((random() - 0.5) * 16, (random() - 0.5) * 9, (random() - 0.5) * 6)
    );
    const pairs: [Vector3, Vector3][] = [];
    const vertices: number[] = [];
    nodes.forEach((a, i) => {
      nodes.slice(i + 1).forEach((b) => {
        if (a.distanceTo(b) < 2.6) {
          pairs.push([a, b]);
          vertices.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      });
    });
    const pointBuffer = new BufferGeometry();
    pointBuffer.setAttribute("position", new Float32BufferAttribute(nodes.flatMap((node) => [node.x, node.y, node.z]), 3));
    const edgeBuffer = new BufferGeometry();
    edgeBuffer.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    return { points: nodes, edges: pairs, pointGeometry: pointBuffer, edgeGeometry: edgeBuffer };
  }, [count]);

  const packetCount = Math.min(edges.length, Math.round(points.length / 4));
  const packets = useMemo(
    () =>
      Array.from({ length: packetCount }, (_, index) => ({
        edge: edges[(index * 7) % edges.length]!,
        offset: (index * 0.37) % 1,
        speed: 0.15 + (index % 5) * 0.05
      })),
    [edges, packetCount]
  );
  const dummy = useMemo(() => new Object3D(), []);

  useLayoutEffect(() => {
    const neon = new Color("#3cf0ff");
    const flare = new Color("#ff4fd8");
    packets.forEach((_packet, index) => packetsRef.current?.setColorAt(index, index % 3 === 0 ? flare : neon));
    if (packetsRef.current?.instanceColor) packetsRef.current.instanceColor.needsUpdate = true;
  }, [packets]);

  useFrame((state, delta) => {
    const time = reducedMotion ? 0 : state.clock.elapsedTime;
    if (group.current) {
      const step = Math.min(delta, 0.1);
      group.current.rotation.y = MathUtils.damp(group.current.rotation.y, time * 0.02 + pointer.current.x * 0.12, 2, step);
      group.current.rotation.x = MathUtils.damp(group.current.rotation.x, pointer.current.y * 0.08, 2, step);
    }
    packets.forEach((packet, index) => {
      const progress = (packet.offset + time * packet.speed) % 1;
      dummy.position.lerpVectors(packet.edge[0], packet.edge[1], progress);
      dummy.scale.setScalar(0.05 * Math.sin(progress * Math.PI) + 0.01);
      dummy.updateMatrix();
      packetsRef.current?.setMatrixAt(index, dummy.matrix);
    });
    if (packetsRef.current) packetsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color="#3cf0ff" transparent opacity={0.1} blending={AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <points geometry={pointGeometry}>
        <pointsMaterial color="#8feeff" size={0.07} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
      </points>
      <instancedMesh ref={packetsRef} args={[undefined, undefined, packetCount]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
