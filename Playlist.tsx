import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import HeaderBar from './HeadBar';
import * as FileSystem from 'expo-file-system';
import { RootState } from './store'; // adjust path if needed

type Track = {
  id: string;
  title: string;
  artist: string;
  durationSec: number;
  artwork?: any;
  localUri?: string;
};

const sampleTracks: Track[] = [
  { id: '1', title: 'Midnight City', artist: 'M83', durationSec: 287, artwork: { uri: 'https://i.scdn.co/image/ab67616d00001e028b8f9f9c6fcd5c2c8d0b3e8b' } },
  { id: '2', title: 'Blinding Lights', artist: 'The Weeknd', durationSec: 200, artwork: { uri: 'https://i.scdn.co/image/ab67616d00001e02f4a3a2d9a73d1d2f6e1e3b6e' } },
  { id: '3', title: 'Levitating', artist: 'Dua Lipa', durationSec: 203, artwork: { uri: 'https://i.scdn.co/image/ab67616d00001e02f8c1d4e6c6b1d0a53c1f7c41' } },
];

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

async function downloadSong(youtubeUrl: string) {
  try {
    const serverUrl = `http://localhost:5000/download?url=${encodeURIComponent(youtubeUrl)}`;
    const fileUri = FileSystem.documentDirectory + `yt_${Date.now()}.mp3`;

    const { uri } = await FileSystem.downloadAsync(serverUrl, fileUri);
    console.log('✅ Saved:', uri);
    return uri;
  } catch (err) {
    console.error('Download error:', err);
    Alert.alert('Error', 'Failed to download song');
    return null;
  }
}

