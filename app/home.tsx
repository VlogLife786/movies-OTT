import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, Pressable, RefreshControl, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants';
import { Category, Movie } from '../types';
import { useMovies } from '../hooks/useMovies';
import { useDebounce } from '../hooks/useDebounce';
import { MovieCard } from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/Skeleton';

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'bollywood', label: 'Bollywood' },
  { key: 'hollywood', label: 'Hollywood' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<Category>('bollywood');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } =
    useMovies(category, debouncedSearch);

  const movies = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data]
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const renderItem = useCallback(
    ({ item, index }: { item: Movie; index: number }) => (
      <MovieCard movie={item} index={index} />
    ),
    []
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🎬 MovieStream</Text>
        <Pressable onPress={() => router.push('/favorites')}>
          <Text style={{ fontSize: 22 }}>❤️</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          placeholderTextColor={COLORS.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category Tabs */}
      <View style={styles.tabs}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.key}
            style={[styles.tab, category === cat.key && styles.tabActive]}
            onPress={() => setCategory(cat.key)}
          >
            <Text style={[styles.tabText, category === cat.key && styles.tabTextActive]}>
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Movie List */}
      {isLoading ? (
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </View>
      ) : movies.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No movies found</Text>
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item, i) => (item._id || '') + '-' + i}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} tintColor={COLORS.primary} />}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 20 }} /> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12, backgroundColor: COLORS.background,
  },
  logo: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  searchContainer: { paddingHorizontal: 16, marginBottom: 12 },
  searchInput: {
    backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    color: COLORS.text, fontSize: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 10 },
  tab: {
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16 },
  row: { justifyContent: 'space-between' },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary, fontSize: 16 },
  retryBtn: { marginTop: 12, backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
});
