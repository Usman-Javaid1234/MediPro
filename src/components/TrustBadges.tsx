'use client';
import { Package, Lock, BadgeCheck, Truck } from "lucide-react";

const badges = [
  {
    icon: Package,
    title: "Discreet Packaging",
    description: "Plain packaging for your privacy",
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    description: "256-bit SSL encryption",
  },
  {
    icon: BadgeCheck,
    title: "Certified Products",
    description: "100% authentic & verified",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Nationwide in 2-5 days",
  },
];

const TrustBadges = () => {
  return (
    <section className="py-12 lg:py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {badges.map((badge, index) => (
            <div
              key={badge.title}
              className="flex flex-col items-center text-center gap-3 p-4 lg:p-6 rounded-xl hover:bg-muted/50 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <badge.icon className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{badge.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
