"use client";

import { Shield, Package, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import heroBg from "@/assets/hero-bg.png";

const trustBadges = [
  { icon: Shield, text: "FDA Approved Technology" },
  { icon: Package, text: "100% Discreet Packaging" },
  { icon: CreditCard, text: "Cash on Delivery Available" },
];

const Hero = () => {
  const scrollToProduct = () => {
    const element = document.querySelector("#product");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBg}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
      </div>

      {/* Content */}
      <div className="container-custom mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6 animate-slide-up">
            Reclaim Your{" "}
            <span className="text-accent-foreground bg-accent px-3 py-1 rounded-lg">
              Confidence
            </span>{" "}
            Naturally
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Medical-grade Vacuum Erection Device — Safe, Effective, Discreet
            Delivery across Pakistan
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="xl" onClick={scrollToProduct}>
              Order Now
            </Button>
            <Button variant="outlineWhite" size="xl" onClick={() => {
              const element = document.querySelector("#how-it-works");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}>
              Learn More
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 md:gap-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20"
              >
                <badge.icon className="h-5 w-5 text-accent-foreground" />
                <span className="text-sm font-medium text-primary-foreground">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
