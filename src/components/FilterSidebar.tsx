import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Star } from "lucide-react";

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceChange: (value: [number, number]) => void;
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  selectedOccasions: string[];
  onOccasionChange: (occasion: string) => void;
  selectedRatings: number[];
  onRatingChange: (rating: number) => void;
  selectedAvailability: string[];
  onAvailabilityChange: (availability: string) => void;
  selectedDeliveryTime: string[];
  onDeliveryTimeChange: (time: string) => void;
}

export function FilterSidebar({
  priceRange,
  onPriceChange,
  selectedCategories,
  onCategoryChange,
  selectedOccasions,
  onOccasionChange,
  selectedRatings,
  onRatingChange,
  selectedAvailability,
  onAvailabilityChange,
  selectedDeliveryTime,
  onDeliveryTimeChange,
}: FilterSidebarProps) {
  const categories = [
    "Toys & Games",
    "Home & Living",
    "Fashion & Accessories",
    "Beauty & Wellness",
    "Food & Beverages",
    "Tech & Gadgets",
    "Books & Stationery",
  ];

  const occasions = [
    "Birthdays",
    "Weddings",
    "Anniversaries",
    "Baby Showers",
    "Graduations",
    "Corporate Events",
  ];

  const availabilityOptions = ["In Stock", "Pre-Order", "Limited Stock"];
  const deliveryTimeOptions = ["Same Day", "Next Day", "2-3 Days", "1 Week"];

  // Common filter item style
  const filterItemStyle = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    verticalAlign: 'middle',
    color: '#0A0A0A',
  };

  // Header label style
  const headerLabelStyle = {
    color: '#717182',
  };

  return (
    <div style={{ paddingRight: '24px' }}>
      <div>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '16px',
          color: '#1A1A1A'
        }}>Filters</h3>
      </div>

      {/* Item Type (formerly Category) */}
      <div style={{ marginBottom: '24px' }}>
        <Label style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: 500,
          ...headerLabelStyle
        }}>Item Type</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map((category) => (
            <div key={category} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => onCategoryChange(category)}
                className="border-[#E5E7EB] data-[state=checked]:bg-[#FF8C42] data-[state=checked]:border-[#FF8C42] data-[state=checked]:text-white cursor-pointer w-[18px] h-[18px]"
              />
              <label
                htmlFor={`category-${category}`}
                style={{
                  cursor: 'pointer',
                  ...filterItemStyle
                }}
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator style={{ marginBottom: '24px' }} />

      {/* Occasion */}
      <div style={{ marginBottom: '24px' }}>
        <Label style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: 500,
          ...headerLabelStyle
        }}>Occasion</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {occasions.map((occasion) => (
            <div key={occasion} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Checkbox
                id={`occasion-${occasion}`}
                checked={selectedOccasions.includes(occasion)}
                onCheckedChange={() => onOccasionChange(occasion)}
                className="border-[#E5E7EB] data-[state=checked]:bg-[#FF8C42] data-[state=checked]:border-[#FF8C42] data-[state=checked]:text-white cursor-pointer w-[18px] h-[18px]"
              />
              <label
                htmlFor={`occasion-${occasion}`}
                style={{
                  cursor: 'pointer',
                  ...filterItemStyle
                }}
              >
                {occasion}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator style={{ marginBottom: '24px' }} />

      {/* Rating */}
      <div style={{ marginBottom: '24px' }}>
        <Label style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: 500,
          ...headerLabelStyle
        }}>Rating</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Checkbox
                id={`rating-${rating}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={() => onRatingChange(rating)}
                className="border-[#E5E7EB] data-[state=checked]:bg-[#FF8C42] data-[state=checked]:border-[#FF8C42] data-[state=checked]:text-white cursor-pointer w-[18px] h-[18px]"
              />
              <label
                htmlFor={`rating-${rating}`}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  ...filterItemStyle
                }}
              >
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} size={14} fill="#FF8C42" color="#FF8C42" />
                ))}
                <span style={{ marginLeft: '4px' }}>& Up</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator style={{ marginBottom: '24px' }} />

      {/* Availability */}
      <div style={{ marginBottom: '24px' }}>
        <Label style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: 500,
          ...headerLabelStyle
        }}>Availability</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {availabilityOptions.map((availability) => (
            <div key={availability} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Checkbox
                id={`availability-${availability}`}
                checked={selectedAvailability.includes(availability)}
                onCheckedChange={() => onAvailabilityChange(availability)}
                className="border-[#E5E7EB] data-[state=checked]:bg-[#FF8C42] data-[state=checked]:border-[#FF8C42] data-[state=checked]:text-white cursor-pointer w-[18px] h-[18px]"
              />
              <label
                htmlFor={`availability-${availability}`}
                style={{
                  cursor: 'pointer',
                  ...filterItemStyle
                }}
              >
                {availability}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator style={{ marginBottom: '24px' }} />

      {/* Delivery Time */}
      <div>
        <Label style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: 500,
          ...headerLabelStyle
        }}>Delivery Time</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {deliveryTimeOptions.map((time) => (
            <div key={time} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Checkbox
                id={`delivery-${time}`}
                checked={selectedDeliveryTime.includes(time)}
                onCheckedChange={() => onDeliveryTimeChange(time)}
                className="border-[#E5E7EB] data-[state=checked]:bg-[#FF8C42] data-[state=checked]:border-[#FF8C42] data-[state=checked]:text-white cursor-pointer w-[18px] h-[18px]"
              />
              <label
                htmlFor={`delivery-${time}`}
                style={{
                  cursor: 'pointer',
                  ...filterItemStyle
                }}
              >
                {time}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;