import { useState, useEffect, CSSProperties, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { usePaystackPayment } from "../hooks/usePaystackPayment";
import {
  ArrowLeft,
  Truck,
  Calendar as CalendarIcon,
  Check,
  Search,
  ShoppingCart,
  Heart,
  Headset,
  User,
  ChevronDown,
  Sparkles,
  Pencil,
  Upload,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";

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
  display: 'none',
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

// Stepper styles
const stepperContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0',
  padding: '24px 0',
};

const stepContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const stepCircleStyle: CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 600,
};

const stepLabelStyle: CSSProperties = {
  marginLeft: '8px',
  fontSize: '14px',
  fontWeight: 500,
};

const stepConnectorStyle: CSSProperties = {
  width: '60px',
  height: '2px',
  backgroundColor: '#1A1A1A',
  margin: '0 8px',
};

// Form container styles
const formContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '680px',
  backgroundColor: '#F6F6F6',
  borderRadius: '24px',
  padding: '24px',
};

// Section heading style
const sectionHeadingStyle: CSSProperties = {
  fontFamily: 'Poppins',
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: '160%',
  color: '#1A1A1A',
  marginBottom: '24px',
};

// Label styles for form fields
const formLabelStyle: CSSProperties = {
  fontFamily: 'Poppins',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '160%',
  color: '#1A1A1A',
  marginBottom: '8px',
  display: 'block',
};

// Input styles
const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
  backgroundColor: '#FBFBFB',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'Poppins',
  fontWeight: 400,
};

// Textarea for address
const textareaStyle: CSSProperties = {
  width: '100%',
  height: '72px',
  padding: '12px',
  borderRadius: '8px',
  border: '0.2px solid #E5E7EB',
  backgroundColor: '#FBFBFB',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'Poppins',
  fontWeight: 400,
  resize: 'none',
};

// Two column layout for city/state
const twoColumnLayoutStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
};

// Toggle section container
const toggleSectionStyle: CSSProperties = {
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  padding: '16px',
  backgroundColor: '#F6F6F6',
};

// Toggle header
const toggleHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

// Toggle label
const toggleLabelStyle: CSSProperties = {
  fontFamily: 'Poppins',
  fontWeight: 400,
  fontSize: '14px',
  color: '#717182',
  cursor: 'pointer',
};

// Toggle subtext
const toggleSubtextStyle: CSSProperties = {
  fontFamily: 'Poppins',
  fontWeight: 400,
  fontSize: '12px',
  color: '#6B7280',
  marginTop: '2px',
};

// Conditional fields container
const conditionalFieldsStyle: CSSProperties = {
  marginTop: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const continueButtonStyle: CSSProperties = {
  width: '100%',
  padding: '14px 24px',
  borderRadius: '8px',
  backgroundColor: '#FF8C42',
  color: 'white',
  border: 'none',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '24px',
  fontFamily: 'Poppins',
};

// Order summary styles
const orderSummaryStyle: CSSProperties = {
  backgroundColor: 'white',
  padding: '24px',
  position: 'sticky',
  top: '100px',
};

const productCardStyle: CSSProperties = {
  display: 'flex',
  gap: '12px',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
  backgroundColor: '#F6F6F6',
};

const productImageStyle: CSSProperties = {
  width: '60px',
  height: '60px',
  borderRadius: '8px',
  backgroundColor: '#F3F4F6',
  overflow: 'hidden',
};

const priceRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
  fontSize: '14px',
};

// Place Order Button Component
interface PlaceOrderButtonProps {
  amount: number;
  onSuccess: (payment: any) => void;
}

