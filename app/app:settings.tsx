import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSpeech, setAutoSpeech] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  function showAbout() {
    Alert.alert(
      '关于',
      '地铁故障处置助手 v1.0.0\n\n' +
      '基于苏州轨道交通2号线电客车故障应急处理指南设计\n' +
      '支持离线语音识别与智能故障匹配\n\n' +
      '© 2026 苏州轨道交通 | 仅供内部使用',
      [{ text: '知道了' }]
    );
  }

  function showImport() {
    Alert.alert(
      '导入知识库',
      '请将 Word 文档放入项目 /docs 目录后，执行：\n\nnpm run import:doc\n\n或联系管理员导入。',
      [{ text: '知道了' }]
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 语音设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>语音设置</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="mic" size={22} color="#1E3A5F" />
            <Text style={styles.rowText}>启用语音输入</Text>
          </View>
          <Switch
            value={voiceEnabled}
            onValueChange={setVoiceEnabled}
            trackColor={{ false: '#e0e0e0', true: '#1E3A5F' }}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="volume-high" size={22} color="#1E3A5F" />
            <Text style={styles.rowText}>自动朗读处置步骤</Text>
          </View>
          <Switch
            value={autoSpeech}
            onValueChange={setAutoSpeech}
            trackColor={{ false: '#e0e0e0', true: '#1E3A5F' }}
          />
        </View>
      </View>

      {/* 外观 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>外观</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon" size={22} color="#1E3A5F" />
            <Text style={styles.rowText}>深色模式</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#e0e0e0', true: '#1E3A5F' }}
          />
        </View>
      </View>

      {/* 数据管理 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>数据管理</Text>

        <TouchableOpacity style={styles.button} onPress={showImport}>
          <View style={styles.rowLeft}>
            <Ionicons name="document-attach" size={22} color="#1E3A5F" />
            <Text style={styles.rowText}>导入/更新知识库</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <View style={styles.rowLeft}>
            <Ionicons name="cloud-download" size={22} color="#1E3A5F" />
            <Text style={styles.rowText}>离线数据已就绪</Text>
          </View>
          <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* 其他 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>其他</Text>

        <TouchableOpacity style={styles.button} onPress={showAbout}>
          <View style={styles.rowLeft}>
            <Ionicons name="information-circle" size={22} color="#1E3A5F" />
            <Text style={styles.rowText}>关于</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.button}>
          <View style={styles.rowLeft}>
            <Ionicons name="code-slash" size={22} color="#1E3A5F" />
            <Text style={styles.rowText}>版本</Text>
          </View>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🚇 地铁故障处置助手{'\n'}
          基于 Q/SZGY 01 G 05.03.033-2025{'\n'}
          仅供内部培训与应急参考
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  versionText: {
    fontSize: 15,
    color: '#999',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#bbb',
    textAlign: 'center',
    lineHeight: 20,
  },
});