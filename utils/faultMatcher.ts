import { FaultEntry, MatchResult } from './types';

/**
 * 故障匹配算法
 * 结合关键词匹配 + TF-IDF 权重计算
 * 专为离线场景设计，无任何网络依赖
 */

// 停用词列表（常见无意义词）
const STOP_WORDS = new Set([
  '的', '了', '是', '在', '有', '和', '与', '或', '不', '能', '可',
  '请', '您', '我', '他', '她', '它', '们', '这', '那', '什', '么',
  '怎么', '如何', '为什么', '一个', '一下', '一点', '可能', '应该',
  '出现', '发生', '产生', '发现', '看到', '听到', '闻到', '感觉到',
]);

/**
 * 中文分词（简单正向最大匹配）
 */
function tokenize(text: string): string[] {
  const chars = text.toLowerCase().split('');
  const words: string[] = [];
  let i = 0;

  while (i < chars.length) {
    let matchLen = 1;
    for (let len = Math.min(6, chars.length - i); len >= 2; len--) {
      const word = chars.slice(i, i + len).join('');
      if (isKnownWord(word)) {
        matchLen = len;
        break;
      }
    }
    words.push(chars.slice(i, i + matchLen).join(''));
    i += matchLen;
  }

  return words.filter(w => !STOP_WORDS.has(w) && w.trim().length > 0);
}

// 常用词词典（覆盖地铁场景）
const KNOWN_WORDS = new Set([
  '车门', '制动', '牵引', '网络', '空调', '火灾', '受电弓', '升弓', '降弓',
  'LCU', 'ATP', 'TCMS', 'DRCB', '断路器', '旁路', '司机', '乘客', '列车',
  '轨道', '站台', '车厢', '车头', '车尾', '紧急', '故障', '报警', '显示',
  '无法', '失效', '自动', '手动', '关闭', '打开', '启动', '停止', '复位',
  '旋转', '开关', '保险丝', '电机', '电阻', '制动电阻', '逆变器', '整流器',
  '蓄电池', '辅助', '供电', '充电', '低压', '高压', '接触网', '第三轨',
  '模式', '模式开关', '钥匙', '激活', '休眠', '唤醒', '警惕', '蘑菇按钮',
  '紧急制动', '快速制动', '常用制动', '保持制动', '停放制动', '气制动',
  '电制动', '再生制动', '混合制动', '空气弹簧', '高度阀', '轮缘润滑',
  'ATC', 'ATO', 'ATS', 'CI', 'ZC', 'LDC', 'UDC', 'CMS', 'EMS',
  '不关门', '关不上', '无法关闭', '弹开', '再次打开', '门关好', '门隔离',
  '显红', '显黄', '显白', '黑屏', '花屏', '闪屏', '无显示',
  '无牵引', '无制动', '无加速', '加速慢', '牵引抖动', '制动不缓',
  '不明原因', '随机', '间歇性', '持续', '偶尔',
]);

function isKnownWord(word: string): boolean {
  return KNOWN_WORDS.has(word) || word.length >= 3;
}

/**
 * 计算两个字符串的相似度
 */
function similarity(query: string, target: string): number {
  const queryLower = query.toLowerCase();
  const targetLower = target.toLowerCase();

  if (targetLower.includes(queryLower) || queryLower.includes(targetLower)) {
    return 0.9;
  }

  const queryChars = new Set(queryLower);
  const targetChars = new Set(targetLower);
  const intersection = [...queryChars].filter(c => targetChars.has(c));
  const union = new Set([...queryChars, ...targetChars]);
  return intersection.length / union.size;
}

/**
 * 关键词权重表（业务重要性调整）
 */
const KEYWORD_WEIGHTS: Record<string, number> = {
  '车门': 2.0,
  '制动': 2.0,
  '牵引': 2.0,
  '网络': 1.8,
  '空调': 1.5,
  'LCU': 2.0,
  'ATP': 1.8,
  'TCMS': 1.8,
  '受电弓': 2.0,
  '降弓': 2.0,
  '升弓': 2.0,
  '旁路': 2.0,
  '显红': 2.5,
  '显白': 2.5,
  '显黄': 2.5,
  '黑屏': 2.0,
  '无法关闭': 2.5,
  '无法启动': 2.5,
  '紧急制动': 3.0,
  '快速制动': 3.0,
  '断路器': 2.0,
  'DRCB': 2.5,
  '保险丝': 1.5,
};

/**
 * 对查询进行预处理
 */
function preprocessQuery(query: string): string[] {
  return tokenize(query);
}

/**
 * 核心匹配函数
 */
export function findBestMatches(
  query: string,
  knowledgeBase: FaultEntry[],
  topN: number = 3
): MatchResult[] {
  const queryTokens = preprocessQuery(query);
  const results: MatchResult[] = [];

  for (const item of knowledgeBase) {
    const matchedKeywords: string[] = [];
    let score = 0;
    let weightSum = 0;

    // 1. 标题匹配（权重最高）
    const titleSim = similarity(query, item.title);
    if (titleSim > 0.3) {
      score += titleSim * 3.0;
      weightSum += 3.0;
    }

    // 2. 现象描述匹配
    const phenomenonSim = similarity(query, item.phenomenon);
    if (phenomenonSim > 0.2) {
      score += phenomenonSim * 2.5;
      weightSum += 2.5;
    }

    // 3. 关键词命中
    const itemKeywords = item.keywords || [];
    for (const token of queryTokens) {
      for (const kw of itemKeywords) {
        if (kw.includes(token) || token.includes(kw)) {
          const weight = KEYWORD_WEIGHTS[kw] || 1.0;
          score += weight;
          weightSum += weight;
          if (!matchedKeywords.includes(kw)) {
            matchedKeywords.push(kw);
          }
        }
      }
      if (KNOWN_WORDS.has(token)) {
        const weight = KEYWORD_WEIGHTS[token] || 0.5;
        if (item.phenomenon.includes(token) || item.procedure.includes(token)) {
          score += weight * 0.5;
          weightSum += weight * 0.5;
        }
      }
    }

    // 4. TCMS代码精确匹配
    if (item.relatedCodes) {
      for (const code of item.relatedCodes) {
        if (query.toUpperCase().includes(code.toUpperCase()) ||
            query.includes(code)) {
          score += 5.0;
          weightSum += 5.0;
          matchedKeywords.push(`代码:${code}`);
        }
      }
    }

    // 5. 分类匹配
    const categoryKeywords: Record<string, string[]> = {
      '车门故障': ['车门', '门关', '门开', '屏蔽门'],
      '制动故障': ['制动', '刹车', '制动缸', '气制动'],
      '牵引故障': ['牵引', '加速', '电机', '逆变器'],
      '网络故障': ['网络', 'TCMS', '通信', '网关'],
      '空调故障': ['空调', '制冷', '制热', '通风'],
      '火灾报警': ['火灾', '烟感', '火警', '灭火'],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (item.category === category) {
        for (const kw of keywords) {
          if (query.includes(kw)) {
            score += 0.5;
            weightSum += 0.5;
          }
        }
      }
    }

    const finalScore = weightSum > 0 ? score / weightSum : 0;

    if (finalScore > 0.1) {
      results.push({
        item,
        score: Math.min(1, finalScore),
        matchedKeywords,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, topN);
}

/**
 * 快速搜索（用于知识库浏览页面）
 */
export function quickSearch(
  query: string,
  knowledgeBase: FaultEntry[]
): FaultEntry[] {
  if (!query.trim()) return knowledgeBase;
  return findBestMatches(query, knowledgeBase, 10).map(r => r.item);
}