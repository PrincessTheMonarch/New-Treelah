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
        backgroundColor: '#3B82F6',
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
          
          <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[60vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl sm:text-2xl">Find Your Perfect Gift</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Answer a few quick questions and we'll suggest the best gifts for your special someone!
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-4">
              {/* Recipient Gender */}
              <div className="space-y-3">
                <Label className="text-sm sm:text-base">Who's the gift for?</Label>
                <RadioGroup
                  value={formData.recipient}
                  onValueChange={(value) => setFormData({ ...formData, recipient: value })}
                >
                  <div className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer flex-1 text-sm sm:text-base">For Him</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer flex-1 text-sm sm:text-base">For Her</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer flex-1 text-sm sm:text-base">Anyone</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Relationship */}
              <div className="space-y-3">
                <Label htmlFor="relationship" className="text-sm sm:text-base">Relationship</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                >
                  <SelectTrigger id="relationship" className="h-10">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="colleague">Colleague</SelectItem>
                    <SelectItem value="boss">Boss</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Occasion */}
              <div className="space-y-3">
                <Label htmlFor="occasion" className="text-sm sm:text-base">Occasion</Label>
                <Select
                  value={formData.occasion}
                  onValueChange={(value) => setFormData({ ...formData, occasion: value })}
                >
                  <SelectTrigger id="occasion" className="h-10">
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="anniversary">Anniversary</SelectItem>
                    <SelectItem value="graduation">Graduation</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="justbecause">Just Because</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age Group */}
              <div className="space-y-3">
                <Label htmlFor="age" className="text-sm sm:text-base">Age Group</Label>
                <Select
                  value={formData.ageGroup}
                  onValueChange={(value) => setFormData({ ...formData, ageGroup: value })}
                >
                  <SelectTrigger id="age" className="h-10">
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="child">Child (0-12)</SelectItem>
                    <SelectItem value="teen">Teen (13-19)</SelectItem>
                    <SelectItem value="adult">Adult (20-59)</SelectItem>
                    <SelectItem value="senior">Senior (60+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full rounded-full h-12 text-base" size="lg">
                Find My Perfect Gift
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

