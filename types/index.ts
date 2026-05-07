export interface Player {
  url: string;
  translator: string;
  translator_id?: number;
  quality: string;
  source: string;
  server?: number;
}

export interface Movie {
  _id: string;
  id?: string;
  title?: string;
  title_en?: string;
  name?: string;
  year?: number;
  duration?: string;
  imdb_rating?: number;
  genres?: any[];
  languages?: any[];
  description?: string;
  poster?: string;
  backdrop?: string;
  country?: string;
  hd?: boolean;
  players?: Player[];
  player?: Player[];
}

export interface ApiResponse {
  results: Movie[];
  total?: number;
  page?: number;
  totalPages?: number;
}

export type Category = 'bollywood' | 'hollywood';
