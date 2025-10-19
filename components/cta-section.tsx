// "use client"

// import { ArrowRight, X, CheckCircle, AlertCircle } from "lucide-react"
// import { useEffect, useRef, useState } from "react"
// import { useSubmitForm } from "@/lib/hooks/useSubmitForm"
// import { validateFormSubmission } from "@/lib/utils/formValidation"
// import { FormValidationError } from "@/lib/types/form"

// export function CTASection() {
//   const ctaRef = useRef<HTMLDivElement>(null)
//   const headingRef = useRef<HTMLHeadingElement>(null)
//   const buttonRef = useRef<HTMLButtonElement>(null)
//   const statsRef = useRef<HTMLDivElement>(null)
//   const counterRef = useRef<HTMLHeadingElement>(null)
//   const modalRef = useRef<HTMLDivElement>(null)
//   const modalOverlayRef = useRef<HTMLDivElement>(null)
  
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: ''
//   })
//   const [validationErrors, setValidationErrors] = useState<FormValidationError[]>([])
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  
//   const { submitForm, isLoading, error, isSuccess, reset } = useSubmitForm()

//   useEffect(() => {
//     // Dynamically load GSAP
//     const script = document.createElement('script')
//     script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
//     script.async = true
    
//     const scrollScript = document.createElement('script')
//     scrollScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
//     scrollScript.async = true
    
//     let scriptsLoaded = 0
//     const onScriptLoad = () => {
//       scriptsLoaded++
//       if (scriptsLoaded === 2 && (window as any).gsap) {
//         const gsap = (window as any).gsap
//         const ScrollTrigger = (window as any).ScrollTrigger
//         gsap.registerPlugin(ScrollTrigger)
        
//         if (!ctaRef.current || !headingRef.current || !buttonRef.current || !statsRef.current || !counterRef.current) return

//         // Create timeline for smooth sequential animation
//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: ctaRef.current,
//             start: "top 80%",
//             end: "top 20%",
//             toggleActions: "play none none reverse"
//           }
//         })

//         // Animate the CTA box sliding in from left
//         tl.fromTo(
//           ctaRef.current,
//           {
//             x: -200,
//             opacity: 0
//           },
//           {
//             x: 0,
//             opacity: 1,
//             duration: 1.2,
//             ease: "power3.out"
//           }
//         )
        
//         // Animate heading with slight delay
//         .fromTo(
//           headingRef.current,
//           {
//             x: -100,
//             opacity: 0
//           },
//           {
//             x: 0,
//             opacity: 1,
//             duration: 0.8,
//             ease: "power2.out"
//           },
//           "-=0.8"
//         )
        
//         // Animate button with scale effect
//         .fromTo(
//           buttonRef.current,
//           {
//             scale: 0,
//             opacity: 0
//           },
//           {
//             scale: 1,
//             opacity: 1,
//             duration: 0.6,
//             ease: "back.out(1.7)"
//           },
//           "-=0.4"
//         )
        
//         // Animate stats section
//         .fromTo(
//           statsRef.current,
//           {
//             y: 50,
//             opacity: 0
//           },
//           {
//             y: 0,
//             opacity: 1,
//             duration: 0.8,
//             ease: "power2.out"
//           },
//           "-=0.3"
//         )

//         // Animate counter incrementing
//         const counter = { value: 0 }
//         gsap.to(counter, {
//           value: 2178,
//           duration: 2,
//           ease: "power1.out",
//           scrollTrigger: {
//             trigger: counterRef.current,
//             start: "top 80%",
//             toggleActions: "play none none reverse"
//           },
//           onUpdate: function() {
//             if (counterRef.current) {
//               counterRef.current.textContent = Math.floor(counter.value).toLocaleString()
//             }
//           }
//         })

//         // Add hover animation for button
//         const btn = buttonRef.current
//         if (btn) {
//           const handleMouseEnter = () => {
//             gsap.to(btn, {
//               scale: 1.1,
//               rotation: 90,
//               duration: 0.3,
//               ease: "power2.out"
//             })
//           }

