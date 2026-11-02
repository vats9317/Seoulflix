export type MediaType = 'tv' | 'movie';

export interface CastMember {
  name: string;
  character: string;
  photo?: string;
}

export interface Episode {
  episodeNumber: number;
  titleHindi: string;
  duration: string;
  overviewHindi: string;
}

export interface StreamingPlatform {
  name: string;
  url: string;
  badge?: string;
  isFree?: boolean;
}

export interface KDramaItem {
  id: number | string;
  titleHindi: string;
  titleEnglish: string;
  titleOriginal: string;
  posterUrl: string;
  backdropUrl: string;
  type: MediaType;
  rating: number;
  voteCount: number;
  releaseYear: string;
  genres: string[];
  overviewHindi: string;
  isHindiDubbed: boolean;
  isHindiSubtitled: boolean;
  seasons?: number;
  episodesCount?: number;
  duration?: string;
  cast: CastMember[];
  trailerYoutubeId?: string;
  streamingPlatforms: StreamingPlatform[];
  episodesList?: Episode[];
  tagline?: string;
  status?: string;
}

export type CategoryFilter = 'all' | 'tv' | 'movie' | 'hindi_dubbed' | 'trending' | 'top_rated' | 'watchlist';

export type SortOption = 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc' | 'first_air_date.desc';

export type AuthProvider = 'google' | 'email' | 'apple' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: AuthProvider;
  createdAt: string;
}
