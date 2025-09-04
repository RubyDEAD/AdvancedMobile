// HeaderBar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HeaderBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Playlist' as never)} style={styles.btn}>
        <Text style={styles.btnText}>Playlist</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Settings' as never)} style={styles.btn}>
        <Text style={styles.btnText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)} style={styles.btn}>
        <Text style={styles.btnText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    backgroundColor: 'rgb(16,16,16)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderBottomColor: 'rgba(126,126,126,0.25)',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(63, 194, 78, 0.15)',
  },
  btnText: {
    color: 'rgb(63, 194, 78)',
    fontWeight: '700',
  },
});
