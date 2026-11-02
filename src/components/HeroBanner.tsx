import React, { useState, useEffect } from 'react';
import { Play, Info, Heart, Star, Sparkles, ChevronRight, ChevronLeft, Tv } from 'lucide-react';
import { KDramaItem } from '../types';

interface HeroBannerProps {
  featuredItems: KDramaItem[];
  onOpenDetails: (item: KDramaItem) => void;
  onOpenWatch: (item: KDramaItem) => void;
  onOpenTrailer: (trailerId: string, title: string) => void;
  isItemInWatchlist: (id: string | number) => boolean;
  onToggleWatchlist: (item: KDramaItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredItems,
  onOpenDetails,
  onOpenWatch,
  onOpenTrailer,
  isItemInWatchlist,
  onToggleWatchlist
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate every 8 seconds
  useEffect(() => {
    if (featuredItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredItems.length]);

  if (!featuredItems || featuredItems.length === 0) {
    return null;
  }

  const current = featuredItems[currentIndex] || featuredItems[0];
  const inWatchlist = isItemInWatchlist(current.id);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden bg-black select-none">
      {/* Background Backdrop Image */}
      <div 
        key={current.id}
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{
          backgroundImage: `url(${current.backdropUrl})`,
        }}
      >
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/80 to-transparent w-full lg:w-3/4" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0b0c10]/40 to-[#0b0c10]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-2xl lg:max-w-3xl space-y-3 sm:space-y-4">
          
          {/* Badges Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-black bg-red-600 text-white tracking-wider shadow-lg shadow-red-600/40">
              #1 ट्रेंडिंग ब्लॉकबस्टर
            </span>
            {current.isHindiDubbed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-400 text-gray-950 shadow-md shadow-amber-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                हिंदी डब ऑडियो
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white/10 backdrop-blur-sm text-yellow-400 border border-white/10">
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              {current.rating} ★
            </span>
            <span className="text-xs font-medium text-gray-300 px-2 py-1 bg-black/40 rounded border border-white/5">
              {current.releaseYear} • {current.type === 'tv' ? `${current.episodesCount || 16} एपिसोड्स` : current.duration}
            </span>
          </div>

          {/* Hindi Title */}
          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {current.titleHindi}
            </h1>
            <div className="flex items-center gap-3 mt-1.5 text-xs sm:text-sm text-gray-300 font-medium">
              <span className="text-red-400 font-bold">{current.titleOriginal}</span>
              <span>•</span>
              <span className="text-gray-400">{current.titleEnglish}</span>
              {current.tagline && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline italic text-gray-300 font-normal">"{current.tagline}"</span>
                </>
              )}
            </div>
          </div>

          {/* Hindi Synopsis */}
          <p className="text-xs sm:text-sm lg:text-base text-gray-200 font-normal line-clamp-3 leading-relaxed max-w-2xl drop-shadow">
            {current.overviewHindi}
          </p>

          {/* Action Buttons: Watch Now, Trailer, Details */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            
            {/* Direct Watch Now Button */}
            <button
              onClick={() => onOpenWatch(current)}
              className="flex items-center gap-2 px-6 sm:px-7 py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xl shadow-red-600/40"
            >
              <Play className="w-4 h-4 fill-white" />
              अभी ऑनलाइन देखें (Watch Now)
            </button>

            {current.trailerYoutubeId && (
              <button
                onClick={() => onOpenTrailer(current.trailerYoutubeId!, current.titleHindi)}
                className="flex items-center gap-2 px-4 sm:px-5 py-3 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-md border border-white/20 transition-all"
              >
                हिंदी ट्रेलर
              </button>
            )}

            <button
              onClick={() => onOpenDetails(current)}
              className="flex items-center gap-2 px-4 sm:px-5 py-3 bg-white/10 hover:bg-white/20 active:scale-95 text-gray-200 font-medium text-xs sm:text-sm rounded-xl backdrop-blur-md border border-white/10 transition-all"
            >
              <Info className="w-4 h-4" />
              विवरण
            </button>

            <button
              onClick={() => onToggleWatchlist(current)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all backdrop-blur-md ${
                inWatchlist
                  ? 'bg-red-600/30 border-red-500 text-red-400'
                  : 'bg-black/40 hover:bg-white/10 border-white/20 text-gray-200'
              }`}
              title={inWatchlist ? "वॉचलिस्ट से हटाएं" : "वॉचलिस्ट में जोड़ें"}
            >
              <Heart className={`w-4 h-4 ${inWatchlist ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

        </div>

        {/* Bottom Carousel Thumbnail Selector & Nav arrows (Desktop) */}
        <div className="absolute right-4 sm:right-8 bottom-8 sm:bottom-12 hidden md:flex items-center gap-3 z-20">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/10 transition-colors"
            title="पिछला"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            {featuredItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-16 h-10 ring-2 ring-red-500 scale-105'
                    : 'w-12 h-8 opacity-60 hover:opacity-100'
                }`}
              >
                <img 
                  src={item.posterUrl} 
                  alt={item.titleHindi} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/10 transition-colors"
            title="अगला"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile dots */}
        <div className="flex md:hidden items-center justify-center gap-1.5 pt-4">
          {featuredItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === idx ? 'w-6 bg-red-500' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
