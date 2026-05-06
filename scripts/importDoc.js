#!/usr/bin/env node
/**
 * Word 文档导入脚本
 * 用法: node scripts/importDoc.js <path-to-docx>
 *
 * 示例: node scripts/importDoc.js ../docs/2号线电客车故障应急处理指南.docx
 *
 * 依赖: pip install python-docx (或 npm install docx)
 */

const fs = require('fs');
const path = require('path');

// 尝试使用 python-docx 进行解析
function parseWordDocument(filePath) {
  const { execSync } = require('child_process');

  const pythonScript = `
import sys
from docx import Document

doc = Document('${filePath}')

faults = []
current_fault = None

for para in doc.paragraphs:
    text = para.text.strip()
    if not text:
        continue

    # 检测故障标题（通常是"X.X 故障名称"格式）
    import re
    title_match = re.match(r'^(\\d+\\.\\d+)\\s+(.+?)(?:\\s|$)', text)
    if title_match:
        if current_fault:
            faults.append(current_fault)
        current_fault = {
            'id': 'fault-' + title_match.group(1).replace('.', ''),
            'title': title_match.group(2),
            'phenomenon': '',
            'procedure': '',
            'safety': '',
            'keywords': []
        }
    elif current_fault:
        # 分析内容类型
        if '现象' in text or '征' in text[:3]:
            current_fault['phenomenon'] = text
        elif '处理' in text or '步骤' in text or '建议' in text:
            current_fault['procedure'] = text
        elif '注意' in text or '警告' in text or '安全' in text:
            current_fault['safety'] = text

# 添加最后一个
if current_fault:
    faults.append(current_fault)

import json
print(json.dumps(faults, ensure_ascii=False, indent=2))
`;

  try {
    const result = execSync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024
    });
    return JSON.parse(result);
  } catch (e) {
    console.error('Python 解析失败:', e.message);
    return null;
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('用法: node scripts/importDoc.js <path-to-docx>');
    console.log('示例: node scripts/importDoc.js ../docs/故障指南.docx');
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);

  if (!fs.existsSync(filePath)) {
    console.error(`文件不存在: ${filePath}`);
    process.exit(1);
  }

  console.log(`正在解析: ${filePath}`);

  const faults = parseWordDocument(filePath);

  if (!faults || faults.length === 0) {
    console.error('未能解析到故障数据，请检查文档格式');
    process.exit(1);
  }

  console.log(`解析到 ${faults.length} 条故障记录`);

  // 生成 TypeScript 文件
  const tsContent = `import { FaultEntry } from '../utils/types';

/**
 * 故障知识库 - 从 Word 文档自动导入
 * 生成时间: ${new Date().toISOString()}
 * 来源: ${path.basename(filePath)}
 */

export const importedFaults: FaultEntry[] = ${JSON.stringify(faults, null, 2)};
`;

  const outputPath = path.join(__dirname, '..', 'data', 'knowledge_base_generated.ts');
  fs.writeFileSync(outputPath, tsContent, 'utf-8');

  console.log(`已生成: ${outputPath}`);
  console.log(`请将导入的数据合并到 knowledge_base.ts 中`);
}

main();