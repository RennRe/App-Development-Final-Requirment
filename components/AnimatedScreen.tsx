/**
 * AnimatedScreen
 * A wrapper that plays a smooth fade-in animation every time
 * the user SWITCHES to this tab (not just on first load).
 *
 * It uses useFocusEffect — which fires every time a screen
 * becomes active — so it works as a page transition.
 *
 * Usage: Wrap any screen's root View with <AnimatedScreen>
 */

import React, { useRef, useCallback } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function AnimatedScreen({ children, style }: Props) {
  // Fade from invisible → visible
  const opacity = useRef(new Animated.Value(0)).current;

  // useFocusEffect fires every time this screen becomes the active tab
  useFocusEffect(
    useCallback(() => {
      // Start invisible
      opacity.setValue(0);

      // Animate to fully visible over 220ms
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true, // better performance
      }).start();
    }, [opacity])
  );

  return (
    <Animated.View style={[styles.wrapper, style, { opacity }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1, // fill all available space, just like a normal View
  },
});
