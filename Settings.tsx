// Settings.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  SectionList,
  Switch,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import HeaderBar from './HeadBar'; // ensure correct filename/export

type Row =
  | {
      key: string;
      type: 'switch';
      title: string;
      subtitle?: string;
      icon?: keyof typeof Ionicons.glyphMap;
      value: boolean;
    }
  | {
      key: string;
      type: 'link';
      title: string;
      subtitle?: string;
      icon?: keyof typeof Ionicons.glyphMap;
      navigateTo?: string;
    };

type Section = {
  title: string;
  data: Row[];
};

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [downloadOnCellular, setDownloadOnCellular] = useState(false);
  const [explicitContent, setExplicitContent] = useState(true);
  const [notifications, setNotifications] = useState(true);

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
  );

  const renderSectionHeader = useCallback(({ section }: { section: Section }) => {
    return <Text style={styles.sectionTitle}>{section.title}</Text>;
  }, []);

  const renderItem = useCallback(
    ({ item, index, section }: { item: Row; index: number; section: Section }) => {
      const isFirst = index === 0;
      const isLast = index === section.data.length - 1;

      const containerStyle = [
        styles.row,
        isFirst && styles.rowFirst,
        isLast && styles.rowLast,
      ];

      if (item.type === 'switch') {
        const onToggle = () => {
          if (item.key === 'dark') setDarkMode((v) => !v);
          if (item.key === 'cellular') setDownloadOnCellular((v) => !v);
          if (item.key === 'explicit') setExplicitContent((v) => !v);
          if (item.key === 'push') setNotifications((v) => !v);
        };

        const value =
          item.key === 'dark'
            ? darkMode
            : item.key === 'cellular'
            ? downloadOnCellular
            : item.key === 'explicit'
            ? explicitContent
            : notifications;

        return (
          <View style={containerStyle} accessible accessibilityRole="switch" accessibilityLabel={item.title}>
            <View style={styles.left}>
              {item.icon && (
                <Ionicons name={item.icon} size={20} color="#9aa0a6" style={styles.leftIcon} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                {item.subtitle ? <Text style={styles.rowSubtitle}>{item.subtitle}</Text> : null}
              </View>
            </View>
            <Switch
              value={value}
              onValueChange={onToggle}
              thumbColor={value ? '#fff' : '#f4f3f4'}
              trackColor={{ false: '#767577', true: 'rgb(63, 194, 78)' }}
            />
          </View>
        );
      }

      // link row
      return (
        <TouchableOpacity
          style={containerStyle}
          activeOpacity={0.7}
          accessible
          accessibilityRole="button"
          accessibilityLabel={item.title}
          onPress={() => {
            // navigation.navigate(item.navigateTo!) if wired with useNavigation
          }}
        >
          <View style={styles.left}>
            {item.icon && (
              <Ionicons name={item.icon} size={20} color="#9aa0a6" style={styles.leftIcon} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.rowSubtitle}>{item.subtitle}</Text> : null}
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9aa0a6" />
        </TouchableOpacity>
      );
    },
    [darkMode, downloadOnCellular, explicitContent, notifications]
  );

  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Render header ONCE here, not inside renderItem */}
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
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'rgb(16, 16, 16)',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    color: '#9aa0a6',
    fontSize: 13,
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  row: {
    backgroundColor: 'rgb(32, 32, 32)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowFirst: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  rowLast: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  separator: {
    height: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  leftIcon: {
    marginRight: 10,
  },
  rowTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  rowSubtitle: {
    color: '#9aa0a6',
    fontSize: 12,
    marginTop: 2,
  },
});
