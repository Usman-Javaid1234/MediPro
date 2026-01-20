'use client';

import { useState, useMemo } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  X,
  Loader2,
  SlidersHorizontal
} from "lucide-react";
import Link from "next/link";
import { useProducts, useCategories } from "@/lib/api/hooks";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { Product, ProductFilter } from "@/lib/api/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ShopPage() {
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  // Filter state
  const [filters, setFilters] = useState<ProductFilter>({
    page: 1,
    page_size: 12,
    sort_by: 'created_at',
    sort_order: 'desc',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Build final filters with debounced search
  const finalFilters = useMemo(() => ({
    ...filters,
    search: searchQuery || undefined,
    min_price: priceRange[0] || undefined,
    max_price: priceRange[1] < 50000 ? priceRange[1] : undefined,
    in_stock_only: inStockOnly || undefined,
  }), [filters, searchQuery, priceRange, inStockOnly]);

  // Fetch data
  const { data: productsData, isLoading, error } = useProducts(finalFilters);
  const { data: categoriesData } = useCategories({ is_active: true });

  const products = productsData?.items || [];
  const totalProducts = productsData?.total || 0;
  const totalPages = productsData?.total_pages || 1;
  const categories = categoriesData?.items || [];

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
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: category === 'all' ? undefined : category,
      page: 1,
    }));
  };

  const handleSortChange = (value: string) => {
    const [sort_by, sort_order] = value.split('-') as ['price' | 'created_at' | 'name', 'asc' | 'desc'];
    setFilters(prev => ({ ...prev, sort_by, sort_order, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({ page: 1, page_size: 12, sort_by: 'created_at', sort_order: 'desc' });
    setSearchQuery('');
    setPriceRange([0, 50000]);
    setInStockOnly(false);
  };

  const hasActiveFilters = filters.category || searchQuery || priceRange[0] > 0 || priceRange[1] < 50000 || inStockOnly;

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={filters.category || 'all'}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label>Price Range</Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={50000}
          step={500}
          className="mt-2"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* In Stock Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
        />
        <Label htmlFor="inStock" className="cursor-pointer">
          In stock only
        </Label>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Shop</h1>
            <p className="text-muted-foreground mt-1">
              {totalProducts} products available
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select
              value={`${filters.sort_by}-${filters.sort_order}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Newest First</SelectItem>
                <SelectItem value="created_at-asc">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h2>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-t-lg" />
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-6 bg-muted rounded w-1/2" />
                      <div className="h-10 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">Failed to load products</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found</p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                      <Link href={`/shop/${product.id}`}>
                        <div className="relative aspect-square bg-muted overflow-hidden">
                          <img
                            src={product.thumbnail || product.images[0] || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.stock_quantity === 0 && (
                            <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
                              Out of Stock
                            </div>
                          )}
                          {product.original_price && product.original_price > product.price && (
                            <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded">
                              Sale
                            </div>
                          )}
                        </div>
                      </Link>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="text-sm font-medium">
                            {product.average_rating?.toFixed(1) || '0.0'}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({product.review_count || 0})
                          </span>
                        </div>
                        <Link href={`/shop/${product.id}`}>
                          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-2 mb-4">
                          <span className="text-lg font-bold">
                            {formatPrice(product.price)}
                          </span>
                          {product.original_price && product.original_price > product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.original_price)}
                            </span>
                          )}
                        </div>
                        <Button
                          className="w-full"
                          disabled={product.stock_quantity === 0}
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      disabled={filters.page === 1}
                      onClick={() => handlePageChange(filters.page! - 1)}
                    >
                      Previous
                    </Button>
                    <span className="px-4 text-sm text-muted-foreground">
                      Page {filters.page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={filters.page === totalPages}
                      onClick={() => handlePageChange(filters.page! + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}