import React from 'react';
import { X } from 'lucide-react';

interface TrailerModalProps {
  trailerId: string | null;
  title: string;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  trailerId,
  title,
  onClose
}) => {
  if (!trailerId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#141622] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0e1019]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
              {title} — आधिकारिक हिंदी / सबटाइटल ट्रेलर
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Frame */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#0e1019] text-xs text-gray-400 flex items-center justify-between">
          <span>आधिकारिक यूट्यूब प्लेयर • SeoulFlix Korea</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
          >
            खिड़की बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
