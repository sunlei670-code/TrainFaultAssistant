import { FaultEntry } from '../utils/types';

/**
 * 故障知识库
 * 基于 Q/SZGY 01 G 05.03.033-2025 苏州轨道交通2号线电客车故障应急处理指南
 * 数据来源：2号线电客车故障应急处理指南.doc
 *
 * 离线存储，无网络依赖
 */

// 辅助供电系统故障
const assistPowerFaults: FaultEntry[] = [
  {
    id: 'apf-001',
    title: '辅助电源故障（ACM故障）',
    category: '辅助供电故障',
    phenomenon: 'TCMS显示ACM故障，所有辅助负载失效，客室、司机台照明无电，空调停止工作',
    procedure: '1. 按压"扩展供电"按钮，观察故障是否恢复\n2. 等待5秒后，再次按压"扩展供电"按钮\n3. 若故障仍未消除，则切除该车，报告行调',
    safety: '确认列车停稳后，方可进行操作',
    relatedCodes: ['ACM', 'BCG'],
    keywords: ['辅助电源', 'ACM', '扩展供电', '无电', '照明', '空调'],
    version: '2025版',
  },
  {
    id: 'apf-002',
    title: '蓄电池充电机故障',
    category: '辅助供电故障',
    phenomenon: 'TCMS显示充电机故障，蓄电池电压过低，列车休眠失败或休眠后无法唤醒',
    procedure: '1. 检查列车状态，若无法休眠则保持清醒状态\n2. 若电压过低，可请求救援',
    safety: '注意查看蓄电池电压表',
    keywords: ['蓄电池', '充电机', '电压', '休眠', '唤醒'],
    version: '2025版',
  },
];

// 受电弓故障
const pantographFaults: FaultEntry[] = [
  {
    id: 'pg-001',
    title: '受电弓无法升起',
    category: '受电弓故障',
    phenomenon: '受电弓图标显示灰显或红色，DDU显示"受电弓故障"，按下升弓按钮无响应',
    procedure: '1. 检查主控端升弓按钮是否按下\n2. 检查升弓钢丝绳是否断裂或脱开\n3. 确认受电弓气路阀门在打开位置\n4. 若仍无法升起，换弓后报告行调',
    safety: '换弓前必须确认临线无电客车占用',
    relatedCodes: ['EGS', 'PVLB'],
    bypassSwitch: 'EGS（受电弓旁路）',
    speedLimit: '换弓后限速60km/h',
    keywords: ['受电弓', '升弓', '降弓', 'EGS', 'PVLB'],
    version: '2025版',
  },
];

// 车门故障
const doorFaults: FaultEntry[] = [
  {
    id: 'door-001',
    title: '单侧车门无法关闭',
    category: '车门故障',
    phenomenon: 'DDU显示车门图标红色，某扇车门关好指示灯不亮，列车无法发车',
    procedure: '1. 操作关门按钮，确认故障车门是否关闭\n2. 若仍无法关闭，将该车门故障隔开关置于"隔离"位\n3. 确认门关好灯亮，报告行调',
    safety: '隔离车门时需确认无乘客拥挤',
    relatedCodes: ['DCCB', 'EDCU'],
    keywords: ['车门', '关不上', '无法关闭', 'DCCB', 'EDCU', '隔离'],
    version: '2025版',
  },
  {
    id: 'door-002',
    title: '车门显示黑屏/门关好灯不亮',
    category: '车门故障',
    phenomenon: 'DDU上车门图标消失或显示异常，站台侧门关好灯不亮，但车门实际已关闭',
    procedure: '1. 确认站台两侧车门机械状态正常，无异物卡滞\n2. 按压"门关好"按钮尝试手动确认\n3. 若仍无法消除，换端驾驶',
    safety: '确认站台安全后，方可关闭屏蔽门',
    keywords: ['车门', '黑屏', '门关好灯', '消失', '异常'],
    version: '2025版',
  },
  {
    id: 'door-003',
    title: '空压机不能启动，列车显示"主风管压力低"',
    category: '车门故障',
    phenomenon: 'TCMS显示空压机故障，列车主风管压力低于600kPa，牵引封锁',
    procedure: '1. 检查空压机断路器是否跳闸\n2. 检查空压机控制开关是否在"开"位\n3. 若空压机无法启动，等待辅助空压机打风',
    safety: '主风管压力低于550kPa时禁止动车',
    relatedCodes: ['ACBP', 'ACPTRCB'],
    keywords: ['空压机', '主风管', '压力低', 'ACBP'],
    version: '2025版',
  },
];