//           const handleMouseLeave = () => {
//             gsap.to(btn, {
//               scale: 1,
//               rotation: 0,
//               duration: 0.3,
//               ease: "power2.out"
//             })
//           }

//           btn.addEventListener('mouseenter', handleMouseEnter)
//           btn.addEventListener('mouseleave', handleMouseLeave)

//           // Cleanup
//           return () => {
//             btn.removeEventListener('mouseenter', handleMouseEnter)
//             btn.removeEventListener('mouseleave', handleMouseLeave)
//           }
//         }
//       }
//     }
    
//     script.onload = onScriptLoad
//     scrollScript.onload = onScriptLoad
    
//     document.head.appendChild(script)
//     document.head.appendChild(scrollScript)

//     return () => {
//       if (document.head.contains(script)) {
//         document.head.removeChild(script)
//       }
//       if (document.head.contains(scrollScript)) {
//         document.head.removeChild(scrollScript)
//       }
//     }
//   }, [])

//   // Modal animation effect
//   useEffect(() => {
//     if ((window as any).gsap && modalRef.current && modalOverlayRef.current) {
//       const gsap = (window as any).gsap
      
//       if (isModalOpen) {
//         // Animate overlay fade in
//         gsap.fromTo(
//           modalOverlayRef.current,
//           { opacity: 0 },
//           { opacity: 1, duration: 0.3, ease: "power2.out" }
//         )
        
//         // Animate modal slide in from left
//         gsap.fromTo(
//           modalRef.current,
//           { x: -800, opacity: 0 },
//           { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
//         )
//       }
//     }
//   }, [isModalOpen])

//   const openModal = () => {
//     setIsModalOpen(true)
//   }



//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     // Clear previous validation errors
//     setValidationErrors([])
    
//     // Validate form data
//     const validation = validateFormSubmission(formData)
//     if (!validation.isValid) {
//       setValidationErrors(validation.errors)
//       return
//     }
    
//     try {
//       await submitForm(formData)
//       // Show success message
//       setShowSuccessMessage(true)
//       // Reset form after successful submission
//       setFormData({ name: '', email: '', message: '' })
//       // Close modal after a brief delay to show success message
//       setTimeout(() => {
//         setShowSuccessMessage(false)
//         closeModal()
//         reset() // Reset the mutation state
//       }, 2000)
//     } catch (error) {
//       // Error is handled by the hook, no additional action needed
//       console.error('Form submission error:', error)
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: value
//     })
    
//     // Clear validation error for this field when user starts typing
//     if (validationErrors.length > 0) {
//       setValidationErrors(prev => prev.filter(error => error.field !== name))
//     }
//   }

//   const closeModal = () => {
//     if ((window as any).gsap && modalRef.current && modalOverlayRef.current) {
//       const gsap = (window as any).gsap
      
//       // Animate modal slide out to left
//       gsap.to(modalRef.current, {
//         x: -800,
//         opacity: 0,
//         duration: 0.6,
//         ease: "power3.in"
//       })
      
//       // Animate overlay fade out
//       gsap.to(modalOverlayRef.current, {
//         opacity: 0,
//         duration: 0.3,
//         ease: "power2.in",
//         onComplete: () => {
//           setIsModalOpen(false)
//           // Reset form state when modal closes
//           setFormData({ name: '', email: '', message: '' })
//           setValidationErrors([])
//           setShowSuccessMessage(false)
//           reset() // Reset the mutation state
//         }
//       })
//     } else {
//       setIsModalOpen(false)
//       // Reset form state when modal closes
//       setFormData({ name: '', email: '', message: '' })
//       setValidationErrors([])
//       setShowSuccessMessage(false)
//       reset() // Reset the mutation state
//     }
//   }

//   // Helper function to get validation error for a field
//   const getFieldError = (fieldName: string) => {
//     return validationErrors.find(error => error.field === fieldName)?.message
//   }

