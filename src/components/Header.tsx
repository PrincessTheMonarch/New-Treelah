import { Gift, Heart, ShoppingCart, Search, Sparkles, UserCircle, Menu, LogOut, User, Bell, ChevronDown, Headphones, X, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef, FormEvent } from "react";
import { toast } from "sonner";

export function Header() {
  const { getTotalItems } = useCart();
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [giftFinderOpen, setGiftFinderOpen] = useState(false);
  const [formData, setFormData] = useState({
    recipient: "",
    relationship: "",
    occasion: "",
    ageGroup: "",
  });
  const navigate = useNavigate();
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    };

    if (categoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoriesOpen]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleGiftFinderSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Build URL parameters based on form data
    const params = new URLSearchParams();

    // Add tag based on recipient
    if (formData.recipient === "male") {
      params.append("tag", "For Him");
    } else if (formData.recipient === "female") {
      params.append("tag", "For Her");
    }

    // Add occasion
    if (formData.occasion) {
      // Capitalize first letter
      const occasionFormatted = formData.occasion.charAt(0).toUpperCase() + formData.occasion.slice(1);
      params.append("occasion", occasionFormatted);
    }

    // Add gift finder flag to show restart button
    params.append("fromGiftFinder", "true");

    // Store additional criteria in params for display
    if (formData.relationship) {
      params.append("relationship", formData.relationship);
    }
    if (formData.ageGroup) {
      params.append("ageGroup", formData.ageGroup);
    }

    setGiftFinderOpen(false);
    setMobileMenuOpen(false);
    navigate(`/products?${params.toString()}`);
  };

  // Category data structure
  const categoryGroups = [
    {
      header: "By Occasion",
      items: [
        { name: "Birthdays", link: "/products?occasion=Birthdays" },
        { name: "Weddings", link: "/products?occasion=Weddings" },
        { name: "Anniversaries", link: "/products?occasion=Anniversaries" },
        { name: "Baby Showers", link: "/products?occasion=Baby%20Showers" },
        { name: "Graduations", link: "/products?occasion=Graduations" },
      ]
    },
    {
      header: "By Recipient",
      items: [
        { name: "For Him", link: "/products?tag=For%20Him" },
        { name: "For Her", link: "/products?tag=For%20Her" },
        { name: "For Kids", link: "/products?tag=For%20Kids" },
        { name: "For Teens", link: "/products" },
        { name: "For Colleagues", link: "/products" },
        { name: "For Couples", link: "/products" },
      ]
    },
    {
      header: "By Age",
      items: [
        { name: "Babies", link: "/products" },
        { name: "Toddlers", link: "/products" },
        { name: "Children", link: "/products" },
        { name: "Teens", link: "/products" },
        { name: "Adults", link: "/products" },
        { name: "Seniors", link: "/products" },
      ]
    },
    {
      header: "By Type",
      items: [
        { name: "Toys & Games", link: "/products/toys-games" },
        { name: "Home & Living", link: "/products/home-living" },
        { name: "Beauty & Wellness", link: "/products/beauty-wellness" },
        { name: "Fashion & Accessories", link: "/products/fashion-accessories" },
        { name: "Tech & Gadgets", link: "/products/tech-gadgets" },
        { name: "Food & Beverages", link: "/products/food-beverages" },
      ]
    }
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full">
      <div className="container mx-auto flex flex-col gap-2 px-4 max-w-full overflow-hidden pt-2">
        {/* Top Row: Logo on left, Cart and Menu on right */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Mobile First - Top Left */}
          <Link to="/" className="flex flex-col flex-shrink-0 hover:opacity-80 transition-opacity">
            <span className="font-semibold text-white text-lg">Treelah</span>
            <span className="text-white/80 text-sm">Tag line</span>
          </Link>

          {/* Cart and Menu - Top Right */}
          <div className="flex items-center gap-2">
            {/* Cart Button - Shows when items in cart */}
            {getTotalItems() > 0 && (
              <Link to="/cart">
                <div
                  className="rounded-full relative transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: '#FF8C42',
                    padding: '8px',
                    border: 'none'
                  }}
                >
                  <ShoppingCart
                    className="h-5 w-5"
                    style={{
                      color: '#FFFFFF'
                    }}
                  />
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-[#FF8C42] text-xs flex items-center justify-center font-semibold">
                    {getTotalItems()}
                  </span>
                </div>
              </Link>
            )}

            {/* Mobile Menu Button - Top Right */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-full h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 p-0 flex flex-col max-h-[80vh] overflow-y-auto">
            <SheetHeader className="p-4 sm:p-6 pb-4">
              <SheetDescription className="text-sm">
                Navigate our gift collections and services
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
              {/* Quick Actions Icons */}
              <div className="flex items-center justify-center gap-4 mb-6">
                {/* Cart Icon */}
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                  <div
                    className="rounded-full relative transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: getTotalItems() > 0 ? '#FF8C42' : 'transparent',
                      padding: '8px',
                      border: getTotalItems() > 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <ShoppingCart 
                      className="h-5 w-5" 
                      style={{
                        color: getTotalItems() > 0 ? '#FFFFFF' : '#FFFFFF'
                      }}
                    />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-[#FF8C42] text-xs flex items-center justify-center font-semibold">
                        {getTotalItems()}
                      </span>
                    )}
                  </div>
                </Link>
                
                {/* Heart Icon */}
                <Button variant="ghost" size="icon" className="rounded-full text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200 cursor-pointer" title="Wishlist">
                  <Heart className="h-5 w-5" />
                </Button>
                
                {/* Headphone Icon */}
                <Button variant="ghost" size="icon" className="rounded-full text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200 cursor-pointer" title="Support">
                  <Headphones className="h-5 w-5" />
                </Button>
                
                {/* User Profile Icon */}
                {loading ? (
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                ) : user ? (
                  <div className="relative group">
                    <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="icon" className="rounded-full text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200 cursor-pointer" title="Account">
                        <UserCircle className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="icon" className="rounded-full text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200 cursor-pointer" title="Sign In">
                      <UserCircle className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Shopping Assistant */}
              <Dialog open={giftFinderOpen} onOpenChange={setGiftFinderOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    style={{
                      backgroundColor: '#FF8C42',
                      color: 'white',
                      borderRadius: '9999px',
                      fontWeight: '600',
                      border: 'none',
                      width: '100%',
                      height: '40px'
                    }}
                    className="gap-2 mb-4 hover:opacity-90 transition-opacity"
                  >
                    <Sparkles className="h-5 w-5" />
                    Shopping Assistant
                  </Button>
                </DialogTrigger>

                <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[35vh] overflow-y-auto">
                  <DialogHeader className="pb-2">
                    <DialogTitle className="text-lg sm:text-xl">Find Your Perfect Gift</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                      Answer a few quick questions and we'll suggest the best gifts!
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleGiftFinderSubmit} className="space-y-2 sm:space-y-3 mt-2">
                    {/* Recipient Gender */}
                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">Who's the gift for?</Label>
                      <RadioGroup
                        value={formData.recipient}
                        onValueChange={(value) => setFormData({ ...formData, recipient: value })}
                      >
                        <div className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg border hover:bg-accent cursor-pointer">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="cursor-pointer flex-1 text-sm sm:text-base">For Him</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg border hover:bg-accent cursor-pointer">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="cursor-pointer flex-1 text-sm sm:text-base">For Her</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg border hover:bg-accent cursor-pointer">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other" className="cursor-pointer flex-1 text-sm sm:text-base">Anyone</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Relationship */}
                    <div className="space-y-2">
                      <Label htmlFor="relationship" className="text-sm sm:text-base">Relationship</Label>
                      <Select
                        value={formData.relationship}
                        onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                      >
                        <SelectTrigger id="relationship" className="h-10">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="partner">Partner</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="colleague">Colleague</SelectItem>
                          <SelectItem value="boss">Boss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Occasion */}
                    <div className="space-y-2">
                      <Label htmlFor="occasion" className="text-sm sm:text-base">Occasion</Label>
                      <Select
                        value={formData.occasion}
                        onValueChange={(value) => setFormData({ ...formData, occasion: value })}
                      >
                        <SelectTrigger id="occasion" className="h-10">
                          <SelectValue placeholder="Select occasion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="birthday">Birthday</SelectItem>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="anniversary">Anniversary</SelectItem>
                          <SelectItem value="graduation">Graduation</SelectItem>
                          <SelectItem value="promotion">Promotion</SelectItem>
                          <SelectItem value="justbecause">Just Because</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Age Group */}
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm sm:text-base">Age Group</Label>
                      <Select
                        value={formData.ageGroup}
                        onValueChange={(value) => setFormData({ ...formData, ageGroup: value })}
                      >
                        <SelectTrigger id="age" className="h-10">
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="child">Child (0-12)</SelectItem>
                          <SelectItem value="teen">Teen (13-19)</SelectItem>
                          <SelectItem value="adult">Adult (20-59)</SelectItem>
                          <SelectItem value="senior">Senior (60+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full rounded-full h-10 text-sm" size="lg">
                      Find My Perfect Gift
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Separator className="my-6" />

              {/* Auth Section - Mobile */}
              {!loading && (
                <div className="mb-4 sm:mb-6">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-xl">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm sm:text-base">{user.email}</p>
                          <p className="text-xs text-muted-foreground">Signed in</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full gap-2 h-10"
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full h-10">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-10">
                          Create Account
                        </Button>
                      </Link>
                    </div>
                  )}
                  <Separator className="my-4 sm:my-6" />
                </div>
              )}

              {/* Categories Navigation Drawer */}
              <div className="pt-2">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                  {/* Left: Categories */}
                  <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="flex items-center gap-2 text-[#1A1A1A]"
                  >
                    <span className="text-2xl font-bold">Categories</span>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {/* Right: X (Close) */}
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6 text-[#1A1A1A]" />
                  </button>
                </div>

                {/* Categories Dropdown Content */}
                {categoriesOpen && (
                  <div className="space-y-8 pb-4">
                    {categoryGroups.map((group, groupIndex) => (
                      <div key={groupIndex}>
                        <h4 className="text-sm font-medium text-[#8F90A6] mb-4 uppercase tracking-wide">
                          {group.header}
                        </h4>
                        <ul className="space-y-4">
                          {group.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link
                                to={item.link}
                                className="block py-1 text-lg text-[#374151] hover:text-[#FF8C42] transition-colors duration-150"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setCategoriesOpen(false);
                                }}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Links (Cart & Support) when categories collapsed */}
                {!categoriesOpen && (
                  <div className="space-y-4 pt-2">
                    <Link
                      to="/cart"
                      className="flex items-center gap-3 py-3 text-[#1A1A1A] hover:text-[#FF8C42] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className="rounded-full relative transition-all duration-200 cursor-pointer"
                        style={{
                          backgroundColor: '#FF8C42',
                          padding: '8px',
                          border: 'none'
                        }}
                      >
                        <ShoppingCart
                          className="h-5 w-5"
                          style={{ color: '#FFFFFF' }}
                        />
                        {getTotalItems() > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-[#FF8C42] text-xs flex items-center justify-center font-semibold">
                            {getTotalItems()}
                          </span>
                        )}
                      </div>
                      <span className="text-xl font-medium">Cart</span>
                    </Link>
                    <Link
                      to="#"
                      className="flex items-center gap-3 py-3 text-[#1A1A1A] hover:text-[#FF8C42] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Headphones className="h-5 w-5" />
                      <span className="text-xl font-medium">Support</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </div>

        {/* Mobile Search Bar - Below Logo and Hamburger Menu */}
        <div className="w-full lg:hidden px-4">
          <div
            className="relative w-full flex items-center justify-between max-w-sm mx-auto"
            style={{
              height: '40px',
              justifyContent: 'space-between',
              borderRadius: '24px',
              borderWidth: '0.2px',
              paddingRight: '16px',
              paddingLeft: '16px',
              backgroundColor: '#F6F6F6'
            }}
          >
            <Input
              placeholder="Search for the perfect gift..."
              className="border-0 bg-transparent text-gray-600 placeholder:text-[#717182] flex-1 px-0 text-sm"
              style={{ color: '#717182' }}
            />
            <Search className="h-4 w-4 text-[#717182]" />
          </div>
        </div>

        {/* Main Navigation - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-2 flex-1 justify-center max-w-5xl">
          {/* Center-Left: Navigation Links */}
          <div className="flex items-center gap-2 xl:gap-3">
            {/* Categories with Mega Menu */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1 px-2 py-2 text-white cursor-pointer whitespace-nowrap text-sm"
                style={{ opacity: 0.7 }}
              >
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {/* Mega Menu Dropdown */}
              {categoriesOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 rounded-2xl shadow-2xl border border-gray-200 bg-white"
                  style={{
                    width: '600px',
                    backgroundColor: '#FFFFFF',
                    padding: '24px',
                    opacity: 1,
                    zIndex: 99999,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    position: 'fixed',
                    top: '80px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-4 gap-8 w-full">
                    {/* Column 1: By Occasion */}
                    <div className="min-h-[200px]">
                      <h3 className="font-medium text-gray-600 text-sm mb-4 font-semibold">By Occasion</h3>
                      <ul className="space-y-3">
                        <li><Link to="/products?occasion=Birthdays" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Birthdays</Link></li>
                        <li><Link to="/products?occasion=Weddings" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Weddings</Link></li>
                        <li><Link to="/products?occasion=Anniversaries" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Anniversaries</Link></li>
                        <li><Link to="/products?occasion=Baby%20Showers" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Baby Showers</Link></li>
                        <li><Link to="/products?occasion=Graduations" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Graduations</Link></li>
                      </ul>
                    </div>
                    
                    {/* Column 2: By Recipient */}
                    <div className="min-h-[200px]">
                      <h3 className="font-medium text-gray-600 text-sm mb-4 font-semibold">By Recipient</h3>
                      <ul className="space-y-3">
                        <li><Link to="/products?tag=For%20Him" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">For Him</Link></li>
                        <li><Link to="/products?tag=For%20Her" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">For Her</Link></li>
                        <li><Link to="/products?tag=For%20Kids" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">For Kids</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">For Teens</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">For Colleagues</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">For Couples</Link></li>
                      </ul>
                    </div>
                    
                    {/* Column 3: By Age */}
                    <div className="min-h-[200px]">
                      <h3 className="font-medium text-gray-600 text-sm mb-4 font-semibold">By Age</h3>
                      <ul className="space-y-3">
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Babies</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Toddlers</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Children</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Teens</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Adults</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Seniors</Link></li>
                      </ul>
                    </div>
                    
                    {/* Column 4: By Type */}
                    <div className="min-h-[200px]">
                      <h3 className="font-medium text-gray-600 text-sm mb-4 font-semibold">By Type</h3>
                      <ul className="space-y-3">
                        <li><Link to="/products/toys-games" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Toys & Games</Link></li>
                        <li><Link to="/products/home-living" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Home & Livings</Link></li>
                        <li><Link to="/products/beauty-wellness" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Beauty & Wellness</Link></li>
                        <li><Link to="/products/fashion-accessories" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Fashion & Accessories</Link></li>
                        <li><Link to="/products/tech-gadgets" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Tech & Gadgets</Link></li>
                        <li><Link to="/products/food-beverages" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Food & Beverages</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Other Navigation Items */}
            <div className="flex items-center gap-2 xl:gap-3">
              <Link 
                to="/bulk-orders" 
                className="px-2 py-2 text-white cursor-pointer whitespace-nowrap text-sm" 
                style={{ opacity: 0.7 }}
              >
                Souvenirier & Bulk Orders
              </Link>
            </div>
          </div>

          {/* Center: Shopping Assistant Button */}
          <Link to="/?openGiftFinder=true">
            <div 
              className="flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              style={{
                width: '160px',
                height: '36px',
                backgroundColor: '#FF8C42',
                borderRadius: '24px',
                paddingLeft: '14px',
                paddingRight: '14px',
                gap: '4px',
                opacity: 1,
                boxShadow: '0 4px 14px rgba(255, 140, 66, 0.4)',
                border: 'none'
              }}
            >
              <Sparkles className="h-3 w-3 text-white flex-shrink-0" />
              <span 
                className="text-white whitespace-nowrap"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#FFFFFF'
                }}
              >
                Shopping Assistant
              </span>
            </div>
          </Link>

          {/* Center-Right: Search Bar */}
          <div className="relative flex-shrink-0">
            <div 
              className="flex items-center justify-between"
              style={{
                width: '180px',
                height: '36px',
                backgroundColor: '#F6F6F6',
                borderRadius: '24px',
                borderWidth: '0.2px',
                paddingLeft: '10px',
                paddingRight: '12px',
                gap: '6px',
                opacity: 1
              }}
            >
              <Input
                placeholder="Search..."
                className="border-0 bg-transparent text-gray-600 placeholder:text-[#717182] flex-1 px-0 text-xs"
                style={{ color: '#717182' }}
              />
              <Search className="h-3 w-3 text-[#717182]" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}








