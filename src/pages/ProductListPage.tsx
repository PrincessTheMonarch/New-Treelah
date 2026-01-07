import { useState, useMemo, useEffect, FormEvent } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { FilterSidebar } from "../components/FilterSidebar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { allProducts } from "../data/products";
import { Search, SlidersHorizontal, X, ArrowLeft, Sparkles, ChevronDown, ShoppingCart, Heart, Headset, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useCart } from "../context/CartContext";

export function ProductListPage() {
  const { category } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, items: cartItems, getTotalItems } = useCart();
  const occasionParam = searchParams.get("occasion");
  const tagParam = searchParams.get("tag");
  const fromGiftFinder = searchParams.get("fromGiftFinder") === "true";
  const relationshipParam = searchParams.get("relationship");
  const ageGroupParam = searchParams.get("ageGroup");
  const searchTermParam = searchParams.get("search");

  const [searchQuery, setSearchQuery] = useState(searchTermParam || "");
  const [sortBy, setSortBy] = useState("popularity");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(
    occasionParam ? [occasionParam] : []
  );
  
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [giftFinderOpen, setGiftFinderOpen] = useState(false);
  
  // Track selected mega menu items for showing ticks
  const [selectedMegaMenuItems, setSelectedMegaMenuItems] = useState<string[]>([]);

  // Gift Finder form state
  const [giftFinderForm, setGiftFinderForm] = useState({
    recipient: "",
    relationship: "",
    occasion: "",
    ageGroup: "",
  });

  // Check if we should auto-open the Gift Finder dialog
  useEffect(() => {
    if (searchParams.get("openGiftFinder") === "true") {
      setGiftFinderOpen(true);
      searchParams.delete("openGiftFinder");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Quick filter tags
  const quickFilters = [
    { label: "For Him", category: "Fashion & Accessories", tag: "For Him" },
    { label: "For Her", category: "Fashion & Accessories", tag: "For Her" },
    { label: "Under $50", priceMax: 50 },
    { label: "Personalized Gifts", tag: "Customizable" },
  ];

  // Handle search from header
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set("search", searchQuery);
      navigate(`/products?${params.toString()}`);
    }
  };

  // Handle Gift Finder form submission
  const handleGiftFinderSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (giftFinderForm.recipient === "male") {
      params.append("tag", "For Him");
    } else if (giftFinderForm.recipient === "female") {
      params.append("tag", "For Her");
    }
    
    if (giftFinderForm.occasion) {
      const occasionFormatted = giftFinderForm.occasion.charAt(0).toUpperCase() + giftFinderForm.occasion.slice(1);
      params.append("occasion", occasionFormatted);
    }
    
    params.append("fromGiftFinder", "true");
    
    if (giftFinderForm.relationship) {
      params.append("relationship", giftFinderForm.relationship);
    }
    if (giftFinderForm.ageGroup) {
      params.append("ageGroup", giftFinderForm.ageGroup);
    }
    
    setGiftFinderOpen(false);
    navigate(`/products?${params.toString()}`);
  };

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleOccasionToggle = (occasion: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasion)
        ? prev.filter((o) => o !== occasion)
        : [...prev, occasion]
    );
  };

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const handleAvailabilityToggle = (availability: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(availability)
        ? prev.filter((a) => a !== availability)
        : [...prev, availability]
    );
  };

  const handleDeliveryTimeToggle = (time: string) => {
    setSelectedDeliveryTime((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleQuickFilter = (filter: any) => {
    if (filter.priceMax) {
      setPriceRange([0, filter.priceMax]);
    }
    if (filter.category && !selectedCategories.includes(filter.category)) {
      setSelectedCategories([...selectedCategories, filter.category]);
    }
    if (filter.tag) {
      setSearchQuery(filter.tag);
      const params = new URLSearchParams();
      params.set("search", filter.tag);
      navigate(`/products?${params.toString()}`);
    }
  };

  const clearAllFilters = () => {
    setPriceRange([0, 500]);
    setSelectedCategories([]);
    setSelectedOccasions(occasionParam ? [occasionParam] : []);
    setSelectedRatings([]);
    setSelectedAvailability([]);
    setSelectedDeliveryTime([]);
    setSearchQuery("");
    navigate("/products");
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by category from URL
    if (category) {
      const categoryMap: Record<string, string> = {
        "toys-games": "Toys & Games",
        "home-living": "Home & Living",
        "beauty-wellness": "Beauty & Wellness",
        "fashion-accessories": "Fashion & Accessories",
        "tech-gadgets": "Tech & Gadgets",
        "food-beverages": "Food & Beverages",
        "books-stationery": "Books & Stationery",
      };
      
      const categoryName = categoryMap[category];
      if (categoryName) {
        filtered = filtered.filter((p) => p.category === categoryName);
      }
    }

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tag?.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      );
    }

    // Filter by tag from URL
    if (tagParam) {
      filtered = filtered.filter(
        (p) => p.tag?.toLowerCase() === tagParam.toLowerCase()
      );
    }

    // Filter by price range
    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price.replace("$", ""));
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    // Filter by occasions
    if (selectedOccasions.length > 0) {
      filtered = filtered.filter((p) =>
        p.occasion.some((o) => selectedOccasions.includes(o))
      );
    }

    // Filter by rating
    if (selectedRatings.length > 0) {
      const minRating = Math.min(...selectedRatings);
      filtered = filtered.filter((p) => p.rating >= minRating);
    }

    // Filter by availability
    if (selectedAvailability.length > 0) {
      filtered = filtered.filter((p) =>
        selectedAvailability.includes(p.availability)
      );
    }

    // Filter by delivery time
    if (selectedDeliveryTime.length > 0) {
      filtered = filtered.filter((p) =>
        selectedDeliveryTime.includes(p.deliveryTime)
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) =>
            parseFloat(a.price.replace("$", "")) -
            parseFloat(b.price.replace("$", ""))
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) =>
            parseFloat(b.price.replace("$", "")) -
            parseFloat(a.price.replace("$", ""))
        );
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
  }, [
    category,
    searchQuery,
    priceRange,
    selectedCategories,
    selectedOccasions,
    selectedRatings,
    selectedAvailability,
    selectedDeliveryTime,
    sortBy,
    tagParam,
  ]);

  const pageTitle = category
    ? category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : tagParam || occasionParam || "All Products";

  const activeFiltersCount =
    selectedCategories.length +
    selectedOccasions.length +
    selectedRatings.length +
    selectedAvailability.length +
    selectedDeliveryTime.length +
    (priceRange[0] !== 0 || priceRange[1] !== 500 ? 1 : 0);

  // Mega Menu categories data
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
      links: ["Toys & Games", "Home & Livings", "Beauty & Wellness", "Fashion & Accessories", "Tech & Gadgets", "Food & Beverages"],
    },
  ];

  // Header styles
  const headerStyle = {
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    backgroundColor: 'white',
    borderBottom: '1px solid #E5E7EB',
    width: '100%',
    padding: '12px 16px',
  };

  const headerContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  // Left section: Logo + Brand Name + Tagline
  const headerLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const logoCircleStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const brandStackStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  };

  const brandNameStyle = {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1A1A1A',
    lineHeight: '1.2',
  };

  const brandTaglineStyle = {
    fontSize: '11px',
    color: '#6B7280',
    lineHeight: '1.2',
  };

  // Navigation links
  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  };

  const navLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#1A1A1A',
    cursor: 'pointer',
    padding: '8px 0',
  };

  // Shopping Assistant button
  const shoppingAssistantButtonStyle = {
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

  // Search bar
  const headerCenterStyle = {
    flex: 1,
    maxWidth: '400px',
    marginLeft: '20px',
    marginRight: '20px',
  };

  const searchBarContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative' as const,
  };

  const searchInputStyle = {
    width: '100%',
    padding: '8px 36px 8px 14px',
    borderRadius: '20px',
    border: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB',
    fontSize: '13px',
    outline: 'none',
  };

  const searchIconStyle = {
    position: 'absolute' as const,
    right: '12px',
    color: '#6B7280',
    cursor: 'pointer',
  };

  // Right section: Utility Icons
  const headerRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const iconButtonStyle = {
    cursor: 'pointer',
    color: '#1A1A1A',
  };

  // Mega Menu styles - compact, shifted right, items in row
  const megaMenuContainerStyle = {
    position: 'absolute' as const,
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

  const megaMenuColumnStyle = {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: '6px 12px',
    alignItems: 'flex-start',
  };

  const megaMenuHeaderStyle = {
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    color: '#717182',
    marginBottom: '4px',
  };

  const megaMenuLinkStyle = {
    fontSize: '13px',
    fontWeight: 400,
    color: '#1A1A1A',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
  };

  // No results styles
  const noResultsContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center' as const,
  };

  const noResultsTitleStyle = {
    fontSize: '24px',
    fontWeight: 600,
    color: '#1A1A1A',
    marginBottom: '8px',
  };

  const noResultsSubtitleStyle = {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '24px',
  };

  const clearFiltersButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '200px',
    height: '48px',
    borderRadius: '24px',
    backgroundColor: '#FF8C42',
    color: 'white',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'white' }}>
      {/* Global Header Navigation */}
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
            {/* Categories with Mega Menu - click to open */}
            <div 
              style={{ position: 'relative' }}
            >
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
              {/* Mega Menu Dropdown - compact, shifted right, items in row with underline on hover */}
              <div style={megaMenuContainerStyle}>
                {megaMenuColumns.map((column, colIndex) => (
                  <div key={colIndex} style={megaMenuColumnStyle}>
                    <span style={megaMenuHeaderStyle}>{column.header}</span>
                    {column.links.map((link, linkIndex) => (
                      <span
                        key={linkIndex}
                        style={{
                          ...megaMenuLinkStyle,
                          color: selectedMegaMenuItems.includes(link) ? '#FF8C42' : '#1A1A1A',
                        }}
                        onClick={() => {
                          setSelectedMegaMenuItems(prev => 
                            prev.includes(link)
                              ? prev.filter(item => item !== link)
                              : [...prev, link]
                          );
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
                          e.currentTarget.style.color = selectedMegaMenuItems.includes(link) ? '#FF8C42' : '#1A1A1A';
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

            {/* Shopping Assistant Button (Dialog Trigger) */}
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
                  {/* Recipient Gender */}
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

                  {/* Relationship */}
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

                  {/* Occasion */}
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

                  {/* Age Group */}
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
            {/* Search Bar */}
            <div style={headerCenterStyle}>
              <form onSubmit={handleSearch} style={searchBarContainerStyle}>
                <input
                  type="text"
                  placeholder="Search gifts..."
                  style={searchInputStyle}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  style={searchIconStyle}
                >
                  <Search size={16} />
                </button>
              </form>
            </div>

            {/* Utility Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link to="/cart" style={{ position: 'relative', ...iconButtonStyle }}>
                <ShoppingCart size={20} />
                {getTotalItems() > 0 && (
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
                    {getTotalItems()}
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

      {/* Hero Banner with Gradient */}
      <div style={{ 
        background: 'linear-gradient(to right, rgba(255, 140, 66, 0.08), rgba(255, 140, 66, 0.04), rgba(255, 140, 66, 0.08))',
        paddingTop: '24px',
        paddingBottom: '24px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column' }}>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                height: '40px',
                alignSelf: 'flex-start',
                padding: '8px 12px',
              }}
            >
              <ArrowLeft size={16} />
              <span style={{ fontSize: '14px' }}>Back</span>
            </Button>
            
            {fromGiftFinder && (
              <Button
                variant="outline"
                onClick={() => navigate("/?openGiftFinder=true")}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  borderRadius: '24px',
                  border: '2px solid #FF8C42',
                  color: '#FF8C42',
                  height: '40px',
                  padding: '8px 16px',
                  marginTop: '8px',
                }}
              >
                <Sparkles size={16} />
                Restart Shopping Assistant
              </Button>
            )}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            {/* Show "Showing Results for" when search is active */}
            {searchQuery ? (
              <>
                <h1 style={{ 
                  fontSize: '28px', 
                  fontWeight: 700, 
                  marginBottom: '4px',
                  color: '#1A1A1A',
                }}>
                  Showing Results for
                </h1>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 400, 
                  marginBottom: '8px',
                  color: '#1A1A1A',
                }}>
                  "{searchQuery}"
                </h2>
              </>
            ) : (
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 700, 
                marginBottom: '8px',
                color: '#1A1A1A',
              }}>
                {fromGiftFinder ? "Perfect Gifts For You" : `${pageTitle}`}
              </h1>
            )}
            <p style={{ 
              fontSize: '14px', 
              color: '#6B7280',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              {fromGiftFinder 
                ? `Based on your preferences, here are gifts ${relationshipParam ? `for your ${relationshipParam}` : ""} ${ageGroupParam ? `(${ageGroupParam})` : ""}`
                : "Explore our best-selling gifts, find something perfect for every occasion!"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div style={{ 
        borderBottom: '1px solid #E5E7EB', 
        backgroundColor: 'white',
        position: 'sticky',
        top: '65px',
        zIndex: 10,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6B7280', marginRight: '8px' }}>Quick Filters:</span>
            {quickFilters.map((filter, index) => (
              <button
                key={index}
                onClick={() => handleQuickFilter(filter)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F6F6F6',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {filter.label}
              </button>
            ))}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: 'auto',
                  padding: '8px 12px',
                  border: 'none',
                  background: 'transparent',
                  color: '#FF8C42',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <X size={14} style={{ marginRight: '4px' }} />
                Clear All ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>
      </div>

      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', width: '100%' }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Desktop Filter Sidebar */}
          <aside style={{ width: '260px', flexShrink: 0 }}>
            <div style={{ position: 'sticky', top: '132px' }}>
              <FilterSidebar
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryToggle}
                selectedOccasions={selectedOccasions}
                onOccasionChange={handleOccasionToggle}
                selectedRatings={selectedRatings}
                onRatingChange={handleRatingToggle}
                selectedAvailability={selectedAvailability}
                onAvailabilityChange={handleAvailabilityToggle}
                selectedDeliveryTime={selectedDeliveryTime}
                onDeliveryTimeChange={handleDeliveryTimeToggle}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Results Count and Sort */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <p style={{ fontSize: '14px', color: '#6B7280' }}>
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                </p>
                {/* Clear filter button when search is active */}
                {(searchQuery || tagParam) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedMegaMenuItems([]);
                      navigate("/products");
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      border: '1px solid #E5E7EB',
                      background: 'transparent',
                      color: '#6B7280',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={12} />
                    Clear Filter
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Mobile Filter Button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <button
                      style={{
                        display: 'none',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        borderRadius: '24px',
                        border: '1px solid #E5E7EB',
                        background: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      <SlidersHorizontal size={16} />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge style={{ backgroundColor: '#FF8C42', color: 'white', marginLeft: '8px' }}>
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" style={{ width: '320px', overflowY: 'auto' }}>
                    <div style={{ marginTop: '24px' }}>
                      <FilterSidebar
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryToggle}
                        selectedOccasions={selectedOccasions}
                        onOccasionChange={handleOccasionToggle}
                        selectedRatings={selectedRatings}
                        onRatingChange={handleRatingToggle}
                        selectedAvailability={selectedAvailability}
                        onAvailabilityChange={handleAvailabilityToggle}
                        selectedDeliveryTime={selectedDeliveryTime}
                        onDeliveryTimeChange={handleDeliveryTimeToggle}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger style={{ width: '180px', borderRadius: '24px', height: '40px' }}>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Grid or No Results */}
            {filteredProducts.length > 0 ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                gap: '24px' 
              }}>
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{ 
                      borderRadius: '16px', 
                      overflow: 'hidden', 
                      backgroundColor: 'white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                    }}>
                      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
                        <ImageWithFallback
                          src={product.image}
                          alt={product.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {product.badge && (
                          <Badge style={{ 
                            position: 'absolute', 
                            top: '12px', 
                            right: '12px', 
                            backgroundColor: '#FF8C42', 
                            color: 'white',
                            fontSize: '12px',
                          }}>
                            {product.badge}
                          </Badge>
                        )}
                      </div>
                      <div style={{ padding: '16px' }}>
                        {product.tag && (
                          <Badge variant="outline" style={{ marginBottom: '8px', fontSize: '12px' }}>
                            {product.tag}
                          </Badge>
                        )}
                        <h3 style={{ 
                          marginBottom: '8px', 
                          fontSize: '14px', 
                          lineHeight: '1.4',
                          color: '#1A1A1A',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                        }}>
                          {product.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                          <span style={{ color: '#FF8C42', fontSize: '16px', fontWeight: 600 }}>
                            {product.price}
                          </span>
                          {product.originalPrice && (
                            <span style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'line-through' }}>
                              {product.originalPrice}
                            </span>
                          )}
                        </div>
                        <button
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '24px',
                            backgroundColor: '#FF8C42',
                            color: 'white',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            const priceNum = parseFloat(product.price.replace('$', ''));
                            addToCart({
                              id: product.id,
                              title: product.title,
                              price: priceNum,
                              image: product.image,
                              category: product.category,
                            });
                            toast.success(`${product.title} added to cart!`);
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* No Results Found */
              <div style={noResultsContainerStyle}>
                <h3 style={noResultsTitleStyle}>No product found</h3>
                <p style={noResultsSubtitleStyle}>Try adjusting filters or search queries</p>
                <button 
                  onClick={clearAllFilters}
                  style={clearFiltersButtonStyle}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductListPage;
