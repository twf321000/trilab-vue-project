# Trilab 插件开发文档

## 概述

Trilab 通用三维可视化系统采用插件化架构设计，允许开发者通过插件的方式不断扩展系统功能。所有大屏效果、分析工具、数据可视化等功能都可以通过插件来实现。

## 插件架构

### 核心组件

- **PluginManager** - 插件管理器，负责插件的注册、加载和管理
- **BasePlugin** - 基础插件类，所有插件都应该继承这个类
- **PluginInterface** - 插件接口规范，定义插件开发的标准接口

### 插件目录结构

```
src/plugins/
├── PluginManager.js          # 插件管理器
├── BasePlugin.js             # 基础插件类
├── PluginInterface.js        # 插件接口规范
├── README.md                 # 插件开发文档
├── dashboard/                # 仪表盘插件
│   └── DashboardPlugin.js
├── analytics/                # 分析插件
│   └── AnalyticsPlugin.js
└── examples/                 # 插件示例
    └── ExamplePlugin.js
```

## 快速开始

### 1. 创建插件类

```javascript
// src/plugins/myplugin/MyPlugin.js
import { BasePlugin } from '../BasePlugin.js'

export class MyPlugin extends BasePlugin {
  constructor(config) {
    super({
      id: 'myplugin',
      name: '我的插件',
      description: '这是一个示例插件',
      version: '1.0.0',
      category: 'functional',
      icon: '🔧',
      ...config
    })
    
    // 插件特定属性
    this.myData = []
  }

  async onInitialize() {
    console.log('🔧 初始化我的插件...')
    // 插件初始化逻辑
  }

  async onDestroy() {
    console.log('🧹 销毁我的插件...')
    // 插件销毁逻辑
  }

  async onMapReady(map) {
    console.log('🗺️ 地图就绪，插件可以开始工作')
    // 地图准备就绪时的处理
  }

  // 插件自定义方法
  myCustomMethod(data) {
    console.log('执行自定义方法:', data)
  }
}

export default MyPlugin
```

### 2. 注册插件

插件可以通过两种方式注册：

#### 方式一：自动注册（推荐）

在 `PluginManager.js` 的 `loadPluginConfigFromStorage` 方法中添加插件配置：

```javascript
async loadPluginConfigFromStorage() {
  return [
    // 现有插件配置...
    {
      id: 'myplugin',
      name: '我的插件',
      description: '这是一个示例插件',
      path: 'myplugin/MyPlugin.js',
      enabled: true,
      version: '1.0.0'
    }
  ]
}
```

#### 方式二：手动注册

在应用启动时手动注册插件：

```javascript
import { pluginManager } from './plugins/PluginManager.js'
import MyPlugin from './plugins/myplugin/MyPlugin.js'

// 手动注册插件
await pluginManager.registerPlugin(MyPlugin, {
  id: 'myplugin',
  name: '我的插件',
  enabled: true
})
```

## 插件接口规范

### 必需方法

所有插件必须实现以下方法：

- `initialize()` - 初始化插件
- `destroy()` - 销毁插件

### 可选方法

插件可以选择实现以下方法：

- `activate()` / `deactivate()` - 激活/停用插件
- `onMapReady(map)` - 地图准备就绪时调用
- `onMapDestroy()` - 地图销毁时调用
- `onAppStart()` / `onAppStop()` - 应用启动/关闭时调用
- `getInfo()` - 获取插件信息
- `updateConfig(newConfig)` - 更新配置

### 事件系统

插件可以使用内置的事件系统：

```javascript
// 注册事件监听器
this.on('customEvent', (data) => {
  console.log('收到自定义事件:', data)
})

// 触发事件
this.emit('customEvent', { message: 'Hello World' })

// 移除事件监听器
this.off('customEvent', callback)
```

## 插件类型

### 1. 可视化插件 (Visualization)

提供UI组件和数据可视化功能：

- 仪表盘组件
- 图表组件
- 数据面板
- 实时监控

### 2. 功能插件 (Functional)

提供特定功能：

- 数据分析工具
- 报表生成
- 数据导出
- 权限管理

### 3. 数据插件 (Data)

提供数据源支持：

- API数据源
- 数据库连接
- 实时数据流
- 文件导入

### 4. 工具插件 (Tool)

提供工具功能：

- 测量工具
- 标注工具
- 编辑工具
- 查询工具

### 5. 主题插件 (Theme)

提供主题样式：

- 颜色主题
- 布局样式
- 动画效果
- 响应式设计

### 6. 扩展插件 (Extension)

扩展核心功能：

- 地图图层扩展
- 渲染引擎扩展
- 交互方式扩展

## 插件开发最佳实践

### 1. 遵循单一职责原则

每个插件应该只负责一个特定的功能领域。

### 2. 保持插件独立性

插件之间应该尽量减少依赖，确保可以独立启用和禁用。

