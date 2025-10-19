import Image from "next/image";

export function Footer() {
  return (
    <section className="relative min-h-screen w-full mt-40 bg-[linear-gradient(180deg,rgba(255,202,36,0.02)_35%,#610035_100%)]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 flex justify-center flex-col gap-10 items-center pt-20">
        <Image src="/logo-footer.svg" alt="Right for Migrants" width={320} height={144} />
        
        <div className="flex items-center gap-4 w-full max-w-7xl">
          <div className="bg-[#610035] flex-1 h-[2px]" />
          
          <a
            href="https://www.instagram.com/rightsformigrants_uk?igsh=dXNvb3F3enIwZDRz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/instagram-logo.svg"
              alt="Instagram"
              width={40}
              height={40}
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
            />
          </a>
          
          <div className="bg-[#610035] flex-1 h-[2px]" />
        </div>
        
        <p className="text-lg md:text-[2rem] font-medium font-sans  text-[#610035] leading-relaxed">
          contact@rightsformigrants.co.uk
        </p>
        <p className="text-sm text-black fomnt-medium font-sans leading-relaxed -mt-6">
          Rights for Migrants © 2025 | Design @ Agnes Creative
        </p>
      </div>
    </section>
  );
}
