"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";

type Props = {
  children: ReactNode;
};

const LenisProvider = ({ children }: Props) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // You can pass other options: smoothWheel, smoothTouch, etc.
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
