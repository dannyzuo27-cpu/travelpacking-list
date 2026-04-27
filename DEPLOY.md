# 部署指南 / Deployment Guide

## 快速部署到 GitHub Pages

### 1. 创建 GitHub 仓库

```bash
# 在项目文件夹中初始化 Git
cd travelpacking-list
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Travel Packing List app"

# 在 GitHub 上创建新仓库（私有）
# 访问: https://github.com/new
# 仓库名: travelpacking-list
# 选择: Private (私有)
# 不要勾选任何初始化选项

# 连接远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/travelpacking-list.git

# 推送代码
git branch -M main
git push -u origin main
```

### 2. 启用 GitHub Pages

1. 打开你的仓库设置：`https://github.com/YOUR_USERNAME/travelpacking-list/settings`
2. 点击左侧 "Pages"
3. 在 "Source" 下选择：
   - Branch: `main`
   - Folder: `/ (root)`
4. 点击 "Save"
5. 等待 1-2 分钟，访问：`https://YOUR_USERNAME.github.io/travelpacking-list`

**注意：即使仓库是私有的，GitHub Pages 也会公开访问。如果不想公开，跳过第2步。**

---

## 部署到 Vercel（推荐，更快）

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 部署

```bash
cd travelpacking-list
vercel

# 按提示操作：
# - 登录 Vercel 账号
# - 选择项目设置（默认即可）
# - 部署完成后会给你一个 .vercel.app 域名
```

### 3. 绑定自定义域名（可选）

在 Vercel 项目设置里添加你的域名，然后在域名提供商处添加 CNAME 记录。

---

## 部署到 Netlify

### 1. 拖拽部署

1. 访问：https://app.netlify.com/drop
2. 把整个 `travelpacking-list` 文件夹拖进去
3. 几秒钟后就部署好了

### 2. 或者连接 GitHub

1. 访问：https://app.netlify.com
2. 点击 "Add new site" → "Import an existing project"
3. 选择 GitHub 并授权
4. 选择 `travelpacking-list` 仓库
5. 部署设置保持默认，点击 "Deploy"

---

## 后续更新代码

```bash
# 修改代码后
git add .
git commit -m "Update: description of changes"
git push

# GitHub Pages / Netlify 会自动重新部署
# Vercel 需要再次运行 vercel --prod
```

---

## 域名迁移

### GitHub Pages

1. 进入仓库设置 → Pages
2. 在 "Custom domain" 输入你的域名（如 packing.yourdomain.com）
3. 在域名提供商处添加 CNAME 记录：
   ```
   packing  →  YOUR_USERNAME.github.io
   ```

### Vercel/Netlify

1. 进入项目设置 → Domains
2. 添加你的域名
3. 按提示在域名提供商处添加记录

**迁移过程不需要改代码，几分钟完成。**

---

## 本地预览

```bash
# macOS/Linux
python3 -m http.server 8000

# Windows
python -m http.server 8000

# 然后访问 http://localhost:8000
```

或者用 VS Code 的 Live Server 插件。
