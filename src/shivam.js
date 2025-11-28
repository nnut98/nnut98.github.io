import React, { useState, useEffect } from 'react';
import { Beer, Droplet, Wheat, Award, Zap, RefreshCw, ShoppingBag, X, User, Star, Utensils, LogIn, LogOut, Trash2, ChevronRight, MapPin, CreditCard, Check, LayoutGrid, Sun, Moon, Flower2, Sparkles, Citrus, Medal, Heart, Store, Dumbbell, Briefcase, Handshake, Truck } from 'lucide-react';

// --- CONFIGURATION ---
const NAVY = "#003A5D"; 
const ORANGE_SLIDER = "#EE7623"; 
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&display=swap";

// --- GEMINI API SETUP ---
const apiKey = ""; // System provides key at runtime

async function callGemini(prompt, isJson = false) {
  const getMockPairing = (text) => {
      const t = text.toLowerCase();
      if (t.includes('siam crisp')) return "Som Tum (Green Papaya Salad) with sticky rice.";
      if (t.includes('athletic+')) return "A post-workout protein bowl with fresh tropical fruits.";
      if (t.includes('mango')) return "Coconut sticky rice or spicy mango salad.";
      if (t.includes('lemongrass')) return "Tom Yum Goong (Spicy Shrimp Soup).";
      if (t.includes('cerveza')) return "Pad Krapow Moo Saap (Holy Basil Stir-fry).";
      if (t.includes('run wild')) return "Grilled chicken caesar salad with lemon dressing.";
      return "A hearty burger with swiss cheese and mushrooms.";
  };

  if (!apiKey || apiKey.trim() === "" || apiKey.includes("YOUR_API_KEY")) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return isJson ? JSON.stringify({ id: 'siam-crisp', reasoning: 'Siam Crisp is the perfect entry point.' }) : getMockPairing(prompt);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  if (isJson) payload.generationConfig = { responseMimeType: "application/json" };

  try {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Call Failed:", error);
    return isJson ? "{}" : getMockPairing(prompt);
  }
}

