import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { RootState } from './store'

export default function HeaderBar() {
  const navigation = useNavigation()

  // Redux state
  const mode = useSelector((state: RootState) => state.theme.mode)
  const accent = useSelector((state: RootState) => state.theme.accentColor)

  // Dynamic colors
  const colors = {
    background: mode === 'dark' ? 'rgb(16,16,16)' : '#f5f5f5',
    text: accent,
    buttonBg: `${accent}25`, // translucent version of accent
    border: mode === 'dark' ? 'rgba(126,126,126,0.25)' : '#ddd',
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Playlist' as never)}
        style={[styles.btn, { backgroundColor: colors.buttonBg }]}
      >
        <Text style={[styles.btnText, { color: colors.text }]}>Playlist</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Settings' as never)}
        style={[styles.btn, { backgroundColor: colors.buttonBg }]}
      >
        <Text style={[styles.btnText, { color: colors.text }]}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Profile' as never)}
        style={[styles.btn, { backgroundColor: colors.buttonBg }]}
      >
        <Text style={[styles.btnText, { color: colors.text }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  btnText: {
    fontWeight: '700',
  },
})
