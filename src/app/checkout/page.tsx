'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Truck,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

const pakistanCities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala",
  "Hyderabad", "Abbottabad", "Bahawalpur", "Sargodha", "Sukkur"
];

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const cartTotal = getCartTotal();
  const shippingFee = cartTotal >= 5000 ? 0 : 250;
  const finalTotal = cartTotal + shippingFee;

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    // Contact Information
    fullName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    postalCode: '',
    province: '',
    
    // Payment Details (for online payments)
    accountNumber: '',
    accountName: '',
    transactionId: '',
    
    // Additional Notes
    orderNotes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill in all required fields');
      return;
    }

    // Process order
    const orderData = {
      ...formData,
      paymentMethod,
      items: cart,
      subtotal: cartTotal,
      shippingFee,
      total: finalTotal,
      orderDate: new Date().toISOString()
    };

    console.log('Order submitted:', orderData);
    
    // Clear cart and redirect to success page
    // In production, this would call your backend API
    alert('Order placed successfully! You will receive a confirmation email shortly.');
    clearCart();
    router.push('/');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground">
              Add items to your cart before proceeding to checkout
            </p>
            <Link href="/shop">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Checkout
          </h1>
          <p className="text-muted-foreground">
            Complete your order
          </p>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+92 300 1234567"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        We'll contact you on this number for order confirmation
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House/Flat No., Street Name, Area"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Select
                          value={formData.city}
                          onValueChange={(value) => handleSelectChange('city', value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {pakistanCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="province">Province *</Label>
                        <Select
                          value={formData.province}
                          onValueChange={(value) => handleSelectChange('province', value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Punjab">Punjab</SelectItem>
                            <SelectItem value="Sindh">Sindh</SelectItem>
                            <SelectItem value="KPK">Khyber Pakhtunkhwa</SelectItem>
                            <SelectItem value="Balochistan">Balochistan</SelectItem>
                            <SelectItem value="Islamabad">Islamabad Capital Territory</SelectItem>
                            <SelectItem value="AJK">Azad Jammu & Kashmir</SelectItem>
                            <SelectItem value="GB">Gilgit-Baltistan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Enter postal code"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      Payment Method
                    </CardTitle>
                    <CardDescription>
                      Select your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      {/* Cash on Delivery */}
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">Cash on Delivery</p>
                              <p className="text-sm text-muted-foreground">
                                Pay when you receive your order
                              </p>
                            </div>
                            <Truck className="w-6 h-6 text-primary" />
                          </div>
                        </Label>
                      </div>

                      {/* JazzCash */}
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="jazzcash" id="jazzcash" />
                        <Label htmlFor="jazzcash" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">JazzCash</p>
                              <p className="text-sm text-muted-foreground">
                                Mobile wallet payment
                              </p>
                            </div>
                            <div className="w-12 h-8 bg-[#E74C3C] rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">Jazz</span>
                            </div>
                          </div>
                        </Label>
                      </div>

                      {/* EasyPaisa */}
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="easypaisa" id="easypaisa" />
                        <Label htmlFor="easypaisa" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">EasyPaisa</p>
                              <p className="text-sm text-muted-foreground">
                                Mobile wallet payment
                              </p>
                            </div>
                            <div className="w-12 h-8 bg-[#00A651] rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">EP</span>
                            </div>
                          </div>
                        </Label>
                      </div>

                      {/* Bank Transfer */}
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">Bank Transfer</p>
                              <p className="text-sm text-muted-foreground">
                                Direct bank transfer
                              </p>
                            </div>
                            <CreditCard className="w-6 h-6 text-primary" />
                          </div>
                        </Label>
                      </div>

                      {/* Credit/Debit Card */}
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">Credit/Debit Card</p>
                              <p className="text-sm text-muted-foreground">
                                Visa, Mastercard accepted
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <div className="w-8 h-6 bg-[#1A1F71] rounded" />
                              <div className="w-8 h-6 bg-[#EB001B] rounded" />
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Payment Instructions */}
                    {paymentMethod === 'jazzcash' && (
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6 space-y-2">
                          <p className="font-semibold text-sm">JazzCash Payment Instructions:</p>
                          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Send payment to: 0300-1234567</li>
                            <li>Account Title: MediPro</li>
                            <li>Enter Transaction ID below</li>
                          </ol>
                          <div className="space-y-2 mt-4">
                            <Label htmlFor="transactionId">Transaction ID *</Label>
                            <Input
                              id="transactionId"
                              name="transactionId"
                              value={formData.transactionId}
                              onChange={handleChange}
                              placeholder="Enter JazzCash transaction ID"
                              required={paymentMethod === 'jazzcash'}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {paymentMethod === 'easypaisa' && (
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6 space-y-2">
                          <p className="font-semibold text-sm">EasyPaisa Payment Instructions:</p>
                          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Send payment to: 0321-7654321</li>
                            <li>Account Title: MediPro</li>
                            <li>Enter Transaction ID below</li>
                          </ol>
                          <div className="space-y-2 mt-4">
                            <Label htmlFor="transactionId">Transaction ID *</Label>
                            <Input
                              id="transactionId"
                              name="transactionId"
                              value={formData.transactionId}
                              onChange={handleChange}
                              placeholder="Enter EasyPaisa transaction ID"
                              required={paymentMethod === 'easypaisa'}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {paymentMethod === 'bank' && (
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6 space-y-2">
                          <p className="font-semibold text-sm">Bank Transfer Details:</p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p><strong>Bank:</strong> HBL</p>
                            <p><strong>Account Title:</strong> MediPro Medical Solutions</p>
                            <p><strong>Account Number:</strong> 12345678901234</p>
                            <p><strong>IBAN:</strong> PK12HABB0012345678901234</p>
                          </div>
                          <div className="space-y-2 mt-4">
                            <Label htmlFor="transactionId">Transaction/Reference ID *</Label>
                            <Input
                              id="transactionId"
                              name="transactionId"
                              value={formData.transactionId}
                              onChange={handleChange}
                              placeholder="Enter transaction reference"
                              required={paymentMethod === 'bank'}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>

                {/* Additional Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Notes (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      id="orderNotes"
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleChange}
                      placeholder="Any special instructions for your order?"
                      rows={4}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Cart Items */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold text-primary">
                              PKR {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">PKR {cartTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">
                          {shippingFee === 0 ? (
                            <span className="text-success">Free</span>
                          ) : (
                            `PKR ${shippingFee}`
                          )}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">PKR {finalTotal.toLocaleString()}</span>
                    </div>

                    {/* Shipping Info */}
                    {cartTotal >= 5000 ? (
                      <div className="flex items-start gap-2 p-3 bg-success/10 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-success-foreground">
                          You've qualified for free shipping!
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                        <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          Add PKR {(5000 - cartTotal).toLocaleString()} more for free shipping
                        </p>
                      </div>
                    )}

                    <Button type="submit" className="w-full" size="lg">
                      Place Order
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By placing your order, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
