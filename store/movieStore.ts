import { create } from "zustand";
import tmdb from "@/lib/axios";

// Unified interface for both movies and TV shows
interface MediaItem {
  id: number;
  title: string;
  poster_path: string;
  genre_ids: number[];
  media_type: string;
}

export const usePopularMoviesStore = create<{
  movies: MediaItem[];
  loading: boolean;
  error: string | null;
  fetchPopularMovies: () => Promise<void>;
}>((set) => ({
  movies: [],
  loading: false,
  error: null,

  fetchPopularMovies: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await tmdb.get("/movie/popular");
      set({
        movies: filterMediaData(data, "movie"),
        loading: false,
      });
    } catch (error) {
      console.error("Popular Movies Fetch Error:", error);
      set({
        error: "Failed to fetch popular movies",
        loading: false,
      });
    }
  },
}));

export const useTopRatedMoviesStore = create<{
  movies: MediaItem[];
  loading: boolean;
  error: string | null;
  fetchTopRatedMovies: () => Promise<void>;
}>((set) => ({
  movies: [],
  loading: false,
  error: null,

  fetchTopRatedMovies: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await tmdb.get("/movie/top_rated");
      set({
        movies: filterMediaData(data, "movie"),
        loading: false,
      });
    } catch (error) {
      console.error("Top Rated Movies Fetch Error:", error);
      set({
        error: "Failed to fetch top rated movies",
        loading: false,
      });
    }
  },
}));

export const usePopularTVStore = create<{
  shows: MediaItem[];
  loading: boolean;
  error: string | null;
  fetchPopularTV: () => Promise<void>;
}>((set) => ({
  shows: [],
  loading: false,
  error: null,

  fetchPopularTV: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await tmdb.get("/tv/popular");
      set({
        shows: filterMediaData(data, "tv"),
        loading: false,
      });
    } catch (error) {
      console.error("Popular TV Fetch Error:", error);
      set({
        error: "Failed to fetch popular TV shows",
        loading: false,
      });
    }
  },
}));

export const useTopRatedTVStore = create<{
  shows: MediaItem[];
  loading: boolean;
  error: string | null;
  fetchTopRatedTV: () => Promise<void>;
}>((set) => ({
  shows: [],
  loading: false,
  error: null,

  fetchTopRatedTV: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await tmdb.get("/tv/top_rated");
      set({
        shows: filterMediaData(data, "tv"),
        loading: false,
      });
    } catch (error) {
      console.error("Top Rated TV Fetch Error:", error);
      set({
        error: "Failed to fetch top rated TV shows",
        loading: false,
      });
    }
  },
}));

// Helper function to filter media data
const filterMediaData = (
  data: { results: any[] },
  defaultMediaType: "movie" | "tv"
): MediaItem[] => {
  return (
    data?.results?.map((item) => ({
      id: item.id,
      title: item.title || item.name || "Untitled",
      poster_path: item.poster_path,
      genre_ids: item.genre_ids || [],
      media_type: item.media_type || defaultMediaType,
    })) || []
  );
};

// Utility to fetch all categories in parallel
export const fetchAllMediaData = async () => {
  await Promise.all([
    usePopularMoviesStore.getState().fetchPopularMovies(),
    useTopRatedMoviesStore.getState().fetchTopRatedMovies(),
    usePopularTVStore.getState().fetchPopularTV(),
    useTopRatedTVStore.getState().fetchTopRatedTV(),
  ]);
};