### 3. 提供完善的错误处理

```javascript
async onInitialize() {
  try {
    // 插件初始化逻辑
  } catch (error) {
    console.error('插件初始化失败:', error)
    throw error // 重新抛出错误，让插件管理器处理
  }
}
```

### 4. 使用配置驱动

```javascript
constructor(config) {
  super({
    id: 'myplugin',
    name: '我的插件',
    // 默认配置
    defaultSetting: 'value',
    // 合并用户配置
    ...config
  })
}
```

### 5. 提供完善的API文档

```javascript
/**
 * 执行数据分析
 * @param {Object} data - 分析数据
 * @param {Object} options - 分析选项
 * @returns {Promise<Object>} 分析结果
 */
async analyzeData(data, options = {}) {
  // 方法实现
}
```

## 插件配置管理

### 配置结构

```javascript
{
  id: 'plugin-id',           // 必需：插件唯一标识
  name: '插件名称',           // 必需：插件显示名称
  description: '插件描述',     // 可选：插件描述
  version: '1.0.0',          // 必需：插件版本
  enabled: true,              // 可选：是否启用（默认true）
  path: 'plugin/path.js',     // 可选：插件路径
  dependencies: [],          // 可选：依赖项
  icon: '🔧',                // 可选：插件图标
  author: '作者',             // 可选：插件作者
  category: 'functional',     // 可选：插件分类
  permissions: [],           // 可选：权限要求
  settings: {}               // 可选：插件设置
}
```

### 配置验证

插件管理器会自动验证插件配置的完整性。

## 插件生命周期

### 1. 注册阶段

- 插件类被导入
- 插件配置被验证
- 插件实例被创建

### 2. 初始化阶段

- `initialize()` 方法被调用
- 插件资源被加载
- 插件服务被启动

### 3. 运行阶段

- 插件处于活动状态
- 可以响应系统事件
- 可以提供服务API

### 4. 销毁阶段

- `destroy()` 方法被调用
- 插件资源被清理
- 插件服务被停止

## 插件事件系统

### 系统事件

插件可以监听以下系统事件：

- `mapReady` - 地图准备就绪
- `mapDestroy` - 地图销毁
- `appStart` - 应用启动
- `appStop` - 应用关闭
- `dataLoaded` - 数据加载完成
- `dataUpdated` - 数据更新

### 自定义事件

插件可以定义和触发自定义事件。

## 调试和测试

### 调试插件

```javascript
// 在插件开发过程中可以使用console.log进行调试
console.log('插件状态:', this.getInfo())

// 使用浏览器开发者工具查看插件日志
```

### 单元测试

建议为插件编写单元测试：

```javascript
// tests/plugins/MyPlugin.test.js
describe('MyPlugin', () => {
  it('应该正确初始化', async () => {
    const plugin = new MyPlugin({ id: 'test' })
    await plugin.initialize()
    expect(plugin.isInitialized).toBe(true)
  })
})
```

## 插件发布

### 版本管理

遵循语义化版本控制：

- 主版本号：不兼容的API修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正

### 发布流程

1. 更新插件版本号
2. 更新CHANGELOG.md
3. 提交代码到版本控制系统
4. 创建发布标签
5. 更新插件注册配置

## 示例插件

### 简单计数器插件

```javascript
import { BasePlugin } from '../BasePlugin.js'

export class CounterPlugin extends BasePlugin {
  constructor(config) {
    super({
      id: 'counter',
      name: '计数器插件',
      description: '简单的计数器功能',
      version: '1.0.0',
      ...config
    })
    
    this.count = 0
  }

  async onInitialize() {
    console.log('🔢 计数器插件初始化')
  }

  async onDestroy() {
    console.log('🧹 计数器插件销毁')
  }

  increment() {
    this.count++
    this.emit('countChanged', this.count)
    return this.count
  }

  decrement() {
    this.count--
    this.emit('countChanged', this.count)
    return this.count
  }

  reset() {
    this.count = 0
    this.emit('countChanged', this.count)
    return this.count
  }
}
```

## 常见问题

### Q: 插件之间如何通信？
A: 可以通过事件系统或通过插件管理器获取其他插件实例。

### Q: 插件如何访问地图实例？
A: 在 `onMapReady` 方法中接收地图实例，或通过 `window.trilabMap` 全局变量。

### Q: 插件如何添加UI组件？
A: 可以通过Vue组件注册，或直接操作DOM元素。

### Q: 插件如何管理状态？
A: 可以使用Vue的响应式系统，或插件自身的状态管理。

## 技术支持

如有问题，请参考：

- 官方文档：https://threelab.cn/
- 代码仓库：https://github.com/AivoGenX/trilab-vue-project.git
- 问题反馈：创建GitHub Issue

---

**注意：** 本插件系统仍在持续开发中，API可能会有变动，请关注更新日志。