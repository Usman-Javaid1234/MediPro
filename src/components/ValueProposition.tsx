'use client';
import { HeartPulse, Award, Clock } from "lucide-react";

const values = [
  {
    icon: HeartPulse,
    title: "Health First Approach",
    description:
      "We prioritize your wellbeing with carefully selected medical devices that meet international quality standards and certifications.",
  },
  {
    icon: Award,
    title: "Expert Curated Selection",
    description:
      "Our team of healthcare professionals handpicks every product ensuring you get only the best and most reliable medical equipment.",
  },
  {
    icon: Clock,
    title: "24/7 Customer Support",
    description:
      "Got questions about products? Our dedicated support team is always ready to help you make informed healthcare decisions.",
  },
];

const ValueProposition = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-4">
            Why Choose MediPro?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pakistan's trusted destination for premium medical devices and healthcare solutions
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="bg-card rounded-2xl p-6 lg:p-8 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <value.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
