# 旅行清单数据库设计

## 技术选型

### 微信小程序云开发（推荐）
- **优势**：免费额度、免后端、自动扩容、集成微信生态
- **存储**：云数据库（MongoDB）
- **文件**：云存储（图片导出）
- **函数**：云函数（天气API、智能推荐）

### 备选方案：Supabase
- **优势**：开源、PostgreSQL、实时订阅、免费额度
- **劣势**：需要自己部署后端逻辑

---

## 数据库表结构（MongoDB 集合设计）

### 1. users（用户表）
```javascript
{
  _id: "user_001",
  openid: "wx_openid_xxx", // 微信用户唯一标识
  nickname: "张三",
  avatar: "https://xxx.jpg",
  created_at: "2026-04-27T15:20:00Z",
  preferences: {
    default_luggage_type: "economy", // economy | first_class | budget
    items_history: ["冲锋衣", "登山鞋"], // 常用物品
    excluded_items: ["跑鞋"], // 从不带的物品
    default_notification_days: 3 // 提前几天提醒
  }
}
```

### 2. trips（旅行清单主表）
```javascript
{
  _id: "trip_001",
  user_id: "user_001",
  title: "西藏6日游",
  destination: "西藏",
  destination_details: {
    city: "拉萨",
    country: "中国",
    climate_zone: "高原",
    altitude: 3650, // 海拔米
    coordinates: { lat: 29.65, lng: 91.1 }
  },
  start_date: "2026-05-01",
  end_date: "2026-05-06",
  days: 6,
  trip_type: "self_drive", // vacation | self_drive | hiking | skiing | camping | business
  luggage_type: "unlimited", // budget | economy | first_class | unlimited
  max_weight: 23, // kg
  collaborators: ["user_002", "user_003"], // 协作者ID列表
  share_code: "ABC123", // 分享码
  created_at: "2026-04-20T10:00:00Z",
  updated_at: "2026-04-27T15:20:00Z",
  status: "active", // active | completed | archived
  stats: {
    total_items: 50,
    packed_items: 23,
    total_weight: 8.5,
    completion_rate: 0.46
  }
}
```

### 3. items（物品表）
```javascript
{
  _id: "item_001",
  trip_id: "trip_001",
  category: "documents", // documents | clothing | electronics | medicine | toiletries | outdoor | misc
  name: "身份证",
  weight: 0.05, // kg
  quantity: 1,
  is_packed: true,
  assigned_to: "user_001", // 分配给哪个用户
  need_to_buy: false, // 是否需要购买
  is_bought: false, // 是否已购买
  priority: "high", // high | medium | low
  notes: "放在外套口袋",
  packed_at: "2026-04-25T14:30:00Z",
  created_at: "2026-04-20T10:05:00Z",
  updated_at: "2026-04-25T14:30:00Z"
}
```

### 4. categories（分类表）
```javascript
{
  _id: "cat_001",
  key: "documents",
  name_zh: "证件类",
  name_en: "Documents",
  icon: "📄",
  order: 1,
  description: "护照、身份证、签证等"
}
```

### 5. item_templates（物品模板库）
```javascript
{
  _id: "template_001",
  name: "冲锋衣",
  category: "clothing",
  weight: 0.8, // kg
  tags: ["户外", "防水", "保暖"],
  applicable_conditions: {
    trip_types: ["hiking", "camping", "self_drive"],
    min_temperature: -10, // 适用最低温度
    max_temperature: 15,
    weather_conditions: ["rain", "snow", "wind"],
    altitude_min: 2000 // 适用海拔
  },
  alternatives: ["羽绒服", "防风外套"], // 替代品
  priority_rules: {
    // 优先级规则（根据目的地条件自动调整）
    high_priority_if: {
      altitude: { gt: 3000 },
      temperature: { lt: 5 }
    }
  }
}
```

