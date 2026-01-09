import { ShoppingCart, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = getCartCount();

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="text-xl lg:text-2xl font-bold text-primary">MediPro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-foreground/80 hover:text-primary font-medium transition-colors">
              Shop
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-primary font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-primary font-medium transition-colors">
              Contact
            </Link>
          </div>

          {/* Cart, Auth & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Auth Section - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium max-w-24 truncate">{user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-semibold text-foreground">{user?.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-2 text-foreground"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link to="/shop" className="text-foreground/80 hover:text-primary font-medium transition-colors py-2">
                Shop
              </Link>
              <Link to="/about" className="text-foreground/80 hover:text-primary font-medium transition-colors py-2">
                About
              </Link>
              <Link to="/contact" className="text-foreground/80 hover:text-primary font-medium transition-colors py-2">
                Contact
              </Link>

              {/* Mobile Auth Links */}
              <div className="pt-4 border-t border-border space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="py-2">
                      <p className="font-semibold text-foreground">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
