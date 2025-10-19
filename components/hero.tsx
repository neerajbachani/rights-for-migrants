"use client";
import { useState, useEffect } from 'react';

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
      // Calculate progress from 0 to 1 based on scroll
      const progress = Math.min(scrollPosition / (windowHeight * 0.8), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate how much the bottom hand should move up
  const bottomHandTransform = `translateY(-${scrollProgress * 300}px)`;
  const topHandTransform = `translateY(${scrollProgress * 100}px)`;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollTags {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
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
          filter: drop-shadow(0 0 ${15 + scrollProgress * 20}px rgba(255, 215, 0, ${0.3 + scrollProgress * 0.5}));
        }
      `}} />
      
      {/* Top Right Hand */}
      <div 
        className="absolute top-0 right-0 z-10 hidden md:block pointer-events-none"
        style={{ transform: topHandTransform }}
      >
        <div className={`hand-animated ${scrollProgress > 0.3 ? 'hand-glow' : ''}`}>
          <img
            src="/hand2.svg"
            alt=""
            width={450}
            height={426}
            style={{ width: '450px', height: '426px' }}
          />
        </div>
      </div>
      
      <section className="bg-[#610035] text-white px-8 py-16 md:py-24 md:px-12 relative overflow-hidden">
        <div className="md:max-w-7xl lg:max-w-[100rem] mx-auto grid md:grid-cols-2 gap-12">
          {/* Left content */}
          <div className="z-10 relative">
            <h1 className="text-4xl md:text-[5rem] xl:text-[5.5rem] font-medium font-sans">
              Raising a Voice <br /> for Fair Policies
            </h1>
            <p className="text-lg md:text-2xl leading-relaxed py-4 font-medium text-white max-w-5xl">
              This is a Migrant Rights Movement calling on the government and political parties to change their views.
              Migrants who entered the UK lawfully, paying the required fees and holding valid visas, contribute to the
              economy by paying taxes, renting properties, buying groceries, and not claiming any benefits. Any unfair
              policies will be answered with our vote in the next election.
            </p>
          </div>
          
          {/* Right decorative element with Hand 1 SVG */}
          <div className="hidden md:flex justify-center relative">
            <div 
              className="relative w-full h-full my-20 ml-60 flex items-center"
              style={{ transform: bottomHandTransform }}
            >
              <div className={`hand-animated ${scrollProgress > 0.3 ? 'hand-glow' : ''}`}>
                <img
                  src="/hand1.svg"
                  alt=""
                  width={422}
                  height={435}
                  className="opacity-80"
                  style={{ width: '422px', height: '435px' }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Full-width nav that breaks out of section padding */}
        <div className="-mx-8 md:-mx-12 mt-8 md:mt-12">
          <img
            src="/line1.svg"
            alt="Right for Migrants"
            width={1920}
            height={4}
            style={{ width: '100%', height: 'auto' }}
          />
          
          <div className="xl:max-w-full max-w-7xl my-4 mx-auto overflow-hidden">
            <div className="tags-scroll-container">
              {/* First set */}
              <div className="flex gap-8 leading-relaxed text-sm font-normal md:text-2xl xl:text-3xl pr-8">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-8">
                    <span className="whitespace-nowrap">{item}</span>
                    <span className="text-[#fff]">//</span>
                  </div>
                ))}
              </div>
              
              {/* Second set for seamless loop */}
              <div className="flex gap-8 leading-relaxed text-sm font-normal md:text-2xl xl:text-3xl pr-8">
                {items.map((item, index) => (
                  <div key={`duplicate-${index}`} className="flex items-center gap-8">
                    <span className="whitespace-nowrap">{item}</span>
                    <span className="text-[#fff]">//</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <img
            src="/line2.svg"
            alt="Right for Migrants"
            width={1920}
            height={4}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </section>
    </>
  );
}