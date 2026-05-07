import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMovies } from '../api/movieApi';
import { Category } from '../types';

export function useMovies(category: Category, search?: string) {
  return useInfiniteQuery({
    queryKey: ['movies', category, search],
    queryFn: ({ pageParam = 1 }) => fetchMovies(category, pageParam, search || undefined),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.results.length < 20) return undefined;
      return pages.length + 1;
    },
    initialPageParam: 1,
  });
}
