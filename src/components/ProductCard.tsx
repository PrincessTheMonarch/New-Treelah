import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  tag?: string;
  category?: string;
  showRecipientBadge?: boolean;
}

export function ProductCard({ id, image, title, price, originalPrice, badge, tag, category, showRecipientBadge = false }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const recipientBadge = (tag === "For Him" || tag === "For Her") ? tag : null;
  
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      title,
      price: parseFloat(price.replace("$", "")),
      image,
      category: category || "General",
    });
    toast.success(`${title} added to cart!`);
  };

  return (
    <Link to={`/product/${id}`}>
      <div
        className="group relative overflow-hidden bg-accent hover:bg-accent/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block cursor-pointer w-full aspect-square max-w-[160px] sm:max-w-[180px] md:max-w-[200px]"
        style={{ borderRadius: "16px" }}
      >
        <div className="relative w-full h-full">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full h-8 w-8 sm:h-9 sm:w-9 bg-white/90 hover:bg-white shadow-md"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {showRecipientBadge && recipientBadge && (
            <div
              className="absolute top-2 left-2 flex items-center justify-center z-30"
              style={{
                paddingTop: "4px",
                paddingBottom: "4px",
                paddingLeft: "10px",
                paddingRight: "10px",
                borderRadius: "24px",
                backgroundColor: "#6FC2E4",
              }}
            >
              <span className="text-white text-[10px] font-medium">{recipientBadge}</span>
            </div>
          )}

          {badge && !recipientBadge && (
            <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-primary text-white border-0 shadow-md text-xs z-30">
              {badge}
            </Badge>
          )}

          <div className="absolute bottom-0 left-0 right-0">
            <div className="p-2 sm:p-3 pb-0">
              <h3 className="text-white text-[11px] font-medium mb-0.5 truncate">{title}</h3>
              <div className="flex items-center gap-1">
                <span className="text-white text-[11px] font-semibold">{price}</span>
                {originalPrice && (
                  <span className="text-white/70 text-[10px] line-through">{originalPrice}</span>
                )}
              </div>
            </div>
            
            <div className="p-2 sm:p-3 pt-1">
              <Button
                className="w-full rounded-full gap-1 text-xs"
                size="sm"
                onClick={handleAddToCart}
                style={{ height: "32px", backgroundColor: "#FF8C42", border: "none" }}
              >
                <ShoppingCart className="h-3 w-3" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
