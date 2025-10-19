// export function MovementSection() {
//   return (
//     <section className="w-full">
//       <div className="md:max-w-7xl xl:max-w-[102rem] mx-auto px-8 md:px-12 py-20">
//         <h2 className="text-[#610035] text-[5rem] md:text-[5rem] xl:text-[5.8rem] leading-tight font-light font-sans text-left">
//           Join the Movement advocating for fair policies. Together, we can make a difference.
//         </h2>
//       </div>
//     </section>
//   )
// }

export function MovementSection() {
  return (
    <section className="w-full">
      <div className="md:max-w-7xl xl:max-w-[102rem] mx-auto px-6 sm:px-8 md:px-12 py-12 md:py-20">
        <h2
          className="
            text-[#610035]
            text-3xl sm:text-4xl md:text-[5rem] xl:text-[5.8rem]
            leading-snug sm:leading-tight md:leading-tight
            font-light font-sans text-left
          "
        >
          Join the Movement advocating for fair policies.{" "}
          <span className="block sm:inline">Together, we can make a difference.</span>
        </h2>
      </div>
    </section>
  )
}
