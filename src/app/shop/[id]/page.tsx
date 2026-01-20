'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Star, 
  Plus, 
  Minus, 
  Truck, 
  Shield, 
  RefreshCw,
  Loader2,
  ChevronLeft,
  Check
} from "lucide-react";
import Link from "next/link";
import { useProduct, useRelatedProducts, useProductReviews } from "@/lib/api/hooks";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { data: product, isLoading, error } = useProduct(productId);
  const { data: relatedProducts } = useRelatedProducts(product, 4);
  const { data: reviewsData } = useProductReviews(productId, { page_size: 5 });
  
  const { addToCart } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity}x ${product.name} added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/shop">
            <Button>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail || '/placeholder-product.jpg'];
  const reviews = reviewsData?.items || [];
  const inStock = product.stock_quantity > 0;
  const discount = product.original_price 
    ? Math.round((1 - product.price / product.original_price) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              {product.subcategory && <Badge variant="outline">{product.subcategory}</Badge>}
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold">{product.name}</h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.average_rating || 0)
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.average_rating?.toFixed(1) || '0.0'}</span>
              <span className="text-muted-foreground">({product.review_count || 0} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
                  <Badge variant="destructive">-{discount}%</Badge>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {inStock ? (
                <>
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-success font-medium">In Stock</span>
                  <span className="text-muted-foreground">({product.stock_quantity} available)</span>
                </>
              ) : (
                <span className="text-destructive font-medium">Out of Stock</span>
              )}
            </div>

            {product.short_description && (
              <p className="text-muted-foreground">{product.short_description}</p>
            )}

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} disabled={quantity >= product.stock_quantity}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button size="lg" className="w-full" disabled={!inStock || isAddingToCart} onClick={handleAddToCart}>
                {isAddingToCart ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Adding...</>
                ) : (
                  <><ShoppingCart className="w-5 h-5 mr-2" />Add to Cart</>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
                <Truck className="w-6 h-6 mb-2 text-primary" />
                <span className="text-xs font-medium">Free Shipping</span>
                <span className="text-xs text-muted-foreground">Over PKR 5,000</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
                <Shield className="w-6 h-6 mb-2 text-primary" />
                <span className="text-xs font-medium">Warranty</span>
                <span className="text-xs text-muted-foreground">1 Year</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
                <RefreshCw className="w-6 h-6 mb-2 text-primary" />
                <span className="text-xs font-medium">Easy Returns</span>
                <span className="text-xs text-muted-foreground">7 Days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.review_count || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="whitespace-pre-wrap">{product.description}</p>
                  {product.features && product.features.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Key Features:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <dt className="font-medium capitalize">{key.replace(/_/g, ' ')}</dt>
                          <dd className="text-muted-foreground">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-muted-foreground">No specifications available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
                              ))}
                            </div>
                            <span className="font-medium">{review.user_name}</span>
                            {review.is_verified_purchase && <Badge variant="secondary" className="text-xs">Verified</Badge>}
                          </div>
                          {review.title && <h4 className="font-semibold">{review.title}</h4>}
                          {review.comment && <p className="text-muted-foreground mt-1">{review.comment}</p>}
                          <p className="text-xs text-muted-foreground mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No reviews yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {relatedProducts?.items && relatedProducts.items.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.items.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group overflow-hidden">
                  <Link href={`/shop/${relatedProduct.id}`}>
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img src={relatedProduct.thumbnail || '/placeholder-product.jpg'} alt={relatedProduct.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link href={`/shop/${relatedProduct.id}`}>
                      <h3 className="font-semibold line-clamp-2 hover:text-primary">{relatedProduct.name}</h3>
                    </Link>
                    <p className="text-lg font-bold mt-2">{formatPrice(relatedProduct.price)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}