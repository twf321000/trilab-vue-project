/**
 * 引擎管理器
 * 统一管理多引擎的创建、切换和生命周期
 */

import { EngineFactory } from './EngineFactory.js'
import { EngineInterface } from './EngineInterface.js'

export class EngineManager {
  constructor() {
    this.engineFactory = new EngineFactory()
    this.currentEngine = null
    this.config = {
      defaultEngine: EngineInterface.EngineType.TRILAB,
      container: 'map-container',
      engineConfigs: {
        [EngineInterface.EngineType.TRILAB]: {
          // Trilab引擎配置
        },
        [EngineInterface.EngineType.CESIUM]: {
          cesiumBaseUrl: './node_modules/cesium/Build/Cesium/',
          viewerOptions: {
            animation: false,
            timeline: false,
            fullscreenButton: false
          }
        },
        [EngineInterface.EngineType.THREEJS]: {
          backgroundColor: 0x000000,
          camera: {
            position: { x: 0, y: 0, z: 10 }
          }
        }
      }
    }
    
    this.eventListeners = new Map()
    this.plugins = new Map()
  }

  /**
   * 初始化引擎管理器
   * @param {Object} config - 配置对象
   */
  async initialize(config = {}) {
    try {
      // 合并配置
      this.config = { ...this.config, ...config }
      
      // 预加载常用引擎
      await this.engineFactory.preloadEngines([
        EngineInterface.EngineType.TRILAB,
        EngineInterface.EngineType.CESIUM
      ])
      
      // 创建默认引擎
      await this.switchEngine(this.config.defaultEngine)
      
      console.log('✅ 引擎管理器初始化成功')
      return true
    } catch (error) {
      console.error('❌ 引擎管理器初始化失败:', error)
      throw error
    }
  }

  /**
   * 切换引擎
   * @param {string} engineType - 引擎类型
   * @param {Object} config - 引擎配置
   */
  async switchEngine(engineType, config = {}) {
    try {
      // 获取引擎配置
      const engineConfig = {
        container: this.config.container,
        ...this.config.engineConfigs[engineType],
        ...config
      }
      
      // 切换引擎
      const success = await this.engineFactory.switchEngine(engineType, engineConfig)
      
      if (success) {
        this.currentEngine = this.engineFactory.getCurrentEngine()
        
        // 触发引擎切换事件
        this.dispatchEvent('engineChanged', {
          engineType,
          engine: this.currentEngine
        })
        
        // 重新注册插件
        await this.reinitializePlugins()
        
        console.log(`🔄 引擎切换成功: ${engineType}`)
        return true
      }
      
      return false
    } catch (error) {
      console.error(`❌ 引擎切换失败: ${engineType}`, error)
      throw error
    }
  }

  /**
   * 获取当前引擎
   */
  getCurrentEngine() {
    return this.currentEngine
  }

  /**
   * 获取引擎状态
   */
  async getEngineStatus() {
    return await this.engineFactory.getEngineStatus()
  }

  /**
   * 添加插件
   * @param {Object} plugin - 插件实例
   */
  async addPlugin(plugin) {
    try {
      if (!this.currentEngine) {
        throw new Error('当前没有活动的引擎')
      }
      
      // 初始化插件
      await plugin.initialize(this.currentEngine)
      
      this.plugins.set(plugin.id, plugin)
      
      console.log(`✅ 插件添加成功: ${plugin.name}`)
      return true
    } catch (error) {
      console.error('❌ 插件添加失败:', error)
      throw error
    }
  }

  /**
   * 移除插件
   * @param {string} pluginId - 插件ID
   */
  async removePlugin(pluginId) {
    try {
      const plugin = this.plugins.get(pluginId)
      if (!plugin) {
        throw new Error(`插件不存在: ${pluginId}`)
      }
      
      // 销毁插件
      await plugin.destroy()
      
      this.plugins.delete(pluginId)
      
      console.log(`🗑️ 插件移除成功: ${pluginId}`)
      return true
    } catch (error) {
      console.error('❌ 插件移除失败:', error)
      throw error
    }
  }

  /**
   * 重新初始化所有插件
   */
  async reinitializePlugins() {
    for (const [pluginId, plugin] of this.plugins) {
      try {
        await plugin.destroy()
        await plugin.initialize(this.currentEngine)
        console.log(`🔄 插件重新初始化: ${plugin.name}`)
      } catch (error) {
        console.error(`❌ 插件重新初始化失败: ${plugin.name}`, error)
      }
    }
  }

  /**
   * 添加事件监听
   */
  addEventListener(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, [])
    }
    this.eventListeners.get(eventType).push(callback)
  }

  /**
   * 移除事件监听
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
        console.error(`事件处理错误: ${eventType}`, error)
      }
    })
  }

  /**
   * 执行引擎操作（代理方法）
   */
  async executeEngineOperation(operation, ...args) {
    if (!this.currentEngine) {
      throw new Error('当前没有活动的引擎')
    }
    
    if (typeof this.currentEngine[operation] !== 'function') {
      throw new Error(`引擎不支持的操作: ${operation}`)
    }
    
    return await this.currentEngine[operation](...args)
  }

  /**
   * 便捷方法：添加图层
   */
  async addLayer(layerConfig) {
    return await this.executeEngineOperation('addLayer', layerConfig)
  }

  /**
   * 便捷方法：移除图层
   */
  async removeLayer(layerId) {
    return await this.executeEngineOperation('removeLayer', layerId)
  }

  /**
   * 便捷方法：相机操作
   */
  async cameraOperation(operation, amount = 1) {
    return await this.executeEngineOperation('cameraOperation', operation, amount)
  }

  /**
   * 便捷方法：添加模型
   */
  async addModel(modelConfig) {
    return await this.executeEngineOperation('addModel', modelConfig)
  }

  /**
   * 便捷方法：添加标注
   */
  async addMarker(markerConfig) {
    return await this.executeEngineOperation('addMarker', markerConfig)
  }

  /**
   * 便捷方法：截图
   */
  async captureScreenshot(options = {}) {
    return await this.executeEngineOperation('captureScreenshot', options)
  }

  /**
   * 销毁引擎管理器
   */
  async destroy() {
    try {
      // 销毁所有插件
      for (const [pluginId, plugin] of this.plugins) {
        await this.removePlugin(pluginId)
      }
      
      // 销毁引擎工厂
      await this.engineFactory.destroyAll()
      
      // 清理事件监听
      this.eventListeners.clear()
      
      this.currentEngine = null
      
      console.log('✅ 引擎管理器已销毁')
    } catch (error) {
      console.error('❌ 引擎管理器销毁失败:', error)
      throw error
    }
  }

  /**
   * 获取可用引擎列表
   */
  getAvailableEngines() {
    return this.engineFactory.getAvailableEngineTypes()
  }

  /**
   * 检查引擎是否支持
   */
  isEngineSupported(engineType) {
    return this.engineFactory.isEngineSupported(engineType)
  }

  /**
   * 获取插件列表
   */
  getPlugins() {
    return Array.from(this.plugins.values())
  }

  /**
   * 获取插件数量
   */
  getPluginCount() {
    return this.plugins.size
  }
}