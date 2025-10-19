"use client"

import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 w-full">
      <div className=" md:mr-20 xl:mr-40">
        <div className="bg-accent rounded-tr-full rounded-br-full  py-12 md:py-20 flex flex-col md:flex-row items-center justify-between px-20 ">
          <h3 className="font-medium text-4xl xl:text-[7rem] md:text-[6.5rem]  text-[#610035]">
            Join the Movement
          </h3>
          <button className="bg-[#610035]  text-white rounded-full w-[7rem] h-[7rem] hover:bg-primary/90 transition-colors  ">
            <ArrowRight className="w-6 h-6 xl:w-10 xl:h-10 mx-auto" />
          </button>
        </div>
      </div>
      <div className="w-full">
  <div className="lg:max-w-4xl mx-auto px-8 md:px-12 text-center">
    <h2 className="text-[8rem] md:text-[20rem] xl:text-[21rem] leading-relaxed  font-medium text-[#610035]">2,178</h2>
    <p className="text-6xl -mt-16 text-[#610035] text-left leading-relaxed font-medium">people have joined the <br></br> movement!</p>
  </div>
</div>
    </section>
  )
}
