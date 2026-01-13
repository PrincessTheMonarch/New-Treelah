import { ProductCard } from "./ProductCard";

interface Product {
  id: number;
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  tag?: string;
}

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  showRecipientBadge?: boolean;
}

export function FeaturedProducts({ title, subtitle, products, showRecipientBadge = false }: FeaturedProductsProps) {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-accent/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">{title}</h2>
          {subtitle && <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">{subtitle}</p>}
        </div>

        {/* Products Grid */}
        <div className={`grid gap-2 sm:gap-3 lg:gap-4 mx-auto justify-items-center max-w-[1200px] ${(title === "Trending Now" || title === "Staff Picks" || title === "Customizable Gifts") ? (title === "Staff Picks" ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-4") : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`} style={{ justifyContent: 'center' }}>
          {title === "Staff Picks" ? (
            // Show 8 placeholders
            Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="w-full max-w-[240px] aspect-square bg-gray-200 rounded-lg"></div>
            ))
          ) : (
            products.map((product) => {
              const { id, image, title: productTitle, price, originalPrice, badge, tag } = product;
              return (
                <div key={id}>
                  <ProductCard
                    id={id}
                    image={image}
                    title={productTitle}
                    price={price}
                    originalPrice={originalPrice}
                    badge={badge}
                    tag={tag}
                    showRecipientBadge={showRecipientBadge}
                    variant="default"
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
