/**
 * Trilab引擎适配器
 * 封装Trilab引擎的具体实现
 */

import { EngineInterface } from '../EngineInterface.js'

export class TrilabAdapter extends EngineInterface {
  constructor(config = {}) {
    super()
    this.config = config
    this.engine = null
    this.container = null
    this.isInitialized = false
    this.eventListeners = new Map()
  }

  /**
   * 获取引擎类型
   */
  getType() {
    return EngineInterface.EngineType.TRILAB
  }

  /**
   * 初始化引擎
   */
  async initialize(config) {
    try {
      // 合并配置
      this.config = { ...this.config, ...config }
      
      // 获取容器元素
      this.container = typeof this.config.container === 'string' 
        ? document.getElementById(this.config.container)
        : this.config.container
      
      if (!this.container) {
        throw new Error('未找到容器元素')
      }

      // 动态导入Trilab引擎
      const TrilabEngine = await import('../TriLab.js')
      
      // 创建引擎实例
      this.engine = new TrilabEngine(this.config)
      
      // 初始化引擎
      await this.engine.init()
      
      this.isInitialized = true
      console.log('✅ Trilab引擎初始化成功')
      
      return true
    } catch (error) {
      console.error('❌ Trilab引擎初始化失败:', error)
      throw error
    }
  }

  /**
   * 销毁引擎
   */
  async destroy() {
    if (this.engine) {
      try {
        await this.engine.destroy()
        this.engine = null
      } catch (error) {
        console.error('Trilab引擎销毁失败:', error)
      }
    }
    
    // 清理事件监听
    this.eventListeners.clear()
    this.isInitialized = false
    
    console.log('🗑️ Trilab引擎已销毁')
  }

