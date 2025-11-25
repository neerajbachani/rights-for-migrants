
import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";

export function Header() {
  return (
    <header className="bg-[#610035] py-8 px-6 md:py-8 md:px-12 lg:px-8 lg:py-8">
      <div className="max-w-7xl lg:max-w-[100rem] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        <div className="w-[180px] sm:w-[200px] md:w-[230px] lg:w-auto">
          <Image
            src="/logo.svg"
            alt="Right for Migrants"
            width={257}
            height={120}
            className="w-full h-auto object-contain"
          />
        </div>
        <Link
          href="https://www.instagram.com/rightsformigrants_uk/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 mr-0 md:mr-60 rounded-full backdrop-blur-sm"
        >
          <span className="font-medium text-xs sm:text-lg">Connect with us</span>
          <Instagram className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}
