import { useState, CSSProperties, FormEvent, useRef, useEffect, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { allProducts } from "../data/products";
import { useRecentlyViewed, getRecentlyViewedProducts } from "../hooks/useRecentlyViewed";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { fetchUserOrders, cancelOrder as cancelOrderApi } from "../lib/orders";
import {
  Search,
  ShoppingCart,
  Heart,
  Headset,
  User,
  ChevronDown,
  Sparkles,
  UserCircle,
  Package,
  Eye,
  Settings,
  LogOut,
  Pencil,
  Eye as EyeIcon,
  Trash2,
  Calendar,
  X,
  Loader2,
} from "lucide-react";

// Order type definition for UI
interface Order {
  id: string;
  orderNumber: string;
  itemName: string;
  date: string;
  status: 'Delivered' | 'In Transit' | 'Processing' | 'Canceled';
  amount: number;
  deliveryFee: number;
  items: { name: string; type: string; price: number }[];
}

// Mock orders data - 4 orders for grid display
// Note: This is now a fallback when no real orders exist
const mockOrders: Order[] = [
  { 
    id: "#I1245678", 
    orderNumber: "I1245678",
    itemName: "Premium Gift Box", 
    date: "Dec 15, 2024", 
    status: "Delivered", 
    amount: 20000,
    deliveryFee: 1500,
    items: [
      { name: "Premium Gift Box", type: "Gift Set", price: 20000 },
      { name: "Thank You Card", type: "Stationery", price: 500 },
    ]
  },
  { 
    id: "#I1245679", 
    orderNumber: "I1245679",
    itemName: "Birthday Surprise Kit", 
    date: "Dec 12, 2024", 
    status: "In Transit", 
    amount: 12500,
    deliveryFee: 1500,
    items: [
      { name: "Birthday Surprise Kit", type: "Celebration Pack", price: 12500 },
    ]
  },
  { 
    id: "#I1245680", 
    orderNumber: "I1245680",
    itemName: "Anniversary Hamper", 
    date: "Dec 10, 2024", 
    status: "Processing", 
    amount: 35000,
    deliveryFee: 1500,
    items: [
      { name: "Anniversary Hamper", type: "Luxury Set", price: 35000 },
    ]
  },
  { 
    id: "#I1245681", 
    orderNumber: "I1245681",
    itemName: "Corporate Gift Pack", 
    date: "Dec 8, 2024", 
    status: "Canceled", 
    amount: 45000,
    deliveryFee: 1500,
    items: [
      { name: "Corporate Gift Pack", type: "Business", price: 45000 },
    ]
  },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { addToCart } = useCart();
  const { recentlyViewed, clearRecentlyViewed, removeFromRecentlyViewed } = useRecentlyViewed();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'recently_viewed' | 'settings'>('profile');
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phoneNumber: "+234 8123456789",
  });
  const originalData = useRef(formData);

  // Fetch orders when orders tab is active
  useEffect(() => {
    // Check for order parameter in URL
    const params = new URLSearchParams(window.location.search);
    const orderParam = params.get('order');
    
    if (orderParam) {
      // Auto-switch to orders tab and load orders
      setActiveTab('orders');
      if (!ordersLoaded) {
        loadOrders();
      }
    } else if (activeTab === 'orders' && !ordersLoaded) {
      loadOrders();
    }
  }, [activeTab, ordersLoaded]);

  // Load orders from Supabase
  const loadOrders = async () => {
    if (!user) {
      // Use mock orders if no user
      setOrders(mockOrders);
      setOrdersLoaded(true);
      return;
    }

    setLoadingOrders(true);
    try {
      const realOrders = await fetchUserOrders();
      if (realOrders.length > 0) {
        setOrders(realOrders);
      } else {
        // Fall back to mock orders if no real orders
        setOrders(mockOrders);
      }
      setOrdersLoaded(true);
    } catch (error) {
      console.error('Error loading orders:', error);
      // Fall back to mock orders on error
      setOrders(mockOrders);
      setOrdersLoaded(true);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Header styles
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

  // Handle search submission
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

  // Main content styles
  const pageContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const mainContentStyle: CSSProperties = {
    flex: 1,
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  };

  const pageTitleStyle: CSSProperties = {
    fontSize: '24px',
    fontWeight: 600,
    color: '#1A1A1A',
    marginBottom: '32px',
  };

  // Sidebar styles
  const sidebarContainerStyle: CSSProperties = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto 24px',
    display: 'flex',
    gap: '24px',
  };

  const sidebarStyle: CSSProperties = {
    width: '248px',
    minHeight: '717px',
    backgroundColor: '#F6F6F6',
    borderRadius: '8px',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    height: 'fit-content',
  };

  const sidebarMenuItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s',
  };

  const activeMenuItemStyle: CSSProperties = {
    ...sidebarMenuItemStyle,
    backgroundColor: 'transparent',
    color: '#FF8C42',
  };

  const inactiveMenuItemStyle: CSSProperties = {
    ...sidebarMenuItemStyle,
    color: '#6B7280',
    backgroundColor: 'transparent',
  };

  const logoutItemStyle: CSSProperties = {
    ...sidebarMenuItemStyle,
    color: '#DC2626',
    marginTop: 'auto',
  };

  // Content area styles
  const contentAreaStyle: CSSProperties = {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
  };

  // Personal Information Section
  const sectionStyle: CSSProperties = {
    marginBottom: '24px',
  };

  const sectionHeaderStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  };

  const sectionTitleStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '18px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
  };

  const editLinkStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#FF8C42',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  };

  const dataGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  };

  const dataItemStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const dataLabelStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#717182',
  };

  const dataValueBoxStyle: CSSProperties = {
    backgroundColor: '#F6F6F6',
    borderRadius: '8px',
    padding: '12px 16px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const dataValueStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
  };

  const dataInputStyle: CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #FF8C42',
    backgroundColor: '#F6F6F6',
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'text',
  };

  const dividerStyle: CSSProperties = {
    borderTop: '2px solid #E5E7EB',
    margin: '32px 0',
  };

  // Account Security Section
  const passwordSectionTitleStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1A1A1A',
    marginBottom: '24px',
  };

  const changePasswordLinkStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#717182',
    cursor: 'pointer',
    textDecoration: 'none',
    marginBottom: '16px',
    display: 'inline-block',
  };

  const passwordRowStyle: CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  };

  const passwordFieldStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const passwordFieldWithMarginStyle: CSSProperties = {
    ...passwordFieldStyle,
    marginBottom: '16px',
  };

  const passwordLabelStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 500,
    fontStyle: 'normal',
    fontSize: '16px',
    lineHeight: '120%',
    letterSpacing: '0%',
    color: '#0A0A0A',
  };

  const passwordInputContainerStyle: CSSProperties = {
    position: 'relative',
  };

  const passwordInputStyle: CSSProperties = {
    width: '100%',
    padding: '12px 40px 12px 16px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    backgroundColor: '#FAFAFA',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const passwordToggleStyle: CSSProperties = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#6B7280',
    background: 'none',
    border: 'none',
    padding: '4px',
  };

  // Danger Zone
  const dangerZoneStyle: CSSProperties = {
    border: '1px solid #FEE2E2',
    backgroundColor: '#FEF2F2',
    borderRadius: '16px',
    padding: '24px',
    marginTop: '24px',
  };

  const dangerTitleStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#DC2626',
    marginBottom: '8px',
  };

  const dangerDescriptionStyle: CSSProperties = {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '16px',
  };

  const deleteButtonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #DC2626',
    backgroundColor: 'transparent',
    color: '#DC2626',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  // Order History Grid Styles
  const orderHistoryHeaderStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '18px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
    marginBottom: '24px',
  };

  const filterBarStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const filterDropdownsStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
  };

  const dropdownStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '20px',
    border: '1px solid #E5E7EB',
    backgroundColor: '#F6F6F6',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  };

  const ordersGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
  };

  // Order Card - grey background
  const orderCardStyle: CSSProperties = {
    backgroundColor: '#F6F6F6',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #E5E7EB',
  };

  const orderCardHeaderStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  };

  // Order ID typography: Poppins, 400, 18px, line-height 160%
  const orderIdTextStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '18px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
  };

  // Placed on typography: Poppins, 400, 14px, line-height 160%, color #717182
  const orderDateTextStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#717182',
  };

  // Delivered status typography: Poppins, 500, 16px, line-height 120%, color #34C759
  const getStatusStyle = (status: string): CSSProperties => {
    const isDelivered = status === 'Delivered';
    const isInTransit = status === 'In Transit';
    const isProcessing = status === 'Processing';
    const isCanceled = status === 'Canceled';

    return {
      fontFamily: 'Poppins',
      fontWeight: 500,
      fontStyle: 'medium',
      fontSize: '16px',
      lineHeight: '120%',
      letterSpacing: '0%',
      color: isDelivered ? '#34C759' : isInTransit ? '#3B82F6' : isProcessing ? '#7DD3FC' : '#EF4444',
    };
  };

  // Product container - grey background with border
  const productCardStyle: CSSProperties = {
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
    backgroundColor: '#F6F6F6',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const productThumbnailStyle: CSSProperties = {
    width: '56px',
    height: '56px',
    backgroundColor: '#E5E7EB',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const productInfoStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const productNameStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
  };

  // Item type typography: Poppins, 400, 14px, line-height 160%, color #717182
  const productTypeStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#717182',
  };

  const productPriceStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 700,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
  };

  const financialSectionStyle: CSSProperties = {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #E5E7EB',
  };

  // Subtotal/Delivery Fee text: Poppins, 400, 14px, line-height 160%, color #717182
  const financialRowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  };

  const financialLabelStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#717182',
  };

  // Subtotal/Delivery Fee numbers: Poppins, 500, 16px, line-height 120%
  const financialValueStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 500,
    fontStyle: 'medium',
    fontSize: '16px',
    lineHeight: '120%',
    letterSpacing: '0%',
    color: '#1A1A1A',
  };

  const totalRowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
    paddingTop: '8px',
  };

  const totalLabelStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 700,
    fontStyle: 'normal',
    fontSize: '16px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
  };

  const totalValueStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 700,
    fontStyle: 'normal',
    fontSize: '16px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
  };

  // Action buttons - side by side, no wrap
  const actionButtonsContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  };

  const buyAgainButtonStyle: CSSProperties = {
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: '#FF8C42',
    color: 'white',
    border: 'none',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    whiteSpace: 'nowrap',
  };

  const viewDetailsButtonStyle: CSSProperties = {
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: 'transparent',
    color: '#FF8C42',
    border: '1px solid #FF8C42',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    whiteSpace: 'nowrap',
  };

  const writeReviewButtonStyle: CSSProperties = {
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: 'transparent',
    color: '#FF8C42',
    border: '1px solid #FF8C42',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    whiteSpace: 'nowrap',
  };

  const cancelOrderButtonStyle: CSSProperties = {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#EF4444',
    border: 'none',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    whiteSpace: 'nowrap',
  };

  // Recently Viewed Grid Styles
  const recentlyViewedGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
  };

  const recentlyViewedCardStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #E5E7EB',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const recentlyViewedImageContainerStyle: CSSProperties = {
    width: '100%',
    aspectRatio: '1',
    backgroundColor: '#F3F4F6',
    position: 'relative',
    overflow: 'hidden',
  };

  const recentlyViewedInfoStyle: CSSProperties = {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const recentlyViewedTitleStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#1A1A1A',
    fontFamily: 'Inter, sans-serif',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const recentlyViewedPriceStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    color: '#FF8C42',
    fontFamily: 'Inter, sans-serif',
  };

  const addToCartButtonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '20px',
    backgroundColor: '#FF8C42',
    color: 'white',
    border: 'none',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.2s ease',
  };

  const removeButtonStyle: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#6B7280',
    transition: 'all 0.2s ease',
    zIndex: 10,
  };

  const clearAllButtonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#6B7280',
    border: '1px solid #E5E7EB',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.2s ease',
  };

  // Get products from recently viewed IDs
  const recentlyViewedProducts = getRecentlyViewedProducts(recentlyViewed, allProducts);

  // Handle add to cart
  const handleAddToCart = (product: typeof allProducts[0]) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: parseFloat(product.price.replace('$', '')),
      image: product.image,
      category: product.category,
    });
    toast.success(`${product.title} added to cart!`);
  };

  // Handle product click - navigate to product detail
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setHasChanges(false);
    originalData.current = { ...formData };
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    setHasChanges(false);
    toast.success("Profile updated successfully");
  };

  const handleCancelClick = () => {
    setFormData({ ...originalData.current });
    setIsEditing(false);
    setHasChanges(false);
  };

  useEffect(() => {
    if (isEditing) {
      const inputs = document.querySelectorAll<HTMLInputElement>('.profile-input');
      if (inputs.length > 0) {
        inputs[0].focus();
      }
    }
  }, [isEditing]);

  const handleLogout = async () => {
    await signOut();
    toast.success("You have been logged out successfully");
    navigate("/");
  };

  const PasswordToggle = ({ show, onClick }: { show: boolean; onClick: () => void }) => (
    <button
      style={passwordToggleStyle}
      onClick={onClick}
      type="button"
    >
      {show ? (
        <div style={{ position: 'relative' }}>
          <EyeIcon size={18} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            right: '10%',
            height: '2px',
            backgroundColor: '#6B7280',
            transform: 'translateY(-50%) rotate(-45deg)',
          }} />
        </div>
      ) : (
        <EyeIcon size={18} />
      )}
    </button>
  );

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.itemName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Orders" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle order search
  const handleOrderSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderSearchQuery(e.target.value);
  };

  // Handle order actions
  const handleBuyAgain = (orderId: string) => {
    const order = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.items.forEach((item) => {
        // Find product by name (simplified - in production use product ID)
        const product = allProducts.find(p => p.title === item.name);
        if (product) {
          addToCart({
            id: product.id,
            title: product.title,
            price: parseFloat(product.price.replace('$', '')),
            image: product.image,
            category: product.category,
          });
        }
      });
      toast.success(`Items from order ${orderId} added to cart`);
    }
  };

  const handleViewDetails = (orderId: string) => {
    toast.info(`Viewing details for order ${orderId}`);
  };

  const handleWriteReview = (orderId: string) => {
    toast.info(`Writing review for order ${orderId}`);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      // Find the actual order UUID from the order number
      const order = orders.find(o => o.orderNumber === orderId.replace('#', ''));
      if (order) {
        await cancelOrderApi(order.id);
        toast.success(`Order ${orderId} has been canceled`);
        // Reload orders
        setOrdersLoaded(false);
      }
    } catch (error) {
      toast.error('Failed to cancel order. Please try again.');
    }
  };

  // Render Profile Info content
  const renderProfileInfoContent = () => (
    <>
      {/* Personal Information Section */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Personal Information</h2>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{ ...editLinkStyle, color: '#6B7280' }}
                onClick={handleCancelClick}
              >
                Cancel
              </button>
              <button
                style={{ ...editLinkStyle, color: hasChanges ? '#FF8C42' : '#9CA3AF' }}
                onClick={handleSaveClick}
                disabled={!hasChanges}
              >
                Save
              </button>
            </div>
          ) : (
            <button style={editLinkStyle} onClick={handleEditClick}>
              <Pencil size={16} />
              Edit
            </button>
          )}
        </div>

        <div style={dataGridStyle}>
          <div style={dataItemStyle}>
            <span style={dataLabelStyle}>Full Name</span>
            {isEditing ? (
              <input
                type="text"
                className="profile-input"
                style={dataInputStyle}
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
            ) : (
              <div style={dataValueBoxStyle}>
                <span style={dataValueStyle}>{formData.fullName}</span>
              </div>
            )}
          </div>
          <div style={dataItemStyle}>
            <span style={dataLabelStyle}>Email</span>
            {isEditing ? (
              <input
                type="email"
                className="profile-input"
                style={dataInputStyle}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            ) : (
              <div style={dataValueBoxStyle}>
                <span style={dataValueStyle}>{formData.email}</span>
              </div>
            )}
          </div>
          <div style={dataItemStyle}>
            <span style={dataLabelStyle}>Phone Number</span>
            {isEditing ? (
              <input
                type="tel"
                className="profile-input"
                style={dataInputStyle}
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              />
            ) : (
              <div style={dataValueBoxStyle}>
                <span style={dataValueStyle}>{formData.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={dividerStyle}></div>

      {/* Account Security Section */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Account Security</h2>
        <span
          style={changePasswordLinkStyle}
          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
        >
          Change Password
        </span>

        {/* Current Password */}
        <div style={passwordFieldWithMarginStyle}>
          <label style={passwordLabelStyle}>Password</label>
          <div style={passwordInputContainerStyle}>
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter password"
              style={passwordInputStyle}
            />
            <PasswordToggle show={showCurrentPassword} onClick={() => setShowCurrentPassword(!showCurrentPassword)} />
          </div>
        </div>

        {/* New Password Row */}
        <div style={passwordRowStyle}>
          <div style={passwordFieldStyle}>
            <label style={passwordLabelStyle}>New Password</label>
            <div style={passwordInputContainerStyle}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Create a strong password"
                style={passwordInputStyle}
              />
              <PasswordToggle show={showNewPassword} onClick={() => setShowNewPassword(!showNewPassword)} />
            </div>
          </div>
          <div style={passwordFieldStyle}>
            <label style={passwordLabelStyle}>Confirm Password</label>
            <div style={passwordInputContainerStyle}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter password"
                style={passwordInputStyle}
              />
              <PasswordToggle show={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={dangerZoneStyle}>
        <h3 style={dangerTitleStyle}>Danger Zone</h3>
        <p style={dangerDescriptionStyle}>
          Deleting your account is not reversible and all data including order history will be erased
        </p>
        <button style={deleteButtonStyle}>
          <Trash2 size={18} />
          I understand, delete my account
        </button>
      </div>
    </>
  );

  // Render Order History content - UPDATED
  const renderOrderHistoryContent = () => (
    <>
      {/* Order History Header */}
      <h2 style={orderHistoryHeaderStyle}>Order History</h2>

      {/* Filter Bar */}
      <div style={filterBarStyle}>
        {/* Search Input */}
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            placeholder="Search by order ID or name"
            style={{
              width: '100%',
              padding: '10px 36px 10px 16px',
              borderRadius: '20px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#F6F6F6',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
            value={orderSearchQuery}
            onChange={handleOrderSearchChange}
          />
          <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }}>
            <Search size={18} />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div style={filterDropdownsStyle}>
          <div 
            style={dropdownStyle}
            onClick={() => setStatusFilter(statusFilter === "All Orders" ? "Delivered" : "All Orders")}
          >
            <span>{statusFilter}</span>
            <ChevronDown size={16} />
          </div>
          <div style={dropdownStyle}>
            <span>Date Range</span>
            <Calendar size={16} style={{ marginLeft: 'auto' }} />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loadingOrders && (
        <div style={{ 
          textAlign: 'center', 
          padding: '48px 0', 
          color: '#6B7280',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
        }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
          Loading your orders...
        </div>
      )}

      {/* Orders Grid */}
      {!loadingOrders && (
        <div style={ordersGridStyle}>
          {filteredOrders.map((order) => (
            <div key={order.id} style={orderCardStyle}>
              {/* Order Header */}
              <div style={orderCardHeaderStyle}>
                <div>
                  <span style={orderIdTextStyle}>Order {order.id}</span>
                  <p style={orderDateTextStyle}>Placed on {order.date}</p>
                </div>
                <span style={getStatusStyle(order.status)}>{order.status}</span>
              </div>

              {/* Product Cards - grey background with border */}
              {order.items.map((item, index) => (
                <div key={index} style={productCardStyle}>
                  <div style={productThumbnailStyle}>
                    <Package size={24} color="#9CA3AF" />
                  </div>
                  <div style={productInfoStyle}>
                    <span style={productNameStyle}>{item.name}</span>
                    <span style={productTypeStyle}>{item.type}</span>
                  </div>
                  <span style={productPriceStyle}>₦{item.price.toLocaleString()}</span>
                </div>
              ))}

              {/* Financial Breakdown */}
              <div style={financialSectionStyle}>
                <div style={financialRowStyle}>
                  <span style={financialLabelStyle}>Subtotal</span>
                  <span style={financialValueStyle}>₦{order.amount.toLocaleString()}</span>
                </div>
                <div style={financialRowStyle}>
                  <span style={financialLabelStyle}>Delivery Fee</span>
                  <span style={financialValueStyle}>₦{order.deliveryFee.toLocaleString()}</span>
                </div>
                <div style={totalRowStyle}>
                  <span style={totalLabelStyle}>Total</span>
                  <span style={totalValueStyle}>₦{(order.amount + order.deliveryFee).toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons - side by side */}
              <div style={actionButtonsContainerStyle}>
                <button 
                  style={buyAgainButtonStyle}
                  onClick={() => handleBuyAgain(order.id)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E67E3A'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF8C42'}
                >
                  Buy Again
                </button>
                <button 
                  style={viewDetailsButtonStyle}
                  onClick={() => handleViewDetails(order.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFF4E6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  View Details
                </button>
                {order.status === 'Delivered' && (
                  <button 
                    style={writeReviewButtonStyle}
                    onClick={() => handleWriteReview(order.id)}
                  >
                    Write Review
                  </button>
                )}
                {order.status === 'Processing' && (
                  <button 
                    style={cancelOrderButtonStyle}
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredOrders.length === 0 && !loadingOrders && (
        <div style={{ 
          textAlign: 'center', 
          padding: '48px 0', 
          color: '#6B7280',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
        }}>
          {ordersLoaded && orders.length === 0 ? (
            <>No orders found. Start shopping to see your orders here!</>
          ) : (
            <>No orders found matching "{orderSearchQuery}"</>
          )}
        </div>
      )}
    </>
  );

  // Render Recently Viewed content
  const renderRecentlyViewedContent = () => (
    <>
      {/* Header with title and clear all */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={orderHistoryHeaderStyle}>Recently viewed Items</h2>
        {recentlyViewedProducts.length > 0 && (
          <button
            style={clearAllButtonStyle}
            onClick={() => {
              clearRecentlyViewed();
              toast.success('Recently viewed items cleared');
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEE2E2';
              e.currentTarget.style.borderColor = '#EF4444';
              e.currentTarget.style.color = '#EF4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.color = '#6B7280';
            }}
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {recentlyViewedProducts.length > 0 ? (
        /* Products Grid - 3 columns */
        <div style={recentlyViewedGridStyle}>
          {recentlyViewedProducts.map((product) => (
            <div
              key={product.id}
              style={recentlyViewedCardStyle}
              onClick={() => handleProductClick(product.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Remove button */}
              <button
                style={removeButtonStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromRecentlyViewed(product.id);
                  toast.info('Removed from recently viewed');
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FEE2E2';
                  e.currentTarget.style.color = '#EF4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.color = '#6B7280';
                }}
              >
                <X size={14} />
              </button>

              {/* Product Image */}
              <div style={recentlyViewedImageContainerStyle}>
                <ImageWithFallback
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div style={recentlyViewedInfoStyle}>
                <span style={recentlyViewedTitleStyle}>{product.title}</span>
                <span style={recentlyViewedPriceStyle}>{product.price}</span>

                {/* Add to Cart Button */}
                <button
                  style={addToCartButtonStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E67E3A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF8C42';
                  }}
                >
                  <ShoppingCart size={14} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div style={{ 
          textAlign: 'center', 
          padding: '64px 24px', 
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: '#F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Eye size={36} color="#9CA3AF" />
          </div>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 600, 
            color: '#1A1A1A',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '8px',
          }}>
            No recently viewed items
          </h3>
          <p style={{ 
            color: '#6B7280',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '24px',
          }}>
            Start shopping to see your browsing history here
          </p>
          <button
            style={addToCartButtonStyle}
            onClick={() => navigate('/products')}
          >
            <ShoppingCart size={14} />
            Browse Products
          </button>
        </div>
      )}
    </>
  );

  // Address card data type
  interface AddressCardData {
    id: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    isDefault: boolean;
    dateAdded?: string;
  }

  const addressCardsData: AddressCardData[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '+234 8123456789',
      address: '123 Fashion Avenue',
      city: 'New York, NY 10001',
      country: 'United States',
      isDefault: true,
      dateAdded: 'Dec 15, 2024',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      phone: '+234 8123456789',
      address: '456 Business Plaza, Suite 200',
      city: 'New York, NY 10002',
      country: 'United States',
      isDefault: false,
    },
  ];

  // Toggle switch state for notifications and newsletter
  const [notificationToggles, setNotificationToggles] = useState({
    email: false,
    sms: false,
    whatsapp: false,
    subscribe: false,
  });

  const handleNotificationToggle = (key: keyof typeof notificationToggles) => {
    setNotificationToggles(prev => ({ ...prev, [key]: !prev[key] }));
    const keyString = String(key).replace(/([A-Z])/g, ' $1').trim();
    toast.success(`${keyString} ${!notificationToggles[key] ? 'enabled' : 'disabled'}`);
  };

  // Account Settings Header Styles
  const accountSettingsHeaderStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '18px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
    marginBottom: '8px',
  };

  const manageAddressesSubHeaderStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#717182',
    marginBottom: '24px',
  };

  const addressCardContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
  };

  const addressCardStyle: CSSProperties = {
    width: '380px',
    minHeight: '180px',
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: '#F6F6F6',
    border: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
  };

  const addressCardHeaderStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  };

  const addressCardNameStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '18px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
  };

  const defaultBadgeStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 500,
    fontStyle: 'medium',
    fontSize: '16px',
    lineHeight: '120%',
    letterSpacing: '0%',
    color: '#34C759',
  };

  const addressCardContentStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '12px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#717182',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  };

  const addressCardActionsStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '12px',
    gap: '16px',
  };

  const settingsEditLinkStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#FF8C42',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  };

  const removeLinkStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#EF4444',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  };

  const setDefaultButtonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '20px',
    backgroundColor: '#FF8C42',
    color: 'white',
    border: 'none',
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    cursor: 'pointer',
  };

  const sectionDividerStyle: CSSProperties = {
    borderTop: '1px solid #E5E7EB',
    margin: '24px 0',
  };

  const settingsSectionHeaderStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '18px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
    marginBottom: '16px',
  };

  const notificationRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #F3F4F6',
  };

  const notificationLabelStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: '48px',
        height: '28px',
        borderRadius: '14px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: checked ? '#FF8C42' : '#E5E7EB',
        position: 'relative',
        transition: 'background-color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        padding: '2px',
      }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginLeft: checked ? 'auto' : '0',
        transition: 'margin-left 0.2s ease',
      }} />
    </button>
  );

  // Render Address Card
  const renderAddressCard = (card: AddressCardData, index: number) => (
    <div key={card.id} style={addressCardStyle}>
      {/* Card Header */}
      <div style={addressCardHeaderStyle}>
        <span style={addressCardNameStyle}>{card.name}</span>
        {card.isDefault && <span style={defaultBadgeStyle}>Default</span>}
      </div>

      {/* Card Content */}
      <div style={addressCardContentStyle}>
        <span>{card.phone}</span>
        <span>{card.address}</span>
        <span>{card.city}</span>
        <span>{card.country}</span>
        {card.dateAdded && <span>{card.dateAdded}</span>}
      </div>

      {/* Card Actions */}
      <div style={addressCardActionsStyle}>
        {card.isDefault ? (
          <>
            <button style={settingsEditLinkStyle} onClick={() => toast.info('Editing address...')}>
              <Pencil size={16} />
              Edit
            </button>
            <button style={removeLinkStyle} onClick={() => toast.warning('Remove address clicked')}>
              <Trash2 size={16} />
              Remove
            </button>
          </>
        ) : (
          <>
            <button 
              style={setDefaultButtonStyle} 
              onClick={() => toast.success('Address set as default')}
            >
              Set as Default
            </button>
            <button style={settingsEditLinkStyle} onClick={() => toast.info('Editing address...')}>
              <Pencil size={16} />
              Edit
            </button>
            <button style={removeLinkStyle} onClick={() => toast.warning('Remove address clicked')}>
              <Trash2 size={16} />
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );

  // Render Account Settings content
  const renderSettingsContent = () => (
    <>
      {/* Account Setting Header */}
      <h2 style={accountSettingsHeaderStyle}>Account Setting</h2>
      <span style={manageAddressesSubHeaderStyle}>Manage saved addresses</span>

      {/* Address Cards */}
      <div style={addressCardContainerStyle}>
        {addressCardsData.map((card, index) => renderAddressCard(card, index))}
      </div>

      {/* Divider */}
      <div style={sectionDividerStyle} />

      {/* Notification Preferences Section */}
      <h3 style={settingsSectionHeaderStyle}>Notification Preferences</h3>

      {/* Email Notification */}
      <div style={notificationRowStyle}>
        <span style={notificationLabelStyle}>Email Notification</span>
        <ToggleSwitch 
          checked={notificationToggles.email} 
          onChange={() => handleNotificationToggle('email')} 
        />
      </div>

      {/* SMS Notification */}
      <div style={notificationRowStyle}>
        <span style={notificationLabelStyle}>SMS Notification</span>
        <ToggleSwitch 
          checked={notificationToggles.sms} 
          onChange={() => handleNotificationToggle('sms')} 
        />
      </div>

      {/* WhatsApp Notification */}
      <div style={{ ...notificationRowStyle, borderBottom: 'none' }}>
        <span style={notificationLabelStyle}>WhatsApp Notification</span>
        <ToggleSwitch 
          checked={notificationToggles.whatsapp} 
          onChange={() => handleNotificationToggle('whatsapp')} 
        />
      </div>

      {/* Divider */}
      <div style={sectionDividerStyle} />

      {/* Newsletter Subscription Section */}
      <h3 style={settingsSectionHeaderStyle}>Newsletter Subscription</h3>

      {/* Subscribe Toggle */}
      <div style={{ ...notificationRowStyle, borderBottom: 'none' }}>
        <span style={notificationLabelStyle}>Subscribe</span>
        <ToggleSwitch 
          checked={notificationToggles.subscribe} 
          onChange={() => handleNotificationToggle('subscribe')} 
        />
      </div>
    </>
  );

  return (
    <div style={pageContainerStyle}>
      {/* Header */}
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
            <div style={headerCenterStyle}>
              <form onSubmit={handleSearchSubmit}>
                <div style={searchBarContainerStyle}>
                  <input
                    type="text"
                    placeholder="Search for the perfect gift"
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
              <Link to="/cart" style={iconButtonStyle}>
                <ShoppingCart size={20} />
              </Link>
              <div style={iconButtonStyle}>
                <Heart size={20} />
              </div>
              <div style={iconButtonStyle}>
                <Headset size={20} />
              </div>
              <div style={{ ...iconButtonStyle, color: '#FF8C42' }}>
                <User size={20} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={mainContentStyle}>
        <h1 style={pageTitleStyle}>
          {activeTab === 'profile' && 'Account Profile'}
          {activeTab === 'orders' && 'Order History'}
          {activeTab === 'recently_viewed' && 'Recently Viewed Items'}
          {activeTab === 'settings' && 'Account Settings'}
        </h1>

        {/* Sidebar and Content Container */}
        <div style={sidebarContainerStyle}>
          {/* Side Navigation Menu - Left Column */}
          <aside style={sidebarStyle}>
            {/* Profile Info */}
            <div 
              style={activeTab === 'profile' ? activeMenuItemStyle : inactiveMenuItemStyle}
              onClick={() => setActiveTab('profile')}
            >
              <UserCircle size={20} />
              <span>Profile Info</span>
            </div>

            {/* Order History */}
            <div 
              style={activeTab === 'orders' ? activeMenuItemStyle : inactiveMenuItemStyle}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={20} />
              <span>Order History</span>
            </div>

            {/* Recently Viewed Items */}
            <div 
              style={activeTab === 'recently_viewed' ? activeMenuItemStyle : inactiveMenuItemStyle}
              onClick={() => setActiveTab('recently_viewed')}
            >
              <Eye size={20} />
              <span>Recently viewed Items</span>
            </div>

            {/* Account Settings */}
            <div 
              style={activeTab === 'settings' ? activeMenuItemStyle : inactiveMenuItemStyle}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} />
              <span>Account Setting</span>
            </div>

            {/* Spacer to push logout to bottom */}
            <div style={{ flex: 1 }} />

            {/* Logout */}
            <div style={logoutItemStyle} onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </aside>

          {/* Right Content Area */}
          <div style={contentAreaStyle}>
            {activeTab === 'profile' && renderProfileInfoContent()}
            {activeTab === 'orders' && renderOrderHistoryContent()}
            {activeTab === 'recently_viewed' && renderRecentlyViewedContent()}
            {activeTab === 'settings' && renderSettingsContent()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ProfilePage;
