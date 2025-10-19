import Image from "next/image";

export function Footer() {
  return (
    <section className="  min-h-screen w-full mt-40">
     
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center flex-col gap-10 items-center">
          <Image src="/logo-footer.svg" alt="Right for Migrants" width={320} height={144} objectFit="contain" />
          <div className="flex items-center gap-4 w-full max-w-7xl">
            <div className="bg-[#610035] flex-1 h-[2px]"></div>
            <Image src="/instagram-logo.svg" alt="Right for Migrants" width={40} height={40} objectFit="contain" />
            <div className="bg-[#610035] flex-1 h-[2px]"></div>
          </div>
          <p className=" font-medium text-[2rem] text-[#610035] leading-relaxed">contact@rightsformigrants.co.uk</p>
          <p className="text-sm text-black leading-relaxed -mt-6 ">Rights for Migrants © 2025 | Design @ Agnes Creative</p>
        </div>
      </div>
      <div className="bg-[linear-gradient(180deg,rgba(255,202,36,0.02)_35%,#610035_100%)] min-h-screen -mt-28">

      </div>
    </section>
  )
}