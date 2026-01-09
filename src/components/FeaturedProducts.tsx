import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Digital Blood Pressure Monitor",
    price: 4500,
    originalPrice: 5500,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: 2,
    name: "Infrared Thermometer",
    price: 2800,
    originalPrice: 3200,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: 3,
    name: "Pulse Oximeter Pro",
    price: 1800,
    originalPrice: 2200,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: 4,
    name: "Digital Glucometer Kit",
    price: 3500,
    originalPrice: 4000,
    rating: 4.6,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: 5,
    name: "Nebulizer Machine",
    price: 5500,
    originalPrice: 6500,
    rating: 4.8,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop",
    inStock: true,
  },
  {
    id: 6,
    name: "Professional Stethoscope",
    price: 2500,
    originalPrice: 3000,
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=400&fit=crop",
    inStock: true,
  },
];

const FeaturedProducts = () => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price);
  };

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
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.inStock && (
                  <div className="absolute top-4 left-4 bg-success text-success-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    In Stock
                  </div>
                )}
                {product.originalPrice > product.price && (
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Sale
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 lg:p-6">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-medium text-foreground">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>

                {/* Name */}
                <h3 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <Button className="w-full" variant="default">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
