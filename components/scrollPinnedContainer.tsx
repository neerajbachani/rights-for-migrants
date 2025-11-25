"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StatsSection from "./stats-section";
import QuotesSection from "./quotes-section";

gsap.registerPlugin(ScrollTrigger);

export function ScrollPinnedContainer() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!wrapperRef.current || !statsRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Track animations - common for all screens
      gsap.to(".track-1", {
        xPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 4,
          markers: false,
        },
      });

      gsap.set(".track-2", { xPercent: -20 });
      gsap.to(".track-2", {
        xPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 4.5,
          markers: false,
        },
      });

      gsap.to(".track-3", {
        xPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 5,
          markers: false,
        },
      });

      mm.add({
        // Desktop
        isDesktop: "(min-width: 800px)",
        // Mobile
        isMobile: "(max-width: 799px)",
      }, (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean };
        
        // Pin the entire section
        // pinSpacing: true ensures the next section waits until we are done
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom 30%", // Longer scroll distance for better pacing
          pin: true,
          pinSpacing: true, 
          markers: false,
        });

        const quotesTL = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "+=100%",
            scrub: 2,
            markers: false,
          },
        });

        // Initial states for stacked quotes
        // We start with all hidden or positioned
        const yOffsetIn = isMobile ? 380 : 500;
        const yOffsetOut = isMobile ? 200 : -200;

        gsap.set([".quote-1", ".quote-2", ".quote-3"], { autoAlpha: 0.7, scale: 0.9, y: yOffsetIn });

        // Sequence:
        // 1. Quote 1 Enters
        quotesTL.to(".quote-1", { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" });
        
        // 2. Hold Quote 1
        quotesTL.to(".quote-1", { duration: 1 });

        // 3. Quote 1 Exits, Quote 2 Enters
        quotesTL.to(".quote-1", { autoAlpha: 0.8, scale: 0.9, y: yOffsetOut, duration: 1, ease: "power2.in" });
        quotesTL.to(".quote-2", { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" }, "<+=0.2"); // Slight overlap

        // 4. Hold Quote 2
        quotesTL.to(".quote-2", { duration: 1 });

        // 5. Quote 2 Exits, Quote 3 Enters
        quotesTL.to(".quote-2", { autoAlpha: 0.9, scale: 0.9, y: yOffsetOut, duration: 1, ease: "power2.in" });
        quotesTL.to(".quote-3", { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" });

        // 6. Hold Quote 3
        quotesTL.to(".quote-3", { duration: 1 });

        // 7. Quote 3 Exits (optional, or just unpin)
        // If we want it to fade out before unpinning:
        quotesTL.to(".quote-3", { autoAlpha: 1, scale: 0.9, y: yOffsetOut });
      });

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="">
      <div ref={wrapperRef} className="relative w-full">
        {/* Stats behind */}
        <div ref={statsRef} className="absolute inset-0 z-0 pointer-events-none">
          <StatsSection />
        </div>

        {/* Quotes overlayed */}
        <div className="relative z-10 pointer-events-auto h-[88vh] md:min-h-screen flex items-center justify-center my-auto ">
          <QuotesSection />
        </div>
      </div>
    </div>
  );
}