  /**
   * 添加图层
   */
  async addLayer(layerConfig) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      const layerId = await this.engine.addLayer(layerConfig)
      console.log(`✅ 图层添加成功: ${layerId}`)
      return layerId
    } catch (error) {
      console.error('❌ 图层添加失败:', error)
      throw error
    }
  }

  /**
   * 移除图层
   */
  async removeLayer(layerId) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      await this.engine.removeLayer(layerId)
      console.log(`🗑️ 图层移除成功: ${layerId}`)
    } catch (error) {
      console.error('❌ 图层移除失败:', error)
      throw error
    }
  }

  /**
   * 设置图层可见性
   */
  async setLayerVisibility(layerId, visible) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      await this.engine.setLayerVisibility(layerId, visible)
      console.log(`👁️ 图层可见性设置: ${layerId} -> ${visible}`)
    } catch (error) {
      console.error('❌ 图层可见性设置失败:', error)
      throw error
    }
  }

  /**
   * 设置图层透明度
   */
  async setLayerOpacity(layerId, opacity) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      await this.engine.setLayerOpacity(layerId, opacity)
      console.log(`🎨 图层透明度设置: ${layerId} -> ${opacity}`)
    } catch (error) {
      console.error('❌ 图层透明度设置失败:', error)
      throw error
    }
  }

  /**
   * 相机操作
   */
  async cameraOperation(operation, amount = 1) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      switch (operation) {
        case EngineInterface.CameraOperation.ZOOM_IN:
          await this.engine.zoomIn(amount)
          break
        case EngineInterface.CameraOperation.ZOOM_OUT:
          await this.engine.zoomOut(amount)
          break
        case EngineInterface.CameraOperation.ROTATE_LEFT:
          await this.engine.rotateLeft(amount)
          break
        case EngineInterface.CameraOperation.ROTATE_RIGHT:
          await this.engine.rotateRight(amount)
          break
        case EngineInterface.CameraOperation.PAN_UP:
          await this.engine.panUp(amount)
          break
        case EngineInterface.CameraOperation.PAN_DOWN:
          await this.engine.panDown(amount)
          break
        case EngineInterface.CameraOperation.RESET:
          await this.engine.resetCamera()
          break
        default:
          throw new Error(`不支持的相机操作: ${operation}`)
      }
      
      console.log(`📷 相机操作执行: ${operation} (${amount})`)
    } catch (error) {
      console.error('❌ 相机操作失败:', error)
      throw error
    }
  }

  /**
   * 设置相机位置
   */
  async setCamera(position, target) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      await this.engine.setCamera(position, target)
      console.log('📷 相机位置设置成功')
    } catch (error) {
      console.error('❌ 相机位置设置失败:', error)
      throw error
    }
  }

  /**
   * 获取相机信息
   */
  async getCameraInfo() {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      return await this.engine.getCameraInfo()
    } catch (error) {
      console.error('❌ 获取相机信息失败:', error)
      throw error
    }
  }

  /**
   * 添加三维模型
   */
  async addModel(modelConfig) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      const modelId = await this.engine.addModel(modelConfig)
      console.log(`✅ 模型添加成功: ${modelId}`)
      return modelId
    } catch (error) {
      console.error('❌ 模型添加失败:', error)
      throw error
    }
  }

  /**
   * 移除三维模型
   */
  async removeModel(modelId) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      await this.engine.removeModel(modelId)
      console.log(`🗑️ 模型移除成功: ${modelId}`)
    } catch (error) {
      console.error('❌ 模型移除失败:', error)
      throw error
    }
  }

  /**
   * 添加标注点
   */
  async addMarker(markerConfig) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      const markerId = await this.engine.addMarker(markerConfig)
      console.log(`📍 标注点添加成功: ${markerId}`)
      return markerId
    } catch (error) {
      console.error('❌ 标注点添加失败:', error)
      throw error
    }
  }

  /**
   * 移除标注点
   */
  async removeMarker(markerId) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      await this.engine.removeMarker(markerId)
      console.log(`🗑️ 标注点移除成功: ${markerId}`)
    } catch (error) {
      console.error('❌ 标注点移除失败:', error)
      throw error
    }
  }

  /**
   * 添加事件监听
   */
  async addEventListener(eventType, callback) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      if (!this.eventListeners.has(eventType)) {
        this.eventListeners.set(eventType, [])
      }
      
      this.eventListeners.get(eventType).push(callback)
      await this.engine.addEventListener(eventType, callback)
      
      console.log(`👂 事件监听添加: ${eventType}`)
    } catch (error) {
      console.error('❌ 事件监听添加失败:', error)
      throw error
    }
  }

  /**
   * 移除事件监听
   */
  async removeEventListener(eventType, callback) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      const listeners = this.eventListeners.get(eventType) || []
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
      
      await this.engine.removeEventListener(eventType, callback)
      console.log(`👂 事件监听移除: ${eventType}`)
    } catch (error) {
      console.error('❌ 事件监听移除失败:', error)
      throw error
    }
  }

  /**
   * 获取引擎状态
   */
  async getStatus() {
    if (!this.isInitialized) {
      return {
        initialized: false,
        type: this.getType(),
        error: '引擎未初始化'
      }
    }

    try {
      const engineStatus = await this.engine.getStatus()
      return {
        initialized: true,
        type: this.getType(),
        ...engineStatus
      }
    } catch (error) {
      return {
        initialized: false,
        type: this.getType(),
        error: error.message
      }
    }
  }

  /**
   * 截图功能
   */
  async captureScreenshot(options = {}) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      const screenshot = await this.engine.captureScreenshot(options)
      console.log('📸 截图成功')
      return screenshot
    } catch (error) {
      console.error('❌ 截图失败:', error)
      throw error
    }
  }

  /**
   * 测量功能
   */
  async startMeasurement(type, callback) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      await this.engine.startMeasurement(type, callback)
      console.log(`📏 开始测量: ${type}`)
    } catch (error) {
      console.error('❌ 测量功能启动失败:', error)
      throw error
    }
  }

  /**
   * 停止测量
   */
  async stopMeasurement() {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      await this.engine.stopMeasurement()
      console.log('📏 停止测量')
    } catch (error) {
      console.error('❌ 测量功能停止失败:', error)
      throw error
    }
  }
}