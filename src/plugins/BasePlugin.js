// 基础插件类 - 所有插件都应该继承这个类

export class BasePlugin {
  constructor(config = {}) {
    this.id = config.id || this.constructor.name.toLowerCase()
    this.name = config.name || this.id
    this.description = config.description || ''
    this.version = config.version || '1.0.0'
    this.enabled = config.enabled !== false
    this.config = config
    
    // 插件状态
    this.isInitialized = false
    this.isActive = false
    
    // 插件依赖
    this.dependencies = config.dependencies || []
    
    // 事件系统
    this.eventListeners = new Map()
    
    console.log(`🔌 创建插件实例: ${this.name} v${this.version}`)
  }

  // 初始化插件 - 必须实现
  async initialize() {
    if (this.isInitialized) {
      console.warn(`⚠️ 插件 ${this.id} 已经初始化`)
      return
    }

    try {
      // 检查依赖
      await this.checkDependencies()
      
      // 执行初始化逻辑
      await this.onInitialize()
      
      this.isInitialized = true
      this.isActive = true
      
      console.log(`✅ 插件 ${this.id} 初始化成功`)
      
    } catch (error) {
      console.error(`❌ 插件 ${this.id} 初始化失败:`, error)
      throw error
    }
  }

  // 插件初始化逻辑 - 子类重写
  async onInitialize() {
    // 默认实现，子类应该重写这个方法
    console.log(`🔧 执行插件 ${this.id} 的初始化逻辑`)
  }

  // 销毁插件 - 必须实现
  async destroy() {
    if (!this.isInitialized) {
      console.warn(`⚠️ 插件 ${this.id} 未初始化，无需销毁`)
      return
    }

    try {
      // 执行销毁逻辑
      await this.onDestroy()
      
      // 清理事件监听器
      this.clearEventListeners()
      
      this.isInitialized = false
      this.isActive = false
      
      console.log(`✅ 插件 ${this.id} 销毁成功`)
      
    } catch (error) {
      console.error(`❌ 插件 ${this.id} 销毁失败:`, error)
      throw error
    }
  }

  // 插件销毁逻辑 - 子类重写
  async onDestroy() {
    // 默认实现，子类应该重写这个方法
    console.log(`🧹 执行插件 ${this.id} 的销毁逻辑`)
  }

  // 激活插件
  async activate() {
    if (this.isActive) {
      console.warn(`⚠️ 插件 ${this.id} 已经激活`)
      return
    }

    try {
      await this.onActivate()
      this.isActive = true
      console.log(`✅ 插件 ${this.id} 激活成功`)
    } catch (error) {
      console.error(`❌ 插件 ${this.id} 激活失败:`, error)
      throw error
    }
  }

  // 插件激活逻辑 - 子类重写
  async onActivate() {
    // 默认实现，子类应该重写这个方法
    console.log(`🎯 执行插件 ${this.id} 的激活逻辑`)
  }

  // 停用插件
  async deactivate() {
    if (!this.isActive) {
      console.warn(`⚠️ 插件 ${this.id} 未激活`)
      return
    }

    try {
      await this.onDeactivate()
      this.isActive = false
      console.log(`✅ 插件 ${this.id} 停用成功`)
    } catch (error) {
      console.error(`❌ 插件 ${this.id} 停用失败:`, error)
      throw error
    }
  }

  // 插件停用逻辑 - 子类重写
  async onDeactivate() {
    // 默认实现，子类应该重写这个方法
    console.log(`⏸️ 执行插件 ${this.id} 的停用逻辑`)
  }

  // 检查依赖
  async checkDependencies() {
    if (this.dependencies.length === 0) return
    
    console.log(`🔍 检查插件 ${this.id} 的依赖项...`)
    
    for (const dep of this.dependencies) {
      // 这里可以检查其他插件或库的依赖
      console.log(`  依赖项: ${dep}`)
    }
  }

  // 事件系统
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event).push(callback)
  }

  off(event, callback) {
    if (!this.eventListeners.has(event)) return
    
    const listeners = this.eventListeners.get(event)
    const index = listeners.indexOf(callback)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }

  emit(event, data) {
    if (!this.eventListeners.has(event)) return
    
    const listeners = this.eventListeners.get(event)
    listeners.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`❌ 插件 ${this.id} 事件处理错误:`, error)
      }
    })
  }

  clearEventListeners() {
    this.eventListeners.clear()
  }

  // 获取插件信息
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      version: this.version,
      enabled: this.enabled,
      isInitialized: this.isInitialized,
      isActive: this.isActive,
      dependencies: this.dependencies
    }
  }

  // 更新配置
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig }
    console.log(`⚙️ 插件 ${this.id} 配置已更新`)
  }

  // 生命周期钩子 - 子类可以重写
  
  // 地图准备就绪时调用
  async onMapReady(map) {
    console.log(`🗺️ 插件 ${this.id} 收到地图就绪事件`)
  }

  // 地图销毁时调用
  async onMapDestroy() {
    console.log(`🗑️ 插件 ${this.id} 收到地图销毁事件`)
  }

  // 应用启动时调用
  async onAppStart() {
    console.log(`🚀 插件 ${this.id} 收到应用启动事件`)
  }

  // 应用关闭时调用
  async onAppStop() {
    console.log(`🛑 插件 ${this.id} 收到应用关闭事件`)
  }
}

export default BasePlugin