export default function Playlist() {
  const [tracks, setTracks] = useState<Track[]>(sampleTracks);
  const [nowPlayingId, setNowPlayingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');

  const { mode, accentColor } = useSelector((state: RootState) => state.theme);

  // ✅ derive full palette from mode + accentColor
  const palette = {
    background: mode === 'dark' ? '#101010' : '#ffffff',
    text: mode === 'dark' ? '#ffffff' : '#000000',
    textSecondary: mode === 'dark' ? '#bbbbbb' : '#555555',
    card: mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
    border: mode === 'dark' ? '#333333' : '#dddddd',
    accent: accentColor,
    buttonText: mode === 'dark' ? '#000000' : '#ffffff',
  };

  const onPressTrack = useCallback(
    (track: Track) => {
      if (track.id === nowPlayingId) {
        setIsPlaying((p) => !p);
      } else {
        setNowPlayingId(track.id);
        setIsPlaying(true);
      }
    },
    [nowPlayingId]
  );

  const renderItem = useCallback(
    ({ item }: { item: Track }) => {
      const active = item.id === nowPlayingId;
      return (
        <TouchableOpacity style={styles(palette).row} onPress={() => onPressTrack(item)}>
          <View style={styles(palette).artworkWrap}>
            {item.artwork ? (
              <Image source={item.artwork} style={styles(palette).artwork} accessibilityLabel={`${item.title} artwork`} />
            ) : (
              <View style={styles(palette).artworkFallback}>
                <Ionicons name="musical-notes" size={18} color={palette.accent} />
              </View>
            )}
          </View>

          <View style={styles(palette).meta}>
            <Text style={[styles(palette).title, active && styles(palette).activeTitle]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles(palette).artist} numberOfLines={1}>
              {item.artist}
            </Text>
          </View>

          <View style={styles(palette).right}>
            <Text style={styles(palette).duration}>{formatDuration(item.durationSec)}</Text>
            <TouchableOpacity style={styles(palette).playBtn} onPress={() => onPressTrack(item)} />
          </View>
        </TouchableOpacity>
      );
    },
    [isPlaying, nowPlayingId, onPressTrack, palette]
  );

  const ItemSeparator = () => <View style={styles(palette).separator} />;

  const handleAddTrack = async () => {
    if (!youtubeLink.trim()) return;

    const uri = await downloadSong(youtubeLink);
    if (!uri) return;

    const newTrack: Track = {
      id: (tracks.length + 1).toString(),
      title: 'Downloaded Track',
      artist: 'YouTube',
      durationSec: 0,
      artwork: undefined,
      localUri: uri,
    };

    setTracks([...tracks, newTrack]);
    setYoutubeLink('');
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles(palette).safe}>
      <HeaderBar />

      <View style={styles(palette).header}>
        <Text style={styles(palette).headerTitle}>Playlist</Text>
        <TouchableOpacity style={styles(palette).shuffleBtn}>
          <Ionicons name="shuffle" size={18} color={palette.buttonText} />
          <Text style={styles(palette).shuffleText}>Shuffle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tracks}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles(palette).listContent}
        showsVerticalScrollIndicator={false}
      />

      {nowPlayingId && (
        <View style={styles(palette).nowPlayingBar}>
          <Ionicons name="musical-note" size={16} color={palette.accent} />
          <Text style={styles(palette).nowPlayingText} numberOfLines={1}>
            Now Playing · {tracks.find((t) => t.id === nowPlayingId)?.title}
          </Text>
          <TouchableOpacity onPress={() => setIsPlaying((p) => !p)} style={styles(palette).nowPlayingBtn}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color={palette.accent} />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles(palette).addBtn} onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles(palette).modalOverlay}>
          <View style={styles(palette).modalContent}>
            <Text style={styles(palette).modalTitle}>Add YouTube Link</Text>
            <TextInput
              style={styles(palette).input}
              placeholder="Paste YouTube link here"
              placeholderTextColor={palette.textSecondary}
              value={youtubeLink}
              onChangeText={setYoutubeLink}
            />
            <View style={styles(palette).modalActions}>
              <TouchableOpacity style={styles(palette).cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles(palette).cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles(palette).confirmBtn} onPress={handleAddTrack}>
                <Text style={styles(palette).confirmText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ✅ Dynamic styles based on derived palette
const styles = (theme: any) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    header: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: { color: theme.text, fontSize: 28, fontWeight: '700' },
    shuffleBtn: {
      backgroundColor: theme.accent,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      gap: 8,
    },
    shuffleText: { color: theme.buttonText, fontWeight: '700' },
    listContent: { padding: 10 },
    row: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center' },
    artworkWrap: {
      width: 54,
      height: 54,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: theme.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    artwork: { width: 54, height: 54 },
    artworkFallback: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center' },
    meta: { flex: 1, marginLeft: 12, marginRight: 8 },
    title: { color: theme.text, fontSize: 16, fontWeight: '700' },
    activeTitle: { color: theme.accent },
    artist: { color: theme.textSecondary, fontSize: 13, marginTop: 3 },
    right: { alignItems: 'flex-end', justifyContent: 'center' },
    duration: { color: theme.textSecondary, fontSize: 12, marginBottom: 6 },
    playBtn: {
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
    },
    separator: { height: StyleSheet.hairlineWidth, backgroundColor: theme.border, marginLeft: 78 },
    nowPlayingBar: {
      position: 'absolute',
      left: 10,
      right: 10,
      bottom: 70,
      backgroundColor: theme.card,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    nowPlayingText: { color: theme.text, fontSize: 13, flex: 1 },
    nowPlayingBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderColor: theme.accent,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addBtn: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      backgroundColor: theme.accent,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 12,
      width: '80%',
    },
    modalTitle: { color: theme.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 10,
      color: theme.text,
      marginBottom: 16,
    },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    cancelBtn: { paddingVertical: 6, paddingHorizontal: 12 },
    cancelText: { color: theme.textSecondary, fontWeight: '600' },
    confirmBtn: { backgroundColor: theme.accent, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 16 },
    confirmText: { color: theme.buttonText, fontWeight: '700' },
  });
