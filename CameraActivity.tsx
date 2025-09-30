import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

const CameraWithFilters: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Capture photo
  const capture = async () => {
    try {
      if (!cameraRef.current) return;
      const result = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: false,
      });
      setPhotoUri(result.uri);
    } catch (err) {
      console.error("capture error", err);
      Alert.alert("Capture Error", String(err));
    }
  };

  // Flip camera
  const toggleFacing = () => {
    setFacing((f) => (f === "back" ? "front" : "back"));
  };

  // Save photo to gallery
  const saveToGallery = async () => {
    if (!photoUri) {
      Alert.alert("No image to save");
      return;
    }
    setIsSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Allow media library access to save photos.");
        setIsSaving(false);
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(photoUri);
      await MediaLibrary.createAlbumAsync("CameraApp", asset, false);
      Alert.alert("Saved", "Photo saved to gallery.");
    } catch (err) {
      console.error("save error", err);
      Alert.alert("Save Error", String(err));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle permissions
  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No camera permission.</Text>
        <TouchableOpacity onPress={() => requestPermission()}>
          <Text style={styles.button}>Grant camera permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Show camera view if no photo
  if (!photoUri) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={cameraRef}
            facing={facing}
            mode="picture" // 👈 This prevents microphone permission request
          />
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleFacing} style={styles.controlButton}>
            <Text style={styles.controlText}>Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={capture} style={styles.captureButton}>
            <Text style={styles.captureText}>Capture</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show captured photo preview
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.previewContainer}>
        {photoUri && (
          <Image
            source={{ uri: photoUri }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        )}
      </View>

      <View style={styles.finalActions}>
        <TouchableOpacity
          onPress={() => setPhotoUri(null)}
          style={styles.controlButton}
        >
          <Text>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={saveToGallery} style={styles.saveButton}>
          <Text style={{ color: "#fff" }}>{isSaving ? "Saving..." : "Save"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CameraWithFilters;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  cameraContainer: { flex: 1, overflow: "hidden", borderRadius: 12 },
  camera: { flex: 1 },
  controls: {
    height: 120,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#111",
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  controlText: { color: "#000" },
  captureButton: {
    width: 100,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  captureText: { fontWeight: "700" },
  previewContainer: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  previewImage: { width: "100%", height: "100%" },
  finalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#111",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  button: { color: "blue", marginTop: 12 },
});
