
// "use client";

// import React from "react";

// export function StatsSection() {
//   const Tag = ({ children, variant }: { children: React.ReactNode; variant: 'yellow' | 'red' | 'maroon' | 'purple' | 'outline' }) => {
//     const variants: Record<string, string> = {
//       yellow: 'bg-[#FFCA24] text-black',
//       red: 'bg-[#FF4122] text-white',
//       maroon: 'bg-[#610035] text-white',
//       purple: 'bg-[#5d2059] text-white',
//       outline: 'bg-[#FFFDFE] text-[#610035]'
//     };
//     return (
//       <span className={`px-10 py-4 rounded-[10px] text-3xl font-medium font-sans whitespace-nowrap flex-shrink-0 ${variants[variant]}`}>
//         {children}
//       </span>
//     );
//   };

//   const track1Tags = [
//     { text: "Rise with Rights", variant: "yellow" as const },
//     { text: "Migrants Matter", variant: "red" as const },
//     { text: "Stand for Justice", variant: "maroon" as const },
//     { text: "Equal Voices, Equal Rights", variant: "outline" as const },
//     { text: "Building Bridges", variant: "purple" as const },
//   ];

//   const track2Tags = [
//     { text: "Migrants Matter", variant: "red" as const },
//     { text: "Building Bridges, Breaking Barriers", variant: "yellow" as const },
//     { text: "One Voice, One Movement", variant: "outline" as const },
//     { text: "Empower Migrants", variant: "purple" as const },
//     { text: "Equal Voices, Equal Rights", variant: "maroon" as const },
//   ];

//   const track3Tags = [
//     { text: "Rise with Rights", variant: "yellow" as const },
//     { text: "Stand for Justice", variant: "maroon" as const },
//     { text: "Migrants Matter", variant: "red" as const },
//     { text: "Justice for All", variant: "outline" as const },
//     { text: "Unity in Diversity", variant: "purple" as const },
//   ];

//   return (
//     <div className="min-h-screen overflow-hidden flex flex-col gap-20 justify-center -mt-40">
//       {/* Track 1 */}
//       <div className="w-full skew-y-2 overflow-hidden my-8">
//         <div className="track-1 flex gap-5 w-fit will-change-transform">
//           {[...Array(6)].map((_, i) => (
//             <React.Fragment key={i}>
//               {track1Tags.map((tag, j) => (
//                 <Tag key={`${i}-${j}`} variant={tag.variant}>
//                   {tag.text}
//                 </Tag>
//               ))}
//             </React.Fragment>
//           ))}
//         </div>
//       </div>

//       {/* Track 2 */}
//       <div className="w-full -skew-y-2 overflow-hidden my-8">
//         <div className="track-2 flex gap-5 w-fit will-change-transform">
//           {[...Array(6)].map((_, i) => (
//             <React.Fragment key={i}>
//               {track2Tags.map((tag, j) => (
//                 <Tag key={`${i}-${j}`} variant={tag.variant}>
//                   {tag.text}
//                 </Tag>
//               ))}
//             </React.Fragment>
//           ))}
//         </div>
//       </div>

//       {/* Track 3 */}
//       <div className="w-full skew-y-2 overflow-hidden my-8">
//         <div className="track-3 flex gap-5 w-fit will-change-transform">
//           {[...Array(6)].map((_, i) => (
//             <React.Fragment key={i}>
//               {track3Tags.map((tag, j) => (
//                 <Tag key={`${i}-${j}`} variant={tag.variant}>
//                   {tag.text}
//                 </Tag>
//               ))}
//             </React.Fragment>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";

export function StatsSection() {
  const Tag = ({ children, variant }: { children: React.ReactNode; variant: 'yellow' | 'red' | 'maroon' | 'purple' | 'outline' }) => {
    const variants: Record<string, string> = {
      yellow: 'bg-[#FFCA24] text-black',
      red: 'bg-[#FF4122] text-white',
      maroon: 'bg-[#610035] text-white',
      purple: 'bg-[#5d2059] text-white',
      outline: 'bg-[#FFFDFE] text-[#610035]'
    };
    return (
      <span className={`px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 lg:px-10 lg:py-4 rounded-[8px] md:rounded-[10px] text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-medium font-sans whitespace-nowrap flex-shrink-0 ${variants[variant]}`}>
        {children}
      </span>
    );
  };

  const track1Tags = [
    { text: "Rise with Rights", variant: "yellow" as const },
    { text: "Migrants Matter", variant: "red" as const },
    { text: "Stand for Justice", variant: "maroon" as const },
    { text: "Equal Voices, Equal Rights", variant: "outline" as const },
    { text: "Building Bridges", variant: "purple" as const },
  ];

  const track2Tags = [
    { text: "Migrants Matter", variant: "red" as const },
    { text: "Building Bridges, Breaking Barriers", variant: "yellow" as const },
    { text: "One Voice, One Movement", variant: "outline" as const },
    { text: "Empower Migrants", variant: "purple" as const },
    { text: "Equal Voices, Equal Rights", variant: "maroon" as const },
  ];

  const track3Tags = [
    { text: "Rise with Rights", variant: "yellow" as const },
    { text: "Stand for Justice", variant: "maroon" as const },
    { text: "Migrants Matter", variant: "red" as const },
    { text: "Justice for All", variant: "outline" as const },
    { text: "Unity in Diversity", variant: "purple" as const },
  ];

  return (
    <div className="min-h-screen overflow-hidden flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-20 justify-center -mt-20 sm:-mt-28 md:-mt-32 lg:-mt-40">
      {/* Track 1 */}
      <div className="w-full skew-y-2 overflow-hidden my-3 sm:my-4 md:my-6 lg:my-8">
        <div className="track-1 flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 w-fit will-change-transform">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              {track1Tags.map((tag, j) => (
                <Tag key={`${i}-${j}`} variant={tag.variant}>
                  {tag.text}
                </Tag>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Track 2 */}
      <div className="w-full -skew-y-2 overflow-hidden my-3 sm:my-4 md:my-6 lg:my-8">
        <div className="track-2 flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 w-fit will-change-transform">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              {track2Tags.map((tag, j) => (
                <Tag key={`${i}-${j}`} variant={tag.variant}>
                  {tag.text}
                </Tag>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Track 3 */}
      <div className="w-full skew-y-2 overflow-hidden my-3 sm:my-4 md:my-6 lg:my-8">
        <div className="track-3 flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 w-fit will-change-transform">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              {track3Tags.map((tag, j) => (
                <Tag key={`${i}-${j}`} variant={tag.variant}>
                  {tag.text}
                </Tag>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}