import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CoffeeItem, CartItem, CoffeeCustomization } from './types';
import { COFFEE_MENU } from './data/menu';
import GothicEclipse from './components/GothicEclipse';
import TasteMatchmaker from './components/TasteMatchmaker';
import CupCustomizer from './components/CupCustomizer';
import MenuSection from './components/MenuSection';
import BookingSection from './components/BookingSection';
import CartDrawer from './components/CartDrawer';

// Beautiful Lucide Icons
import { 
  Moon, Sun, Compass, ShoppingBag, Eye, Calendar, Sparkles, Clock, Globe, ShieldAlert,
  ArrowRight, Phone, MapPin, Instagram, Facebook, X, Star, Layers, Activity, Heart, Quote,
  Coffee
} from 'lucide-react';

export default function App() {
  // Application layouts states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CoffeeItem | null>(null);
  const [alignmentPct, setAlignmentPct] = useState(0.15); // Starts partially eclipsed
  const [unlockedSecret, setUnlockedSecret] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor total scroll distance to dynamically blur the premium sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync perfect alignment to unlock secret items
  const handleEclipseStateChange = (pct: number) => {
    setAlignmentPct(pct);
    if (pct > 0.94) {
      setUnlockedSecret(true);
    }
  };

  // Add standard coffee item to cart
  const handleAddToCart = (item: CoffeeItem) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(ci => ci.coffee.id === item.id && !ci.customization);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      }
      return [...prev, { coffee: item, quantity: 1 }];
    });
    // Shake shopping bag button
    setCartOpen(true);
  };

  // Add customized brew to cart
  const handleAddCustomBrew = (customBrew: {
    name: string;
    price: number;
    description: string;
    customization: CoffeeCustomization;
    image: string;
  }) => {
    const itemAsCoffee: CoffeeItem = {
      id: `custom-${Date.now()}`,
      name: customBrew.name,
      category: 'eclipse-signature',
      description: customBrew.description,
      price: customBrew.price,
      image: customBrew.image,
      intensity: 3,
      sweetness: customBrew.customization.sweetener !== 'None' ? 3 : 1,
      temperature: customBrew.customization.tempAdjust === 'over-ice' ? 'cold' : 'hot'
    };

    setCartItems(prev => [
      ...prev,
      {
        coffee: itemAsCoffee,
        quantity: 1,
        customization: customBrew.customization
      }
    ]);

    setCartOpen(true);
  };

  // Edit quantities in drawer
  const handleUpdateQty = (index: number, delta: number) => {
    setCartItems(prev => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index].quantity = newQty;
      }
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Pre-load a few handpicked bestseller items to showcase on the top bento cards
  const bestsellers = COFFEE_MENU.filter(i => ['s1', 'e1', 'c1', 'p1'].includes(i.id));

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-amber-500/20 selection:text-amber-300 antialiased overflow-x-hidden relative" id="cafe-eclipse-root">
      
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#2a1a0a] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[15%] right-[-10%] w-[50vw] h-[50vw] bg-[#1a0a2a] rounded-full blur-[150px] opacity-35 pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[35vw] h-[35vw] bg-[#1d140e] rounded-full blur-[130px] opacity-30 pointer-events-none" />


      {/* TOP ANNOUNCEMENT BAR (Mystic Clock & Phase info) */}
      <div className="bg-zinc-950/90 border-b border-zinc-900/60 py-2.5 px-4 text-center font-mono text-[10px] tracking-[0.25em] text-zinc-500 flex flex-wrap justify-between items-center z-40 relative gap-2 sm:gap-4">
        <div className="flex items-center gap-1 mx-auto sm:mx-0">
          <Activity className="w-3.5 h-3.5 text-amber-500/80" /> NOX HOUR: 3:00 PM — 3:00 AM • ACTIVE
        </div>
        <div className="mx-auto sm:mx-0 text-amber-500 font-bold flex items-center gap-1">
          {unlockedSecret ? (
            <span className="animate-pulse">● SOLAR ALIGNMENT CONGRUENCE: 100% UNLOCKED</span>
          ) : (
            <span>● PARTIAL SOLAR ALIGNMENT PHASE: {Math.round(alignmentPct * 100)}%</span>
          )}
        </div>
        <div className="hidden md:flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-zinc-600" /> COORDINATES: 45.42° N, 75.69° W
        </div>
      </div>

      {/* NAVIGATION HEADER */}
      <header className={`sticky top-0 w-full z-45 transition-all duration-300 ${
        scrolled 
          ? 'bg-zinc-950/85 backdrop-blur-md border-b border-zinc-900/80 py-3.5 shadow-2xl' 
          : 'bg-transparent py-5 border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
          
          {/* Logo Name */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center overflow-hidden shadow-lg group-hover:border-amber-500/50 transition">
              {/* Spinning Eclipse Icon */}
              <div className="absolute inset-0 bg-radial-[circle,rgba(245,158,11,0.25)_30%,transparent_70%] animate-pulse" />
              <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 relative z-10 flex items-center justify-center">
                <Sun className="w-3 h-3 text-amber-500/80 animate-spin" style={{ animationDuration: '40s' }} />
              </div>
            </div>
            <div>
              <span className="font-serif text-white text-base md:text-lg font-bold tracking-[0.2em] group-hover:text-amber-400 transition">
                Café Éclipse
              </span>
              <span className="text-[9px] font-mono tracking-[0.3em] text-zinc-500 block uppercase">
                Gothic Coffehouse
              </span>
            </div>
          </a>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-8 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400">
            <a href="#oracle" className="hover:text-amber-500 transition">Oracle Match</a>
            <a href="#alchemy" className="hover:text-amber-500 transition">Alchemy Lab</a>
            <a href="#main-menu" className="hover:text-amber-500 transition">Alchemical Catalog</a>
            <a href="#seance-booking" className="hover:text-amber-500 transition"> Séance Booking</a>
            <a href="#our-philosophy" className="hover:text-amber-500 transition">Philosophies</a>
          </nav>

          {/* Right actions: Seance reservation button and Cart */}
          <div className="flex items-center gap-3">
            <a 
              href="#seance-booking" 
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-zinc-900 bg-zinc-950/60 hover:border-zinc-800 text-zinc-300 hover:text-white font-mono text-[10px] uppercase tracking-wider rounded-lg transition"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> Book Table
            </a>

            <button
              id="shopping-cart-trigger"
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-amber-500 hover:border-amber-500/20 transition-all cursor-pointer flex items-center justify-center shadow-lg"
              title="Open order drawer"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-zinc-950 font-mono font-bold text-[9px] rounded-full flex items-center justify-center animate-bounce shadow">
                  {cartItems.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* HERO BANNER SECTION */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-zinc-950">
        
        {/* Cinematic Underworld Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="/src/assets/images/gothic_coffee_hero_1779371613503.png" 
            alt="Cafe Eclipse Gothic Ambient Interior"
            className="w-full h-full object-cover scale-102"
            referrerPolicy="no-referrer"
          />
          {/* Shadows overlays layering */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/90 to-black/30" />
          <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_20%,#030303_100%]" />
        </div>

        {/* Hero Interactive Canvas Contents */}
        <div className="max-w-5xl mx-auto px-4 text-center z-10 py-12 flex flex-col items-center">
          
          {/* Animated Slogan Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-zinc-950/80 border border-zinc-900 px-4 py-2 rounded-full mb-6 shadow-2xl backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '5s' }} />
            <span className="text-[10px] font-mono tracking-[0.3em] font-medium text-amber-500 uppercase">
              Charcoal Fires & Celestial Blessings
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '5s' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold tracking-[0.1em] text-white uppercase leading-none"
          >
            CAFÉ ÉCLIPSE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="font-serif italic text-amber-500/80 text-lg md:text-xl md:tracking-widest mt-4 font-light uppercase"
          >
            — SIP THE VOID. EMBRACE THE LIGHT. —
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            className="text-zinc-500 text-xs md:text-sm max-w-xl mx-auto mt-6 font-light leading-relaxed font-sans"
          >
            Formulating deep Obsidian espressos, velvety charcoal clouds, and lunar-gilded delicacies inside our ambient candlelit sanctuary. Experience a coffee standard that aligns the stars.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-10 flex flex-wrap justify-center gap-4 text-xs font-mono"
          >
            <a 
              href="#main-menu" 
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase rounded-xl shadow-lg transition flex items-center gap-2 tracking-widest cursor-pointer"
            >
              Summon Menu <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#seance-booking" 
              className="px-6 py-4 bg-zinc-950/95 border border-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-800 rounded-xl shadow-md transition flex items-center gap-2 uppercase tracking-wide cursor-pointer"
            >
              Reserve Sanctuary Table
            </a>
          </motion.div>

          {/* Mini features indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-24 border-t border-zinc-900 pt-8 text-left">
            {[
              { label: '35+ SELECTIONS', val: 'Hot & Frosted nodes', icon: Coffee },
              { label: 'ACTIVATED CHARCOAL', val: 'Velvet organic ink', icon: Layers },
              { label: 'WITHER CIRCLES', val: 'Séance Chambers booked', icon: Compass },
              { label: 'ROASTED IN ECLIPSE', val: 'CHARCOAL DIRECT FIRES', icon: Clock }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="space-y-1 font-mono">
                  <div className="text-zinc-500 text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-amber-500/70" /> {f.label}
                  </div>
                  <div className="text-zinc-300 text-xs font-medium font-serif uppercase tracking-wide">{f.val}</div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Ambient Bottom Fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
      </section>

      {/* 3D ECLIPSE ALIGNER MAP SECTION */}
      <section className="border-t border-zinc-900 bg-zinc-950/20 py-16">
        <GothicEclipse onEclipseStateChange={handleEclipseStateChange} />
      </section>

      {/* THE ORACLE MATCHMAKER SECTION */}
      <section className="border-t border-zinc-900 bg-[#040404]" id="oracle">
        <TasteMatchmaker 
          onAddSpecialty={handleAddToCart}
          onOpenDetails={(item) => setSelectedItem(item)}
        />
      </section>

      {/* BESTSELLERS BENTO HIGHLIGHTS */}
      <section className="py-20 px-4 max-w-7xl mx-auto border-t border-zinc-900" id="bestsellers">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-[0.3em] text-amber-500 uppercase flex items-center justify-center gap-1.5">
            <Star className="w-3.5 h-3.5 animate-pulse" /> SACRAMENTS OF EXCELLENCE
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-zinc-100 mt-2 uppercase">
            Signature Dark Bestsellers
          </h2>
          <p className="text-zinc-500 text-xs max-w-md mx-auto mt-2 font-light">
            Our most requested and visually spectacular offerings, prepared with raw alchemical dedication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((item) => (
            <div 
              key={item.id}
              className="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-5 hover:border-amber-500/25 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-square mb-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-amber-500 text-zinc-950 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded uppercase">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <h4 className="font-serif text-white text-md tracking-wide">{item.name}</h4>
                <p className="text-zinc-400 text-xs font-light mt-1.5 leading-relaxed">{item.description}</p>
                
                {item.mysticalIngredient && (
                  <div className="mt-4 text-[9px] font-mono text-amber-500 italic flex items-center gap-1 bg-zinc-950 p-2 border border-zinc-900 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" /> Core Aura: {item.mysticalIngredient}
                  </div>
                )}
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 py-1.5 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 hover:text-white text-amber-500/90 rounded-lg font-mono text-[10px] uppercase tracking-wider transition cursor-pointer"
                >
                  Summon Decand
                </button>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="p-1.5 border border-zinc-900 text-zinc-400 hover:text-white rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THE 3D VIRTUAL LAB CUP CREATOR */}
      <section className="border-t border-zinc-900 bg-radial-[circle_at_center,rgba(11,11,11,0.95)_0%,transparent_100%] py-12" id="alchemy">
        <CupCustomizer onAddCustomBrew={handleAddCustomBrew} />
      </section>

      {/* THE COMPLETE CATALOG MENU SECTION */}
      <section className="border-t border-zinc-900 bg-black/45">
        <MenuSection 
          unlockedSecretMenu={unlockedSecret}
          onAddToCart={handleAddToCart}
          onOpenDetails={(item) => setSelectedItem(item)}
        />
      </section>

      {/* BOOKING RITUAL SECTION */}
      <section className="border-t border-zinc-900 bg-zinc-950/20" id="booking">
        <BookingSection />
      </section>

      {/* PHILOSOPHY/MIDNIGHT ROAST STORY */}
      <section className="border-t border-zinc-900 py-24 px-4 bg-zinc-950/40 relative overflow-hidden" id="our-philosophy">
        
        {/* Subtle branding graphic */}
        <div className="absolute top-10 right-10 w-96 h-96 opacity-[0.03] z-0 select-none pointer-events-none">
          <img src="/src/assets/images/lunar_alchemy_1779371635646.png" className="w-full h-full object-cover rounded-full rotate-45" alt="Alchemical Logo background" referrerPolicy="no-referrer" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Quote className="w-10 h-10 text-amber-500/20 mx-auto mb-6" />
          <h3 className="font-serif text-2xl md:text-3xl text-white tracking-widest uppercase leading-normal">
            Roasted in the Heart of the Eclipse
          </h3>
          <p className="text-zinc-400 text-base font-light italic mt-4 max-w-2xl mx-auto leading-relaxed">
            "We do not merely brew coffee; we gather stars, distill liquid shadow, and synthesize obsidian crema. Under the precise alignment of the Solar Eclipse, our single-origin Peruvian and Ethiopian beans are flame-caramelized on charcoal ovens, binding essential oils down to the atomic matrix."
          </p>
          <div className="h-0.5 w-16 bg-amber-500/40 mx-auto my-6" />
          <span className="font-serif uppercase tracking-[0.2em] font-bold text-amber-500 text-[10px] block">
            — THE ALCHEMICAL MANIFESTO, CAFÉ ÉCLIPSE
          </span>
        </div>
      </section>

      {/* SOCIALS & NOX FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-900/80 py-16 px-4 font-mono text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Branding info */}
          <div className="space-y-4 md:col-span-1.5">
            <h5 className="font-serif text-white text-base tracking-[0.2em] uppercase font-bold">Café Éclipse</h5>
            <p className="text-[11px] leading-relaxed text-zinc-500 font-light">
              We operate exclusively during shadow and lunar cycles, roasted under direct coal fires and aligned planetary energies. Visit our safe, dark lit candle sanctuary.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2 bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:border-amber-500/25 border border-zinc-900/60 rounded-lg transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:border-amber-500/25 border border-zinc-900/60 rounded-lg transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-900 text-zinc-400 hover:text-amber-500 hover:border-amber-500/25 border border-zinc-900/60 rounded-lg transition">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Oracles Coordinates */}
          <div className="space-y-3">
            <h6 className="text-[10px] uppercase text-zinc-300 font-bold tracking-widest flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> Observatory Node
            </h6>
            <div className="space-y-2 leading-relaxed text-[11px] font-light">
              <p>The Obsidian Vault</p>
              <p>Level -3, Sector Lunar Algae</p>
              <p>Void Hollow Square, OT</p>
              <p className="text-zinc-600 mt-1">Tel: (613) 555-NOX-0</p>
            </div>
          </div>

          {/* Col 3: Ritual Timings */}
          <div className="space-y-3">
            <h6 className="text-[10px] uppercase text-zinc-300 font-bold tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Witching Circles
            </h6>
            <ul className="space-y-2 text-[11px] font-light">
              <li className="flex justify-between"><span>Mon — Wed:</span> <span className="text-zinc-400 text-right">3 PM — 12 AM</span></li>
              <li className="flex justify-between"><span>Thu — Fri:</span> <span className="text-zinc-400 text-right">3 PM — 2 AM</span></li>
              <li className="flex justify-between"><span>Saturday:</span> <span className="text-amber-500 text-right">3 PM — 3 AM</span></li>
              <li className="flex justify-between"><span>Sunday:</span> <span className="text-zinc-400 text-right">Solar Penumbras</span></li>
            </ul>
          </div>

          {/* Col 4: Divine Actions */}
          <div className="space-y-4">
            <h6 className="text-[10px] uppercase text-zinc-300 font-bold tracking-widest">Ritual Scrolls</h6>
            <div className="space-y-3">
              <p className="text-[10px] text-zinc-600 leading-normal">
                Receive dark astrological forecasts, eclipse formulations, and alerts for high-energy solstices.
              </p>
              <div className="flex gap-1">
                <input 
                  type="email" 
                  placeholder="Bound Email..."
                  className="bg-zinc-950 border border-zinc-900 rounded-lg p-2 text-xs text-zinc-300 grow focus:outline-none focus:border-amber-500/40"
                />
                <button
                  onClick={() => alert("Your email aura has been bound to the Obsidian newsletter.")}
                  className="px-3 py-2 bg-amber-500 text-zinc-950 rounded-lg text-xs font-bold font-mono hover:bg-amber-400 cursor-pointer transition"
                >
                  Bind
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer legalities */}
        <div className="max-w-7xl mx-auto border-t border-zinc-900/60 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-600 gap-4">
          <p>© 2026 Café Éclipse. Decanted with raw gothic devotion. All recipes property of the Obsidian Alchemist.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-400">Void Policy</a>
            <a href="#" className="hover:text-zinc-400">Seance Rules</a>
            <a href="#" className="hover:text-zinc-400">Solar Terms</a>
          </div>
        </div>
      </footer>

      {/* SYSTEM: LUNAR CART SIDEBAR DRAWER */}
      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* SYSTEM: COFFEE ITEM DETAIL INSPECT MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <>
            {/* Modal Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 pointer-events-auto"
              id="detail-overlay"
            />

            {/* Modal Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-x-4 top-[8%] md:top-[12%] dark-modal max-w-2xl mx-auto bg-zinc-950/95 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl z-50 flex flex-col md:flex-row h-[550px] md:h-[400px] pointer-events-auto"
              id="coffee-detail-modal"
            >
              {/* Left Column in modal: Picture */}
              <div className="w-full md:w-1/2 relative h-48 md:h-full bg-zinc-900">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950 via-transparent to-transparent opacity-80" />
                
                {/* Category Pill */}
                <span className="absolute top-4 left-4 bg-zinc-950/90 text-[10px] uppercase font-mono tracking-widest text-amber-500 border border-zinc-900 px-3 py-1 rounded-full">
                  {selectedItem.category.replace('-', ' ')}
                </span>
              </div>

              {/* Right Column: Descriptions */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between h-full text-left">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[9px] font-mono tracking-[0.2em] text-amber-500 uppercase block">Product Essence File</span>
                      <h3 className="font-serif text-white text-xl md:text-2xl mt-0.5 tracking-wide leading-tight">
                        {selectedItem.name}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="text-zinc-600 hover:text-zinc-400 cursor-pointer p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-zinc-400 text-xs font-light leading-relaxed mt-4">
                    {selectedItem.description}
                  </p>

                  {/* Deep specs list */}
                  <div className="mt-5 space-y-2 font-mono text-[10px] text-zinc-500 border-y border-zinc-900/80 py-3.5">
                    <div className="flex justify-between">
                      <span>CEMENTING INTENSITY:</span>
                      <span className="text-zinc-300 font-bold">{selectedItem.intensity} / 5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SOLSTICE SWEETNESS:</span>
                      <span className="text-zinc-300">{selectedItem.sweetness} / 5</span>
                    </div>
                    {selectedItem.caffeineMg && (
                      <div className="flex justify-between">
                        <span>ASTRAL CAFFEINE MATRIX:</span>
                        <span className="text-amber-500 font-bold">{selectedItem.caffeineMg}mg</span>
                      </div>
                    )}
                    {selectedItem.mysticalIngredient && (
                      <div className="flex justify-between pt-1 text-zinc-400">
                        <span className="text-amber-500 uppercase">AURA INGREDIENT:</span>
                        <span className="italic font-bold">{selectedItem.mysticalIngredient}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-900/60 flex justify-between items-center gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-600 block leading-none">Summon Price</span>
                    <span className="font-serif text-amber-500 font-bold text-xl">${selectedItem.price.toFixed(2)}</span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleAddToCart(selectedItem);
                      setSelectedItem(null);
                    }}
                    className="px-6 py-2.5 bg-amber-500 text-zinc-950 font-mono text-xs font-bold uppercase rounded-lg shadow-md cursor-pointer transition flex items-center gap-1.5"
                  >
                    Add to Urn
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
