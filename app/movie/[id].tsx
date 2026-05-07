import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet, Pressable, Dimensions, Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants';
import { Movie, Player } from '../../types';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

export default function MovieDetailScreen() {
  const { data } = useLocalSearchParams<{ id: string; data: string }>();
  const router = useRouter();
  const movie: Movie = JSON.parse(data || '{}');
  const { toggleFavorite, isFavorite, addToRecent } = useStore();
  const movieId = movie._id || movie.id || '';
  const fav = isFavorite(movieId);
  const [showPlayers, setShowPlayers] = useState(false);

  const playersList: Player[] = movie.player || movie.players || [];

  const onPlay = (player: Player) => {
    console.log(player.source);
    
    setShowPlayers(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addToRecent({ ...movie, _id: movieId });
    router.push({
      pathname: player.source == 'iframe' ? '/iframe-player' : '/m3u8-player',
      params: { url: player.url, title: movie.title_en || movie.title || movie.name || '' },
    });
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Backdrop */}
      <View style={styles.backdropWrapper}>
        <Image
          source={{ uri: movie.poster || movie.backdrop || 'https://via.placeholder.com/600x400' }}
          style={styles.backdrop}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', COLORS.background]}
          style={styles.gradient}
        />
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={{ fontSize: 24 }}>←</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title_en || movie.title || movie.name || 'Untitled'}</Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          {movie.year && <Text style={styles.metaChip}>{movie.year}</Text>}
          {movie.duration && <Text style={styles.metaChip}>{movie.duration}</Text>}
          {movie.imdb_rating && <Text style={styles.metaChip}>⭐ {movie.imdb_rating}</Text>}
          {movie.hd && <Text style={[styles.metaChip, { backgroundColor: COLORS.primary }]}>HD</Text>}
        </View>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.genreRow}>
            {movie.genres.map((g, i) => (
              <View key={i} style={styles.genreBadge}>
                <Text style={styles.genreText}>{g}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {movie.languages && movie.languages.length > 0 && (
          <View style={styles.genreRow}>
            {movie.languages.map((l, i) => (
              <View key={i} style={[styles.genreBadge, { borderColor: '#4A90D9' }]}>
                <Text style={[styles.genreText, { color: '#4A90D9' }]}>{l}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Description */}
        {movie.description && <Text style={styles.description}>{movie.description}</Text>}

        {/* Country */}
        {movie.country && <Text style={styles.country}>Country: {movie.country}</Text>}        {/* Play Button - opens player popup */}
        {playersList.length > 0 && (
          <Pressable
            style={styles.playButton}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowPlayers(true); }}
          >
            <Text style={styles.playButtonText}>▶  Watch Now</Text>
          </Pressable>
        )}

        {/* Favorite Button */}
        <Pressable
          style={[styles.favButton, fav && { backgroundColor: COLORS.primary }]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); toggleFavorite({ ...movie, _id: movieId }); }}
        >
          <Text style={styles.favButtonText}>{fav ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}</Text>
        </Pressable>
      </View>

      {/* Player Selection Modal */}
      <Modal visible={showPlayers} transparent animationType="slide" onRequestClose={() => setShowPlayers(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowPlayers(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Player</Text>
              <Pressable onPress={() => setShowPlayers(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.playerRow}>
              {playersList.map((player, i) => (
                <Pressable key={i} style={styles.playerChip} onPress={() => onPlay(player)}>
                  <Text style={styles.playerChipIcon}>▶️</Text>
                  <Text style={styles.playerChipName}>{player.translator}</Text>
                  <Text style={styles.playerChipQuality}>{player.quality} • {player.source}</Text>
                </Pressable>
              ))}
            </ScrollView>
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
  favButton: {
    marginTop: 20, backgroundColor: COLORS.surface, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  favButtonText: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  playersSection: { marginTop: 24, marginBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  playerCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border,
  }, playerName: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  playerMeta: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  playButton: {
    marginTop: 20, backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  playButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingVertical: 20, paddingHorizontal: 16,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  modalClose: { color: COLORS.textSecondary, fontSize: 22 },
  playerRow: { gap: 12, paddingBottom: 20 },
  playerChip: {
    backgroundColor: COLORS.card, borderRadius: 12, padding: 16, width: 160,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  playerChipIcon: { fontSize: 28, marginBottom: 8 },
  playerChipName: { color: COLORS.text, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  playerChipQuality: { color: COLORS.textSecondary, fontSize: 11, marginTop: 4 },
});
