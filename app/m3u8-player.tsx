import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useLocalSearchParams } from 'expo-router';

export default function M3U8VideoPlayer() {
    const { url, title, source } = useLocalSearchParams<{ url: string; title: string; source: string }>();

    const webViewRef = useRef(null);


    useEffect(() => {
        // 🔄 Lock to Landscape
        ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
        );

        // 🙈 Hide Status Bar
        StatusBar.setHidden(true);

        return () => {
            // 🔁 Restore Portrait on Exit
            ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
            StatusBar.setHidden(false);
        };
    }, []);

    // 📄 HTML with HLS.js Player
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        >
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            background-color: #000;
          }

          html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #000;
          }

          .container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: #000;
          }

          /* Loading Spinner */
          .loader {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            border: 5px solid #ffffff30;
            border-top: 5px solid #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            z-index: 999;
          }

          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }

          .loader.hidden {
            display: none;
          }

          /* Error Message */
          .error {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            font-size: 16px;
            font-family: Arial;
            text-align: center;
            z-index: 999;
          }

          .error.show {
            display: block;
          }
        </style>
      </head>
      <body>

        <!-- Loading Spinner -->
        <div class="loader" id="loader"></div>

        <!-- Error Message -->
        <div class="error" id="error">
          ⚠️ Failed to load video.<br/>Please check your connection.
        </div>

        <!-- Video Container -->
        <div class="container">
          <video
            id="video"
            controls
            autoplay
            playsinline
            webkit-playsinline
            preload="auto"
          ></video>
        </div>

        <!-- HLS.js CDN -->
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>

        <script>
          const video = document.getElementById('video');
          const loader = document.getElementById('loader');
          const errorDiv = document.getElementById('error');
          const m3u8Url = '${url}';

          function hideLoader() {
            loader.classList.add('hidden');
          }

          function showError() {
            hideLoader();
            errorDiv.classList.add('show');
          }

          // ✅ Check HLS Support
          if (Hls.isSupported()) {
            const hls = new Hls({
              debug: false,
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90,
            });

            hls.loadSource(m3u8Url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
              hideLoader();
              video.play().catch(function(e) {
                console.log('Autoplay prevented:', e);
                hideLoader();
              });
            });

            hls.on(Hls.Events.ERROR, function (event, data) {
              console.log('HLS Error:', data);
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    hls.startLoad(); // Try to recover
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    hls.recoverMediaError(); // Try to recover
                    break;
                  default:
                    showError();
                    break;
                }
              }
            });

          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // ✅ Native HLS Support (Safari / Some Android)
            video.src = m3u8Url;
            video.addEventListener('loadedmetadata', function () {
              hideLoader();
              video.play();
            });
            video.addEventListener('error', function () {
              showError();
            });

          } else {
            showError();
          }

          // Hide loader when video starts playing
          video.addEventListener('playing', function () {
            hideLoader();
          });

          // Handle video errors
          video.addEventListener('error', function () {
            showError();
          });
        </script>

      </body>
    </html>
  `;

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <WebView
                ref={webViewRef}
                source={{ html: htmlContent }}
                style={styles.webview}
                allowsFullscreenVideo={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={['*']}
                mixedContentMode="always"
                allowUniversalAccessFromFileURLs={true}
                allowFileAccessFromFileURLs={true}
                onError={(error) => console.log('WebView Error:', error.nativeEvent)}
                onHttpError={(error) => console.log('HTTP Error:', error.nativeEvent)}
                onLoad={() => console.log('✅ WebView Loaded')}
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