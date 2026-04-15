// 仪表盘插件 - 使用插槽式组件注册
import { BasePlugin } from '../BasePlugin.js'

class DashboardPlugin extends BasePlugin {
  constructor(config) {
    super({
      id: 'dashboard',
      name: '仪表盘插件',
      description: '提供数据可视化仪表盘功能',
      version: '1.0.0',
      category: 'visualization',
      icon: '📊',
      ...config
    })
    
    this.isInitialized = false
    this.components = null
  }

  async onInitialize() {
    console.log('🔧 开始初始化仪表盘插件...')
    
    try {
      // 动态导入Vue组件
      const { default: DashboardButton } = await import('./DashboardButton.vue')
      const { default: DashboardPanel } = await import('./DashboardPanel.vue')
      
      // 注册组件到插件管理器
      this.components = {
        button: DashboardButton,
        panel: DashboardPanel
      }
      
      // 通知插件管理器注册组件
      if (window.pluginManager) {
        window.pluginManager.registerPluginComponents(this.id, this.components)
      }
      
      this.isInitialized = true
      console.log('✅ 仪表盘插件初始化完成')
    } catch (error) {
      console.error('❌ 仪表盘插件初始化失败:', error)
      throw error
    }
  }

  // 获取插件提供的组件
  getComponents() {
    return this.components
  }

  // 获取组件配置（位置、样式等）
  getComponentConfig() {
    return {
      button: {
        position: 'left',
        top: 180,
        left: 20,
        zIndex: 1000
      },
      panel: {
        position: 'left',
        top: 180,
        left: 20,
        zIndex: 1000
      }
    }
  }

  async onDestroy() {
    console.log('🧹 销毁仪表盘插件...')
    this.components = null
    this.isInitialized = false
    console.log('✅ 仪表盘插件销毁完成')
  }

  async onMapReady(map) {
    console.log('🗺️ 仪表盘插件收到地图就绪事件')
    
    // 可以在这里添加地图相关的仪表盘功能
  }

  async onActivate() {
    console.log('🎯 激活仪表盘插件')
  }

  async onDeactivate() {
    console.log('⏸️ 停用仪表盘插件')
  }
}

// 默认导出
export default DashboardPlugin

// 命名导出
export { DashboardPlugin }