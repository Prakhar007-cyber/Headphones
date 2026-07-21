"use client";

import { Suspense, useEffect, useRef, useState, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer } from "@react-three/drei";
import HeadphoneModel, { type HeadphoneVariant } from "./HeadphoneModel";

interface HeadphoneSceneProps {
  variant: HeadphoneVariant;
  progressRef?: RefObject<number>;
  className?: string;
  /** allow click + drag rotation (hero / finale) */
  draggable?: boolean;
}

/**
 * Studio-lit product scene. The environment is built from Lightformers so the
 * metallic materials get believable reflections without downloading an HDRI.
 * Rendering pauses entirely when the canvas leaves the viewport.
 */
export default function HeadphoneScene({
  variant,
  progressRef,
  className,
  draggable = false,
}: HeadphoneSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const [frameloop, setFrameloop] = useState<"always" | "never">("never");
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setFrameloop(entry.isIntersecting ? "always" : "never"),
      { rootMargin: "160px" }
    );
    io.observe(el);

    // Lighter render target on small screens
    if (window.innerWidth < 768) setDpr([1, 1.4]);

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!draggable) return;
    const el = wrapRef.current;
    if (!el) return;

    const down = (e: PointerEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragRef.current += (e.clientX - lastX.current) * 0.006;
      lastX.current = e.clientX;
    };
    const up = () => {
      dragging.current = false;
    };
    let decay: number;
    const relax = () => {
      // ease the drag offset back toward rest when not interacting
      if (!dragging.current) dragRef.current *= 0.97;
      decay = requestAnimationFrame(relax);
    };
    decay = requestAnimationFrame(relax);

    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(decay);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [draggable]);

  const float = variant !== "story";

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ cursor: draggable ? "grab" : undefined, touchAction: "pan-y" }}
    >
      <Canvas
        frameloop={frameloop}
        dpr={dpr}
        camera={{ position: [0, 0, 5.4], fov: 33 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} />
          {/* Key light */}
          <spotLight position={[4.5, 6, 4]} intensity={90} angle={0.4} penumbra={1} decay={1.6} />
          {/* Cool rim */}
          <directionalLight position={[-5, 2.5, -4]} intensity={1.4} color="#8fb4ff" />
          {/* Warm kick */}
          <directionalLight position={[3, -2, 3]} intensity={0.5} color="#ff6a2b" />

          {float ? (
            <Float speed={1.3} rotationIntensity={0.14} floatIntensity={0.45} floatingRange={[-0.05, 0.05]}>
              <HeadphoneModel variant={variant} progressRef={progressRef} dragRef={dragRef} />
            </Float>
          ) : (
            <HeadphoneModel variant={variant} progressRef={progressRef} dragRef={dragRef} />
          )}

          <ContactShadows
            position={[0, -1.72, 0]}
            opacity={0.5}
            blur={2.6}
            scale={6.5}
            far={2.4}
            color="#000000"
          />

          <Environment resolution={256} frames={1}>
            <Lightformer
              intensity={3}
              position={[0, 4, 0]}
              rotation-x={Math.PI / 2}
              scale={[9, 3, 1]}
            />
            <Lightformer
              intensity={1.4}
              position={[-4.5, 1, 2]}
              rotation-y={Math.PI / 2}
              scale={[6, 1.6, 1]}
              color="#cdd6ff"
            />
            <Lightformer
              intensity={1.8}
              position={[4.5, 0.5, -2]}
              rotation-y={-Math.PI / 2}
              scale={[6, 2.2, 1]}
            />
            <Lightformer
              intensity={0.8}
              position={[0, -3, 3]}
              rotation-x={-Math.PI / 2.4}
              scale={[7, 2, 1]}
              color="#ff6a2b"
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
