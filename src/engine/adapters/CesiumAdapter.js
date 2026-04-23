/**
 * Cesium引擎适配器
 * 封装Cesium引擎的具体实现
 */

import { EngineInterface } from '../EngineInterface.js'

export class CesiumAdapter extends EngineInterface {
  constructor(config = {}) {
    super()
    this.config = config
    this.viewer = null
    this.container = null
    this.isInitialized = false
    this.eventListeners = new Map()
    this.layers = new Map()
    this.models = new Map()
    this.markers = new Map()
  }

  /**
   * 获取引擎类型
   */
  getType() {
    return EngineInterface.EngineType.CESIUM
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

      // 动态导入Cesium
      const Cesium = await import('cesium')
      
      // 配置Cesium资源路径
      window.CESIUM_BASE_URL = this.config.cesiumBaseUrl || './node_modules/cesium/Build/Cesium/'
      
      // 创建Cesium Viewer
      this.viewer = new Cesium.Viewer(this.container, {
        terrainProvider: Cesium.createWorldTerrain(),
        animation: false,
        timeline: false,
        fullscreenButton: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        geocoder: false,
        ...this.config.viewerOptions
      })
      
      // 配置相机
      if (this.config.camera) {
        this.viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            this.config.camera.position.x || 116.3974,
            this.config.camera.position.y || 39.9093,
            this.config.camera.position.z || 10000000
          )
        })
      }
      
      this.isInitialized = true
      console.log('✅ Cesium引擎初始化成功')
      
      return true
    } catch (error) {
      console.error('❌ Cesium引擎初始化失败:', error)
      throw error
    }
  }

  /**
   * 销毁引擎
   */
  async destroy() {
    if (this.viewer) {
      try {
        this.viewer.destroy()
        this.viewer = null
      } catch (error) {
        console.error('Cesium引擎销毁失败:', error)
      }
    }
    
    // 清理资源
    this.layers.clear()
    this.models.clear()
    this.markers.clear()
    this.eventListeners.clear()
    this.isInitialized = false
    
    console.log('🗑️ Cesium引擎已销毁')
  }

  /**
   * 添加图层
   */
  async addLayer(layerConfig) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      const Cesium = await import('cesium')
      const layerId = `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      let layer
      
      switch (layerConfig.type) {
        case 'tile':
          layer = this.viewer.imageryLayers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
              url: layerConfig.url,
              ...layerConfig.options
            })
          )
          break
          
        case 'vector':
          // Cesium中矢量数据通常通过GeoJSON或CZML加载
          const dataSource = await Cesium.GeoJsonDataSource.load(layerConfig.url, {
            stroke: Cesium.Color.fromCssColorString(layerConfig.strokeColor || '#ffffff'),
            fill: Cesium.Color.fromCssColorString(layerConfig.fillColor || '#ffffff'),
            strokeWidth: layerConfig.strokeWidth || 2,
            markerSymbol: layerConfig.markerSymbol || '?'
          })
          await this.viewer.dataSources.add(dataSource)
          layer = dataSource
          break
          
        default:
          throw new Error(`不支持的图层类型: ${layerConfig.type}`)
      }
      
      this.layers.set(layerId, layer)
      console.log(`✅ Cesium图层添加成功: ${layerId}`)
      return layerId
    } catch (error) {
      console.error('❌ Cesium图层添加失败:', error)
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
      const layer = this.layers.get(layerId)
      if (!layer) {
        throw new Error(`图层不存在: ${layerId}`)
      }
      
      if (layer instanceof Cesium.ImageryLayer) {
        this.viewer.imageryLayers.remove(layer)
      } else if (layer instanceof Cesium.GeoJsonDataSource) {
        this.viewer.dataSources.remove(layer)
      }
      
      this.layers.delete(layerId)
      console.log(`🗑️ Cesium图层移除成功: ${layerId}`)
    } catch (error) {
      console.error('❌ Cesium图层移除失败:', error)
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
      const layer = this.layers.get(layerId)
      if (!layer) {
        throw new Error(`图层不存在: ${layerId}`)
      }
      
      if (layer instanceof Cesium.ImageryLayer) {
        layer.show = visible
      } else if (layer instanceof Cesium.GeoJsonDataSource) {
        layer.show = visible
      }
      
      console.log(`👁️ Cesium图层可见性设置: ${layerId} -> ${visible}`)
    } catch (error) {
      console.error('❌ Cesium图层可见性设置失败:', error)
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
      const layer = this.layers.get(layerId)
      if (!layer) {
        throw new Error(`图层不存在: ${layerId}`)
      }
      
      if (layer instanceof Cesium.ImageryLayer) {
        layer.alpha = opacity
      }
      
      console.log(`🎨 Cesium图层透明度设置: ${layerId} -> ${opacity}`)
    } catch (error) {
      console.error('❌ Cesium图层透明度设置失败:', error)
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
      const Cesium = await import('cesium')
      
      switch (operation) {
        case EngineInterface.CameraOperation.ZOOM_IN:
          this.viewer.camera.zoomIn(this.viewer.camera.positionCartographic.height * 0.2)
          break
        case EngineInterface.CameraOperation.ZOOM_OUT:
          this.viewer.camera.zoomOut(this.viewer.camera.positionCartographic.height * 0.2)
          break
        case EngineInterface.CameraOperation.ROTATE_LEFT:
          this.viewer.camera.rotateLeft(Cesium.Math.toRadians(5 * amount))
          break
        case EngineInterface.CameraOperation.ROTATE_RIGHT:
          this.viewer.camera.rotateRight(Cesium.Math.toRadians(5 * amount))
          break
        case EngineInterface.CameraOperation.PAN_UP:
          this.viewer.camera.moveUp(10000 * amount)
          break
        case EngineInterface.CameraOperation.PAN_DOWN:
          this.viewer.camera.moveDown(10000 * amount)
          break
        case EngineInterface.CameraOperation.RESET:
          this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(116.3974, 39.9093, 10000000)
          })
          break
        default:
          throw new Error(`不支持的相机操作: ${operation}`)
      }
      
      console.log(`📷 Cesium相机操作执行: ${operation} (${amount})`)
    } catch (error) {
      console.error('❌ Cesium相机操作失败:', error)
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
      const Cesium = await import('cesium')
      
      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          position.x || 116.3974,
          position.y || 39.9093,
          position.z || 10000000
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: Cesium.Math.toRadians(0)
        }
      })
      
      console.log('📷 Cesium相机位置设置成功')
    } catch (error) {
      console.error('❌ Cesium相机位置设置失败:', error)
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
      const Cesium = await import('cesium')
      const position = this.viewer.camera.positionCartographic
      
      return {
        position: {
          longitude: Cesium.Math.toDegrees(position.longitude),
          latitude: Cesium.Math.toDegrees(position.latitude),
          height: position.height
        },
        heading: Cesium.Math.toDegrees(this.viewer.camera.heading),
        pitch: Cesium.Math.toDegrees(this.viewer.camera.pitch),
        roll: Cesium.Math.toDegrees(this.viewer.camera.roll)
      }
    } catch (error) {
      console.error('❌ 获取Cesium相机信息失败:', error)
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
      const Cesium = await import('cesium')
      const modelId = `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const position = Cesium.Cartesian3.fromDegrees(
        modelConfig.position.longitude || 116.3974,
        modelConfig.position.latitude || 39.9093,
        modelConfig.position.height || 0
      )
      
      const model = this.viewer.entities.add({
        id: modelId,
        position: position,
        model: {
          uri: modelConfig.url,
          scale: modelConfig.scale || 1.0,
          minimumPixelSize: modelConfig.minimumPixelSize || 128,
          maximumScale: modelConfig.maximumScale || 20000
        }
      })
      
      this.models.set(modelId, model)
      console.log(`✅ Cesium模型添加成功: ${modelId}`)
      return modelId
    } catch (error) {
      console.error('❌ Cesium模型添加失败:', error)
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
      const model = this.models.get(modelId)
      if (!model) {
        throw new Error(`模型不存在: ${modelId}`)
      }
      
      this.viewer.entities.remove(model)
      this.models.delete(modelId)
      console.log(`🗑️ Cesium模型移除成功: ${modelId}`)
    } catch (error) {
      console.error('❌ Cesium模型移除失败:', error)
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
      const Cesium = await import('cesium')
      const markerId = `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const position = Cesium.Cartesian3.fromDegrees(
        markerConfig.position.longitude || 116.3974,
        markerConfig.position.latitude || 39.9093,
        markerConfig.position.height || 0
      )
      
      const marker = this.viewer.entities.add({
        id: markerId,
        position: position,
        billboard: {
          image: markerConfig.icon || './assets/marker.png',
          scale: markerConfig.scale || 1.0,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        },
        label: {
          text: markerConfig.text || '',
          font: '14pt sans-serif',
          pixelOffset: new Cesium.Cartesian2(0, -40)
        }
      })
      
      this.markers.set(markerId, marker)
      console.log(`📍 Cesium标注点添加成功: ${markerId}`)
      return markerId
    } catch (error) {
      console.error('❌ Cesium标注点添加失败:', error)
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
      const marker = this.markers.get(markerId)
      if (!marker) {
        throw new Error(`标注点不存在: ${markerId}`)
      }
      
      this.viewer.entities.remove(marker)
      this.markers.delete(markerId)
      console.log(`🗑️ Cesium标注点移除成功: ${markerId}`)
    } catch (error) {
      console.error('❌ Cesium标注点移除失败:', error)
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
      
      // Cesium事件处理
      switch (eventType) {
        case 'click':
          this.viewer.screenSpaceEventHandler.setInputAction((event) => {
            const pickedObject = this.viewer.scene.pick(event.position)
            callback(pickedObject, event)
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
          break
        case 'hover':
          this.viewer.screenSpaceEventHandler.setInputAction((event) => {
            const pickedObject = this.viewer.scene.pick(event.endPosition)
            callback(pickedObject, event)
          }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
          break
        default:
          console.warn(`Cesium暂不支持的事件类型: ${eventType}`)
      }
      
      console.log(`👂 Cesium事件监听添加: ${eventType}`)
    } catch (error) {
      console.error('❌ Cesium事件监听添加失败:', error)
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
      
      // 移除Cesium事件处理器
      this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      
      console.log(`👂 Cesium事件监听移除: ${eventType}`)
    } catch (error) {
      console.error('❌ Cesium事件监听移除失败:', error)
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
      const Cesium = await import('cesium')
      const position = this.viewer.camera.positionCartographic
      
      return {
        initialized: true,
        type: this.getType(),
        camera: {
          longitude: Cesium.Math.toDegrees(position.longitude),
          latitude: Cesium.Math.toDegrees(position.latitude),
          height: position.height
        },
        layers: this.layers.size,
        models: this.models.size,
        markers: this.markers.size,
        fps: this.viewer.scene.frameState.fps
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
      const canvas = this.viewer.scene.canvas
      return canvas.toDataURL(options.format || 'image/png', options.quality || 0.92)
    } catch (error) {
      console.error('❌ Cesium截图失败:', error)
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
      // Cesium测量功能需要额外实现
      console.warn('Cesium测量功能需要额外实现')
      callback(null, { type, message: '测量功能待实现' })
    } catch (error) {
      console.error('❌ Cesium测量功能启动失败:', error)
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
      console.log('📏 Cesium停止测量')
    } catch (error) {
      console.error('❌ Cesium测量功能停止失败:', error)
      throw error
    }
  }
}