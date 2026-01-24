import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "M.A.",
    location: "Lahore",
    rating: 5,
    text: "I was skeptical at first, but this device truly changed my life. The discreet packaging gave me confidence to order, and the results exceeded my expectations.",
  },
  {
    name: "S.K.",
    location: "Karachi",
    rating: 5,
    text: "Finally, a solution that works without any medication. Easy to use, effective, and the customer support team was incredibly helpful and understanding.",
  },
  {
    name: "R.H.",
    location: "Islamabad",
    rating: 5,
    text: "The quality is excellent, and delivery was fast. I appreciate the privacy they maintain. Highly recommend for anyone looking for a non-invasive solution.",
  },
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-primary">
      <div className="container-custom mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Real Results, Real Confidence
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Hear from our satisfied customers across Pakistan
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 relative card-hover"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Quote className="h-5 w-5 text-accent-foreground" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 pt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t border-border pt-4">
                <p className="font-bold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  from {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
