'use client';

import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFeaturedProducts } from "@/lib/api/hooks";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/api/types";
import { useToast } from "@/components/ui/use-toast";

const FeaturedProducts = () => {
  const { data, isLoading, error } = useFeaturedProducts(6);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our most popular medical devices trusted by healthcare professionals
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-muted" />
                <div className="p-5 lg:p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                  <div className="h-10 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground mb-8">
              Unable to load products at this time. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const products = data?.items || [];

  // No products state
  if (products.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground">
              No featured products available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our most popular medical devices trusted by healthcare professionals
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <Link href={`/shop/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.thumbnail || product.images[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.stock_quantity > 0 && (
                    <div className="absolute top-4 left-4 bg-success text-success-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      In Stock
                    </div>
                  )}
                  {product.stock_quantity === 0 && (
                    <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Out of Stock
                    </div>
                  )}
                  {product.original_price && product.original_price > product.price && (
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Sale
                    </div>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-5 lg:p-6">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-medium text-foreground">
                      {product.average_rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.review_count || 0} reviews)
                  </span>
                </div>

                {/* Name */}
                <Link href={`/shop/${product.id}`}>
                  <h3 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <Button
                  className="w-full"
                  variant="default"
                  disabled={product.stock_quantity === 0}
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/shop">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;