// Playlist.tsx
import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import HeaderBar from './HeadBar';

type Track = {
  id: string;
  title: string;
  artist: string;
  durationSec: number;
  artwork?: any;
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

export default function Playlist() {
  const [nowPlayingId, setNowPlayingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const data = useMemo(() => sampleTracks, []);

  const onPressTrack = useCallback((track: Track) => {
    if (track.id === nowPlayingId) {
      setIsPlaying((p) => !p);
    } else {
      setNowPlayingId(track.id);
      setIsPlaying(true);
    }
  }, [nowPlayingId]);

  const renderItem = useCallback(({ item }: { item: Track }) => {
    const active = item.id === nowPlayingId;
    return (
      <TouchableOpacity style={styles.row} onPress={() => onPressTrack(item)}>
        <View style={styles.artworkWrap}>
          {item.artwork ? (
            <Image source={item.artwork} style={styles.artwork} accessibilityLabel={`${item.title} artwork`} />
          ) : (
            <View style={styles.artworkFallback}>
              <Ionicons name="musical-notes" size={18} color="#9aa0a6" />
            </View>
          )}
        </View>

        <View style={styles.meta}>
          <Text style={[styles.title, active && styles.activeTitle]} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
        </View>

        <View style={styles.right}>
          <Text style={styles.duration}>{formatDuration(item.durationSec)}</Text>
          <TouchableOpacity style={styles.playBtn} onPress={() => onPressTrack(item)} accessibilityLabel={active && isPlaying ? 'Pause' : 'Play'}>
            <Ionicons name={active && isPlaying ? 'pause' : 'play'} size={18} color="#0f0" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }, [isPlaying, nowPlayingId, onPressTrack]);

  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Shared app header at the very top */}
      <HeaderBar />

      {/* Screen-local title + shuffle action */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Playlist</Text>
        <TouchableOpacity style={styles.shuffleBtn}>
          <Ionicons name="shuffle" size={18} color="#101010" />
          <Text style={styles.shuffleText}>Shuffle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {nowPlayingId && (
        <View style={styles.nowPlayingBar}>
          <Ionicons name="musical-note" size={16} color="#0f0" />
          <Text style={styles.nowPlayingText} numberOfLines={1}>
            Now Playing · {data.find((t) => t.id === nowPlayingId)?.title}
          </Text>
          <TouchableOpacity onPress={() => setIsPlaying((p) => !p)} style={styles.nowPlayingBtn}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color="#0f0" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'rgb(16, 16, 16)' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: '700' },
  shuffleBtn: {
    backgroundColor: 'rgb(63, 194, 78)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
  },
  shuffleText: { color: '#101010', fontWeight: '700' },
  listContent: { padding: 10 },
  row: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center' },
  artworkWrap: {
    width: 54, height: 54, borderRadius: 8, overflow: 'hidden',
    backgroundColor: 'rgb(32,32,32)', alignItems: 'center', justifyContent: 'center',
  },
  artwork: { width: 54, height: 54 },
  artworkFallback: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center' },
  meta: { flex: 1, marginLeft: 12, marginRight: 8 },
  title: { color: 'white', fontSize: 16, fontWeight: '700' },
  activeTitle: { color: 'rgb(63, 194, 78)' },
  artist: { color: '#9aa0a6', fontSize: 13, marginTop: 3 },
  right: { alignItems: 'flex-end', justifyContent: 'center' },
  duration: { color: '#9aa0a6', fontSize: 12, marginBottom: 6 },
  playBtn: {
    width: 34, height: 34, borderRadius: 17, borderColor: 'rgb(63, 194, 78)',
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(126,126,126,0.25)', marginLeft: 78 },
  nowPlayingBar: {
    position: 'absolute', left: 10, right: 10, bottom: 12, backgroundColor: 'rgba(32,32,32,0.95)',
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  nowPlayingText: { color: 'white', fontSize: 13, flex: 1 },
  nowPlayingBtn: {
    width: 34, height: 34, borderRadius: 17, borderColor: 'rgb(63, 194, 78)',
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
});
