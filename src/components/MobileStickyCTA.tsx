"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const MobileStickyCTA = () => {
  const scrollToProduct = () => {
    const element = document.querySelector("#product");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-md border-t border-border p-4">
      <Button
        variant="cta"
        size="lg"
        className="w-full"
        onClick={scrollToProduct}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Order Now — PKR 3500
      </Button>
    </div>
  );
};

export default MobileStickyCTA;
