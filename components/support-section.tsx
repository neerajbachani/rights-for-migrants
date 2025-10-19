// "use client"

// import Image from "next/image"
// import { useImages } from "@/lib/contexts/ImagesContext"
// import LoadingSpinner from "./LoadingSpinner"
// import { Download } from "lucide-react"
// import { useState } from "react"

// export function SupportSection() {
//   const { images, loading, error } = useImages();
//   const [hoveredImage, setHoveredImage] = useState<string | null>(null);

//   // Fallback images if no dynamic images are available
//   const fallbackImages = [
//     { id: "fallback-1", src: "/sm-image-1.png", alt: "Rights for Migrants logo 1" },
//     { id: "fallback-2", src: "/sm-image-1.png", alt: "Rights for Migrants logo 2" },
//     { id: "fallback-3", src: "/sm-image-1.png", alt: "Rights for Migrants logo 3"},
//     { id: "fallback-4", src: "/sm-image-1.png", alt: "Rights for Migrants logo 4"},
//     { id: "fallback-5", src: "/sm-image-1.png", alt: "Rights for Migrants logo 5"},
//     { id: "fallback-6", src: "/sm-image-1.png", alt: "Rights for Migrants logo 6"}
//   ];

//   // Use dynamic images if available, otherwise fallback
//   const displayImages = images.length > 0 ? images : fallbackImages;

//   // Function to download a single image
//   const downloadImage = async (imageUrl: string, filename: string) => {
//     try {
//       const response = await fetch(imageUrl);
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading image:', error);
//     }
//   };

//   // Function to download all images
//   const downloadAllImages = async () => {
//     for (let i = 0; i < displayImages.length; i++) {
//       const image = displayImages[i];
//       const filename = `support-image-${i + 1}.png`;
//       await downloadImage(image.src, filename);
//       // Add a small delay between downloads to prevent browser blocking
//       if (i < displayImages.length - 1) {
//         await new Promise(resolve => setTimeout(resolve, 300));
//       }
//     }
//   };

//   return (
//     <section className="mt-40 px-8 py-16 md:py-24 md:px-12">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl md:text-7xl xl:text-[5rem] font-medium font-sans text-[#610035] mb-8">Support Our Movement</h2>
//           <p className="text-black max-w-4xl text-2xl leading-relaxed font-sans mx-auto mb-14">
//             Raise awareness and show solidarity! Download a selection of profile logos and graphics — designed for social
//             media and messaging apps.
//           </p>
//           <button 
//             onClick={downloadAllImages}
//             className="bg-[#610035] text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2 text-[1rem] cursor-pointer"
//           >
//             Download All
//           </button>
//         </div>

//         {loading && (
//           <div className="flex justify-center mb-16">
//             <LoadingSpinner />
//           </div>
//         )}

//         {error && (
//           <div className="text-center mb-16">
//             <p className="text-red-600 mb-4">Error loading images: {error}</p>
//             <p className="text-gray-600">Showing default images</p>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
//           {displayImages.map((image, index) => (
//             <div
//               key={image.id}
//               className="aspect-square rounded-[1.25rem] flex items-center justify-center relative overflow-hidden transition-transform duration-300 hover:scale-105"
//               onMouseEnter={() => setHoveredImage(image.id)}
//               onMouseLeave={() => setHoveredImage(null)}
//             >
//               <Image
//                 src={image.src}
//                 alt={image.alt}
//                 fill
//                 objectFit="cover"
//                 className="object-cover p-4"
//                 priority={index <= 2}
//               />
              
//               {/* Download button on hover */}
//               {hoveredImage === image.id && (
//                 <div className="absolute inset-0 bg-[#610035]/40 flex items-center justify-center transition-opacity duration-300">
//                   <button
//                     onClick={() => downloadImage(image.src, `support-image-${index + 1}.png`)}
//                     className="bg-white text-[#610035] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg cursor-pointer"
//                   >
//                     <Download className="w-5 h-5" />
//                     Download
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   )
// }

// SupportSection.tsx
"use client";

import Image from "next/image";
import { useImages } from "@/lib/contexts/ImagesContext";
import LoadingSpinner from "./LoadingSpinner";
import { Download } from "lucide-react";
import { useState } from "react";

