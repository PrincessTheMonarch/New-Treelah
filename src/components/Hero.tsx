import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section 
      className="relative w-full max-w-full overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/Landing Page Images/PerfectGift.png')`,
        backgroundSize: 'auto 100%',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        minHeight: '100vh'
      }}
    >
      {/* Hero Content - Mobile First Layout */}
      <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24 min-h-screen flex items-center max-w-full">
        <div className="w-full max-w-2xl ml-0 md:ml-8 lg:ml-16">
          {/* Main Content Container - Fits within 342x261 */}
          <div 
            className="flex flex-col items-center text-center"
            style={{
              width: '342px',
              height: '261px',
              gap: '16px',
              angle: '0 deg',
              opacity: 1
            }}
          >
            {/* Thoughtful Gifts Section - First */}
            <div 
              className="flex items-center justify-center gap-4"
              style={{
                gap: '16px'
              }}
            >
              <Sparkles className="h-4 w-4 text-white flex-shrink-0" />
              <span 
                className="text-white"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '400',
                  fontStyle: 'normal',
                  fontSize: '16px',
                  lineHeight: '160%',
                  letterSpacing: '0%',
                  verticalAlign: 'middle'
                }}
              >
                Thoughtful Gifts, Delivered with Love
              </span>
            </div>

            <h1 
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500',
                fontStyle: 'normal',
                lineHeight: '120%',
                letterSpacing: '0%',
                verticalAlign: 'middle',
                margin: 0
              }}
            >
              Find the Perfect Gift for Every Occasion
            </h1>
            
            <p 
              className="text-white text-base leading-relaxed"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '400',
                fontStyle: 'normal',
                lineHeight: '160%',
                letterSpacing: '0%',
                verticalAlign: 'middle',
                margin: 0
              }}
            >
              From birthdays to weddings, surprise moments to 'just because', we've got something special for everyone.
            </p>
            
            {/* Shop Gifts Button - Centered but maintains original width */}
            <div className="flex justify-center w-full">
              <Button 
                size="lg" 
                asChild
                className="hover:opacity-90 transition-opacity"
                style={{
                  width: '160px',
                  height: '40px',
                  gap: '8px',
                  backgroundColor: '#FF8C42',
                  color: 'white',
                  borderRadius: '24px',
                  fontWeight: '600',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(255, 140, 66, 0.4)',
                  margin: 0
                }}
              >
                <Link to="/products">
                  Shop Gifts →
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