// --- BEER DATA ---
const BEER_DATA = [
  {
    id: 'siam-crisp',
    name: "Siam Crisp",
    style: "Light",
    tagline: "Jasmine Rice Lager",
    description: "The 'Hook' for the Thai market. Brewed with locally sourced Hom Mali (Jasmine) rice for that familiar, crisp finish Thai consumers love, but with zero alcohol.",
    intensity: { hops: 1, malt: 2, body: 1 },
    stats: { abv: "< 0.5%", calories: 40, carbs: "8g", ibu: 12 },
    notes: ["Rice", "Crisp", "Floral"],
    imageUrl: "https://athleticbrewing.com/cdn/shop/files/upside-usa_4f73bf57-c9fd-4191-9b17-7f071aaecaf1.png?v=1762439479&width=1206",
    colors: "from-yellow-200 to-amber-100",
    isMember: false,
    isLimited: true, 
    price: 390,
    isMockup: true
  },
  {
    id: 'athletic-plus',
    name: "Athletic+ Series",
    style: "Functional",
    tagline: "Collagen & Electrolytes",
    description: "The 'Differentiator'. A functional non-alcoholic beer designed for the health-obsessed. Infused with electrolytes for hydration and collagen for beauty/wellness.",
    intensity: { hops: 2, malt: 1, body: 2 },
    stats: { abv: "< 0.5%", calories: 90, carbs: "12g", ibu: 15 },
    notes: ["Functional", "Vitamin B", "Collagen"],
    imageUrl: "https://athleticbrewing.com/cdn/shop/files/main-pdp-image_1c8705ba-2e0f-430d-b8e5-193c462c8c60.png?v=1762439849&width=1206",
    colors: "from-teal-400 to-emerald-300",
    isMember: true,
    isLimited: true,
    price: 550,
    isMockup: true
  },
  {
    id: 'mango-sticky',
    name: "Mango Sticky Ale",
    style: "Fruit",
    tagline: "Thai Dessert Inspired",
    description: "A lush, creamy ale inspired by Thailand's most famous dessert. Bursting with ripe mango sweetness and a hint of coconut creaminess, balanced by a light hop finish.",
    intensity: { hops: 2, malt: 2, body: 4 },
    stats: { abv: "< 0.5%", calories: 110, carbs: "22g", ibu: 10 },
    notes: ["Mango", "Coconut", "Sweet"],
    imageUrl: "https://athleticbrewing.com/cdn/shop/files/main-pdp-image_275ba9d0-774e-47d2-a95a-8c7275f60020.png?v=1762439951&width=1206",
    colors: "from-orange-300 to-yellow-300",
    isMember: false,
    isLimited: true,
    price: 450,
    isMockup: true
  },
  {
    id: 'lemongrass-wit',
    name: "Lemongrass Wit",
    style: "Light",
    tagline: "Zesty Thai Botanicals",
    description: "A Belgian-style Witbier reimagined with fresh Thai lemongrass and kaffir lime leaves. incredibly aromatic and refreshing, designed to pair perfectly with spicy Thai salads.",
    intensity: { hops: 2, malt: 2, body: 2 },
    stats: { abv: "< 0.5%", calories: 65, carbs: "12g", ibu: 18 },
    notes: ["Lemongrass", "Citrus", "Spice"],
    imageUrl: "https://athleticbrewing.com/cdn/shop/files/USA_Seasonal_WP_12oz_Standard_071723.png?v=1762439673&width=1206",
    colors: "from-lime-200 to-green-100",
    isMember: false,
    isLimited: false,
    price: 420,
    isMockup: true
  },
  {
    id: 'run-wild',
    name: "Run Wild IPA",
    style: "IPA",
    tagline: "The ultimate sessionable IPA",
    description: "The 'Anchor' Product. Run Wild is the ultimate sessionable IPA for craft beer lovers. Brewed with a blend of five Northwest hops, it has an approachable bitterness.",
    intensity: { hops: 4, malt: 3, body: 3 },
    stats: { abv: "< 0.5%", calories: 65, carbs: "14g", ibu: 35 },
    notes: ["IPA", "Hoppy", "Pine"],
    imageUrl: "https://athleticbrewing.com/cdn/shop/files/run-wild-ipa.png?v=1762439481&width=1206",
    colors: "from-blue-700 to-blue-900",
    isMember: false,
    isLimited: false,
    price: 450 
  },
  {
    id: 'cerveza',
    name: "Cerveza Atletica",
    style: "Light",
    tagline: "Mexican-style Copper",
    description: "A refreshing Mexican-style copper lager. Its clean, crisp profile makes it the ultimate companion for spicy Thai dishes like Pad Krapow.",
    intensity: { hops: 2, malt: 3, body: 3 },
    stats: { abv: "< 0.5%", calories: 60, carbs: "12g", ibu: 15 },
    notes: ["Copper", "Bread", "Malt"],
    imageUrl: "https://athleticbrewing.com/cdn/shop/files/main-pdp-image_5.png?v=1762439484&width=1206",
    colors: "from-amber-600 to-orange-700",
    isMember: false,
    isLimited: false,
    price: 450
  },
  {
    id: 'free-wave',
    name: "Free Wave Hazy IPA",
    style: "IPA",
    tagline: "Hazy, juicy, hoppy",
    description: "Free Wave is a hugely hoppy hazy IPA with a juicy body and velvety pour. A trio of Amarillo, Citra and Mosaic hops generate bodacious aromatics.",
    intensity: { hops: 5, malt: 2, body: 4 },
    stats: { abv: "< 0.5%", calories: 70, carbs: "16g", ibu: 55 },
    notes: ["IPA", "Citrus", "Hoppy"],
    imageUrl: "https://athleticbrewing.com/cdn/shop/products/free-wave_9238bc1a-3bf5-4b94-b6fa-560611203b5a.png?v=1762439485&width=1206", 
    colors: "from-orange-500 to-red-500",
    isMember: false,
    isLimited: false,
    price: 480
  },
  {
    id: 'all-out',
    name: "All Out Extra Dark",
    style: "Dark",
    tagline: "Smooth & soul warming",
    description: "Inspired by days on the slopes and nights by the fire, All Out is a delightfully smooth and soul-warming stout. Each sip delivers a silky, full-bodied mouthfeel.",
    intensity: { hops: 2, malt: 5, body: 5 },
    stats: { abv: "< 0.5%", calories: 90, carbs: "18g", ibu: 10 },
    notes: ["Dark", "Coffee", "Malt"],
    imageUrl: "https://athleticbrewing.com/cdn/shop/files/all-out-usa.png?v=1762439484&width=1206",
    colors: "from-neutral-900 to-slate-800",
    isMember: false,
    isLimited: false,
    price: 480
  },
];

const findMatch = (preferences) => {
  const { hops, malt, body, style } = preferences;
  let candidates = BEER_DATA;
  if (style !== 'All') {
      if (style === 'Functional') {
          candidates = BEER_DATA.filter(b => b.style === 'Functional');
      } else {
          candidates = BEER_DATA.filter(b => b.style === style);
      }
  }
  if (candidates.length === 0) candidates = BEER_DATA;
  const scoredBeers = candidates.map(beer => {
    const hopDiff = Math.abs(hops - beer.intensity.hops);
    const maltDiff = Math.abs(malt - beer.intensity.malt);
    const bodyDiff = Math.abs(body - beer.intensity.body);
    let score = hopDiff + maltDiff + bodyDiff;
    if (style === 'IPA') score += hopDiff * 0.5;
    if (style === 'Dark') score += maltDiff * 0.5;
    return { ...beer, score };
  });
  scoredBeers.sort((a, b) => a.score - b.score);
  return scoredBeers[0];
};

const getRandomBeer = () => BEER_DATA[Math.floor(Math.random() * BEER_DATA.length)];

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
};


// --- COMPONENTS ---

const Banner = ({ onClose }) => (
    <div className="bg-[#ebd923] text-[#003A5D] px-4 py-2 text-center text-xs font-bold tracking-wide relative z-[60]">
        <span>🎉 Get 25% OFF on orders above ฿500! </span>
        <span className="opacity-75 font-medium ml-2 hidden sm:inline">Use code: ATHLETIC25</span>
        <button onClick={onClose} className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-black/5 rounded-full">
            <X size={14} />
        </button>
    </div>
);

