import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * DesktopHero Component
 * Implements the desktop-only hero section based on the Figma design.
 * Features: Full-bleed background, left-aligned typography, and high-impact visual hierarchy.
 */
const DesktopHero: React.FC = () => {
  return (
    <section className="relative w-full h-[800px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/landingPageImages/hero-desktop.jpg" 
          alt="Gift giving moments" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full px-20 grid grid-cols-2">
        <div className="flex flex-col items-start text-left max-w-2xl">
          
          {/* Sparkle Badge */}
          <div className="flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20">
            <Sparkles className="text-yellow-300 fill-yellow-300" size={16} />
            <span className="text-sm font-medium text-white tracking-wide">
              Thoughtful Gifts, Delivered with Love
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl font-bold text-white leading-[1.1] mb-6 drop-shadow-lg">
            Find the Perfect Gift <br />
            <span className="text-[#FF8C42]">for Every Occasion</span>
          </h1>

          {/* Subtext Paragraph */}
          <p className="text-lg text-gray-200 leading-relaxed mb-10 max-w-lg">
            From birthdays to weddings, surprise your loved ones with something special. 
            Our curated collection makes gifting effortless and memorable.
          </p>

          {/* Primary CTA Button */}
          <Link to="/products">
            <button className="group flex items-center gap-3 bg-[#FF8C42] text-white text-lg font-semibold px-8 py-4 rounded-full shadow-xl hover:bg-[#e67e3b] transition-all transform hover:-translate-y-1">
              Shop Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </Link>

          {/* Social Proof / Trust Indicators (Optional but implied by layout space) */}
          <div className="mt-12 flex items-center gap-4 text-sm text-white/60">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-400 border-2 border-black" />
              ))}
            </div>
            <span>Trusted by 10,000+ happy gifters</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesktopHero;