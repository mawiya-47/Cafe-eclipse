import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Layers, Sparkles, Flame, Snowflake, RotateCcw } from 'lucide-react';
import { CoffeeCustomization } from '../types';

interface CupCustomizerProps {
  onAddCustomBrew: (custom: {
    name: string;
    price: number;
    description: string;
    customization: CoffeeCustomization;
    image: string;
  }) => void;
}

export default function CupCustomizer({ onAddCustomBrew }: CupCustomizerProps) {
  // Setup customization state
  const [base, setBase] = useState<'espresso' | 'cold-brew' | 'matcha'>('espresso');
  const [milk, setMilk] = useState<CoffeeCustomization['milk']>('Charcoal Activated');
  const [sweetener, setSweetener] = useState<CoffeeCustomization['sweetener']>('Lavender Infused');
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['Gold flakes']);
  const [tempAdjust, setTempAdjust] = useState<CoffeeCustomization['tempAdjust']>('regular');

  const toppingOptions = [
    { name: 'Gold flakes', icon: '✨' },
    { name: 'Star anise', icon: '⭐' },
    { name: 'Rose petals', icon: '🌸' },
    { name: 'Cinnamon dust', icon: '🌙' },
  ];

  const handleToggleTopping = (topping: string) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter(t => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  // Determine liquid colors based on base + milk selections
  const getBaseColor = () => {
    switch (base) {
      case 'espresso': return 'bg-amber-950';
      case 'cold-brew': return 'bg-zinc-950';
      case 'matcha': return 'bg-emerald-950';
    }
  };

  const getMilkColor = () => {
    switch (milk) {
      case 'Whole': return 'from-stone-100 to-stone-200';
      case 'Oat': return 'from-amber-100 to-amber-200/80';
      case 'Charcoal Activated': return 'from-zinc-800 to-zinc-900';
      case 'Coconut': return 'from-stone-50 to-stone-100';
      case 'None': return 'from-transparent to-transparent';
    }
  };

  const currentPrice = 6.50 + 
    (milk === 'Charcoal Activated' ? 1.50 : 0) + 
    (sweetener !== 'None' ? 0.75 : 0) + 
    (selectedToppings.length * 0.50);

  const handleSummon = () => {
    const customName = `${milk !== 'None' ? milk : ''} ${base.charAt(0).toUpperCase() + base.slice(1)} Alcheme`;
    onAddCustomBrew({
      name: customName,
      price: currentPrice,
      description: `A custom-bound alchemical synthesis featuring a ${base} base infused with ${milk} milk, sweetened with ${sweetener} syrups, and dusted with ${selectedToppings.join(' and ') || 'nothing'}.`,
      customization: {
        milk,
        sweetener,
        toppings: selectedToppings,
        tempAdjust,
      },
      image: base === 'matcha' 
        ? 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop'
    });
  };

  const handleReset = () => {
    setBase('espresso');
    setMilk('Charcoal Activated');
    setSweetener('Lavender Infused');
    setSelectedToppings(['Gold flakes']);
    setTempAdjust('regular');
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-12 px-4" id="virtual-alchemy">
      <div className="text-center mb-10">
        <span className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase flex items-center justify-center gap-1.5">
          <Layers className="w-3.5 h-3.5" /> Virtual Synthesis Drawer
        </span>
        <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-zinc-100 mt-2 uppercase">
          Alchemical Cup Creator
        </h2>
        <p className="text-zinc-500 text-sm max-w-lg mx-auto mt-2 font-light">
          Manipulate elemental ingredients down to the molecule and synthesize your bespoke cosmic cup.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-950/20 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-zinc-900/60 shadow-2xl relative">
        
        {/* Left column (6/12): 3D Cup Render Stage */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center min-h-[400px] bg-zinc-950/80 border border-zinc-900 rounded-2xl relative overflow-hidden py-10 shadow-[inner_0_0_30px_rgba(0,0,0,0.8)]">
          
          <div className="absolute top-4 left-4 font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
            3D Materialization Chamber
          </div>

          {/* 3D Glass Model */}
          <div className="relative w-48 h-64 flex flex-col justify-end items-center mt-6">
            
            {/* Overlay Toppings (floating icons on cup rim) */}
            <div className="absolute -top-6 w-32 h-6 z-30 flex justify-center gap-3">
              <AnimatePresence>
                {selectedToppings.map(t => {
                  const opt = toppingOptions.find(o => o.name === t);
                  return (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, y: -10, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.5 }}
                      transition={{ type: 'spring' }}
                      className="text-xl filter drop-shadow-[0_0_5px_rgba(245,158,11,0.5)] animate-bounce"
                      style={{ animationDuration: t === 'Gold flakes' ? '2.5s' : '3.5s' }}
                    >
                      {opt?.icon}
                    </motion.span>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Glass Container */}
            <div className="relative w-36 h-56 border-x-2 border-b-2 border-zinc-800/80 rounded-b-[40px] overflow-hidden flex flex-col justify-end bg-gradient-to-t from-zinc-950/60 to-transparent shadow-2xl z-10">
              
              {/* Glass Reflection Highlight */}
              <div className="absolute inset-y-0 left-2 w-4 bg-white/5 skew-x-12 pointer-events-none z-30" />
              <div className="absolute top-2 right-4 w-2 h-12 bg-white/5 rounded-full pointer-events-none z-30" />

              {/* Topping Swirl Layer (glowing particle effects on coffee surface) */}
              {selectedToppings.length > 0 && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                  className="absolute bottom-[200px] left-0 right-0 h-6 mx-auto rounded-full z-20 overflow-hidden"
                >
                  <div className="absolute inset-x-2 h-full bg-radial-[circle,rgba(245,158,11,0.5)_0%,transparent_70%] animate-pulse" />
                </motion.div>
              )}

              {/* Milk Foam Layer */}
              {milk !== 'None' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 28 }}
                  className={`relative w-full bg-gradient-to-r ${getMilkColor()} rounded-t-md z-15 border-b border-black/10 shadow-[inset_0_-2px_10px_rgba(0,0,0,0.15)]`}
                />
              )}

              {/* Base Elixir Layer */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: milk !== 'None' ? 140 : 160 }}
                className={`relative w-full ${getBaseColor()} z-10 transition-colors duration-500 shadow-[inset_0_4px_15px_rgba(0,0,0,0.5)] flex items-center justify-center`}
              >
                {/* Heat steam lines or cold ice bubbles inside glass */}
                {tempAdjust === 'over-ice' ? (
                  <div className="absolute inset-0 flex flex-wrap gap-2 p-4 justify-center items-center opacity-40">
                    {[1, 2, 3, 4].map(idx => (
                      <div key={idx} className="w-5 h-5 border border-white/20 bg-white/5 rounded-sm animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-start py-4 opacity-25">
                    <span className="w-0.5 h-16 bg-gradient-to-t from-white/10 to-transparent rounded-full animate-bounce shrink-0" style={{ animationDuration: '3s' }} />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Platform Shadow glow */}
            <div className="w-40 h-5 bg-radial-[circle,rgba(217,119,6,0.15)_30%,transparent_70%] blur-[2px] rounded-full mt-2" />
          </div>

          <div className="mt-6 flex gap-4 text-xs font-mono text-zinc-400 z-10">
            <span className="flex items-center gap-1">
              {tempAdjust === 'over-ice' ? (
                <>
                  <Snowflake className="w-3.5 h-3.5 text-cyan-400" /> FROSTED
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> FIRED
                </>
              )}
            </span>
            <span>•</span>
            <span>EST. PRICE: <strong className="text-amber-500 font-bold">${currentPrice.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* Right column (7/12): Custom Controls */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-serif text-white text-lg tracking-wide">Synthesizer Matrix</h4>
              <button 
                onClick={handleReset}
                className="text-zinc-500 hover:text-zinc-300 text-xs font-mono flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> RE-CALIBRATE
              </button>
            </div>

            <div className="space-y-5">
              {/* 1. Base Elixir */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">1. Select Core Crucible</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'espresso', name: 'Espress Ristretto', desc: 'Sunkissed fire' },
                    { id: 'cold-brew', name: 'Nocturne Steeped', desc: '24hr Shadow' },
                    { id: 'matcha', name: 'Emerald Jade', desc: 'Mystic leaf' }
                  ].map(b => (
                    <button
                      key={b.id}
                      onClick={() => setBase(b.id as any)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                        base === b.id 
                          ? 'bg-amber-500/10 border-amber-500 text-white' 
                          : 'bg-zinc-950/40 border-zinc-900/60 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <div className="text-xs font-mono font-medium">{b.name}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">{b.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Velvet Milks */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">2. Infuse Velvet Milk</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { name: 'Charcoal Activated', label: 'Ebony Carbon' },
                    { name: 'Oat', label: 'Earthly Oat' },
                    { name: 'Whole', label: 'Celestial Foam' },
                    { name: 'None', label: 'Eradicated Milk' },
                  ].map(m => (
                    <button
                      key={m.name}
                      onClick={() => setMilk(m.name as any)}
                      className={`p-2.5 rounded-lg border text-center text-xs font-mono cursor-pointer transition ${
                        milk === m.name 
                          ? 'bg-amber-500/10 border-amber-500 text-white' 
                          : 'bg-zinc-950/40 border-zinc-900/60 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Sweeteners */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">3. Syrups of the Sorcerer</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { name: 'Lavender Infused', label: 'Lavender Blossom' },
                    { name: 'Dark Maple', label: 'Obsidian Maple' },
                    { name: 'Organic Demerara', label: 'Crag Sugar' },
                    { name: 'None', label: 'Bitter Cold' }
                  ].map(s => (
                    <button
                      key={s.name}
                      onClick={() => setSweetener(s.name as any)}
                      className={`p-2.5 rounded-lg border text-center text-[11px] font-mono cursor-pointer transition ${
                        sweetener === s.name 
                          ? 'bg-amber-500/10 border-amber-500 text-white' 
                          : 'bg-zinc-950/40 border-zinc-900/60 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Toppings (Multiselect) */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">4. Star Dust (Toppings - +$0.50 each)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {toppingOptions.map(t => {
                    const active = selectedToppings.includes(t.name);
                    return (
                      <button
                        key={t.name}
                        onClick={() => handleToggleTopping(t.name)}
                        className={`p-2.5 rounded-lg border text-center text-xs font-mono cursor-pointer transition flex items-center justify-center gap-1.5 ${
                          active 
                            ? 'bg-amber-500/10 border-amber-500 text-white' 
                            : 'bg-zinc-950/40 border-zinc-900/60 text-zinc-400 hover:border-zinc-800'
                        }`}
                      >
                        <span>{t.icon}</span> <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Temperature Adjustment */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">5. Atmosphere Phase</label>
                <div className="flex gap-4">
                  {[
                    { id: 'regular', label: 'Regular Fire', icon: Flame },
                    { id: 'over-ice', label: 'Absolute Subzero Iced', icon: Snowflake }
                  ].map(t => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTempAdjust(t.id as any)}
                        className={`px-4 py-2 rounded-lg border text-xs font-mono cursor-pointer flex items-center gap-1.5 transition ${
                          tempAdjust === t.id 
                            ? 'bg-amber-500/10 border-amber-500 text-white' 
                            : 'bg-zinc-950/40 border-zinc-900/60 text-zinc-400 hover:border-zinc-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" /> {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-900 flex justify-between items-center gap-4">
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Estimated Energy</div>
              <div className="text-xl font-mono text-zinc-300 font-medium">~7.2 Giga-crema</div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(245,158,11,0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSummon}
              className="flex items-center gap-2 px-8 py-4 bg-amber-500 text-zinc-950 font-mono text-xs font-bold uppercase rounded-xl shadow-lg cursor-pointer transition"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} /> Summon Custom Brew
            </motion.button>
          </div>
        </div>

      </div>
    </div>
  );
}
