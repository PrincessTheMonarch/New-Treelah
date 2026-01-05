import { ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router-dom";

interface Category {
  name: string;
  image: string;
  icon: LucideIcon;
  description?: string;
}

interface CategorySectionProps {
  title: string;
  subtitle?: string;
  categories: Category[];
  type?: "occasion" | "recipient";
}

export function CategorySection({ title, subtitle, categories, type = "occasion" }: CategorySectionProps) {
  const getCategoryLink = (categoryName: string) => {
    // Convert category name to URL-friendly format
    const urlName = categoryName.toLowerCase().replace(/\s+/g, "-");
    
    // If it's an occasion-based category, use occasion query param
    if (type === "occasion") {
      return `/products?occasion=${encodeURIComponent(categoryName)}`;
    }
    
    // Otherwise, try to match to a product category
    return `/products`;
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">{title}</h2>
          {subtitle && <p className="text-sm sm:text-base text-muted-foreground max-w-sm sm:max-w-md md:max-w-2xl mx-auto px-4">{subtitle}</p>}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 justify-items-center max-w-sm sm:max-w-md md:max-w-4xl mx-auto">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={index}
                to={getCategoryLink(category.name)}
                className="group relative overflow-hidden bg-accent hover:bg-accent/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block cursor-pointer w-full aspect-square max-w-[160px] sm:max-w-[180px] md:max-w-[200px]"
                style={{
                  borderRadius: '16px'
                }}
              >
                <div className="relative w-full h-full">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                    <Icon className={`h-8 w-8 mb-2 group-hover:scale-110 transition-transform ${type === "occasion" ? "h-6 w-6" : "h-8 w-8"}`} />
                    <h3 className={`text-center mb-1 ${type === "occasion" ? "text-xs" : "text-sm"}`}>{category.name}</h3>
                    {category.description && (
                      <p className={`text-white/80 text-center leading-tight ${type === "occasion" ? "text-xs" : "text-xs"}`}>{category.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>


      </div>
    </section>
  );
}

