"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?&api_key=${apiKey}`;
const seriesgenreUrl = `https://api.themoviedb.org/3/genre/tv/list?&api_key=${apiKey}`;

type Genre = {
  id: number;
  name: string;
};

type GenreContextType = {
  genres: Genre[];
  movieIdToGenre: (id: number) => string;
  showGenres: () => Genre[];
  showSeriesGenres: () => Genre[];
};

// Create context with default values
const GenreContext = createContext<GenreContextType | undefined>(undefined);

// Context Provider Component
export const GenreProvider = ({ children }: { children: ReactNode }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [seriesGenres, setSeriesGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(genreUrl);
        const data = await res.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Failed to fetch genres", error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(seriesgenreUrl);
        const data = await res.json();
        setSeriesGenres(data.genres || []);
      } catch (error) {
        console.error("Failed to fetch genres", error);
      }
    };

    fetchGenres();
  }, []);

  // Function to get genre name from ID
  const movieIdToGenre = (id: number): string => {
    return genres.find((genre) => genre.id === id)?.name || "";
  };

  const showGenres = () => {
    return genres;
  };
  const showSeriesGenres = () => {
    return seriesGenres;
  };

  return (
    <GenreContext.Provider
      value={{ genres, movieIdToGenre, showGenres, showSeriesGenres }}
    >
      {children}
    </GenreContext.Provider>
  );
};

// Custom Hook to use Genre Context
export const useGenre = () => {
  const context = useContext(GenreContext);
  if (!context) {
    throw new Error("useGenre must be used within a GenreProvider");
  }
  return context;
};
