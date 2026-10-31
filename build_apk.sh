#!/usr/bin/env bash
set -euo pipefail

# Directories
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANDROID_DIR="${PROJECT_DIR}/Yuu-android"
OUTPUT_APK="${ANDROID_DIR}/yuuonline.apk"
KEYSTORE="${ANDROID_DIR}/debug.keystore"
ALIAS="androiddebugkey"
PASSWORD="android"

echo "==> Packaging Yuu Android APK..."

cd "${ANDROID_DIR}"

# Ensure debug keystore exists (creates one automatically if missing)
if [ ! -f "${KEYSTORE}" ]; then
    echo "==> Creating debug keystore (${KEYSTORE})..."
    keytool -genkey -v \
        -keystore "${KEYSTORE}" \
        -storepass "${PASSWORD}" \
        -alias "${ALIAS}" \
        -keypass "${PASSWORD}" \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -dname "CN=Android Debug,O=Android,C=US"
fi

# Package all files into APK (excluding existing apks, decompiled files, and keystores)
echo "==> Building APK archive..."
rm -f "${OUTPUT_APK}"
zip -r -q "${OUTPUT_APK}" \
    AndroidManifest.xml \
    assets \
    classes*.dex \
    kotlin \
    lib \
    META-INF \
    res \
    resources.arsc \
    DebugProbesKt.bin

# Sign APK with debug keystore
echo "==> Signing APK with jarsigner..."
jarsigner -sigalg SHA256withRSA \
    -digestalg SHA-256 \
    -keystore "${KEYSTORE}" \
    -storepass "${PASSWORD}" \
    "${OUTPUT_APK}" \
    "${ALIAS}"

echo "==> Successfully created and signed: ${OUTPUT_APK}"

