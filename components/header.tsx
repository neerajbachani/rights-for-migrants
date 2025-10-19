// import Image from "next/image";

// export function Header() {
//   return (
//     <header className="bg-[#610035] md:py-8 lg:px-8 lg:py-8 md:px-12">
     
//       <div className="max-w-7xl lg:max-w-[100rem]  mx-auto">
//         <div className="">
//           <Image src="/logo.png" alt="Right for Migrants" width={257} height={120} objectFit="contain" />
//         </div>
//       </div>
//     </header>
//   )
// }
import Image from "next/image";

export function Header() {
  return (
    <header className="bg-[#610035] py-8 px-6 md:py-8 md:px-12 lg:px-8 lg:py-8">
      <div className="max-w-7xl lg:max-w-[100rem] mx-auto flex justify-center md:justify-start">
        <div className="w-[180px] sm:w-[200px] md:w-[230px] lg:w-auto">
          <Image
            src="/logo.png"
            alt="Right for Migrants"
            width={257}
            height={120}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </header>
  );
}
