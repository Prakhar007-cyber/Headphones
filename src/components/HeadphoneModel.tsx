"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type HeadphoneVariant = "hero" | "story" | "finale";

interface HeadphoneModelProps {
  variant: HeadphoneVariant;
  /** 0..1 scroll progress, only read for the "story" variant */
  progressRef?: RefObject<number>;
  /** accumulated drag rotation in radians, written by the canvas wrapper */
  dragRef?: RefObject<number>;
}

/* Keyframed poses for the pinned product story: [yaw, pitch, scale] */
const STORY_POSES: [number, number, number][] = [
  [-0.55, 0.06, 1.0], // three-quarter view — spatial audio
  [-1.35, 0.0, 1.06], // side profile — ANC
  [-0.75, -0.32, 1.24], // low close angle — deep bass
  [1.05, 0.08, 1.06], // opposite side — battery
  [-0.3, 0.02, 1.0], // hero pose — calls
];

const BASE_POSE: Record<HeadphoneVariant, [number, number]> = {
  hero: [-0.45, 0.05],
  story: [-0.55, 0.06],
  finale: [0.42, -0.02],
};

function lerpPose(p: number): [number, number, number] {
  const t = THREE.MathUtils.clamp(p, 0, 1) * (STORY_POSES.length - 1);
  const i = Math.min(Math.floor(t), STORY_POSES.length - 2);
  const f = THREE.MathUtils.smoothstep(t - i, 0, 1);
  const a = STORY_POSES[i];
  const b = STORY_POSES[i + 1];
  return [
    THREE.MathUtils.lerp(a[0], b[0], f),
    THREE.MathUtils.lerp(a[1], b[1], f),
    THREE.MathUtils.lerp(a[2], b[2], f),
  ];
}

export default function HeadphoneModel({ variant, progressRef, dragRef }: HeadphoneModelProps) {
  const group = useRef<THREE.Group>(null);

  const materials = useMemo(() => {
    return {
      shell: new THREE.MeshPhysicalMaterial({
        color: "#26282d",
        metalness: 0.72,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1.25,
      }),
      plate: new THREE.MeshStandardMaterial({
        color: "#191a1d",
        metalness: 0.92,
        roughness: 0.24,
        envMapIntensity: 1.45,
      }),
      band: new THREE.MeshStandardMaterial({
        color: "#1e2024",
        metalness: 0.62,
        roughness: 0.42,
        envMapIntensity: 1.1,
      }),
      foam: new THREE.MeshStandardMaterial({
        color: "#121316",
        metalness: 0.04,
        roughness: 0.94,
      }),
      mesh: new THREE.MeshStandardMaterial({
        color: "#101114",
        metalness: 0.1,
        roughness: 0.88,
      }),
      steel: new THREE.MeshStandardMaterial({
        color: "#b9bec6",
        metalness: 1,
        roughness: 0.26,
        envMapIntensity: 1.5,
      }),
      ember: new THREE.MeshStandardMaterial({
        color: "#ff4d00",
        emissive: "#ff4d00",
        emissiveIntensity: 1.4,
        metalness: 0.2,
        roughness: 0.4,
      }),
    };
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    const t = state.clock.elapsedTime;
    const px = state.pointer.x;
    const py = state.pointer.y;

    let targetYaw: number;
    let targetPitch: number;
    let targetScale = 1;

    if (variant === "story") {
      const [yaw, pitch, scale] = lerpPose(progressRef?.current ?? 0);
      targetYaw = yaw + px * 0.06;
      targetPitch = pitch - py * 0.04;
      targetScale = scale;
    } else {
      const [yaw, pitch] = BASE_POSE[variant];
      const drag = dragRef?.current ?? 0;
      const reach = variant === "hero" ? 0.24 : 0.32;
      targetYaw = yaw + px * reach + drag + Math.sin(t * 0.35) * 0.05;
      targetPitch = pitch - py * 0.14 + Math.cos(t * 0.5) * 0.02;
    }

    const lambda = 3.2;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetYaw, lambda, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetPitch, lambda, delta);
    const s = THREE.MathUtils.damp(g.scale.x, targetScale, lambda, delta);
    g.scale.setScalar(s);

    if (variant !== "story") {
      g.position.y = 0.08 + Math.sin(t * 0.8) * 0.05;
    } else {
      g.position.y = THREE.MathUtils.damp(g.position.y, 0.05, lambda, delta);
    }
  });

  return (
    <group ref={group} dispose={null}>
      {/* Headband — outer arc */}
      <mesh material={materials.band} rotation={[0, 0, -Math.PI * 0.075]}>
        <torusGeometry args={[1.12, 0.052, 24, 96, Math.PI * 1.15]} />
      </mesh>
      {/* Headband — inner steel core */}
      <mesh material={materials.steel} rotation={[0, 0, -Math.PI * 0.05]} scale={0.965}>
        <torusGeometry args={[1.12, 0.02, 16, 96, Math.PI * 1.1]} />
      </mesh>
      {/* Headband — top cushion */}
      <mesh material={materials.foam} rotation={[0, 0, Math.PI * 0.28]} scale={0.985}>
        <torusGeometry args={[1.12, 0.082, 24, 64, Math.PI * 0.44]} />
      </mesh>

      {[1, -1].map((side) => (
        <group key={side}>
          {/* Yoke arm connecting band to cup */}
          <mesh material={materials.steel} position={[side * 1.135, -0.42, 0]}>
            <cylinderGeometry args={[0.028, 0.034, 0.44, 24]} />
          </mesh>
          {/* Slider block at band end */}
          <mesh material={materials.plate} position={[side * 1.125, -0.24, 0]}>
            <boxGeometry args={[0.09, 0.16, 0.11]} />
          </mesh>

          {/* Ear cup */}
          <group
            position={[side * 1.16, -0.74, 0]}
            rotation={[0, side * 0.14, side * -0.09]}
          >
            {/* Shell */}
            <mesh material={materials.shell} scale={[0.55, 1, 0.82]}>
              <sphereGeometry args={[0.5, 48, 32]} />
            </mesh>
            {/* Outer plate */}
            <mesh
              material={materials.plate}
              position={[side * 0.25, 0, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.3, 0.3, 0.07, 48]} />
            </mesh>
            {/* Ember accent ring on outer plate */}
            <mesh
              material={materials.ember}
              position={[side * 0.295, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <torusGeometry args={[0.185, 0.007, 12, 64]} />
            </mesh>
            {/* Logo dot */}
            <mesh
              material={materials.ember}
              position={[side * 0.3, 0, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.028, 0.028, 0.012, 24]} />
            </mesh>
            {/* Memory-foam cushion */}
            <mesh
              material={materials.foam}
              position={[side * -0.17, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[1, 1.18, 1]}
            >
              <torusGeometry args={[0.28, 0.125, 24, 48]} />
            </mesh>
            {/* Inner driver cover */}
            <mesh
              material={materials.mesh}
              position={[side * -0.22, 0, 0]}
              rotation={[0, 0, Math.PI / 2]}
              scale={[1.18, 1, 1]}
            >
              <cylinderGeometry args={[0.26, 0.26, 0.04, 48]} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
