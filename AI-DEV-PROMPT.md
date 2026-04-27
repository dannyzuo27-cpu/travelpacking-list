# 旅行清单工具 - AI 开发提示词

> 将此文档作为完整的需求说明，直接喂给 Claude/GPT/Cursor 等 AI 助手

---

## 项目概述

请帮我开发一个**旅行清单打包工具**（桌面网页版），核心功能是智能生成旅行物品清单、多人协作打包、重量管理。

---

## 技术栈要求

- **前端**: React + TypeScript + Tailwind CSS
- **后端**: 微信小程序云开发（云数据库 MongoDB + 云函数）
- **API**: 和风天气 API（天气预报）
- **部署**: 
  - Web 版：GitHub Pages（静态前端）
  - 小程序版：微信小程序（后续迁移）

---

## 核心功能需求

### 1. 首页（清单列表）

**布局**：
- 顶部导航栏：Logo + "我的清单" 按钮 + "创建新清单" 按钮
- 清单卡片网格（3列，响应式）
- 每张卡片显示：
  - 清单标题（如"西藏6日游"）
  - 日期和旅行类型（如"2026年5月1日 - 5月6日 · 自驾游"）
  - 打包进度条（23/50件，带百分比填充）
  - 行李重量条（8.5/23kg，带颜色预警：绿色<80%，黄色80-100%，红色>100%）

**交互**：
- 点击卡片进入详情页
- 点击"创建新清单"进入创建流程

**数据来源**：
- 从数据库 `trips` 表查询当前用户的清单
- 显示 `user_id` 或 `collaborators` 包含当前用户的清单

---

### 2. 创建清单流程（5步问答）

**第1步：目的地**
- 输入框：文本输入
- 占位符："输入你的旅行目的地"
- 验证：非空

**第2步：出行天数**
- 选项按钮（3列网格）：
  - 1-3天
  - 4-7天
  - 8-15天
  - 15天以上
- 单选

**第3步：出发月份**
- 选项按钮（3列网格）：
  - 1月 到 12月
- 单选

**第4步：旅行类型**
- 选项按钮（3列网格）：
  - 度假休闲
  - 自驾游
  - 徒步
  - 滑雪
  - 露营
  - 商务出差
- 单选

**第5步：行李限制**
- 选项按钮（3列网格）：
  - 廉航 (7kg)
  - 经济舱 (23kg)
  - 头等舱 (32kg)
  - 无限制（自驾/火车）
- 单选

**完成后**：
1. 调用云函数 `generatePackingList`
2. 根据目的地、月份、旅行类型、行李限制匹配物品模板
3. 创建 `trips` 和 `items` 记录
4. 跳转到清单详情页

---

### 3. 清单详情页（核心页面）

**布局**：
- **左侧分类导航**（固定侧边栏，280px宽）：
  - 📄 证件类 (2/3)
  - 👕 衣物类 (1/12)
  - 📱 电子产品 (0/8)
  - 💊 药品类 (0/5)
  - 🧴 洗漱用品 (3/8)
  - ⛺ 户外装备 (0/10)
  - 📦 其他 (0/5)
  
  每个分类显示：
  - Emoji 图标
  - 分类名称
  - 进度徽章（已准备/总数）
  
  当前选中分类高亮显示（渐变背景）

- **右侧内容区**：
  - 顶部：
    - 分类标题（如"证件类"）
    - 统计卡片：已准备数量、总重量
  - 物品表格：
    - 列：复选框 | 物品名称 | 重量 | 状态
    - 行：每个物品一行
    - 复选框：点击切换打包状态
    - 状态标签：
      - 已打包（绿色背景）
      - 待打包（黄色背景）

- **底部固定统计栏**：
  - 打包进度：`23 / 50 件` + 进度条
  - 行李重量：`8.5 / 23 kg` + 进度条（带颜色预警）

**交互**：
- 点击左侧分类切换右侧内容
- 点击复选框更新物品状态
- 实时更新统计数据（分类进度、总进度、总重量）

**数据来源**：
- `items` 表：按 `trip_id` 和 `category` 查询
- 更新时触发云函数 `updateStats` 重新计算统计

