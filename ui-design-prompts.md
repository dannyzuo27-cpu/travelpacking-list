# 旅行清单工具 UI 设计提示词

## 设计需求总结

**产品定位**: 旅行清单打包工具（桌面网页版）  
**目标用户**: 旅行者、情侣/家庭协作打包  
**核心功能**: 智能清单生成、多人协作、重量管理、购物清单  
**视觉风格**: 清新、柔和、简约、手绘元素、高级感  

---

## 🎨 整体风格关键词

```
clean modern web UI design, pastel gradient background, 
soft shadows, glassmorphism cards, hand-drawn doodle icons, 
playful yet professional, travel aesthetic, minimalist layout,
gentle color palette, rounded corners, airy spacing,
floating card design, subtle 3D depth, friendly and approachable
```

**配色方向**:
- 主色调：柔和渐变（青绿→粉色 / 淡紫→桃橙）
- 卡片：白色毛玻璃效果
- 强调色：柔和的紫色/蓝色
- 文字：深灰 (#1A1A1A) 和中灰 (#666)

**字体风格**:
- 标题：粗体、现代感、圆润
- 正文：清晰易读、中等粗细
- 数字：等宽字体、醒目

---

## 📄 页面设计提示词

### 1. 首页（清单列表）

```
Modern travel packing list web app dashboard, 
desktop view, wide screen layout (1400px container),
soft gradient background (mint green to pink),
card grid layout with 3 columns,
each card shows trip title, dates, destination icon,
progress bars with gradient fill,
glassmorphism white cards with subtle shadow,
hand-drawn travel doodles (plane, luggage, passport),
floating elements with gentle animation,
clean typography, lots of white space,
top navigation bar with logo and action buttons,
professional yet playful design aesthetic
```

**关键元素**:
- 顶部导航：Logo（行李箱图标）+ "我的清单" 按钮 + "创建新清单" 按钮
- 清单卡片：3列网格，每张卡片显示标题、日期、目的地、进度条（2条）
- 背景：柔和渐变 + 浮动装饰元素（小云朵、星星）
- 卡片悬停效果：微微上浮、阴影加深

### 2. 创建清单页面（表单）

```
Travel planning form page, clean web design,
centered white card (800px max width),
soft gradient purple background,
form title "创建新的旅行清单" in bold sans-serif,
input fields with rounded borders and focus states,
button grid for multiple choice options (3 columns),
selected button with gradient fill and white text,
unselected buttons with light border and white background,
large submit button at bottom with gradient background,
minimalist form layout, generous padding,
friendly and approachable design
```

**关键元素**:
- 表单卡片：居中、大圆角、白色背景
- 输入框：目的地（文本框）
- 选项按钮组：
  - 出行天数（1-3天 / 4-7天 / 8-15天）
  - 旅行类型（度假休闲 / 自驾游 / 徒步 / 滑雪 / 露营 / 商务出差）
  - 行李限制（廉航7kg / 经济舱23kg / 无限制）
- 提交按钮：全宽、渐变背景、"生成清单"

### 3. 清单详情页（主要页面）

```
Travel packing checklist detail page, two-column layout,
left sidebar (280px) with category navigation,
right content area with item table,
white glassmorphism cards on gradient background,
category nav items with icons (emoji) and badge counts,
active category with gradient background,
table with checkboxes, item names, weights, and status tags,
progress bars at bottom showing packing and weight stats,
clean grid system, professional table design,
hand-drawn accent elements, modern web app aesthetic
```

**关键元素**:

**左侧分类导航**:
- 📄 证件类 (2/3)
- 👕 衣物类 (1/12)
- 📱 电子产品 (0/8)
- 💊 药品类 (0/5)
- 🧴 洗漱用品 (3/8)
- ⛺ 户外装备 (0/10)

**右侧内容区**:
- 顶部：分类标题 + 统计卡片（已准备数量、总重量）
- 表格：复选框 | 物品名称 | 重量 | 状态标签
- 状态标签：
  - 已打包（绿色背景）
  - 待打包（黄色背景）

**底部固定栏**:
- 2条进度条（打包进度 + 行李重量）
- 渐变填充、百分比数字

### 4. 协作页面（多人打包）

```
Collaborative packing list page, web app design,
split view showing multiple users' assignments,
avatar badges next to item names,
"add collaborator" button with invite code display,
real-time collaboration indicators (who's online),
user assignment dropdowns on each item,
color-coded by person, modern SaaS design,
friendly team collaboration aesthetic
```

**关键元素**:
- 用户头像：小圆形头像在物品右侧
- 分配按钮：点击选择负责人
- 分享链接：显示分享码（如 ABC123）
- 在线状态：绿点表示在线

---

## 🧩 组件设计提示词

### 进度条组件

```
Modern progress bar component, gradient fill (purple to pink),
rounded corners, 8px height,
label on top with item count (23/50),
smooth animated transition,
light gray background track,
clean minimalist design
```

### 按钮组件

```
Primary button: gradient background (mint to pink),
white text, 16px padding, 8px border radius,
hover state with lift effect (translateY -2px),
soft shadow,
Secondary button: white background, colored border,
colored text, same size and shape
```

### 卡片组件

```
Glassmorphism card design, 
white background with 90% opacity,
backdrop blur 20px,
subtle shadow (0 8px 32px rgba(0,0,0,0.1)),
24px border radius,
32-40px padding,
hover state with slight scale and shadow increase
```

### 表格组件

```
Clean data table design,
header row with uppercase labels in gray,
data rows with bottom border (light gray),
checkbox column (24px squares),
status badge column (colored pills with rounded corners),
hover row highlight (light background),
responsive and accessible
```

---

## 🎭 图标与装饰元素

### 手绘图标风格

```
Hand-drawn doodle icons, minimalist line art,
slightly imperfect lines for organic feel,
travel themed: airplane, luggage, passport, compass, map,
1-2px stroke weight, rounded line caps,
monochrome or subtle gradient fill,
playful but not childish, modern illustration style
```

**需要的图标**:
- 行李箱（logo 使用）
- 飞机（旅行主题）
- 护照、身份证（证件类）
- T恤、外套（衣物类）
- 手机、充电器（电子产品）
- 药瓶、创可贴（药品类）
- 牙刷、洗发水（洗漱用品）
- 帐篷、背包（户外装备）

### 装饰元素

```
Floating decorative elements for background,
hand-drawn style: small stars, circles, arrows, clouds,
subtle pastel colors, semi-transparent,
gentle floating animation (CSS),
scattered across background without cluttering content,
adds personality without distracting
```

---

## 📱 响应式设计要求

### 桌面端（1200px+）
```
Wide layout, 3-column card grid,
sidebar navigation visible,
table with all columns,
generous white space
```

### 平板端（768-1199px）
```
2-column card grid,
collapsible sidebar,
table maintains structure,
adjusted padding
```

### 移动端（<768px）
```
Single column layout,
bottom tab navigation instead of sidebar,
card-based item list (no table),
sticky bottom stats bar,
swipeable categories
```

---

## 🌈 配色方案（具体色值）

### 方案 A：清新柔和
```
Background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)
Card: rgba(255, 255, 255, 0.95)
Primary: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)
Secondary: #fbc2eb → #a6c1ee
Accent: #fdcbf1 → #e6dee9
Text: #1A1A1A
Text-secondary: #666
```

### 方案 B：专业紫调
```
Background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Card: rgba(255, 255, 255, 0.95)
Primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Text: #1A1A1A
Text-secondary: #666
Success: #10B981
Warning: #F59E0B
Danger: #EF4444
```

---

## 🔧 技术实现提示

### CSS 关键属性
```css
/* 毛玻璃效果 */
backdrop-filter: blur(20px);
background: rgba(255, 255, 255, 0.95);

/* 柔和阴影 */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

/* 渐变背景 */
background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);

/* 圆角 */
border-radius: 16px; /* 卡片 */
border-radius: 8px;  /* 按钮、输入框 */

/* 悬停效果 */
transition: transform 0.3s ease, box-shadow 0.3s ease;
transform: translateY(-4px);
```

---

## 📸 设计工具提示词（Figma/Sketch）

### Figma Auto Layout 设置
- 卡片内边距：32px
- 元素间距：16-24px
- 网格列间距：24px
- 最大容器宽度：1400px

### Sketch 画板尺寸
- 桌面端：1440x900
- 平板端：768x1024
- 移动端：375x812

---

## ✨ 最终设计检查清单

UI 设计完成后，确保：
- [ ] 配色柔和、和谐（非刺眼）
- [ ] 留白充足（不拥挤）
- [ ] 层次清晰（标题、正文、辅助文字区分明显）
- [ ] 交互反馈明确（按钮悬停、选中状态）
- [ ] 手绘元素点缀但不喧宾夺主
- [ ] 所有文字清晰可读（对比度≥4.5:1）
- [ ] 进度条直观（颜色 + 数字）
- [ ] 表格易扫描（行高、对齐、分割线）
- [ ] 响应式布局合理

---

## 🎬 推荐参考案例

**风格参考**:
- Notion（简洁、卡片式）
- Linear（现代、紫色调）
- Stripe（专业、柔和渐变）
- Airbnb（旅行主题、友好）

**配色参考**:
- https://uigradients.com/ （渐变配色）
- https://coolors.co/ （配色方案）

**图标参考**:
- https://phosphoricons.com/ （简约线条图标）
- https://iconoir.com/ （优雅图标库）

---

## 📝 具体设计任务（交给 AI 生成）

### Midjourney 提示词示例

**首页**:
```
modern travel packing list web app, dashboard view, 
desktop UI, card grid layout showing trip cards, 
soft gradient background mint green to pink, 
glassmorphism white cards with shadows, 
progress bars with gradient, hand-drawn travel icons, 
clean typography, lots of white space, professional design,
--ar 16:9 --style raw --v 6
```

**详情页**:
```
packing list detail page, web app interface, 
two-column layout, left sidebar with category navigation, 
right side data table with checkboxes, 
purple gradient background, white glassmorphism cards,
emoji category icons, modern minimalist design,
--ar 16:9 --style raw --v 6
```

**创建页面**:
```
travel planning form page, centered white card, 
input fields and button grid for options, 
soft gradient purple background, clean form design,
rounded corners, friendly web interface,
--ar 16:9 --style raw --v 6
```

---

## 💡 设计建议

1. **先画线框图**（Figma/纸笔）确定布局
2. **再做视觉设计**（配色、图标、装饰）
3. **最后做交互原型**（悬停、点击、动画）

用这套提示词可以：
- 直接发给设计师
- 喂给 AI 设计工具（Midjourney、DALL-E、Galileo AI）
- 作为前端开发的参考文档

需要我根据这套提示词生成一版高保真设计图吗？（我可以用文字详细描述每个元素的具体位置和样式）
