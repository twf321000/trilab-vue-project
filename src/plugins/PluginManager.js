// 插件管理器 - 负责插件的注册、加载和管理

class PluginManager {
  constructor() {
    this.plugins = new Map()
    this.pluginConfigs = new Map()
    this.pluginComponents = new Map() // 存储插件提供的组件
    this.isInitialized = false
  }

  // 初始化插件管理器
  async initialize() {
    if (this.isInitialized) return
    
    console.log('🚀 初始化插件管理器...')
    
    // 加载插件配置
    await this.loadPluginConfigs()
    
    // 自动加载已启用的插件
    await this.loadEnabledPlugins()
    
    this.isInitialized = true
    console.log('✅ 插件管理器初始化完成')
  }

  // 加载插件配置
  async loadPluginConfigs() {
    try {
      // 这里可以从本地存储或API加载插件配置
      const configs = await this.loadPluginConfigFromStorage()
      configs.forEach(config => {
        this.pluginConfigs.set(config.id, config)
      })
    } catch (error) {
      console.warn('⚠️ 加载插件配置失败:', error)
    }
  }

  // 加载已启用的插件
  async loadEnabledPlugins() {
    const enabledPlugins = Array.from(this.pluginConfigs.values())
      .filter(config => config.enabled)
      
    for (const config of enabledPlugins) {
      await this.loadPlugin(config)
    }
  }

  // 注册插件
  async registerPlugin(pluginClass, config) {
    const pluginId = config.id || pluginClass.name.toLowerCase()
    
    if (this.plugins.has(pluginId)) {
      console.warn(`⚠️ 插件 ${pluginId} 已存在，跳过注册`)
      return
    }

    try {
      // 创建插件实例
      const plugin = new pluginClass(config)
      
      // 验证插件是否符合接口规范
      if (!this.validatePlugin(plugin)) {
        throw new Error(`插件 ${pluginId} 不符合接口规范`)
      }

      // 存储插件实例
      this.plugins.set(pluginId, plugin)
      
      // 存储插件配置
      this.pluginConfigs.set(pluginId, {
        ...config,
        id: pluginId,
        enabled: config.enabled !== false
      })

      console.log(`✅ 插件 ${pluginId} 注册成功`)
      
      // 如果插件已启用，则初始化
      if (config.enabled !== false) {
        await this.initializePlugin(pluginId)
      }
      
    } catch (error) {
      console.error(`❌ 注册插件 ${pluginId} 失败:`, error)
      throw error
    }
  }

  // 加载插件
  async loadPlugin(config) {
    try {
      console.log(`📦 加载插件: ${config.name}`)
      
      // 根据路径动态导入插件类
      const pluginClass = await this.importPluginClass(config.path)
      
      if (!pluginClass) {
        throw new Error(`无法导入插件类: ${config.path}`)
      }
      
      // 注册插件
      await this.registerPlugin(pluginClass, config)
      
    } catch (error) {
      console.error(`❌ 加载插件 ${config.name} 失败:`, error)
    }
  }

  // 导入插件类
  async importPluginClass(path) {
    try {
      console.log(`🔗 导入插件类: ${path}`)
      
      // 根据路径动态导入插件类
      const modulePath = `./${path}`
      console.log(`🔍 尝试导入模块路径: ${modulePath}`)
      
      // 使用动态导入（添加vite忽略注释）
      const module = await import(/* @vite-ignore */ modulePath)
      console.log(`✅ 成功导入模块:`, module)
      
      // 返回插件类（默认导出或命名导出）
      const pluginClass = module.default || module
      console.log(`✅ 获取到插件类:`, pluginClass)
      
      if (typeof pluginClass !== 'function') {
        console.error(`❌ 插件类不是构造函数:`, typeof pluginClass)
        return null
      }
      
      return pluginClass
      
    } catch (error) {
      console.error(`❌ 导入插件类失败:`, error)
      console.error('❌ 详细错误信息:', error.stack)
      return null
    }
  }

