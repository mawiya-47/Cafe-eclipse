import { motion, AnimatePresence } from 'motion/react';
import { CartItem, CoffeeItem } from '../types';
import { 
  X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, RotateCcw, Clock, Coffee
} from 'lucide-react';
import { useState } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (idx: number, delta: number) => void;
  onRemoveItem: (idx: number) => void;
  onClearCart: () => void;
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQty, 
  onRemoveItem, 
  onClearCart 
}: CartDrawerProps) {
  const [isFinishing, setIsFinishing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.coffee.price;
    return acc + (itemPrice * item.quantity);
  }, 0);

  const deliveryFee = subtotal > 0 ? 3.00 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsFinishing(true);
    
    // Simulate celestial compile of dark order
    setTimeout(() => {
      const code = `EC-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 89)}`;
      setOrderCode(code);
      setIsFinishing(false);
      setOrderComplete(true);
    }, 2800);
  };

  const handleRestart = () => {
    onClearCart();
    setOrderComplete(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 pointer-events-auto"
            id="cart-overlay"
          />

          {/* Sider Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 150 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-zinc-900 shadow-2xl z-50 flex flex-col justify-between"
            id="order-drawer"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-950">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <span className="font-serif text-white tracking-widest font-semibold uppercase text-sm">
                  Lunar Order Drawer
                </span>
                {cartItems.length > 0 && (
                  <span className="bg-amber-500 text-zinc-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                    {cartItems.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </div>
              <button 
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Panels */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence mode="popLayout">
                {orderComplete ? (
                  /* Success Manifest Screen */
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 flex flex-col items-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5 animate-pulse">
                      <CheckCircle2 className="w-7 h-7 text-amber-500" />
                    </div>
                    <h3 className="font-serif text-white text-lg uppercase tracking-wider">ORDER SECURED & BOUND</h3>
                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                      Your celestial espresso formulation has been compiled by the baristas. Keep your code for arrival.
                    </p>

                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 w-full mt-6 space-y-3.5 text-left font-mono text-xs">
                      <div className="text-zinc-500 border-b border-zinc-900 pb-2 text-center text-[10px] tracking-widest uppercase">Eclipse Slip</div>
                      <div className="flex justify-between">
                        <span>Ritual Order Code:</span>
                        <span className="text-amber-500 font-bold font-mono tracking-wider">{orderCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-emerald-500 animate-pulse font-bold flex items-center gap-1">● INFUSING</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ready In:</span>
                        <span className="text-zinc-300 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~12 mins</span>
                      </div>
                      <div className="border-t border-zinc-900 pt-2 flex justify-between font-bold text-zinc-200">
                        <span>Total amount:</span>
                        <span className="text-amber-400 font-bold">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleRestart}
                      className="mt-8 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono text-xs font-semibold tracking-wider rounded-lg uppercase cursor-pointer flex items-center gap-2 transition"
                    >
                      <RotateCcw className="w-4 h-4" /> Synthesize New Order
                    </button>
                  </motion.div>
                ) : isFinishing ? (
                  /* Loading screen with alchemical spinner */
                  <motion.div 
                    key="compiling"
                    className="h-full flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-zinc-900" />
                      <div className="absolute inset-1 rounded-full border-t-2 border-amber-500 animate-spin" style={{ animationDuration: '0.8s' }} />
                      <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
                    </div>
                    <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">Binding Atoms...</span>
                    <h4 className="font-serif text-white text-md mt-2 tracking-wide uppercase">Manifesting Elixir Slip</h4>
                    <p className="text-zinc-600 text-xs max-w-xs mx-auto mt-2 font-light leading-relaxed">
                      We are distilling your selected charcoal milk elements, grounding star dust, and organizing your table seating chart. Please maintain connection.
                    </p>
                  </motion.div>
                ) : cartItems.length > 0 ? (
                  /* Cart standard rows */
                  cartItems.map((item, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      key={`${item.coffee.id}-${idx}`}
                      className="flex gap-4 p-3 rounded-xl bg-zinc-950/60 border border-zinc-900/60 items-start hover:bg-zinc-900/15"
                    >
                      <img
                        src={item.coffee.image}
                        alt={item.coffee.name}
                        className="w-16 h-16 rounded-lg object-cover bg-zinc-900 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-zinc-200 text-xs font-medium tracking-wide truncate">
                            {item.coffee.name}
                          </h4>
                          <span className="font-mono text-amber-500 font-bold text-xs shrink-0">
                            ${(item.coffee.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        
                        {item.coffee.mysticalIngredient && (
                          <div className="text-[9px] text-zinc-500 font-mono mt-0.5 truncate">
                            Inf: {item.coffee.mysticalIngredient}
                          </div>
                        )}

                        {item.customization && (
                          <div className="text-[9px] text-zinc-500 font-mono mt-0.5 bg-zinc-950 px-2 py-1 rounded inline-block">
                            Milk: {item.customization.milk} • Syrup: {item.customization.sweetener}
                          </div>
                        )}

                        {/* Controls row */}
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center border border-zinc-900 rounded bg-zinc-950 text-xs overflow-hidden font-mono">
                            <button 
                              onClick={() => onUpdateQty(idx, -1)}
                              className="px-2 py-1 text-zinc-500 hover:text-zinc-200 transition cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 py-1 text-zinc-300 font-bold border-x border-zinc-900">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => onUpdateQty(idx, 1)}
                              className="px-2 py-1 text-zinc-500 hover:text-zinc-200 transition cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(idx)}
                            className="text-zinc-600 hover:text-red-400 transition cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  /* Empty state */
                  <div className="h-64 flex flex-col items-center justify-center text-center">
                    <Coffee className="w-9 h-9 text-zinc-800 mb-3 animate-pulse" />
                    <h5 className="font-serif text-zinc-400 text-xs font-light uppercase tracking-wider">Empty Urn</h5>
                    <p className="text-zinc-600 text-xs max-w-xs mt-1.5 leading-relaxed font-light">
                      No customized dark roasts have been summoned. Return to our Catalog, click "Summon", and let they manifest here.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Sticky footer with billing summary */}
            {!orderComplete && !isFinishing && cartItems.length > 0 && (
              <div className="p-6 border-t border-zinc-900 bg-zinc-950 font-mono text-xs space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-zinc-500">
                    <span>Artifacts Subtotal:</span>
                    <span className="text-zinc-300">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Witching Delivery Fee:</span>
                    <span className="text-zinc-300">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-zinc-900/60 pt-2 mt-2 flex justify-between font-bold text-zinc-200">
                    <span>Final Amount:</span>
                    <span className="text-amber-500 text-sm font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(245,158,11,0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full py-4 bg-amber-500 text-zinc-950 font-semibold uppercase rounded-xl shadow-lg cursor-pointer transition text-xs tracking-widest flex items-center justify-center gap-2"
                  >
                    Bind Obsidian Order <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  <p className="text-[9px] text-zinc-600 text-center mt-2.5 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-600 shrink-0" /> Decanted with extreme gothic precision.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
