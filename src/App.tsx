import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { KDramaItem, CategoryFilter, SortOption, UserProfile } from './types';
import { CURATED_KDRAMAS } from './data/curatedData';
import { fetchKoreanMediaFromTMDB, searchKoreanMediaFromTMDB } from './services/tmdbApi';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MediaFilter } from './components/MediaFilter';
import { MediaCard } from './components/MediaCard';
import { MediaModal } from './components/MediaModal';
import { TrailerModal } from './components/TrailerModal';
import { WatchPlayerModal } from './components/WatchPlayerModal';
import { WatchlistSection } from './components/WatchlistSection';
import { AuthGateScreen } from './components/AuthGateScreen';
import { Loader2, Sparkles, Film, Tv, Flame, Heart, ChevronDown } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity.desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [languageMode, setLanguageMode] = useState<'hi' | 'en'>('hi');

  const [items, setItems] = useState<KDramaItem[]>(CURATED_KDRAMAS);
  const [featuredItems, setFeaturedItems] = useState<KDramaItem[]>(CURATED_KDRAMAS.slice(0, 5));
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(100);
  const [totalResults, setTotalResults] = useState<number>(2500);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  
  // Modals state
  const [selectedModalItem, setSelectedModalItem] = useState<KDramaItem | null>(null);
  const [activeTrailer, setActiveTrailer] = useState<{ id: string; title: string } | null>(null);
  const [activeWatchMedia, setActiveWatchMedia] = useState<{ item: KDramaItem; episodeNumber: number } | null>(null);

  // Data Saver mode state (persisted in localStorage)
  const [isDataSaver, setIsDataSaver] = useState<boolean>(() => {
    try {
      return localStorage.getItem('seoulflix_datasaver') === 'true';
    } catch {
      return false;
    }
  });

  const toggleDataSaver = useCallback(() => {
    setIsDataSaver((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('seoulflix_datasaver', String(next));
      } catch (e) {
        console.error("Failed to save data saver preference", e);
      }
      return next;
    });
  }, []);

  // User Authentication State (Persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('seoulflix_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Controls whether the login gate is shown before entering the app
  const [showAuthGate, setShowAuthGate] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('seoulflix_user');
    } catch {
      return true;
    }
  });

  const handleLoginSuccess = useCallback((user: UserProfile) => {
    setCurrentUser(user);
    setShowAuthGate(false);
    try {
      localStorage.setItem('seoulflix_user', JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save user", e);
    }
  }, []);

  const handleContinueAsGuest = useCallback(() => {
    const guestUser: UserProfile = {
      id: 'guest',
      name: 'अतिथि (Guest)',
      email: 'guest@seoulflix.com',
      provider: 'guest',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(guestUser);
    setShowAuthGate(false);
    try {
      localStorage.setItem('seoulflix_user', JSON.stringify(guestUser));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSignOut = useCallback(() => {
    setCurrentUser(null);
    setShowAuthGate(true);
    try {
      localStorage.removeItem('seoulflix_user');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleOpenAuth = useCallback(() => {
    setShowAuthGate(true);
  }, []);

  // Watchlist persisted in localStorage
  const [watchlist, setWatchlist] = useState<KDramaItem[]>(() => {
    try {
      const saved = localStorage.getItem('seoulflix_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [, startTransition] = useTransition();

  // Watchlist helper
  const isItemInWatchlist = useCallback((id: string | number) => {
    return watchlist.some((w) => String(w.id) === String(id));
  }, [watchlist]);

  const toggleWatchlist = useCallback((item: KDramaItem) => {
    setWatchlist((prev) => {
      const exists = prev.some((w) => String(w.id) === String(item.id));
      const next = exists 
        ? prev.filter((w) => String(w.id) !== String(item.id))
        : [item, ...prev];
      try {
        localStorage.setItem('seoulflix_watchlist', JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save watchlist", e);
      }
      return next;
    });
  }, []);

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
    localStorage.removeItem('seoulflix_watchlist');
  }, []);

  // Open Video Player
  const handleOpenWatch = useCallback((item: KDramaItem, episodeNumber: number = 1) => {
    setActiveWatchMedia({ item, episodeNumber });
  }, []);

  // Main fetch function
  const loadMedia = useCallback(async (
    targetPage: number = 1,
    isAppend: boolean = false
  ) => {
    if (activeCategory === 'watchlist') return;

    if (isAppend) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      if (searchQuery.trim().length >= 2) {
        const searchType = activeCategory === 'movie' ? 'movie' : (activeCategory === 'tv' ? 'tv' : 'all');
        const res = await searchKoreanMediaFromTMDB(searchQuery, searchType, targetPage);
        startTransition(() => {
          if (isAppend) {
            setItems((prev) => [...prev, ...res.items]);
          } else {
            setItems(res.items);
          }
          setTotalPages(res.totalPages);
          setTotalResults(res.items.length);
        });
      } else {
        const mediaType = activeCategory === 'movie' ? 'movie' : (activeCategory === 'tv' ? 'tv' : (activeCategory === 'trending' ? 'trending' : 'all'));
        const res = await fetchKoreanMediaFromTMDB(mediaType, targetPage, sortBy);
        
        startTransition(() => {
          // Merge with curated items on first page for maximum quality
          let mergedItems = res.items;
          if (targetPage === 1 && !isAppend) {
            const curatedSubset = CURATED_KDRAMAS.filter((c) => {
              if (activeCategory === 'movie') return c.type === 'movie';
              if (activeCategory === 'tv') return c.type === 'tv';
              if (activeCategory === 'hindi_dubbed') return c.isHindiDubbed;
              if (activeCategory === 'top_rated') return c.rating >= 8.3;
              return true;
            });
            const nonCurated = res.items.filter((item) => !curatedSubset.some((c) => Number(c.id) === Number(item.id)));
            mergedItems = [...curatedSubset, ...nonCurated];
          }

          if (isAppend) {
            setItems((prev) => {
              const existingIds = new Set(prev.map(i => String(i.id)));
              const newUniques = res.items.filter(i => !existingIds.has(String(i.id)));
              return [...prev, ...newUniques];
            });
          } else {
            setItems(mergedItems);
            // Update featured spotlight with top blockbusters
            if (mergedItems.length > 0) {
              setFeaturedItems(mergedItems.slice(0, 6));
            }
          }

          setTotalPages(res.totalPages);
          setTotalResults(res.totalResults);
        });
      }
    } catch (err) {
      console.error("Error loading media:", err);
      if (!isAppend) {
        setItems(CURATED_KDRAMAS);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [activeCategory, searchQuery, sortBy]);

  // Initial and reactive loading
  useEffect(() => {
    setPage(1);
    loadMedia(1, false);
  }, [activeCategory, sortBy, loadMedia]);

  // Handle Search Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      loadMedia(1, false);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery, loadMedia]);

  // Load More Pages (Infinite pagination)
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadMedia(nextPage, true);
  };

  // Filter items in memory for genre or Hindi dubbed
  const displayedItems = items.filter((item) => {
    if (activeCategory === 'hindi_dubbed' && !item.isHindiDubbed) {
      return false;
    }
    if (activeCategory === 'top_rated' && item.rating < 8.3) {
      return false;
    }
    if (selectedGenre) {
      return item.genres.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()));
    }
    return true;
  });

  // Show Login Gate Screen before app opens if not authenticated
  if (showAuthGate) {
    return (
      <AuthGateScreen
        onLoginSuccess={handleLoginSuccess}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSelectedGenre('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        watchlistCount={watchlist.length}
        languageMode={languageMode}
        onToggleLanguage={() => setLanguageMode((prev) => (prev === 'hi' ? 'en' : 'hi'))}
        isDataSaver={isDataSaver}
        onToggleDataSaver={toggleDataSaver}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenAuth={handleOpenAuth}
      />

      {/* Hero Spotlight Banner */}
      {!searchQuery && activeCategory !== 'watchlist' && (
        <HeroBanner
          featuredItems={featuredItems}
          onOpenDetails={setSelectedModalItem}
          onOpenWatch={(item) => handleOpenWatch(item, 1)}
          onOpenTrailer={(id, title) => setActiveTrailer({ id, title })}
          isItemInWatchlist={isItemInWatchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* If in Watchlist View */}
        {activeCategory === 'watchlist' ? (
          <WatchlistSection
            watchlist={watchlist}
            onOpenDetails={setSelectedModalItem}
            onOpenWatch={handleOpenWatch}
            onOpenTrailer={(id, title) => setActiveTrailer({ id, title })}
            isItemInWatchlist={isItemInWatchlist}
            onToggleWatchlist={toggleWatchlist}
            onClearWatchlist={clearWatchlist}
            onBackToAll={() => setActiveCategory('all')}
          />
        ) : (
          <>
            {/* Filter and Sorting Header */}
            <MediaFilter
              activeCategory={activeCategory}
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
                setSelectedGenre('');
              }}
              selectedGenre={selectedGenre}
              onSelectGenre={setSelectedGenre}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalResultsCount={displayedItems.length > 0 ? totalResults : 0}
            />

            {/* Section Headline */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-6 bg-red-600 rounded-full" />
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  {searchQuery ? (
                    <span>"{searchQuery}" के लिए खोज परिणाम</span>
                  ) : activeCategory === 'hindi_dubbed' ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      हिंदी डब कोरियन ड्रामा और फिल्में (Watch Online)
                    </span>
                  ) : activeCategory === 'movie' ? (
                    <span className="flex items-center gap-2">
                      <Film className="w-5 h-5 text-rose-500" />
                      लोकप्रिय कोरियन फ़िल्में (Korean Movies in Hindi)
                    </span>
                  ) : activeCategory === 'tv' ? (
                    <span className="flex items-center gap-2">
                      <Tv className="w-5 h-5 text-red-500" />
                      शीर्ष कोरियन सीरीज़ (K-Dramas in Hindi)
                    </span>
                  ) : activeCategory === 'trending' ? (
                    <span className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      इस सप्ताह के टॉप ट्रेंडिंग शो
                    </span>
                  ) : (
                    <span>हजारों कोरियन सीरीज़ और फिल्में (हिंदी नाम व ऑनलाइन वॉच)</span>
                  )}
                </h2>
              </div>

              <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                पेज {page} / {totalPages}
              </span>
            </div>

            {/* Loading Spinner */}
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin text-red-500" />
                <p className="text-sm font-medium">हज़ारों कोरियन टाइटल्स और थंबनेल हिंदी में लोड हो रहे हैं...</p>
              </div>
            ) : displayedItems.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="text-base text-gray-300 font-medium">कोई परिणाम नहीं मिला।</p>
                <p className="text-xs text-gray-500">कृपया अन्य नाम से खोजें या शैली फ़िल्टर को 'सभी शैलियाँ' पर सेट करें।</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenre('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl"
                >
                  सभी देखें
                </button>
              </div>
            ) : (
              /* Media Cards Grid */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
                {displayedItems.map((item) => (
                  <MediaCard
                    key={`${item.id}-${item.type}`}
                    item={item}
                    onOpenDetails={setSelectedModalItem}
                    onOpenWatch={(itm) => handleOpenWatch(itm, 1)}
                    onOpenTrailer={(id, title) => setActiveTrailer({ id, title })}
                    isItemInWatchlist={isItemInWatchlist}
                    onToggleWatchlist={toggleWatchlist}
                  />
                ))}
              </div>
            )}

            {/* Load More Button (Thousands of Korean titles pagination) */}
            {!isLoading && displayedItems.length > 0 && page < totalPages && (
              <div className="pt-8 pb-4 flex flex-col items-center justify-center gap-2">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm rounded-2xl shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>और टाइटल्स लोड हो रहे हैं...</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>और कोरियन सीरीज़ और फिल्में देखें (Load More)</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-gray-400">
                  हजारों दक्षिण कोरियाई ड्रामा और फिल्में TMDB द्वारा सीधे हिंदी में उपलब्ध
                </p>
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 bg-[#07080c] border-t border-white/10 text-gray-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-sm">
                서울
              </div>
              <span className="text-lg font-black text-white">
                SEOUL<span className="text-red-500">FLIX</span> HINDI
              </span>
            </div>
            <p className="text-center sm:text-right text-gray-400 max-w-md">
              भारत में कोरियन ड्रामा और मूवी प्रेमियों के लिए विशेष रूप से डिज़ाइन किया गया हिंदी ऑनलाइन स्ट्रीमिंग पोर्टल।
            </p>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p>© {new Date().getFullYear()} SeoulFlix Hindi. सभी अधिकार सुरक्षित।</p>
            <p className="text-gray-400">
              डेटा The Movie Database (TMDB) API द्वारा संचालित है। वीडियो व पोस्टर संबंधित निर्माताओं की संपत्ति हैं।
            </p>
          </div>
        </div>
      </footer>

      {/* Dedicated Watch Online Cinema Video Player */}
      {activeWatchMedia && (
        <WatchPlayerModal
          item={activeWatchMedia.item}
          initialEpisode={activeWatchMedia.episodeNumber || 1}
          onClose={() => setActiveWatchMedia(null)}
          isItemInWatchlist={isItemInWatchlist}
          onToggleWatchlist={toggleWatchlist}
          initialDataSaver={isDataSaver}
          onToggleDataSaver={toggleDataSaver}
        />
      )}

      {/* Detailed Info Modal Popup */}
      {selectedModalItem && (
        <MediaModal
          item={selectedModalItem}
          onClose={() => setSelectedModalItem(null)}
          onOpenWatch={handleOpenWatch}
          onOpenTrailer={(id, title) => setActiveTrailer({ id, title })}
          isItemInWatchlist={isItemInWatchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {/* YouTube Trailer Player Modal */}
      {activeTrailer && (
        <TrailerModal
          trailerId={activeTrailer.id}
          title={activeTrailer.title}
          onClose={() => setActiveTrailer(null)}
        />
      )}

    </div>
  );
}
