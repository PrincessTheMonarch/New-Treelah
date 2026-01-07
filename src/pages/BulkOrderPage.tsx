import { useState, useMemo, CSSProperties, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Checkbox } from "../components/ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useBulkOrder } from "../context/BulkOrderContext";
import { useCart } from "../context/CartContext";
import { allProducts } from "../data/products";
import {
  Search,
  ShoppingBag,
  MessageSquare,
  Minus,
  Plus,
  X,
  Check,
  Sparkles,
  ChevronDown,
  ShoppingCart,
  Heart,
  Headset,
  User,
  ArrowLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";

export function BulkOrderPage() {
  const { items, addItem, removeItem, updateQuantity, updateCustomization, getTotalItems, getTotalPrice, clearOrder } = useBulkOrder();
  const { addToCart, items: cartItems, getTotalItems: getCartItems } = useCart();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedOccasion, setSelectedOccasion] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [deliveryTime, setDeliveryTime] = useState("all");
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [currentStep, setCurrentStep] = useState<"selection" | "customization" | "checkout">("selection");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [giftFinderOpen, setGiftFinderOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  // Gift Finder form state
  const [giftFinderForm, setGiftFinderForm] = useState({
    recipient: "",
    relationship: "",
    occasion: "",
    ageGroup: "",
  });

  // Company/checkout details
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    deliveryDate: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Filter products (only show products suitable for bulk orders)
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];
    
    const matchesSearch = searchQuery.toLowerCase() === "" || 
      filtered.filter((product) => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).length > 0;
    
    if (matchesSearch && searchQuery) {
      filtered = filtered.filter((product) => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    const matchesCategory = selectedCategory === "all" || filtered.filter((product) => product.category === selectedCategory).length > 0;
    if (matchesCategory && selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    
    const matchesOccasion = selectedOccasion === "all" || filtered.filter((product) => product.occasion.includes(selectedOccasion)).length > 0;
    if (matchesOccasion && selectedOccasion !== "all") {
      filtered = filtered.filter((product) => product.occasion.includes(selectedOccasion));
    }
    
    let matchesPrice = true;
    const price = parseFloat(filtered[0]?.price.replace("$", "") || "0");
    if (priceRange === "under50") matchesPrice = price < 50;
    else if (priceRange === "50to100") matchesPrice = price >= 50 && price <= 100;
    else if (priceRange === "over100") matchesPrice = price > 100;
    
    if (!matchesPrice && priceRange !== "all") {
      filtered = filtered.filter((product) => {
        const p = parseFloat(product.price.replace("$", ""));
        if (priceRange === "under50") return p < 50;
        if (priceRange === "50to100") return p >= 50 && p <= 100;
        if (priceRange === "over100") return p > 100;
        return true;
      });
    }
    
    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", "")));
        break;
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", "")));
        break;
      case "newest":
        filtered.reverse();
        break;
      case "popularity":
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }
    
    return filtered;
  }, [searchQuery, selectedCategory, selectedOccasion, priceRange, sortBy]);

  const categories = Array.from(new Set(allProducts.map((p) => p.category)));
  const occasions = Array.from(new Set(allProducts.flatMap((p) => p.occasion)));

  // Handle Gift Finder form submission
  const handleGiftFinderSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (giftFinderForm.recipient === "male") params.append("tag", "For Him");
    else if (giftFinderForm.recipient === "female") params.append("tag", "For Her");
    if (giftFinderForm.occasion) {
      const occasionFormatted = giftFinderForm.occasion.charAt(0).toUpperCase() + giftFinderForm.occasion.slice(1);
      params.append("occasion", occasionFormatted);
    }
    params.append("fromGiftFinder", "true");
    if (giftFinderForm.relationship) params.append("relationship", giftFinderForm.relationship);
    if (giftFinderForm.ageGroup) params.append("ageGroup", giftFinderForm.ageGroup);
    setGiftFinderOpen(false);
    navigate(`/products?${params.toString()}`);
  };

  const handleAddToBulkOrder = (product: typeof allProducts[0]) => {
    // Add to bulk order context
    addItem(product, 10);
    
    // Also add to regular cart
    const priceNum = parseFloat(product.price.replace('$', ''));
    addToCart({
      id: product.id,
      title: product.title,
      price: priceNum,
      image: product.image,
      category: product.category,
    });
    
    toast.success(`${product.title} added to cart!`);
  };

  const handleProceedToCustomization = () => {
    if (items.length === 0) {
      toast.error("Please add items to your bulk order first");
      return;
    }
    setCurrentStep("customization");
    setSheetOpen(false);
    window.scrollTo(0, 0);
  };

  const handleProceedToCheckout = () => {
    setCurrentStep("checkout");
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = () => {
    if (!companyDetails.companyName || !companyDetails.contactPerson || !companyDetails.email) {
      toast.error("Please fill in all required company details");
      return;
    }
    toast.success("Bulk order placed successfully! We'll contact you shortly.");
    clearOrder();
    setCurrentStep("selection");
    setCompanyDetails({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      deliveryDate: "",
    });
  };

  const calculateBulkDiscount = (totalPrice: number) => {
    if (totalPrice > 1000) return 0.15;
    if (totalPrice > 500) return 0.10;
    if (totalPrice > 250) return 0.05;
    return 0;
  };

  const subtotal = getTotalPrice();
  const discountRate = calculateBulkDiscount(subtotal);
  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  // Header styles from ProductListPage
  const headerStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: 'white',
    borderBottom: '1px solid #E5E7EB',
    width: '100%',
    padding: '12px 16px',
  };

  const headerContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerLeftStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const logoCircleStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const brandStackStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const brandNameStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1A1A1A',
    lineHeight: '1.2',
  };

  const brandTaglineStyle: CSSProperties = {
    fontSize: '11px',
    color: '#6B7280',
    lineHeight: '1.2',
  };

  const navLinksStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  };

  const navLinkStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#1A1A1A',
    cursor: 'pointer',
    padding: '8px 0',
  };

  const shoppingAssistantButtonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '20px',
    backgroundColor: '#FF8C42',
    color: 'white',
    border: 'none',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
  };

  const headerCenterStyle: CSSProperties = {
    flex: 1,
    maxWidth: '400px',
    marginLeft: '20px',
    marginRight: '20px',
  };

  const searchBarContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  };

  const searchInputStyle: CSSProperties = {
    width: '100%',
    padding: '8px 36px 8px 14px',
    borderRadius: '20px',
    border: '1px solid #E5E7EB',
    backgroundColor: '#F6F6F6',
    fontSize: '13px',
    outline: 'none',
  };

  const searchIconStyle: CSSProperties = {
    position: 'absolute',
    right: '12px',
    color: '#6B7280',
    cursor: 'pointer',
  };

  const headerRightStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const iconButtonStyle: CSSProperties = {
    cursor: 'pointer',
    color: '#1A1A1A',
  };

  // Mega Menu styles
  const megaMenuContainerStyle: CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: '70%',
    transform: 'translateX(-30%)',
    width: '480px',
    backgroundColor: '#FBFBFB',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginTop: '8px',
    zIndex: 100,
    display: categoriesOpen ? 'flex' : 'none',
    gap: '12px',
  };

  const megaMenuColumnStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '6px 12px',
    alignItems: 'flex-start',
  };

  const megaMenuHeaderStyle: CSSProperties = {
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    color: '#717182',
    marginBottom: '4px',
  };

  const megaMenuLinkStyle: CSSProperties = {
    fontSize: '13px',
    fontWeight: 400,
    color: '#1A1A1A',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
  };

  const megaMenuColumns = [
    {
      header: "By Occasion",
      links: ["Birthdays", "Weddings", "Anniversaries", "Baby Showers", "Graduations"],
    },
    {
      header: "By Recipient",
      links: ["For Him", "For Her", "For Kids", "For Teens", "For Colleagues", "For Couples"],
    },
    {
      header: "By Age",
      links: ["Babies", "Toddlers", "Children", "Teens", "Adults", "Seniors"],
    },
    {
      header: "By Type",
      links: ["Toys & Games", "Home & Living", "Beauty & Wellness", "Fashion & Accessories", "Tech & Gadgets", "Food & Beverages"],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Header Navigation from ProductListPage */}
      <header style={headerStyle}>
        <div style={headerContainerStyle}>
          {/* Left: Logo + Brand Name + Tagline */}
          <div style={headerLeftStyle}>
            <div style={logoCircleStyle}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>Logo</span>
            </div>
            <div style={brandStackStyle}>
              <span style={brandNameStyle}>Treelah</span>
              <span style={brandTaglineStyle}>Tag line</span>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div style={navLinksStyle}>
            {/* Categories with Mega Menu */}
            <div style={{ position: 'relative' }}>
              <div
                style={navLinkStyle}
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                Categories
                <ChevronDown size={14} style={{
                  transform: categoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} />
              </div>
              {/* Mega Menu Dropdown */}
              <div style={megaMenuContainerStyle}>
                {megaMenuColumns.map((column, colIndex) => (
                  <div key={colIndex} style={megaMenuColumnStyle}>
                    <span style={megaMenuHeaderStyle}>{column.header}</span>
                    {column.links.map((link, linkIndex) => (
                      <span
                        key={linkIndex}
                        style={megaMenuLinkStyle}
                        onClick={() => {
                          setSearchQuery(link);
                          const params = new URLSearchParams();
                          params.set("search", link);
                          navigate(`/products?${params.toString()}`);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.textDecoration = 'underline';
                          e.currentTarget.style.color = '#FF8C42';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.textDecoration = 'none';
                          e.currentTarget.style.color = '#1A1A1A';
                        }}
                      >
                        {link}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <Link to="/bulk-orders" style={{ ...navLinkStyle, textDecoration: 'none' }}>
              Souvenirs & Bulk Orders
            </Link>

            {/* Shopping Assistant Button */}
            <Dialog open={giftFinderOpen} onOpenChange={setGiftFinderOpen}>
              <DialogTrigger asChild>
                <button style={shoppingAssistantButtonStyle}>
                  <Sparkles size={14} />
                  Shopping Assistant
                </button>
              </DialogTrigger>
              <DialogContent style={{ maxWidth: '500px', maxHeight: '80vh', overflow: 'auto' }}>
                <DialogHeader>
                  <DialogTitle style={{ fontSize: '18px' }}>Find Your Perfect Gift</DialogTitle>
                  <DialogDescription style={{ fontSize: '14px' }}>
                    Answer a few quick questions and we'll suggest the best gifts!
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleGiftFinderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                  <div>
                    <Label style={{ fontSize: '14px', fontWeight: 500 }}>Who's the gift for?</Label>
                    <RadioGroup
                      value={giftFinderForm.recipient}
                      onValueChange={(value) => setGiftFinderForm({ ...giftFinderForm, recipient: value })}
                      style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer' }}>
                        <RadioGroupItem value="male" id="gf-male" />
                        <Label htmlFor="gf-male" style={{ cursor: 'pointer', flex: 1, fontSize: '14px' }}>For Him</Label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer' }}>
                        <RadioGroupItem value="female" id="gf-female" />
                        <Label htmlFor="gf-female" style={{ cursor: 'pointer', flex: 1, fontSize: '14px' }}>For Her</Label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer' }}>
                        <RadioGroupItem value="other" id="gf-other" />
                        <Label htmlFor="gf-other" style={{ cursor: 'pointer', flex: 1, fontSize: '14px' }}>Anyone</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="gf-relationship" style={{ fontSize: '14px', fontWeight: 500 }}>Relationship</Label>
                    <Select
                      value={giftFinderForm.relationship}
                      onValueChange={(value) => setGiftFinderForm({ ...giftFinderForm, relationship: value })}
                    >
                      <SelectTrigger id="gf-relationship" style={{ marginTop: '8px', height: '40px' }}>
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

                  <div>
                    <Label htmlFor="gf-occasion" style={{ fontSize: '14px', fontWeight: 500 }}>Occasion</Label>
                    <Select
                      value={giftFinderForm.occasion}
                      onValueChange={(value) => setGiftFinderForm({ ...giftFinderForm, occasion: value })}
                    >
                      <SelectTrigger id="gf-occasion" style={{ marginTop: '8px', height: '40px' }}>
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

                  <div>
                    <Label htmlFor="gf-age" style={{ fontSize: '14px', fontWeight: 500 }}>Age Group</Label>
                    <Select
                      value={giftFinderForm.ageGroup}
                      onValueChange={(value) => setGiftFinderForm({ ...giftFinderForm, ageGroup: value })}
                    >
                      <SelectTrigger id="gf-age" style={{ marginTop: '8px', height: '40px' }}>
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

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '24px',
                      backgroundColor: '#FF8C42',
                      color: 'white',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                  >
                    Find My Perfect Gift
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right: Search Bar + Utility Icons */}
          <div style={headerRightStyle}>
            <div style={headerCenterStyle}>
              <div style={searchBarContainerStyle}>
                <input
                  type="text"
                  placeholder="Search gifts..."
                  style={searchInputStyle}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div style={searchIconStyle}>
                  <Search size={16} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link to="/cart" style={{ position: 'relative', ...iconButtonStyle }}>
                <ShoppingCart size={20} />
                {getCartItems() > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#FF8C42',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                  }}>
                    {getCartItems()}
                  </span>
                )}
              </Link>
              <div style={iconButtonStyle}>
                <Heart size={20} />
              </div>
              <div style={iconButtonStyle}>
                <Headset size={20} />
              </div>
              <div style={iconButtonStyle}>
                <User size={20} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {currentStep === "selection" && (
        <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1745970649913-2edb9dca4f74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBnaWZ0cyUyMHRlYW18ZW58MXx8fHwxNzYxNjY0MzAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Bulk gifts"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4">
                Need gifts for your team, clients, or event? We've got you covered.
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
                Bulk discounts, personalized packaging, and fast delivery, all in one place.
              </p>

              {/* Bulk Discount Info */}
              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
                <div style={{ backgroundColor: '#EAF9FF', borderRadius: '12px', border: '1px solid #1A1A1A', padding: '16px' }}>
                  <p className="font-semibold text-sm sm:text-base" style={{ color: '#1A1A1A' }}>5% OFF</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Orders from ₦250,000+</p>
                </div>
                <div style={{ backgroundColor: '#EAF9FF', borderRadius: '12px', border: '1px solid #1A1A1A', padding: '16px' }}>
                  <p className="font-semibold text-sm sm:text-base" style={{ color: '#1A1A1A' }}>10% OFF</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Orders from ₦500,000+</p>
                </div>
                <div style={{ backgroundColor: '#EAF9FF', borderRadius: '12px', border: '1px solid #1A1A1A', padding: '16px' }}>
                  <p className="font-semibold text-sm sm:text-base" style={{ color: '#1A1A1A' }}>15% OFF</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Orders from ₦1,000,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Product Selection Step */}
        {currentStep === "selection" && (
          <div id="product-selection">
            {/* Bulk Filter & Search Bar */}
            <div className="mb-6 sm:mb-8">
              {/* Row 1: Four Dropdown Filters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '12px' }}>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger style={{ height: '44px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
                  <SelectTrigger style={{ height: '44px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <SelectValue placeholder="All Occasions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Occasions</SelectItem>
                    {occasions.map((occ) => (
                      <SelectItem key={occ} value={occ}>{occ}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger style={{ height: '44px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <SelectValue placeholder="All Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Price Range</SelectItem>
                    <SelectItem value="under50">Under ₦50,000</SelectItem>
                    <SelectItem value="50to100">₦50,000 - ₦100,000</SelectItem>
                    <SelectItem value="over100">Over ₦100,000</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                  <SelectTrigger style={{ height: '44px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <SelectValue placeholder="All Delivery Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Delivery Time</SelectItem>
                    <SelectItem value="next-day">Next Day</SelectItem>
                    <SelectItem value="2-3-days">2-3 Days</SelectItem>
                    <SelectItem value="1-week">Within 1 Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row 2: Search & Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search for the perfect gift"
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#F6F6F6',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Checkbox
                    id="customizable"
                    checked={customizableOnly}
                    onCheckedChange={(checked) => setCustomizableOnly(checked as boolean)}
                  />
                  <Label htmlFor="customizable" className="cursor-pointer text-sm">
                    Customizable Items Only
                  </Label>
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                Showing ({filteredProducts.length}) items
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger style={{ width: '160px', borderRadius: '24px', height: '40px' }}>
                  <SelectValue placeholder="Popularity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Floating Action Button - Talk to a consultant */}
            <div
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 100,
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="#"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        borderRadius: '24px',
                        backgroundColor: '#FF8C42',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                      }}
                      onClick={(e) => { e.preventDefault(); }}
                    >
                      <MessageSquare size={18} />
                      <span style={{ whiteSpace: 'nowrap' }}>Talk to a consultant</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Click to chat on WhatsApp</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Floating Bulk Order Button */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                      <Button
                        size="lg"
                        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 h-16 w-16 sm:h-20 sm:w-20 rounded-full shadow-lg hover:shadow-xl transition-all z-50 p-0 bg-gradient-to-br from-primary to-secondary hover:scale-110"
                        style={{ background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)' }}
                      >
                        <div className="flex flex-col items-center justify-center relative w-full h-full">
                          <ShoppingBag className="h-5 w-5 sm:h-7 sm:w-7" />
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                            <defs>
                              <path
                                id="circlePath"
                                d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                              />
                            </defs>
                            <text className="fill-white text-[6px] sm:text-[8px] tracking-wider" style={{ fontWeight: 600 }}>
                              <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                                BULK ORDER CHECKOUT
                              </textPath>
                            </text>
                          </svg>
                          {getTotalItems() > 0 && (
                            <Badge className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 h-6 w-6 sm:h-8 sm:w-8 rounded-full p-0 flex items-center justify-center font-semibold bg-red-500 border-2 sm:border-4 border-white shadow-md animate-in zoom-in duration-200 text-xs sm:text-sm">
                              {getTotalItems()}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    </SheetTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Review My Bulk Order</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-lg sm:text-xl">My Bulk Order</SheetTitle>
                  <SheetDescription className="text-sm">
                    Review your bulk order items and proceed to customization
                  </SheetDescription>
                </SheetHeader>

                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                    <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
                    <p className="text-sm sm:text-base text-muted-foreground mb-2">No items in bulk order</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Add items from the product list
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 sm:space-y-4 py-4 sm:py-6">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex gap-2 sm:gap-3 border rounded-lg p-2 sm:p-3">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <ImageWithFallback
                              src={item.product.image}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium line-clamp-2 text-xs sm:text-sm mb-1">
                              {item.product.title}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                              {item.product.price} per unit
                            </p>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6 sm:h-7 sm:w-7"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                disabled={item.quantity <= 10}
                              >
                                <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                              <span className="text-xs sm:text-sm font-medium w-8 sm:w-12 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6 sm:h-7 sm:w-7"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 sm:h-7 sm:w-7 ml-auto"
                                onClick={() => removeItem(item.product.id)}
                              >
                                <X className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2 py-3 sm:py-4">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {discountRate > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm text-primary">
                          <span>Bulk Discount ({(discountRate * 100).toFixed(0)}%)</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold text-sm">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full h-12"
                      size="lg"
                      onClick={handleProceedToCustomization}
                      style={{ background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)' }}
                    >
                      Proceed to Customization
                    </Button>
                  </>
                )}
              </SheetContent>
            </Sheet>

            {/* Product Grid */}
            <div className="mb-6 sm:mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="aspect-square overflow-hidden bg-muted" style={{ borderRadius: '16px 16px 0 0' }}>
                      <ImageWithFallback
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{product.title}</h3>
                      <div className="flex items-center gap-1 sm:gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          Min. 10 units
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Personalize
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Per unit</p>
                          <p className="font-semibold text-sm sm:text-base">{product.price}</p>
                        </div>
                      </div>
                      <Button
                        className="w-full h-9 text-xs sm:text-sm"
                        onClick={() => handleAddToBulkOrder(product)}
                        style={{ background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)' }}
                      >
                        Add to Bulk Order
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customization Step */}
        {currentStep === "customization" && (
          <div>
            <div className="mb-4 sm:mb-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep("selection")}
                className="mb-3 sm:mb-4 h-10 text-sm"
              >
                <ArrowLeft size={16} style={{ marginRight: '8px' }} />
                Back to Product Selection
              </Button>
              <h2 className="text-xl sm:text-2xl lg:text-3xl mb-2">Customize Your Bulk Order</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Add personalization to make your gifts extra special
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="bg-card rounded-lg border p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-muted flex-shrink-0 mx-auto sm:mx-0">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold mb-1 text-sm sm:text-base">{item.product.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Quantity: {item.quantity} units
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label htmlFor={`logo-${item.product.id}`} className="text-sm">Add Company Logo</Label>
                      <div className="mt-2 border-2 border-dashed rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors cursor-pointer">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Click to upload logo (PNG, JPG)
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`message-${item.product.id}`} className="text-sm">
                        Personalized Message Card
                      </Label>
                      <textarea
                        id={`message-${item.product.id}`}
                        placeholder="Enter your message for the gift card..."
                        rows={3}
                        className="mt-2 w-full px-3 py-2 border rounded-md text-sm"
                        onChange={(e) =>
                          updateCustomization(item.product.id, { message: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor={`packaging-${item.product.id}`} className="text-sm">
                        Packaging Option
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          updateCustomization(item.product.id, { packaging: value })
                        }
                      >
                        <SelectTrigger className="mt-2 h-10">
                          <SelectValue placeholder="Select packaging" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Gift Box</SelectItem>
                          <SelectItem value="premium">Premium Gift Wrap (+$2/unit)</SelectItem>
                          <SelectItem value="branded">Branded Box (+$3/unit)</SelectItem>
                          <SelectItem value="eco">Eco-Friendly Wrap (+$1.50/unit)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`delivery-note-${item.product.id}`} className="text-sm">
                        Delivery Instructions
                      </Label>
                      <textarea
                        id={`delivery-note-${item.product.id}`}
                        placeholder="e.g., Deliver directly to employees"
                        rows={3}
                        className="mt-2 w-full px-3 py-2 border rounded-md text-sm"
                        onChange={(e) =>
                          updateCustomization(item.product.id, { deliveryNote: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 bg-card rounded-lg border p-4 sm:p-6">
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">Total Order Value</p>
                <p className="text-xl sm:text-2xl font-semibold">${total.toFixed(2)}</p>
                {discountRate > 0 && (
                  <p className="text-xs sm:text-sm text-primary">
                    {(discountRate * 100).toFixed(0)}% bulk discount applied
                  </p>
                )}
              </div>
              <Button size="lg" onClick={handleProceedToCheckout} className="h-12 w-full sm:w-auto" style={{ background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)' }}>
                Continue to Checkout
              </Button>
            </div>
          </div>
        )}

        {/* Checkout Step */}
        {currentStep === "checkout" && (
          <div>
            <div className="mb-4 sm:mb-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep("customization")}
                className="mb-3 sm:mb-4 h-10 text-sm"
              >
                <ArrowLeft size={16} style={{ marginRight: '8px' }} />
                Back to Customization
              </Button>
              <h2 className="text-xl sm:text-2xl lg:text-3xl mb-2">Complete Your Bulk Order</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Enter your company details and finalize the order
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Company Details */}
                <div className="bg-card rounded-lg border p-4 sm:p-6">
                  <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Company Information</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="company-name" className="text-sm">Company Name *</Label>
                      <Input
                        id="company-name"
                        placeholder="Your Company Ltd."
                        value={companyDetails.companyName}
                        onChange={(e) =>
                          setCompanyDetails({ ...companyDetails, companyName: e.target.value })
                        }
                        className="mt-1 h-10"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="contact-person" className="text-sm">Contact Person *</Label>
                        <Input
                          id="contact-person"
                          placeholder="John Doe"
                          value={companyDetails.contactPerson}
                          onChange={(e) =>
                            setCompanyDetails({
                              ...companyDetails,
                              contactPerson: e.target.value,
                            })
                          }
                          className="mt-1 h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@company.com"
                          value={companyDetails.email}
                          onChange={(e) =>
                            setCompanyDetails({ ...companyDetails, email: e.target.value })
                          }
                          className="mt-1 h-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-sm">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={companyDetails.phone}
                          onChange={(e) =>
                            setCompanyDetails({ ...companyDetails, phone: e.target.value })
                          }
                          className="mt-1 h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="delivery-date" className="text-sm">Preferred Delivery Date</Label>
                        <Input
                          id="delivery-date"
                          type="date"
                          value={companyDetails.deliveryDate}
                          onChange={(e) =>
                            setCompanyDetails({
                              ...companyDetails,
                              deliveryDate: e.target.value,
                            })
                          }
                          className="mt-1 h-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-sm">Delivery Address *</Label>
                      <textarea
                        id="address"
                        placeholder="123 Business Street, Suite 100, New York, NY 10001"
                        rows={3}
                        value={companyDetails.address}
                        onChange={(e) =>
                          setCompanyDetails({ ...companyDetails, address: e.target.value })
                        }
                        className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-lg border p-4 sm:p-6">
                  <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Payment Method</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer text-sm">
                          Credit / Debit Card
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label htmlFor="transfer" className="flex-1 cursor-pointer text-sm">
                          Bank Transfer
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="invoice" id="invoice" />
                        <Label htmlFor="invoice" className="flex-1 cursor-pointer text-sm">
                          Invoice Request (30-day terms)
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "invoice" && (
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        <Check className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
                        We'll send you an invoice after order confirmation. Payment due within 30 days.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1 order-first lg:order-last">
                <div className="bg-card rounded-lg border p-4 sm:p-6 sticky top-16 sm:top-20">
                  <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Order Summary</h3>

                  <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <ImageWithFallback
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="line-clamp-2">{item.product.title}</p>
                          <p className="text-muted-foreground">
                            {item.quantity} × {item.product.price}
                          </p>
                          {item.customization?.packaging && (
                            <p className="text-xs text-muted-foreground">
                              {item.customization.packaging} packaging
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-3 sm:my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discountRate > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm text-primary">
                        <span>Bulk Discount ({(discountRate * 100).toFixed(0)}%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Total Items</span>
                      <span>{getTotalItems()} units</span>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex justify-between font-semibold text-sm sm:text-base">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full mt-4 sm:mt-6 h-12"
                    onClick={handlePlaceOrder}
                    style={{ background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)' }}
                  >
                    Place Bulk Order
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-3 sm:mt-4">
                    A gift consultant will contact you within 24 hours to confirm your order
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default BulkOrderPage;
