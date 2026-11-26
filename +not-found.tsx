import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>
          Page not found
        </Text>
        <Text style={styles.description}>
          This JARVIS Mobile destination does not exist.
        </Text>
        <Link href="/" asChild>
          <Pressable accessibilityRole="link" style={styles.link}>
            <Text style={styles.linkText}>Return to Home</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  link: {
    alignSelf: 'flex-start',
    marginTop: 24,
    paddingVertical: 8,
  },
  linkText: {
    color: '#1769AA',
    fontSize: 16,
    fontWeight: '600',
  },
});
