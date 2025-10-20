
"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StatsSection } from "./stats-section";
import { QuotesSection } from "./quotes-section";

gsap.registerPlugin(ScrollTrigger);

export function ScrollPinnedContainer() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!wrapperRef.current || !statsRef.current) return;

    const ctx = gsap.context(() => {
      // All tracks now move SLOWLY with consistent speeds
      
      // Track 1 - Moves right to left (slow and smooth)
      gsap.to(".track-1", {
        xPercent: -20,  // Reduced distance for slower movement
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 4,  // Much higher = much slower and smoother
          markers: false,
        },
      });
      // Track 2 - Moves left to right (slow and smooth)
      gsap.set(".track-2", { xPercent: -20 });  // Starts slightly left
      gsap.to(".track-2", {
        xPercent: 0,  // Reduced travel distance
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 4.5,  // Slower and smoother than track 1
          markers: false,
        },
      });
      // Track 3 - Moves right to left (slowest and smoothest)
      gsap.to(".track-3", {
        xPercent: -15,  // Reduced distance
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 5,  // Slowest and smoothest
          markers: false,
        },
      });

      // Pin the entire section during the quote animations
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
        markers: false,
      });

      // Quotes timeline
      const quotesTL = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 0.5,
          markers: false,
        },
      });

      // Phase A: Quote1 appears and centers
      quotesTL.fromTo(
        ".quote-1",
        { autoAlpha: 0, y: 100, scale: 0.9 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
        0
      );

      // Hold quote1 centered
      quotesTL.to(".quote-1", { autoAlpha: 1, y: 0, duration: 1 }, 1);

      // Phase B: Move quote1 up and bring quote2 in
      quotesTL.to(".quote-1", { y: 300, autoAlpha: 0.8, duration: 1 }, 4);
      
      quotesTL.fromTo(
        ".quote-2",
        { autoAlpha: 0, y: 150, scale: 0.9 },
        { autoAlpha: 1, y: -200, scale: 1, duration: 0.8 },
        1.8
      );

      // Phase C: Both continue moving up as scroll continues
      quotesTL.to([".quote-1", ".quote-2"], { 
        y: "120", 
        duration: 1.2, 
      }, 3);
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
        <div className="relative z-10 pointer-events-auto min-h-screen flex items-center justify-center">
          <QuotesSection />
        </div>
      </div>
    </div>
  );
}