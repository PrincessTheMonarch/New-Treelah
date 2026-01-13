import React from 'react';
import { Search, ShoppingCart, Heart, Headphones, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * DesktopHeader Component
 * Implements a transparent, overlay-style desktop header based on the Figma design.
 * Designed for wide screens with inline navigation and integrated search.
 */
const DesktopHeader: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 z-50 flex w-full items-center justify-between px-20 py-5 bg-transparent text-white">
      {/* Brand Section */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-tighter">Logo</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight">Product Name</span>
          <span className="text-xs font-light opacity-80">Tag line</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex items-center gap-8 ml-10">
        <button className="flex items-center gap-1 text-sm font-medium hover:opacity-70 transition-opacity">
          Categories <ChevronDown size={16} />
        </button>
        <a href="#" className="text-sm font-medium hover:opacity-70 transition-opacity">
          Souvenirs & Bulk Orders
        </a>
      </nav>

      {/* Action Controls */}
      <div className="flex items-center gap-6 flex-1 justify-end">
        {/* Shopping Assistant CTA */}
        <button className="flex items-center gap-2 bg-[#FF8C42] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-[#e67e3b] transition-colors shrink-0">
          <span className="text-lg"></span>
          Shopping Assistant
        </button>

        {/* Integrated Search Bar */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search for the perfect gift"
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-2 px-5 pr-10 text-sm placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]/50"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
        </div>

        {/* Utility Icons */}
        <div className="flex items-center gap-5">
          <button className="hover:text-[#FF8C42] transition-colors" aria-label="Cart">
            <ShoppingCart size={22} />
          </button>
          <button className="hover:text-[#FF8C42] transition-colors" aria-label="Wishlist">
            <Heart size={22} />
          </button>
          <button className="hover:text-[#FF8C42] transition-colors" aria-label="Support">
            <Headphones size={22} />
          </button>
          <button className="hover:text-[#FF8C42] transition-colors" aria-label="Account">
            <User size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;