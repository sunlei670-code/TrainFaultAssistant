import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { knowledgeBase } from '../data/knowledge_base';
import { FaultEntry } from '../utils/types';

const CATEGORIES = [
  '全部',
  '车门故障',
  '制动故障',
  '牵引故障',
  '网络故障',
  '受电弓故障',
  '辅助供电',
  '空调系统',
  '火灾报警',
  'LCU故障',
  '钥匙故障',
  '通用步骤',
];

export default function KnowledgeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchText, setSearchText] = useState('');

  const filteredData = knowledgeBase.filter(item => {
    const matchCategory = selectedCategory === '全部' || item.category === selectedCategory;
    const matchSearch = !searchText ||
      item.title.includes(searchText) ||
      item.phenomenon.includes(searchText) ||
      (item.keywords && item.keywords.some((k: string) => k.includes(searchText)));
    return matchCategory && matchSearch;
  });

  function renderFaultCard(item: FaultEntry) {
    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.categoryBadge}>{item.category}</Text>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.sectionLabel}>📌 现象</Text>
          <Text style={styles.sectionText} numberOfLines={2}>{item.phenomenon}</Text>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.sectionLabel}>🔧 处置</Text>
          <Text style={styles.sectionText} numberOfLines={3}>{item.procedure}</Text>
        </View>

        {(item.relatedCodes && item.relatedCodes.length > 0) && (
          <View style={styles.tagRow}>
            <Text style={styles.tagLabel}>代码：</Text>
            {item.relatedCodes.map((code: string, i: number) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{code}</Text>
              </View>
            ))}
          </View>
        )}

        {(item.bypassSwitch || item.speedLimit) && (
          <View style={styles.metaRow}>
            {item.bypassSwitch && (
              <Text style={styles.metaText}>🔌 {item.bypassSwitch}</Text>
            )}
            {item.speedLimit && (
              <Text style={styles.metaText}>🚄 {item.speedLimit}</Text>
            )}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="搜索故障关键词..."
          placeholderTextColor="#999"
        />
      </View>

      {/* 分类标签 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryTab,
              selectedCategory === cat && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === cat && styles.categoryTabTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 知识库列表 */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filteredData.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>未找到匹配的故障记录</Text>
          </View>
        ) : (
          filteredData.map(renderFaultCard)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
  },
  categoryScroll: {
    maxHeight: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 6,
    flexDirection: 'row',
  },
  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 3,
  },
  categoryTabActive: {
    backgroundColor: '#1E3A5F',
  },
  categoryTabText: {
    fontSize: 13,
    color: '#666',
  },
  categoryTabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    gap: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 10,
  },
  categoryBadge: {
    fontSize: 11,
    color: '#1E3A5F',
    fontWeight: '600',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    lineHeight: 22,
  },
  cardSection: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  sectionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 4,
  },
  tagLabel: {
    fontSize: 12,
    color: '#666',
  },
  tag: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#1E3A5F',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
  },
});