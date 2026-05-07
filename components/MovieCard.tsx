import React, { useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Movie } from '../types';
import { COLORS } from '../constants';
import { useStore } from '../store/useStore';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    movie: Movie;
    index: number;
}

export const MovieCard: React.FC<Props> = ({ movie, index }) => {
    const router = useRouter();    const favorites = useStore((s) => s.favorites);
    const toggleFavorite = useStore((s) => s.toggleFavorite);
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const movieId = movie._id || movie.id || '';
    const fav = favorites.some((m) => (m._id || m.id) === movieId);

    useEffect(() => {
        Animated.timing(opacity, { toValue: 1, duration: 400, delay: index * 50, useNativeDriver: true }).start();
    }, []);    const onPressIn = () => { Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start(); };
    const onPressOut = () => { Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start(); };
    const onPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const movieWithId = { ...movie, _id: movieId };
        router.push({
            pathname: '/detail',
            params: { data: JSON.stringify(movieWithId) },
        } as any);
    };

    const onFav = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        toggleFavorite({ ...movie, _id: movieId });
    };

    return (
        <Animated.View style={[styles.container, { opacity, transform: [{ scale }] }]}>
            <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: movie.poster || 'https://via.placeholder.com/300x450' }}
                        style={styles.poster}
                        resizeMode="cover"
                    />
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient} />
                    {movie.hd && (
                        <View style={styles.hdBadge}><Text style={styles.hdText}>HD</Text></View>
                    )}
                    <Pressable style={styles.favBtn} onPress={onFav}>
                        <Text style={{ fontSize: 18 }}>{fav ? '❤️' : '🤍'}</Text>
                    </Pressable>
                    {movie.imdb_rating && (
                        <View style={styles.ratingBadge}><Text style={styles.ratingText}>⭐ {movie.imdb_rating}</Text></View>
                    )}
                </View>
                <Text style={styles.title} numberOfLines={1}>{movie.title_en || movie.title || movie.name || 'Untitled'}</Text>
                <View style={styles.meta}>
                    {movie.year && <Text style={styles.metaText}>{movie.year}</Text>}
                    {movie.duration && <Text style={styles.metaText}> • {(Number(movie.duration) / 60).toFixed(1)} Hrs </Text>}
                </View>
                {movie.genres && movie.genres.length > 0 && (
                    <Text style={styles.genre} numberOfLines={1}>{movie.genres.map(gerne => gerne.name).slice(0, 2).join(' • ')}</Text>
                )}
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '47%',
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: COLORS.card,
    },
    imageWrapper: { position: 'relative' },
    poster: { width: '100%', height: 220, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
    gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
    hdBadge: {
        position: 'absolute', top: 8, left: 8,
        backgroundColor: COLORS.primary, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
    },
    hdText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    favBtn: { position: 'absolute', top: 8, right: 8 },
    ratingBadge: {
        position: 'absolute', bottom: 8, left: 8,
        backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
    },
    ratingText: { color: '#FFD700', fontSize: 11, fontWeight: '600' },
    title: { color: COLORS.text, fontSize: 13, fontWeight: '600', paddingHorizontal: 8, marginTop: 8 },
    meta: { flexDirection: 'row', paddingHorizontal: 8, marginTop: 4 },
    metaText: { color: COLORS.textSecondary, fontSize: 11 },
    genre: { color: COLORS.textSecondary, fontSize: 10, paddingHorizontal: 8, marginTop: 2, marginBottom: 8 },
});
