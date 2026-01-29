
import React from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ColorDefinition, Direction } from '../types';
import { APP_CONFIG } from '../constants';

interface SwipeCardProps {
  color: ColorDefinition;
  onSwipe: (direction: Direction) => void;
  isFront: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ color, onSwipe, isFront }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(
    [x, y], 
    ([latestX, latestY]) => {
      const distance = Math.sqrt(Math.pow(Number(latestX), 2) + Math.pow(Number(latestY), 2));
      return Math.max(1 - distance / 500, 0.5);
    }
  );

  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset } = info;
    const absX = Math.abs(offset.x);
    const absY = Math.abs(offset.y);

    if (absX > APP_CONFIG.SWIPE_THRESHOLD || absY > APP_CONFIG.SWIPE_THRESHOLD) {
      if (absX > absY) {
        onSwipe(offset.x > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onSwipe(offset.y > 0 ? 'DOWN' : 'UP');
      }
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate, opacity }}
      whileTap={{ scale: 0.96 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
    >
      <div className={`w-72 h-[420px] rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border-[12px] ${color.bgTailwind} ${color.borderTailwind} flex flex-col items-center justify-center text-white relative overflow-hidden`}>
        {/* Interior Surface */}
        <div className="absolute inset-2 bg-black/10 rounded-[2.8rem] pointer-events-none" />
        
        {/* Subtle Texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <svg width="100%" height="100%">
             <filter id="grainy">
               <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
             </filter>
             <rect width="100%" height="100%" filter="url(#grainy)" />
           </svg>
        </div>

        {/* Target Sample Container */}
        <div className="z-10 bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/20 shadow-2xl flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white shadow-2xl mb-8 flex items-center justify-center overflow-hidden ring-8 ring-black/10">
             <div className={`w-full h-full ${color.bgTailwind} transition-colors duration-500`} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Swatch Sample</p>
            <div className="w-8 h-1 bg-white/20 rounded-full" />
          </div>
        </div>

        {/* Luxury Reflection */}
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-12 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default SwipeCard;
