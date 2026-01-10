'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import heroImage from "@/assets/hero-medical.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground/80">Trusted by 10,000+ customers</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">
              Professional Medical Solutions for{" "}
              <span className="text-primary">Personal Wellness</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-xl">
              Premium medical devices delivered with complete discretion.
              Your privacy matters — discreet packaging guaranteed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button variant="hero" size="xl" className="group">
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-5 h-5 text-primary" />
                <span>Free delivery over PKR 5,000</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage}
                alt="Professional medical solutions"
                className="w-full h-[300px] lg:h-[500px] object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-card rounded-xl shadow-xl p-4 lg:p-6 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">100% Certified</p>
                  <p className="text-sm text-muted-foreground">Medical Grade Products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default Hero;