---

### 4. 多人协作（可选，Phase 2）

**分享清单**：
- 生成分享码（6位随机字符串）
- 显示分享链接
- 其他用户通过分享码加入

**协作功能**：
- 每个物品可分配负责人
- 显示头像在物品旁边
- 实时同步更新

---

## 数据库设计

### `trips` 表（清单主表）
```typescript
interface Trip {
  _id: string;
  user_id: string;                // 创建者
  title: string;                  // 清单标题（如"西藏6日游"）
  destination: string;            // 目的地
  start_date: string;             // 出发日期
  end_date: string;               // 返回日期
  days: number;                   // 天数
  trip_type: string;              // 旅行类型
  luggage_type: string;           // 行李类型
  max_weight: number;             // 最大重量（kg）
  collaborators: string[];        // 协作者ID列表
  share_code?: string;            // 分享码
  stats: {
    total_items: number;
    packed_items: number;
    total_weight: number;
    completion_rate: number;
  };
  created_at: string;
  updated_at: string;
}
```

### `items` 表（物品表）
```typescript
interface Item {
  _id: string;
  trip_id: string;                // 所属清单
  category: string;               // 分类（documents | clothing | electronics | medicine | toiletries | outdoor | misc）
  name: string;                   // 物品名称
  weight: number;                 // 重量（kg）
  quantity: number;               // 数量
  is_packed: boolean;             // 是否已打包
  assigned_to?: string;           // 分配给谁（协作功能）
  need_to_buy: boolean;           // 是否需要购买
  is_bought: boolean;             // 是否已购买
  priority: string;               // 优先级（high | medium | low）
  notes?: string;                 // 备注
  created_at: string;
  updated_at: string;
}
```

### `categories` 表（分类表）
```typescript
interface Category {
  _id: string;
  key: string;                    // 分类键（documents, clothing, ...）
  name_zh: string;                // 中文名称
  icon: string;                   // Emoji 图标
  order: number;                  // 排序
}
```

### `item_templates` 表（物品模板库）
```typescript
interface ItemTemplate {
  _id: string;
  name: string;                   // 物品名称
  category: string;               // 分类
  weight: number;                 // 标准重量（kg）
  tags: string[];                 // 标签（户外、防水、保暖...）
  applicable_conditions: {
    trip_types: string[];         // 适用旅行类型
    min_temperature?: number;     // 适用最低温度
    max_temperature?: number;     // 适用最高温度
    weather_conditions?: string[]; // 天气条件（rain, snow, wind）
    altitude_min?: number;        // 适用海拔
  };
  priority: string;               // 默认优先级
}
```

### `destinations` 表（目的地库）
```typescript
interface Destination {
  _id: string;
  name: string;                   // 城市名称
  country: string;                // 国家
  coordinates: {
    lat: number;
    lng: number;
  };
  climate_zone: string;           // 气候带
  altitude: number;               // 海拔（米）
  climate_by_month: {
    [month: string]: {
      avg_temp: number;
      min_temp: number;
      max_temp: number;
      rainfall: number;
      uv_index: number;
    };
  };
  special_requirements: string[]; // 特殊要求（如"高原反应预防"）
  recommended_items: string[];    // 推荐物品
}
```

---

## 核心算法

### 智能清单生成（云函数 `generatePackingList`）

**输入**：
```typescript
{
  destination: string;
  start_date: string;
  end_date: string;
  trip_type: string;
  luggage_type: string;
}
```

**逻辑**：
```typescript
1. 查询 destinations 表获取目的地信息
   - 气候带、海拔、月度气候数据
   
2. 调用和风天气 API 获取未来7天天气
   - 温度范围、降雨、风速、紫外线
   
3. 从 item_templates 表匹配物品
   条件：
   - trip_types 包含当前旅行类型
   - 温度范围匹配天气预报
   - 海拔匹配目的地
   - 特殊天气条件（雨/雪/风）
   
4. 按优先级排序（高优先级优先）
   
5. 检查重量限制
   - 如果总重量超过限制，移除低优先级物品
   
6. 创建 trip 记录
   
7. 批量创建 items 记录
   
8. 返回 trip_id
```