const Slider = ({ label, value, onChange, icon: Icon, colorClass }) => {
  const percentage = ((value - 1) / 4) * 100;
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <label className={`flex items-center text-sm font-bold tracking-wide ${colorClass}`}>
          {Icon && <Icon size={18} className="mr-2" />}
          {label}
        </label>
      </div>
      <div className="relative h-2 bg-slate-200 rounded-full">
          <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${percentage}%`, backgroundColor: ORANGE_SLIDER }}></div>
          <input type="range" min={1} max={5} value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <div className="absolute top-1/2 w-4 h-4 bg-white border-2 rounded-full shadow transition-all duration-300 ease-out pointer-events-none z-20" style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)', borderColor: ORANGE_SLIDER }}></div>
      </div>
    </div>
  );
};

const BeerCarousel = ({ beers, onSelect, selectedId }) => (
  <div className="mt-8 border-t border-slate-100 pt-6">
    <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Explore the Lineup</h3>
        <span className="text-[10px] text-slate-300 font-medium">Scroll for more →</span>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
      {beers.map((b) => (
        <button
          key={b.id}
          onClick={() => onSelect(b)}
          className={`flex-shrink-0 w-24 flex flex-col items-center gap-2 snap-start transition-all group ${selectedId === b.id ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'}`}
        >
          <div className={`w-20 h-24 rounded-xl flex items-center justify-center bg-slate-50 border transition-all relative overflow-hidden ${selectedId === b.id ? 'border-[#003A5D] bg-white shadow-md ring-2 ring-[#003A5D]/10' : 'border-slate-100 group-hover:border-slate-200'}`}>
             {/* Strategy Highlight */}
             {b.id === 'siam-crisp' && <div className="absolute top-0 left-0 w-full bg-[#ebd923] text-[#003A5D] text-[8px] font-bold text-center py-0.5">NEW</div>}
             {b.id === 'athletic-plus' && <div className="absolute top-0 left-0 w-full bg-teal-400 text-white text-[8px] font-bold text-center py-0.5">PLUS</div>}
             
             <img src={b.imageUrl} alt={b.name} className="w-12 h-auto object-contain" />
          </div>
          <span className={`text-[10px] font-bold text-center leading-tight line-clamp-2 w-full transition-colors ${selectedId === b.id ? 'text-[#003A5D]' : 'text-slate-400'}`}>
              {b.name}
          </span>
        </button>
      ))}
    </div>
  </div>
);

