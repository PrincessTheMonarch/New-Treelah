import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sparkles, ChevronDown } from "lucide-react";

export function GiftFinder() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  
  // Check if we should auto-open the dialog
  useEffect(() => {
    if (searchParams.get("openGiftFinder") === "true") {
      setOpen(true);
      // Clean up the URL parameter
      searchParams.delete("openGiftFinder");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const [formData, setFormData] = useState({
    recipient: "",
    relationship: "",
    occasion: "",
    ageGroup: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Build URL parameters based on form data
    const params = new URLSearchParams();
    
    // Add tag based on recipient
    if (formData.recipient === "male") {
      params.append("tag", "For Him");
    } else if (formData.recipient === "female") {
      params.append("tag", "For Her");
    }
    
    // Add occasion
    if (formData.occasion) {
      // Capitalize first letter
      const occasionFormatted = formData.occasion.charAt(0).toUpperCase() + formData.occasion.slice(1);
      params.append("occasion", occasionFormatted);
    }
    
    // Add gift finder flag to show restart button
    params.append("fromGiftFinder", "true");
    
    // Store additional criteria in params for display
    if (formData.relationship) {
      params.append("relationship", formData.relationship);
    }
    if (formData.ageGroup) {
      params.append("ageGroup", formData.ageGroup);
    }
    
    setOpen(false);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <section
      className="text-white relative overflow-hidden"
      style={{
        backgroundColor: '#6FC2E4',
        width: '100%',
        minHeight: '148px',
        paddingTop: '24px',
        paddingRight: '20px',
        paddingBottom: '24px',
        paddingLeft: '20px'
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white blur-2xl" />
        <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full bg-white blur-2xl" />
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="flex flex-col items-center justify-center text-white">
            <h2 className="text-lg sm:text-xl md:text-2xl mb-2">Not sure what to get?</h2>
            <p className="text-sm sm:text-base mb-4 max-w-xl mx-auto opacity-90 px-4">
              Let's help you find the perfect gift, tell us about the receiver!
            </p>
            <DialogTrigger asChild>
              <div
                className="flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  height: '40px',
                  paddingRight: '16px',
                  paddingLeft: '16px',
                  gap: '8px',
                  borderRadius: '24px',
                  backgroundColor: '#FFFFFF',
                  border: 'none',
                  boxShadow: 'none'
                }}
              >
                <span
                  className="text-white whitespace-nowrap"
                  style={{
                    color: '#FF8C42',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  Get Started with Shopping Assistant
                </span>
                <Sparkles className="h-3 w-3 flex-shrink-0" style={{ color: '#FF8C42' }} />
              </div>
            </DialogTrigger>
          </div>
          
          <DialogContent
            style={{
              width: '750px',
              height: '500px',
              gap: '30px',
              borderRadius: '24px',
              padding: '30px',
              backgroundColor: 'white',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              overflow: 'auto'
            }}
          >
            {/* Modal Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  fontFamily: 'Inter, Public Sans, sans-serif',
                  color: '#111827',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.02em'
                }}
              >
                Find Your Perfect Gift
              </h2>
              <p 
                style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: '0',
                  lineHeight: '1.5'
                }}
              >
                Answer a few quick questions and we'll suggest the best gifts for your special someone!
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Section 1: Who is the gift for */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label 
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Who is the gift for
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, recipient: "male" })}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '9999px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: formData.recipient === "male" ? '#FF8C42' : 'white',
                      color: formData.recipient === "male" ? 'white' : '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: formData.recipient === "male" ? '0 4px 6px rgba(255, 140, 66, 0.3)' : 'none'
                    }}
                  >
                    For Him
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, recipient: "female" })}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '9999px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: formData.recipient === "female" ? '#FF8C42' : 'white',
                      color: formData.recipient === "female" ? 'white' : '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: formData.recipient === "female" ? '0 4px 6px rgba(255, 140, 66, 0.3)' : 'none'
                    }}
                  >
                    For Her
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, recipient: "other" })}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '9999px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: formData.recipient === "other" ? '#FF8C42' : 'white',
                      color: formData.recipient === "other" ? 'white' : '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: formData.recipient === "other" ? '0 4px 6px rgba(255, 140, 66, 0.3)' : 'none'
                    }}
                  >
                    Anyone
                  </button>
                </div>
              </div>

              {/* Section 2: Relationship */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label 
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Relationship
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px',
                      color: '#374151',
                      backgroundColor: 'white',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="" disabled selected>Select Relationship</option>
                    <option value="friend">Friend</option>
                    <option value="partner">Partner</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="colleague">Colleague</option>
                    <option value="boss">Boss</option>
                  </select>
                  <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                    <ChevronDown size={20} color="#9CA3AF" />
                  </div>
                </div>
              </div>

              {/* Section 3: Occasion */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label 
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Occasion
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px',
                      color: '#374151',
                      backgroundColor: 'white',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="" disabled selected>Select Occasion</option>
                    <option value="birthday">Birthday</option>
                    <option value="wedding">Wedding</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="graduation">Graduation</option>
                    <option value="promotion">Promotion</option>
                    <option value="justbecause">Just Because</option>
                  </select>
                  <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                    <ChevronDown size={20} color="#9CA3AF" />
                  </div>
                </div>
              </div>

              {/* Section 4: Age Group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label 
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Age Group
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px',
                      color: '#374151',
                      backgroundColor: 'white',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="" disabled selected>Select Age Group</option>
                    <option value="child">Child (0-12)</option>
                    <option value="teen">Teen (13-19)</option>
                    <option value="adult">Adult (20-59)</option>
                    <option value="senior">Senior (60+)</option>
                  </select>
                  <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                    <ChevronDown size={20} color="#9CA3AF" />
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  height: '56px',
                  borderRadius: '9999px',
                  backgroundColor: '#FF8C42',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 24px',
                  transition: 'background-color 0.2s ease',
                  boxShadow: '0 4px 6px rgba(255, 140, 66, 0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF7020'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF8C42'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Find Gift
                  <Sparkles className="h-4 w-4" style={{ color: 'white' }} />
                </span>
              </button>
            </form>

            <style>
              {`
                @keyframes sparkle {
                  0%, 100% { opacity: 0; transform: scale(0); }
                  50% { opacity: 1; transform: scale(1); }
                }
              `}
            </style>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