//   return (
//     <>
//       <section className="py-20 w-full overflow-hidden min-h-screen flex items-center">
//         <div className="w-full">
//           <div className="md:mr-20 xl:mr-40">
//             <div 
//               ref={ctaRef}
//               className="bg-[#FFCA24] rounded-tr-full rounded-br-full py-12 md:py-20 flex flex-col md:flex-row items-center justify-between px-20"
//             >
//               <h3 
//                 ref={headingRef}
//                 className="font-medium text-4xl xl:text-7xl md:text-6xl text-[#610035] mb-8 md:mb-0"
//               >
//                 Join the Movement
//               </h3>
//               <button 
//                 ref={buttonRef}
//                 onClick={openModal}
//                 className="bg-[#610035] text-white rounded-full w-28 h-28 hover:bg-[#610035]/95 duration-200 transition-colors flex items-center justify-center"
//               >
//                 <ArrowRight className="w-6 h-6 xl:w-10 xl:h-10" />
//               </button>
//             </div>
//           </div>
//           <div ref={statsRef} className="w-full mt-12">
//             <div className="lg:max-w-4xl mx-auto px-8 md:px-12 text-center">
//               <h2 ref={counterRef} className="text-8xl md:text-9xl font-sans leading-relaxed font-medium text-[#610035]">0</h2>
//               <p className="text-4xl md:text-6xl -mt-8 md:-mt-16 text-[#610035] text-left leading-relaxed font-medium font-sans">
//                 people have joined the <br /> movement!
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           {/* Overlay */}
//           <div 
//             ref={modalOverlayRef}
//             className="absolute inset-0 bg-black/50"
//             onClick={closeModal}
//           />
          
//           {/* Modal Content */}
//           <div 
//             ref={modalRef}
//             className="relative bg-[#FFD03D] rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-2xl"
//           >
//             <button
//               onClick={closeModal}
//               className="absolute top-6 right-6 bg-[#610035] text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#610035]/90 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             <div className="mt-4">
//               <h2 className="text-4xl md:text-6xl font-medium text-[#610035] mb-6">
//                 Welcome to the Movement
//               </h2>
              
//               <p className="text-xl md:text-2xl text-[#610035]/80 mb-8">
//                 Join thousands of people making a difference. Fill out the details below to get started.
//               </p>

//               {/* Success Message */}
//               {showSuccessMessage && (
//                 <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-xl flex items-center gap-3">
//                   <CheckCircle className="w-6 h-6 text-green-600" />
//                   <p className="text-green-800 font-medium">
//                     Thank you for joining the movement! We'll be in touch soon.
//                   </p>
//                 </div>
//               )}