### 6. destinations（目的地库）
```javascript
{
  _id: "dest_001",
  name: "拉萨",
  name_en: "Lhasa",
  country: "中国",
  coordinates: { lat: 29.65, lng: 91.1 },
  climate_zone: "high_altitude",
  altitude: 3650,
  timezone: "Asia/Shanghai",
  // 月度气候数据
  climate_by_month: {
    "5": {
      avg_temp: 12,
      min_temp: 3,
      max_temp: 21,
      rainfall: 20, // mm
      uv_index: 8,
      daylight_hours: 14
    }
  },
  special_requirements: [
    "高原反应预防",
    "防晒",
    "保暖衣物",
    "氧气瓶（可选）"
  ],
  recommended_items: [
    "红景天",
    "防晒霜 SPF50+",
    "羽绒服",
    "冲锋衣"
  ],
  entry_requirements: {
    passport: false,
    visa: false,
    border_permit: true, // 边防证
    vaccination: []
  }
}
```

### 7. weather_cache（天气缓存表）
```javascript
{
  _id: "weather_001",
  destination_id: "dest_001",
  date: "2026-05-01",
  temperature: {
    min: 3,
    max: 21,
    avg: 12
  },
  weather: "sunny",
  weather_desc: "晴",
  rainfall: 0,
  wind_speed: 12, // km/h
  uv_index: 8,
  humidity: 30,
  fetched_at: "2026-04-27T15:00:00Z",
  expires_at: "2026-04-27T21:00:00Z" // 缓存6小时
}
```

### 8. notifications（通知表）
```javascript
{
  _id: "notif_001",
  user_id: "user_001",
  trip_id: "trip_001",
  type: "departure_reminder", // departure_reminder | weight_warning | weather_alert | collaboration_update
  title: "西藏6日游即将出发",
  content: "还有3天出发，检查一下行李是否准备齐全",
  scheduled_at: "2026-04-28T09:00:00Z",
  sent_at: "2026-04-28T09:00:05Z",
  is_read: false,
  created_at: "2026-04-25T10:00:00Z"
}
```

### 9. activity_logs（活动日志）
```javascript
{
  _id: "log_001",
  trip_id: "trip_001",
  user_id: "user_001",
  action: "item_packed", // item_packed | item_added | item_removed | collaborator_added | trip_shared
  target: {
    type: "item",
    id: "item_001",
    name: "身份证"
  },
  timestamp: "2026-04-25T14:30:00Z",
  ip: "192.168.1.1",
  device: "iPhone 13"
}
```

---

## 索引设计

### trips 集合
```javascript
// 用户的清单列表
db.trips.createIndex({ user_id: 1, created_at: -1 })

// 分享码查找
db.trips.createIndex({ share_code: 1 }, { unique: true, sparse: true })

// 协作者查找
db.trips.createIndex({ collaborators: 1 })
```

### items 集合
```javascript
// 按清单查找物品
db.items.createIndex({ trip_id: 1, category: 1 })

// 购物清单
db.items.createIndex({ trip_id: 1, need_to_buy: 1 })

// 分配给特定用户的物品
db.items.createIndex({ trip_id: 1, assigned_to: 1 })
```

### item_templates 集合
```javascript
// 分类查找模板
db.item_templates.createIndex({ category: 1 })

// 标签搜索
db.item_templates.createIndex({ tags: 1 })
```

### destinations 集合
```javascript
// 名称搜索
db.destinations.createIndex({ name: "text", name_en: "text" })

// 地理位置搜索
db.destinations.createIndex({ "coordinates": "2dsphere" })
```

---

## 核心查询示例

### 1. 获取用户的清单列表
```javascript
db.trips.find({
  $or: [
    { user_id: "user_001" },
    { collaborators: "user_001" }
  ]
}).sort({ updated_at: -1 })
```

### 2. 获取某个清单的所有物品（按分类）
```javascript
db.items.aggregate([
  { $match: { trip_id: "trip_001" } },
  { $group: {
    _id: "$category",
    items: { $push: "$$ROOT" },
    total_weight: { $sum: "$weight" },
    packed_count: { $sum: { $cond: ["$is_packed", 1, 0] } },
    total_count: { $sum: 1 }
  }},
  { $sort: { "_id": 1 } }
])
```

