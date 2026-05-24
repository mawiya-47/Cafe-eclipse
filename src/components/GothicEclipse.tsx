import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Sun, Moon, Info, Sparkles } from 'lucide-react';

interface GothicEclipseProps {
  onEclipseStateChange?: (pct: number) => void;
}

export default function GothicEclipse({ onEclipseStateChange }: GothicEclipseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eclipsePct, setEclipsePct] = useState<number>(0.15); // Starts partially eclipsed
  const [isTotalEclipse, setIsTotalEclipse] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Motion values for interactive smooth dragging of the moon
  const moonX = useMotionValue(100); 

  // Track cursor tilt for genuine 3D feel
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // range -0.5 to 0.5
    setTilt({ x: x * 20, y: y * -20 }); // Adjust maximum degrees
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Convert moonX into eclipse percent
  useEffect(() => {
    return moonX.onChange((latest) => {
      // moonX ranges approximately from -150 to 150 where 0 is perfect total eclipse
      const distance = Math.abs(latest);
      const maxDistance = 140;
      const pct = Math.max(0, Math.min(100, 100 - (distance / maxDistance) * 100));
      const normalizedPct = pct / 100;
      setEclipsePct(normalizedPct);
      if (onEclipseStateChange) {
        onEclipseStateChange(normalizedPct);
      }
      setIsTotalEclipse(normalizedPct > 0.94);
    });
  }, [moonX, onEclipseStateChange]);

  // Set initial position of moonX corresponding to partial eclipse
  useEffect(() => {
    moonX.set(45); // offset a bit to show a partial crescent eclipse
  }, []);

  return (
    <div className="relative w-full py-16 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Starfield */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(18,18,18,0.95)_0%,rgba(5,5,5,1)_100%] z-0" />
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-yellow-600/5 blur-3xl" />

      {/* 3D Container of Solar Eclipse */}
      <div className="text-center mb-6 z-10">
        <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" /> Intuit the Eclipse <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
        </span>
        <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-zinc-100 mt-2 uppercase">
          Align the Spheres
        </h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto mt-2 font-light">
          Drag the lunar shadow horizontally. Achieve 100% Alignment to unlock our secret alchemical Menu.
        </p>
      </div>

      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        style={{
          perspective: 1000,
          rotateX: tilt.y,
          rotateY: tilt.x,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
        id="eclipse-stage"
      >
        {/* Glow Corona Rings */}
        <motion.div
          animate={{
            scale: isTotalEclipse ? [1, 1.08, 1] : [1, 1.03, 1],
            rotate: isTotalEclipse ? 360 : 0
          }}
          transition={{
            scale: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 45, ease: "linear" }
          }}
          className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none ${
            isTotalEclipse 
              ? 'bg-radial-[circle,rgba(245,158,11,0.45)_0%,rgba(217,119,6,0.15)_50%,transparent_70%] shadow-[0_0_80px_rgba(245,158,11,0.5)] border-amber-500/20 border' 
              : 'bg-radial-[circle,rgba(217,119,6,0.18)_0%,rgba(146,64,14,0.05)_50%,transparent_70%]'
          }`}
          style={{ transform: 'translateZ(-50px)' }}
        />

        {/* Ambient Dark Core behind */}
        <div 
          className="absolute w-[205px] h-[205px] md:w-[245px] md:h-[245px] rounded-full bg-zinc-950/20 backdrop-blur-xs border border-zinc-900/30 shadow-2xl"
          style={{ transform: 'translateZ(-20px)' }}
        />

        {/* The Solar Orb (SUN) */}
        <motion.div
          animate={{
            scale: isTotalEclipse ? 1.05 : 1,
            boxShadow: isTotalEclipse 
              ? '0 0 100px 30px rgba(245,158,11,0.8), inset 0 0 40px rgba(245,158,11,0.6)' 
              : '0 0 40px 10px rgba(245,158,11,0.3), inset 0 0 10px rgba(245,158,11,0.2)'
          }}
          transition={{ duration: 0.5 }}
          className="absolute w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden bg-gradient-to-tr from-amber-700 via-amber-500 to-yellow-400 z-10"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Sun Lava Swirl Effect */}
          <div className="absolute inset-0 opacity-40 mix-blend-color-burn animate-pulse bg-radial-[circle_at_30%_20%,transparent_0%,rgba(0,0,0,0.8)_80%]" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="absolute inset-[-20px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-300 via-amber-600 to-transparent blur-[1px] opacity-30" 
          />
        </motion.div>

        {/* The Lunar Orb (MOON) with custom horizontal drag boundaries */}
        <motion.div
          drag="x"
          dragConstraints={{ left: -140, right: 140 }}
          style={{ x: moonX, transform: 'translateZ(60px)' }}
          whileDrag={{ scale: 1.03 }}
          className="absolute w-44 h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-b from-zinc-800 via-zinc-950 to-black border border-zinc-800 shadow-[20px_20px_40px_rgba(0,0,0,0.9),_inset_2px_2px_12px_rgba(255,255,255,0.05)] cursor-grab active:cursor-grabbing z-20 flex items-center justify-center"
        >
          {/* Lunar Texture Crates mock CSS */}
          <div className="absolute inset-0 rounded-full opacity-15 mix-blend-overlay pointer-events-none bg-[radial-gradient(circle_at_30%_30%,_white_2%,_transparent_15%),_radial-gradient(circle_at_70%_40%,_white_1%,_transparent_10%),_radial-gradient(circle_at_50%_80%,_white_2%,_transparent_18%)]" />
          
          <div className="text-center select-none pointer-events-none">
            <Moon className="w-6 h-6 text-zinc-500/20 mx-auto animate-pulse" />
          </div>
        </motion.div>
      </motion.div>

      {/* Alignment Indicator */}
      <div className="z-10 mt-6 flex flex-col items-center gap-1">
        <div className="flex items-center gap-4 text-sm font-mono text-zinc-300 bg-zinc-950/80 border border-zinc-900/60 px-4 py-2 rounded-full backdrop-blur-md">
          <span className="flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500" /> SUN
          </span>
          <div className="w-24 h-1.5 bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-800">
            <motion.div 
              className={`h-full bg-gradient-to-r ${isTotalEclipse ? 'from-amber-500 to-amber-300' : 'from-yellow-600 to-amber-500'}`}
              style={{ width: `${Math.round(eclipsePct * 100)}%` }}
            />
          </div>
          <span className="flex items-center gap-1.5">
            <Moon className="w-4 h-4 text-zinc-400" /> MOON
          </span>
        </div>

        <div className="mt-2 h-6 overflow-hidden">
          {isTotalEclipse ? (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" /> Perfect Alignment! Secret Menu Unlocked <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </motion.div>
          ) : (
            <p className="text-[11px] font-mono text-zinc-500 tracking-wider">
              Alignment Pct: {Math.round(eclipsePct * 100)}% {eclipsePct > 0.8 && '— Near Alignment...'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
