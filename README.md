# trilab-vue-project: 基于插件化架构的Trilab三维可视化通用框架

![Trilab Logo](src/assets/images/logo.png)
![Trilab ](public/assets/1.png)

## 🚀 核心特性：插件化架构设计

**Trilab通用三维可视化框架采用先进的插件化架构**，为三维大屏、园区展示等应用场景提供高度可扩展的解决方案。所有功能模块都以插件形式组织，支持"积木式"开发模式。

### 🏗️ 插件化架构优势

- **模块化开发**：每个功能独立封装为插件，便于团队协作
- **热插拔支持**：插件可动态加载/卸载，不影响核心系统
- **标准化接口**：统一的插件开发规范，降低学习成本
- **高度可扩展**：新功能通过插件方式快速集成
- **性能优化**：轻量级设计，对三维渲染性能无影响

### 📦 插件类型支持

| 插件类型 | 功能描述 | 示例插件 |
|---------|---------|----------|
| **可视化插件** | 数据可视化、UI组件 | 仪表盘插件 |
| **功能插件** | 特定功能、工具 | 分析插件 |
| **数据插件** | 数据源、API集成 | 实时数据插件 |
| **工具插件** | 测量、标注、编辑 | 测量工具插件 |
| **主题插件** | 样式、主题、动画 | 主题切换插件 |
| **扩展插件** | 核心功能扩展 | 渲染引擎插件 |

## 项目介绍

Trilab 通用三维可视化框架是基于Trilab三维引擎平台开发的**插件化应用系统**，提供完整的插件化架构和基础功能模板。可在该框架上快速开发各类三维大屏、园区展示等应用，支持功能模块的灵活组合和扩展。

