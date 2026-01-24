import { Circle, Gauge, CheckCircle, Lock } from "lucide-react";

const steps = [
  {
    icon: Circle,
    step: "01",
    title: "Place Device",
    description: "Position the device comfortably and ensure a proper seal",
  },
  {
    icon: Gauge,
    step: "02",
    title: "Create Vacuum",
    description: "Use the pump to create gentle, controlled vacuum pressure",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Achieve Result",
    description: "Blood flow increases naturally, achieving the desired result",
  },
  {
    icon: Lock,
    step: "04",
    title: "Maintain",
    description: "Use the included tension ring to maintain the effect",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-secondary">
      <div className="container-custom mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Easy Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Safe, Effective
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our device is designed for ease of use. Follow these simple steps for effective results.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-card rounded-2xl p-8 card-hover text-center group"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                {step.step}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <step.icon className="h-8 w-8 text-accent" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {step.description}
              </p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-border" />
              )}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground bg-muted px-6 py-4 rounded-lg inline-block">
            ✓ Clinically proven to help with erectile dysfunction • No prescription required
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
