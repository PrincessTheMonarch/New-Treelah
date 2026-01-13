import { useState, CSSProperties, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../context/CartContext";
import { allProducts } from "../data/products";
import { toast } from "sonner";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  Gift,
  Search,
  ShoppingCart,
  Heart,
  Headset,
  User,
  ArrowRight,
  Truck,
  ChevronDown,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

export function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  // Search state for header
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const subtotal = getTotalPrice();
  const discount = appliedPromo ? appliedPromo.discount : 0;
  const total = subtotal - discount;
  const deliveryFee = subtotal >= 50 ? 0 : 5.99;
  const finalTotal = total + deliveryFee;

  const handleApplyPromo = () => {
    if (promoCode === "GIFT10") {
      setAppliedPromo({ code: "GIFT10", discount: subtotal * 0.1 });
    } else if (promoCode === "WELCOME20") {
      setAppliedPromo({ code: "WELCOME20", discount: subtotal * 0.2 });
    }
  };

  // Get recommended products
  const recommendedProducts = allProducts.filter((p) => !items.find((i) => i.id === p.id)).slice(0, 4);

  // Mock products for Saved for Later (show first 5+ products not in cart)
  const savedForLaterProducts = allProducts.filter((p) => !items.find((i) => i.id === p.id)).slice(0, 6);
  
  // Mock products for Recently Viewed (show next 6 products)
  const recentlyViewedProducts = allProducts.slice(6, 12);

  // Header styles from BulkOrderPage
  const headerStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: 'white',
    borderBottom: '1px solid #E5E7EB',
    width: '100%',
    padding: '12px 16px',
  };

  // Mobile menu styles
  const mobileMenuStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: 'white',
    zIndex: 1000,
    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease-in-out',
    overflowY: 'auto',
  };

  const mobileMenuOverlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    opacity: mobileMenuOpen ? 1 : 0,
    visibility: mobileMenuOpen ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease-in-out',
  };

  const mobileMenuHeaderStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #E5E7EB',
  };

  const mobileMenuItemStyle: CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #F3F4F6',
    cursor: 'pointer',
  };

  const mobileMenuCloseButtonStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
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

  // Mega Menu styles from BulkOrderPage
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

  // Handle search submission - navigate to /products page
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set("search", searchQuery.trim());
      navigate(`/products?${params.toString()}`);
    }
  };

  // Handle mega menu link click
  const handleMegaMenuClick = (link: string) => {
    const params = new URLSearchParams();
    params.set("search", link);
    navigate(`/products?${params.toString()}`);
    setCategoriesOpen(false);
  };

  // Empty cart section styles
  const emptyCartSectionStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 16px',
    textAlign: 'center',
  };

  const emptyCartIconStyle: CSSProperties = {
    width: '96px',
    height: '96px',
    color: '#D1D5DB',
    marginBottom: '24px',
  };

  const emptyCartTitleStyle: CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    color: '#1A1A1A',
    marginBottom: '8px',
  };

  const emptyCartSubtitleStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'Regular',
    fontSize: '18px',
    lineHeight: '160%',
    letterSpacing: '0%',
    textAlign: 'center',
    color: '#717182',
    marginBottom: '4px',
  };

  const emptyCartSubtitle2Style: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'Regular',
    fontSize: '18px',
    lineHeight: '160%',
    letterSpacing: '0%',
    textAlign: 'center',
    color: '#717182',
    marginBottom: '32px',
  };

  const shopGiftsButtonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 28px',
    borderRadius: '24px',
    backgroundColor: '#FF8C42',
    color: 'white',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'none',
  };

  const sectionContainerStyle: CSSProperties = {
    padding: '32px 16px',
  };

  const sectionTitleStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1A1A1A',
    marginBottom: '16px',
  };

  const horizontalScrollContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '16px',
    scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch',
  };

  const productCardStyle: CSSProperties = {
    flexShrink: 0,
    width: '160px',
    scrollSnapAlign: 'start',
    cursor: 'pointer',
  };

  const productImageStyle: CSSProperties = {
    width: '160px',
    height: '160px',
    borderRadius: '12px',
    backgroundColor: '#F3F4F6',
    marginBottom: '12px',
    overflow: 'hidden',
  };

  const productNameStyle: CSSProperties = {
    fontSize: '13px',
    fontWeight: 500,
    color: '#1A1A1A',
    lineHeight: '1.4',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  };

  const productPriceStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#FF8C42',
  };

  // Cart with items section styles
  const cartMainStyle: CSSProperties = {
    flex: 1,
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '24px 16px',
  };

  const continueShoppingLinkStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#1A1A1A',
    cursor: 'pointer',
    marginBottom: '24px',
    textDecoration: 'none',
  };

  const cartPageHeaderStyle: CSSProperties = {
    fontSize: '24px',
    fontWeight: 600,
    color: '#1A1A1A',
    marginBottom: '24px',
  };

  const cartContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
  };

  const cartItemsSectionStyle: CSSProperties = {
    width: '600px',
    flexShrink: 0,
  };

  const productCardStyleNew: CSSProperties = {
    width: '600px',
    height: '161px',
    borderRadius: '16px',
    border: '0.2px solid #E5E7EB',
    padding: '24px',
    gap: '18px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    backgroundColor: 'white',
  };

  const productImagePlaceholderStyle: CSSProperties = {
    width: '113px',
    height: '113px',
    borderRadius: '12px',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const productInfoSectionStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const productNameStyleNew: CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#717182',
    lineHeight: '1.4',
  };

  const itemTypeLabelStyle: CSSProperties = {
    fontSize: '14px',
    color: '#717182',
  };

  const productPriceStyleNew: CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#717182',
    marginLeft: 'auto',
  };

  const quantitySelectorStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: 'auto',
  };

  const quantityButtonStyle: CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '18px',
    border: '1px solid #E5E7EB',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#1A1A1A',
  };

  const quantityDisplayStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 500,
    color: '#1A1A1A',
    minWidth: '24px',
    textAlign: 'center',
  };

  const removeButtonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#DC2626',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    marginLeft: 'auto',
  };

  const merchantInfoStyle: CSSProperties = {
    fontSize: '12px',
    color: '#717182',
    marginLeft: 'auto',
  };

  const orderSummaryContainerStyle: CSSProperties = {
    width: '600px',
    borderRadius: '24px',
    padding: '24px',
    backgroundColor: '#F6F6F6',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const orderSummaryHeaderStyle: CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: '#1A1A1A',
  };

  const summaryLineStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
  };

  const summaryLabelStyle: CSSProperties = {
    color: '#717182',
  };

  const summaryValueStyle: CSSProperties = {
    color: '#1A1A1A',
    fontWeight: 500,
  };

  const incentiveAlertStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#717182',
    marginTop: '8px',
  };

  const couponSectionStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const couponLabelStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#1A1A1A',
  };

  const couponInputContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const couponInputStyle: CSSProperties = {
    width: '361px',
    height: '48px',
    borderRadius: '24px',
    border: '0.2px solid #E5E7EB',
    backgroundColor: '#FBFBFB',
    padding: '0 16px',
    fontSize: '14px',
    outline: 'none',
  };

  const applyLinkStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#FF8C42',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  const totalSectionStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB',
  };

  const totalLabelStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1A1A1A',
  };

  const totalValueStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1A1A1A',
  };

  const deliveryEstimateStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#FDF6F3',
    marginTop: '8px',
  };

  const deliveryEstimateTextStyle: CSSProperties = {
    fontSize: '14px',
    color: '#1A1A1A',
  };

  const primaryButtonStyle: CSSProperties = {
    width: '100%',
    height: '52px',
    borderRadius: '24px',
    backgroundColor: '#FF8C42',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const secondaryButtonStyle: CSSProperties = {
    width: '100%',
    height: '52px',
    borderRadius: '24px',
    backgroundColor: 'transparent',
    color: '#FF8C42',
    border: '2px solid #FF8C42',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const crossSellSectionStyle: CSSProperties = {
    marginTop: '48px',
  };

  const crossSellHeaderStyle: CSSProperties = {
    fontSize: '24px',
    fontWeight: 600,
    color: '#1A1A1A',
    marginBottom: '24px',
  };

  if (items.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Responsive CSS */}
        <style>
          {`
            @media (max-width: 768px) {
              /* Show mobile menu button */
              .mobile-menu-button {
                display: block !important;
                position: absolute !important;
                top: 16px !important;
                right: 16px !important;
                z-index: 1001 !important;
              }
              /* Hide desktop navigation */
              .desktop-nav {
                display: none !important;
              }
              /* Adjust header layout for mobile */
              .header-container {
                flex-direction: row !important;
                gap: 12px !important;
                position: relative !important;
              }
              /* Adjust search bar for mobile */
              .search-bar-container {
                width: 100% !important;
                max-width: none !important;
              }
              /* Prevent horizontal scrolling */
              body, html {
                overflow-x: hidden !important;
              }
              /* Adjust cart layout for mobile */
              .cart-container {
                flex-direction: column !important;
              }
              .cart-items-section, .order-summary-container {
                width: 100% !important;
              }
              /* Adjust product card for mobile */
              .product-card-new {
                flex-direction: column !important;
                width: 100% !important;
                height: auto !important;
                padding: 16px !important;
                gap: 12px !important;
              }
              .product-image-placeholder {
                width: 100% !important;
                height: 200px !important;
              }
              /* Adjust quantity selector layout */
              .quantity-selector {
                flex-direction: row !important;
                gap: 8px !important;
                align-items: center !important;
              }
              /* Adjust coupon input width */
              .coupon-input {
                width: 100% !important;
              }
              /* Adjust product info layout */
              .product-info-section {
                gap: 12px !important;
                width: 100% !important;
              }
              /* Make cross-sell section scrollable */
              .cross-sell-section {
                overflow-x: auto !important;
                white-space: nowrap !important;
              }
              /* Fix cart main padding */
              .cart-main {
                padding: 16px !important;
              }
              /* Fix header right positioning */
              .header-right {
                margin-left: auto !important;
              }
              /* Adjust quantity buttons for mobile */
              .quantity-button {
                width: 32px !important;
                height: 32px !important;
                font-size: 14px !important;
              }
              /* Adjust font sizes for mobile */
              .product-name-new {
                font-size: 14px !important;
              }
              .product-price-new {
                font-size: 16px !important;
              }
              /* Fix order summary layout */
              .order-summary-container {
                margin-top: 24px !important;
                padding: 16px !important;
              }
              /* Adjust product info section for better mobile layout */
              .product-info-section {
                display: flex !important;
                flex-direction: column !important;
                gap: 12px !important;
              }
              /* Adjust quantity and remove button layout */
              .quantity-selector {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: space-between !important;
                width: 100% !important;
              }
              /* Ensure remove button is properly positioned */
              .remove-button {
                margin-left: 0 !important;
              }
              /* Adjust order summary spacing */
              .order-summary-container {
                gap: 16px !important;
              }
              /* Make buttons full width on mobile */
              .primary-button, .secondary-button {
                width: 100% !important;
              }
              /* Adjust delivery estimate layout */
              .delivery-estimate {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 8px !important;
              }
              /* Ensure cart icon is visible on mobile */
              .cart-icon-link {
                position: relative !important;
                z-index: 1002 !important;
              }
              /* Ensure cart badge is visible */
              .cart-badge {
                position: absolute !important;
                top: -8px !important;
                right: -8px !important;
                z-index: 1003 !important;
              }
              /* Fix mobile menu positioning */
              .mobile-menu-button {
                z-index: 1001 !important;
                position: relative !important;
              }
              /* Ensure header right is properly aligned */
              .header-right {
                display: flex !important;
                align-items: center !important;
                gap: 14px !important;
                margin-left: auto !important;
              }
              /* Fix search bar width on mobile */
              .search-bar-container {
                width: 100% !important;
                max-width: none !important;
              }
              /* Ensure product cards are properly spaced */
              .product-card-new {
                margin-bottom: 16px !important;
              }
              /* Fix quantity selector alignment */
              .quantity-selector {
                margin-top: auto !important;
              }
              /* Ensure cross-sell section is properly responsive */
              .cross-sell-section {
                overflow-x: auto !important;
                white-space: nowrap !important;
                scrollbar-width: thin !important;
                scrollbar-color: #E5E7EB transparent !important;
              }
              /* Fix cross-sell section padding */
              .cross-sell-section {
                padding-bottom: 20px !important;
              }
              /* Ensure product cards in cross-sell are properly sized */
              .cross-sell-section a {
                display: inline-block !important;
                width: 160px !important;
                margin-right: 12px !important;
              }
              /* Fix footer positioning */
              footer {
                margin-top: auto !important;
              }
              /* Ensure main content takes available space */
              main {
                flex: 1 !important;
              }
              /* Fix product image sizing */
              .product-image-placeholder img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
              }
            }
             
            /* Tablet responsiveness */
            @media (max-width: 1024px) and (min-width: 769px) {
              .cart-items-section, .order-summary-container {
                width: 100% !important;
              }
              .cart-container {
                flex-direction: column !important;
              }
              .product-card-new {
                width: 100% !important;
              }
              /* Adjust for tablet screens */
              .product-card-new {
                flex-direction: row !important;
                padding: 16px !important;
                gap: 16px !important;
              }
              .product-image-placeholder {
                width: 120px !important;
                height: 120px !important;
              }
              .product-info-section {
                gap: 10px !important;
              }
              .quantity-selector {
                gap: 10px !important;
              }
            }
            
            /* Small desktop screens */
            @media (max-width: 1200px) and (min-width: 1025px) {
              .cart-items-section, .order-summary-container {
                width: 100% !important;
              }
              .cart-container {
                flex-direction: column !important;
              }
              .product-card-new {
                width: 100% !important;
              }
            }
            
            /* Large desktop screens */
            @media (min-width: 1201px) {
              /* Ensure proper spacing on large screens */
              .cart-main {
                max-width: 1400px !important;
                margin: 0 auto !important;
              }
              .cart-container {
                gap: 32px !important;
              }
              .product-card-new {
                width: 100% !important;
                max-width: 800px !important;
              }
            }
          `}
        </style>
        {/* Header from BulkOrderPage */}
        <header style={headerStyle}>
          <div style={headerContainerStyle} className="header-container">
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
            <div style={navLinksStyle} className="desktop-nav">
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
                          onClick={() => handleMegaMenuClick(link)}
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
              <button style={shoppingAssistantButtonStyle}>
                <Sparkles size={14} />
                Shopping Assistant
              </button>
            </div>

            {/* Right: Search Bar + Utility Icons */}
            <div style={headerRightStyle} className="header-right">
              <div style={headerCenterStyle}>
                <form onSubmit={handleSearchSubmit}>
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
                </form>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Link to="/cart" style={{ position: 'relative', ...iconButtonStyle }}>
                  <ShoppingCart size={20} />
                </Link>
                <div style={iconButtonStyle}>
                  <Heart size={20} />
                </div>
                <div style={iconButtonStyle}>
                  <Headset size={20} />
                </div>
                <Link to="/profile" style={iconButtonStyle}>
                  <User size={20} />
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Empty Cart Content */}
        <main style={{ flex: 1 }}>
          <div style={emptyCartSectionStyle}>
            {/* Central Icon - Grey outline shopping cart */}
            <ShoppingCart style={emptyCartIconStyle} />
            
            {/* Primary Message */}
            <h1 style={emptyCartTitleStyle}>Your Cart is Empty</h1>
            
            {/* Secondary Message */}
            <p style={emptyCartSubtitleStyle}>Looks like you haven't added anything to your cart</p>
            <p style={emptyCartSubtitle2Style}>Let's find the perfect gift</p>
            
            {/* Action Button - Shop Gifts */}
            <Link to="/products" style={shopGiftsButtonStyle}>
              Shop Gifts
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Products You Saved for Later */}
          <div style={sectionContainerStyle}>
            <h2 style={sectionTitleStyle}>Products You Saved for Later</h2>
            <div style={horizontalScrollContainerStyle}>
              {savedForLaterProducts.map((product) => (
                <div key={product.id} style={productCardStyle}>
                  <Link to={`/product/${product.id}`}>
                    <div style={productImageStyle}>
                      <ImageWithFallback
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p style={productNameStyle}>{product.title}</p>
                    <p style={productPriceStyle}>{product.price}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Products You Viewed Recently */}
          <div style={sectionContainerStyle}>
            <h2 style={sectionTitleStyle}>Products You Viewed Recently</h2>
            <div style={horizontalScrollContainerStyle}>
              {recentlyViewedProducts.map((product) => (
                <div key={product.id} style={productCardStyle}>
                  <Link to={`/product/${product.id}`}>
                    <div style={productImageStyle}>
                      <ImageWithFallback
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p style={productNameStyle}>{product.title}</p>
                    <p style={productPriceStyle}>{product.price}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    );
  }

  // Calculate delivery fee (simplified logic for demo)
  const deliveryFeeAmount = 1500;
  const freeDeliveryThreshold = 5000;
  const amountForFreeDelivery = freeDeliveryThreshold - subtotal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header from BulkOrderPage */}
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
                        onClick={() => handleMegaMenuClick(link)}
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
            <button style={shoppingAssistantButtonStyle}>
              <Sparkles size={14} />
              Shopping Assistant
            </button>
          </div>

          {/* Right: Search Bar + Utility Icons */}
          <div style={headerRightStyle}>
            {/* Mobile menu button - only visible on small screens */}
            <button
              className="mobile-menu-button"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                marginRight: '8px'
              }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div style={headerCenterStyle}>
              <form onSubmit={handleSearchSubmit}>
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
              </form>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link to="/cart" style={{ position: 'relative', ...iconButtonStyle }} className="cart-icon-link">
                <ShoppingCart size={20} />
                {items.length > 0 && (
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
                  }} className="cart-badge">
                    {items.length}
                  </span>
                )}
              </Link>
              <div style={iconButtonStyle}>
                <Heart size={20} />
              </div>
              <div style={iconButtonStyle}>
                <Headset size={20} />
              </div>
              <Link to="/profile" style={iconButtonStyle}>
                  <User size={20} />
                </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={mobileMenuOverlayStyle}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div style={mobileMenuStyle}>
        <div style={mobileMenuHeaderStyle}>
          <span style={{ fontSize: '18px', fontWeight: 600 }}>Menu</span>
          <button
            style={mobileMenuCloseButtonStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div style={mobileMenuItemStyle} onClick={() => setMobileMenuOpen(false)}>
          <Link to="/" style={{ textDecoration: 'none', color: '#1A1A1A' }}>Home</Link>
        </div>

        <div style={mobileMenuItemStyle} onClick={() => setMobileMenuOpen(false)}>
          <Link to="/products" style={{ textDecoration: 'none', color: '#1A1A1A' }}>Products</Link>
        </div>

        <div style={mobileMenuItemStyle} onClick={() => setMobileMenuOpen(false)}>
          <Link to="/bulk-orders" style={{ textDecoration: 'none', color: '#1A1A1A' }}>Bulk Orders</Link>
        </div>

        <div style={mobileMenuItemStyle} onClick={() => setMobileMenuOpen(false)}>
          <Link to="/cart" style={{ textDecoration: 'none', color: '#1A1A1A' }}>Cart</Link>
        </div>

        <div style={mobileMenuItemStyle} onClick={() => setMobileMenuOpen(false)}>
          <Link to="/profile" style={{ textDecoration: 'none', color: '#1A1A1A' }}>Profile</Link>
        </div>
      </div>

      {/* Main Cart Content */}
      <main style={cartMainStyle} className="cart-main">
        {/* Breadcrumb/Navigation */}
        <Link to="/products" style={continueShoppingLinkStyle}>
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>

        {/* Page Header */}
        <h1 style={cartPageHeaderStyle}>Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h1>

        <div style={cartContainerStyle} className="cart-container">
          {/* Left Column: Cart Items */}
          <div style={cartItemsSectionStyle} className="cart-items-section">
            {items.map((item) => (
              <div key={item.id} style={productCardStyleNew} className="product-card-new">
                {/* Product Image */}
                <div style={productImagePlaceholderStyle} className="product-image-placeholder">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    style={{ width: '113px', height: '113px', borderRadius: '12px' }}
                  />
                </div>

                {/* Product Info */}
                <div style={productInfoSectionStyle} className="product-info-section">
                  {/* Product name and item type */}
                  <div>
                    <p style={productNameStyleNew}>{item.title}</p>
                    <p style={itemTypeLabelStyle}>{item.category}</p>
                  </div>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={productPriceStyleNew}>₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                  {/* Quantity Selector and Remove Action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Quantity Selector */}
                    <div style={quantitySelectorStyle} className="quantity-selector">
                      <button
                        style={quantityButtonStyle}
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        —
                      </button>
                      <span style={quantityDisplayStyle}>{item.quantity}</span>
                      <button
                        style={quantityButtonStyle}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                      {/* Remove Action beside + */}
                      <button 
                        style={{ ...removeButtonStyle, marginLeft: '8px' }} 
                        onClick={() => {
                          removeFromCart(item.id);
                          toast.success(`${item.title} removed from cart`);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {/* Product Name at far right */}
                    <p style={{ fontSize: '12px', color: '#717182', marginLeft: 'auto' }}>{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <div style={orderSummaryContainerStyle} className="order-summary-container">
            {/* Summary Header */}
            <h2 style={orderSummaryHeaderStyle}>Order Summary</h2>

            {/* Line Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={summaryLineStyle}>
                <span style={summaryLabelStyle}>Subtotal</span>
                <span style={summaryValueStyle}>₦{subtotal.toLocaleString()}</span>
              </div>

              <div style={summaryLineStyle}>
                <span style={summaryLabelStyle}>Delivery Fee</span>
                <span style={summaryValueStyle}>₦{deliveryFeeAmount.toLocaleString()}</span>
              </div>

              {/* Incentive Alert */}
              {subtotal < freeDeliveryThreshold && (
                <div style={incentiveAlertStyle}>
                  <span>ℹ️</span>
                  <span>Add ₦{amountForFreeDelivery.toLocaleString()} for free delivery</span>
                </div>
              )}
            </div>

            {/* Horizontal Divider */}
            <div style={{ borderTop: '1px solid #E5E7EB' }}></div>

            {/* Coupon Section */}
            <div style={couponSectionStyle}>
              <label style={couponLabelStyle}>Coupon / Voucher</label>
              <div style={couponInputContainerStyle}>
                <input
                  type="text"
                  placeholder="Enter coupon or voucher code"
                  style={couponInputStyle}
                  className="coupon-input"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                />
                <span style={applyLinkStyle} onClick={handleApplyPromo}>
                  Apply
                </span>
              </div>
            </div>

            {/* Totals */}
            <div style={totalSectionStyle}>
              <span style={totalLabelStyle}>Total</span>
              <span style={totalValueStyle}>₦{(subtotal + deliveryFeeAmount).toLocaleString()}</span>
            </div>

            {/* Delivery Estimate */}
            <div style={deliveryEstimateStyle}>
              <Truck size={20} style={{ color: '#FF8C42' }} />
              <span style={deliveryEstimateTextStyle}>Estimated delivery 5-10 business days</span>
            </div>

            {/* Primary Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={primaryButtonStyle} onClick={() => navigate("/checkout")}>
                Proceed to checkout
              </button>
              <button style={secondaryButtonStyle} onClick={() => navigate("/products")}>
                <ArrowLeft size={16} />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        {/* Cross-Sell Section */}
        <div style={crossSellSectionStyle} className="cross-sell-section">
          <h2 style={crossSellHeaderStyle}>Products you may also Love</h2>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
            {recommendedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                style={{ flexShrink: 0, width: '200px', textDecoration: 'none' }}
              >
                <div style={{ width: '200px', height: '200px', borderRadius: '12px', backgroundColor: '#F3F4F6', marginBottom: '12px', overflow: 'hidden' }}>
                  <ImageWithFallback
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A', marginBottom: '4px', lineHeight: '1.4' }}>
                  {product.title}
                </p>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#FF8C42' }}>
                  {product.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}


