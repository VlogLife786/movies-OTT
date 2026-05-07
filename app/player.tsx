import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { WebView } from 'react-native-webview';
import { COLORS } from '../constants';

export default function PlayerScreen() {
    const { url, title, source } = useLocalSearchParams<{ url: string; title: string; source: string }>();
    const router = useRouter();
    const [fullscreen, setFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);
    const isIframe = source === 'iframe';

    const player = useVideoPlayer(!isIframe ? (url || '') : '', (p) => {
        if (!isIframe) p.play();
    });

    const toggleFullscreen = async () => {
        if (fullscreen) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }
        setFullscreen(!fullscreen);
    };

    const onBack = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={onBack}>
                    <Text style={styles.backText}>← Back</Text>
                </Pressable>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Pressable onPress={toggleFullscreen}>
                    <Text style={styles.backText}>{fullscreen ? '⊡' : '⊞'}</Text>
                </Pressable>
            </View>

            <View style={styles.videoContainer}>
                {loading && <ActivityIndicator color={COLORS.primary} size="large" style={styles.loader} />}
                {isIframe ? (
                    <WebView
                        source={{ uri: url || '' }}
                        style={styles.video}
                        allowsFullscreenVideo
                        mediaPlaybackRequiresUserAction={false}
                        javaScriptEnabled
                        domStorageEnabled
                        onLoadEnd={() => setLoading(false)}
                    />
                ) : (
                    <VideoView
                        player={player}
                        style={styles.video}
                        allowsFullscreen
                        allowsPictureInPicture
                        nativeControls
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12,
    },
    backText: { color: COLORS.text, fontSize: 16 },
    title: { color: COLORS.text, fontSize: 14, fontWeight: '600', flex: 1, textAlign: 'center', marginHorizontal: 12 },
    videoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    video: { width: '100%', height: '100%' },
    loader: { position: 'absolute', zIndex: 10 },
});
