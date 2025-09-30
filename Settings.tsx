import React, { useCallback, useMemo } from 'react'
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  SectionList,
  Switch,
  TouchableOpacity,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import HeaderBar from './HeadBar'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store'
import { toggleTheme, setAccentColor } from './store/themeSlice'

type Row =
  | {
      key: string
      type: 'switch'
      title: string
      subtitle?: string
      icon?: keyof typeof Ionicons.glyphMap
      value?: boolean
    }
  | {
      key: string
      type: 'link'
      title: string
      subtitle?: string
      icon?: keyof typeof Ionicons.glyphMap
      navigateTo?: string
    }

type Section = {
  title: string
  data: Row[]
}

export default function Settings() {
  const dispatch = useDispatch()

  // Redux state
  const mode = useSelector((state: RootState) => state.theme.mode)
  const accent = useSelector((state: RootState) => state.theme.accentColor)

  // dynamic theme colors
  const colors = {
    background: mode === 'dark' ? 'rgb(16,16,16)' : 'white',
    card: mode === 'dark' ? 'rgb(32,32,32)' : '#f0f0f0',
    text: mode === 'dark' ? 'white' : 'black',
    subtitle: mode === 'dark' ? '#9aa0a6' : '#555',
  }

  // local states
  const [downloadOnCellular, setDownloadOnCellular] = React.useState(false)
  const [explicitContent, setExplicitContent] = React.useState(true)
  const [notifications, setNotifications] = React.useState(true)

  const darkMode = mode === 'dark'

  const sections: Section[] = useMemo(
    () => [
      {
        title: 'Playback',
        data: [
          {
            key: 'explicit',
            type: 'switch',
            title: 'Allow Explicit Content',
            subtitle: 'Block songs with explicit lyrics',
            icon: 'alert',
            value: explicitContent,
          },
        ],
      },
      {
        title: 'Downloads',
        data: [
          {
            key: 'cellular',
            type: 'switch',
            title: 'Download Using Cellular',
            subtitle: 'Use mobile data for downloads',
            icon: 'cellular',
            value: downloadOnCellular,
          },
        ],
      },
      {
        title: 'Appearance',
        data: [
          {
            key: 'dark',
            type: 'switch',
            title: 'Dark Mode',
            subtitle: 'Use dark color scheme',
            icon: 'moon',
            value: darkMode,
          },
          {
            key: 'green',
            type: 'link',
            title: 'Green Accent',
            subtitle: 'Spotify style',
            icon: 'color-palette',
          },
          {
            key: 'blue',
            type: 'link',
            title: 'Blue Accent',
            subtitle: 'Cool look',
            icon: 'color-palette',
          },
          {
            key: 'red',
            type: 'link',
            title: 'Red Accent',
            subtitle: 'Bold look',
            icon: 'color-palette',
          },
        ],
      },
      {
        title: 'Notifications',
        data: [
          {
            key: 'push',
            type: 'switch',
            title: 'Push Notifications',
            subtitle: 'Latest updates and recommendations',
            icon: 'notifications',
            value: notifications,
          },
        ],
      },
      {
        title: 'About',
        data: [
          {
            key: 'profile',
            type: 'link',
            title: 'Account',
            subtitle: 'Manage profile and subscription',
            icon: 'person-circle',
            navigateTo: 'Profile',
          },
          {
            key: 'licenses',
            type: 'link',
            title: 'Licenses',
            subtitle: 'Open source libraries',
            icon: 'document-text',
            navigateTo: 'Licenses',
          },
        ],
      },
    ],
    [darkMode, downloadOnCellular, explicitContent, notifications]
  )

  const renderSectionHeader = useCallback(
    ({ section }: { section: Section }) => {
      return <Text style={[styles.sectionTitle, { color: colors.subtitle }]}>{section.title}</Text>
    },
    [colors.subtitle]
  )

  const renderItem = useCallback(
    ({ item, index, section }: { item: Row; index: number; section: Section }) => {
      const isFirst = index === 0
      const isLast = index === section.data.length - 1

      const containerStyle = [
        styles.row,
        isFirst && styles.rowFirst,
        isLast && styles.rowLast,
        { backgroundColor: colors.card },
      ]

      if (item.type === 'switch') {
        const onToggle = () => {
          if (item.key === 'dark') dispatch(toggleTheme())
          if (item.key === 'cellular') setDownloadOnCellular((v) => !v)
          if (item.key === 'explicit') setExplicitContent((v) => !v)
          if (item.key === 'push') setNotifications((v) => !v)
        }

        return (
          <View style={containerStyle}>
            <View style={styles.left}>
              {item.icon && (
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={colors.subtitle}
                  style={styles.leftIcon}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{item.title}</Text>
                {item.subtitle ? (
                  <Text style={[styles.rowSubtitle, { color: colors.subtitle }]}>
                    {item.subtitle}
                  </Text>
                ) : null}
              </View>
            </View>
            <Switch
              value={item.value ?? false}
              onValueChange={onToggle}
              thumbColor={item.value ? '#fff' : '#f4f3f4'}
              trackColor={{ false: '#767577', true: accent }}
            />
          </View>
        )
      }

      // link row
      return (
        <TouchableOpacity
          style={containerStyle}
          activeOpacity={0.7}
          onPress={() => {
            if (item.key === 'green') dispatch(setAccentColor('#3fc24e'))
            if (item.key === 'blue') dispatch(setAccentColor('#4287f5'))
            if (item.key === 'red') dispatch(setAccentColor('#f54242'))
          }}
        >
          <View style={styles.left}>
            {item.icon && (
              <Ionicons
                name={item.icon}
                size={20}
                color={colors.subtitle}
                style={styles.leftIcon}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>{item.title}</Text>
              {item.subtitle ? (
                <Text style={[styles.rowSubtitle, { color: colors.subtitle }]}>
                  {item.subtitle}
                </Text>
              ) : null}
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.subtitle} />
        </TouchableOpacity>
      )
    },
    [dispatch, darkMode, downloadOnCellular, explicitContent, notifications, colors, accent]
  )

  const ItemSeparator = () => <View style={styles.separator} />

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <HeaderBar />
      <SectionList
        sections={sections}
        keyExtractor={(row) => row.key}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={ItemSeparator}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  row: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowFirst: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  rowLast: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  separator: { height: 10 },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  leftIcon: { marginRight: 10 },
  rowTitle: { fontSize: 15, fontWeight: '600' },
  rowSubtitle: { fontSize: 12, marginTop: 2 },
})
