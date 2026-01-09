import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    const formatPrice = (price: number) => {
        return `PKR ${price.toLocaleString()}`;
    };

    const subtotal = getCartTotal();
    const shipping = subtotal >= 5000 ? 0 : 250;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />

                <div className="flex-1 flex items-center justify-center py-12">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="max-w-md mx-auto text-center space-y-6">
                            <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
                                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground">Your Cart is Empty</h1>
                            <p className="text-lg text-muted-foreground">
                                Looks like you haven't added any items to your cart yet.
                            </p>
                            <Link to="/shop">
                                <Button size="lg" className="group">
                                    Start Shopping
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-success text-primary-foreground">
                <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Shopping Cart</h1>
                        <p className="text-lg lg:text-xl opacity-90">
                            Review your items and proceed to checkout
                        </p>
                    </div>
                </div>
            </section>

            {/* Cart Content */}
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-foreground">
                                    Cart Items ({cartItems.length})
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearCart}
                                    className="text-destructive hover:text-destructive"
                                >
                                    Clear Cart
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-card border border-border rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center">
                                                    <span className="text-3xl font-bold text-foreground/20">
                                                        {item.name.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 space-y-3">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">{item.category}</p>
                                                    <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                                                </div>

                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-xl font-bold text-primary">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                    {item.originalPrice && (
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            {formatPrice(item.originalPrice)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </Button>
                                                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Remove
                                                    </Button>
                                                </div>

                                                {/* Item Subtotal */}
                                                <div className="pt-2 border-t border-border">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-muted-foreground">Item Subtotal:</span>
                                                        <span className="font-semibold text-foreground">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Continue Shopping */}
                            <div className="pt-4">
                                <Link to="/shop">
                                    <Button variant="outline" size="lg">
                                        Continue Shopping
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-card border border-border rounded-xl p-6 lg:p-8 sticky top-24 space-y-6">
                                <h2 className="text-2xl font-bold text-foreground">Order Summary</h2>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-foreground/80">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-foreground/80">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                                    </div>
                                    {shipping === 0 && (
                                        <p className="text-xs text-success">
                                            🎉 You qualify for free shipping!
                                        </p>
                                    )}
                                    {shipping > 0 && subtotal > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            Add {formatPrice(5000 - subtotal)} more for free shipping
                                        </p>
                                    )}
                                    <div className="border-t border-border pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-foreground">Total</span>
                                            <span className="text-2xl font-bold text-primary">
                                                {formatPrice(total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full" size="lg">
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>

                                <div className="pt-4 border-t border-border space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="w-1.5 h-1.5 rounded-full bg-success" />
                                        <span>Secure checkout</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="w-1.5 h-1.5 rounded-full bg-success" />
                                        <span>Discreet packaging</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="w-1.5 h-1.5 rounded-full bg-success" />
                                        <span>Free shipping over PKR 5,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Cart;
