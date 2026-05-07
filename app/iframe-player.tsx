import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useLocalSearchParams } from 'expo-router';

export default function VideoPlayer() {
    const { url, title, source } = useLocalSearchParams<{ url: string; title: string; source: string }>();

    useEffect(() => {
        // Lock to Landscape
        ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
        );

        // Hide Status Bar
        StatusBar.setHidden(true);

        return () => {
            // Restore when leaving
            ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
            StatusBar.setHidden(false);
        };
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <WebView
                source={{
                    uri: url,
                }}
                style={styles.webview}
                allowsFullscreenVideo={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={['*']}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
        backgroundColor: '#000',
    },
});