import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarAccessibilityLabel: 'Home tab' }}
      />
      <Tabs.Screen
        name="assistant"
        options={{ title: 'Assistant', tabBarAccessibilityLabel: 'Assistant tab' }}
      />
      <Tabs.Screen
        name="memory"
        options={{ title: 'Memory', tabBarAccessibilityLabel: 'Memory tab' }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarAccessibilityLabel: 'Settings tab' }}
      />
    </Tabs>
  );
}
