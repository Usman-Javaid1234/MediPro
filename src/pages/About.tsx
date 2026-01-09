import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Heart, Award, Users, Target, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-background">
                <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
                    <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
                        <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                            <Heart className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground/80">About MediPro</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">
                            Your <span className="text-primary">Trusted Partner</span> in Medical Wellness
                        </h1>

                        <p className="text-lg lg:text-xl text-muted-foreground">
                            We're dedicated to providing professional medical solutions with complete privacy and discretion,
                            helping thousands of customers achieve their wellness goals.
                        </p>
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />
            </section>

            {/* Our Story */}
            <section className="py-12 lg:py-20 bg-muted/30">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Our Story</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    MediPro was founded with a simple mission: to make professional medical devices
                                    accessible to everyone while maintaining the highest standards of privacy and discretion.
                                </p>
                                <p>
                                    We understand that wellness and health are deeply personal matters. That's why we've
                                    built our entire business around ensuring complete confidentiality, from browsing to delivery.
                                </p>
                                <p>
                                    Today, we're proud to serve over 10,000+ satisfied customers across Pakistan, delivering
                                    medical-grade products with the care and discretion they deserve.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-card rounded-2xl border border-border shadow-xl p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center space-y-2">
                                        <div className="text-4xl font-bold text-primary">10K+</div>
                                        <div className="text-sm text-muted-foreground">Happy Customers</div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <div className="text-4xl font-bold text-primary">100%</div>
                                        <div className="text-sm text-muted-foreground">Certified Products</div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <div className="text-4xl font-bold text-primary">24/7</div>
                                        <div className="text-sm text-muted-foreground">Support Available</div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <div className="text-4xl font-bold text-primary">5★</div>
                                        <div className="text-sm text-muted-foreground">Average Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-12 lg:py-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Our Core Values</h2>
                        <p className="text-lg text-muted-foreground">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Value 1 */}
                        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-4 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Shield className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">Privacy First</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Complete discretion in packaging and delivery. Your privacy is our top priority.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-4 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
                                <Award className="w-7 h-7 text-success" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">Quality Assured</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Only certified, medical-grade products from trusted manufacturers.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-4 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                                <Heart className="w-7 h-7 text-secondary" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">Customer Care</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Dedicated support team ready to help you with any questions or concerns.
                            </p>
                        </div>

                        {/* Value 4 */}
                        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-4 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Truck className="w-7 h-7 text-accent" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">Fast Delivery</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Quick and reliable shipping across Pakistan with free delivery over PKR 5,000.
                            </p>
                        </div>

                        {/* Value 5 */}
                        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-4 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Target className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">Mission Driven</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Committed to making wellness accessible to everyone in Pakistan.
                            </p>
                        </div>

                        {/* Value 6 */}
                        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-4 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
                                <Users className="w-7 h-7 text-success" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">Community Trust</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Building lasting relationships with our customers based on trust and reliability.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 lg:py-20 bg-muted/30">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="bg-gradient-to-r from-primary to-success rounded-2xl p-8 lg:p-12 text-center text-primary-foreground">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-bold">
                                Ready to Experience the MediPro Difference?
                            </h2>
                            <p className="text-lg opacity-90">
                                Join thousands of satisfied customers who trust us for their medical wellness needs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/shop">
                                    <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                                        Shop Now
                                    </Button>
                                </Link>
                                <Link to="/contact">
                                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