//               {/* Error Message */}
//               {error && !showSuccessMessage && (
//                 <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-xl flex items-center gap-3">
//                   <AlertCircle className="w-6 h-6 text-red-600" />
//                   <p className="text-red-800 font-medium">
//                     {error}
//                   </p>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label htmlFor="name" className="block text-lg font-medium text-[#610035] mb-2">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none text-lg ${
//                       getFieldError('name') 
//                         ? 'border-red-400 focus:border-red-500' 
//                         : 'border-[#610035]/20 focus:border-[#610035]'
//                     }`}
//                     placeholder="Enter your name"
//                     disabled={isLoading}
//                   />
//                   {getFieldError('name') && (
//                     <p className="mt-2 text-red-600 text-sm">{getFieldError('name')}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="email" className="block text-lg font-medium text-[#610035] mb-2">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none text-lg ${
//                       getFieldError('email') 
//                         ? 'border-red-400 focus:border-red-500' 
//                         : 'border-[#610035]/20 focus:border-[#610035]'
//                     }`}
//                     placeholder="Enter your email"
//                     disabled={isLoading}
//                   />
//                   {getFieldError('email') && (
//                     <p className="mt-2 text-red-600 text-sm">{getFieldError('email')}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="message" className="block text-lg font-medium text-[#610035] mb-2">
//                     Why do you want to join?
//                   </label>
//                   <textarea
//                     id="message"
//                     name="message"
//                     value={formData.message}
//                     onChange={handleInputChange}
//                     rows={4}
//                     className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none text-lg resize-none ${
//                       getFieldError('message') 
//                         ? 'border-red-400 focus:border-red-500' 
//                         : 'border-[#610035]/20 focus:border-[#610035]'
//                     }`}
//                     placeholder="Tell us your story..."
//                     disabled={isLoading}
//                   />
//                   {getFieldError('message') && (
//                     <p className="mt-2 text-red-600 text-sm">{getFieldError('message')}</p>
//                   )}
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isLoading || showSuccessMessage}
//                   className={`w-full py-4 rounded-xl text-xl font-medium transition-colors flex items-center justify-center gap-3 ${
//                     isLoading || showSuccessMessage
//                       ? 'bg-[#610035]/50 cursor-not-allowed'
//                       : 'bg-[#610035] hover:bg-[#610035]/90'
//                   } text-white`}
//                 >
//                   {isLoading ? (
//                     <>
//                       <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       Submitting...
//                     </>
//                   ) : showSuccessMessage ? (
//                     <>
//                       <CheckCircle className="w-6 h-6" />
//                       Submitted!
//                     </>
//                   ) : (
//                     <>
//                       Submit
//                       <ArrowRight className="w-6 h-6" />
//                     </>
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// CTASection.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, X, CheckCircle, AlertCircle } from "lucide-react";
import { useSubmitForm } from "@/lib/hooks/useSubmitForm";
import { validateFormSubmission } from "@/lib/utils/formValidation";
import { FormValidationError } from "@/lib/types/form";