// 牵引故障
const tractionFaults: FaultEntry[] = [
  {
    id: 'traction-001',
    title: '牵引系统故障（VVVF故障）',
    category: '牵引故障',
    phenomenon: 'DDU显示牵引系统红色报警，列车失去牵引力，提示"牵引失效"',
    procedure: '1. 确认列车已停稳，将主控制器归零位\n2. 按压"复位"按钮，等待5秒后重新施加牵引\n3. 若故障仍未消除，切除故障单元，报告行调',
    safety: '牵引失效后严禁强行推牵引',
    relatedCodes: ['VVVF', 'M1', 'M2'],
    bypassSwitch: 'PBBS（被迫后溜旁路），限速25km/h',
    speedLimit: '单个单元牵引时限速45km/h',
    keywords: ['牵引', 'VVVF', 'M1', 'M2', '牵引失效', '复位'],
    version: '2025版',
  },
  {
    id: 'traction-002',
    title: '制动系统故障（BCU故障）',
    category: '制动故障',
    phenomenon: 'DDU显示制动系统红色报警，列车施加常用制动时无法缓解，或制动不缓',
    procedure: '1. 将主控制器归零位，确认列车停稳\n2. 按压"制动复位"按钮\n3. 若故障仍未消除，切除故障单元，使用紧急制动',
    safety: '制动故障后注意停车距离',
    relatedCodes: ['BCU', 'BCBP', 'DBPS'],
    bypassSwitch: 'DBPS（制动电源旁路）',
    speedLimit: '制动故障时限速60km/h',
    keywords: ['制动', 'BCU', 'BCBP', 'DBPS', '制动失效', '常用制动'],
    version: '2025版',
  },
  {
    id: 'traction-003',
    title: '列车显示"停放制动未缓解"',
    category: '制动故障',
    phenomenon: 'DDU显示停放制动图标红色，虽操作缓解按钮但停放制动仍施加，列车无法移动',
    procedure: '1. 检查停放制动控制断路器是否跳闸\n2. 操作强制缓解手柄，尝试手动缓解停放制动\n3. 若仍无法缓解，报告行调',
    safety: '强制缓解前确认列车防滑',
    relatedCodes: ['EMTS', 'PCBP'],
    bypassSwitch: 'EMTS（停放制动强行缓解），限速45km/h',
    speedLimit: 'EMTS激活后限速45km/h',
    keywords: ['停放制动', 'EMTS', 'PCBP', '未缓解', '强制缓解'],
    version: '2025版',
  },
];

// 网络故障
const networkFaults: FaultEntry[] = [
  {
    id: 'network-001',
    title: 'TCMS网络通讯故障（网关故障）',
    category: '网络故障',
    phenomenon: 'DDU显示TCMS网络红色报警，整列车或部分车厢TCMS离线，DDU显示数据停滞或异常',
    procedure: '1. 尝试断电复位：切除列车电源，等待30秒后重新激活\n2. 若故障仍未消除，尝试备用驾驶模式\n3. 报告行调，切换至备用模式运行',
    safety: '网络故障后注意确认列车状态',
    relatedCodes: ['网关', 'GTW', 'ERM', 'TCMS'],
    bypassSwitch: '采用备用驾驶模式',
    keywords: ['TCMS', '网关', '网络', '通讯', 'GTW', 'ERM', '离线'],
    version: '2025版',
  },
];

// 钥匙故障
const keyFaults: FaultEntry[] = [
  {
    id: 'key-001',
    title: '列车钥匙无法激活列车',
    category: '钥匙故障',
    phenomenon: '将司机钥匙插入主控钥匙孔并旋转，但列车未激活，DDU未显示激活状态',
    procedure: '1. 确认钥匙是否完全插入，尝试重新旋转\n2. 检查钥匙孔是否有异物堵塞\n3. 若仍无法激活，换端操作或使用备用钥匙\n4. 报告行调',
    safety: '确认列车处于休眠状态时方可换端',
    relatedCodes: ['KI', 'KIC', 'KIS'],
    keywords: ['钥匙', '激活', 'KI', 'KIC', '无法激活', '主控'],
    version: '2025版',
  },
];

// 空调故障
const acFaults: FaultEntry[] = [
  {
    id: 'ac-001',
    title: '客室空调不制冷（冷凝机故障）',
    category: '空调系统故障',
    phenomenon: 'TCMS显示空调故障，客室温度高于28℃或DDU报"冷凝机故障"，制冷效果差或无冷风',
    procedure: '1. 检查空调控制断路器是否跳闸\n2. 操作空调控制面板，尝试复位\n3. 若故障仍未消除，报告行调，保持通风',
    safety: '客室温度超过35℃时注意乘客身体状况',
    relatedCodes: ['AC', 'ACH', 'ACM'],
    keywords: ['空调', '不制冷', '冷凝机', 'ACM', 'ACH', '客室温度'],
    version: '2025版',
  },
  {
    id: 'ac-002',
    title: '空调显示"显白"故障',
    category: '空调系统故障',
    phenomenon: 'TCMS或DDU上车号显示器显示"白屏"或"无显示"，部分TCMS数据无法显示',
    procedure: '1. 按压"TCMS复位"按钮\n2. 若故障仍未消除，切除该车厢TCMS控制\n3. 继续运行至终点站，报告行调',
    safety: 'TCMS故障后注意监控客室设备状态',
    relatedCodes: ['TCMS', 'IDU', '显示器'],
    keywords: ['显白', '白屏', 'TCMS', 'IDU', '显示器', '无显示'],
    version: '2025版',
  },
];

