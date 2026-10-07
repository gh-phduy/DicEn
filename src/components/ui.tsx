import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// Light surfaces and dark text; no essential text uses faint gray or pastel colors.
export const colors = {
  ink: '#102A32', secondary: '#43565D', green: '#17613E',
  white: '#FFFFFF', surface: '#F3F6F2', selected: '#E5F0E7',
  border: '#C9D4CB', controlBorder: '#76897B', gold: '#F4CA58', error: '#8E301F', errorBg: '#FFF0E9',
};
export type IconName = React.ComponentProps<typeof Ionicons>['name'];
export function Icon({ name, size = 24, color = colors.ink }: { name: IconName; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />;
}
export function IconButton({ icon, label, onPress, active = false, disabled = false }: {
  icon: IconName; label: string; onPress: () => void; active?: boolean; disabled?: boolean;
}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled, selected: active }}
    disabled={disabled} onPress={onPress} hitSlop={3}
    style={({ pressed }) => [styles.iconButton, active && styles.selected, (pressed || disabled) && { opacity: 0.55 }]}>
    <Icon name={icon} color={active ? colors.green : colors.ink} />
  </Pressable>;
}
export function Level({ label }: { label: string }) {
  return <View style={styles.level}><Text style={styles.levelText}>{label}</Text></View>;
}
export const styles = StyleSheet.create({
  iconButton: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  selected: { backgroundColor: colors.selected },
  level: { backgroundColor: colors.selected, borderRadius: 6, paddingHorizontal: 9, paddingVertical: 5 },
  levelText: { color: colors.green, fontSize: 13, fontWeight: '700' },
});
