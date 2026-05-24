import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SeanceBooking } from '../types';
import { 
  Calendar, Users, Clock, Compass, ShieldAlert, Sparkles, Check, CheckCircle, Skull, Moon, Sun, Armchair
} from 'lucide-react';

export default function BookingSection() {
  const [booking, setBooking] = useState<Partial<SeanceBooking>>({
    partySize: 2,
    chamber: 'Umbral-Tomb',
    timeSlot: '19:00 (Nox Hour)'
  });
  const [selectedTable, setSelectedTable] = useState<number | null>(4);
  const [submitted, setSubmitted] = useState(false);

  // Mock available seats in our layout
  const tables = [
    { id: 1, name: 'T1', size: 2, x: 20, y: 30, available: true },
    { id: 2, name: 'T2', size: 2, x: 20, y: 70, available: false },
    { id: 3, name: 'T3', size: 4, x: 50, y: 20, available: true },
    { id: 4, name: 'T4', size: 6, x: 50, y: 50, available: true }, // The central altar table
    { id: 5, name: 'T5', size: 4, x: 50, y: 80, available: true },
    { id: 6, name: 'T6', size: 2, x: 80, y: 30, available: false },
    { id: 7, name: 'T7', size: 2, x: 80, y: 70, available: true }
  ];

  const timeSlots = [
    '15:00 (Solar Peak)',
    '17:00 (Twilight Hour)',
    '19:00 (Nox Hour)',
    '21:00 (Lunar Vertex)',
    '23:00 (Witching Bell)'
  ];

  const chambers = [
    { id: 'Solar-Chamber', name: 'The Solar Chamber', desc: 'Illuminated by 100 flickering tall black taper candles. Warm gothic energy.', icon: Sun },
    { id: 'Umbral-Tomb', name: 'The Umbral Tomb', desc: 'Pre-selected private deep velvet alcoves with heavy soundproofing curtains.', icon: Skull },
    { id: 'Lunar-Balcony', name: 'The Lunar Balcony', desc: 'Overlooking our ambient astronomical ceiling projectors and deep nebula screens.', icon: Moon }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking.name || !booking.email || !booking.date || !selectedTable) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setBooking({
      partySize: 2,
      chamber: 'Umbral-Tomb',
      timeSlot: '19:00 (Nox Hour)'
    });
    setSelectedTable(4);
  };

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto" id="seance-booking">
      <div className="text-center mb-12">
        <span className="text-[10px] font-mono tracking-[0.3em] text-amber-500 uppercase flex items-center justify-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> Divine Alignment
        </span>
        <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-zinc-100 mt-2 uppercase">
          Table & Chamber Seance Reserve
        </h2>
        <div className="h-0.5 w-24 bg-amber-500/40 mx-auto mt-4" />
        <p className="text-zinc-500 text-sm max-w-lg mx-auto mt-4 font-light">
          Reserve your spot in one of our three deep ritualistic chambers. Walk-ins are welcomed, but alignment bookings guarantee shadow seating.
        </p>
      </div>

      <div className="bg-zinc-950/40 backdrop-blur-md border border-zinc-900/60 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-10 max-w-5xl mx-auto relative">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column (7/12): Booking inputs & Chambers */}
              <div className="lg:col-span-7 space-y-6">
                <h4 className="font-serif text-white text-lg tracking-wide border-b border-zinc-900 pb-3 uppercase flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-500" /> 1. Alchemical Parameters
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block mb-1.5">Sorcerer Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-zinc-950 border border-zinc-900 focus:border-amber-500/40 p-3 rounded-lg text-sm font-mono text-zinc-200 outline-none"
                      placeholder="e.g., Alistair Void"
                      value={booking.name || ''}
                      onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block mb-1.5">Astral Email</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-zinc-950 border border-zinc-900 focus:border-amber-500/40 p-3 rounded-lg text-sm font-mono text-zinc-200 outline-none"
                      placeholder="e.g., void@eclipse.com"
                      value={booking.email || ''}
                      onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block mb-1.5">Lunar Date</label>
                    <input
                      required
                      type="date"
                      className="w-full bg-zinc-950 border border-zinc-900 focus:border-amber-500/40 p-3 rounded-lg text-sm font-mono text-zinc-200 outline-none"
                      value={booking.date || ''}
                      onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block mb-1.5">Hour Circle</label>
                    <select
                      className="w-full bg-zinc-950 border border-zinc-900 focus:border-amber-500/40 p-3 rounded-lg text-sm font-mono text-zinc-300 outline-none cursor-pointer"
                      value={booking.timeSlot}
                      onChange={(e) => setBooking({ ...booking, timeSlot: e.target.value })}
                    >
                      {timeSlots.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block mb-1.5">Party Alignment Size (+${booking.partySize ? booking.partySize * 2 : 0} Ritual cost)</label>
                    <div className="flex gap-2">
                      {[1, 2, 4, 6, 8].map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setBooking({ ...booking, partySize: size })}
                          className={`flex-1 py-2 rounded-lg border text-sm font-mono cursor-pointer transition ${
                            booking.partySize === size 
                              ? 'bg-amber-500 border-amber-500 text-zinc-950 font-bold' 
                              : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                          }`}
                        >
                          {size} {size === 1 ? 'Soul' : 'Souls'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block">2. Chamber Atmosphere</label>
                  <div className="flex flex-col gap-3">
                    {chambers.map(c => {
                      const Icon = c.icon;
                      const active = booking.chamber === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setBooking({ ...booking, chamber: c.id as any })}
                          className={`p-4 rounded-xl border text-left flex gap-4 items-center cursor-pointer transition ${
                            active 
                              ? 'bg-amber-500/10 border-amber-500/80 text-white shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                              : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:bg-zinc-900/10 hover:border-zinc-800'
                          }`}
                        >
                          <div className="p-2 bg-zinc-950 border border-zinc-900/60 rounded-lg shrink-0">
                            <Icon className="w-5 h-5 text-amber-500" />
                          </div>
                          <div>
                            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">{c.name}</div>
                            <div className="text-[11px] text-zinc-500 mt-0.5 leading-normal">{c.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column (5/12): Seating Grid Maps */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-white text-lg tracking-wide border-b border-zinc-900 pb-3 uppercase flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-amber-500" /> 3. Select Seated Altar
                  </h4>
                  <p className="text-[11px] font-mono text-zinc-500 mt-2 mb-4 leading-relaxed">
                    Select a glowing golden circle on our virtual chamber layout map to bind your exact seating coordinates.
                  </p>

                  {/* Seating Map Canvas Mock */}
                  <div className="relative w-full aspect-square bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden p-4 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                    
                    {/* Grid texture line */}
                    <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_20%,rgba(0,0,0,0.9)_100%] opacity-40" />
                    <div className="absolute inset-0 border border-dashed border-zinc-900/40 rounded-lg pointer-events-none" />

                    {/* Stage/Altar Icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-dashed border-amber-500/20 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[8px] font-mono text-amber-500/40 uppercase tracking-widest text-center leading-none">Astrolabe<br />Core</span>
                    </div>

                    {/* Standard Table Pins */}
                    {tables.map(t => {
                      const selected = selectedTable === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          disabled={!t.available}
                          onClick={() => setSelectedTable(t.id)}
                          className={`absolute w-10 h-10 rounded-full border flex flex-col items-center justify-center transition-all ${
                            !t.available 
                              ? 'bg-zinc-950 border-zinc-900 text-zinc-700 cursor-not-allowed opacity-30'
                              : selected 
                                ? 'bg-amber-500 border-amber-500 text-zinc-950 font-bold scale-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                                : 'bg-zinc-900 border-zinc-800 text-amber-500/80 hover:border-amber-500/40 cursor-pointer'
                          }`}
                          style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}
                        >
                          <span className="text-[9px] font-mono font-bold leading-none">{t.name}</span>
                          <span className="text-[7px] font-mono opacity-80 leading-none mt-0.5">p{t.size}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex justify-between text-[11px] font-mono text-zinc-500 px-1">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> SECURED/YOURS</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" /> VACANT/AVAILABLE</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-zinc-950 opacity-40" /> BOOKED / VOID</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-900 mt-6 lg:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-4 bg-amber-500 text-zinc-950 font-mono font-bold uppercase rounded-xl shadow-lg cursor-pointer transition text-xs tracking-widest flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" /> Finalize Astral Seance Booking
                  </motion.button>
                  <p className="text-[9px] font-mono text-zinc-600 text-center mt-2.5 leading-relaxed">
                    By reserving your spot, you agree to step into the Eclipse safely. We maintain zero-lighting candle atmospheres during Witching circle hours.
                  </p>
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <CheckCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-white tracking-widest uppercase">
                Seance Bound Successfully
              </h3>
              <p className="text-amber-500 shrink-0 font-mono text-xs tracking-widest uppercase mt-2">
                Alignment Date: {booking.date} @ {booking.timeSlot}
              </p>
              
              <div className="my-8 max-w-lg bg-zinc-950/80 border border-zinc-900/80 rounded-2xl p-6 text-left font-mono text-xs text-zinc-400 space-y-3">
                <div className="border-b border-zinc-900 pb-2 text-zinc-200 font-bold uppercase tracking-widest text-center">Ritual Scroll</div>
                <div><span className="text-zinc-500">Initiate:</span> <span className="text-zinc-300 font-bold">{booking.name}</span></div>
                <div><span className="text-zinc-500">Contact Email:</span> <span className="text-zinc-300">{booking.email}</span></div>
                <div><span className="text-zinc-500">Selected Sanctum:</span> <span className="text-zinc-300 text-amber-500 font-bold">{booking.chamber?.replace('-', ' ')}</span></div>
                <div><span className="text-zinc-500">Assigned Altar:</span> <span className="text-zinc-100 font-bold">Table #{selectedTable} (Size {tables.find(t => t.id === selectedTable)?.size} souls)</span></div>
                <div className="border-t border-zinc-900 pt-2 flex justify-between items-center text-[10px] text-zinc-500">
                  <span>Ritual alignment cost:</span>
                  <span className="text-amber-500 font-bold">${((booking.partySize || 2) * 2).toFixed(2)} (Billed at arrival)</span>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="px-6 py-3 border border-zinc-800 text-zinc-300 font-mono text-xs uppercase tracking-wider rounded-lg cursor-pointer hover:border-zinc-700"
                >
                  Book Another Table
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
