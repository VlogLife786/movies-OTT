import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants';
import { useStore } from '../store/useStore';
import { MovieCard } from '../components/MovieCard';

export default function FavoritesScreen() {
    const router = useRouter();
    const { favorites, recentlyWatched } = useStore();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Text style={styles.back}>← Back</Text>
                </Pressable>
                <Text style={styles.title}>My Favorites</Text>
                <View style={{ width: 50 }} />
            </View>

            <FlatList
                data={favorites} renderItem={({ item, index }) => <MovieCard movie={item} index={index} />}
                keyExtractor={(item, index) => (item._id || item.id || String(index))}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No favorites yet</Text>
                    </View>
                }
                ListHeaderComponent={
                    recentlyWatched.length > 0 ? (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.sectionTitle}>Recently Watched</Text>
                            <FlatList
                                data={recentlyWatched.slice(0, 10)}
                                renderItem={({ item, index }) => <MovieCard movie={item} index={index} />}
                                keyExtractor={(item, index) => 'recent-' + (item._id || item.id || index)}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 12 }}
                            />
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12,
    },
    back: { color: COLORS.text, fontSize: 16 },
    title: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
    list: { paddingHorizontal: 16, paddingTop: 16 },
    row: { justifyContent: 'space-between' },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
    emptyText: { color: COLORS.textSecondary, fontSize: 16 },
    sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
});