**输出**：
```typescript
{
  trip_id: string;
  generated_items_count: number;
  total_weight: number;
}
```

---

### 统计更新（云函数 `updateStats`）

**触发时机**：
- 用户勾选/取消物品
- 添加/删除物品
- 修改物品重量

**逻辑**：
```typescript
1. 查询 trip_id 对应的所有 items
2. 计算：
   - total_items = items.length
   - packed_items = items.filter(i => i.is_packed).length
   - total_weight = sum(items.weight)
   - completion_rate = packed_items / total_items
3. 更新 trips 表的 stats 字段
```

---

## UI/UX 要求

### 视觉风格
- **配色**：柔和渐变背景（紫色系 `#667eea` → `#764ba2`）
- **卡片**：白色毛玻璃效果（`backdrop-filter: blur(20px)`）
- **阴影**：柔和阴影（`box-shadow: 0 8px 32px rgba(0,0,0,0.1)`）
- **圆角**：卡片 16px，按钮 8px
- **字体**：
  - 标题：700粗体
  - 正文：600中粗
  - 辅助文字：400常规
- **图标**：Emoji（无需额外图标库）

### 交互细节
- 按钮悬停：上浮 2px（`translateY(-2px)`）
- 卡片悬停：上浮 4px + 阴影加深
- 进度条：平滑动画过渡（300ms ease）
- 选项按钮：选中后渐变背景 + 白色文字
- 复选框：大号（24x24px），点击有反馈

### 响应式
- 桌面端（1200px+）：3列卡片网格
- 平板端（768-1199px）：2列卡片网格
- 移动端（<768px）：1列卡片网格，侧边栏改为底部 Tab

---

## 数据准备

### 需要预填的数据

**1. categories 表**（7条）：
```javascript
[
  { key: "documents", name_zh: "证件类", icon: "📄", order: 1 },
  { key: "clothing", name_zh: "衣物类", icon: "👕", order: 2 },
  { key: "electronics", name_zh: "电子产品", icon: "📱", order: 3 },
  { key: "medicine", name_zh: "药品类", icon: "💊", order: 4 },
  { key: "toiletries", name_zh: "洗漱用品", icon: "🧴", order: 5 },
  { key: "outdoor", name_zh: "户外装备", icon: "⛺", order: 6 },
  { key: "misc", name_zh: "其他", icon: "📦", order: 7 }
]
```

**2. item_templates 表**（200-300条）：
重点物品示例：
```javascript
// 证件类
{ name: "身份证", category: "documents", weight: 0.05, ... }
{ name: "护照", category: "documents", weight: 0.1, ... }
{ name: "边防证", category: "documents", weight: 0.05, applicable_conditions: { special_destinations: ["西藏", "新疆"] } }

// 衣物类（按温度区间）
{ name: "冲锋衣", category: "clothing", weight: 0.8, applicable_conditions: { min_temperature: -10, max_temperature: 15, weather_conditions: ["rain", "wind"] } }
{ name: "羽绒服", category: "clothing", weight: 1.2, applicable_conditions: { min_temperature: -30, max_temperature: 0 } }
{ name: "短袖T恤", category: "clothing", weight: 0.15, applicable_conditions: { min_temperature: 20, max_temperature: 40 } }

// 高原专用
{ name: "红景天", category: "medicine", weight: 0.05, applicable_conditions: { altitude_min: 2500 } }
{ name: "氧气瓶", category: "outdoor", weight: 0.5, applicable_conditions: { altitude_min: 3500 } }
```

**3. destinations 表**（100条热门目的地）：
优先录入：
- 国内：北京、上海、成都、西藏、新疆、云南、海南、张家界、黄山...
- 国际：东京、首尔、曼谷、新加坡、巴黎、伦敦、纽约...

---

## 开发阶段划分

### Phase 1（核心功能，1周）
- [x] 数据库设计和数据预填
- [ ] 首页（清单列表）
- [ ] 创建清单流程
- [ ] 清单详情页（单用户）
- [ ] 智能生成云函数