export function CTASection() {
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLHeadingElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalOverlayRef = useRef<HTMLDivElement | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [validationErrors, setValidationErrors] = useState<FormValidationError[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { submitForm, isLoading, error, isSuccess, reset } = useSubmitForm();

  // -------------------------
  // Load GSAP + ScrollTrigger dynamically and initialize animations
  // -------------------------
  useEffect(() => {
    let scriptGsap: HTMLScriptElement | null = null;
    let scriptScrollTrigger: HTMLScriptElement | null = null;
    let btnMouseEnter: (() => void) | null = null;
    let btnMouseLeave: (() => void) | null = null;

    const loadScripts = () => {
      return new Promise<void>((resolve, reject) => {
        let loaded = 0;
        const checkResolve = () => {
          loaded += 1;
          if (loaded === 2) resolve();
        };

        scriptGsap = document.createElement("script");
        scriptGsap.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
        scriptGsap.async = true;
        scriptGsap.onload = checkResolve;
        scriptGsap.onerror = () => reject(new Error("Failed to load gsap"));

        scriptScrollTrigger = document.createElement("script");
        scriptScrollTrigger.src =
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
        scriptScrollTrigger.async = true;
        scriptScrollTrigger.onload = checkResolve;
        scriptScrollTrigger.onerror = () => reject(new Error("Failed to load ScrollTrigger"));

        document.head.appendChild(scriptGsap);
        document.head.appendChild(scriptScrollTrigger);
      });
    };

    let gsapTimeline: any = null;
    let scrollTriggerCounterAnim: any = null;

    loadScripts()
      .then(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const gsap = (window as any).gsap;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const ScrollTrigger = (window as any).ScrollTrigger;
        if (!gsap || !ScrollTrigger) return;

        gsap.registerPlugin(ScrollTrigger);

        if (!ctaRef.current || !headingRef.current || !buttonRef.current || !statsRef.current || !counterRef.current) {
          // nothing to animate if refs are missing
          return;
        }

        // timeline that triggers when CTA is in view
        gsapTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        });

        // CTA slide in
        gsapTimeline.fromTo(
          ctaRef.current,
          { x: -200, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
        );

        // heading
        gsapTimeline.fromTo(
          headingRef.current,
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.8"
        );

        // button with scale
        gsapTimeline.fromTo(
          buttonRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.4"
        );

        // stats slide up
        gsapTimeline.fromTo(
          statsRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.3"
        );

        // counter animation that triggers when counter visible
        const counter = { value: 0 };
        scrollTriggerCounterAnim = gsap.to(counter, {
          value: 2178,
          duration: 2,
          ease: "power1.out",
          scrollTrigger: {
            trigger: counterRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          onUpdate: function () {
            if (counterRef.current) {
              counterRef.current.textContent = Math.floor(counter.value).toLocaleString();
            }
          },
        });

        // button hover animations
        const btn = buttonRef.current;
        if (btn) {
          btnMouseEnter = () => {
            gsap.to(btn, { scale: 1.1, rotation: 90, duration: 0.3, ease: "power2.out" });
          };
          btnMouseLeave = () => {
            gsap.to(btn, { scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" });
          };

          btn.addEventListener("mouseenter", btnMouseEnter);
          btn.addEventListener("mouseleave", btnMouseLeave);
        }
      })
      .catch((err) => {
        console.error("GSAP load/initialize error:", err);
      });

    return () => {
      // cleanup GSAP animations and ScrollTriggers
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const gsap = (window as any).gsap;
        if (gsap && gsapTimeline && gsapTimeline.kill) {
          gsapTimeline.kill();
        }
        if (scrollTriggerCounterAnim && scrollTriggerCounterAnim.kill) {
          scrollTriggerCounterAnim.kill();
        }
        // Also kill all ScrollTriggers if available
        if ((window as any).ScrollTrigger && (window as any).ScrollTrigger.kill) {
          try {
            (window as any).ScrollTrigger.getAll?.().forEach((st: any) => st.kill && st.kill());
          } catch (e) {
            // ignore
          }
        }
      } catch (e) {
        // ignore
      }

      // remove event listeners from button
      if (buttonRef.current) {
        if (btnMouseEnter) buttonRef.current.removeEventListener("mouseenter", btnMouseEnter);
        if (btnMouseLeave) buttonRef.current.removeEventListener("mouseleave", btnMouseLeave);
      }

      // remove scripts
      if (scriptGsap && document.head.contains(scriptGsap)) document.head.removeChild(scriptGsap);
      if (scriptScrollTrigger && document.head.contains(scriptScrollTrigger)) document.head.removeChild(scriptScrollTrigger);
    };
  }, []); // run once on mount

  // -------------------------
  // Modal animation on open (uses already-loaded gsap if present)
  // -------------------------
  useEffect(() => {
    if ((window as any).gsap && isModalOpen && modalRef.current && modalOverlayRef.current) {
      const gsap = (window as any).gsap;

      gsap.fromTo(modalOverlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(modalRef.current, { x: -800, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" });
    }
  }, [isModalOpen]);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    if ((window as any).gsap && modalRef.current && modalOverlayRef.current) {
      const gsap = (window as any).gsap;

      gsap.to(modalRef.current, { x: -800, opacity: 0, duration: 0.6, ease: "power3.in" });
      gsap.to(modalOverlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          // close & reset once animation completes
          setIsModalOpen(false);
          setFormData({ name: "", email: "", message: "" });
          setValidationErrors([]);
          setShowSuccessMessage(false);
          reset();
        },
      });
    } else {
      setIsModalOpen(false);
      setFormData({ name: "", email: "", message: "" });
      setValidationErrors([]);
      setShowSuccessMessage(false);
      reset();
    }
  };

  // -------------------------
  // Form handling
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationErrors([]);

    const validation = validateFormSubmission(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      await submitForm(formData);
      setShowSuccessMessage(true);
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => {
        setShowSuccessMessage(false);
        closeModal();
        reset();
      }, 2000);
    } catch (err) {
      // hook handles error display; keep console for debugging
      console.error("Form submission error:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors.length > 0) {
      setValidationErrors((prev) => prev.filter((error) => error.field !== name));
    }
  };

  const getFieldError = (fieldName: string) => validationErrors.find((err) => err.field === fieldName)?.message;

  return (
    <>
      <section className="py-16 sm:py-20 w-full overflow-hidden min-h-[70vh] sm:min-h-screen flex items-center">
        <div className="w-full">
          <div className="md:mr-20 xl:mr-40">
            <div
              ref={ctaRef}
              className="bg-[#FFCA24] rounded-tr-[4rem] rounded-br-[4rem] sm:rounded-tr-full sm:rounded-br-full py-10 sm:py-16 md:py-20 flex flex-col md:flex-row items-center justify-between px-8 sm:px-12 md:px-20 gap-8 sm:gap-0"
            >
              <h3
                ref={headingRef}
                className="font-medium text-3xl sm:text-5xl md:text-6xl xl:text-7xl text-[#610035] text-center md:text-left"
              >
                Join the Movement
              </h3>

              <button
                ref={buttonRef}
                onClick={openModal}
                aria-label="Open join form"
                className="bg-[#610035] text-white rounded-full w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 hover:bg-[#610035]/95 duration-200 transition-colors flex items-center justify-center"
              >
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 xl:w-10 xl:h-10" />
              </button>
            </div>
          </div>

          <div ref={statsRef} className="w-full mt-10 sm:mt-12">
            <div className="max-w-2xl sm:max-w-4xl mx-auto px-6 sm:px-12 text-center">
              <h2
                ref={counterRef}
                className="text-6xl sm:text-8xl md:text-9xl font-sans leading-relaxed font-medium text-[#610035]"
              >
                0
              </h2>

              <p className="text-2xl sm:text-4xl md:text-6xl -mt-4 sm:-mt-8 md:-mt-16 text-[#610035] text-center sm:text-left leading-snug md:leading-relaxed font-medium font-sans">
                people have joined the <br className="hidden sm:block" /> movement!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            ref={modalOverlayRef}
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />

          {/* Modal content */}
          <div
            ref={modalRef}
            className="relative bg-[#FFD03D] rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 max-w-lg sm:max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-[#610035] text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-[#610035]/90 transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="mt-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium text-[#610035] mb-4 sm:mb-6">
                Welcome to the Movement
              </h2>

              <p className="text-base sm:text-xl md:text-2xl text-[#610035]/80 mb-6 sm:mb-8">
                Join thousands of people making a difference. Fill out the details below to get started.
              </p>

              {/* Success Message */}
              {showSuccessMessage && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="text-green-800 font-medium">Thank you for joining the movement! We'll be in touch soon.</p>
                </div>
              )}

              {/* Error Message */}
              {error && !showSuccessMessage && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-lg font-medium text-[#610035] mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none text-lg ${
                      getFieldError("name") ? "border-red-400 focus:border-red-500" : "border-[#610035]/20 focus:border-[#610035]"
                    }`}
                    placeholder="Enter your name"
                    disabled={isLoading}
                    type="text"
                  />
                  {getFieldError("name") && <p className="mt-2 text-red-600 text-sm">{getFieldError("name")}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-[#610035] mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none text-lg ${
                      getFieldError("email") ? "border-red-400 focus:border-red-500" : "border-[#610035]/20 focus:border-[#610035]"
                    }`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    type="email"
                  />
                  {getFieldError("email") && <p className="mt-2 text-red-600 text-sm">{getFieldError("email")}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-lg font-medium text-[#610035] mb-2">
                    Why do you want to join?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none text-lg resize-none ${
                      getFieldError("message") ? "border-red-400 focus:border-red-500" : "border-[#610035]/20 focus:border-[#610035]"
                    }`}
                    placeholder="Tell us your story..."
                    disabled={isLoading}
                  />
                  {getFieldError("message") && <p className="mt-2 text-red-600 text-sm">{getFieldError("message")}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || showSuccessMessage}
                  className={`w-full py-4 rounded-xl text-xl font-medium transition-colors flex items-center justify-center gap-3 ${
                    isLoading || showSuccessMessage ? "bg-[#610035]/50 cursor-not-allowed" : "bg-[#610035] hover:bg-[#610035]/90"
                  } text-white`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : showSuccessMessage ? (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      Submitted!
                    </>
                  ) : (
                    <>
                      Submit
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
