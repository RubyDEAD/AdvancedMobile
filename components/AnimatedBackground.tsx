// components/AnimatedBackground.tsx
import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

const lightColor = '#ffffff'
const darkColor = '#101010'

export default function AnimatedBackground({ children }: { children: React.ReactNode }) {
  const mode = useSelector((state: RootState) => state.theme.mode)
  const progress = useSharedValue(mode === 'dark' ? 1 : 0)

  // Animate whenever mode changes
  React.useEffect(() => {
    progress.value = withTiming(mode === 'dark' ? 1 : 0, { duration: 400 })
  }, [mode])

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = progress.value === 1 ? darkColor : lightColor
    return { backgroundColor }
  })

  return <Animated.View style={[styles.container, animatedStyle]}>{children}</Animated.View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
