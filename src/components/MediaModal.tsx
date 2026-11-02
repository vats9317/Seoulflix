import React, { useState, useEffect } from 'react';
import { X, Play, Heart, Star, Sparkles, Tv, Share2, Check, ExternalLink, Film, Volume2, Globe, Zap } from 'lucide-react';
import { KDramaItem } from '../types';
import { fetchMediaCredits, fetchTrailerForMedia } from '../services/tmdbApi';

interface MediaModalProps {
  item: KDramaItem | null;
  onClose: () => void;
  onOpenWatch: (item: KDramaItem, episodeNumber?: number) => void;
  onOpenTrailer: (trailerId: string, title: string) => void;
  isItemInWatchlist: (id: string | number) => boolean;
  onToggleWatchlist: (item: KDramaItem) => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({
  item,
  onClose,
  onOpenWatch,
  onOpenTrailer,
  isItemInWatchlist,
  onToggleWatchlist
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'episodes' | 'cast'>('about');
  const [copied, setCopied] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingMessage, setRatingMessage] = useState<string | null>(null);
  const [castList, setCastList] = useState(item?.cast || []);
  const [trailerKey, setTrailerKey] = useState<string | null>(item?.trailerYoutubeId || null);

  useEffect(() => {
    if (!item) return;
    
    // Check local storage for user's previous rating
    const savedRatings = JSON.parse(localStorage.getItem('seoulflix_ratings') || '{}');
    if (savedRatings[item.id]) {
      setUserRating(savedRatings[item.id]);
    } else {
      setUserRating(null);
    }

    setTrailerKey(item.trailerYoutubeId || null);

    // Fetch live credits from TMDB if not already rich
    if (!item.cast || item.cast.length <= 2) {
      fetchMediaCredits(item.id, item.type).then((credits) => {
        if (credits && credits.length > 0) {
          setCastList(credits);
        }
      });
    } else {
      setCastList(item.cast);
    }

    // Fetch trailer if missing
    if (!item.trailerYoutubeId) {
      fetchTrailerForMedia(item.id, item.type).then((key) => {
        if (key) setTrailerKey(key);
      });
    }

  }, [item]);

  if (!item) return null;

  const inWatchlist = isItemInWatchlist(item.id);

  const handleRate = (star: number) => {
    setUserRating(star);
    const savedRatings = JSON.parse(localStorage.getItem('seoulflix_ratings') || '{}');
    savedRatings[item.id] = star;
    localStorage.setItem('seoulflix_ratings', JSON.stringify(savedRatings));
    setRatingMessage(`आपने ${star} स्टार रेटिंग दी! धन्यवाद!`);
    setTimeout(() => setRatingMessage(null), 3000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#12141e] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl my-auto text-white flex flex-col max-h-[92vh]"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105"
          title="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          
          {/* Backdrop Header with Play Watch Overlay */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 bg-black">
            <img
              src={item.backdropUrl || item.posterUrl}
              alt={item.titleHindi}
              className="w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12141e] via-[#12141e]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#12141e] via-transparent to-transparent" />

            {/* Big Watch Button Floating on Backdrop */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => {
                  onClose();
                  onOpenWatch(item, 1);
                }}
                className="flex items-center gap-3 px-7 py-3.5 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-2xl shadow-2xl shadow-red-600/60 backdrop-blur-md hover:scale-105 transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-5 h-5 fill-white translate-x-0.5" />
                </div>
                <span className="text-sm sm:text-base">
                  {item.type === 'tv' ? 'सीरीज़ अभी देखें (Watch Episodes)' : 'पूरी फ़िल्म अभी देखें (Watch Movie)'}
                </span>
              </button>
            </div>

            {/* Poster thumbnail & Quick Info over Backdrop */}
            <div className="absolute bottom-4 left-4 sm:left-8 right-4 flex items-end gap-4 sm:gap-6">
              <img
                src={item.posterUrl}
                alt={item.titleHindi}
                className="w-24 sm:w-32 lg:w-36 aspect-[2/3] object-cover rounded-xl shadow-2xl border-2 border-white/10 hidden xs:block"
              />
              <div className="flex-1 space-y-1 sm:space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {item.isHindiDubbed && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-black bg-amber-400 text-gray-950 shadow-md shadow-amber-400/30">
                      <Sparkles className="w-3 h-3 fill-gray-950" />
                      हिंदी डब
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/10 text-gray-200">
                    {item.type === 'tv' ? 'कोरियन सीरीज़' : 'कोरियन मूवी'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                    {item.rating} ★ ({item.voteCount} वोट)
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                  {item.titleHindi}
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 font-medium">
                  <span className="text-red-400 font-bold">{item.titleOriginal}</span> • {item.titleEnglish} • {item.releaseYear}
                </p>
              </div>
            </div>

          </div>

          {/* Modal Main Body */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex flex-wrap items-center gap-2.5">
                
                {/* Watch Online Button */}
                <button
                  onClick={() => {
                    onClose();
                    onOpenWatch(item, 1);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-red-600/30"
                >
                  <Play className="w-4 h-4 fill-white" />
                  ऑनलाइन देखें (Watch Now)
                </button>

                {trailerKey && (
                  <button
                    onClick={() => onOpenTrailer(trailerKey, item.titleHindi)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-xl transition-all border border-white/10"
                  >
                    ट्रेलर देखें
                  </button>
                )}

                <button
                  onClick={() => onToggleWatchlist(item)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                    inWatchlist
                      ? 'bg-red-600/30 border-red-500 text-red-400'
                      : 'bg-white/5 hover:bg-white/10 border-white/15 text-gray-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWatchlist ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{inWatchlist ? "वॉचलिस्ट में मौजूद" : "वॉचलिस्ट"}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 rounded-xl text-xs sm:text-sm transition-all"
                  title="लिंक साझा करें"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? "कॉपी किया!" : "शेयर"}</span>
                </button>
              </div>

              {/* Interactive Star Rating */}
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <span className="text-xs text-gray-400 font-medium">आपकी रेटिंग:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      className="p-1 hover:scale-125 transition-transform"
                      title={`${star} स्टार दें`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          (userRating || 0) >= star
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-500 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {ratingMessage && (
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs text-center font-medium animate-fade-in">
                {ratingMessage}
              </div>
            )}

            {/* Quality & Data Saver Banner in Details Modal */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 sm:p-3.5 bg-white/5 rounded-2xl border border-white/10 text-xs">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-gray-300">स्ट्रीमिंग रिज़ॉल्यूशन:</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-[11px]">1080p FHD</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">720p HD</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-[11px]">480p SD</span>
                <span className="px-2 py-0.5 rounded-md bg-green-500/20 border border-green-500/40 text-green-300 font-bold text-[11px] flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-green-400" />
                  डेटा सेवर (360p)
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenWatch(item, 1);
                }}
                className="text-red-400 hover:text-red-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>प्लेयर में क्वालिटी चुनें</span>
                <span>→</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10">
              <button
                onClick={() => setActiveTab('about')}
                className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'about'
                    ? 'border-red-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                कहानी व सारांश (Story)
              </button>
              {item.type === 'tv' && (
                <button
                  onClick={() => setActiveTab('episodes')}
                  className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all ${
                    activeTab === 'episodes'
                      ? 'border-red-500 text-white'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  एपिसोड्स व वॉच सूची ({item.episodesCount || 16})
                </button>
              )}
              <button
                onClick={() => setActiveTab('cast')}
                className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'cast'
                    ? 'border-red-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                कलाकार (Cast & Crew)
              </button>
            </div>

            {/* Tab: About & Streaming */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                {/* Hindi Overview */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 uppercase tracking-wider">
                    <Globe className="w-4 h-4 text-red-400" />
                    हिंदी में कहानी का विवरण
                  </h3>
                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal bg-white/5 p-4 rounded-2xl border border-white/5">
                    {item.overviewHindi}
                  </p>
                </div>

                {/* Audio and Subtitle Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">उपलब्ध ऑडियो ट्रैक</p>
                      <p className="text-xs sm:text-sm font-bold text-white">
                        {item.isHindiDubbed ? "हिंदी ऑडियो (डब) + ओरिजिनल कोरियन" : "कोरियन ऑडियो (मूल भाषा)"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-red-500/20 text-red-400">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">सबटाइटल सपोर्ट</p>
                      <p className="text-xs sm:text-sm font-bold text-white">
                        हिंदी सबटाइटल एवं इंग्लिश सबटाइटल
                      </p>
                    </div>
                  </div>
                </div>

                {/* Where to Watch / Streaming Providers */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                    आधिकारिक स्ट्रीमिंग ऐप्स (Official Watch Providers)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {item.streamingPlatforms.map((platform, idx) => (
                      <a
                        key={idx}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3.5 rounded-xl bg-[#1a1d2d] hover:bg-[#23273c] border border-white/10 hover:border-red-500/50 transition-all group"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                            {platform.name}
                          </p>
                          {platform.badge && (
                            <span className="text-[10px] text-amber-400 font-semibold">
                              {platform.badge}
                            </span>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Genre & Meta tags */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-gray-400 font-medium">शैलियाँ (Genres):</span>
                  {item.genres.map((g, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10">
                      {g}
                    </span>
                  ))}
                </div>

              </div>
            )}

            {/* Tab: Episodes (For TV Series) */}
            {activeTab === 'episodes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">सीजन 1 — सभी एपिसोड्स</h3>
                    <p className="text-xs text-gray-400">किसी भी एपिसोड पर क्लिक करके उसे सीधे ऐप में देखें</p>
                  </div>
                  <span className="text-xs text-red-400 font-bold bg-red-950/60 border border-red-500/30 px-2.5 py-1 rounded-lg">
                    कुल {item.episodesCount || 16} एपिसोड्स
                  </span>
                </div>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {(item.episodesList && item.episodesList.length > 0) ? (
                    item.episodesList.map((ep) => (
                      <div 
                        key={ep.episodeNumber}
                        className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center text-xs font-bold">
                              {ep.episodeNumber}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                              {ep.titleHindi}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 pl-8 leading-relaxed">
                            {ep.overviewHindi}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3 pl-8 sm:pl-0 flex-shrink-0">
                          <span className="text-xs text-gray-400 font-medium">{ep.duration}</span>
                          <button
                            onClick={() => {
                              onClose();
                              onOpenWatch(item, ep.episodeNumber);
                            }}
                            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all hover:scale-105"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            देखें (Watch)
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    Array.from({ length: item.episodesCount || 16 }).map((_, i) => (
                      <div 
                        key={i}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-white">
                              एपिसोड {i + 1} — {item.titleHindi}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              हिंदी ऑडियो एवं सबटाइटल के साथ उपलब्ध
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            onClose();
                            onOpenWatch(item, i + 1);
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          देखें
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab: Cast */}
            {activeTab === 'cast' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                  प्रमुख अभिनेता व किरदार (Stars & Characters)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {castList.map((actor, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center text-center space-y-2 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white/10 border border-white/10">
                        {actor.photo ? (
                          <img 
                            src={actor.photo} 
                            alt={actor.name}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-red-400 font-bold text-lg bg-red-950/40">
                            {actor.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                          {actor.name}
                        </p>
                        <p className="text-[11px] text-gray-400 line-clamp-1">
                          {actor.character}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal Bottom Sticky Bar */}
        <div className="px-4 sm:px-6 py-3 bg-[#0d0f17] border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <span>SeoulFlix हिंदी • TMDB एवं आधिकारिक स्ट्रीमिंग सेवा द्वारा संचालित</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