### Phase 2（增强功能，1周）
- [ ] 多人协作
- [ ] 购物清单
- [ ] 天气预报集成
- [ ] 导出功能（PDF/图片）

### Phase 3（优化，1周）
- [ ] 响应式优化
- [ ] 性能优化
- [ ] 用户体验打磨
- [ ] 微信小程序迁移

---

## 测试用例

### 创建清单测试
```
输入：
- 目的地：拉萨
- 天数：4-7天
- 月份：5月
- 类型：自驾游
- 行李：经济舱 (23kg)

预期输出：
- 生成50个左右物品
- 包含：身份证、护照、边防证、冲锋衣、羽绒服、红景天、防晒霜 SPF50+、墨镜...
- 总重量 < 23kg
- 衣物适合5月拉萨气温（3-21℃）
```

### 重量预警测试
```
场景：用户勾选物品导致总重量超过限制

预期：
- 进度条变红
- 底部显示警告："已超重 2.3kg，建议移除部分物品"
```

### 协作测试
```
场景：A创建清单，B通过分享码加入

预期：
- B可以看到清单
- B勾选物品后，A实时看到更新
- 物品显示负责人头像
```

---

## 部署要求

### Web 版（GitHub Pages）
- 静态构建（`npm run build`）
- 推送到 `gh-pages` 分支
- 域名：`你的用户名.github.io/travelpacking-list`

### 小程序版（后续）
- 使用 Taro 框架重写（一套代码多端部署）
- 复用云开发数据库和云函数
- 通过微信小程序审核

---

## 关键注意事项

1. **重量单位统一为 kg**（小数点后2位）
2. **日期格式统一为 ISO 8601**（YYYY-MM-DD）
3. **所有用户输入需验证**（非空、格式正确）
4. **天气 API 结果需缓存**（避免频繁调用）
5. **数据库查询需加索引**（user_id, trip_id）
6. **协作功能需防止并发冲突**（乐观锁或时间戳）
7. **敏感信息不存明文**（分享码可以，但不要存密码）

---

## 交付物

请提供：
1. ✅ 完整前端代码（React + TypeScript + Tailwind）
2. ✅ 云函数代码（generatePackingList, updateStats）
3. ✅ 数据库初始化脚本（categories, item_templates, destinations）
4. ✅ README.md（安装、运行、部署说明）
5. ✅ 测试数据（至少1个完整清单）

---

## 技术细节补充

### 前端技术栈
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "axios": "^1.0.0",
    "date-fns": "^2.0.0"
  }
}
```

### 云函数示例（微信云开发）
```javascript
// cloud/functions/generatePackingList/index.js
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const { destination, start_date, end_date, trip_type, luggage_type } = event;
  
  // 1. 查询目的地信息
  const destInfo = await db.collection('destinations').where({ name: destination }).get();
  
  // 2. 调用天气 API
  const weather = await getWeather(destInfo.data[0].coordinates);
  
  // 3. 匹配物品模板
  const templates = await db.collection('item_templates')
    .where({
      'applicable_conditions.trip_types': trip_type,
      'applicable_conditions.min_temperature': db.command.lte(weather.min_temp)
    })
    .get();
  
  // 4. 创建清单
  const trip = await db.collection('trips').add({
    data: { user_id: context.OPENID, title: `${destination}旅行`, ... }
  });
  
  // 5. 批量创建物品
  const items = templates.data.map(t => ({ trip_id: trip._id, name: t.name, ... }));
  await db.collection('items').add({ data: items });
  
  return { trip_id: trip._id };
};
```

---

## 开始开发

现在你可以：

1. **直接把这整个文档复制给 AI**（Claude/GPT/Cursor）
2. **让 AI 按照需求开发**
3. **分阶段验收**（Phase 1 → Phase 2 → Phase 3）

如果有任何不清楚的地方，AI 会问你。

**开发口令**：
```
请根据以上完整需求文档，从 Phase 1 开始开发旅行清单工具。
先搭建项目结构，然后实现首页、创建流程、详情页。
使用 React + TypeScript + Tailwind CSS。
```
