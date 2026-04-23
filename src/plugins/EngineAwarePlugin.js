/**
 * 引擎感知插件基类
 * 支持多引擎的插件基础类，所有需要与引擎交互的插件都应该继承这个类
 */

import { EngineInterface } from '../engine/EngineInterface.js'

export class EngineAwarePlugin {
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
    this.engineType = null
    
    // 引擎相关
    this.engine = null
    this.supportedEngines = config.supportedEngines || Object.values(EngineInterface.EngineType)
    
    // 插件依赖
    this.dependencies = config.dependencies || []
    
    // 事件系统
    this.eventListeners = new Map()
    
    console.log(`🔌 创建引擎感知插件: ${this.name} v${this.version}`)
  }

  /**
   * 初始化插件（多引擎版本）
   * @param {EngineInterface} engine - 引擎实例
   */
  async initialize(engine) {
    if (this.isInitialized) {
      console.warn(`⚠️ 插件 ${this.id} 已经初始化`)
      return
    }

    try {
      // 检查引擎支持
      if (!this.isEngineSupported(engine)) {
        throw new Error(`插件 ${this.id} 不支持引擎类型: ${engine.getType()}`)
      }
      
      // 设置引擎
      this.engine = engine
      this.engineType = engine.getType()
      
      // 检查依赖
      await this.checkDependencies()
      
      // 执行初始化逻辑
      await this.onInitialize(engine)
      
      this.isInitialized = true
      this.isActive = true
      
      console.log(`✅ 插件 ${this.id} 初始化成功 (引擎: ${this.engineType})`)
      
    } catch (error) {
      console.error(`❌ 插件 ${this.id} 初始化失败:`, error)
      throw error
    }
  }

  /**
   * 插件初始化逻辑 - 子类重写
   * @param {EngineInterface} engine - 引擎实例
   */
  async onInitialize(engine) {
    // 默认实现，子类应该重写这个方法
    console.log(`🔧 执行插件 ${this.id} 的初始化逻辑 (引擎: ${engine.getType()})`)
  }

  /**
   * 销毁插件
   */
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
      
      // 清理引擎引用
      this.engine = null
      this.engineType = null
      
      this.isInitialized = false
      this.isActive = false
      
      console.log(`✅ 插件 ${this.id} 销毁成功`)
      
    } catch (error) {
      console.error(`❌ 插件 ${this.id} 销毁失败:`, error)
      throw error
    }
  }

  /**
   * 插件销毁逻辑 - 子类重写
   */
  async onDestroy() {
    // 默认实现，子类应该重写这个方法
    console.log(`🧹 执行插件 ${this.id} 的销毁逻辑`)
  }

  /**
   * 激活插件
   */
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

  /**
   * 插件激活逻辑 - 子类重写
   */
  async onActivate() {
    // 默认实现，子类应该重写这个方法
    console.log(`🚀 执行插件 ${this.id} 的激活逻辑`)
  }

  /**
   * 停用插件
   */
  async deactivate() {
    if (!this.isActive) {
      console.warn(`⚠️ 插件 ${this.id} 已经停用`)
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

  /**
   * 插件停用逻辑 - 子类重写
   */
  async onDeactivate() {
    // 默认实现，子类应该重写这个方法
    console.log(`⏸️ 执行插件 ${this.id} 的停用逻辑`)
  }

  /**
   * 检查插件是否支持指定的引擎
   * @param {EngineInterface} engine - 引擎实例
   * @returns {boolean}
   */
  isEngineSupported(engine) {
    return this.supportedEngines.includes(engine.getType())
  }

  /**
   * 检查依赖
   */
  async checkDependencies() {
    if (this.dependencies.length === 0) return
    
    const missingDeps = []
    
    for (const dep of this.dependencies) {
      // 这里可以检查其他插件或引擎功能是否可用
      if (!this.checkDependency(dep)) {
        missingDeps.push(dep)
      }
    }
    
    if (missingDeps.length > 0) {
      throw new Error(`插件 ${this.id} 缺少依赖: ${missingDeps.join(', ')}`)
    }
  }

  /**
   * 检查单个依赖
   */
  checkDependency(dependency) {
    // 默认实现，子类可以重写
    return true
  }

  /**
   * 添加事件监听器
   */
  addEventListener(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, [])
    }
    this.eventListeners.get(eventType).push(callback)
  }

  /**
   * 移除事件监听器
   */
  removeEventListener(eventType, callback) {
    const listeners = this.eventListeners.get(eventType) || []
    const index = listeners.indexOf(callback)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }

  /**
   * 触发事件
   */
  dispatchEvent(eventType, data) {
    const listeners = this.eventListeners.get(eventType) || []
    listeners.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`插件 ${this.id} 事件处理错误: ${eventType}`, error)
      }
    })
  }

  /**
   * 清理事件监听器
   */
  clearEventListeners() {
    this.eventListeners.clear()
  }

  /**
   * 获取插件信息
   */
  getPluginInfo() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      version: this.version,
      enabled: this.enabled,
      isInitialized: this.isInitialized,
      isActive: this.isActive,
      engineType: this.engineType,
      supportedEngines: this.supportedEngines,
      dependencies: this.dependencies
    }
  }

  /**
   * 引擎切换时的回调（可选）
   * @param {string} newEngineType - 新引擎类型
   * @param {EngineInterface} newEngine - 新引擎实例
   */
  async onEngineChanged(newEngineType, newEngine) {
    // 默认实现，子类可以重写
    console.log(`🔄 插件 ${this.id} 收到引擎切换通知: ${this.engineType} -> ${newEngineType}`)
    
    // 如果插件支持新引擎，可以自动重新初始化
    if (this.supportedEngines.includes(newEngineType)) {
      console.log(`🔄 插件 ${this.id} 正在重新初始化以适应新引擎`)
      await this.destroy()
      await this.initialize(newEngine)
    }
  }

  /**
   * 便捷方法：通过引擎添加图层
   */
  async addLayer(layerConfig) {
    if (!this.engine) {
      throw new Error('插件未绑定引擎')
    }
    return await this.engine.addLayer(layerConfig)
  }

  /**
   * 便捷方法：通过引擎添加模型
   */
  async addModel(modelConfig) {
    if (!this.engine) {
      throw new Error('插件未绑定引擎')
    }
    return await this.engine.addModel(modelConfig)
  }

  /**
   * 便捷方法：通过引擎添加标注
   */
  async addMarker(markerConfig) {
    if (!this.engine) {
      throw new Error('插件未绑定引擎')
    }
    return await this.engine.addMarker(markerConfig)
  }

  /**
   * 便捷方法：执行相机操作
   */
  async cameraOperation(operation, amount = 1) {
    if (!this.engine) {
      throw new Error('插件未绑定引擎')
    }
    return await this.engine.cameraOperation(operation, amount)
  }

  /**
   * 便捷方法：截图
   */
  async captureScreenshot(options = {}) {
    if (!this.engine) {
      throw new Error('插件未绑定引擎')
    }
    return await this.engine.captureScreenshot(options)
  }

  /**
   * 便捷方法：开始测量
   */
  async startMeasurement(type, callback) {
    if (!this.engine) {
      throw new Error('插件未绑定引擎')
    }
    return await this.engine.startMeasurement(type, callback)
  }

  /**
   * 便捷方法：停止测量
   */
  async stopMeasurement() {
    if (!this.engine) {
      throw new Error('插件未绑定引擎')
    }
    return await this.engine.stopMeasurement()
  }
}