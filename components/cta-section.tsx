"use client"

import { ArrowRight, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function CTASection() {
  const ctaRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLHeadingElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const modalOverlayRef = useRef<HTMLDivElement>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

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

  // Modal animation effect
  useEffect(() => {
    if ((window as any).gsap && modalRef.current && modalOverlayRef.current) {
      const gsap = (window as any).gsap
      
      if (isModalOpen) {
        // Animate overlay fade in
        gsap.fromTo(
          modalOverlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        )
        
        // Animate modal slide in from left
        gsap.fromTo(
          modalRef.current,
          { x: -800, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
        )
      }
    }
  }, [isModalOpen])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    if ((window as any).gsap && modalRef.current && modalOverlayRef.current) {
      const gsap = (window as any).gsap
      
      // Animate modal slide out to left
      gsap.to(modalRef.current, {
        x: -800,
        opacity: 0,
        duration: 0.6,
        ease: "power3.in"
      })
      
      // Animate overlay fade out
      gsap.to(modalOverlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setIsModalOpen(false)
      })
    } else {
      setIsModalOpen(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission logic here
    closeModal()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <section className="py-20 w-full overflow-hidden min-h-screen flex items-center">
        <div className="w-full">
          <div className="md:mr-20 xl:mr-40">
            <div 
              ref={ctaRef}
              className="bg-[#FFCA24] rounded-tr-full rounded-br-full py-12 md:py-20 flex flex-col md:flex-row items-center justify-between px-20"
            >
              <h3 
                ref={headingRef}
                className="font-medium text-4xl xl:text-7xl md:text-6xl text-[#610035] mb-8 md:mb-0"
              >
                Join the Movement
              </h3>
              <button 
                ref={buttonRef}
                onClick={openModal}
                className="bg-[#610035] text-white rounded-full w-28 h-28 hover:bg-[#610035]/95 duration-200 transition-colors flex items-center justify-center"
              >
                <ArrowRight className="w-6 h-6 xl:w-10 xl:h-10" />
              </button>
            </div>
          </div>
          <div ref={statsRef} className="w-full mt-12">
            <div className="lg:max-w-4xl mx-auto px-8 md:px-12 text-center">
              <h2 ref={counterRef} className="text-8xl md:text-9xl font-sans leading-relaxed font-medium text-[#610035]">0</h2>
              <p className="text-4xl md:text-6xl -mt-8 md:-mt-16 text-[#610035] text-left leading-relaxed font-medium font-sans">
                people have joined the <br /> movement!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            ref={modalOverlayRef}
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div 
            ref={modalRef}
            className="relative bg-[#FFD03D] rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-2xl"
          >
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 bg-[#610035] text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#610035]/90 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mt-4">
              <h2 className="text-4xl md:text-6xl font-medium text-[#610035] mb-6">
                Welcome to the Movement
              </h2>
              
              <p className="text-xl md:text-2xl text-[#610035]/80 mb-8">
                Join thousands of people making a difference. Fill out the details below to get started.
              </p>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-lg font-medium text-[#610035] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#610035]/20 focus:border-[#610035] focus:outline-none text-lg"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-[#610035] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#610035]/20 focus:border-[#610035] focus:outline-none text-lg"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-lg font-medium text-[#610035] mb-2">
                    Why do you want to join?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#610035]/20 focus:border-[#610035] focus:outline-none text-lg resize-none"
                    placeholder="Tell us your story..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#610035] text-white py-4 rounded-xl text-xl font-medium hover:bg-[#610035]/90 transition-colors flex items-center justify-center gap-3"
                >
                  Submit
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}