# TIB OS PWA - 安装和使用指南

## 📱 什么是 PWA？

PWA (Progressive Web App) 是一种渐进式 Web 应用，可以像原生 App 一样安装到设备上，具有以下特点：

- ✅ **无需应用商店审核**
- ✅ **一键安装到主屏幕**
- ✅ **离线访问核心功能**
- ✅ **全屏显示（无浏览器地址栏）**
- ✅ **跨平台兼容**（iOS、Android、桌面端）

## 🚀 快速开始

### 方法 1：本地开发（推荐）

1. **启动本地服务器**
   ```bash
   # 使用 Python 3
   cd pwa-version
   python3 -m http.server 8000

   # 或使用 Node.js
   npx http-server -p 8000
   ```

2. **在浏览器中打开**
   ```
   http://localhost:8000
   ```

3. **测试 PWA 安装**
   - Chrome: 等待地址栏出现"安装应用"图标
   - Safari: 点击分享按钮 → "添加到主屏幕"

### 方法 2：部署到生产环境

#### 选项 1：GitHub Pages（免费）

1. 创建 GitHub 仓库
2. 上传 `pwa-version` 目录内容
3. 在仓库设置中启用 GitHub Pages
4. 访问 `https://yourname.github.io/repository-name/`

#### 选项 2：Vercel（推荐）

1. 安装 Vercel CLI
   ```bash
   npm i -g vercel
   ```

2. 部署
   ```bash
   cd pwa-version
   vercel
   ```

3. 按照提示完成部署

#### 选项 3：Netlify（免费）

