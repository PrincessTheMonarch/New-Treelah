import {
  Gift,
  Heart,
  ShoppingCart,
  Search,
  Sparkles,
  UserCircle,
  Menu,
  LogOut,
  User,
  Bell,
  ChevronDown,
  Headphones,
  X,
  ChevronRight,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

type HeaderVariant = "default" | "transparent";

interface HeaderProps {
  variant?: HeaderVariant;
}

export function Header({ variant = "default" }: HeaderProps) {
  const { getTotalItems } = useCart();
  const { user, signOut, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [giftFinderOpen, setGiftFinderOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [desktopSearchQuery, setDesktopSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    recipient: "",
    relationship: "",
    occasion: "",
    ageGroup: "",
  });
  const navigate = useNavigate();
  const categoriesRef = useRef<HTMLDivElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check for openGiftFinder query parameter and open modal
  useEffect(() => {
    const openGiftFinder = searchParams.get("openGiftFinder");
    if (openGiftFinder === "true") {
      setGiftFinderOpen(true);
    }
  }, [searchParams]);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    };

    if (categoriesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoriesOpen]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleGiftFinderSubmit = (e: any) => {
    e.preventDefault();

    // Build URL parameters based on form data
    const params = new URLSearchParams();

    // Add tag based on recipient
    if (formData.recipient === "him") {
      params.append("tag", "For Him");
    } else if (formData.recipient === "her") {
      params.append("tag", "For Her");
    }

    // Add occasion
    if (formData.occasion) {
      // Capitalize first letter and handle special cases
      const occasionFormatted = formData.occasion
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
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

  // Handle mobile search
  const handleMobileSearch = (e: any) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(mobileSearchQuery)}`);
      setMobileSearchQuery("");
    }
  };

  // Handle desktop search
  const handleDesktopSearch = (e: any) => {
    e.preventDefault();
    if (desktopSearchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(desktopSearchQuery)}`);
      setDesktopSearchQuery("");
    }
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
      ],
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
      ],
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
      ],
    },
    {
      header: "By Type",
      items: [
        { name: "Toys & Games", link: "/products/toys-games" },
        { name: "Home & Living", link: "/products/home-living" },
        { name: "Beauty & Wellness", link: "/products/beauty-wellness" },
        {
          name: "Fashion & Accessories",
          link: "/products/fashion-accessories",
        },
        { name: "Tech & Gadgets", link: "/products/tech-gadgets" },
        { name: "Food & Beverages", link: "/products/food-beverages" },
      ],
    },
  ];

  useEffect(() => {
    if (variant !== "transparent") {
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [variant]);

  const headerClassName =
    variant === "transparent"
      ? `fixed top-0 z-50 w-full border-b transition-colors duration-300 ${
          isScrolled
            ? "border-border/30 bg-background backdrop-blur"
            : "border-transparent bg-transparent"
        }`
      : "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60";
  const headerIconClassName =
    variant === "transparent"
      ? isScrolled
        ? "text-foreground"
        : "text-white"
      : "text-foreground";
  const searchIconClassName =
    variant === "transparent" ? "text-foreground/70" : "text-muted-foreground";
  const searchInputClassName =
    variant === "transparent"
      ? "pl-10 rounded-full border-white/70 bg-white/90 text-foreground placeholder:text-muted-foreground shadow-sm"
      : "pl-10 rounded-full border-muted bg-accent/50";
  const souvenirsLinkClassName =
    variant === "transparent"
      ? `${isScrolled ? "text-black" : "text-white"} transition-colors`
      : "text-black";

  return (
    <header className={headerClassName}>
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* <div className="flex h-16 items-center justify-between"> */}
        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="lg:hidden">
              <Menu className={`h-6 w-6 ${headerIconClassName}`} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full p-0 flex flex-col h-full">
            <SheetHeader className="p-6 pb-4">
              <Link to="/">
                <img src="/logo.png" alt="Treelah Logo" />
              </Link>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search for the perfect gift..."
                    className="pl-10 rounded-full border-muted bg-accent/50"
                  />
                </div>
              </div>

              {/* Shopping Assistant */}
              <Link
                to="/?openGiftFinder=true"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full gap-2 rounded-full bg-primary hover:bg-primary/90 mb-4 h-10 px-4">
                  <Sparkles className="h-5 w-5" />
                  Shopping Assistant
                </Button>
              </Link>

              <Separator className="my-6" />

              {/* Categories */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-primary">
                    By Occasion
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="/products?occasion=Birthdays"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Birthdays
                      </a>
                    </li>
                    <li>
                      <a
                        href="/products?occasion=Weddings"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Weddings
                      </a>
                    </li>
                    <li>
                      <a
                        href="/products?occasion=Anniversaries"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Anniversaries
                      </a>
                    </li>
                    <li>
                      <a
                        href="/products?occasion=Baby%20Showers"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Baby Showers
                      </a>
                    </li>
                    <li>
                      <a
                        href="/products?occasion=Graduations"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Graduations
                      </a>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3 text-primary">
                    By Recipient
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        to="/products?tag=For%20Him"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        For Him
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products?tag=For%20Her"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        For Her
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products?tag=For%20Kids"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        For Kids
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        For Teens
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        For Colleagues
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        For Couples
                      </Link>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3 text-primary">By Age</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        to="/products"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Children
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Teens
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Adults
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Seniors
                      </Link>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3 text-primary">By Type</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        to="/products/toys-games"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Toys & Games
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products/home-living"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Home & Living
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products/beauty-wellness"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Beauty & Wellness
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products/fashion-accessories"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Fashion & Accessories
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products/tech-gadgets"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Tech & Gadgets
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products/food-beverages"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Food & Beverages
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        View All
                      </Link>
                    </li>
                  </ul>
                </div>

                <Separator />

                {/* Quick Links */}
                <div>
                  <h3 className="font-semibold mb-3 text-primary">
                    Quick Links
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        to="/bulk-orders"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Souvenirs & Bulk Orders
                      </Link>
                    </li>
                    {/* <li>
                      <a 
                        href="#" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Support
                      </a>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Link to="/">
          <img src="/images/logo.png" alt="Treelah Logo" />
        </Link>

        {/* Main Navigation - Hidden on mobile */}
        <NavigationMenu>
          <NavigationMenuList className="hidden lg:flex gap-4">
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[800px] p-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <h4 className="mb-3 text-sm text-muted-foreground">
                        By Occasion
                      </h4>
                      <ul className="space-y-2">
                        <li>
                          <a
                            href="/products?occasion=Birthdays"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Birthdays
                          </a>
                        </li>
                        <li>
                          <a
                            href="/products?occasion=Weddings"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Weddings
                          </a>
                        </li>
                        <li>
                          <a
                            href="/products?occasion=Anniversaries"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Anniversaries
                          </a>
                        </li>
                        <li>
                          <a
                            href="/products?occasion=Baby%20Showers"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Baby Showers
                          </a>
                        </li>
                        <li>
                          <a
                            href="/products?occasion=Graduations"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Graduations
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-3 text-sm text-muted-foreground">
                        By Recipient
                      </h4>
                      <ul className="space-y-2">
                        <li>
                          <Link
                            to="/products?tag=For%20Him"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            For Him
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products?tag=For%20Her"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            For Her
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products?tag=For%20Kids"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            For Kids
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            For Teens
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            For Colleagues
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            For Couples
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-3 text-sm text-muted-foreground">
                        By Age
                      </h4>
                      <ul className="space-y-2">
                        <li>
                          <Link
                            to="/products"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Children
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Teens
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Adults
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Seniors
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-3 text-sm text-muted-foreground">
                        By Type
                      </h4>
                      <ul className="space-y-2">
                        <li>
                          <Link
                            to="/products/toys-games"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Toys & Games
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/home-living"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Home & Living
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/beauty-wellness"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Beauty & Wellness
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/fashion-accessories"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Fashion & Accessories
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/tech-gadgets"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Tech & Gadgets
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/food-beverages"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            Food & Beverages
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products"
                            className="block py-1.5 hover:text-primary transition-colors"
                          >
                            View All
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/?openGiftFinder=true">
                <Button className="gap-2 rounded-full bg-primary hover:bg-primary/90 h-9 px-4">
                  <Sparkles className="h-4 w-4" />
                  Shopping Assistant
                </Button>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/bulk-orders" className={souvenirsLinkClassName}>
                  Souvenirs & Bulk Orders
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* <NavigationMenuItem>
              <NavigationMenuLink href="#" className="px-3 py-2 hover:text-primary transition-colors">
                Support
              </NavigationMenuLink>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex w-64">
          <div className="relative w-full">
            <Search
              className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${searchIconClassName}`}
            />
            <Input
              placeholder="Search for the perfect gift"
              className={searchInputClassName}
            />
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-2 shrink-0">
          <Heart className={`h-5 w-5 ${headerIconClassName}`} />
          <Link to="/cart">
            <ShoppingCart className={`h-5 w-5 ${headerIconClassName}`} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>
          <Link to={user ? "/profile" : "/auth/login"}>
            <UserCircle className={`h-5 w-5 ${headerIconClassName}`} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