// 火灾报警
const fireFaults: FaultEntry[] = [
  {
    id: 'fire-001',
    title: '火灾报警系统报警',
    category: '火灾报警',
    phenomenon: 'TCMS或DDU显示火灾报警图标红色，车号显示器或走廊左侧感烟探测器报警',
    procedure: '1. 立即拉停列车（按压紧急停车按钮）\n2. 确认报警位置，查看是否有真实火情\n3. 若为误报，按压"火灾报警复位"按钮\n4. 若为真实火情，立即执行列车火灾处置预案',
    safety: '火灾报警必须立即响应，严禁动车',
    relatedCodes: ['FAS', 'Smoke', '火警'],
    keywords: ['火灾', 'FAS', 'Smoke', '感烟', '报警', '火情'],
    version: '2025版',
  },
];

// LCU故障
const lcuFaults: FaultEntry[] = [
  {
    id: 'lcu-001',
    title: 'LCU（逻辑控制单元）故障',
    category: 'LCU故障',
    phenomenon: 'DDU显示LCU故障，列车部分功能失效，如开关门逻辑异常、牵引制动指令异常',
    procedure: '1. 将该LCU断路器（LCUBPS）切除\n2. 尝试重新激活列车\n3. 若故障仍未消除，切除故障单元，报告行调',
    safety: 'LCU故障可能导致车门逻辑异常，注意确认车门状态',
    relatedCodes: ['LCU', 'LCUBPS', 'DRCB_L'],
    keywords: ['LCU', 'LCUBPS', '逻辑控制', 'DRCB_L', '指令异常'],
    version: '2025版',
  },
];

// 通用步骤
const commonFaults: FaultEntry[] = [
  {
    id: 'common-001',
    title: '列车无法激活（分合步骤）',
    category: '通用步骤',
    phenomenon: '列车休眠后无法唤醒，或激活列车时无任何响应',
    procedure: '1. 确认主控钥匙在"0"位\n2. 等待10秒后，重新插入钥匙并旋转至"激活"位\n3. 若仍无响应，进行车辆电气分组断合：\n   - 断开车队电源（BP）\n   - 等待30秒后重新闭合\n4. 若故障仍未消除，报告行调',
    safety: '断合电池开关前必须确认列车已停稳',
    relatedCodes: ['KI', 'KIC', 'BP'],
    keywords: ['无法激活', '休眠', '唤醒', '断合', '电池', 'KI'],
    version: '2025版',
  },
  {
    id: 'common-002',
    title: 'DDU黑屏/花屏',
    category: '通用步骤',
    phenomenon: 'DDU（司机显示单元）黑屏或显示异常，无法查看列车状态信息',
    procedure: '1. 按压DDU复位按钮\n2. 若无法复位，断开DDU断路器，等待10秒后重新闭合\n3. 若故障仍未消除，可继续运行至终点站，使用便携式行车监控仪替代',
    safety: 'DDU黑屏后注意监控列车状态，可通过TCMS手持终端查看',
    relatedCodes: ['DDU', 'IDU', 'TCMS'],
    keywords: ['DDU', 'IDU', '黑屏', '花屏', '复位', 'TCMS'],
    version: '2025版',
  },
];

// 汇总导出
export const knowledgeBase: FaultEntry[] = [
  ...commonFaults,
  ...doorFaults,
  ...tractionFaults,
  ...networkFaults,
  ...keyFaults,
  ...acFaults,
  ...fireFaults,
  ...lcuFaults,
  ...pantographFaults,
  ...assistPowerFaults,
];

// 按分类索引
export const categoryIndex: Record<string, FaultEntry[]> = {
  '通用步骤': commonFaults,
  '车门故障': doorFaults,
  '牵引故障': tractionFaults,
  '网络故障': networkFaults,
  '钥匙故障': keyFaults,
  '空调系统故障': acFaults,
  '火灾报警': fireFaults,
  'LCU故障': lcuFaults,
  '受电弓故障': pantographFaults,
  '辅助供电故障': assistPowerFaults,
};