1. 拖拽 `pwa-version` 文件夹到 [Netlify Drop](https://app.netlify.com/drop)
2. 等待部署完成（约 1 分钟）
3. 获得一个 `https://random-name.netlify.app` 的 URL

## 📂 文件结构

```
pwa-version/
├── index.html              # 主入口（响应式设计）
├── manifest.json           # PWA 应用清单
├── sw.js                   # Service Worker（离线缓存）
├── assets/
│   ├── data/
│   │   └── prompts.js      # Prompt 数据
│   ├── icons/
│   │   ├── icon-192.png    # 占位符（需要替换）
│   │   └── icon-512.png    # 占位符（需要替换）
│   └── js/
│       ├── app.js          # 主应用逻辑
│       ├── desktop-view.js # 桌面版视图
│       └── mobile-view.js  # 移动端视图
└── install-guide/
    ├── install.html        # 安装指南
    └── generate-icons.html # 图标生成工具
```

## 🎨 准备应用图标

### 快速方法

1. 访问 `/install-guide/generate-icons.html`
2. 选择一个设计风格
3. 截图保存为 PNG
4. 使用图片编辑工具裁剪为 192x192 和 512x512
5. 替换 `assets/icons/` 目录下的占位符文件

### 专业方法

1. 访问 [RealFaviconGenerator](https://realfavicongenerator.net/)
2. 上传你的 logo（建议 SVG 或高分辨率 PNG）
3. 下载生成的图标包
4. 提取 `icon-192.png` 和 `icon-512.png`
5. 替换到 `assets/icons/` 目录

### 图标设计建议

- **简洁明了**：避免复杂细节，小尺寸下清晰可辨
- **品牌色**：使用 `#db7c00`（橙色）作为主色
- **对比度**：确保在深色和浅色背景下都清晰
- **圆角**：iOS 图标使用圆角（squircle）

## 📱 安装到设备

### iOS (iPhone/iPad)

1. 在 Safari 浏览器中打开网址
2. 点击底部工具栏的"分享"按钮（⎋）
3. 选择"添加到主屏幕"
4. 点击右上角"添加"按钮
5. 完成！现在在主屏幕可以看到 TIB OS 图标

### Android (Chrome)

#### 自动安装（推荐）

1. 在 Chrome 浏览器中打开网址
2. 等待地址栏出现"安装应用"图标
3. 点击图标并确认安装

#### 手动安装

1. 点击 Chrome 菜单（⋮）
2. 选择"安装应用"
3. 确认安装

### 桌面端

- Chrome/Edge: 点击地址栏右侧的"安装应用"图标
- Firefox: 点击地址栏右侧的"+"图标
- Safari: 地址栏右侧出现图标时点击

## 🔧 功能特性

### 移动端特性

- **场景化首页**：4 个核心高频场景
  - 📡 市场扫描（P13）
  - ⚡ 事件解读（P3）
  - 🔍 发现股票（P1）
  - 💰 买卖决策（P5）

- **底部导航**：首页、全部功能、个人中心
- **全部功能页**：按使用频率分组展示 15 个 Prompt
- **搜索功能**：快速定位需要的 Prompt
- **全屏模态框**：移动端优化的输入和预览界面

### 桌面端特性

- **完整功能**：所有 15 个 Prompt 可视化展示
- **分类导航**：按 6 大分类筛选
- **版本管理**：保存和加载自定义 Prompt 版本
- **变量配置**：智能识别和替换占位符

### PWA 特性

- **离线支持**：缓存核心资源，无网络时可用
- **自动更新**：检测到新版本时提示刷新
- **独立窗口**：安装后全屏显示
- **添加到主屏幕**：快捷方式访问

## 📊 技术栈

- **HTML5**: 语义化标记
- **CSS3**: Tailwind CSS (CDN)
- **JavaScript**: 原生 ES6+
- **Service Worker**: 离线缓存
- **LocalStorage**: 本地数据存储

**无构建工具，无需 npm，纯前端实现**

## 🌐 部署要求

### 必需

- ✅ **HTTPS**: PWA 必须使用安全连接（localhost 除外）
- ✅ **Valid Manifest**: manifest.json 格式正确
- ✅ **Icon Assets**: 192x192 和 512x512 图标

### 可选

- 📱 **Splash Screen**: 启动画面（192x192 或更大）
- 🔔 **Push Notifications**: 推送通知（需后端支持）
- 🗺 **Share Target**: 分享到应用

## 🔍 测试清单

### 基本功能

- [ ] 桌面端正常显示所有 15 个 Prompt
- [ ] 移动端显示场景化首页
- [ ] 点击 Prompt 打开模态框
- [ ] 输入变量实时更新预览
- [ ] 复制功能正常工作

### PWA 功能

- [ ] Service Worker 成功注册
- [ ] 离线时可以访问缓存页面
- [ ] 安装提示正确显示
- [ ] 安装后全屏显示
- [ ] iOS 和 Android 都可以安装

### 响应式设计

- [ ] 桌面端布局正常
- [ ] 平板布局正常
- [ ] 手机布局正常
- [ ] 横竖屏切换正常

### 兼容性

- [ ] Chrome (最新版)
- [ ] Safari (iOS)
- [ ] Firefox
- [ ] Edge

## 🐛 常见问题

### Q: PWA 无法安装？

**A:** 检查以下几点：
1. 确保使用 HTTPS（localhost 除外）
2. 确保 manifest.json 格式正确
3. 检查浏览器控制台是否有错误
4. 清除浏览器缓存后重试

### Q: 安装后图标不显示？

**A:** 
1. 确保 icon-192.png 和 icon-512.png 文件存在
2. 检查文件大小是否过大（建议 < 500KB）
3. 清除浏览器缓存
4. 卸载后重新安装

### Q: iOS 上无法全屏显示？

**A:** 
1. 确保使用 Safari 浏览器
2. 确保 `<meta name="apple-mobile-web-app-capable" content="yes">` 存在
3. 检查 manifest.json 中 `display: "standalone"`

### Q: 离线无法访问？

**A:** 
1. 检查 Service Worker 是否成功注册（查看控制台）
2. 确保核心资源在缓存列表中
3. 检查 sw.js 是否正确加载
4. 清除缓存并重新加载

### Q: 如何调试 PWA？

**A:** 
1. Chrome DevTools → Application 面板
2. 查看 Service Workers 和 Cache Storage
3. iOS: Safari → Web Inspector

## 📈 性能优化建议

1. **图片优化**: 压缩图标，使用 WebP 格式
2. **代码压缩**: 使用 uglify-js 压缩 JS
3. **CDN 加速**: 使用 CDN 分发静态资源
4. **Gzip 压缩**: 服务器启用 Gzip
5. **懒加载**: 图片和非关键 JS 延迟加载

## 🤝 贡献指南

欢迎贡献！你可以：

1. 报告 Bug
2. 提出新功能建议
3. 提交代码改进
4. 改进文档

## 📄 许可证

本项目仅开源投资逻辑，不构成投资建议。
市场有风险，投资需谨慎。

此项目旨在交流投资思维，仅限个人使用，禁止转售或其他商业使用。

---

**作者**: 勇麦
**抖音**: @勇麦
**邮箱**: evan@yongmai.xyz

---

**享受使用 TIB OS PWA！** 🚀
