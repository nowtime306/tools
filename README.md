# YouTube 缩略图下载工具

一个使用 React.js 开发的 YouTube 缩略图下载工具网站，支持下载各种尺寸的缩略图。

## 功能特性

- ✅ 支持多种 YouTube URL 格式
- ✅ 提供 5 种不同尺寸的缩略图：
  - 默认 (120x90)
  - 中等质量 (320x180)
  - 高质量 (480x360)
  - 标准清晰度 (640x480)
  - 最大分辨率 (1280x720)
- ✅ 一键下载功能
- ✅ 响应式设计，支持移动端
- ✅ 现代化 UI 设计

## 安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 使用方法

1. 在输入框中粘贴 YouTube 视频链接
2. 点击"获取缩略图"按钮
3. 选择想要下载的缩略图尺寸
4. 点击"下载图片"按钮保存到本地

## 支持的 URL 格式

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`

## 技术栈

- React 18
- Vite
- 纯 CSS（无第三方 UI 库）

## 许可证

MIT
