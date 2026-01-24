"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image"; 

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Product", href: "#product" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "FAQs", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-card/95 backdrop-blur-md shadow-md"
        : "bg-transparent"
        }`}
    >
      <div className="container-custom mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <Image
              src="/medipro-logo4.png"
              alt="MediPro Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <span className={`text-2xl font-bold transition-colors ${isScrolled ? "text-primary" : "text-white"}`}>MediPro</span  >
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={`font-medium transition-colors ${isScrolled ? "text-foreground/80 hover:text-primary" : "text-white/90 hover:text-white"}`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Desktop CTA & WhatsApp */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="navCta"
              size="default"
              onClick={() => scrollToSection("#product")}
            >
              Order Now
            </Button>
            <a
              href="https://wa.me/923146200998?text=Hi%2C%20I'm%20interested%20in%20the%20MediPro%20Vacuum%20Device"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 transition-colors hover:scale-110 ${isScrolled ? "text-foreground/80 hover:text-[#25D366]" : "text-white/90 hover:text-[#25D366]"}`}
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <a
              href="https://wa.me/923146200998?text=Hi%2C%20I'm%20interested%20in%20the%20MediPro%20Vacuum%20Device"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 transition-colors hover:scale-110 ${isScrolled ? "text-foreground/80 hover:text-[#25D366]" : "text-white/90 hover:text-[#25D366]"}`}
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 ${isScrolled ? "text-foreground" : "text-white"}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-card border-t border-border animate-fade-in">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left py-2 text-foreground/80 hover:text-primary font-medium transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <Button
                variant="cta"
                className="w-full mt-4"
                onClick={() => scrollToSection("#product")}
              >
                Order Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
