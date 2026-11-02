import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, Film, Tv, Flame, Sparkles, X, Languages, Zap, User, LogOut, LogIn, ChevronDown, Mail } from 'lucide-react';
import { CategoryFilter, UserProfile } from '../types';

interface NavbarProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  watchlistCount: number;
  languageMode: 'hi' | 'en';
  onToggleLanguage: () => void;
  isDataSaver: boolean;
  onToggleDataSaver: () => void;
  currentUser: UserProfile | null;
  onSignOut: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  watchlistCount,
  languageMode,
  onToggleLanguage,
  isDataSaver,
  onToggleDataSaver,
  currentUser,
  onSignOut,
  onOpenAuth
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0a0b10]/90 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => {
              onSelectCategory('all');
              onSearchChange('');
            }}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">서울</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-red-500 transition-colors">
                  SEOUL<span className="text-red-500">FLIX</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded uppercase tracking-wider">
                  हिंदी
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
                कोरियन ड्रामा व मूवीज़ का महासागर
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              सभी (All)
            </button>
            <button
              onClick={() => onSelectCategory('tv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeCategory === 'tv'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tv className="w-4 h-4" />
              कोरियन सीरीज़
            </button>
            <button
              onClick={() => onSelectCategory('movie')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeCategory === 'movie'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-4 h-4" />
              फ़िल्में
            </button>
            <button
              onClick={() => onSelectCategory('hindi_dubbed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeCategory === 'hindi_dubbed'
                  ? 'bg-amber-500 text-gray-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              हिंदी डब
            </button>
            <button
              onClick={() => onSelectCategory('trending')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeCategory === 'trending'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Flame className="w-4 h-4" />
              ट्रेंडिंग
            </button>
          </nav>

          {/* Right Actions: Search, Language, Watchlist */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-none justify-end">
            
            {/* Search Bar */}
            <div className={`relative transition-all duration-300 ${isSearchOpen ? 'w-full sm:w-72' : 'w-44 sm:w-64'}`}>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  placeholder="सीरीज़ या मूवी खोजें (उदा. स्क्विड गेम)..."
                  className="w-full pl-9 pr-8 py-2 bg-white/5 hover:bg-white/10 focus:bg-[#151722] border border-white/10 focus:border-red-500 rounded-full text-xs sm:text-sm text-white placeholder-gray-400 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 p-0.5 text-gray-400 hover:text-white rounded-full"
                    title="साफ करें"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Language Toggle */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 transition-colors cursor-pointer"
              title="भाषा बदलें (हिंदी / English)"
            >
              <Languages className="w-3.5 h-3.5 text-red-400" />
              <span className="font-semibold">{languageMode === 'hi' ? 'हिंदी' : 'EN'}</span>
            </button>

            {/* Data Saver Mode Quick Toggle */}
            <button
              onClick={onToggleDataSaver}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                isDataSaver
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/20'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
              }`}
              title={isDataSaver ? "डेटा सेवर मोड बंद करें" : "डेटा सेवर मोड चालू करें (60-70% इंटरनेट डेटा की बचत)"}
            >
              <Zap className={`w-3.5 h-3.5 ${isDataSaver ? 'fill-emerald-400 text-emerald-400 animate-pulse' : 'text-gray-400'}`} />
              <span className="hidden sm:inline">डेटा सेवर</span>
              <span className={`w-2 h-2 rounded-full ${isDataSaver ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-gray-600'}`} />
            </button>

            {/* Watchlist Button */}
            <button
              onClick={() => onSelectCategory('watchlist')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                activeCategory === 'watchlist'
                  ? 'bg-red-600/20 border-red-500 text-red-400'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
              }`}
              title="मेरी वॉचलिस्ट देखें"
            >
              <Heart className={`w-4 h-4 ${watchlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="hidden sm:inline text-xs font-medium">वॉचलिस्ट</span>
              {watchlistCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black bg-red-600 text-white rounded-full">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* USER PROFILE OR LOGIN BUTTON */}
            {currentUser && currentUser.provider !== 'guest' ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
                  title="अकाउंट मेनू"
                >
                  {/* Provider icon badge on avatar */}
                  <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10121d] border border-white/20 flex items-center justify-center">
                      {currentUser.provider === 'google' ? (
                        <span className="text-[8px] font-black text-blue-400">G</span>
                      ) : currentUser.provider === 'apple' ? (
                        <span className="text-[8px] font-black text-white"></span>
                      ) : (
                        <Mail className="w-2 h-2 text-red-400" />
                      )}
                    </span>
                  </div>

                  <span className="hidden lg:inline text-xs font-bold truncate max-w-[110px]">
                    {currentUser.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#141724] border border-white/15 rounded-2xl p-4 shadow-2xl z-50 space-y-3 animate-fade-in text-white">
                    {/* User Header */}
                    <div className="pb-3 border-b border-white/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                        {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-black text-white truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-amber-300 border border-white/10">
                          {currentUser.provider === 'google' ? 'Google खाता' : currentUser.provider === 'apple' ? 'Apple ID' : 'ईमेल खाता'}
                        </span>
                      </div>
                    </div>

                    {/* Quick options */}
                    <div className="space-y-1 text-xs">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onSelectCategory('watchlist');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5 text-red-400" />
                          <span>मेरी वॉचलिस्ट</span>
                        </span>
                        <span className="text-red-400 font-bold">{watchlistCount}</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onToggleDataSaver();
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          <span>डेटा सेवर मोड</span>
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isDataSaver ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-gray-400'}`}>
                          {isDataSaver ? 'चालू' : 'बंद'}
                        </span>
                      </button>
                    </div>

                    {/* Switch Account & Logout */}
                    <div className="pt-2 border-t border-white/10 space-y-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span>खाता बदलें (Switch Account)</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onSignOut();
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-red-600/20 text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>लॉग आउट करें (Sign Out)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-all cursor-pointer"
                title="Google, Email या Apple से लॉगिन करें"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>लॉगिन करें</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