// --- NEW STRATEGY 2 WIDGET ---
const SponsorshipWidget = () => (
    <div className="bg-[#003A5D] rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl group h-full">
        <div className="absolute top-0 right-0 p-8 bg-[#EE7623] rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
        
        <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#EE7623] p-1.5 rounded-lg">
                    <Medal className="text-white" size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Fueling Thailand</h3>
            </div>
            
            <div className="space-y-6 flex-grow">
                <div>
                    <p className="text-[10px] text-slate-300 font-bold uppercase mb-3 border-b border-white/10 pb-2">Official Celebration Partner</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-bold bg-white/10 px-3 py-2 rounded-lg border border-white/10 whitespace-nowrap flex items-center gap-2">
                            <span className="text-lg">🏃‍♂️</span> Bangsaen 42
                        </span>
                        <span className="text-xs font-bold bg-white/10 px-3 py-2 rounded-lg border border-white/10 whitespace-nowrap flex items-center gap-2">
                            <span className="text-lg">🏊</span> Laguna Phuket
                        </span>
                        <span className="text-xs font-bold bg-white/10 px-3 py-2 rounded-lg border border-white/10 whitespace-nowrap flex items-center gap-2">
                            <span className="text-lg">🏙️</span> Amazing Thailand
                        </span>
                    </div>
                </div>
                
                <div>
                    <p className="text-[10px] text-slate-300 font-bold uppercase mb-3 border-b border-white/10 pb-2">Proud Sponsor Of</p>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                             <div className="flex -space-x-3">
                                {/* Using reliable Unsplash images */}
                                <img 
                                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=150&q=80" 
                                    alt="Elite Athlete" 
                                    className="w-10 h-10 rounded-full border-2 border-[#003A5D] object-cover"
                                />
                                <img 
                                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80" 
                                    alt="Muay Thai" 
                                    className="w-10 h-10 rounded-full border-2 border-[#003A5D] object-cover"
                                />
                                <img 
                                    src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=150&q=80" 
                                    alt="Coach" 
                                    className="w-10 h-10 rounded-full border-2 border-[#003A5D] object-cover"
                                />
                            </div>
                            <span className="text-xs font-bold text-[#EE7623]">+12 More</span>
                        </div>
                        <p className="text-sm font-bold leading-tight">Elite Thai Athletes <span className="text-slate-400 font-normal">& Fitness Coaches</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- BRAND BOX COMPONENT (Robust fallback for logos) ---
const BrandLogo = ({ name, url, colorClass, textColorClass }) => {
    const [error, setError] = useState(false);
    
    if (error) {
        // Fallback: Styled Brand Box
        return (
            <div className={`w-full h-full min-h-[1.5rem] ${colorClass} rounded flex items-center justify-center`}>
                <span className={`text-[8px] font-extrabold ${textColorClass} uppercase tracking-wider text-center leading-none px-1`}>
                    {name}
                </span>
            </div>
        );
    }

    return (
        <img 
            src={url} 
            alt={name} 
            className="h-6 w-auto object-contain mix-blend-multiply opacity-100 hover:scale-105 transition-transform" 
            onError={() => setError(true)}
        />
    );
};

const OfflineAvailabilityWidget = () => (
    <div className="bg-[#003A5D] rounded-[2rem] p-6 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#003A5D] group h-full">
        {/* Decorative background */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full opacity-50 blur-2xl"></div>
        
        <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-white/10 p-1.5 rounded-lg border border-white/10">
                    <MapPin className="text-[#EE7623]" size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Where to Find Us</h3>
            </div>
            
            <div className="space-y-6 flex-grow">
                <div>
                    <p className="text-[10px] text-slate-300 font-bold uppercase mb-3 flex items-center gap-1 border-b border-white/10 pb-2"><Store size={12} /> Premium Retail</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2 rounded-lg border border-slate-100 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <BrandLogo 
                                name="Gourmet Market" 
                                url="https://logo.clearbit.com/gourmetmarketthailand.com" 
                                colorClass="bg-black" 
                                textColorClass="text-white"
                            />
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-100 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <BrandLogo 
                                name="Villa Market" 
                                url="https://logo.clearbit.com/villamarket.com"
                                colorClass="bg-lime-500" 
                                textColorClass="text-[#003A5D]"
                            />
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-100 flex items-center justify-center shadow-sm col-span-2 hover:shadow-md transition-shadow">
                            <BrandLogo 
                                name="Tops Fine Food" 
                                url="https://logo.clearbit.com/tops.co.th" 
                                colorClass="bg-red-600" 
                                textColorClass="text-white"
                            />
                        </div>
                    </div>
                </div>
                
                <div>
                    <p className="text-[10px] text-slate-300 font-bold uppercase mb-3 flex items-center gap-1 border-b border-white/10 pb-2"><Dumbbell size={12} /> Exclusive Venues</p>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white p-2 rounded-lg border border-slate-100 flex flex-col items-center justify-center shadow-sm text-center hover:shadow-md transition-shadow">
                            <BrandLogo 
                                name="Virgin Active" 
                                url="https://logo.clearbit.com/virginactive.co.th" 
                                colorClass="bg-red-500"
                                textColorClass="text-white"
                            />
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-100 flex flex-col items-center justify-center shadow-sm text-center hover:shadow-md transition-shadow">
                            <BrandLogo 
                                name="Thai Country Club" 
                                url="https://logo.clearbit.com/thaicountryclub.com" 
                                colorClass="bg-green-700"
                                textColorClass="text-white"
                            />
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-100 flex flex-col items-center justify-center shadow-sm text-center hover:shadow-md transition-shadow">
                            <BrandLogo 
                                name="WeWork" 
                                url="https://logo.clearbit.com/wework.com" 
                                colorClass="bg-black"
                                textColorClass="text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const StrategicAllianceWidget = () => (
    <div className="bg-[#003A5D] rounded-[2rem] p-6 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#003A5D] group h-full">
        {/* Decorative background */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full opacity-50 blur-2xl"></div>
        
        <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-white/10 p-1.5 rounded-lg shadow-sm border border-white/10">
                    <Handshake className="text-[#EE7623]" size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Strategic Import Alliance</h3>
            </div>
            
            <div className="space-y-6 flex-grow">
                <div>
                    <p className="text-[10px] text-slate-300 font-bold uppercase mb-3 flex items-center gap-1 border-b border-white/10 pb-2"><Truck size={12} /> Craft Distributors</p>
                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">Partnering with specialized experts to ensure cold chain integrity and FDA compliance.</p>
                    <div className="grid grid-cols-1 gap-2">
                        {/* Beervana */}
                        <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group/item">
                            <div className="flex items-center gap-3">
                                <BrandLogo 
                                    name="Beervana" 
                                    url="https://logo.clearbit.com/beervana.asia"
                                    colorClass="bg-orange-500"
                                    textColorClass="text-white"
                                />
                                <span className="text-xs font-bold text-[#003A5D]">Beervana</span>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] text-orange-600 font-bold opacity-0 group-hover/item:opacity-100 transition-opacity">→</div>
                        </div>
                        
                        {/* Smiling Mad Dog */}
                        <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group/item">
                            <div className="flex items-center gap-3">
                                <BrandLogo 
                                    name="Smiling Mad Dog" 
                                    url="https://logo.clearbit.com/smilingmaddog.com"
                                    colorClass="bg-blue-600"
                                    textColorClass="text-white"
                                />
                                <span className="text-xs font-bold text-[#003A5D]">Smiling Mad Dog</span>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-600 font-bold opacity-0 group-hover/item:opacity-100 transition-opacity">→</div>
                        </div>

                        {/* Wishbeer */}
                        <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group/item">
                            <div className="flex items-center gap-3">
                                <BrandLogo 
                                    name="Wishbeer" 
                                    url="https://logo.clearbit.com/wishbeer.com"
                                    colorClass="bg-yellow-400"
                                    textColorClass="text-[#003A5D]"
                                />
                                <span className="text-xs font-bold text-[#003A5D]">Wishbeer</span>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-[10px] text-yellow-600 font-bold opacity-0 group-hover/item:opacity-100 transition-opacity">→</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const CanImage = ({ beer }) => {
    return (
      <div className="w-40 md:w-56 mx-auto relative z-10 filter drop-shadow-2xl transition-transform duration-500 hover:scale-105 group">
         <div className="relative">
            <img src={beer.imageUrl} alt={beer.name} className="w-full h-auto object-contain relative z-10" />
         </div>
      </div>
    );
};

// --- CART & CHECKOUT COMPONENTS ---

const CartDrawer = ({ isOpen, onClose, cart, updateQuantity, removeItem, openCheckout }) => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = total > 500 ? total * 0.25 : 0;
    const finalTotal = total - discount;

    return (
        <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 z-[70] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#003A5D] text-white">
                    <h2 className="text-xl font-bold font-['Barlow']">Shopping Cart ({cart.length})</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="text-center text-slate-400 mt-10">
                            <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex gap-4 items-center animate-fade-in">
                                <div className="w-16 h-20 bg-slate-50 rounded-lg p-2 flex items-center justify-center shrink-0">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#003A5D] text-sm">{item.name}</h3>
                                    <p className="text-xs text-slate-400">6-Pack • ฿{item.price}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200">-</button>
                                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200">+</button>
                                    </div>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 bg-slate-50 border-t border-slate-100">
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="font-bold text-[#003A5D]">฿{total.toLocaleString()}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm text-[#EE7623]">
                                    <span className="flex items-center gap-1"><Zap size={12} fill="currentColor" /> Discount (25%)</span>
                                    <span className="font-bold">-฿{discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-extrabold pt-2 border-t border-slate-200">
                                <span className="text-[#003A5D]">Total</span>
                                <span className="text-[#003A5D]">฿{finalTotal.toLocaleString()}</span>
                            </div>
                        </div>
                        <button 
                            onClick={openCheckout}
                            className="w-full py-4 bg-[#ebd923] hover:bg-[#d4c31f] text-[#003a5d] font-extrabold rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/10"
                        >
                            Checkout <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const CheckoutModal = ({ isOpen, onClose, cartItems, onSubmitOrder }) => {
    if (!isOpen) return null;
    
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = total > 500 ? total * 0.25 : 0;
    const finalTotal = total - discount;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmitOrder();
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 bg-[#003A5D] text-white flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold font-['Barlow']">Secure Checkout</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
                </div>
                
                <div className="overflow-y-auto p-8">
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Section 1: Contact */}
                        <div>
                            <h3 className="text-[#003A5D] font-bold text-lg mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#E6F4F9] flex items-center justify-center text-[#003A5D]"><User size={16} /></div>
                                Contact Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                                    <input required type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#003A5D] outline-none text-[#003A5D] font-bold" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                                    <input required type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#003A5D] outline-none text-[#003A5D] font-bold" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
                                    <input required type="tel" placeholder="+66 81 234 5678" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#003A5D] outline-none text-[#003A5D] font-bold" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Address */}
                        <div>
                            <h3 className="text-[#003A5D] font-bold text-lg mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#E6F4F9] flex items-center justify-center text-[#003A5D]"><MapPin size={16} /></div>
                                Shipping Address
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Address Line 1</label>
                                    <input required type="text" placeholder="123 Sukhumvit Road" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#003A5D] outline-none text-[#003A5D] font-bold" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase">City</label>
                                        <input required type="text" placeholder="Bangkok" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#003A5D] outline-none text-[#003A5D] font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Postal Code</label>
                                        <input required type="text" placeholder="10110" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#003A5D] outline-none text-[#003A5D] font-bold" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Section 3: Payment Mock */}
                        <div>
                            <h3 className="text-[#003A5D] font-bold text-lg mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#E6F4F9] flex items-center justify-center text-[#003A5D]"><CreditCard size={16} /></div>
                                Payment
                            </h3>
                            <div className="p-4 rounded-xl border border-[#003A5D] bg-[#F5F8FA] flex items-center gap-3">
                                <input type="radio" checked readOnly className="accent-[#003A5D] w-5 h-5" />
                                <span className="font-bold text-[#003A5D]">Credit / Debit Card</span>
                                <div className="ml-auto flex gap-1">
                                   <div className="w-8 h-5 bg-slate-300 rounded"></div>
                                   <div className="w-8 h-5 bg-slate-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
                    <div className="flex justify-between items-center mb-4">
                         <span className="text-slate-500 font-bold">Total to Pay</span>
                         <span className="text-2xl font-extrabold text-[#003A5D]">฿{finalTotal.toLocaleString()}</span>
                    </div>
                    <button type="submit" form="checkout-form" className="w-full py-4 bg-[#003A5D] hover:bg-[#002a44] text-white font-extrabold rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg">
                        Confirm Order
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function App() {
  // Global State
  const [preferences, setPreferences] = useState({ hops: 3, malt: 3, body: 3, style: 'All' });
  const [beer, setBeer] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); 

  // Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // AI Pairing State
  const [pairingLoading, setPairingLoading] = useState(false);
  const [pairingSuggestion, setPairingSuggestion] = useState(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = FONT_LINK;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    // Initialize with the new strategy product to highlight it
    setBeer(BEER_DATA[0]);
  }, []);

  // --- Handlers ---
  const handleLogin = () => {
      setTimeout(() => { setIsLoggedIn(true); setUser({ name: "Shivam" }); }, 500);
  };
  const handleLogout = () => { setIsLoggedIn(false); setUser(null); };

  const handleStyleChange = (newStyle) => {
    // 1. Update Style
    const newPreferences = { ...preferences, style: newStyle };

    // 2. Preset Sliders based on Style
    switch (newStyle) {
        case 'IPA':
            newPreferences.hops = 5;
            newPreferences.malt = 3;
            newPreferences.body = 3;
            break;
        case 'Light':
            newPreferences.hops = 2;
            newPreferences.malt = 2;
            newPreferences.body = 1;
            break;
        case 'Dark':
            newPreferences.hops = 2;
            newPreferences.malt = 5;
            newPreferences.body = 4;
            break;
        case 'Functional':
            newPreferences.hops = 2;
            newPreferences.malt = 2;
            newPreferences.body = 2;
            break;
        default: // All
            newPreferences.hops = 3;
            newPreferences.malt = 3;
            newPreferences.body = 3;
            break;
    }
    
    setPreferences(newPreferences);
  };

  const handleFindMatch = () => {
    setIsAnimating(true);
    setPairingSuggestion(null); 
    setTimeout(() => {
      const match = findMatch(preferences);
      setBeer(match);
      setIsAnimating(false);
    }, 600);
  };

  const handleRandom = () => {
      setIsAnimating(true);
      setPairingSuggestion(null);
      setTimeout(() => {
          const randomBeer = getRandomBeer();
          setBeer(randomBeer);
          setPreferences({ style: 'All', hops: randomBeer.intensity.hops, malt: randomBeer.intensity.malt, body: randomBeer.intensity.body });
          setIsAnimating(false);
      }, 600);
  }

  // Handle selection from Carousel: Updates beer AND sets preference sliders
  const handleBeerSelect = (selectedBeer) => {
      setBeer(selectedBeer);
      setPairingSuggestion(null);
      // Reverse Sync: Update sliders to match the selected beer's profile
      setPreferences({
          style: 'All', // Reset style filter to 'All'
          hops: selectedBeer.intensity.hops,
          malt: selectedBeer.intensity.malt,
          body: selectedBeer.intensity.body
      });
  };

  const handleGetPairing = async () => {
      if (!beer) return;
      setPairingLoading(true);
      const prompt = `Suggest one specific food pairing for ${beer.name}. concise (under 20 words).`;
      const result = await callGemini(prompt, false);
      setPairingSuggestion(result);
      setPairingLoading(false);
  };

  // --- CART HANDLERS ---
  const addToCart = (beerItem) => {
      setCart(prev => {
          const existing = prev.find(item => item.id === beerItem.id);
          if (existing) {
              return prev.map(item => item.id === beerItem.id ? { ...item, quantity: item.quantity + 1 } : item);
          }
          return [...prev, { ...beerItem, quantity: 1 }];
      });
      setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
      setCart(prev => prev.map(item => {
          if (item.id === id) {
              const newQty = Math.max(0, item.quantity + delta);
              return { ...item, quantity: newQty };
          }
          return item;
      }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
      setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckoutSubmit = () => {
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setCart([]);
      setOrderComplete(true);
      setTimeout(() => setOrderComplete(false), 5000); // Hide success message after 5s
  };

  // --- STYLES CONFIG FOR FILTER ---
  // Added "Functional" style for the new strategy
  const STYLES_CONFIG = [
      { id: 'All', label: 'All Brews', icon: LayoutGrid },
      { id: 'IPA', label: 'IPA Series', icon: Flower2 },
      { id: 'Light', label: 'Light Brews', icon: Sun },
      { id: 'Functional', label: 'Athletic+', icon: Sparkles }, // New Category
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FA] text-slate-900 flex flex-col font-['Barlow'] relative overflow-x-hidden">
      
      {/* Modals & Drawers */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        updateQuantity={updateQuantity}
        removeItem={removeFromCart}
        openCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
      />
      
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        cartItems={cart} 
        onSubmitOrder={handleCheckoutSubmit}
      />
      
      {/* Success Notification */}
      {orderComplete && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#003A5D] text-white px-8 py-4 rounded-full shadow-2xl z-[90] flex items-center gap-3 animate-fade-in-up">
              <div className="bg-[#ebd923] text-[#003A5D] rounded-full p-1"><Check size={20} /></div>
              <span className="font-bold">Order Confirmed! Check your email.</span>
          </div>
      )}

      {showBanner && <Banner onClose={() => setShowBanner(false)} />}

      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#A2D9E7]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#ebd923]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-100 transition-[top] duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://athleticbrewing.com/cdn/shop/files/secondary-logo.svg?v=1724884429&width=300" alt="Athletic Brewing Co" className="h-10 w-auto" />
          </div>
          <div className="flex items-center gap-4">
             
             {/* Cart Button */}
             <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors text-[#003A5D]"
             >
                 <ShoppingBag size={20} />
                 {cart.length > 0 && (
                     <span className="absolute -top-1 -right-1 bg-[#EE7623] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                         {cart.reduce((acc, i) => acc + i.quantity, 0)}
                     </span>
                 )}
             </button>

             {isLoggedIn ? (
                 <div className="flex items-center gap-3 animate-fade-in">
                     <div className="hidden md:flex flex-col items-end">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{getGreeting()}</span>
                         <span className="text-[#003A5D] font-bold text-sm leading-none">{user.name}</span>
                     </div>
                     <div className="h-8 w-8 bg-[#E6F4F9] rounded-full flex items-center justify-center text-[#003A5D] border border-[#003A5D]/10">
                         <User size={16} />
                     </div>
                     <button onClick={handleLogout} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                         <LogOut size={16} />
                     </button>
                 </div>
             ) : (
                 <button 
                    onClick={handleLogin}
                    className="flex items-center gap-2 text-xs font-bold text-white bg-[#003A5D] px-4 py-2 rounded-full hover:bg-[#002a44] transition-colors"
                 >
                     <LogIn size={14} />
                     Login
                 </button>
             )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-8 grid lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* LEFT COLUMN: CONTROLS */}
        <div className="lg:col-span-4 space-y-6 animate-fade-in-up">
          <div className="bg-white/90 backdrop-blur rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden p-8">
             <div className="animate-fade-in">
                 <div className="flex items-center gap-3 mb-6">
                     <div className="bg-[#E6F4F9] p-2 rounded-full">
                        <ShoppingBag className="text-[#003A5D]" size={20} />
                     </div>
                     <h2 className="text-[#003A5D] font-bold text-lg">Find your flavor</h2>
                 </div>

                {/* UPDATED Style Selector */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Style</label>
                        <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded-full font-bold">{preferences.style}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {STYLES_CONFIG.map((style) => {
                        const Icon = style.icon;
                        const isActive = preferences.style === style.id;
                        return (
                            <button
                                key={style.id}
                                onClick={() => handleStyleChange(style.id)}
                                className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 border-2 ${
                                    isActive
                                        ? 'border-[#003A5D] bg-[#003A5D] text-white shadow-xl scale-105'
                                        : 'border-slate-100 bg-white text-slate-400 hover:border-[#003A5D] hover:text-[#003A5D] hover:shadow-md'
                                }`}
                            >
                                <div className={`mb-2 p-2 rounded-full transition-colors ${isActive ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-[#E6F4F9]'}`}>
                                    <Icon size={20} className={isActive ? 'text-[#ebd923]' : 'text-slate-400 group-hover:text-[#003A5D]'} />
                                </div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wide">{style.label}</span>
                                {isActive && <div className="absolute inset-0 rounded-2xl ring-2 ring-[#ebd923]/50 animate-pulse pointer-events-none"></div>}
                            </button>
                        );
                    })}
                    </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 mb-4 block uppercase tracking-wider">Adjust intensity</label>
                    <Slider label="Hops & Bitterness" icon={Beer} value={preferences.hops} onChange={(v) => setPreferences({...preferences, hops: v})} colorClass="text-[#003A5D]" />
                    <Slider label="Malt & Roast" icon={Wheat} value={preferences.malt} onChange={(v) => setPreferences({...preferences, malt: v})} colorClass="text-[#003A5D]" />
                    <Slider label="Body & Mouthfeel" icon={Droplet} value={preferences.body} onChange={(v) => setPreferences({...preferences, body: v})} colorClass="text-[#003A5D]" />
                </div>

                 {/* Manual Actions */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                    <button onClick={handleRandom} className="col-span-1 py-4 bg-white hover:bg-slate-50 text-[#003A5D] font-bold rounded-full border border-slate-200 shadow-sm transition-all text-base flex flex-row items-center justify-center gap-2 group h-full">
                        <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500 text-[#003A5D]" />
                    </button>
                    <button onClick={handleFindMatch} disabled={isAnimating} className="col-span-2 py-4 bg-[#ebd923] hover:bg-[#d4c31f] text-[#003a5d] font-extrabold rounded-full shadow-lg shadow-yellow-400/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base">
                        {isAnimating ? <RefreshCw className="animate-spin" /> : <Zap fill="currentColor" size={20} />}
                        Match my taste
                    </button>
                </div>

                {/* SLIDESHOW (Carousel) */}
                <BeerCarousel 
                    beers={BEER_DATA} 
                    onSelect={handleBeerSelect} 
                    selectedId={beer ? beer.id : null}
                />
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center relative min-h-[500px]">
            {isAnimating && (
              <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-md flex items-center justify-center rounded-[2.5rem]">
                <div className="flex flex-col items-center animate-bounce">
                    <div className="bg-[#003A5D] p-4 rounded-full mb-4 shadow-xl"><Award className="text-[#ebd923]" size={32} /></div>
                    <span className="font-bold text-[#003A5D] tracking-wide text-sm">Scouting brews...</span>
                </div>
              </div>
            )}

            {beer && (
              <div className="w-full grid md:grid-cols-2 gap-0 bg-white rounded-[2.5rem] shadow-[0_20px_40px_rgb(0,0,0,0.08)] overflow-hidden border border-white transform transition-all duration-500 hover:shadow-[0_25px_50px_rgb(0,0,0,0.12)]">
                
                {/* Product Image Section */}
                <div className="relative bg-[#F8F9FB] h-[400px] md:h-auto flex items-center justify-center p-8 overflow-hidden group">
                     {/* Immersive Background */}
                     <div className="absolute inset-0 z-0 opacity-20 transform scale-150 blur-xl" style={{ backgroundImage: `url(${beer.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(40px) saturate(200%)' }}></div>
                     <div className={`absolute w-96 h-96 rounded-full bg-gradient-to-tr ${beer.colors} opacity-20 blur-3xl transform group-hover:scale-110 transition-transform duration-700 z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}></div>
                     
                     <CanImage beer={beer} />

                     <div className="absolute top-6 left-6 flex flex-row flex-wrap gap-2 z-20">
                        {beer.isMember && <div className="bg-[#003A5D] text-white px-4 py-1.5 rounded-full text-[10px] font-normal tracking-wide shadow-lg w-fit flex items-center gap-1"><Star size={10} fill="currentColor" /> Members Only</div>}
                        {beer.isLimited && <div className="bg-[#EE7623] text-white px-4 py-1.5 rounded-full text-[10px] font-normal tracking-wide shadow-lg w-fit">Limited</div>}
                     </div>
                </div>

                {/* Details Section */}
                <div className="p-8 md:p-10 flex flex-col justify-between relative bg-white/50 backdrop-blur-sm">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-slate-400 border-b-2 border-[#ebd923] pb-1 uppercase tracking-wider">{beer.style}</span>
                        {beer.stats.ibu > 40 && <span className="text-[10px] font-bold text-[#003A5D] bg-[#A2D9E7] px-3 py-1 rounded-full">Hoppy</span>}
                    </div>
                    <div className="flex justify-between items-start">
                        <h2 className="text-4xl font-extrabold text-[#003A5D] leading-[0.9] mb-2">{beer.name}</h2>
                        <div className="text-right">
                             <p className="text-[#003A5D] font-bold text-xl">฿{beer.price}</p>
                             <p className="text-xs text-slate-400">per 6-pack</p>
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wide">{beer.tagline}</h3>
                    
                    <div className="mb-6">
                        {!pairingSuggestion ? (
                            <button onClick={handleGetPairing} disabled={pairingLoading} className="text-xs font-bold text-[#EE7623] hover:text-[#d56a1f] flex items-center gap-1 transition-colors disabled:opacity-50">
                                {pairingLoading ? <RefreshCw className="animate-spin" size={12} /> : <Utensils size={12} />} ✨ Get Chef's Pairing
                            </button>
                        ) : (
                            <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex items-start gap-2 animate-fade-in">
                                <Utensils size={14} className="text-[#EE7623] mt-0.5 shrink-0" />
                                <p className="text-xs font-bold text-[#003A5D] leading-relaxed">{pairingSuggestion}</p>
                            </div>
                        )}
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">{beer.description}</p>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cal</div>
                            <div className="text-lg font-extrabold text-[#003A5D]">{beer.stats.calories}</div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Carb</div>
                            <div className="text-lg font-extrabold text-[#003A5D]">{beer.stats.carbs}</div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ABV</div>
                            <div className="text-lg font-extrabold text-[#003A5D]">{beer.stats.abv}</div>
                        </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => addToCart(beer)}
                    className="w-full py-4 bg-[#ebd923] hover:bg-[#d4c31f] text-[#003a5d] font-extrabold rounded-full transition-colors flex items-center justify-center gap-2 group shadow-lg shadow-yellow-400/10 text-base"
                  >
                      <ShoppingBag size={18} className="group-hover:animate-bounce" />
                      Add to cart
                  </button>

                </div>
              </div>
            )}
        </div>
      </main>

      {/* New Bottom Section */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 pb-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
         <SponsorshipWidget />
         <OfflineAvailabilityWidget />
         <StrategicAllianceWidget />
      </section>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto relative z-10">
         <div className="max-w-4xl mx-auto text-center"><p className="text-[10px] text-slate-400 tracking-widest font-bold uppercase">Designed for Athletic Brewing Co Fans • <span className="text-[#003A5D]">Fit for all times</span></p></div>
      </footer>
    </div>
  );
}