import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Truck, Heart, Award, Users, Clock } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              About <span className="text-primary">MediPro</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground">
              Your trusted partner in professional medical solutions, delivering quality healthcare products with complete discretion and care.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground">
                At MediPro, we believe that access to quality medical products should be convenient, discreet, and reliable. We're committed to providing professional-grade medical solutions that enhance personal wellness and healthcare outcomes.
              </p>
              <p className="text-lg text-muted-foreground">
                With over a decade of experience in the healthcare industry, we understand the importance of privacy, quality, and trust when it comes to medical purchases. That's why we've built our business on these core principles.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-primary/20">
                <CardContent className="pt-6 text-center space-y-2">
                  <Users className="w-12 h-12 mx-auto text-primary" />
                  <p className="text-3xl font-bold text-foreground">10,000+</p>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="pt-6 text-center space-y-2">
                  <Award className="w-12 h-12 mx-auto text-primary" />
                  <p className="text-3xl font-bold text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground">Certified Products</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="pt-6 text-center space-y-2">
                  <Clock className="w-12 h-12 mx-auto text-primary" />
                  <p className="text-3xl font-bold text-foreground">24/7</p>
                  <p className="text-sm text-muted-foreground">Customer Support</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="pt-6 text-center space-y-2">
                  <Truck className="w-12 h-12 mx-auto text-primary" />
                  <p className="text-3xl font-bold text-foreground">Fast</p>
                  <p className="text-sm text-muted-foreground">Delivery</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Privacy First</h3>
                <p className="text-muted-foreground">
                  All orders are shipped in discreet, unmarked packaging. Your privacy is our top priority, and we never share customer information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Quality Assured</h3>
                <p className="text-muted-foreground">
                  Every product is medical-grade certified and sourced from trusted manufacturers who meet international quality standards.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Customer Care</h3>
                <p className="text-muted-foreground">
                  Our dedicated support team is available 24/7 to assist you with product selection, orders, and any concerns you may have.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Free delivery on orders over PKR 5,000 with tracking. Most orders ship within 24 hours for quick arrival.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Secure Shopping</h3>
                <p className="text-muted-foreground">
                  Your transactions are protected with industry-standard encryption. Shop with confidence knowing your data is safe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Community Trust</h3>
                <p className="text-muted-foreground">
                  Join thousands of satisfied customers who trust MediPro for their medical product needs and personal wellness.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Ready to Shop?
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore our range of professional medical products and experience the MediPro difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Products
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