function PlaceOrderButton({ amount, onSuccess }: PlaceOrderButtonProps) {
  const { user } = useAuth();
  const { items, syncCart } = useCart();
  const { isProcessing, error, initiatePayment, clearError } = usePaystackPayment({
    email: user?.email || '',
    amount,
    currency: 'NGN',
    metadata: {
      order_type: 'checkout',
      page_url: window.location.href,
    },
    onSuccess,
    onError: (err) => console.error('Payment error:', err),
  });

  const handlePaymentClick = async () => {
    clearError();
    
    // Sync cart to Supabase before payment
    if (items.length > 0) {
      try {
        await syncCart();
        console.log('[Checkout] Cart synced to Supabase');
      } catch (error) {
        console.error('[Checkout] Failed to sync cart:', error);
        // Continue anyway - the local cart will be used
      }
    }
    
    initiatePayment();
  };

  const isDisabled = isProcessing || !user;

  return (
    <div style={{ marginTop: '24px' }}>
      <button
        onClick={handlePaymentClick}
        disabled={isDisabled}
        style={{
          width: '100%',
          padding: '14px 24px',
          borderRadius: '8px',
          backgroundColor: isDisabled ? '#E5E7EB' : '#FF8C42',
          color: 'white',
          border: 'none',
          fontSize: '16px',
          fontWeight: 600,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          fontFamily: 'Poppins',
        }}
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
}

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

export function CheckoutPage() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 
  // Search state for header
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search submit - navigate to products page
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Gift Finder form state
  const [giftFinderForm, setGiftFinderForm] = useState({
    recipient: "",
    relationship: "",
    occasion: "",
    ageGroup: "",
  });
  const [giftFinderOpen, setGiftFinderOpen] = useState(false);

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

  // Delivery Info State
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  const [sendToRecipient, setSendToRecipient] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryDate: "",
  });

  // Packaging & Personalization State
  const [packagingOption, setPackagingOption] = useState("");
  const [isPackagingDropdownOpen, setIsPackagingDropdownOpen] = useState(false);
  const [addCustomMessage, setAddCustomMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [personalizeGift, setPersonalizeGift] = useState(false);
  const [customText, setCustomText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  // Calculate totals
  const subtotal = getTotalPrice();
  const deliveryFee = 1500; // Fixed delivery fee of ₦1,500
  const total = subtotal + deliveryFee;

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate delivery info
      if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.address || !deliveryInfo.city) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (sendToRecipient && !recipientInfo.name) {
        toast.error("Please fill in recipient information");
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePaymentSuccess = (payment: any) => {
    clearCart();
    
    if (payment.order?.order_number) {
      toast.success(`Order ${payment.order.order_number} placed successfully!`);
      navigate(`/profile?order=${payment.order.order_number}`);
    } else {
      toast.success('Order placed successfully!');
      navigate('/profile');
    }
  };

  // Redirect to cart if no items
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  // Format price to Naira
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString('en-NG')}`;
  };

  // Don't render checkout if cart is empty
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Responsive CSS for Checkout Page */}
      <style>
        {`
          @media (max-width: 768px) {
            /* Mobile responsiveness */
            .mobile-menu-button {
              display: block !important;
              position: absolute !important;
              top: 16px !important;
              right: 16px !important;
              z-index: 1001 !important;
            }
            .desktop-nav {
              display: none !important;
            }
            .header-container {
              flex-direction: row !important;
              gap: 12px !important;
              position: relative !important;
            }
            .header-right {
              margin-left: auto !important;
            }
            .search-bar-container {
              width: 100% !important;
              max-width: none !important;
            }
            /* Prevent horizontal scrolling */
            body, html {
              overflow-x: hidden !important;
            }
            .flex-col {
              overflow-x: hidden !important;
            }
            main {
              overflow-x: hidden !important;
            }
            /* Grid layout changes */
            .checkout-grid {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
            }
            /* Form container full width */
            .form-container {
              width: 100% !important;
              max-width: none !important;
            }
            /* Two column layout becomes single column */
            .two-column-layout {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }
            /* Order summary full width */
            .order-summary {
              position: static !important;
              width: 100% !important;
            }
            /* Stepper layout adjustments */
            .stepper-container {
              flex-direction: row !important;
              gap: 8px !important;
              align-items: center !important;
              justify-content: center !important;
              flex-wrap: nowrap !important;
              overflow-x: auto !important;
              padding: 16px 8px !important;
            }
            .step-container {
              flex: 1 !important;
              min-width: 0 !important;
            }
            .step-connector {
              width: 20px !important;
              flex-shrink: 0 !important;
            }
            .step-circle {
              width: 24px !important;
              height: 24px !important;
              font-size: 12px !important;
            }
            .step-label {
              font-size: 12px !important;
              margin-left: 4px !important;
            }
            /* Product card layout */
            .product-card {
              flex-direction: column !important;
              gap: 12px !important;
            }
            .product-image {
              width: 100% !important;
              height: 120px !important;
            }
            /* Input field adjustments */
            .form-input {
              padding: 12px 14px !important;
              font-size: 14px !important;
            }
            /* Button size adjustments */
            .continue-button {
              padding: 14px 20px !important;
              font-size: 15px !important;
            }
          }
          
          /* Tablet responsiveness */
          @media (max-width: 1024px) and (min-width: 769px) {
            .checkout-grid {
              grid-template-columns: 1fr 350px !important;
            }
            .form-container {
              max-width: 600px !important;
            }
          }
          
          /* Large screen adjustments */
          @media (min-width: 1400px) {
            .checkout-grid {
              max-width: 1400px !important;
              margin: 0 auto !important;
            }
          }
        `}
      </style>
      {/* Header from BulkOrderPage */}
      <header style={headerStyle}>
        <div style={headerContainerStyle}>
          {/* Left: Logo + Brand Name + Tagline */}
          <Link to="/">
            <img src="/images/logo.png" alt="Treelah Logo" />
          </Link>

          {/* Center: Navigation Links */}
          <div style={navLinksStyle} className="desktop-nav">
            {/* Categories with Mega Menu */}
            <div style={{ position: "relative" }}>
              <div
                style={navLinkStyle}
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                Categories
                <ChevronDown
                  size={14}
                  style={{
                    transform: categoriesOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </div>
              {/* Mega Menu Dropdown */}
              <div
                style={{
                  ...megaMenuContainerStyle,
                  display: categoriesOpen ? "flex" : "none",
                }}
              >
                {megaMenuColumns.map((column, colIndex) => (
                  <div key={colIndex} style={megaMenuColumnStyle}>
                    <span style={megaMenuHeaderStyle}>{column.header}</span>
                    {column.links.map((link, linkIndex) => (
                      <span
                        key={linkIndex}
                        style={megaMenuLinkStyle}
                        onClick={() => {
                          const params = new URLSearchParams();
                          params.set("search", link);
                          navigate(`/products?${params.toString()}`);
                          setCategoriesOpen(false);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.textDecoration = "underline";
                          e.currentTarget.style.color = "#FF8C42";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.textDecoration = "none";
                          e.currentTarget.style.color = "#1A1A1A";
                        }}
                      >
                        {link}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/bulk-orders"
              style={{ ...navLinkStyle, textDecoration: "none" }}
            >
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
              <DialogContent
                style={{
                  maxWidth: "500px",
                  maxHeight: "80vh",
                  overflow: "auto",
                }}
              >
                <DialogHeader>
                  <DialogTitle style={{ fontSize: "18px" }}>
                    Find Your Perfect Gift
                  </DialogTitle>
                  <DialogDescription style={{ fontSize: "14px" }}>
                    Answer a few quick questions and we'll suggest the best
                    gifts!
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleGiftFinderSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    marginTop: "8px",
                  }}
                >
                  <div>
                    <Label style={{ fontSize: "14px", fontWeight: 500 }}>
                      Who's the gift for?
                    </Label>
                    <RadioGroup
                      value={giftFinderForm.recipient}
                      onValueChange={(value: string) =>
                        setGiftFinderForm({
                          ...giftFinderForm,
                          recipient: value,
                        })
                      }
                      style={{
                        marginTop: "8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <RadioGroupItem value="male" id="gf-male" />
                        <Label
                          htmlFor="gf-male"
                          style={{
                            cursor: "pointer",
                            flex: 1,
                            fontSize: "14px",
                          }}
                        >
                          For Him
                        </Label>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <RadioGroupItem value="female" id="gf-female" />
                        <Label
                          htmlFor="gf-female"
                          style={{
                            cursor: "pointer",
                            flex: 1,
                            fontSize: "14px",
                          }}
                        >
                          For Her
                        </Label>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <RadioGroupItem value="other" id="gf-other" />
                        <Label
                          htmlFor="gf-other"
                          style={{
                            cursor: "pointer",
                            flex: 1,
                            fontSize: "14px",
                          }}
                        >
                          Anyone
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label
                      htmlFor="gf-relationship"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      Relationship
                    </Label>
                    <Select
                      value={giftFinderForm.relationship}
                      onValueChange={(value: string) =>
                        setGiftFinderForm({
                          ...giftFinderForm,
                          relationship: value,
                        })
                      }
                    >
                      <SelectTrigger
                        id="gf-relationship"
                        style={{ marginTop: "8px", height: "40px" }}
                      >
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
                    <Label
                      htmlFor="gf-occasion"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      Occasion
                    </Label>
                    <Select
                      value={giftFinderForm.occasion}
                      onValueChange={(value: string) =>
                        setGiftFinderForm({
                          ...giftFinderForm,
                          occasion: value,
                        })
                      }
                    >
                      <SelectTrigger
                        id="gf-occasion"
                        style={{ marginTop: "8px", height: "40px" }}
                      >
                        <SelectValue placeholder="Select occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="anniversary">Anniversary</SelectItem>
                        <SelectItem value="graduation">Graduation</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                        <SelectItem value="justbecause">
                          Just Because
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="gf-age"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      Age Group
                    </Label>
                    <Select
                      value={giftFinderForm.ageGroup}
                      onValueChange={(value: string) =>
                        setGiftFinderForm({
                          ...giftFinderForm,
                          ageGroup: value,
                        })
                      }
                    >
                      <SelectTrigger
                        id="gf-age"
                        style={{ marginTop: "8px", height: "40px" }}
                      >
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
                      width: "100%",
                      padding: "12px",
                      borderRadius: "24px",
                      backgroundColor: "#FF8C42",
                      color: "white",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      marginTop: "8px",
                    }}
                  >
                    Find My Perfect Gift
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right: Search Bar + Utility Icons */}
          <div style={headerRightStyle} className="header-right">
            {/* Mobile menu button - only visible on small screens */}
            <button
              className="mobile-menu-button"
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                marginRight: "8px",
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
                  <button type="submit" style={searchIconStyle}>
                    <Search size={16} />
                  </button>
                </div>
              </form>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{ position: "relative", ...iconButtonStyle }}
                onClick={() => navigate("/cart")}
              >
                <ShoppingCart size={20} />
                {getTotalItems() > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      backgroundColor: "#FF8C42",
                      color: "white",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                    }}
                  >
                    {getTotalItems()}
                  </span>
                )}
              </div>
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
            opacity: mobileMenuOpen ? 1 : 0,
            visibility: mobileMenuOpen ? "visible" : "hidden",
            transition: "opacity 0.3s ease-in-out",
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "white",
          zIndex: 1000,
          transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: 600 }}>Menu</span>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #F3F4F6",
            cursor: "pointer",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Link to="/" style={{ textDecoration: "none", color: "#1A1A1A" }}>
            Home
          </Link>
        </div>

        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #F3F4F6",
            cursor: "pointer",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Link
            to="/products"
            style={{ textDecoration: "none", color: "#1A1A1A" }}
          >
            Products
          </Link>
        </div>

        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #F3F4F6",
            cursor: "pointer",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Link
            to="/bulk-orders"
            style={{ textDecoration: "none", color: "#1A1A1A" }}
          >
            Bulk Orders
          </Link>
        </div>

        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #F3F4F6",
            cursor: "pointer",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Link to="/cart" style={{ textDecoration: "none", color: "#1A1A1A" }}>
            Cart
          </Link>
        </div>

        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #F3F4F6",
            cursor: "pointer",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Link
            to="/profile"
            style={{ textDecoration: "none", color: "#1A1A1A" }}
          >
            Profile
          </Link>
        </div>
      </div>

      {/* Checkout Progress Stepper */}
      <div
        style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}
      >
        <div style={stepperContainerStyle} className="stepper-container">
          {/* Step 1 */}
          <div style={stepContainerStyle} className="step-container">
            <div
              style={{
                ...stepCircleStyle,
                backgroundColor: currentStep >= 1 ? "#FF8C42" : "#E5E7EB",
                color: currentStep >= 1 ? "white" : "#6B7280",
              }}
              className="step-circle"
            >
              1
            </div>
            <span
              style={{
                ...stepLabelStyle,
                color: currentStep >= 1 ? "#1A1A1A" : "#6B7280",
                fontWeight: currentStep === 1 ? 600 : 500,
              }}
              className="step-label"
            >
              Delivery info
            </span>
          </div>

          {/* Connector 1-2 */}
          <div
            style={{
              ...stepConnectorStyle,
              backgroundColor: "#1A1A1A",
            }}
            className="step-connector"
          />

          {/* Step 2 */}
          <div style={stepContainerStyle}>
            <div
              style={{
                ...stepCircleStyle,
                backgroundColor: currentStep >= 2 ? "#FF8C42" : "#E5E7EB",
                color: currentStep >= 2 ? "white" : "#6B7280",
              }}
            >
              2
            </div>
            <span
              style={{
                ...stepLabelStyle,
                color: currentStep >= 2 ? "#1A1A1A" : "#6B7280",
                fontWeight: currentStep === 2 ? 600 : 500,
              }}
            >
              Packaging Options
            </span>
          </div>

          {/* Connector 2-3 */}
          <div
            style={{
              ...stepConnectorStyle,
              backgroundColor: "#1A1A1A",
            }}
          />

          {/* Step 3 */}
          <div style={stepContainerStyle}>
            <div
              style={{
                ...stepCircleStyle,
                backgroundColor: currentStep >= 3 ? "#FF8C42" : "#E5E7EB",
                color: currentStep >= 3 ? "white" : "#6B7280",
              }}
            >
              3
            </div>
            <span
              style={{
                ...stepLabelStyle,
                color: currentStep >= 3 ? "#1A1A1A" : "#6B7280",
                fontWeight: currentStep === 3 ? 600 : 500,
              }}
            >
              Payment
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "32px",
          }}
          className="checkout-grid"
        >
          {/* Left Column - Delivery Information Form */}
          <div>
            {/* Breadcrumb */}
            <div
              style={{ marginBottom: "24px", cursor: "pointer" }}
              onClick={() => navigate("/cart")}
            >
              <span style={{ color: "#1A1A1A", fontSize: "14px" }}>
                ← Back to cart
              </span>
            </div>

            {/* Step 1: Delivery Information */}
            {currentStep === 1 && (
              <div style={formContainerStyle} className="form-container">
                <h2 style={sectionHeadingStyle}>Delivery Information</h2>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName" style={formLabelStyle}>
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      value={deliveryInfo.fullName}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="Enter recipient name"
                      style={inputStyle}
                      className="form-input"
                    />
                  </div>

                  {/* Phone Number - Two side by side */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <Label htmlFor="phone1" style={formLabelStyle}>
                        Phone Number *
                      </Label>
                      <Input
                        id="phone1"
                        value={deliveryInfo.phone}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Enter phone number"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone2" style={formLabelStyle}>
                        Alternative Phone Number
                      </Label>
                      <Input
                        id="phone2"
                        placeholder="Enter alternative phone number"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <Label htmlFor="address" style={formLabelStyle}>
                      Delivery Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={deliveryInfo.address}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          address: e.target.value,
                        })
                      }
                      placeholder="Enter address"
                      style={textareaStyle}
                    />
                  </div>

                  {/* City & State - Side by side */}
                  <div
                    style={twoColumnLayoutStyle}
                    className="two-column-layout"
                  >
                    {/* City */}
                    <div>
                      <Label htmlFor="city" style={formLabelStyle}>
                        City *
                      </Label>
                      <Input
                        id="city"
                        value={deliveryInfo.city}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            city: e.target.value,
                          })
                        }
                        placeholder="Enter city"
                        style={inputStyle}
                      />
                    </div>

                    {/* State */}
                    <div>
                      <Label style={formLabelStyle}>State</Label>
                      <Input
                        value={deliveryInfo.state}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            state: e.target.value,
                          })
                        }
                        placeholder="Enter state"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <Separator style={{ borderColor: "#E5E7EB" }} />

                  {/* Send Directly to Receiver Toggle */}
                  <div style={{ ...toggleSectionStyle, cursor: "pointer" }}>
                    <div style={toggleHeaderStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            backgroundColor: "#FFF4E6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Truck size={20} style={{ color: "#FF8C42" }} />
                        </div>
                        <div>
                          <Label
                            htmlFor="recipient-toggle"
                            style={toggleLabelStyle}
                          >
                            Send Directly to Receiver
                          </Label>
                          <p style={toggleSubtextStyle}>
                            We'll ship it straight to their door
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="recipient-toggle"
                        checked={sendToRecipient}
                        onCheckedChange={setSendToRecipient}
                      />
                    </div>

                    {/* Conditional Fields */}
                    {sendToRecipient && (
                      <div style={conditionalFieldsStyle}>
                        {/* Recipient Name */}
                        <div>
                          <Label htmlFor="recipientName" style={formLabelStyle}>
                            Recipient Name
                          </Label>
                          <Input
                            id="recipientName"
                            value={recipientInfo.name}
                            onChange={(e) =>
                              setRecipientInfo({
                                ...recipientInfo,
                                name: e.target.value,
                              })
                            }
                            placeholder="Enter recipient name"
                            style={inputStyle}
                          />
                        </div>

                        {/* Recipient Phone */}
                        <div>
                          <Label
                            htmlFor="recipientPhone"
                            style={formLabelStyle}
                          >
                            Phone Number
                          </Label>
                          <Input
                            id="recipientPhone"
                            value={recipientInfo.phone}
                            onChange={(e) =>
                              setRecipientInfo({
                                ...recipientInfo,
                                phone: e.target.value,
                              })
                            }
                            placeholder="Enter phone number"
                            style={inputStyle}
                          />
                        </div>

                        {/* Recipient Address */}
                        <div>
                          <Label
                            htmlFor="recipientAddress"
                            style={formLabelStyle}
                          >
                            Delivery Address
                          </Label>
                          <Textarea
                            id="recipientAddress"
                            value={recipientInfo.address}
                            onChange={(e) =>
                              setRecipientInfo({
                                ...recipientInfo,
                                address: e.target.value,
                              })
                            }
                            placeholder="Enter address"
                            style={textareaStyle}
                          />
                        </div>

                        {/* Schedule Delivery Date */}
                        <div>
                          <Label style={formLabelStyle}>
                            Schedule Delivery Date (Optional)
                          </Label>
                          <div style={{ position: "relative" }}>
                            <Input
                              type="date"
                              value={recipientInfo.deliveryDate}
                              onChange={(e) =>
                                setRecipientInfo({
                                  ...recipientInfo,
                                  deliveryDate: e.target.value,
                                })
                              }
                              placeholder="Choose a delivery date"
                              style={{ ...inputStyle, paddingRight: "40px" }}
                            />
                            <CalendarIcon
                              size={18}
                              style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#FF8C42",
                                pointerEvents: "none",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Continue Button */}
                  <button
                    style={continueButtonStyle}
                    onClick={handleNextStep}
                    className="continue-button"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Packaging Options */}
            {currentStep === 2 && (
              <div style={formContainerStyle}>
                <h2 style={sectionHeadingStyle}>Packaging Options</h2>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {/* Packaging Option Dropdown */}
                  <div style={{ position: "relative" }}>
                    <Label style={formLabelStyle}>Packaging Option</Label>
                    <div
                      onClick={() =>
                        setIsPackagingDropdownOpen(!isPackagingDropdownOpen)
                      }
                      style={{
                        ...inputStyle,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        paddingRight: "12px",
                      }}
                    >
                      <span
                        style={{
                          color: packagingOption ? "#1A1A1A" : "#9CA3AF",
                        }}
                      >
                        {packagingOption || "Select packaging"}
                      </span>
                      <ChevronDown
                        size={18}
                        style={{
                          color: "#6B7280",
                          transform: isPackagingDropdownOpen
                            ? "rotate(180deg)"
                            : "rotate(0)",
                          transition: "transform 0.2s",
                        }}
                      />
                    </div>

                    {/* Dropdown Menu */}
                    {isPackagingDropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          marginTop: "4px",
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          zIndex: 50,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          onClick={() => {
                            setPackagingOption("Standard Pack (free)");
                            setIsPackagingDropdownOpen(false);
                          }}
                          style={{
                            padding: "12px 16px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                            color: "#1A1A1A",
                            transition: "background-color 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#FDF6F3")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "white")
                          }
                        >
                          Standard Pack (free)
                        </div>
                        <div
                          onClick={() => {
                            setPackagingOption("Premium Gift Box (+ ₦5000)");
                            setIsPackagingDropdownOpen(false);
                          }}
                          style={{
                            padding: "12px 16px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                            color: "#1A1A1A",
                            transition: "background-color 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#FDF6F3")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "white")
                          }
                        >
                          Premium Gift Box (+ ₦5000)
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator style={{ borderColor: "#E5E7EB" }} />

                  {/* Add a Custom Message Toggle */}
                  <div style={{ ...toggleSectionStyle, cursor: "pointer" }}>
                    <div style={toggleHeaderStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            backgroundColor: "#FFF4E6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Pencil size={20} style={{ color: "#FF8C42" }} />
                        </div>
                        <div>
                          <Label
                            htmlFor="custom-message-toggle"
                            style={toggleLabelStyle}
                          >
                            Add a custom message
                          </Label>
                          <p style={toggleSubtextStyle}>
                            Include a heartfelt message with your gift
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="custom-message-toggle"
                        checked={addCustomMessage}
                        onCheckedChange={setAddCustomMessage}
                      />
                    </div>

                    {/* Conditional Message Field */}
                    {addCustomMessage && (
                      <div style={conditionalFieldsStyle}>
                        <Textarea
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          placeholder="Write your message here"
                          style={{
                            ...textareaStyle,
                            height: "100px",
                            backgroundColor: "#FBFBFB",
                            border: "1px solid #E5E7EB",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Personalize Gift Toggle */}
                  <div style={{ ...toggleSectionStyle, cursor: "pointer" }}>
                    <div style={toggleHeaderStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            backgroundColor: "#FFF4E6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Upload size={20} style={{ color: "#FF8C42" }} />
                        </div>
                        <div>
                          <Label
                            htmlFor="personalize-gift-toggle"
                            style={toggleLabelStyle}
                          >
                            Personalize Gift
                          </Label>
                          <p style={toggleSubtextStyle}>
                            Add custom text or upload an image
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="personalize-gift-toggle"
                        checked={personalizeGift}
                        onCheckedChange={setPersonalizeGift}
                      />
                    </div>

                    {/* Conditional Personalization Fields */}
                    {personalizeGift && (
                      <div style={conditionalFieldsStyle}>
                        {/* Custom Text Field */}
                        <div>
                          <Label htmlFor="customText" style={formLabelStyle}>
                            Custom Text
                          </Label>
                          <Input
                            id="customText"
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            placeholder="Enter name, initials, or message"
                            style={inputStyle}
                          />
                        </div>

                        {/* Upload Area */}
                        <div>
                          <Label style={formLabelStyle}>Upload Image</Label>
                          <div
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                            style={{
                              width: "100%",
                              padding: "32px",
                              borderRadius: "8px",
                              border: "2px dashed #E5E7EB",
                              backgroundColor: "#FAFAFA",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "12px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#FF8C42";
                              e.currentTarget.style.backgroundColor = "#FFF4E6";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#E5E7EB";
                              e.currentTarget.style.backgroundColor = "#FAFAFA";
                            }}
                          >
                            <Upload size={32} style={{ color: "#FF8C42" }} />
                            <span
                              style={{
                                fontSize: "14px",
                                fontFamily: "Poppins",
                                fontWeight: 400,
                                color: "#1A1A1A",
                              }}
                            >
                              Click to upload image
                            </span>
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setUploadedImage(file);
                              }}
                            />
                          </div>
                          {uploadedImage && (
                            <p
                              style={{
                                marginTop: "8px",
                                fontSize: "13px",
                                color: "#059669",
                                fontFamily: "Poppins",
                                fontWeight: 400,
                              }}
                            >
                              ✓ {uploadedImage.name}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Continue Button */}
                  <button style={continueButtonStyle} onClick={handleNextStep}>
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div>
                {/* Payment Method Container */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "760px",
                    backgroundColor: "#F6F6F6",
                    borderRadius: "24px",
                    padding: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <h2 style={sectionHeadingStyle}>Payment Method</h2>

                  {/* Payment Options */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* Option 1: Credit Card */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px",
                        borderRadius: "12px",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          backgroundColor: "#FFF4E6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CreditCard size={20} style={{ color: "#FF8C42" }} />
                      </div>
                      <span
                        style={{
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          fontSize: "16px",
                          color: "#1A1A1A",
                        }}
                      >
                        Add a custom message
                      </span>
                    </div>

                    {/* Option 2: Delivery Truck */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px",
                        borderRadius: "12px",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          backgroundColor: "#FFF4E6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Truck size={20} style={{ color: "#FF8C42" }} />
                      </div>
                      <span
                        style={{
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          fontSize: "16px",
                          color: "#1A1A1A",
                        }}
                      >
                        Add a custom message
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <PlaceOrderButton
                    amount={total}
                    onSuccess={handlePaymentSuccess}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div style={orderSummaryStyle} className="order-summary">
              <h3
                style={{
                  fontFamily: "Poppins",
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "20px",
                }}
              >
                Order Summary
              </h3>

              {/* Product Review Cards */}
              <div style={{ marginBottom: "20px" }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={productCardStyle}
                    className="product-card"
                  >
                    <div style={productImageStyle} className="product-image">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#1A1A1A",
                          marginBottom: "4px",
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#6B7280",
                          marginBottom: "4px",
                        }}
                      >
                        {item.category}
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#717182",
                          textAlign: "right",
                        }}
                      >
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator style={{ borderColor: "#E5E7EB", margin: "16px 0" }} />

              {/* Financial Breakdown */}
              <div>
                <div style={priceRowStyle}>
                  <span
                    style={{
                      color: "#6B7280",
                      fontFamily: "Poppins",
                      fontWeight: 400,
                    }}
                  >
                    Subtotal
                  </span>
                  <span style={{ fontWeight: 600, color: "#1A1A1A" }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div style={priceRowStyle}>
                  <span
                    style={{
                      color: "#6B7280",
                      fontFamily: "Poppins",
                      fontWeight: 400,
                    }}
                  >
                    Delivery Fee
                  </span>
                  <span style={{ fontWeight: 600, color: "#1A1A1A" }}>
                    {formatPrice(deliveryFee)}
                  </span>
                </div>
                <Separator
                  style={{ borderColor: "#E5E7EB", margin: "12px 0" }}
                />
                <div style={{ ...priceRowStyle, fontSize: "16px" }}>
                  <span style={{ fontWeight: 700, color: "#1A1A1A" }}>
                    Total
                  </span>
                  <span style={{ fontWeight: 700, color: "#FF8C42" }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CheckoutPage;
