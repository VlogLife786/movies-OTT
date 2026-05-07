import axios from 'axios';
import { API_BASE, PAGE_LIMIT } from '../constants';
import { ApiResponse, Category } from '../types';

const client = axios.create({ baseURL: API_BASE, timeout: 10000 });

export const fetchMovies = async (
  category: Category,
  page: number = 1,
  title?: string
): Promise<ApiResponse> => {
  const params: any = { page, limit: PAGE_LIMIT };
  if (title) params.title = title;
  const { data } = await client.get(`/${category}`, { params });
  return data;
};
