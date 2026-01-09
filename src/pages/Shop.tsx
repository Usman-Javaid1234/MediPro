import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, SlidersHorizontal, X, ChevronDown, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Mock product data - will be replaced with API data
const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "Digital Blood Pressure Monitor",
        category: "Monitors",
        price: 12500,
        originalPrice: 15000,
        rating: 4.5,
        reviews: 124,
        image: "/products/bp-monitor.jpg",
        inStock: true,
        featured: true,
    },
    {
        id: 2,
        name: "Infrared Thermometer",
        category: "Thermometers",
        price: 3500,
        originalPrice: 4500,
        rating: 4.8,
        reviews: 89,
        image: "/products/thermometer.jpg",
        inStock: true,
        featured: false,
    },
    {
        id: 3,
        name: "Pulse Oximeter",
        category: "Monitors",
        price: 4200,
        originalPrice: null,
        rating: 4.6,
        reviews: 156,
        image: "/products/oximeter.jpg",
        inStock: true,
        featured: true,
    },
    {
        id: 4,
        name: "Digital Weighing Scale",
        category: "Scales",
        price: 5500,
        originalPrice: 6500,
        rating: 4.3,
        reviews: 67,
        image: "/products/scale.jpg",
        inStock: false,
        featured: false,
    },
    {
        id: 5,
        name: "Glucose Monitor Kit",
        category: "Monitors",
        price: 8900,
        originalPrice: null,
        rating: 4.7,
        reviews: 203,
        image: "/products/glucose.jpg",
        inStock: true,
        featured: true,
    },
    {
        id: 6,
        name: "Nebulizer Machine",
        category: "Respiratory",
        price: 15000,
        originalPrice: 18000,
        rating: 4.4,
        reviews: 78,
        image: "/products/nebulizer.jpg",
        inStock: true,
        featured: false,
    },
];

const CATEGORIES = ["All Products", "Monitors", "Thermometers", "Scales", "Respiratory", "Accessories"];
const SORT_OPTIONS = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
];

const Shop = () => {
    const [selectedCategory, setSelectedCategory] = useState("All Products");
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
    const [sortBy, setSortBy] = useState("featured");
    const [showFilters, setShowFilters] = useState(false);
    const [inStockOnly, setInStockOnly] = useState(false);
    const { addToCart } = useCart();
    const { toast } = useToast();

    const handleAddToCart = (product: typeof MOCK_PRODUCTS[0]) => {
        addToCart(product);
        toast({
            title: "Added to cart!",
            description: `${product.name} has been added to your cart.`,
        });
    };

    // Filter and sort products based on state
    const filteredProducts = MOCK_PRODUCTS.filter(product => {
        const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
        const matchesStock = !inStockOnly || product.inStock;
        return matchesCategory && matchesSearch && matchesPrice && matchesStock;
    });

    const formatPrice = (price: number) => {
        return `PKR ${price.toLocaleString()}`;
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-primary to-success text-primary-foreground">
                <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                            Shop Medical Devices
                        </h1>
                        <p className="text-lg lg:text-xl opacity-90">
                            Explore our wide range of certified medical-grade products
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8 lg:py-12">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Search and Filter Bar */}
                    <div className="mb-8 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative md:w-64">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full appearance-none px-4 py-3 pr-10 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                                >
                                    {SORT_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                            </div>

                            {/* Mobile Filter Toggle */}
                            <Button
                                variant="outline"
                                className="md:hidden"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal className="w-5 h-5 mr-2" />
                                Filters
                            </Button>
                        </div>

                        {/* Active Filters */}
                        {(selectedCategory !== "All Products" || inStockOnly || searchQuery) && (
                            <div className="flex flex-wrap gap-2">
                                {selectedCategory !== "All Products" && (
                                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                        {selectedCategory}
                                        <button onClick={() => setSelectedCategory("All Products")}>
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {inStockOnly && (
                                    <div className="inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full text-sm">
                                        In Stock Only
                                        <button onClick={() => setInStockOnly(false)}>
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {searchQuery && (
                                    <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                                        Search: "{searchQuery}"
                                        <button onClick={() => setSearchQuery("")}>
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar Filters */}
                        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
                            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                                {/* Categories */}
                                <div>
                                    <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                                    <div className="space-y-2">
                                        {CATEGORIES.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === category
                                                    ? 'bg-primary text-primary-foreground font-medium'
                                                    : 'text-foreground/80 hover:bg-muted'
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="pt-6 border-t border-border">
                                    <h3 className="font-semibold text-foreground mb-4">Price Range</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                                                <input
                                                    type="number"
                                                    value={priceRange.min}
                                                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                                                <input
                                                    type="number"
                                                    value={priceRange.max}
                                                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                                    placeholder="50000"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                                        </div>
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="pt-6 border-t border-border">
                                    <h3 className="font-semibold text-foreground mb-4">Availability</h3>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={inStockOnly}
                                            onChange={(e) => setInStockOnly(e.target.checked)}
                                            className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                                        />
                                        <span className="text-foreground/80">In Stock Only</span>
                                    </label>
                                </div>

                                {/* Reset Filters */}
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setSelectedCategory("All Products");
                                        setSearchQuery("");
                                        setPriceRange({ min: 0, max: 50000 });
                                        setInStockOnly(false);
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="lg:col-span-3">
                            <div className="mb-6 flex items-center justify-between">
                                <p className="text-muted-foreground">
                                    Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
                                </p>
                            </div>

                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                        <Search className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                                    <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {filteredProducts.map(product => (
                                            <div
                                                key={product.id}
                                                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-shadow group"
                                            >
                                                {/* Product Image */}
                                                <div className="relative aspect-square bg-muted overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center">
                                                        <span className="text-4xl font-bold text-foreground/20">{product.name.charAt(0)}</span>
                                                    </div>

                                                    {/* Badges */}
                                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                        {product.featured && (
                                                            <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                                                                Featured
                                                            </span>
                                                        )}
                                                        {product.originalPrice && (
                                                            <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-semibold">
                                                                Sale
                                                            </span>
                                                        )}
                                                        {!product.inStock && (
                                                            <span className="bg-muted text-foreground px-3 py-1 rounded-full text-xs font-semibold">
                                                                Out of Stock
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Product Info */}
                                                <div className="p-5 space-y-3">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                            {product.name}
                                                        </h3>
                                                    </div>

                                                    {/* Rating */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                                        ? 'fill-accent text-accent'
                                                                        : 'text-muted-foreground/30'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {product.rating} ({product.reviews})
                                                        </span>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-xl font-bold text-primary">
                                                            {formatPrice(product.price)}
                                                        </span>
                                                        {product.originalPrice && (
                                                            <span className="text-sm text-muted-foreground line-through">
                                                                {formatPrice(product.originalPrice)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Add to Cart Button */}
                                                    <Button
                                                        className="w-full group/btn"
                                                        disabled={!product.inStock}
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                                                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <div className="mt-12 flex justify-center">
                                        <div className="inline-flex items-center gap-2 bg-card border border-border rounded-lg p-1">
                                            <Button variant="ghost" size="sm" disabled>
                                                Previous
                                            </Button>
                                            <Button variant="ghost" size="sm" className="bg-primary text-primary-foreground">
                                                1
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                2
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                3
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Shop;
