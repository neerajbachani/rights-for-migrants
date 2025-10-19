import Image from "next/image";

export function Hero() {
  const items = [
    "Equal Voices, Equal Rights",
    "One Voice, One Movement",
    "Empower Migrants Now",
    "Hope. Rights. Action",
  ]
  
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
      `}} />
      
      <div className="absolute top-0 right-0 z-3 hidden md:block">
        <Image
          src="/hand2.svg"
          alt=""
          width={450}
          height={396}
          priority
        />
      </div>
      
      <section className="bg-[#610035] text-white px-8 py-16 md:py-24 md:px-12 relative overflow-hidden">
        <div className="md:max-w-7xl lg:max-w-[100rem] mx-auto grid md:grid-cols-2 gap-12">
          {/* Left content */}
          <div className="z-10">
            <h1 className="text-[5rem] leading-24">
              Raising a Voice <br></br> for Fair Policies
            </h1>
            <p className="text-2xl leading-relaxed py-4 text-white max-w-2xl">
              This is a Migrant Rights Movement calling on the government and political parties to change their views.
              Migrants who entered the UK lawfully, paying the required fees and holding valid visas, contribute to the
              economy by paying taxes, renting properties, buying groceries, and not claiming any benefits. Any unfair
              policies will be answered with our vote in the next election.
            </p>
          </div>
          
          {/* Right decorative element with Hand 1 SVG */}
          <div className="hidden md:flex justify-center relative">
            <div className="relative w-full h-full my-20 ml-60 flex items-center">
              {/* Hand 1 SVG */}
              <Image
                src="/hand1.svg"
                alt=""
                width={422}
                height={365}
                className="opacity-80"
                priority
              />
            </div>
          </div>
        </div>
        
        {/* Full-width nav that breaks out of section padding */}
        <div className="-mx-8 md:-mx-12 mt-8 md:mt-12">
          <Image
            src="/line1.svg"
            alt="Right for Migrants"
            width={1920}
            height={4}
            className="w-full"
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
          
          <Image
            src="/line2.svg"
            alt="Right for Migrants"
            width={1920}
            height={4}
            className="w-full"
          />
        </div>
      </section>
    </>
  );
}