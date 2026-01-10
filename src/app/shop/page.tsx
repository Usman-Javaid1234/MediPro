'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  SlidersHorizontal, 
  ShoppingCart, 
  Star, 
  Filter,
  X
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/use-toast";

// Mock data - Replace with API calls to backend
const categories = [
  { id: 'all', name: 'All Products', count: 45 },
  { id: 'diagnostic', name: 'Diagnostic Equipment', count: 12 },
  { id: 'monitoring', name: 'Patient Monitoring', count: 8 },
  { id: 'surgical', name: 'Surgical Instruments', count: 15 },
  { id: 'mobility', name: 'Mobility Aids', count: 6 },
  { id: 'therapy', name: 'Therapy Equipment', count: 4 },
];

const products = [
  {
    id: 1,
    name: 'Digital Blood Pressure Monitor',
    category: 'diagnostic',
    price: 4500,
    originalPrice: 5500,
    rating: 4.5,
    reviews: 128,
    image: '/api/placeholder/300/300',
    badge: 'Best Seller',
    inStock: true
  },
  {
    id: 2,
    name: 'Pulse Oximeter',
    category: 'monitoring',
    price: 2800,
    originalPrice: 3500,
    rating: 4.8,
    reviews: 95,
    image: '/api/placeholder/300/300',
    badge: 'Sale',
    inStock: true
  },
  {
    id: 3,
    name: 'Digital Thermometer',
    category: 'diagnostic',
    price: 1200,
    originalPrice: null,
    rating: 4.3,
    reviews: 203,
    image: '/api/placeholder/300/300',
    badge: null,
    inStock: true
  },
  {
    id: 4,
    name: 'Stethoscope Professional',
    category: 'diagnostic',
    price: 8900,
    originalPrice: null,
    rating: 4.9,
    reviews: 156,
    image: '/api/placeholder/300/300',
    badge: 'New',
    inStock: true
  },
  {
    id: 5,
    name: 'Walking Cane Adjustable',
    category: 'mobility',
    price: 1800,
    originalPrice: 2200,
    rating: 4.4,
    reviews: 67,
    image: '/api/placeholder/300/300',
    badge: null,
    inStock: true
  },
  {
    id: 6,
    name: 'Wheelchair Foldable',
    category: 'mobility',
    price: 25000,
    originalPrice: null,
    rating: 4.6,
    reviews: 42,
    image: '/api/placeholder/300/300',
    badge: null,
    inStock: false
  },
  {
    id: 7,
    name: 'Surgical Scissors Set',
    category: 'surgical',
    price: 3500,
    originalPrice: null,
    rating: 4.7,
    reviews: 89,
    image: '/api/placeholder/300/300',
    badge: null,
    inStock: true
  },
  {
    id: 8,
    name: 'Nebulizer Machine',
    category: 'therapy',
    price: 6800,
    originalPrice: 8000,
    rating: 4.5,
    reviews: 134,
    image: '/api/placeholder/300/300',
    badge: 'Sale',
    inStock: true
  },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Filter products based on selected criteria
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Shop Medical Products
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse our complete range of professional medical equipment and wellness products
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-24 space-y-6">
                {/* Mobile Filter Close Button */}
                <div className="lg:hidden flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <Card>
                  <CardContent className="pt-6 space-y-6">
                    {/* Categories */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                              selectedCategory === category.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted text-foreground/80'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{category.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {category.count}
                              </Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
                      <div className="space-y-4">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={30000}
                          step={500}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>PKR {priceRange[0].toLocaleString()}</span>
                          <span>PKR {priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold text-foreground mb-3">Availability</h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground/80">In Stock</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-foreground/80">Out of Stock</span>
                        </label>
                      </div>
                    </div>

                    {/* Reset Filters */}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedCategory('all');
                        setPriceRange([0, 30000]);
                        setSearchQuery('');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Search and Sort Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="lg:hidden"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {sortedProducts.length} of {products.length} products
              </div>

              {/* Products Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.badge && (
                        <Badge 
                          className="absolute top-3 left-3"
                          variant={product.badge === 'Sale' ? 'destructive' : 'default'}
                        >
                          {product.badge}
                        </Badge>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Badge variant="secondary">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-primary">
                          PKR {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            PKR {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full" 
                        disabled={!product.inStock}
                        variant={product.inStock ? "default" : "secondary"}
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* No Results */}
              {sortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">
                    No products found matching your criteria
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory('all');
                      setPriceRange([0, 30000]);
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {sortedProducts.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
