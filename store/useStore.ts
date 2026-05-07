import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../types';

interface AppState {
  favorites: Movie[];
  recentlyWatched: Movie[];
  loadFavorites: () => Promise<void>;
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (id: string) => boolean;
  addToRecent: (movie: Movie) => void;
}

const getId = (m: Movie): string => m._id || m.id || '';

export const useStore = create<AppState>((set, get) => ({
  favorites: [],
  recentlyWatched: [],

  loadFavorites: async () => {
    try {
      const favs = await AsyncStorage.getItem('favorites');
      const recent = await AsyncStorage.getItem('recentlyWatched');
      if (favs) set({ favorites: JSON.parse(favs).filter((m: Movie) => getId(m)) });
      if (recent) set({ recentlyWatched: JSON.parse(recent).filter((m: Movie) => getId(m)) });
    } catch (e) {
      console.log('Error loading data', e);
    }
  },

  toggleFavorite: (movie) => {
    const id = getId(movie);
    if (!id) return;
    const { favorites } = get();
    const exists = favorites.some((m) => getId(m) === id);
    const updated = exists
      ? favorites.filter((m) => getId(m) !== id)
      : [{ ...movie, _id: id }, ...favorites];
    set({ favorites: updated });
    AsyncStorage.setItem('favorites', JSON.stringify(updated));
  },

  isFavorite: (id) => {
    if (!id) return false;
    return get().favorites.some((m) => getId(m) === id);
  },

  addToRecent: (movie) => {
    const id = getId(movie);
    if (!id) return;
    const { recentlyWatched } = get();
    const filtered = recentlyWatched.filter((m) => getId(m) !== id);
    const updated = [{ ...movie, _id: id }, ...filtered].slice(0, 20);
    set({ recentlyWatched: updated });
    AsyncStorage.setItem('recentlyWatched', JSON.stringify(updated));
  },
}));