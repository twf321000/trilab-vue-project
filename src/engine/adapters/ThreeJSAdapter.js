/**
 * Three.js引擎适配器
 * 封装Three.js引擎的具体实现
 */

import { EngineInterface } from '../EngineInterface.js'

export class ThreeJSAdapter extends EngineInterface {
  constructor(config = {}) {
    super()
    this.config = config
    this.scene = null
    this.camera = null
    this.renderer = null
    this.container = null
    this.isInitialized = false
    this.eventListeners = new Map()
    this.layers = new Map()
    this.models = new Map()
    this.markers = new Map()
    this.animationId = null
  }

  /**
   * 获取引擎类型
   */
  getType() {
    return EngineInterface.EngineType.THREEJS
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

      // 动态导入Three.js
      const THREE = await import('three')
      
      // 创建场景
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(this.config.backgroundColor || 0x000000)
      
      // 创建相机
      const aspect = this.container.clientWidth / this.container.clientHeight
      this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
      
      // 设置相机位置
      this.camera.position.set(
        this.config.camera?.position?.x || 0,
        this.config.camera?.position?.y || 0,
        this.config.camera?.position?.z || 10
      )
      
      if (this.config.camera?.target) {
        this.camera.lookAt(
          this.config.camera.target.x || 0,
          this.config.camera.target.y || 0,
          this.config.camera.target.z || 0
        )
      }
      
      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: this.config.renderer?.antialias !== false,
        alpha: this.config.renderer?.alpha || false
      })
      
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.container.appendChild(this.renderer.domElement)
      
      // 添加光源
      this.addDefaultLights()
      
      // 开始渲染循环
      this.startAnimation()
      
      // 添加窗口大小变化监听
      window.addEventListener('resize', () => this.handleResize())
      
      this.isInitialized = true
      console.log('✅ Three.js引擎初始化成功')
      
      return true
    } catch (error) {
      console.error('❌ Three.js引擎初始化失败:', error)
      throw error
    }
  }

  /**
   * 添加默认光源
   */
  addDefaultLights() {
    const THREE = this.getTHREE()
    
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    this.scene.add(ambientLight)
    
    // 方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(50, 50, 50)
    this.scene.add(directionalLight)
  }

  /**
   * 开始动画循环
   */
  startAnimation() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      this.renderer.render(this.scene, this.camera)
    }
    animate()
  }

  /**
   * 处理窗口大小变化
   */
  handleResize() {
    if (!this.isInitialized) return
    
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  /**
   * 获取Three.js实例
   */
  getTHREE() {
    if (!window.THREE) {
      throw new Error('Three.js未加载')
    }
    return window.THREE
  }

  /**
   * 销毁引擎
   */
  async destroy() {
    // 停止动画循环
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    
    // 移除渲染器
    if (this.renderer && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
      this.renderer.dispose()
      this.renderer = null
    }
    
    // 清理场景
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      this.scene = null
    }
    
    // 清理资源
    this.layers.clear()
    this.models.clear()
    this.markers.clear()
    this.eventListeners.clear()
    this.isInitialized = false
    
    console.log('🗑️ Three.js引擎已销毁')
  }

  /**
   * 添加图层
   */
  async addLayer(layerConfig) {
    if (!this.isInitialized) {
      throw new Error('引擎未初始化')
    }

    try {
      const THREE = this.getTHREE()
      const layerId = `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      let layerGroup = new THREE.Group()
      layerGroup.name = layerConfig.name || layerId
      
      // 根据图层类型创建内容
      switch (layerConfig.type) {
        case 'grid':
          // 创建网格地面
          const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x888888)
          layerGroup.add(gridHelper)
          break
          
        case 'terrain':
          // 创建简单地形（示例）
          const geometry = new THREE.PlaneGeometry(10, 10, 10, 10)
          const material = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00,
            wireframe: true 
          })
          const plane = new THREE.Mesh(geometry, material)
          plane.rotation.x = -Math.PI / 2
          layerGroup.add(plane)
          break
          
        default:
          console.warn(`不支持的Three.js图层类型: ${layerConfig.type}`)
      }
      
      this.scene.add(layerGroup)
      this.layers.set(layerId, layerGroup)
      console.log(`✅ Three.js图层添加成功: ${layerId}`)
      return layerId
    } catch (error) {
      console.error('❌ Three.js图层添加失败:', error)
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
      
      this.scene.remove(layer)
      this.layers.delete(layerId)
      console.log(`🗑️ Three.js图层移除成功: ${layerId}`)
    } catch (error) {
      console.error('❌ Three.js图层移除失败:', error)
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
      
      layer.visible = visible
      console.log(`👁️ Three.js图层可见性设置: ${layerId} -> ${visible}`)
    } catch (error) {
      console.error('❌ Three.js图层可见性设置失败:', error)
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
      
      layer.traverse((object) => {
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => {
              material.transparent = true
              material.opacity = opacity
            })
          } else {
            object.material.transparent = true
            object.material.opacity = opacity
          }
        }
      })
      
      console.log(`🎨 Three.js图层透明度设置: ${layerId} -> ${opacity}`)
    } catch (error) {
      console.error('❌ Three.js图层透明度设置失败:', error)
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
          this.camera.position.z -= amount * 0.5
          break
        case EngineInterface.CameraOperation.ZOOM_OUT:
          this.camera.position.z += amount * 0.5
          break
        case EngineInterface.CameraOperation.ROTATE_LEFT:
          this.camera.rotation.y += amount * 0.1
          break
        case EngineInterface.CameraOperation.ROTATE_RIGHT:
          this.camera.rotation.y -= amount * 0.1
          break
        case EngineInterface.CameraOperation.PAN_UP:
          this.camera.position.y += amount * 0.5
          break
        case EngineInterface.CameraOperation.PAN_DOWN:
          this.camera.position.y -= amount * 0.5
          break
        case EngineInterface.CameraOperation.RESET:
          this.camera.position.set(0, 0, 10)
          this.camera.rotation.set(0, 0, 0)
          break
        default:
          throw new Error(`不支持的相机操作: ${operation}`)
      }
      
      console.log(`📷 Three.js相机操作执行: ${operation} (${amount})`)
    } catch (error) {
      console.error('❌ Three.js相机操作失败:', error)
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
      this.camera.position.set(
        position.x || 0,
        position.y || 0,
        position.z || 10
      )
      
      if (target) {
        this.camera.lookAt(
          target.x || 0,
          target.y || 0,
          target.z || 0
        )
      }
      
      console.log('📷 Three.js相机位置设置成功')
    } catch (error) {
      console.error('❌ Three.js相机位置设置失败:', error)
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
      return {
        position: {
          x: this.camera.position.x,
          y: this.camera.position.y,
          z: this.camera.position.z
        },
        rotation: {
          x: this.camera.rotation.x,
          y: this.camera.rotation.y,
          z: this.camera.rotation.z
        }
      }
    } catch (error) {
      console.error('❌ 获取Three.js相机信息失败:', error)
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
      const THREE = this.getTHREE()
      const modelId = `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // 创建简单几何体作为模型（实际项目中应该使用GLTFLoader等）
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshStandardMaterial({ 
        color: modelConfig.color || 0xff0000 
      })
      
      const model = new THREE.Mesh(geometry, material)
      model.position.set(
        modelConfig.position?.x || 0,
        modelConfig.position?.y || 0,
        modelConfig.position?.z || 0
      )
      
      this.scene.add(model)
      this.models.set(modelId, model)
      console.log(`✅ Three.js模型添加成功: ${modelId}`)
      return modelId
    } catch (error) {
      console.error('❌ Three.js模型添加失败:', error)
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
      
      this.scene.remove(model)
      this.models.delete(modelId)
      console.log(`🗑️ Three.js模型移除成功: ${modelId}`)
    } catch (error) {
      console.error('❌ Three.js模型移除失败:', error)
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
      const THREE = this.getTHREE()
      const markerId = `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // 创建球体作为标注点
      const geometry = new THREE.SphereGeometry(0.1, 8, 8)
      const material = new THREE.MeshBasicMaterial({ 
        color: markerConfig.color || 0xffff00 
      })
      
      const marker = new THREE.Mesh(geometry, material)
      marker.position.set(
        markerConfig.position?.x || 0,
        markerConfig.position?.y || 0,
        markerConfig.position?.z || 0
      )
      
      this.scene.add(marker)
      this.markers.set(markerId, marker)
      console.log(`📍 Three.js标注点添加成功: ${markerId}`)
      return markerId
    } catch (error) {
      console.error('❌ Three.js标注点添加失败:', error)
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
      
      this.scene.remove(marker)
      this.markers.delete(markerId)
      console.log(`🗑️ Three.js标注点移除成功: ${markerId}`)
    } catch (error) {
      console.error('❌ Three.js标注点移除失败:', error)
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
      
      // Three.js事件处理需要额外实现（如射线检测）
      console.warn('Three.js事件监听需要额外实现射线检测')
      
      console.log(`👂 Three.js事件监听添加: ${eventType}`)
    } catch (error) {
      console.error('❌ Three.js事件监听添加失败:', error)
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
      
      console.log(`👂 Three.js事件监听移除: ${eventType}`)
    } catch (error) {
      console.error('❌ Three.js事件监听移除失败:', error)
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
      return {
        initialized: true,
        type: this.getType(),
        camera: {
          position: {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
          }
        },
        layers: this.layers.size,
        models: this.models.size,
        markers: this.markers.size,
        memory: this.renderer.info.memory
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
      return this.renderer.domElement.toDataURL(options.format || 'image/png', options.quality || 0.92)
    } catch (error) {
      console.error('❌ Three.js截图失败:', error)
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
      // Three.js测量功能需要额外实现
      console.warn('Three.js测量功能需要额外实现')
      callback(null, { type, message: '测量功能待实现' })
    } catch (error) {
      console.error('❌ Three.js测量功能启动失败:', error)
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
      console.log('📏 Three.js停止测量')
    } catch (error) {
      console.error('❌ Three.js测量功能停止失败:', error)
      throw error
    }
  }
}