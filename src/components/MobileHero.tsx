import React from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * MobileHero Component
 * Implements the mobile-only hero section based on Figma design.
 * Features: Full-bleed background image, top search bar, and centered call-to-action.
 */
const MobileHero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[600px] flex flex-col items-center justify-start overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/landingPageImages/hero-mobile.jpg" 
          alt="Celebrating moments" 
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Top Search Bar (Positioned over hero) */}
      <div className="relative z-10 w-full px-4 mt-24 mb-auto">
        <div className="flex items-center w-full bg-white rounded-full px-4 py-3 shadow-md">
          <input 
            type="text" 
            placeholder="Search for the perfect gift" 
            className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
          <Search className="text-gray-400" size={20} />
        </div>
      </div>

      {/* Centered Hero Content */}
      <div className="relative z-10 flex flex-col items-center px-6 pb-20 text-center">
        
        {/* Sparkle Badge */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-yellow-300" size={16} />
          <span className="text-xs font-medium text-white/90 tracking-wide">
            Thoughtful Gifts, Delivered with Love
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-bold text-white leading-tight mb-4 drop-shadow-sm">
          Find the Perfect Gift <br /> for Every Occasion
        </h1>

        {/* Subtext */}
        <p className="text-sm text-white/90 leading-relaxed max-w-[300px] mb-8">
          From birthdays to weddings, surprise your loved ones. 
          We've got something special for everyone.
        </p>

        {/* CTA Button */}
        <Link to="/products">
          <button className="flex items-center gap-2 bg-[#FF8C42] text-white text-base font-semibold px-8 py-3.5 rounded-full shadow-lg active:scale-95 transition-transform">
            Shop Gifts
            <ArrowRight size={20} />
          </button>
        </Link>
      </div>
    </section>
  );
};

export default MobileHero;