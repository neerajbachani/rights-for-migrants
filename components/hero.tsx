"use client";
import { useState, useEffect } from "react";

export function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0);

  const items = [
    "Equal Voices, Equal Rights",
    "One Voice, One Movement",
    "Empower Migrants Now",
    "Hope. Rights. Action",
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollPosition / (windowHeight * 0.8), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bottomHandTransform = `translateY(-${scrollProgress * 50}px)`;
  const topHandTransform = `translateY(${scrollProgress * 20}px)`;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scrollTags {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .tags-scroll-container {
          display: flex;
          width: fit-content;
          animation: scrollTags 20s linear infinite;
        }
        .tags-scroll-container:hover {
          animation-play-state: paused;
        }
        .hand-animated {
          transition: transform 0.3s ease-out, filter 0.3s ease;
          will-change: transform;
        }
        .hand-glow {
          filter: drop-shadow(0 0 ${15 + scrollProgress * 20}px rgba(255, 215, 0, ${
            0.3 + scrollProgress * 0.5
          }));
        }
      `,
        }}
      />

      {/* Top Right Hand - hidden on mobile */}
      <div
        className="absolute top-0 right-0 z-10 hidden md:block pointer-events-none"
        style={{ transform: topHandTransform }}
      >
        <div className={`hand-animated ${scrollProgress > 0.3 ? "hand-glow" : ""}`}>
          <img
            src="/hand2.svg"
            alt=""
            width={390}
            height={366}
            style={{ width: "390px", height: "366px" }}
          />
        </div>
      </div>

      <section className="bg-[#610035] text-white px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl lg:max-w-[100rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left content */}
          <div className="z-10 relative text-center md:text-left flex flex-col justify-center">
            <h1 className="text-[2.2rem] sm:text-3xl md:text-[4rem] xl:text-[5.5rem] font-medium font-besley leading-tight">
  Raising a Voice <br className="hidden sm:block" /> for Fair Policies
</h1>
            <p className="text-sm sm:text-lg md:text-xl xl:text-2xl leading-relaxed py-4 font-medium font-sans text-white max-w-5xl mx-auto md:mx-0">
              This is a Migrant Rights Movement calling on the government and political parties
              to change their views. Migrants who entered the UK lawfully, paying the required fees
              and holding valid visas, contribute to the economy by paying taxes, renting
              properties, buying groceries, and not claiming any benefits. Any unfair policies
              will be answered with our vote in the next election.
            </p>
          </div>

          {/* Right hand - hidden on mobile */}
          <div className="hidden md:flex justify-center items-center relative">
            <div
              className="relative flex items-center justify-center"
              style={{ transform: bottomHandTransform }}
            >
              <div className={`hand-animated ${scrollProgress > 0.3 ? "hand-glow" : ""}`}>
                <img
                  src="/hand1.svg"
                  alt=""
                  width={372}
                  height={405}
                  className="opacity-80"
                  style={{ width: "372px", height: "405px" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="-mx-4 sm:-mx-6 md:-mx-12 mt-8 md:mt-12">
          <img src="/line1.svg" alt="Right for Migrants" className="w-full h-auto" />

          <div className="xl:max-w-full max-w-7xl my-4 mx-auto overflow-hidden">
            <div className="tags-scroll-container">
              {/* first loop */}
              <div className="flex gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm md:text-2xl xl:text-3xl pr-4 sm:pr-6 md:pr-8">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 sm:gap-6 md:gap-8">
                    <span className="whitespace-nowrap">{item}</span>
                    <span className="text-white">//</span>
                  </div>
                ))}
              </div>

              {/* duplicate for loop continuity */}
              <div className="flex gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm md:text-2xl xl:text-3xl pr-4 sm:pr-6 md:pr-8">
                {items.map((item, index) => (
                  <div key={`duplicate-${index}`} className="flex items-center gap-4 sm:gap-6 md:gap-8">
                    <span className="whitespace-nowrap">{item}</span>
                    <span className="text-white">//</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <img src="/line2.svg" alt="Right for Migrants" className="w-full h-auto" />
        </div>
      </section>
    </>
  );
}