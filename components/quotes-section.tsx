"use client";

// export function QuotesSection() {
//   return (
//     <section className="relative px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-24 min-h-screen flex items-center justify-center">
//       <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 relative z-10 text-center">
//         <div className="quote-1 bg-[#FFCA24] p-8 sm:p-6 md:p-8 lg:p-12 xl:p-16 pt-10 sm:pt-8 md:pt-10 lg:pt-14 xl:pt-20 rounded-2xl md:rounded-3xl -rotate-[3deg] transform-gpu">
//           <p className="font-medium font-sans text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[2.5rem] text-black text-left leading-relaxed">
//             <span className="border-b-2 border-[#8F8F8F]">Signing a petition is not enough;</span><br />
//             <span className="border-b-2 border-[#8F8F8F]">we must unite and raise our voices against unfair policies. </span>
//             <span className="border-b-2 border-[#8F8F8F]">Migrants are not toys—we have feelings and families.</span>
//           </p>
//         </div>

//         <div className="quote-2 bg-[#F0E8D2] p-8 sm:p-6 md:p-8 lg:p-12 xl:p-16 pt-10 sm:pt-8 md:pt-10 lg:pt-14 xl:pt-20 rotate-[2deg] rounded-2xl md:rounded-3xl transform-gpu">
//           <p className="font-medium font-sans text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[2.5rem] text-[#610035] text-left leading-relaxed">
//             <span className="border-b-2 border-[#8F8F8F]">Don't underestimate the migrants. </span>
//             <span className="border-b-2 border-[#8F8F8F]">Legal Migrants have right to vote in the UK, with the power to determine the next leader or government.</span>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

export default function QuotesSection() {
  return (
    <section className="relative px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-24 flex items-center justify-center">
      <div className="max-w-3xl mx-auto relative z-10 text-center grid grid-cols-1 place-items-center">
        <div className="quote-1 col-start-1 row-start-1 bg-[#FFCA24] p-8 sm:p-6 md:p-8 lg:p-12 xl:p-16 pt-10 sm:pt-8 md:pt-10 lg:pt-14 xl:pt-20 rounded-2xl md:rounded-3xl -rotate-[3deg] transform-gpu mx-5">
          <p className="font-medium text-lg py-10 sm:text-lg md:text-xl lg:text-2xl xl:text-[2.5rem] text-black text-left leading-relaxed">
            <span className="border-b-2 border-[#8F8F8F]">Signing a petition is not enough;</span><br />
            <span className="border-b-2 border-[#8F8F8F]">we must unite and raise our voices against unfair policies. </span>
            <span className="border-b-2 border-[#8F8F8F]">Migrants are not toys—we have feelings and families.</span>
          </p>
        </div>
        <div className="quote-2 col-start-1 row-start-1 bg-[#F0E8D2] p-8 sm:p-6 md:p-8 lg:p-12 xl:p-16 pt-10 sm:pt-8 md:pt-10 lg:pt-14 xl:pt-20 rotate-[2deg] rounded-2xl md:rounded-3xl transform-gpu mx-5">
          <p className="font-medium text-lg py-10 sm:text-lg md:text-xl lg:text-2xl xl:text-[2.5rem] text-[#610035] text-left leading-relaxed">
            <span className="border-b-2 border-[#8F8F8F]">Don't underestimate the migrants. </span>
            <span className="border-b-2 border-[#8F8F8F]">Legal Migrants have right to vote in the UK, with the power to determine the next leader or government.</span>
          </p>
        </div>
        <div className="quote-3 col-start-1 row-start-1 bg-[#FF4122] p-8 sm:p-6 md:p-8 lg:p-12 xl:p-16 pt-10 sm:pt-8 md:pt-10 lg:pt-14 xl:pt-20 rotate-[3deg] rounded-2xl md:rounded-3xl transform-gpu mx-5">
          <p className="font-medium text-lg py-10 sm:text-lg md:text-xl lg:text-2xl xl:text-[2.5rem] text-white text-left leading-relaxed">
            <span className="border-b-2 border-[#8F8F8F]">You will not decide our future with your policies but we will decide your future with our Vote.</span>
          </p>
        </div>
      </div>
    </section>
  );
}