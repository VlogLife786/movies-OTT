import React, { useState } from 'react';
import {
    View, Text, Image, ScrollView, StyleSheet, Pressable, Dimensions, Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants';
import { Movie, Player } from '../types';
import { useStore } from '../store/useStore';

const { width } = Dimensions.get('window');

export default function DetailScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const movie: Movie = JSON.parse((params.data as string) || '{}');
    const toggleFavorite = useStore((s) => s.toggleFavorite);
    const isFavorite = useStore((s) => s.isFavorite);
    const addToRecent = useStore((s) => s.addToRecent);
    const movieId = movie._id || movie.id || '';
    const fav = useStore((s) => s.isFavorite(movieId));
    const [showPlayers, setShowPlayers] = useState(false);

    const playersList: Player[] = movie.player || movie.players || [];

    const onPlay = (player: Player) => {
        setShowPlayers(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        addToRecent({ ...movie, _id: movieId });
        router.push({
            pathname: player.source == 'iframe' ? '/iframe-player' : '/m3u8-player',
            params: { url: player.url, title: movie.title_en || movie.title || movie.name || '', source: player.source },
        } as any);
    };

    return (
        <ScrollView style={styles.container} bounces={false}>
            <View style={styles.backdropWrapper}>
                <Image
                    source={{ uri: movie.poster || movie.backdrop || 'https://via.placeholder.com/600x400' }}
                    style={styles.backdrop}
                    resizeMode="cover"
                />
                <LinearGradient colors={['transparent', COLORS.background]} style={styles.gradient} />
                <Pressable style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={{ fontSize: 24, color: '#fff' }}>←</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{movie.title_en || movie.title || movie.name || 'Untitled'}</Text>

                <View style={styles.metaRow}>
                    {movie.year && <Text style={styles.metaChip}>{String(movie.year)}</Text>}
                    {movie.duration && <Text style={styles.metaChip}>{(Number(movie.duration) / 60).toFixed(1)} Hrs</Text>}
                    {movie.imdb_rating && <Text style={styles.metaChip}>⭐ {movie.imdb_rating}</Text>}
                    {movie.hd && <Text style={[styles.metaChip, { backgroundColor: COLORS.primary }]}>HD</Text>}
                </View>
                {movie.genres && movie.genres.length > 0 && (
                    <View style={styles.genreRow}>
                        {movie.genres.map((g: any, i: number) => (
                            <View key={String(i)} style={styles.genreBadge}>
                                <Text style={styles.genreText}>{typeof g === 'string' ? g : (g && g.name ? String(g.name) : '')}</Text>
                            </View>))}
                    </View>
                )}
                {movie.languages && movie.languages.length > 0 && (
                    <View style={styles.genreRow}>
                        {movie.languages.map((l: any, i: number) => (
                            <View key={String(i)} style={[styles.genreBadge, { borderColor: '#4A90D9' }]}>
                                <Text style={[styles.genreText, { color: '#4A90D9' }]}>{typeof l === 'string' ? l : (l && l.name ? String(l.name) : '')}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {movie.description && <Text style={styles.description}>{movie.description}</Text>}
                {movie.country && <Text style={styles.country}>{'Country: ' + (typeof movie.country === 'string' ? movie.country : (movie.country && (movie.country as any).name ? String((movie.country as any).name) : ''))}</Text>}

                {playersList.length > 0 && (
                    <Pressable
                        style={styles.playButton}
                        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowPlayers(true); }}
                    >
                        <Text style={styles.playButtonText}>▶  Watch Now</Text>
                    </Pressable>
                )}

                <Pressable
                    style={[styles.favButton, fav && { backgroundColor: COLORS.primary }]}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        toggleFavorite({ ...movie, _id: movieId });
                    }}
                >
                    <Text style={styles.favButtonText}>{fav ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}</Text>
                </Pressable>
            </View>

            <Modal visible={showPlayers} transparent animationType="slide" onRequestClose={() => setShowPlayers(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setShowPlayers(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Player</Text>
                            <Pressable onPress={() => setShowPlayers(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </Pressable>
                        </View>
                        <View>
                            {Array.from({ length: Math.ceil(playersList.length / 2) }).map((_, rowIdx) => (
                                <View key={rowIdx} style={styles.playerRow}>
                                    {[0, 1].map(colIdx => {
                                        const playerIdx = rowIdx * 2 + colIdx;
                                        const player = playersList[playerIdx];
                                        if (!player) return <View key={colIdx} style={{ flex: 1 }} />;
                                        return (
                                            <Pressable key={colIdx} style={[styles.playerChip, { flex: 1 }]} onPress={() => onPlay(player)}>
                                                <Text style={styles.playerChipIcon}>▶️</Text>
                                                <Text style={styles.playerChipName} numberOfLines={1}>{player.translator}</Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            ))}
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    backdropWrapper: { position: 'relative' },
    backdrop: { width, height: 400 },
    gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 200 },
    backBtn: {
        position: 'absolute', top: 50, left: 16,
        backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, width: 40, height: 40,
        justifyContent: 'center', alignItems: 'center',
    },
    content: { paddingHorizontal: 16, marginTop: -40 },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 8 },
    metaChip: {
        color: COLORS.text, fontSize: 12, backgroundColor: COLORS.surface,
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, overflow: 'hidden',
    },
    genreRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 8 },
    genreBadge: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
    genreText: { color: COLORS.primary, fontSize: 11 },
    description: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22, marginTop: 16 },
    country: { color: COLORS.textSecondary, fontSize: 13, marginTop: 8 },
    playButton: {
        marginTop: 20, backgroundColor: COLORS.primary, borderRadius: 12,
        paddingVertical: 14, alignItems: 'center',
    },
    playButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    favButton: {
        marginTop: 12, marginBottom: 40, backgroundColor: COLORS.surface, borderRadius: 12,
        paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
    },
    favButtonText: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
        paddingVertical: 20, paddingHorizontal: 16,
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
    modalClose: { color: COLORS.textSecondary, fontSize: 22 }, playerRow: { flexDirection: 'row', gap: 12, paddingBottom: 20 },
    playerChip: {
        backgroundColor: COLORS.card, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14,
        flexDirection: 'row', alignItems: 'center', gap: 10,
        borderWidth: 1, borderColor: COLORS.border,
    },
    playerChipIcon: { fontSize: 20 },
    playerChipName: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
    playerChipQuality: { color: COLORS.textSecondary, fontSize: 11 },
});