type ImageItem = { id: string; src: string; alt: string };

export function SupportSection() {
  const { images = [], loading, error } = useImages();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  // Fallback images if no dynamic images are available
  const fallbackImages: ImageItem[] = [
    { id: "fallback-1", src: "/sm-image-1.png", alt: "Rights for Migrants logo 1" },
    { id: "fallback-2", src: "/sm-image-1.png", alt: "Rights for Migrants logo 2" },
    { id: "fallback-3", src: "/sm-image-1.png", alt: "Rights for Migrants logo 3" },
    { id: "fallback-4", src: "/sm-image-1.png", alt: "Rights for Migrants logo 4" },
    { id: "fallback-5", src: "/sm-image-1.png", alt: "Rights for Migrants logo 5" },
    { id: "fallback-6", src: "/sm-image-1.png", alt: "Rights for Migrants logo 6" },
  ];

  // Use dynamic images if available, otherwise fallback
  const displayImages: ImageItem[] = images.length > 0 ? images : fallbackImages;

  // Function to download a single image
  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading image:", err);
    }
  };

  // Function to download all images (light delay between downloads)
  const downloadAllImages = async () => {
    for (let i = 0; i < displayImages.length; i++) {
      const image = displayImages[i];
      const filename = `support-image-${i + 1}.png`;
      // await each download so browser doesn't block many simultaneous downloads
      // Note: some browsers may still prompt or block; this is best-effort
      await downloadImage(image.src, filename);
      if (i < displayImages.length - 1) await new Promise((r) => setTimeout(r, 300));
    }
  };

  return (
    <section className="mt-40 px-4 sm:px-6 md:px-12 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl xl:text-[5rem] font-medium font-sans text-[#610035] mb-4 sm:mb-6 md:mb-8">
            Support Our Movement
          </h2>

          <p className="text-base sm:text-lg md:text-2xl max-w-3xl md:max-w-4xl mx-auto leading-relaxed font-sans mb-8">
            Raise awareness and show solidarity! Download a selection of profile logos and graphics — designed for social
            media and messaging apps.
          </p>

          <button
            onClick={downloadAllImages}
            className="bg-[#610035] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium hover:bg-[#610035]/90 transition-colors inline-flex items-center gap-2 text-[0.95rem] cursor-pointer"
            aria-label="Download all support images"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Download All
          </button>
        </div>

        {loading && (
          <div className="flex justify-center mb-10">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="text-center mb-10">
            <p className="text-red-600 mb-2">Error loading images: {String(error)}</p>
            <p className="text-gray-600">Showing default images</p>
          </div>
        )}

        {/* Responsive grid: 1 col mobile, 2 col small tablets, 3 col md+ (desktop unchanged) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mb-16">
          {displayImages.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-[1.25rem] overflow-hidden flex items-center justify-center transition-transform duration-300 hover:scale-105"
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              {/* Next/Image parent must be relative when using fill */}
              <div className="relative w-full h-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="p-2 md:p-4"
                  priority={index <= 2}
                />
              </div>

              {/* Desktop / tablet hover overlay (unchanged for md+): show on hover only */}
              <div
                className={`absolute inset-0 bg-[#610035]/40 flex items-center justify-center transition-opacity duration-300 pointer-events-none md:pointer-events-auto ${
                  hoveredImage === image.id ? "opacity-100" : "opacity-0"
                } hidden md:flex`}
                role="presentation"
              >
                <button
                  onClick={() => downloadImage(image.src, `support-image-${index + 1}.png`)}
                  className="pointer-events-auto bg-white text-[#610035] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg"
                  aria-label={`Download ${image.alt}`}
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>

              {/* Mobile / touch friendly: small persistent download button bottom-right (visible only on small screens) */}
              <div className="absolute bottom-3 right-3 md:hidden">
                <button
                  onClick={() => downloadImage(image.src, `support-image-${index + 1}.png`)}
                  className="bg-white/95 text-[#610035] px-3 py-2 rounded-full font-medium hover:opacity-95 transition-shadow shadow-md inline-flex items-center gap-2"
                  aria-label={`Download ${image.alt}`}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
