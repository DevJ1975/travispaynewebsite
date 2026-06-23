'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

// Cinematic hero backdrop: a slowly drifting field of champagne-gold particles with
// gentle mouse parallax (doc 03 brand direction). Three.js is loaded lazily on the
// client so it stays out of the initial bundle. Under prefers-reduced-motion it
// renders only the gradient — no WebGL, no animation.
export function ThreeBackground() {
  const reduce = useReducedMotion();
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let frame = 0;
    let cleanup = () => {};

    void (async () => {
      const THREE = await import('three');
      if (disposed) return;

      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.z = 14;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.inset = '0';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      mount.appendChild(renderer.domElement);

      const count = Math.max(400, Math.min(1400, Math.floor((width * height) / 1400)));
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 36;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: 0xc8a96e,
        size: 0.07,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      let mouseX = 0;
      let mouseY = 0;
      const onPointer = (event: PointerEvent) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener('pointermove', onPointer, { passive: true });

      const clock = new THREE.Clock();
      const render = () => {
        const t = clock.getElapsedTime();
        points.rotation.y = t * 0.04;
        points.rotation.x = Math.sin(t * 0.1) * 0.06;
        points.position.y = Math.sin(t * 0.3) * 0.4;
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.04;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };
      render();

      const onResize = () => {
        const w = mount.clientWidth || window.innerWidth;
        const h = mount.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      const onVisibility = () => {
        cancelAnimationFrame(frame);
        if (!document.hidden) frame = requestAnimationFrame(render);
      };
      document.addEventListener('visibilitychange', onVisibility);

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener('pointermove', onPointer);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibility);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [reduce]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-tp-black">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-tp-black/30 via-tp-black/50 to-tp-black" />
    </div>
  );
}
