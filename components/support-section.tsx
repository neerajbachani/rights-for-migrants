"use client"

import Image from "next/image"


export function SupportSection() {
  const logoCards = [
    { id: 1, src: "/sm-image-1.png", alt: "Rights for Migrants logo 1" },
    { id: 2, src: "/sm-image-1.png", alt: "Rights for Migrants logo 2" },
    { id: 3, src: "/sm-image-1.png", alt: "Rights for Migrants logo 3"},
    { id: 4, src: "/sm-image-1.png", alt: "Rights for Migrants logo 4"},
    { id: 5, src: "/sm-image-1.png", alt: "Rights for Migrants logo 5"},
    { id: 6, src: "/sm-image-1.png", alt: "Rights for Migrants logo 6"}
  ]

  return (
    <section className=" mt-40 px-8 py-16 md:py-24 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className=" text-4xl md:text-7xl xl:text-[5rem] font-medium font-sans text-[#610035] mb-8">Support Our Movement</h2>
          <p className="text-black max-w-4xl text-2xl leading-relaxed font-sans mx-auto mb-14">
            Raise awareness and show solidarity! Download a selection of profile logos and graphics — designed for social
            media and messaging apps.
          </p>
          <button className="bg-[#610035] text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors inline-flex items-center text-[1rem] ">
            {/* <Download className="w-4 h-4" /> */}
            Download
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10  mb-16">
          {logoCards.map((card) => (
            <div
              key={card.id}
              className={`aspect-square rounded-[1.25rem] flex items-center  justify-center relative overflow-hidden`}
            >
              {/* Next/Image fills the square; parent must be position:relative */}
              <Image
                src={card.src}
                alt={card.alt}
                fill
                objectFit="cover"
                // sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover p-4"
                priority={card.id <= 2} // optionally preload first two
              />
            </div>
          ))}
        </div>

        {/* <div className="border-t border-border pt-12 text-center">
          <div className="mb-6">
            <p className="font-serif text-3xl font-bold text-primary mb-4">
              Rights
              <br />
              for
              <br />
              Migrants
            </p>
          </div>
          <div className="flex justify-center mb-4">
            <a href="#" className="text-primary hover:text-primary/80 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                <circle cx="12" cy="12" r="3.6" />
              </svg>
            </a>
          </div>
          <p className="text-primary font-medium mb-2">contact@rightsformigrants.co.uk</p>
          <p className="text-sm text-muted-foreground">Rights for Migrants © 2025 | Design & Rights Creators</p>
        </div> */}
      </div>
    </section>
  )
}
