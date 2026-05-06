// 故障知识库条目类型
export interface FaultEntry {
  id: string;
  title: string;
  category: string;         // 如"车门故障"、"制动故障"等
  phenomenon: string;       // 故障现象描述
  procedure: string;        // 处置步骤
  safety?: string;          // 安全提示
  relatedCodes?: string[];  // 相关TCMS代码
  bypassSwitch?: string;    // 旁路开关组合
  speedLimit?: string;      // 限速要求
  keywords?: string[];      // 检索关键词
  version?: string;         // 文档版本
}

// 搜索匹配结果
export interface MatchResult {
  item: FaultEntry;
  score: number;             // 匹配分数 0-1
  matchedKeywords: string[];  // 命中的关键词
}

// 消息类型
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  fault?: FaultEntry;
  timestamp: number;
}