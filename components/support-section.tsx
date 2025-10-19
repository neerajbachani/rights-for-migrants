"use client"

import Image from "next/image"
import { useImages } from "@/lib/contexts/ImagesContext"
import LoadingSpinner from "./LoadingSpinner"
import { Download } from "lucide-react"
import { useState } from "react"

export function SupportSection() {
  const { images, loading, error } = useImages();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  // Fallback images if no dynamic images are available
  const fallbackImages = [
    { id: "fallback-1", src: "/sm-image-1.png", alt: "Rights for Migrants logo 1" },
    { id: "fallback-2", src: "/sm-image-1.png", alt: "Rights for Migrants logo 2" },
    { id: "fallback-3", src: "/sm-image-1.png", alt: "Rights for Migrants logo 3"},
    { id: "fallback-4", src: "/sm-image-1.png", alt: "Rights for Migrants logo 4"},
    { id: "fallback-5", src: "/sm-image-1.png", alt: "Rights for Migrants logo 5"},
    { id: "fallback-6", src: "/sm-image-1.png", alt: "Rights for Migrants logo 6"}
  ];

  // Use dynamic images if available, otherwise fallback
  const displayImages = images.length > 0 ? images : fallbackImages;

  // Function to download a single image
  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  // Function to download all images
  const downloadAllImages = async () => {
    for (let i = 0; i < displayImages.length; i++) {
      const image = displayImages[i];
      const filename = `support-image-${i + 1}.png`;
      await downloadImage(image.src, filename);
      // Add a small delay between downloads to prevent browser blocking
      if (i < displayImages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  };

  return (
    <section className="mt-40 px-8 py-16 md:py-24 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-7xl xl:text-[5rem] font-medium font-sans text-[#610035] mb-8">Support Our Movement</h2>
          <p className="text-black max-w-4xl text-2xl leading-relaxed font-sans mx-auto mb-14">
            Raise awareness and show solidarity! Download a selection of profile logos and graphics — designed for social
            media and messaging apps.
          </p>
          <button 
            onClick={downloadAllImages}
            className="bg-[#610035] text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2 text-[1rem] cursor-pointer"
          >
            Download All
          </button>
        </div>

        {loading && (
          <div className="flex justify-center mb-16">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="text-center mb-16">
            <p className="text-red-600 mb-4">Error loading images: {error}</p>
            <p className="text-gray-600">Showing default images</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {displayImages.map((image, index) => (
            <div
              key={image.id}
              className="aspect-square rounded-[1.25rem] flex items-center justify-center relative overflow-hidden transition-transform duration-300 hover:scale-105"
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                objectFit="cover"
                className="object-cover p-4"
                priority={index <= 2}
              />
              
              {/* Download button on hover */}
              {hoveredImage === image.id && (
                <div className="absolute inset-0 bg-[#610035]/40 flex items-center justify-center transition-opacity duration-300">
                  <button
                    onClick={() => downloadImage(image.src, `support-image-${index + 1}.png`)}
                    className="bg-white text-[#610035] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}