import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

// 知识库匹配算法
import { findBestMatches } from '../utils/faultMatcher';

// 知识库数据
import { knowledgeBase } from '../data/knowledge_base';

// 知识库类型
import { FaultEntry } from '../utils/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  fault?: FaultEntry;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: '您好！我是地铁故障处置助手。\n\n请描述您遇到的故障现象，例如：\n• "车门无法关闭"\n• "列车显示牵引故障"\n• "空调不制冷"\n\n支持语音输入，点击下方🎤按钮。',
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // 自动滚动到底部
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // 处理发送
  function handleSend() {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      text: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // 匹配知识库
    const matches = findBestMatches(input.trim(), knowledgeBase);

    setTimeout(() => {
      if (matches.length > 0) {
        const best = matches[0];
        const replyText = formatFaultResponse(best);

        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          text: replyText,
          fault: best,
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          text: '抱歉，我在知识库中未找到匹配的故障处置方案。\n\n建议：\n1. 尝试使用更通用的关键词，如"车门"、"牵引"、"制动"\n2. 描述具体的故障现象\n3. 或联系车辆维修人员',
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    }, 300);
  }

  // 格式化故障响应
  function formatFaultResponse(fault: FaultEntry): string {
    let response = `【${fault.category}】${fault.title}\n\n`;
    response += `📌 故障现象：\n${fault.phenomenon}\n\n`;
    response += `🔧 处置步骤：\n${fault.procedure}\n\n`;
    response += `⚠️ 安全提示：\n${fault.safety || '无特殊安全提示，请按正常作业流程操作。'}\n\n`;

    if (fault.relatedCodes && fault.relatedCodes.length > 0) {
      response += `🔢 相关代码：${fault.relatedCodes.join('、')}\n`;
    }
    if (fault.bypassSwitch) {
      response += `🔌 旁路开关：${fault.bypassSwitch}\n`;
    }
    if (fault.speedLimit) {
      response += `🚄 限速要求：${fault.speedLimit}\n`;
    }

    return response;
  }

  // 语音朗读
  function toggleSpeech(text: string) {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(text, {
        language: 'zh-CN',
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  }

  // 语音输入（使用 iOS 原生语音）
  async function startVoiceInput() {
    Alert.alert(
      '语音输入',
      '请说出故障描述...',
      [
        { text: '取消', style: 'cancel' },
      ]
    );
    // 注：React Native 离线语音推荐使用 react-native-voice
    // Expo 环境可使用 expo-speech 进行 TTS，ASR 需原生模块
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* 消息列表 */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.messageRow,
              msg.role === 'user' ? styles.userRow : styles.assistantRow,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.role === 'user' ? styles.userText : styles.assistantText,
                ]}
              >
                {msg.text}
              </Text>

              {/* 朗读按钮（仅助手消息） */}
              {msg.role === 'assistant' && msg.text.length > 20 && (
                <TouchableOpacity
                  style={styles.speakButton}
                  onPress={() => toggleSpeech(msg.text)}
                >
                  <Ionicons
                    name={isSpeaking ? 'volume-high' : 'volume-medium-outline'}
                    size={18}
                    color="#1E3A5F"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 输入区域 */}
      <View style={styles.inputArea}>
        <TouchableOpacity style={styles.voiceButton} onPress={startVoiceInput}>
          <Ionicons name="mic" size={24} color="#fff" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="输入故障描述..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
        />

        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 16,
    position: 'relative',
  },
  userBubble: {
    backgroundColor: '#1E3A5F',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#333',
  },
  speakButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    padding: 4,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});