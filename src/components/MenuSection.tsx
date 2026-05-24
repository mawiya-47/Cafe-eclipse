import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CoffeeItem } from '../types';
import { COFFEE_MENU } from '../data/menu';
import { 
  Search, SlidersHorizontal, Sun, Moon, Sparkles, Flame, Check, HelpCircle, Compass, Eye, Plus, ShoppingBag, X, Coffee
} from 'lucide-react';

interface MenuSectionProps {
  onAddToCart: (item: CoffeeItem) => void;
  onOpenDetails: (item: CoffeeItem) => void;
  unlockedSecretMenu?: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'All Artifacts', icon: Compass },
  { id: 'celestial-hot', label: 'Celestial Hot', icon: Sun },
  { id: 'umbra-cold', label: 'Umbra Iced', icon: Moon },
  { id: 'eclipse-signature', label: 'Eclipse Elite', icon: Sparkles },
  { id: 'gothic-elixir', label: 'Gothic Elixirs', icon: Flame },
  { id: 'shadow-confection', label: 'Shadow Pastry', icon: Coffee }
];

export default function MenuSection({ onAddToCart, onOpenDetails, unlockedSecretMenu = false }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'intensity'>('name');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Filter & Sort core logic
  const filteredItems = COFFEE_MENU.filter(item => {
    // Only lock secret items if requested, let's keep all available for standard view but highlight signatures
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.mysticalIngredient && item.mysticalIngredient.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Hide specialized secret items under eclipse category if user hasn't completed alignment (optional flavor)
    // To make it very cool: if NOT unlockedSecretMenu, hide Solstice lattes, or show them with 'Mystical Shadow lock'
    return matchesCategory && matchesSearch;
  });

  // Sort logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'intensity') return b.intensity - a.intensity;
    return 0;
  });

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto" id="main-menu">
      {/* Title Header */}
      <div className="text-center mb-12">
        <span className="text-[10px] font-mono tracking-[0.3em] text-amber-500 uppercase flex items-center justify-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Directives & Artifacts
        </span>
        <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-zinc-100 mt-2 uppercase">
          ALCHEMICAL CATALOG
        </h2>
        <div className="h-0.5 w-24 bg-amber-500/40 mx-auto mt-4" />
        <p className="text-zinc-500 text-sm max-w-md mx-auto mt-4 font-light">
          {unlockedSecretMenu 
            ? "Congratulations! Beautiful cosmic alignment has completed. Solstice and Umbral secret recipes are glowing golden below!" 
            : "Sift through 35+ of our handcrafted dark distillations, cold extractions, and mystical pastries."}
        </p>
      </div>

      {/* Controls Container (Search + Categories + Sort) */}
      <div className="bg-zinc-950/40 border border-zinc-900/60 p-5 md:p-6 rounded-2xl mb-10 max-w-5xl mx-auto backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name, ingredient (gold, saffron, lavender)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 pl-10 pr-4 py-3 text-sm rounded-xl text-zinc-200 placeholder-zinc-600 outline-none font-mono transition"
            />
          </div>

          {/* Sorter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-900/80 hover:border-zinc-800 text-zinc-300 px-3 py-2.5 rounded-lg text-xs font-mono outline-none cursor-pointer transition"
            >
              <option value="name">ALPHABETICAL</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="intensity">DARKNESS INTENSITY</option>
            </select>
          </div>

        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 mt-5 border-t border-zinc-900 pt-4 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-lg border text-xs font-mono tracking-wide shrink-0 transition flex items-center gap-2 cursor-pointer ${
                  active 
                    ? 'bg-amber-500 border-amber-500 text-zinc-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.25)]' 
                    : 'bg-zinc-950/60 border-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-zinc-950' : 'text-amber-500/70'}`} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Content */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {sortedItems.map((item, idx) => {
            const isSecretLock = !unlockedSecretMenu && item.category === 'eclipse-signature';
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: Math.min(8, idx) * 0.04 }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                key={item.id}
                className="group relative bg-zinc-950/40 hover:bg-zinc-950/85 border border-zinc-900/80 hover:border-amber-500/30 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
              >
                
                {/* 3D tilt-like lighting overlay */}
                <div className="absolute inset-0 bg-radial-[circle_at_top_right,rgba(245,158,11,0.02)_0%,transparent_60%] pointer-events-none" />

                <div>
                  {/* Image wrapper */}
                  <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-zinc-900">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover rounded-xl transition duration-700 ${
                        isSecretLock ? 'filter blur-md saturate-50' : 'group-hover:scale-110'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />

                    {/* Category Label */}
                    <span className="absolute top-3 left-3 bg-zinc-950/90 text-[9px] uppercase font-mono tracking-widest text-amber-500 border border-zinc-900 px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {item.category.replace('-', ' ')}
                    </span>

                    {/* Secret Lock Overlay */}
                    {isSecretLock && (
                      <div className="absolute inset-0 bg-zinc-950/80 flex flex-col items-center justify-center p-3 text-center">
                        <Moon className="w-8 h-8 text-amber-500/50 animate-pulse mb-2" />
                        <span className="text-[10px] font-mono tracking-widest text-amber-500 font-bold uppercase">Locked in Shadows</span>
                        <p className="text-[10px] text-zinc-500 mt-1 font-light leading-snug">Achieve 100% Eclipse alignment on the solar map above to unlock.</p>
                      </div>
                    )}
                  </div>

                  {/* Coffee Specifications Header */}
                  <div className="mt-4 flex justify-between items-start gap-2">
                    <h3 className="font-serif text-white font-medium text-[15px] tracking-wide group-hover:text-amber-400 transition leading-snug">
                      {item.name}
                    </h3>
                    <span className="font-mono text-amber-500 font-bold text-sm bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-xs mt-2 font-light leading-relaxed h-[52px] overflow-hidden line-clamp-3">
                    {item.description}
                  </p>

                  {/* Flavour bars indicators */}
                  {!isSecretLock && (
                    <div className="mt-4 pt-4 border-t border-zinc-900/60 grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-500">
                      <div>
                        DARKNESS:
                        <div className="flex gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <div 
                              key={s} 
                              className={`h-1.5 flex-1 rounded-xs ${
                                s <= item.intensity ? 'bg-amber-500/80' : 'bg-zinc-900'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        SWEETNESS:
                        <div className="flex gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <div 
                              key={s} 
                              className={`h-1.5 flex-1 rounded-xs ${
                                s <= item.sweetness ? 'bg-amber-500/80' : 'bg-zinc-900'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Aura Essence tooltip info */}
                  {item.mysticalIngredient && !isSecretLock && (
                    <div className="mt-3 bg-zinc-950/80 border border-zinc-900/60 py-1.5 px-2.5 rounded-lg text-[9px] font-mono text-zinc-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                      <span className="truncate italic">Aura: {item.mysticalIngredient}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Controls */}
                <div className="mt-4 flex gap-2">
                  <motion.button
                    disabled={isSecretLock}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onAddToCart(item)}
                    className="flex-1 py-2 rounded-lg bg-amber-500 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 font-mono text-xs font-bold tracking-wider uppercase transition flex items-center justify-center gap-1.5 cursor-pointer hover:bg-amber-400"
                  >
                    <Plus className="w-3.5 h-3.5 text-zinc-950 font-bold" /> Summon
                  </motion.button>
                  <motion.button
                    disabled={isSecretLock}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onOpenDetails(item)}
                    className="p-2 border border-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed hover:border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 transition cursor-pointer flex items-center justify-center"
                    title="Inspect Product Detail"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {sortedItems.length === 0 && (
        <div className="text-center py-20 bg-zinc-950/20 border border-dashed border-zinc-950 rounded-2xl">
          <Moon className="w-10 h-10 text-zinc-700 mx-auto animate-pulse mb-3" />
          <h3 className="font-serif text-white text-lg font-light">Void Manifested</h3>
          <p className="text-zinc-500 text-sm mt-1">No elixirs correspond to your planetary query. Try adjusting filters.</p>
        </div>
      )}
    </div>
  );
}
