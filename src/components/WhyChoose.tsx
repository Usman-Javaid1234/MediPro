import { Package, CreditCard, Shield, MessageCircle } from "lucide-react";

const benefits = [
  {
    icon: Package,
    title: "Discreet Delivery",
    description:
      "Plain packaging with no product details visible. Your privacy is our priority.",
  },
  {
    icon: CreditCard,
    title: "Cash on Delivery",
    description:
      "Pay when you receive. Inspect the package before payment for complete peace of mind.",
  },
  {
    icon: Shield,
    title: "Medical Quality",
    description:
      "FDA-approved materials and technology. Safe for regular use with no side effects.",
  },
  {
    icon: MessageCircle,
    title: "Customer Support",
    description:
      "WhatsApp support for all your questions. Judgment-free, confidential assistance.",
  },
];

const WhyChoose = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
            Why MediPro
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Trusted Health Partner in Pakistan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We understand the importance of privacy and trust when it comes to your health
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 card-hover group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-navy-light rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <benefit.icon className="h-7 w-7 text-primary-foreground" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
