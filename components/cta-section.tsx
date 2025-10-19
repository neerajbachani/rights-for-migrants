"use client"

import { ArrowRight } from "lucide-react"
import { useEffect, useRef } from "react"

export function CTASection() {
  const ctaRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Dynamically load GSAP
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
    script.async = true
    
    const scrollScript = document.createElement('script')
    scrollScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
    scrollScript.async = true
    
    let scriptsLoaded = 0
    const onScriptLoad = () => {
      scriptsLoaded++
      if (scriptsLoaded === 2 && (window as any).gsap) {
        const gsap = (window as any).gsap
        const ScrollTrigger = (window as any).ScrollTrigger
        gsap.registerPlugin(ScrollTrigger)
        
        if (!ctaRef.current || !headingRef.current || !buttonRef.current || !statsRef.current || !counterRef.current) return

        // Create timeline for smooth sequential animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse"
          }
        })

        // Animate the CTA box sliding in from left
        tl.fromTo(
          ctaRef.current,
          {
            x: -200,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out"
          }
        )
        
        // Animate heading with slight delay
        .fromTo(
          headingRef.current,
          {
            x: -100,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
          },
          "-=0.8"
        )
        
        // Animate button with scale effect
        .fromTo(
          buttonRef.current,
          {
            scale: 0,
            opacity: 0
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)"
          },
          "-=0.4"
        )
        
        // Animate stats section
        .fromTo(
          statsRef.current,
          {
            y: 50,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
          },
          "-=0.3"
        )

        // Animate counter incrementing
        const counter = { value: 0 }
        gsap.to(counter, {
          value: 2178,
          duration: 2,
          ease: "power1.out",
          scrollTrigger: {
            trigger: counterRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          onUpdate: function() {
            if (counterRef.current) {
              counterRef.current.textContent = Math.floor(counter.value).toLocaleString()
            }
          }
        })

        // Add hover animation for button
        const btn = buttonRef.current
        if (btn) {
          const handleMouseEnter = () => {
            gsap.to(btn, {
              scale: 1.1,
              rotation: 90,
              duration: 0.3,
              ease: "power2.out"
            })
          }

          const handleMouseLeave = () => {
            gsap.to(btn, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: "power2.out"
            })
          }

          btn.addEventListener('mouseenter', handleMouseEnter)
          btn.addEventListener('mouseleave', handleMouseLeave)

          // Cleanup
          return () => {
            btn.removeEventListener('mouseenter', handleMouseEnter)
            btn.removeEventListener('mouseleave', handleMouseLeave)
          }
        }
      }
    }
    
    script.onload = onScriptLoad
    scrollScript.onload = onScriptLoad
    
    document.head.appendChild(script)
    document.head.appendChild(scrollScript)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      if (document.head.contains(scrollScript)) {
        document.head.removeChild(scrollScript)
      }
    }
  }, [])

  return (
    <section className="py-20 w-full overflow-hidden">
      <div className="md:mr-20 xl:mr-40">
        <div 
          ref={ctaRef}
          className="bg-accent rounded-tr-full rounded-br-full py-12 md:py-20 flex flex-col md:flex-row items-center justify-between px-20"
        >
          <h3 
            ref={headingRef}
            className="font-medium text-4xl xl:text-[7rem] md:text-[6.5rem] text-[#610035]"
          >
            Join the Movement
          </h3>
          <button 
            ref={buttonRef}
            className="bg-[#610035] text-white rounded-full w-[7rem] h-[7rem] hover:bg-primary/90 transition-colors"
          >
            <ArrowRight className="w-6 h-6 xl:w-10 xl:h-10 mx-auto" />
          </button>
        </div>
      </div>
      <div ref={statsRef} className="w-full">
        <div className="lg:max-w-4xl mx-auto px-8 md:px-12 text-center">
          <h2 ref={counterRef} className="text-[8rem] md:text-[20rem] xl:text-[21rem] font-sans leading-relaxed font-medium text-[#610035]">0</h2>
          <p className="text-6xl -mt-16 text-[#610035] text-left leading-relaxed font-medium font-sans">
            people have joined the <br /> movement!
          </p>
        </div>
      </div>
    </section>
  )
}