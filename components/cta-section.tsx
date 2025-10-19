"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, X, CheckCircle, AlertCircle } from "lucide-react";

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
    phone: "",
    address: "",
    nationality: "",
    visaStatus: "",
    message: "",
    consent: false,
  });
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;
        if (!gsap || !ScrollTrigger) return;

        gsap.registerPlugin(ScrollTrigger);

        if (!ctaRef.current || !headingRef.current || !buttonRef.current || !statsRef.current || !counterRef.current) {
          return;
        }

        gsapTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        });

        gsapTimeline.fromTo(
          ctaRef.current,
          { x: -200, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
        );

        gsapTimeline.fromTo(
          headingRef.current,
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.8"
        );

        gsapTimeline.fromTo(
          buttonRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.4"
        );

        gsapTimeline.fromTo(
          statsRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.3"
        );

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
      try {
        const gsap = (window as any).gsap;
        if (gsap && gsapTimeline && gsapTimeline.kill) {
          gsapTimeline.kill();
        }
        if (scrollTriggerCounterAnim && scrollTriggerCounterAnim.kill) {
          scrollTriggerCounterAnim.kill();
        }
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

      if (buttonRef.current) {
        if (btnMouseEnter) buttonRef.current.removeEventListener("mouseenter", btnMouseEnter);
        if (btnMouseLeave) buttonRef.current.removeEventListener("mouseleave", btnMouseLeave);
      }

      if (scriptGsap && document.head.contains(scriptGsap)) document.head.removeChild(scriptGsap);
      if (scriptScrollTrigger && document.head.contains(scriptScrollTrigger)) document.head.removeChild(scriptScrollTrigger);
    };
  }, []);

  // -------------------------
  // Modal animation on open
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
          setIsModalOpen(false);
          setFormData({ name: "", email: "", phone: "", address: "", nationality: "", visaStatus: "", message: "", consent: false });
          setValidationErrors([]);
          setShowSuccessMessage(false);
          setError("");
        },
      });
    } else {
      setIsModalOpen(false);
      setFormData({ name: "", email: "", phone: "", address: "", nationality: "", visaStatus: "", message: "", consent: false });
      setValidationErrors([]);
      setShowSuccessMessage(false);
      setError("");
    }
  };

  // -------------------------
  // Form handling
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationErrors([]);
    setError("");

    // Basic validation
    const errors: any[] = [];
    if (!formData.name.trim()) errors.push({ field: "name", message: "Name is required" });
    if (!formData.phone.trim()) errors.push({ field: "phone", message: "Phone is required" });
    if (!formData.address.trim()) errors.push({ field: "address", message: "Address is required" });
    if (!formData.nationality.trim()) errors.push({ field: "nationality", message: "Nationality is required" });
    if (!formData.visaStatus) errors.push({ field: "visaStatus", message: "Visa status is required" });
    if (!formData.consent) errors.push({ field: "consent", message: "You must agree to continue" });

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessMessage(true);
      setFormData({ name: "", email: "", phone: "", address: "", nationality: "", visaStatus: "", message: "", consent: false });

      setTimeout(() => {
        setShowSuccessMessage(false);
        closeModal();
      }, 2000);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors.length > 0) {
      setValidationErrors((prev) => prev.filter((error) => error.field !== name));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));

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
                className="font-medium font-besley text-3xl sm:text-5xl md:text-6xl xl:text-7xl text-[#610035] text-center md:text-left"
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
            <div className="max-w-2xl sm:max-w-6xl mx-auto px-6 sm:px-12 text-center">
              <h2
                ref={counterRef}
                className="text-6xl sm:text-8xl md:text-9xl font-sans leading-relaxed font-medium text-[#610035]"
              >
                0
              </h2>

              <p className="text-2xl sm:text-4xl  md:text-6xl -mt-4 sm:-mt-8 md:-mt-16 xl:-mt-8 text-[#610035] text-center sm:text-left leading-snug md:leading-relaxed font-medium font-besley">
                people have joined the movement!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
          {/* Overlay */}
          <div
            ref={modalOverlayRef}
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />

          {/* Modal content */}
          <div
            ref={modalRef}
            className="relative bg-[#FFD03D] rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-4xl w-full shadow-2xl max-h-[95vh] flex flex-col"
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#610035] text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#610035]/90 transition-colors z-10"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="overflow-y-auto p-6 flex-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#610035] mb-2 pr-10">
                Welcome to the Movement
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-[#610035]/80 mb-4">
                Join thousands of people making a difference.
              </p>

              {/* Success Message */}
              {showSuccessMessage && (
                <div className="mb-3 p-3 bg-green-100 border border-green-400 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-800 font-medium text-sm">Thank you for joining! We'll be in touch soon.</p>
                </div>
              )}

              {/* Error Message */}
              {error && !showSuccessMessage && (
                <div className="mb-3 p-3 bg-red-100 border border-red-400 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 font-medium text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#610035] mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm ${
                        getFieldError("name") ? "border-red-400 focus:border-red-500" : "border-[#610035]/20 focus:border-[#610035]"
                      }`}
                      placeholder="Enter your name"
                      disabled={isLoading}
                      type="text"
                    />
                    {getFieldError("name") && <p className="mt-1 text-red-600 text-xs">{getFieldError("name")}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#610035] mb-1">
                      Email <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm ${
                        getFieldError("email") ? "border-red-400 focus:border-red-500" : "border-[#610035]/20 focus:border-[#610035]"
                      }`}
                      placeholder="Enter your email"
                      disabled={isLoading}
                      type="email"
                    />
                    {getFieldError("email") && <p className="mt-1 text-red-600 text-xs">{getFieldError("email")}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#610035] mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm ${
                        getFieldError("phone") ? "border-red-400 focus:border-red-500" : "border-[#610035]/20 focus:border-[#610035]"
                      }`}
                      placeholder="Enter phone number"
                      disabled={isLoading}
                      type="tel"
                    />
                    {getFieldError("phone") && <p className="mt-1 text-red-600 text-xs">{getFieldError("phone")}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-[#610035] mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm ${
                        getFieldError("address") ? "border-red-400 focus:border-red-500" : "border-[#610035]/20 focus:border-[#610035]"
                      }`}
                      placeholder="Enter your address"
                      disabled={isLoading}
                      type="text"
                    />
                    {getFieldError("address") && <p className="mt-1 text-red-600 text-xs">{getFieldError("address")}</p>}
                  </div>

                  <div>
                    <label htmlFor="nationality" className="block text-sm font-medium text-[#610035] mb-1">
                      Nationality <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm ${
                        getFieldError("nationality") ? "border-red-400 focus:border-red-500" : "border-[#610035]/20 focus:border-[#610035]"
                      }`}
                      placeholder="Enter nationality"
                      disabled={isLoading}
                      type="text"
                    />
                    {getFieldError("nationality") && <p className="mt-1 text-red-600 text-xs">{getFieldError("nationality")}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="visaStatus" className="block text-sm font-medium text-[#610035] mb-1">
                      Visa Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="visaStatus"
                      name="visaStatus"
                      value={formData.visaStatus}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm ${
                        getFieldError("visaStatus") ? "border-red-400 focus:border-red-500" : "border-[#610035]/20 focus:border-[#610035]"
                      }`}
                      disabled={isLoading}
                    >
                      <option value="">Select visa status</option>
                      <option value="Citizen">Citizen</option>
                      <option value="Permanent Resident">Permanent Resident</option>
                      <option value="Work Visa">Work Visa</option>
                      <option value="Student Visa">Student Visa</option>
                      <option value="Tourist Visa">Tourist Visa</option>
                      <option value="Other">Other</option>
                    </select>
                    {getFieldError("visaStatus") && <p className="mt-1 text-red-600 text-xs">{getFieldError("visaStatus")}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#610035] mb-1">
                      Why join? <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={2}
                      className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm resize-none ${
                        getFieldError("message") ? "border-red-400 focus:border-red-500" : "border-[#610035]/20 focus:border-[#610035]"
                      }`}
                      placeholder="Tell us your story..."
                      disabled={isLoading}
                    />
                    {getFieldError("message") && <p className="mt-1 text-red-600 text-xs">{getFieldError("message")}</p>}
                  </div>
                </div>

                <div>
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleCheckboxChange}
                      disabled={isLoading}
                      className={`mt-0.5 h-4 w-4 rounded border-2 text-[#610035] focus:ring-[#610035] flex-shrink-0 ${
                        getFieldError("consent") ? "border-red-400" : "border-[#610035]/20"
                      }`}
                    />
                    <span className="text-xs text-[#610035]">
                      I agree to the terms and conditions and consent to the collection and processing of my personal information. <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {getFieldError("consent") && <p className="mt-1 text-red-600 text-xs">{getFieldError("consent")}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || showSuccessMessage}
                  className={`w-full py-2.5 rounded-xl text-base font-medium transition-colors flex items-center justify-center gap-2 ${
                    isLoading || showSuccessMessage ? "bg-[#610035]/50 cursor-not-allowed" : "bg-[#610035] hover:bg-[#610035]/90"
                  } text-white`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : showSuccessMessage ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submitted!
                    </>
                  ) : (
                    <>
                      Submit
                      <ArrowRight className="w-5 h-5" />
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