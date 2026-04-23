/**
 * 三维引擎工厂类
 * 负责创建和管理不同引擎的实例
 */

import { EngineInterface } from './EngineInterface.js'

// 引擎适配器导入（按需加载）
const engineAdapters = {
  [EngineInterface.EngineType.TRILAB]: () => import('./adapters/TrilabAdapter.js'),
  [EngineInterface.EngineType.CESIUM]: () => import('./adapters/CesiumAdapter.js'),
  [EngineInterface.EngineType.THREEJS]: () => import('./adapters/ThreeJSAdapter.js'),
  [EngineInterface.EngineType.MAPBOX]: () => import('./adapters/MapboxAdapter.js')
}

export class EngineFactory {
  constructor() {
    this.engines = new Map() // 存储已创建的引擎实例
    this.currentEngine = null // 当前使用的引擎
    this.defaultEngineType = EngineInterface.EngineType.TRILAB
  }

  /**
   * 创建引擎实例
   * @param {string} engineType - 引擎类型
   * @param {Object} config - 引擎配置
   * @returns {Promise<EngineInterface>}
   */
  async createEngine(engineType, config = {}) {
    if (!engineAdapters[engineType]) {
      throw new Error(`不支持的引擎类型: ${engineType}`)
    }

    try {
      // 动态导入引擎适配器
      const adapterModule = await engineAdapters[engineType]()
      const AdapterClass = adapterModule.default || adapterModule
      
      // 创建引擎实例
      const engine = new AdapterClass(config)
      
      // 存储引擎实例
      this.engines.set(engineType, engine)
      
      console.log(`✅ 引擎创建成功: ${engineType}`)
      return engine
    } catch (error) {
      console.error(`❌ 引擎创建失败: ${engineType}`, error)
      throw error
    }
  }

  /**
   * 切换当前引擎
   * @param {string} engineType - 目标引擎类型
   * @param {Object} config - 引擎配置
   * @returns {Promise<boolean>}
   */
  async switchEngine(engineType, config = {}) {
    if (this.currentEngine && this.currentEngine.getType() === engineType) {
      console.log(`引擎已经是 ${engineType}，无需切换`)
      return true
    }

    try {
      // 销毁当前引擎
      if (this.currentEngine) {
        await this.currentEngine.destroy()
        console.log(`🗑️ 引擎销毁: ${this.currentEngine.getType()}`)
      }

      // 获取或创建目标引擎
      let targetEngine = this.engines.get(engineType)
      if (!targetEngine) {
        targetEngine = await this.createEngine(engineType, config)
      }

      // 初始化目标引擎
      await targetEngine.initialize(config)
      
      // 更新当前引擎
      this.currentEngine = targetEngine
      
      console.log(`🔄 引擎切换成功: ${engineType}`)
      return true
    } catch (error) {
      console.error(`❌ 引擎切换失败: ${engineType}`, error)
      return false
    }
  }

  /**
   * 获取当前引擎
   * @returns {EngineInterface|null}
   */
  getCurrentEngine() {
    return this.currentEngine
  }

  /**
   * 获取所有可用的引擎类型
   * @returns {string[]}
   */
  getAvailableEngineTypes() {
    return Object.keys(engineAdapters)
  }

  /**
   * 检查引擎是否支持
   * @param {string} engineType - 引擎类型
   * @returns {boolean}
   */
  isEngineSupported(engineType) {
    return !!engineAdapters[engineType]
  }

  /**
   * 获取引擎状态信息
   * @returns {Object}
   */
  async getEngineStatus() {
    if (!this.currentEngine) {
      return {
        currentEngine: null,
        availableEngines: this.getAvailableEngineTypes(),
        status: 'no_engine'
      }
    }

    const engineStatus = await this.currentEngine.getStatus()
    
    return {
      currentEngine: this.currentEngine.getType(),
      availableEngines: this.getAvailableEngineTypes(),
      status: 'running',
      engineStatus
    }
  }

  /**
   * 销毁所有引擎实例
   */
  async destroyAll() {
    for (const [engineType, engine] of this.engines) {
      try {
        await engine.destroy()
        console.log(`🗑️ 引擎销毁: ${engineType}`)
      } catch (error) {
        console.error(`❌ 引擎销毁失败: ${engineType}`, error)
      }
    }
    
    this.engines.clear()
    this.currentEngine = null
    console.log('✅ 所有引擎已销毁')
  }

  /**
   * 预加载引擎适配器（性能优化）
   * @param {string[]} engineTypes - 需要预加载的引擎类型
   */
  async preloadEngines(engineTypes = []) {
    const preloadPromises = engineTypes
      .filter(type => this.isEngineSupported(type))
      .map(type => engineAdapters[type]())
    
    await Promise.all(preloadPromises)
    console.log(`✅ 引擎预加载完成: ${engineTypes.join(', ')}`)
  }
}