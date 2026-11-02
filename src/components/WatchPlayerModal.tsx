import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  SkipForward, 
  SkipBack, 
  Sparkles, 
  Server, 
  Tv, 
  Film, 
  ExternalLink, 
  Heart, 
  Share2, 
  Check, 
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Radio,
  Zap,
  Sliders,
  Settings2,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { KDramaItem } from '../types';

export type VideoResolution = 'auto' | '1080p' | '720p' | '480p' | '360p';

export interface ResolutionOption {
  id: VideoResolution;
  label: string;
  hindiLabel: string;
  qualityBadge: string;
  dataRate: string;
  descHindi: string;
  badgeColor: string;
  isDataSaver?: boolean;
}

export const RESOLUTION_OPTIONS: ResolutionOption[] = [
  {
    id: 'auto',
    label: 'Auto',
    hindiLabel: 'ऑटो',
    qualityBadge: 'स्मार्ट ऑटो',
    dataRate: 'स्पीड अनुसार',
    descHindi: 'नेटवर्क स्पीड के अनुसार स्वचालित रूप से सर्वश्रेष्ठ क्वालिटी चुनेगा',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  },
  {
    id: '1080p',
    label: '1080p FHD',
    hindiLabel: 'फुल HD (1080p)',
    qualityBadge: '1080p फुल एचडी',
    dataRate: '~1.8-2.5 GB / घंटा',
    descHindi: 'अल्ट्रा क्रिस्प और क्रिस्टल क्लियर सिनेमाई अनुभव (हाई-स्पीड वाईफाई/5G के लिए)',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  {
    id: '720p',
    label: '720p HD',
    hindiLabel: 'एचडी (740/720p)',
    qualityBadge: '720p HD',
    dataRate: '~800-1100 MB / घंटा',
    descHindi: 'बेस्ट बैलेंस्ड क्वालिटी: शानदार एचडी क्लैरिटी और तेज बफ़र-मुक्त स्ट्रीमिंग',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  {
    id: '480p',
    label: '480p SD',
    hindiLabel: 'मीडियम (480p)',
    qualityBadge: '480p SD',
    dataRate: '~350-500 MB / घंटा',
    descHindi: 'स्मार्टफोन और सामान्य 4G कनेक्शन के लिए उपयुक्त, 50% डेटा की बचत',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  {
    id: '360p',
    label: '360p डेटा सेवर',
    hindiLabel: 'डेटा सेवर (360p)',
    qualityBadge: '360p सेवर',
    dataRate: '~150-220 MB / घंटा (70% बचत)',
    descHindi: 'सुपर डेटा सेवर मोड: 70% तक मोबाइल डेटा बचाता है, कमजोर नेटवर्क पर भी स्मूथ',
    badgeColor: 'bg-green-500/20 text-green-300 border-green-500/30',
    isDataSaver: true
  }
];

interface WatchPlayerModalProps {
  item: KDramaItem;
  initialEpisode?: number;
  onClose: () => void;
  isItemInWatchlist: (id: string | number) => boolean;
  onToggleWatchlist: (item: KDramaItem) => void;
  initialDataSaver?: boolean;
  onToggleDataSaver?: () => void;
}

export const WatchPlayerModal: React.FC<WatchPlayerModalProps> = ({
  item,
  initialEpisode = 1,
  onClose,
  isItemInWatchlist,
  onToggleWatchlist,
  initialDataSaver = false,
  onToggleDataSaver
}) => {
  const [currentEpisode, setCurrentEpisode] = useState<number>(initialEpisode);
  const [activeServer, setActiveServer] = useState<number>(1);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState<boolean>(false);
  const [showQualityDetails, setShowQualityDetails] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data Saver and Resolution states with persistence
  const [dataSaverActive, setDataSaverActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('seoulflix_datasaver');
      if (saved !== null) return saved === 'true';
      return initialDataSaver;
    } catch {
      return initialDataSaver;
    }
  });

  const [resolution, setResolution] = useState<VideoResolution>(() => {
    try {
      const saved = localStorage.getItem('seoulflix_resolution');
      if (saved && ['auto', '1080p', '720p', '480p', '360p'].includes(saved)) {
        return saved as VideoResolution;
      }
      return initialDataSaver ? '360p' : '720p';
    } catch {
      return initialDataSaver ? '360p' : '720p';
    }
  });

  const inWatchlist = isItemInWatchlist(item.id);
  const totalEpisodes = item.episodesCount || 16;
  const isSeries = item.type === 'tv';

  useEffect(() => {
    setCurrentEpisode(initialEpisode);
  }, [initialEpisode]);

  // Handle Share Link
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Switch Resolution Handler
  const handleSelectResolution = (selectedRes: VideoResolution) => {
    setResolution(selectedRes);
    try {
      localStorage.setItem('seoulflix_resolution', selectedRes);
    } catch (e) {
      console.error(e);
    }

    if (selectedRes === '360p') {
      setDataSaverActive(true);
      try {
        localStorage.setItem('seoulflix_datasaver', 'true');
      } catch (e) {
        console.error(e);
      }
    } else if (dataSaverActive && selectedRes !== 'auto') {
      // User picked higher resolution, disable data saver mode
      setDataSaverActive(false);
      try {
        localStorage.setItem('seoulflix_datasaver', 'false');
      } catch (e) {
        console.error(e);
      }
      if (onToggleDataSaver) onToggleDataSaver();
    }

    setReloadKey(prev => prev + 1);
    const opt = RESOLUTION_OPTIONS.find(o => o.id === selectedRes);
    setToastMessage(`📺 वीडियो रिज़ॉल्यूशन ${opt?.label} पर सेट किया गया (${opt?.dataRate})`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Data Saver Mode
  const handleToggleDataSaver = () => {
    const nextState = !dataSaverActive;
    setDataSaverActive(nextState);
    try {
      localStorage.setItem('seoulflix_datasaver', String(nextState));
    } catch (e) {
      console.error(e);
    }

    if (onToggleDataSaver) {
      onToggleDataSaver();
    }

    if (nextState) {
      setResolution('360p');
      try {
        localStorage.setItem('seoulflix_resolution', '360p');
      } catch (e) {
        console.error(e);
      }
      setToastMessage("📉 डेटा सेवर मोड सक्रिय (360p): 70% तक इंटरनेट डेटा की बचत!");
    } else {
      setResolution('720p');
      try {
        localStorage.setItem('seoulflix_resolution', '720p');
      } catch (e) {
        console.error(e);
      }
      setToastMessage("🚀 डेटा सेवर बंद किया गया (720p HD मोड सक्रिय)");
    }

    setReloadKey(prev => prev + 1);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Determine stream embed URL based on active server, resolution and data saver
  const getEmbedUrl = (): string => {
    const qualityQuery = resolution === 'auto' ? '' : `&res=${resolution.replace('p', '')}&quality=${resolution}`;
    const dsQuery = dataSaverActive ? '&ds=1' : '';

    // Server 1: VidSrc TO (Fast 1080p full stream)
    if (activeServer === 1) {
      return isSeries 
        ? `https://vidsrc.to/embed/tv/${item.id}/1/${currentEpisode}?${qualityQuery}${dsQuery}`
        : `https://vidsrc.to/embed/movie/${item.id}?${qualityQuery}${dsQuery}`;
    }

    // Server 2: VidSrc ME (Multi-Audio & Multi-Language)
    if (activeServer === 2) {
      return isSeries 
        ? `https://vidsrc.me/embed/tv?tmdb=${item.id}&season=1&episode=${currentEpisode}${qualityQuery}${dsQuery}`
        : `https://vidsrc.me/embed/movie?tmdb=${item.id}${qualityQuery}${dsQuery}`;
    }

    // Server 3: 2Embed (High Availability Mirror)
    if (activeServer === 3) {
      return isSeries 
        ? `https://www.2embed.cc/embedtv/${item.id}&s=1&e=${currentEpisode}${qualityQuery}`
        : `https://www.2embed.cc/embed/${item.id}?${qualityQuery}`;
    }

    // Server 4: SmashyStream (Alternative HD Mirror)
    if (activeServer === 4) {
      return isSeries 
        ? `https://smashystream.xyz/embed-tv/${item.id}/1/${currentEpisode}?${qualityQuery}`
        : `https://smashystream.xyz/embed-movie/${item.id}?${qualityQuery}`;
    }

    // Server 5: VidSrc PM (Fast Direct Cloud Stream)
    if (activeServer === 5) {
      return isSeries 
        ? `https://vidsrc.pm/embed/tv?tmdb=${item.id}&season=1&episode=${currentEpisode}${qualityQuery}`
        : `https://vidsrc.pm/embed/movie?tmdb=${item.id}?${qualityQuery}`;
    }

    // Server 6: YouTube Trailer / Clips HD Preview
    if (activeServer === 6 && item.trailerYoutubeId) {
      let vqParam = '';
      if (resolution === '1080p') vqParam = '&vq=hd1080';
      else if (resolution === '720p') vqParam = '&vq=hd720';
      else if (resolution === '480p') vqParam = '&vq=medium';
      else if (resolution === '360p') vqParam = '&vq=small';

      return `https://www.youtube-nocookie.com/embed/${item.trailerYoutubeId}?autoplay=1&rel=0${vqParam}`;
    }

    // Default fallback
    return isSeries
      ? `https://vidsrc.to/embed/tv/${item.id}/1/${currentEpisode}?${qualityQuery}`
      : `https://vidsrc.to/embed/movie/${item.id}?${qualityQuery}`;
  };

  const handleOpenDirectStream = () => {
    const url = getEmbedUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleReloadPlayer = () => {
    setReloadKey(prev => prev + 1);
    setToastMessage("🔄 प्लेयर रीलोड किया गया");
    setTimeout(() => setToastMessage(null), 2000);
  };

  const currentResOption = RESOLUTION_OPTIONS.find(o => o.id === resolution) || RESOLUTION_OPTIONS[2];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/92 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#0d0f18] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[96vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#080910] border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
            <div className="truncate">
              <h2 className="text-sm sm:text-base font-black text-white truncate flex items-center gap-2">
                <span>{item.titleHindi}</span>
                {isSeries && (
                  <span className="text-red-400 font-bold text-xs sm:text-sm bg-red-950/70 border border-red-500/30 px-2 py-0.5 rounded-md">
                    सीजन 1 • एपिसोड {currentEpisode}
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-gray-400 truncate">
                {item.titleEnglish} • {item.titleOriginal} • {item.releaseYear} • {item.duration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Open Direct in New Tab Button */}
            <button
              onClick={handleOpenDirectStream}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-all cursor-pointer"
              title="ब्राउज़र के नए टैब में सीधे फुलस्क्रीन चलाएं (बिना किसी रुकावट के)"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>डायरेक्ट फुलस्क्रीन</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(item)}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                inWatchlist
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
              }`}
              title={inWatchlist ? "वॉचलिस्ट से हटाएं" : "वॉचलिस्ट में जोड़ें"}
            >
              <Heart className={`w-4 h-4 ${inWatchlist ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all cursor-pointer"
              title="शेयर करें"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-600 text-white border border-white/10 transition-colors cursor-pointer"
              title="प्लेयर बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Toast Feedback Notification */}
        {toastMessage && (
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between shadow-md animate-fade-in">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Main Area */}
        <div className="overflow-y-auto flex-1">
          
          {/* Main Video Cinema Container */}
          <div className="relative w-full aspect-video sm:max-h-[580px] bg-black select-none flex items-center justify-center">
            <iframe
              key={`${activeServer}-${currentEpisode}-${resolution}-${dataSaverActive}-${reloadKey}`}
              src={getEmbedUrl()}
              title={`${item.titleHindi} - एपिसोड ${currentEpisode} (${resolution})`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              referrerPolicy="origin"
              className="w-full h-full border-0"
            />
          </div>

          {/* Quick Action Bar Under Video */}
          <div className="p-3 sm:p-4 bg-[#111422] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Active Resolution Live Badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${currentResOption.badgeColor}`}>
                <Radio className="w-3 h-3 animate-pulse" />
                {currentResOption.qualityBadge}
              </span>
              
              {/* Data Saver Mode Pill Badge */}
              {dataSaverActive && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-bold animate-pulse">
                  <Zap className="w-3 h-3 fill-green-400" />
                  डेटा सेवर सक्रिय (~70% बचत)
                </span>
              )}

              {item.isHindiDubbed && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-3 h-3" />
                  हिंदी ऑडियो / डब
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Reload Button */}
              <button
                onClick={handleReloadPlayer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-all cursor-pointer"
                title="वीडियो प्लेयर को दोबारा लोड करें"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रीलोड प्लेयर</span>
              </button>

              {/* Direct Link button on mobile */}
              <button
                onClick={handleOpenDirectStream}
                className="sm:hidden flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md shadow-red-600/30 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>डायरेक्ट स्ट्रीम</span>
              </button>

              {/* Quality Guide info toggle */}
              <button
                onClick={() => setShowQualityDetails(prev => !prev)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                  showQualityDetails 
                    ? 'bg-red-600/20 border-red-500/50 text-red-400' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
                }`}
                title="डेटा खपत और क्वालिटी तुलना चार्ट देखें"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden md:inline">डेटा बचत चार्ट</span>
                {showQualityDetails ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
              </button>

              {/* Troubleshooting hint toggle */}
              <button
                onClick={() => setShowTroubleshoot(prev => !prev)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">सहायता</span>
              </button>
            </div>
          </div>

          {/* DEDICATED RESOLUTION & DATA SAVER SELECTOR BAR */}
          <div className="p-4 sm:p-5 bg-[#0e111c] border-b border-white/10 space-y-3.5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              
              {/* Left: Resolution Buttons Strip */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Settings2 className="w-3.5 h-3.5 text-red-500" />
                    वीडियो रिज़ॉल्यूशन (Resolution Options):
                  </span>
                  <span className="text-[11px] text-gray-400">
                    अपनी इंटरनेट स्पीड या डेटा कोटा के अनुसार चुनें
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {RESOLUTION_OPTIONS.map((opt) => {
                    const isSelected = resolution === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectResolution(opt.id)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30 scale-[1.02]'
                            : opt.isDataSaver
                            ? 'bg-green-950/30 hover:bg-green-900/40 border-green-500/30 text-green-300'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
                        }`}
                        title={opt.descHindi}
                      >
                        {opt.isDataSaver && (
                          <Zap className={`w-3.5 h-3.5 ${isSelected ? 'fill-white' : 'fill-green-400 text-green-400'}`} />
                        )}
                        <span>{opt.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-400'}`}>
                          {opt.dataRate.split('/')[0].trim()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Master Data Saver Toggle Button */}
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={handleToggleDataSaver}
                  className={`w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer shadow-md ${
                    dataSaverActive
                      ? 'bg-gradient-to-r from-emerald-600 to-green-700 border-emerald-400 text-white shadow-emerald-900/50'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
                  }`}
                  title={dataSaverActive ? "डेटा सेवर बंद करें" : "डेटा सेवर मोड चालू करें (60-70% डेटा की बचत)"}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${dataSaverActive ? 'bg-white/20' : 'bg-white/10'}`}>
                      <Zap className={`w-4 h-4 ${dataSaverActive ? 'fill-white text-white' : 'text-gray-400'}`} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black">
                        {dataSaverActive ? 'डेटा सेवर: चालू (ON)' : 'डेटा सेवर: बंद (OFF)'}
                      </p>
                      <p className="text-[10px] opacity-80">
                        {dataSaverActive ? '70% डेटा बचत सक्रिय' : 'क्लिक करके डेटा बचाएं'}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Pill Visual */}
                  <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${dataSaverActive ? 'bg-white' : 'bg-white/20'}`}>
                    <div className={`w-4 h-4 rounded-full transition-transform ${dataSaverActive ? 'translate-x-5 bg-emerald-600' : 'translate-x-0 bg-gray-400'}`} />
                  </div>
                </button>
              </div>

            </div>

            {/* In-Player Gear Tooltip Note */}
            <div className="flex items-center gap-2 text-[11px] text-gray-400 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
              <Info className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span>
                <strong>प्लेयर टिप:</strong> वीडियो स्क्रीन के नीचे दाईं तरफ दिए गए सेटिंग आइकॉन (⚙️ Gear Icon) पर क्लिक करके भी आप 480p, 720p या 1080p क्वालिटी कभी भी सीधे चुन सकते हैं।
              </span>
            </div>
          </div>

          {/* Collapsible Detailed Data Usage Comparison Chart */}
          {showQualityDetails && (
            <div className="p-4 sm:p-5 bg-[#090c14] border-b border-white/10 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  इंटरनेट डेटा खपत व रिज़ॉल्यूशन चार्ट (Data Consumption Comparison)
                </h4>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  वर्तमान चयनित: {currentResOption.label}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase">
                      <th className="py-2 px-3">रिज़ॉल्यूशन</th>
                      <th className="py-2 px-3">क्वालिटी स्तर</th>
                      <th className="py-2 px-3">अनुमानित डेटा खर्च</th>
                      <th className="py-2 px-3">सर्वोत्तम उपयोग</th>
                      <th className="py-2 px-3 text-right">चुनें</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {RESOLUTION_OPTIONS.map((opt) => {
                      const isCurrent = resolution === opt.id;
                      return (
                        <tr 
                          key={opt.id}
                          className={`${isCurrent ? 'bg-red-950/30 text-white font-medium' : 'hover:bg-white/5'}`}
                        >
                          <td className="py-2.5 px-3">
                            <span className="font-bold flex items-center gap-1.5">
                              {opt.isDataSaver && <Zap className="w-3 h-3 fill-green-400 text-green-400" />}
                              {opt.label}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-gray-400">{opt.hindiLabel}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              opt.isDataSaver 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : opt.id === '1080p'
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-white/10 text-gray-300'
                            }`}>
                              {opt.dataRate}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-gray-400 text-[11px]">{opt.descHindi}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleSelectResolution(opt.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isCurrent 
                                  ? 'bg-red-600 text-white' 
                                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
                              }`}
                            >
                              {isCurrent ? 'सक्रिय है' : 'सेट करें'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Troubleshoot / Help Box (Collapsible) */}
          {showTroubleshoot && (
            <div className="mx-4 mt-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 space-y-1.5 animate-fade-in">
              <div className="font-bold flex items-center gap-2 text-amber-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                वीडियो चलने में समस्या आ रही है? ये 3 तरीके तुरंत काम करेंगे:
              </div>
              <ul className="list-disc list-inside space-y-1 pl-2 text-[11px] text-amber-200/90">
                <li>
                  <strong>तरीका 1 (सर्वर बदलें):</strong> नीचे दिए गए <strong>सर्वर 1, सर्वर 2, सर्वर 3 या सर्वर 4</strong> में से किसी दूसरे सर्वर बटन पर क्लिक करें।
                </li>
                <li>
                  <strong>तरीका 2 (रिज़ॉल्यूशन कम करें):</strong> यदि वीडियो रुक-रुक कर चल रहा है, तो ऊपर <strong>480p SD या डेटा सेवर (360p)</strong> चुनें।
                </li>
                <li>
                  <strong>तरीका 3 (डायरेक्ट लिंक):</strong> ऊपर दिए गए <strong>"डायरेक्ट फुलस्क्रीन"</strong> बटन पर क्लिक करें, जिससे बिना किसी ब्राउज़र रुकावट के फुल HD में सीधे चलेगा।
                </li>
                <li>
                  <strong>तरीका 4 (आधिकारिक ऐप्स):</strong> नीचे MX Player (फ्री हिंदी), विकी या नेटफ्लिक्स वाले डायरेक्ट लिंक से भी तुरंत देख सकते हैं।
                </li>
              </ul>
            </div>
          )}

          {/* Streaming Server Switcher Strip */}
          <div className="p-4 sm:p-5 bg-[#0f121d] border-b border-white/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5 mr-1">
                  <Server className="w-3.5 h-3.5 text-red-500" />
                  स्ट्रीमिंग सर्वर (Server Switcher):
                </span>

                <button
                  onClick={() => setActiveServer(1)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    activeServer === 1
                      ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/30'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  🚀 सर्वर 1 (अल्ट्रा HD तेज़)
                </button>

                <button
                  onClick={() => setActiveServer(2)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    activeServer === 2
                      ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/30'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  ⚡ सर्वर 2 (मल्टी-ऑडियो HD)
                </button>

                <button
                  onClick={() => setActiveServer(3)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    activeServer === 3
                      ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/30'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  🌐 सर्वर 3 (ग्लोबल मिरर)
                </button>

                <button
                  onClick={() => setActiveServer(4)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    activeServer === 4
                      ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/30'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  🎬 सर्वर 4 (बैकअप स्ट्रीम)
                </button>

                <button
                  onClick={() => setActiveServer(5)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    activeServer === 5
                      ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/30'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  📡 सर्वर 5 (क्लाउड प्लेयर)
                </button>

                {item.trailerYoutubeId && (
                  <button
                    onClick={() => setActiveServer(6)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      activeServer === 6
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    📺 आधिकारिक ट्रेलर
                  </button>
                )}
              </div>
            </div>

            {/* Series Episode Navigation (Prev / Next Buttons) */}
            {isSeries && (
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <button
                  disabled={currentEpisode <= 1}
                  onClick={() => {
                    setCurrentEpisode(prev => Math.max(1, prev - 1));
                    setReloadKey(prev => prev + 1);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-gray-300 transition-all cursor-pointer"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                  पिछला एपिसोड ({currentEpisode - 1})
                </button>

                <span className="text-xs font-bold text-gray-200">
                  एपिसोड {currentEpisode} / {totalEpisodes}
                </span>

                <button
                  disabled={currentEpisode >= totalEpisodes}
                  onClick={() => {
                    setCurrentEpisode(prev => Math.min(totalEpisodes, prev + 1));
                    setReloadKey(prev => prev + 1);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white transition-all shadow-md shadow-red-600/30 cursor-pointer"
                >
                  अगला एपिसोड ({currentEpisode + 1})
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Official Apps Direct Watch Links */}
          <div className="p-4 sm:p-5 bg-[#090b13] border-b border-white/10 space-y-2.5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-red-500" />
              आधिकारिक ऐप्स पर भी उपलब्ध (Official Streaming Links):
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {item.streamingPlatforms.map((platform, idx) => (
                <a
                  key={idx}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/40 transition-all group"
                >
                  <div className="truncate">
                    <p className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                      {platform.name}
                    </p>
                    <span className="text-[10px] text-amber-400 font-medium">
                      {platform.badge || "ऑनलाइन देखें"}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-white flex-shrink-0 ml-1" />
                </a>
              ))}
            </div>
          </div>

          {/* Episode List Selector (If TV Series) */}
          {isSeries && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Tv className="w-4 h-4 text-red-500" />
                    एपिसोड्स चुनें (Select Episode)
                  </h3>
                  <p className="text-xs text-gray-400">
                    जिस भी एपिसोड पर क्लिक करेंगे, वह ऊपर तुरंत शुरू हो जाएगा
                  </p>
                </div>
                <span className="text-xs text-red-400 font-bold bg-red-950/60 border border-red-500/30 px-2.5 py-1 rounded-xl">
                  कुल {totalEpisodes} एपिसोड्स
                </span>
              </div>

              {/* Grid of Episodes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: totalEpisodes }).map((_, i) => {
                  const epNum = i + 1;
                  const isCurrent = currentEpisode === epNum;
                  const epData = item.episodesList?.[i];
                  const epTitle = epData ? epData.titleHindi : `एपिसोड ${epNum}: भाग ${epNum}`;
                  const epDuration = epData ? epData.duration : "60 मिनट";

                  return (
                    <button
                      key={epNum}
                      onClick={() => {
                        setCurrentEpisode(epNum);
                        setReloadKey(prev => prev + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                        isCurrent
                          ? 'bg-red-600/20 border-red-500 text-white shadow-lg shadow-red-600/20'
                          : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300'
                      }`}
                    >
                      {/* Episode Number badge / play icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xs ${
                        isCurrent 
                          ? 'bg-red-600 text-white animate-pulse' 
                          : 'bg-white/10 text-gray-200'
                      }`}>
                        {isCurrent ? <Play className="w-4 h-4 fill-white" /> : epNum}
                      </div>

                      <div className="flex-1 truncate">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs font-bold truncate ${isCurrent ? 'text-red-400' : 'text-white'}`}>
                            {epTitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 font-medium">
                          <span>{epDuration}</span>
                          <span>•</span>
                          <span className={isCurrent ? 'text-emerald-400 font-semibold' : ''}>
                            {isCurrent ? 'अभी चल रहा है' : 'चलाने के लिए क्लिक करें'}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Movie Story & Details (If Movie) */}
          {!isSeries && (
            <div className="p-4 sm:p-6 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-red-500" />
                फ़िल्म के बारे में (About Movie)
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                {item.overviewHindi}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 pt-1">
                <span>अवधि: <strong className="text-white">{item.duration}</strong></span>
                <span>•</span>
                <span>रिलीज़ वर्ष: <strong className="text-white">{item.releaseYear}</strong></span>
                <span>•</span>
                <span>रेटिंग: <strong className="text-yellow-400">★ {item.rating}</strong></span>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Footer Info */}
        <div className="px-4 sm:px-6 py-3 bg-[#080910] border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <span>SeoulFlix Cinema HD • कोरियाई ड्रामा और फ़िल्में हिंदी में</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors cursor-pointer"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
