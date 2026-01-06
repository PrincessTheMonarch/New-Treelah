import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getProductById, getRelatedProducts } from "../data/products";
import { useCart } from "../context/CartContext";
import { Footer } from "../components/Footer";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Gift,
  PenLine,
  Upload,
  ArrowLeft,
  ArrowRight,
  Menu,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  X,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, getTotalItems } = useCart();
  const product = id ? getProductById(parseInt(id)) : null;
  const relatedProducts = id ? getRelatedProducts(parseInt(id)) : [];

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [addMessageCard, setAddMessageCard] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendDirectly, setSendDirectly] = useState(false);
  const [personalizeGift, setPersonalizeGift] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commentLikes, setCommentLikes] = useState<{ [key: number]: { likes: number; liked: boolean; dislikes: number; disliked: boolean } }>({
    1: { likes: 40, liked: false, dislikes: 40, disliked: false },
    2: { likes: 35, liked: false, dislikes: 5, disliked: false },
    3: { likes: 28, liked: false, dislikes: 3, disliked: false },
  });

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl mb-4" style={{ color: '#1A1A1A' }}>Product Not Found</h1>
            <Link to="/">
              <Button className="bg-[#FF8C42] text-white">Return to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Price - Orange - Fixed (not based on quantity)
  const basePrice = parseFloat(product.price.replace("$", ""));

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.title,
        price: basePrice,
        image: product.image,
        category: product.category,
        personalization: personalizeGift ? messageText : undefined,
      });
    }
    toast.success(`${product.title} added to cart!`);
  };

  // Remove variant functionality (not needed)

  const handleLikeToggle = (commentId: number) => {
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        liked: !prev[commentId].liked,
        dislikes: prev[commentId].disliked ? prev[commentId].dislikes - 1 : prev[commentId].dislikes,
        disliked: false,
        likes: prev[commentId].liked ? prev[commentId].likes - 1 : prev[commentId].likes + 1,
      }
    }));
  };

  const handleDislikeToggle = (commentId: number) => {
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        disliked: !prev[commentId].disliked,
        likes: prev[commentId].liked ? prev[commentId].likes - 1 : prev[commentId].likes,
        liked: false,
        dislikes: prev[commentId].disliked ? prev[commentId].dislikes - 1 : prev[commentId].dislikes + 1,
      }
    }));
  };

  // Mock additional images for gallery
  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1602347880090-a144f5b4d62c?w=600",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    "https://images.unsplash.com/photo-1560343076-ec342d670c95?w=600",
  ];

  // Mock reviews data with progress bar widths
  const reviewsData = [
    { stars: 5, count: 28 },
    { stars: 4, count: 9 },
    { stars: 3, count: 4 },
    { stars: 2, count: 1 },
    { stars: 1, count: 1 },
  ];

  // Calculate max count for progress bar scaling
  const maxCount = Math.max(...reviewsData.map((r) => r.count));

  const mockComments = [
    {
      id: 1,
      name: "John Doe",
      date: "11/11/2011",
      rating: 5,
      text: "Include a heartfelt message with your gift",
    },
    {
      id: 2,
      name: "Jane Smith",
      date: "12/12/2021",
      rating: 5,
      text: "Beautiful gift packaging and fast delivery!",
    },
    {
      id: 3,
      name: "Mike Johnson",
      date: "01/01/2022",
      rating: 4,
      text: "Great product, exactly as described. Would recommend!",
    },
  ];

  let [variants] = useState(["Classic", "Premium", "Luxury", "Ultimate"]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Header & Navigation - Full width like landing page */}
      <header 
        className="sticky top-0 z-50 bg-white border-b border-gray-100 w-full"
        style={{ width: '100%' }}
      >
        <div className="w-full px-4 py-3">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            {/* Left: Logo Placeholder - Grey Circular Background */}
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#E5E7EB' }}
              >
                <span 
                  className="text-xs font-medium"
                  style={{ color: '#6B7280' }}
                >
                  Logo
                </span>
              </div>
              <div className="flex flex-col">
                <span 
                  className="font-bold text-lg"
                  style={{ color: '#1A1A1A' }}
                >
                  Treelah
                </span>
                <span 
                  className="text-xs"
                  style={{ color: '#6B7280' }}
                >
                  Tag line
                </span>
              </div>
            </div>

            {/* Right: Hamburger Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" style={{ color: '#1A1A1A' }} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <span 
                      className="font-semibold"
                      style={{ color: '#1A1A1A' }}
                    >
                      Menu
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2"
                    style={{ color: '#1A1A1A' }}
                  >
                    Shop All
                  </Link>
                  <Link
                    to="/bulk-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2"
                    style={{ color: '#1A1A1A' }}
                  >
                    Bulk Orders
                  </Link>
                  <Link
                    to="#"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2"
                    style={{ color: '#1A1A1A' }}
                  >
                    Support
                  </Link>
                  <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <ShoppingCart className="h-5 w-5" style={{ color: '#FF8C42' }} />
                        {getTotalItems() > 0 && (
                          <span 
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs font-semibold"
                            style={{ backgroundColor: '#FF8C42', color: 'white' }}
                          >
                            {getTotalItems()}
                          </span>
                        )}
                      </div>
                      <span style={{ color: '#1A1A1A' }}>Cart</span>
                    </div>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 w-full">
        {/* Back Button - Right above Save for Later */}
        <div className="w-full px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 transition-colors"
            style={{ color: '#1A1A1A' }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* 2. Action Bar (Wishlist & Share) */}
        <div className="w-full px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {/* Left: Save for Later - Orange Heart */}
            <button className="flex items-center gap-2">
              <Heart className="h-5 w-5" style={{ color: '#FF8C42' }} />
              <span 
                className="text-sm font-medium"
                style={{ color: '#FF8C42' }}
              >
                Save for Later
              </span>
            </button>

            {/* Right: Share */}
            <button className="flex items-center gap-2">
              <Share2 className="h-5 w-5" style={{ color: '#1A1A1A' }} />
              <span 
                className="text-sm font-medium"
                style={{ color: '#1A1A1A' }}
              >
                Share
              </span>
            </button>
          </div>
        </div>

        {/* 3. Image Gallery */}
        <div className="w-full px-4 py-4">
          {/* Main Image */}
          <div 
            className="rounded-xl overflow-hidden aspect-square mb-4 w-full"
            style={{ backgroundColor: '#E5E7EB' }}
          >
            <ImageWithFallback
              src={productImages[selectedImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full">
            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                  selectedImageIndex === index ? "ring-2" : ""
                }`}
                style={{ 
                  backgroundColor: '#E5E7EB',
                  ringColor: '#FF8C42'
                }}
              >
                <img
                  src={img}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 4. Product Info & Title */}
        <div className="w-full px-4 py-4">
          {/* Tags - 50% Off first, then Staff Pick, then In-stock */}
          <div className="flex gap-2 flex-wrap mb-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: '#6FC2E4', 
                color: 'white' 
              }}
            >
              50% Off
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: '#E0F2FE', 
                color: '#1A1A1A' 
              }}
            >
              Staff Pick
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: '#F3F4F6', 
                color: '#1A1A1A' 
              }}
            >
              In-stock
            </span>
          </div>

          {/* Title */}
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ color: '#1A1A1A' }}
          >
            {product.title}
          </h1>

          {/* Price - Orange - Updates with quantity */}
          <div className="flex items-baseline gap-2 mb-3">
            <span 
              className="text-2xl font-bold"
              style={{ color: '#FF8C42' }}
            >
              {product.price}
            </span>
            {product.originalPrice && (
              <span 
                className="text-lg"
                style={{ color: '#6B7280', textDecoration: 'line-through' }}
              >
                {product.originalPrice}
              </span>
            )}
          </div>

          {/* Reviews - Orange Stars */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4"
                  style={{ 
                    color: '#FF8C42',
                    fill: i < 4 ? '#FF8C42' : 'none'
                  }}
                />
              ))}
            </div>
            <span 
              className="text-sm"
              style={{ color: '#6B7280' }}
            >
              4.5 from 100 review
            </span>
          </div>

          {/* Short Description - Grey */}
          <div className="mb-4">
            <h3 className="font-semibold mb-1" style={{ color: '#1A1A1A' }}>
              Why you should buy this.......
            </h3>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: '#6B7280' }}
            >
              {product.description}
            </p>
          </div>
        </div>

        {/* 5. Selectors (Variant & Quantity) */}
        <div className="w-full px-4 py-4 border-t border-gray-100">
          {/* Variants - Cards style */}
          <div className="mb-4">
            <Label 
              className="font-semibold mb-3 block"
              style={{ color: '#1A1A1A' }}
            >
              Select a Variant
            </Label>
            <div className="grid grid-cols-4 gap-2 w-full">
              {variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVariant(index)}
                  className="p-3 rounded-xl text-center transition-all"
                  style={{
                    backgroundColor: selectedVariant === index ? 'white' : '#F6F6F6',
                    border: selectedVariant === index ? '2px solid #FF8C42' : 'none',
                  }}
                >
                  <span 
                    className="text-xs font-medium"
                    style={{ color: '#1A1A1A' }}
                  >
                    {variant}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4 w-full">
            {/* Quantity Counter */}
            <div 
              className="flex items-center rounded-full overflow-hidden"
              style={{ border: '1px solid #E5E7EB' }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 transition-colors"
                style={{ backgroundColor: 'transparent' }}
              >
                -
              </button>
              <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 transition-colors"
                style={{ backgroundColor: 'transparent' }}
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center rounded-full h-12 transition-colors"
              style={{
                backgroundColor: '#FF8C42',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* 6. Trust/Delivery Strip - #FDF6F3 */}
        <div 
          className="w-full px-4 py-4 mx-4 rounded-xl"
          style={{ backgroundColor: '#FDF6F3' }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" style={{ color: '#FF8C42' }} />
              <span 
                className="text-sm"
                style={{ color: '#1A1A1A' }}
              >
                Delivery within 7days
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5" style={{ color: '#FF8C42' }} />
              <span 
                className="text-sm"
                style={{ color: '#1A1A1A' }}
              >
                Free Gift Wrap
              </span>
            </div>
          </div>
        </div>

        {/* 7. Make It Extra Special - Updated with detailed specifications */}
        <div className="w-full px-4 py-4">
          {/* Page Header */}
          <h3 
            className="font-semibold text-center mb-6"
            style={{ color: '#1A1A1A', fontSize: '18px' }}
          >
            Make It Extra Special
          </h3>

          {/* Section 1: Custom Message Card */}
          <div 
            className="rounded-xl mb-4 overflow-hidden w-full"
            style={{ 
              backgroundColor: 'white',
              border: '1px solid #E5E7EB'
            }}
          >
            {/* Header (Always Visible) */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setAddMessageCard(!addMessageCard)}
            >
              <div className="flex items-center gap-3">
                <PenLine className="h-5 w-5" style={{ color: '#FF8C42' }} />
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: '#1A1A1A', fontSize: '14px' }}
                  >
                    Add a custom message
                  </p>
                  <p 
                    className="text-xs"
                    style={{ color: '#6B7280' }}
                  >
                    Include a heartfelt message with your gift
                  </p>
                </div>
              </div>
              <Switch
                checked={addMessageCard}
                onCheckedChange={setAddMessageCard}
              />
            </div>

            {/* Expanded Content */}
            {addMessageCard && (
              <div 
                className="px-4 pb-4 pt-4"
                style={{ 
                  backgroundColor: 'white',
                  borderTop: '1px solid #E5E7EB',
                }}
              >
                <div 
                  className="rounded-lg p-4"
                  style={{ 
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB'
                  }}
                >
                  <Textarea
                    placeholder="Write your message here"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full min-h-[100px] resize-none border-0 bg-transparent"
                    style={{ 
                      fontSize: '14px',
                      color: '#1A1A1A'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Delivery Card */}
          <div 
            className="rounded-xl mb-4 overflow-hidden w-full"
            style={{ 
              backgroundColor: 'white',
              border: '1px solid #E5E7EB'
            }}
          >
            {/* Header (Always Visible) */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setSendDirectly(!sendDirectly)}
            >
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5" style={{ color: '#FF8C42' }} />
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: '#1A1A1A', fontSize: '14px' }}
                  >
                    Send Directly to Receiver
                  </p>
                  <p 
                    className="text-xs"
                    style={{ color: '#6B7280' }}
                  >
                    We'll ship it straight to their door
                  </p>
                </div>
              </div>
              <Switch
                checked={sendDirectly}
                onCheckedChange={setSendDirectly}
              />
            </div>

            {/* Expanded Content */}
            {sendDirectly && (
              <div 
                className="px-4 pb-4 space-y-4 pt-4"
                style={{ 
                  backgroundColor: 'white',
                  borderTop: '1px solid #E5E7EB',
                }}
              >
                {/* Recipient Name */}
                <div>
                  <Label 
                    className="text-xs font-medium mb-1 block"
                    style={{ color: '#1A1A1A' }}
                  >
                    Recipient Name
                  </Label>
                  <Input
                    placeholder="Enter recipient name"
                    className="h-10 rounded-lg"
                    style={{ 
                      backgroundColor: '#FBFBFB',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <Label 
                    className="text-xs font-medium mb-1 block"
                    style={{ color: '#1A1A1A' }}
                  >
                    Phone Number
                  </Label>
                  <Input
                    placeholder="Enter phone number"
                    className="h-10 rounded-lg"
                    style={{ 
                      backgroundColor: '#FBFBFB',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Delivery Address */}
                <div>
                  <Label 
                    className="text-xs font-medium mb-1 block"
                    style={{ color: '#1A1A1A' }}
                  >
                    Delivery Address
                  </Label>
                  <Textarea
                    placeholder="Enter address"
                    className="h-20 rounded-lg resize-none"
                    style={{ 
                      backgroundColor: '#FBFBFB',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Schedule Delivery Date - Date picker */}
                <div>
                  <Label 
                    className="text-xs font-medium mb-1 block"
                    style={{ color: '#1A1A1A' }}
                  >
                    Schedule Delivery Date (Optional)
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      className="h-10 rounded-lg pr-10"
                      style={{ 
                        backgroundColor: '#FBFBFB',
                        border: '1px solid #E5E7EB',
                        fontSize: '14px'
                      }}
                    />
                    <Calendar 
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
                      style={{ color: '#FF8C42' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Personalize Gift Card */}
          <div 
            className="rounded-xl mb-4 overflow-hidden w-full"
            style={{ 
              backgroundColor: 'white',
              border: '1px solid #E5E7EB'
            }}
          >
            {/* Header (Always Visible) */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setPersonalizeGift(!personalizeGift)}
            >
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5" style={{ color: '#FF8C42' }} />
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: '#1A1A1A', fontSize: '14px' }}
                  >
                    Personalize Gift
                  </p>
                  <p 
                    className="text-xs"
                    style={{ color: '#6B7280' }}
                  >
                    Add custom text or upload an image
                  </p>
                </div>
              </div>
              <Switch
                checked={personalizeGift}
                onCheckedChange={setPersonalizeGift}
              />
            </div>

            {/* Expanded Content */}
            {personalizeGift && (
              <div 
                className="px-4 pb-4 space-y-4 pt-4"
                style={{ 
                  backgroundColor: 'white',
                  borderTop: '1px solid #E5E7EB',
                }}
              >
                {/* Custom Text */}
                <div>
                  <Label 
                    className="text-xs font-medium mb-1 block"
                    style={{ color: '#1A1A1A' }}
                  >
                    Custom Text
                  </Label>
                  <Input
                    placeholder="Enter name, initials, or message"
                    className="h-10 rounded-lg"
                    style={{ 
                      backgroundColor: '#FBFBFB',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Upload Area */}
                <div 
                  className="rounded-xl p-6 text-center cursor-pointer"
                  style={{ 
                    backgroundColor: '#F9FAFB',
                    border: '1px dashed #E5E7EB'
                  }}
                >
                  <Upload 
                    className="h-8 w-8 mx-auto mb-2"
                    style={{ color: '#FF8C42' }}
                  />
                  <p 
                    className="text-sm font-medium"
                    style={{ color: '#FF8C42' }}
                  >
                    Click to upload image
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div 
            className="flex items-center justify-between mt-6 pt-4 w-full"
            style={{ borderTop: '1px solid #E5E7EB' }}
          >
            {/* Left: Continue Shopping - Navigate to products page */}
            <button 
              className="flex items-center gap-1"
              style={{ color: '#FF8C42', cursor: 'pointer' }}
              onClick={() => navigate("/products")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Continue Shopping</span>
            </button>

            {/* Right: Proceed to Checkout - Navigate to checkout page */}
            <button
              onClick={() => navigate("/checkout")}
              className="flex items-center justify-center rounded-full h-10 transition-colors"
              style={{
                backgroundColor: '#FF8C42',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                width: '180px',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 8. Product Details - #717182 */}
        <div className="w-full px-4 py-4">
          {/* Product Description */}
          <div className="mb-6">
            <h3 
              className="font-semibold mb-2"
              style={{ color: '#1A1A1A' }}
            >
              Product Description
            </h3>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: '#717182' }}
            >
              {product.description}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h3 
              className="font-semibold mb-3"
              style={{ color: '#1A1A1A' }}
            >
              Key Features
            </h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: '#717182' }}
                >
                  <span 
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: '#FF8C42' }}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 9. Ratings and Review */}
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="font-semibold"
              style={{ color: '#1A1A1A' }}
            >
              Ratings and Review
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4"
                    style={{ 
                      color: '#FF8C42',
                      fill: i < 4 ? '#FF8C42' : 'none'
                    }}
                  />
                ))}
              </div>
              <span 
                className="font-bold"
                style={{ color: '#1A1A1A' }}
              >
                4.5
              </span>
            </div>
          </div>

          {/* Rating Chart - Progress bars with varying widths */}
          <div className="space-y-2">
            {reviewsData.map((review) => (
              <div key={review.stars} className="flex items-center gap-2">
                <span 
                  className="text-sm w-8"
                  style={{ color: '#6B7280' }}
                >
                  {review.stars} ★
                </span>
                <div 
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: '#F3E3DD' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(review.count / maxCount) * 100}%`,
                      backgroundColor: '#FF8C42',
                    }}
                  />
                </div>
                <span 
                  className="text-sm w-8 text-right"
                  style={{ color: '#6B7280' }}
                >
                  {review.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 10. Comments List - #F6F6F6 background */}
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="font-semibold"
              style={{ color: '#1A1A1A' }}
            >
              Comments
            </h3>
            <button
              className="flex items-center gap-1 rounded-full px-4 h-8 text-sm transition-colors"
              style={{ 
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                color: '#1A1A1A'
              }}
            >
              Popularity
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Comment Items */}
          <div className="space-y-4">
            {mockComments.map((comment) => {
              const likeState = commentLikes[comment.id] || { likes: 40, liked: false, dislikes: 40, disliked: false };
              return (
                <div
                  className="rounded-xl p-4 w-full"
                  style={{ backgroundColor: '#F6F6F6' }}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#E5E7EB' }}
                    >
                      <span 
                        className="font-medium"
                        style={{ color: '#6B7280' }}
                      >
                        {comment.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="font-medium"
                          style={{ color: '#1A1A1A' }}
                        >
                          {comment.name}
                        </span>
                        <span 
                          className="text-xs"
                          style={{ color: '#717182' }}
                        >
                          {comment.date}
                        </span>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3"
                            style={{ 
                              color: '#FF8C42',
                              fill: i < comment.rating ? '#FF8C42' : 'none'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p 
                    className="text-sm mb-3"
                    style={{ color: '#717182' }}
                  >
                    {comment.text}
                  </p>
                  {/* Thumbs up/down - Bottom Right */}
                  <div className="flex items-center gap-4 justify-end">
                    <button 
                      className="flex items-center gap-1"
                      style={{ 
                        color: likeState.liked ? '#FF8C42' : '#6B7280',
                        fill: likeState.liked ? '#FF8C42' : 'none'
                      }}
                      onClick={() => handleLikeToggle(comment.id)}
                    >
                      <ThumbsUp 
                      className="h-4 w-4"
                      color={likeState.liked ? '#FF8C42' : '#FF8C42'}
                      fill={likeState.liked ? '#FF8C42' : 'none'}
                    />
                      <span className="text-sm">{likeState.likes}</span>
                    </button>
                    <button 
                      className="flex items-center gap-1"
                      style={{ 
                        color: likeState.disliked ? '#FF8C42' : '#6B7280',
                        fill: likeState.disliked ? '#FF8C42' : 'none'
                      }}
                      onClick={() => handleDislikeToggle(comment.id)}
                    >
                      <ThumbsDown 
                      className="h-4 w-4"
                      color={likeState.disliked ? '#FF8C42' : '#FF8C42'}
                      fill={likeState.disliked ? '#FF8C42' : 'none'}
                    />
                      <span className="text-sm">{likeState.dislikes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 11. Products you may also Love - Horizontal scroll */}
        <div className="w-full px-4 py-4">
          <h3 
            className="font-semibold mb-4"
            style={{ color: '#1A1A1A' }}
          >
            Products you may also Love
          </h3>

          {/* Horizontal Scroll */}
          <div 
            className="flex gap-3 overflow-x-auto pb-4 w-full"
            style={{ 
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {relatedProducts.slice(0, 5).map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.id}`}
                className="flex-shrink-0 w-40"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div 
                  className="rounded-xl aspect-square mb-2 overflow-hidden w-40"
                  style={{ backgroundColor: '#E5E7EB' }}
                >
                  <ImageWithFallback
                    src={relatedProduct.image}
                    alt={relatedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p 
                  className="text-sm font-medium line-clamp-2 mb-1 w-40"
                  style={{ color: '#1A1A1A' }}
                >
                  {relatedProduct.title}
                </p>
                <p 
                  className="text-sm font-bold"
                  style={{ color: '#FF8C42' }}
                >
                  {relatedProduct.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetailPage;
