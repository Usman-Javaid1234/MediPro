"use client";

import { useState, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const features = [
  "Medical-grade materials",
  "Clinically proven effectiveness",
  "Easy to use at home",
  "Includes detailed instructions",
  "Complete kit with accessories",
  "1-year warranty included",
];

// Multiple product images for slideshow
const productImages = [
  {
    src: "/pic2.png",
    alt: "MediPro Vacuum Erection Device - Main View",
  },
  {
    src: "/kit-contents.jpg",
    alt: "MediPro Vacuum Erection Device - Kit Contents",
  },
  {
    src: "/product-closeup.jpg",
    alt: "MediPro Vacuum Erection Device - Close Up",
  },
  {
    src: "/oil.png",
    alt: "MediPro Vacuum Erection Device - Accessory Oil",
  },
];

const ProductShowcase = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % productImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % productImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent("Hi, I would like to order the MediPro Vacuum Erection Device (PKR 3,500)");
    window.open(`https://wa.me/923146200998?text=${message}`, "_blank");
  };
  return (
    <section id="product" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
            Premium Quality
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Premium Vacuum Erection Device
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands of men across Pakistan for safe, effective, and discreet treatment
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Product Image Slideshow */}
          <div className="relative">
            <div className="bg-gradient-to-br from-secondary to-muted rounded-2xl p-8 lg:p-12">
              <div className="w-full aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center overflow-hidden relative group">
                {/* Slideshow Images */}
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? "opacity-100" : "opacity-0"
                      }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={400}
                      height={400}
                      className="object-contain w-full h-full animate-float"
                    />
                  </div>
                ))}

                {/* Navigation Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 text-foreground" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 text-foreground" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                          ? "bg-accent w-6"
                          : "bg-background/50 hover:bg-background/70"
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Badge */}
            <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full font-bold shadow-green">
              Best Seller
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">
                Complete Treatment Kit
              </h3>
              <p className="text-muted-foreground">
                Our medical-grade vacuum therapy device is designed for safe, comfortable use at home.
                Clinically proven to help with erectile dysfunction without medication.
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Pricing */}
            <div className="bg-secondary rounded-xl p-6 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-primary">
                  PKR 3,500
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  PKR 5,000
                </span>
                <span className="bg-accent/10 text-accent px-2 py-1 rounded text-sm font-semibold">
                  30% OFF
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Free discreet shipping • Cash on delivery available
              </p>
              <Button
                variant="cta"
                size="xl"
                className="w-full gap-2"
                onClick={handleWhatsAppOrder}
              >
                <MessageCircle className="h-5 w-5" />
                Order via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
