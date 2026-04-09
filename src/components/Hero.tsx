import { FormEvent } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    // <section
    //   className="relative w-full max-w-full overflow-hidden"
    //   style={{
    //     backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/Landing Page Images/PerfectGift.png')`,
    //     backgroundSize: 'auto 100%',
    //     backgroundPosition: 'center center',
    //     backgroundRepeat: 'no-repeat',
    //     backgroundAttachment: 'scroll',
    //     minHeight: '100vh'
    //   }}
    // >
    //   {/* Hero Content - Centered Layout */}
    //   <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24 min-h-screen flex items-center justify-center max-w-full">
    //     <div className="flex flex-col items-center justify-center text-white text-center w-full max-w-xl">
    //       {/* Thoughtful Gifts Section */}
    //       <div
    //         className="flex items-center justify-center gap-3 mb-4"
    //       >
    //         <Sparkles className="h-4 w-4 text-white flex-shrink-0" />
    //         <span
    //           className="text-white"
    //           style={{
    //             fontFamily: 'Poppins, sans-serif',
    //             fontWeight: '400',
    //             fontStyle: 'normal',
    //             fontSize: '16px',
    //             lineHeight: '160%',
    //             letterSpacing: '0%',
    //             verticalAlign: 'middle'
    //           }}
    //         >
    //           Thoughtful Gifts, Delivered with Love
    //         </span>
    //       </div>

    //       <h1
    //         className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4"
    //         style={{
    //           fontFamily: 'Poppins, sans-serif',
    //           fontWeight: '500',
    //           fontStyle: 'normal',
    //           lineHeight: '120%',
    //           letterSpacing: '0%',
    //           verticalAlign: 'middle',
    //           margin: 0
    //         }}
    //       >
    //         Find the Perfect Gift for Every Occasion
    //       </h1>

    //       <p
    //         className="text-white text-sm sm:text-base mb-6 max-w-xl mx-auto opacity-90 px-4"
    //         style={{
    //           fontFamily: 'Poppins, sans-serif',
    //           fontWeight: '400',
    //           fontStyle: 'normal',
    //           lineHeight: '160%',
    //           letterSpacing: '0%',
    //           verticalAlign: 'middle',
    //           margin: 0
    //         }}
    //       >
    //         From birthdays to weddings, surprise moments to 'just because', we've got something special for everyone.
    //       </p>

    //       {/* Shop Gifts Button */}
    //       <Button
    //         asChild
    //         className="hover:opacity-90 transition-opacity"
    //         style={{
    //           width: '160px',
    //           height: '40px',
    //           gap: '8px',
    //           backgroundColor: '#FF8C42',
    //           color: 'white',
    //           borderRadius: '24px',
    //           fontWeight: '600',
    //           border: 'none',
    //           boxShadow: '0 4px 14px rgba(255, 140, 66, 0.4)',
    //           margin: 0
    //         }}
    //       >
    //         <Link to="/products">
    //           Shop Gifts →
    //         </Link>
    //       </Button>
    //     </div>
    //   </div>
    // </section>
    <section className="relative w-full" style={{ height: "85vh" }}>
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="max-w-2xl flex flex-col items-center text-center">
          {/* <div className="w-fit inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md mb-6">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-main">Coming Soon !</span>
          </div> */}

          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider my-4">
            Find the Perfect Gift for Every Occasion
          </h1>

          <p className="text-white text-base md:text-lg max-w-xl my-6">
            From birthdays to weddings, surprises to "just because," we've got
            something special for everyone.
          </p>

          <Button
            className="w-64 h-11 px-4 rounded-full gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
            asChild
          >
            <Link to="/products">
              Shop Gifts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
