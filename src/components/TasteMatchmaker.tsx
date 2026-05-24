import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COFFEE_MENU } from '../data/menu';
import { CoffeeItem } from '../types';
import { Sparkles, ArrowRight, RotateCcw, Flame, Moon, Compass, Coffee, HelpCircle, Eye } from 'lucide-react';

interface TasteMatchmakerProps {
  onAddSpecialty: (item: CoffeeItem) => void;
  onOpenDetails: (item: CoffeeItem) => void;
}

export default function TasteMatchmaker({ onAddSpecialty, onOpenDetails }: TasteMatchmakerProps) {
  const [step, setStep] = useState(0); // 0: start, 1: Q1, 2: Q2, 3: Q3, 4: results
  const [answers, setAnswers] = useState<{
    frequency?: 'solar' | 'void' | 'nebulous' | 'frost';
    sweet?: 'bitter' | 'floral' | 'sweet';
    drive?: 'high' | 'mid' | 'low';
  }>({});
  const [matchedItem, setMatchedItem] = useState<CoffeeItem | null>(null);

  const startQuiz = () => {
    setStep(1);
    setAnswers({});
    setMatchedItem(null);
  };

  const handleSelectAnswer = (key: 'frequency' | 'sweet' | 'drive', value: any) => {
    const updatedAnswers = { ...answers, [key]: value };
    setAnswers(updatedAnswers);

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Calculate match
      calculateMatch(updatedAnswers);
    }
  };

  const calculateMatch = (finalAnswers: typeof answers) => {
    // Basic recommendation rules
    let pool = [...COFFEE_MENU];

    // Filter by temp/ice if frost selected
    if (finalAnswers.frequency === 'frost') {
      pool = pool.filter(i => i.temperature === 'cold' || i.category === 'umbra-cold');
    } else if (finalAnswers.frequency === 'solar') {
      pool = pool.filter(i => i.temperature === 'hot' || i.category === 'celestial-hot');
    }

    // Sugar match
    if (finalAnswers.sweet === 'bitter') {
      pool = pool.filter(i => i.sweetness <= 2);
    } else if (finalAnswers.sweet === 'sweet') {
      pool = pool.filter(i => i.sweetness >= 3);
    }

    // Caffeine match
    if (finalAnswers.drive === 'high') {
      pool = pool.filter(i => (i.caffeineMg || 0) >= 150);
    } else if (finalAnswers.drive === 'low') {
      pool = pool.filter(i => (i.caffeineMg || 0) < 100);
    }

    // Fallback if pool is empty
    if (pool.length === 0) {
      pool = COFFEE_MENU.filter(i => i.category === 'eclipse-signature');
    }

    // Return a beautiful matched item
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex] || COFFEE_MENU[0];
    setMatchedItem(selected);
    setStep(4);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12 px-4" id="alchemical-matchmaker">
      {/* Decorative gothic frames */}
      <div className="absolute inset-0 border border-amber-900/15 rounded-3xl pointer-events-none" />
      <div className="absolute -inset-1 border border-amber-900/5 rounded-[28px] pointer-events-none" />

      <div className="bg-zinc-950/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-zinc-900/80 shadow-2xl relative overflow-hidden">
        {/* Abstract gold nebula bg */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-6 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <Compass className="w-7 h-7 text-amber-500 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-white tracking-widest uppercase">
                Gothic Taste Oracle
              </h3>
              <p className="text-zinc-400 font-light mt-3 max-w-lg text-sm leading-relaxed">
                Allow the celestial alignment to dissect your spiritual preference. Answer our three dark questions, and let the lunar alignment reveal your fated elixir.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={startQuiz}
                className="mt-8 px-8 py-3.5 bg-amber-500 text-zinc-950 font-mono font-medium rounded-full cursor-pointer flex items-center gap-2 text-sm uppercase tracking-widest transition-all shadow-lg"
              >
                Initiate Diagnosis <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="q1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-4"
            >
              <div className="text-xs font-mono text-amber-500 tracking-widest uppercase text-center mb-2">Stage 01 of 03</div>
              <h3 className="text-xl md:text-2xl font-serif text-zinc-100 text-center tracking-wider mb-8">
                What is your spiritual frequency at this precise moment?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  { id: 'solar', title: 'Solar Flare', desc: 'Blazing creative energy, high willpower, needing intense fire.', icon: Flame, color: 'text-amber-500 hover:border-amber-500' },
                  { id: 'void', title: 'Noxious Void', desc: 'Poetic melancolia, deep focus, desire for calm obsidian focus.', icon: Moon, color: 'text-zinc-400 hover:border-zinc-300' },
                  { id: 'nebulous', title: 'Cosmic Nebula', desc: 'Swirling thoughts, floral, mystical dreamlike aura, seeking novelty.', icon: Sparkles, color: 'text-purple-400 hover:border-purple-400' },
                  { id: 'frost', title: 'Absolute Subzero', desc: 'Brisk chilling focus, looking for extreme frost and icy nodes.', icon: HelpCircle, color: 'text-cyan-400 hover:border-cyan-400' }
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectAnswer('frequency', opt.id)}
                      className={`flex items-start gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-zinc-900 text-left hover:bg-zinc-900/40 transition-all pointer-events-auto cursor-pointer`}
                    >
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <Icon className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="font-serif text-zinc-100 font-medium tracking-wide text-sm">{opt.title}</h4>
                        <p className="text-zinc-400 text-xs mt-1 font-light leading-relaxed">{opt.desc}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="q2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-4"
            >
              <div className="text-xs font-mono text-amber-500 tracking-widest uppercase text-center mb-2">Stage 02 of 03</div>
              <h3 className="text-xl md:text-2xl font-serif text-zinc-100 text-center tracking-wider mb-8">
                Select your desired alchemical sweetener profile:
              </h3>
              <div className="flex flex-col gap-4 max-w-xl mx-auto">
                {[
                  { id: 'bitter', title: 'Uncompromising Void (Pure, Dark, Bitter)', desc: 'Pure extraction, heavy espresso oils, no sugars added. For purists of the dark arts.' },
                  { id: 'floral', title: 'Lunar Petals (Infused, Herbaceous, Aromatic)', desc: 'Soft lavender, rose-water syrup additions, fresh aromatic spices, mint aura.' },
                  { id: 'sweet', title: 'Corona Crown (Caramels, Chocolate, Pastry Swirls)', desc: 'Incredibly luxurious torched buttercaramel, organic maple, melted premium chocolates.' }
                ].map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectAnswer('sweet', opt.id)}
                    className="flex justify-between items-center p-5 rounded-2xl bg-zinc-950/60 border border-zinc-900 text-left hover:bg-zinc-900/40 transition-all cursor-pointer"
                  >
                    <div>
                      <h4 className="font-serif text-zinc-100 font-medium tracking-wide text-sm">{opt.title}</h4>
                      <p className="text-zinc-400 text-xs mt-1 font-light leading-relaxed">{opt.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 shrink-0" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="q3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-4"
            >
              <div className="text-xs font-mono text-amber-500 tracking-widest uppercase text-center mb-2">Stage 03 of 03</div>
              <h3 className="text-xl md:text-2xl font-serif text-zinc-100 text-center tracking-wider mb-8">
                What intensity of awakening does your neural matrix require?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {[
                  { id: 'high', label: 'Eclipse Singularity', desc: 'Overwhelming caffeine shockwave to shatter heavy drowsiness.' },
                  { id: 'mid', label: 'Balanced Alignment', desc: 'A smooth continuous flow of focused focus.' },
                  { id: 'low', label: 'Astral Slumber', desc: 'Low to zero caffeine. Pastry vibes or herbal tranquility.' }
                ].map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectAnswer('drive', opt.id)}
                    className="flex flex-col p-5 rounded-2xl bg-zinc-950/60 border border-zinc-900 text-center hover:bg-zinc-900/40 transition-all cursor-pointer"
                  >
                    <Coffee className="w-5 h-5 text-amber-500 mx-auto mb-3" />
                    <h4 className="font-serif text-zinc-100 font-medium text-sm tracking-wide">{opt.label}</h4>
                    <p className="text-zinc-500 text-xs mt-2 font-light leading-relaxed">{opt.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && matchedItem && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col md:flex-row items-center gap-8 py-2"
            >
              {/* Left Side: Match Graphic */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative group p-1 bg-gradient-to-tr from-amber-600/30 to-yellow-500/10 rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.15)] overflow-hidden">
                  <img
                    src={matchedItem.image}
                    alt={matchedItem.name}
                    className="w-64 h-64 md:w-72 md:h-72 object-cover rounded-xl transition duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-xs text-[10px] uppercase font-mono tracking-widest text-amber-500 border border-zinc-800 px-3 py-1 rounded-full">
                    {matchedItem.category.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Right Side: Coffee Info */}
              <div className="w-full md:w-1/2 text-left">
                <span className="text-[10px] font-mono tracking-[0.2em] text-amber-500 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Your Astronomical Match
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-white tracking-wide mt-1">
                  {matchedItem.name}
                </h3>
                <div className="h-0.5 w-16 bg-amber-500/40 my-3" />
                <p className="text-zinc-400 font-light text-sm leading-relaxed mb-4">
                  {matchedItem.description}
                </p>

                {/* Parameters */}
                <div className="grid grid-cols-2 gap-3 mb-6 bg-zinc-950/70 border border-zinc-900/60 p-4 rounded-xl font-mono text-xs">
                  <div>
                    <span className="text-zinc-500">Price:</span>{' '}
                    <span className="text-amber-400 font-bold">${matchedItem.price.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Caffeine:</span>{' '}
                    <span className="text-zinc-300">{matchedItem.caffeineMg ? `${matchedItem.caffeineMg}mg` : 'Zero'}</span>
                  </div>
                  {matchedItem.mysticalIngredient && (
                    <div className="col-span-2 border-t border-zinc-900 pt-2 mt-1">
                      <span className="text-amber-500">Aura Extract:</span>{' '}
                      <span className="text-zinc-300 italic">{matchedItem.mysticalIngredient}</span>
                    </div>
                  )}
                </div>

                {/* CTA actions */}
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onAddSpecialty(matchedItem)}
                    className="px-6 py-3 bg-amber-500 text-zinc-950 font-mono text-xs font-semibold tracking-wider rounded-lg uppercase cursor-pointer"
                  >
                    Summon Decant
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03, bg: 'rgba(255,255,255,0.05)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onOpenDetails(matchedItem)}
                    className="px-4 py-3 border border-zinc-800 text-zinc-300 font-mono text-xs uppercase tracking-wider rounded-lg cursor-pointer flex items-center gap-1 hover:border-zinc-700"
                  >
                    <Eye className="w-4 h-4" /> Inspect Essence
                  </motion.button>
                  <button
                    onClick={startQuiz}
                    className="p-3 border border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800 rounded-lg cursor-pointer ml-auto"
                    title="Recalibrate"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
