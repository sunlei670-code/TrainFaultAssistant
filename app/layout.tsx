import { StatusBar } from 'expo-status-bar';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

function TabBarIcon(props: {
  name: string;
  color: string;
}) {
  const icons: Record<string, string> = {
    'chat': '💬',
    'knowledge': '📚',
    'settings': '⚙️',
  };
  return (
    <Text style={{ fontSize: 22 }}>
      {icons[props.name] || '•'}
    </Text>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={isDark ? styles.dark : styles.light}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#1E3A5F',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            borderTopColor: isDark ? '#333' : '#e0e0e0',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          headerStyle: {
            backgroundColor: '#1E3A5F',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '故障处置',
            headerTitle: '🚇 地铁故障处置助手',
            tabBarIcon: ({ color }) => <TabBarIcon name="chat" color={color} />,
          }}
        />
        <Tabs.Screen
          name="knowledge"
          options={{
            title: '知识库',
            headerTitle: '📚 故障知识库',
            tabBarIcon: ({ color }) => <TabBarIcon name="knowledge" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: '设置',
            headerTitle: '⚙️ 设置',
            tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  light: { flex: 1, backgroundColor: '#f5f5f5' },
  dark: { flex: 1, backgroundColor: '#1a1a1a' },
});