- **项目地址**: [https://github.com/AivoGenX/trilab-vue-project.git](https://github.com/AivoGenX/trilab-vue-project.git)
- **官网地址**: [https://threelab.cn/](https://threelab.cn/)
![Trilab ](public/assets/2.png)
## 项目特性

- **最新技术栈**：使用 Vue3/Vite 等前端前沿技术开发
- **TypeScript支持**：应用程序级 JavaScript 的语言
- **模块化设计**：采用组件化架构，便于功能扩展和维护
- **三维可视化**：集成Trilab三维引擎，支持高性能三维渲染
- **响应式设计**：适配不同屏幕尺寸和设备

## 🏗️ 技术架构：插件化设计

### 核心架构设计

**Trilab框架采用分层插件化架构**，确保系统的可扩展性和可维护性：

```
应用层 (Application)
├── 插件管理器 (PluginManager)
├── 插件接口规范 (PluginInterface)
└── 基础插件类 (BasePlugin)

插件层 (Plugins)
├── 可视化插件 (Visualization)
│   ├── 仪表盘插件 (Dashboard)
│   └── 数据可视化插件
├── 功能插件 (Functional)
│   ├── 分析插件 (Analytics)
│   └── 报表插件
├── 工具插件 (Tools)
│   ├── 测量工具插件
│   └── 标注工具插件
└── 扩展插件 (Extension)
    ├── 主题插件
    └── 渲染引擎插件

核心层 (Core)
├── 三维引擎集成 (Trilab Engine)
├── Vue 3应用框架
└── 基础UI组件
```

### 技术选型

- **Vue 3 + Composition API**：现代化前端框架，完美支持插件化开发
- **Vite**：下一代前端构建工具，支持插件热重载
- **Trilab Engine**：专业的三维可视化引擎，插件化集成
- **插件管理系统**：自定义插件管理器，支持动态加载
- **Three.js**：底层3D图形库支持
- **TypeScript**：类型安全的JavaScript，提升插件开发质量

### 主要目录说明

```
trilab-vue-project
└───src                 主要项目代码
│   └───plugins         插件系统（核心）
│       └───PluginManager.js         插件管理器
│       └───BasePlugin.js            基础插件类
│       └───PluginInterface.js       插件接口规范
│       └───dashboard/               仪表盘插件
│           └───DashboardPlugin.js   插件主文件
│           └───DashboardButton.vue   插件按钮组件
│           └───DashboardPanel.vue    插件面板组件
│       └───analytics/               分析插件
│           └───AnalyticsPlugin.js
│       └───README.md                插件开发文档
│   └───components      核心组件（系统基础功能）
│       └───AppHeader.vue           应用头部组件
│       └───BasemapSwitcherButton.vue 底图切换按钮
│       └───BasemapSwitcherPanel.vue  底图切换面板
│       └───LayerManagerButton.vue   图层管理按钮
│       └───LayerManagerPanel.vue    图层管理面板
│       └───MapControls.vue           地图控制组件
│       └───ToolsManagerButton.vue    工具管理按钮
│       └───ToolsManagerPanel.vue     工具管理面板
│   └───assets          静态资源
│   └───App.vue         主应用组件（集成插件系统）
│   └───main.js         应用入口
│   └───TriLab.js       Trilab引擎封装
│
└───public              静态资源
└───build               构建脚本
└───package.json       项目配置信息
└───vite.config.js     Vite 配置文件
```

## 功能特性

### 三维地图功能

- **多源底图支持**：高德地图、卫星影像、MapBox地形等
- **图层管理**：支持图层显示/隐藏、透明度调节
- **测量工具**：点坐标、线距离、面面积、高度、角度测量
- **地图控制**：缩放、平移、全屏、指北针等
- **交互操作**：鼠标、触摸手势支持

### 界面组件

- **应用头部**：Logo、菜单导航、用户信息
- **底图切换器**：多种地图样式切换
- **图层管理器**：图层控制面板
- **工具管理器**：测量工具面板
- **地图控制器**：地图操作控件

## 快速开始

### 环境要求

- Node.js 18+ 版本
- npm 或 yarn 包管理器
- 现代浏览器（推荐 Chrome 90+）

### 下载运行项目

1. **下载代码**

```bash
# 克隆项目
git clone https://github.com/AivoGenX/trilab-vue-project.git

# 进入项目目录
cd trilab-vue-project
```

2. **安装依赖**

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用国内镜像（推荐）
npm install --registry=https://registry.npmmirror.com
```

3. **启动开发环境**

```bash
npm run dev
```

4. **编译构建**

```bash
# 生产环境构建
npm run build

# 预览构建结果
npm run preview
```

### 浏览器支持

| 浏览器 | 支持版本 |
|--------|----------|
| Chrome | 90+      |
| Firefox | 最新版本 |
| Safari | 最新版本 |
| Edge | 最新版本 |

## 功能演示

### 基础地图功能

- 高德电子地图显示
- 高德卫星影像
- MapBox地形数据
- 多种地图样式切换

### 图层管理

- 图层显示/隐藏控制
- 图层透明度调节
- 图层搜索功能
- 批量图层操作

### 测量工具

- **点坐标测量**：获取地理坐标信息
- **线距离测量**：测量两点间距离
- **面面积测量**：测量多边形区域面积
- **高度测量**：测量高程信息
- **角度测量**：测量角度值

### 地图控制

- 缩放控制按钮
- 平移操作
- 全屏显示
- 指北针指示
- 操作指南

## 🔌 插件开发指南

### 插件化开发优势

**为什么选择插件化开发？**

- **快速迭代**：新功能通过插件方式快速集成，不影响现有系统
- **团队协作**：不同团队可以并行开发不同插件
- **质量保证**：插件独立测试，降低系统风险
- **复用性强**：插件可在多个项目中复用
- **维护简单**：问题定位和修复更加精准

### 快速创建插件

#### 1. 创建插件类

```javascript
// src/plugins/myplugin/MyPlugin.js
import { BasePlugin } from '../BasePlugin.js'

export class MyPlugin extends BasePlugin {
  constructor(config) {
    super({
      id: 'myplugin',
      name: '我的插件',
      description: '示例插件',
      version: '1.0.0',
      ...config
    })
  }

  async onInitialize() {
    console.log('🔧 初始化我的插件')
  }

  async onDestroy() {
    console.log('🧹 销毁我的插件')
  }
}
```

#### 2. 注册插件

在 `PluginManager.js` 中添加插件配置：

```javascript
{
  id: 'myplugin',
  name: '我的插件',
  path: 'myplugin/MyPlugin.js',
  enabled: true
}
```

#### 3. 插件自动加载

系统启动时自动加载所有启用的插件，无需手动配置。

### 插件开发最佳实践

1. **遵循单一职责原则**：每个插件只负责一个特定功能
2. **保持插件独立性**：减少插件间依赖
3. **提供完善文档**：为插件编写清晰的API文档
4. **进行单元测试**：确保插件质量
5. **版本管理**：遵循语义化版本控制

### 插件类型示例

#### 可视化插件（数据大屏）
```javascript
class DashboardPlugin extends BasePlugin {
  // 数据可视化、图表展示等功能
}
```

#### 功能插件（园区监控）
```javascript
class CampusMonitorPlugin extends BasePlugin {
  // 园区设备监控、报警处理等功能
}
```

#### 工具插件（测量工具）
```javascript
class MeasurementPlugin extends BasePlugin {
  // 距离测量、面积计算等功能
}
```

### 详细开发文档

更多插件开发细节请参考：[插件开发文档](src/plugins/README.md)

## 项目结构说明

项目采用**插件化架构设计**，核心功能与插件功能分离：

- **`src/components/`**：系统核心组件（基础功能）
- **`src/plugins/`**：插件系统（扩展功能）

### 核心组件

- **AppHeader.vue**：应用头部组件
- **BasemapSwitcher***：底图切换相关组件
- **LayerManager***：图层管理相关组件
- **ToolsManager***：工具管理相关组件
- **MapControls.vue**：地图控制组件

### Trilab引擎集成

项目通过 `src/TriLab.js` 文件集成Trilab三维引擎，插件可以访问引擎实例：

```javascript
async onMapReady(map) {
  // 插件可以访问三维地图实例
  this.map = map
}
```

## 配置说明

### 环境配置

项目支持多环境配置：

- `.env.development`：开发环境配置
- `.env.production`：生产环境配置

### 地图配置

地图相关配置在组件内部管理，支持：

- 地图中心点设置
- 缩放级别配置
- 地图控件配置
- 图层参数设置

## 常见问题

### Q: 如何添加新的底图类型？

A: 在 `BasemapSwitcherPanel.vue` 组件中添加新的底图配置，并实现相应的图层创建逻辑。

### Q: 如何扩展测量工具？

A: 在 `ToolsManagerPanel.vue` 组件中添加新的测量功能，并集成到Trilab引擎中。

### Q: 项目支持移动端吗？

A: 项目采用响应式设计，支持移动端访问，但部分功能在移动端可能需要优化。

## 贡献指南

欢迎提交问题和改进建议：

1. 提交Issue报告问题
2. 提交Pull Request贡献代码
3. 完善文档和示例

## 许可证

本项目基于MIT许可证开源。

## 联系方式

- **项目主页**: [https://github.com/AivoGenX/trilab-vue-project.git](https://github.com/AivoGenX/trilab-vue-project.git)
- **官网地址**: [https://threelab.cn/](https://threelab.cn/)
- **问题反馈**: [GitHub Issues](https://github.com/AivoGenX/trilab-vue-project/issues)
- **邮箱联系**: [项目维护团队邮箱]

---

**Trilab三维可视化平台** - 让三维可视化更简单！