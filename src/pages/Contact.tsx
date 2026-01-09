import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log("Form submitted:", formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-background">
                <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
                    <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
                        <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                            <Mail className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground/80">Get In Touch</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">
                            We'd Love to <span className="text-primary">Hear From You</span>
                        </h1>

                        <p className="text-lg lg:text-xl text-muted-foreground">
                            Have questions about our products or services? Our team is here to help you.
                            Reach out and we'll respond as soon as possible.
                        </p>
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />
            </section>

            {/* Contact Content */}
            <section className="py-12 lg:py-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Contact Information */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                                    Contact Information
                                </h2>
                                <p className="text-muted-foreground">
                                    Feel free to reach out through any of these channels. We're here to help!
                                </p>
                            </div>

                            {/* Contact Cards */}
                            <div className="space-y-4">
                                {/* Address */}
                                <div className="bg-card border border-border rounded-xl p-6 space-y-3 hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Address</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Karachi, Pakistan
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="bg-card border border-border rounded-xl p-6 space-y-3 hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                                        <Phone className="w-6 h-6 text-success" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                                        <p className="text-muted-foreground text-sm">
                                            +92 300 1234567
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="bg-card border border-border rounded-xl p-6 space-y-3 hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                                        <p className="text-muted-foreground text-sm">
                                            support@medipro.pk
                                        </p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="bg-card border border-border rounded-xl p-6 space-y-3 hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Mon - Sat: 9:00 AM - 8:00 PM<br />
                                            Sunday: 10:00 AM - 6:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-card border border-border rounded-2xl p-8 lg:p-10 shadow-xl">
                                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                                    Send us a Message
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    {/* Email and Phone */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                placeholder="+92 300 1234567"
                                            />
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            placeholder="How can we help you?"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={6}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button type="submit" size="lg" className="w-full md:w-auto group">
                                        Send Message
                                        <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 lg:py-20 bg-muted/30">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Find quick answers to common questions about our products and services
                        </p>
                        <div className="pt-4">
                            <Button variant="outline" size="lg">
                                View FAQs
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