  // 初始化插件
  async initializePlugin(pluginId) {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`插件 ${pluginId} 不存在`)
    }

    try {
      await plugin.initialize()
      console.log(`✅ 插件 ${pluginId} 初始化成功`)
    } catch (error) {
      console.error(`❌ 插件 ${pluginId} 初始化失败:`, error)
      throw error
    }
  }

  // 启用插件
  async enablePlugin(pluginId) {
    const config = this.pluginConfigs.get(pluginId)
    if (!config) {
      throw new Error(`插件 ${pluginId} 配置不存在`)
    }

    config.enabled = true
    
    if (!this.plugins.has(pluginId)) {
      await this.loadPlugin(config)
    } else {
      await this.initializePlugin(pluginId)
    }

    console.log(`✅ 插件 ${pluginId} 已启用`)
  }

  // 禁用插件
  async disablePlugin(pluginId) {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) return

    try {
      await plugin.destroy()
      this.plugins.delete(pluginId)
      
      const config = this.pluginConfigs.get(pluginId)
      if (config) {
        config.enabled = false
      }

      console.log(`✅ 插件 ${pluginId} 已禁用`)
    } catch (error) {
      console.error(`❌ 禁用插件 ${pluginId} 失败:`, error)
    }
  }

  // 获取插件实例
  getPlugin(pluginId) {
    return this.plugins.get(pluginId)
  }

  // 获取所有插件列表
  getPlugins() {
    return Array.from(this.plugins.values())
  }

  // 获取插件配置
  getPluginConfig(pluginId) {
    return this.pluginConfigs.get(pluginId)
  }

  // 注册插件组件
  registerPluginComponents(pluginId, components) {
    if (!components || typeof components !== 'object') {
      console.warn(`⚠️ 插件 ${pluginId} 提供的组件无效`)
      return
    }
    
    this.pluginComponents.set(pluginId, components)
    console.log(`✅ 插件 ${pluginId} 组件注册成功:`, Object.keys(components))
  }

  // 获取插件组件
  getPluginComponents(pluginId) {
    return this.pluginComponents.get(pluginId)
  }

  // 获取所有插件的组件
  getAllPluginComponents() {
    const allComponents = {}
    for (const [pluginId, components] of this.pluginComponents) {
      allComponents[pluginId] = components
    }
    return allComponents
  }

  // 渲染插件组件到指定容器
  async renderPluginComponents(pluginId, container) {
    const components = this.getPluginComponents(pluginId)
    if (!components) {
      console.warn(`⚠️ 插件 ${pluginId} 没有可渲染的组件`)
      return null
    }

    const { createApp } = await import('vue')
    const appInstances = {}

    for (const [componentName, component] of Object.entries(components)) {
      try {
        // 创建子容器
        const subContainer = document.createElement('div')
        subContainer.className = `plugin-${pluginId}-${componentName}`
        container.appendChild(subContainer)

        // 创建Vue应用实例
        const app = createApp(component)
        app.mount(subContainer)
        
        appInstances[componentName] = {
          app,
          container: subContainer
        }
        
        console.log(`✅ 插件 ${pluginId} 组件 ${componentName} 渲染成功`)
      } catch (error) {
        console.error(`❌ 渲染插件 ${pluginId} 组件 ${componentName} 失败:`, error)
      }
    }

    return appInstances
  }

  // 验证插件接口规范
  validatePlugin(plugin) {
    const requiredMethods = ['initialize', 'destroy']
    const optionalMethods = ['onMapReady', 'onMapDestroy']
    
    for (const method of requiredMethods) {
      if (typeof plugin[method] !== 'function') {
        return false
      }
    }
    
    return true
  }

  // 从存储加载插件配置
  async loadPluginConfigFromStorage() {
    // 默认插件配置
    return [
      {
        id: 'dashboard',
        name: '仪表盘插件',
        description: '提供数据可视化仪表盘功能',
        path: 'dashboard/DashboardPlugin.js',
        enabled: true,
        version: '1.0.0'
      },
      {
        id: 'analytics',
        name: '分析插件',
        description: '提供数据分析功能',
        path: 'analytics/AnalyticsPlugin.js',
        enabled: true,
        version: '1.0.0'
      },
      {
        id: 'report',
        name: '报表插件',
        description: '提供报表生成功能',
        path: 'report/ReportPlugin.js',
        enabled: false,
        version: '1.0.0'
      }
    ]
  }

  // 保存插件配置到存储
  async savePluginConfigs() {
    // 这里可以保存到本地存储或API
    const configs = Array.from(this.pluginConfigs.values())
    console.log('💾 保存插件配置:', configs)
  }

  // 销毁插件管理器
  async destroy() {
    for (const [pluginId, plugin] of this.plugins) {
      try {
        await plugin.destroy()
      } catch (error) {
        console.error(`❌ 销毁插件 ${pluginId} 失败:`, error)
      }
    }
    
    this.plugins.clear()
    this.pluginConfigs.clear()
    this.isInitialized = false
    
    console.log('✅ 插件管理器已销毁')
  }
}

// 创建全局插件管理器实例
export const pluginManager = new PluginManager()

export default PluginManager