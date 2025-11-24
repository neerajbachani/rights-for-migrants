"use client"

import { useEffect, useRef, useState } from "react"

export function MovementSection() {
  const [isVisible, setIsVisible] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
      },
    )

    if (textRef.current) {
      observer.observe(textRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="w-full">
      <div className="md:max-w-7xl xl:max-w-[102rem] mx-auto px-6 sm:px-8 md:px-12 py-12 md:py-20">
        <h2
          className="
            text-[#610035]
            text-3xl sm:text-4xl md:text-[5rem] xl:text-[5.8rem]
            leading-snug sm:leading-tight md:leading-tight
            font-light font-sans text-left
          "
        >
          Join the Movement advocating for fair policies.{" "}
          <span className="block sm:inline">Together, we can make a difference.</span>
        </h2>
        <p
          ref={textRef}
          className={`text-[#610035] text-lg sm:text-xl mt-4 duration-1000 ${
            isVisible ? "animate-in slide-in-from-bottom fade-in opacity-100" : "opacity-0"
          }`}
        >
          Your Life, Your Future, Your Decision
        </p>
      </div>
    </section>
  )
}
