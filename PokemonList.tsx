// PokemonList.tsx
// Single-file React Native + Expo component that fetches 20 Pokémon per page from PokeAPI,
// shows images, names, types, supports pagination, pull-to-refresh, caching via AsyncStorage
// with 24-hour invalidation, loading & error states, and basic offline handling.

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// --------------------
// Config
// --------------------
const PAGE_SIZE = 20;
const CACHE_PREFIX = 'poke_cache_v1_'; // version your cache if you change schema
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// --------------------
// Types (lightweight)
// --------------------
type Pokemon = {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
};

// --------------------
// Helpers
// --------------------
async function readCache(key: string) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.timestamp || !parsed.data) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      // expired
      await AsyncStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch (e) {
    console.warn('Failed reading cache', e);
    return null;
  }
}

async function writeCache(key: string, data: any) {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch (e) {
    console.warn('Failed writing cache', e);
  }
}

// fetch list, then details for each
async function fetchPokemonPage(offset = 0) {
  const listUrl = `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`;
  const listResp = await axios.get(listUrl);
  const results = listResp.data.results as { name: string; url: string }[];

  // fetch details in parallel
  const details = await Promise.all(
    results.map(async (r) => {
      const d = await axios.get(r.url);
      const j = d.data;
      const sprite = j.sprites?.other?.['official-artwork']?.front_default || j.sprites?.front_default || null;
      const types = (j.types || []).map((t: any) => t.type.name);
      return {
        id: j.id,
        name: j.name,
        sprite,
        types,
      } as Pokemon;
    })
  );

  const count = listResp.data.count;
  return { pokemons: details, count };
}

// --------------------
// Component
// --------------------
export default function PokemonList() {
  const [data, setData] = useState<Pokemon[]>([]);
  const [pageOffset, setPageOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const netInfoRef = useRef<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      netInfoRef.current = state.isConnected;
    });
    // initial load
    loadPage(0, { useCache: true });
    return () => unsubscribe();
  }, []);

  const getCacheKey = (offset: number) => `${CACHE_PREFIX}${offset}`;

  // loadPage: offset-based pagination
  const loadPage = useCallback(
    async (offset: number, opts: { useCache?: boolean; forceRefresh?: boolean } = {}) => {
      const key = getCacheKey(offset);
      try {
        if (offset === 0) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        // Try cache first (unless forceRefresh)
        if (!opts.forceRefresh && opts.useCache !== false) {
          const cached = await readCache(key);
          if (cached && cached.pokemons) {
            // if loading first page, replace; else append
            setData((prev) => (offset === 0 ? cached.pokemons : [...prev, ...cached.pokemons]));
            setTotalCount(cached.count ?? null);
            // still try to refresh in background if online
            if (netInfoRef.current) {
              // fire-and-forget background refresh (we won't wait for it)
              fetchPokemonPage(offset)
                .then((fresh) => writeCache(key, fresh))
                .catch(() => {});
            }
            if (offset === 0) setLoading(false);
            else setLoadingMore(false);
            return;
          }
        }

        // If we reach here we must fetch from network
        const resp = await fetchPokemonPage(offset);
        // write cache
        await writeCache(key, resp);
        setData((prev) => (offset === 0 ? resp.pokemons : [...prev, ...resp.pokemons]));
        setTotalCount(resp.count ?? null);
      } catch (e: any) {
        console.warn('loadPage error', e);
        setError('Failed to load Pokémon. Showing offline cache if available.');
        // try to load from cache as fallback
        const cached = await readCache(getCacheKey(offset));
        if (cached && cached.pokemons) {
          setData((prev) => (offset === 0 ? cached.pokemons : [...prev, ...cached.pokemons]));
          setTotalCount(cached.count ?? null);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    []
  );

  // initial / refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPageOffset(0);
    // force refresh -> ignore cache and update caches
    await loadPage(0, { useCache: false, forceRefresh: true });
  }, [loadPage]);

  // load next page
  const loadMore = useCallback(async () => {
    if (loadingMore || loading) return;
    if (totalCount !== null && data.length >= totalCount) return; // all loaded

    const nextOffset = pageOffset + PAGE_SIZE;
    setPageOffset(nextOffset);
    await loadPage(nextOffset, { useCache: true });
  }, [loadingMore, loading, pageOffset, data.length, totalCount, loadPage]);

  const renderItem = ({ item }: { item: Pokemon }) => (
    <TouchableOpacity
      accessible
      accessibilityLabel={`${item.name} types ${item.types.join(', ')}`}
      style={styles.card}
      onPress={() => Alert.alert(item.name.toUpperCase(), `Types: ${item.types.join(', ')}`)}
    >
      {item.sprite ? (
        <Image source={{ uri: item.sprite }} style={styles.sprite} resizeMode="contain" />
      ) : (
        <View style={[styles.sprite, styles.placeholder]}>
          <Text>N/A</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.types}>{item.types.join(' • ')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokémon (PokeAPI) — Page {pageOffset / PAGE_SIZE + 1}</Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading && data.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text>Loading Pokémon...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loadingMore ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator />
                <Text>Loading more...</Text>
              </View>
            ) : null
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          accessibilityLabel="Pokémon list"
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Tip: pull down to refresh. Tap a card for details.</Text>
      </View>
    </SafeAreaView>
  );
}

// --------------------
// Styles
// --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 18, fontWeight: '700' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: '#f2f2f2', alignItems: 'center' },
  sprite: { width: 72, height: 72, marginRight: 12, backgroundColor: '#fafafa' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', textTransform: 'capitalize' },
  types: { marginTop: 6, color: '#666', textTransform: 'capitalize' },
  footerLoading: { padding: 12, alignItems: 'center' },
  footer: { padding: 8, borderTopWidth: 1, borderColor: '#eee' },
  footerText: { fontSize: 12, color: '#666' },
  errorBox: { padding: 10, backgroundColor: '#fee', margin: 8, borderRadius: 6 },
  errorText: { color: '#900' },
});

/*
Dependencies:
- axios
- @react-native-async-storage/async-storage
- @react-native-community/netinfo

Install with:

expo install @react-native-async-storage/async-storage @react-native-community/netinfo
npm install axios

Notes:
- The component caches each page separately with a TTL of 24 hours. If cache exists it displays immediately and does a background refresh if the device is online.
- Pull-to-refresh forces a network refresh and updates cache for page 0.
- Pagination uses offset and PAGE_SIZE; FlatList's onEndReached loads next page.
- For full offline support verify cached pages exist (e.g., open app while online first) and then turn off network to test.

Submission checklist (included in this file):
1) Screenshot: open the app to the Pokémon list and take a screenshot (on Android: Power+VolumeDown; iOS Simulator: ⌘+S or device-specific). Save as pokemon_list.png.
2) 3–4 sentence note on API integration (below).
3) Zip or push this component + package.json and assets to your repo and attach screenshot + note when submitting.

3–4 sentence note on API integration:
I integrated the PokeAPI using axios, fetching 20 Pokémon per page and then fetching each Pokémon's details to obtain sprites and types. Responses are cached in AsyncStorage per page and invalidated after 24 hours to provide offline access and reduce network usage. Pull-to-refresh forces a fresh network fetch and updates the cache, while pagination loads additional pages on demand. Loading and error states are handled with UI feedback and offline fallbacks to cached data.
*/
