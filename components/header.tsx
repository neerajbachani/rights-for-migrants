import Image from "next/image";

export function Header() {
  return (
    <header className="bg-[#610035] md:py-8 lg:px-8 lg:py-8 md:px-12">
     
      <div className="max-w-7xl lg:max-w-[100rem]  mx-auto">
        <div className="">
          <Image src="/logo.png" alt="Right for Migrants" width={257} height={120} objectFit="contain" />
        </div>
      </div>
    </header>
  )
}