### 3. 智能推荐物品（根据目的地和旅行类型）
```javascript
db.item_templates.find({
  "applicable_conditions.trip_types": "hiking",
  "applicable_conditions.min_temperature": { $lte: 12 },
  "applicable_conditions.altitude_min": { $lte: 3650 }
})
```

### 4. 购物清单
```javascript
db.items.find({
  trip_id: "trip_001",
  need_to_buy: true,
  is_bought: false
})
```

### 5. 超重警告
```javascript
db.trips.aggregate([
  { $match: { _id: "trip_001" } },
  { $lookup: {
    from: "items",
    localField: "_id",
    foreignField: "trip_id",
    as: "items"
  }},
  { $project: {
    total_weight: { $sum: "$items.weight" },
    max_weight: 1,
    is_overweight: { $gt: [{ $sum: "$items.weight" }, "$max_weight"] }
  }}
])
```

---

## 数据初始化

### 1. 分类数据
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

### 2. 物品模板（示例）
需要准备200-300个常见旅行物品：
- 证件类：身份证、护照、签证、边防证、驾驶证、保险单、机票、酒店预订单
- 衣物类：按温度区间（-10℃以下、-10~0℃、0~15℃、15~25℃、25℃以上）
- 电子产品：手机、充电器、充电宝、转换插头、相机、笔记本电脑、耳机
- 药品：感冒药、止泻药、创可贴、红景天（高原）、防蚊液、晕车药
- 洗漱：牙刷、牙膏、毛巾、洗发水、沐浴露、防晒霜、护肤品
- 户外：背包、登山杖、睡袋、帐篷、头灯、防水袋、多功能刀

### 3. 目的地库（优先级）
第一批：100个热门目的地
- 国内：北京、上海、成都、西藏、新疆、云南、海南...
- 国际：日本、泰国、韩国、新加坡、欧洲主要城市...

---

## 云函数设计

### 1. generatePackingList（生成清单）
```javascript
// 输入
{
  destination: "拉萨",
  start_date: "2026-05-01",
  end_date: "2026-05-06",
  trip_type: "self_drive",
  luggage_type: "unlimited"
}

// 逻辑
1. 查询目的地气候数据
2. 查询天气预报
3. 根据温度、海拔、旅行类型匹配物品模板
4. 按优先级排序
5. 创建trip和items记录
6. 返回清单ID
```

### 2. getWeatherForecast（天气预报）
```javascript
// 调用和风天气API
// 缓存到weather_cache表
// 返回未来7天天气
```

### 3. updateStats（更新统计）
```javascript
// 每次物品打勾/取消时触发
// 更新trip.stats字段
```

### 4. sendNotification（发送通知）
```javascript
// 出发前3天自动触发
// 微信服务通知
```

---

## 安全规则（微信云开发）

```javascript
{
  // 用户只能读写自己创建或参与的清单
  "trips": {
    "read": "auth.openid == doc.user_id || doc.collaborators.includes(auth.openid)",
    "write": "auth.openid == doc.user_id || doc.collaborators.includes(auth.openid)"
  },
  
  // 物品必须属于用户有权访问的清单
  "items": {
    "read": "get(`database.trips.${doc.trip_id}`).user_id == auth.openid",
    "write": "get(`database.trips.${doc.trip_id}`).user_id == auth.openid"
  },
  
  // 模板和目的地库公开只读
  "item_templates": { "read": true, "write": false },
  "destinations": { "read": true, "write": false },
  "categories": { "read": true, "write": false }
}
```

---

## 数据量预估

### 初期（1000用户）
- users: 1,000
- trips: 3,000（平均每用户3个清单）
- items: 150,000（平均每清单50个物品）
- item_templates: 300
- destinations: 100
- notifications: 9,000

**总存储**: ~50MB（纯数据）

### 成熟期（10万用户）
- users: 100,000
- trips: 300,000
- items: 15,000,000
- notifications: 900,000

**总存储**: ~5GB

**微信云开发免费额度**: 2GB存储，5GB流量/月 → 够用
