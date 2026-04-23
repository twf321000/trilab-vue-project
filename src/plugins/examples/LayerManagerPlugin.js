/**
 * 图层管理器插件示例
 * 演示如何开发支持多引擎的插件
 */

import { EngineAwarePlugin } from '../EngineAwarePlugin.js'
import { EngineInterface } from '../../engine/EngineInterface.js'

export class LayerManagerPlugin extends EngineAwarePlugin {
  constructor(config = {}) {
    super({
      id: 'layer-manager',
      name: '图层管理器',
      description: '统一的多引擎图层管理插件',
      version: '1.0.0',
      supportedEngines: [
        EngineInterface.EngineType.TRILAB,
        EngineInterface.EngineType.CESIUM,
        EngineInterface.EngineType.THREEJS
      ],
      ...config
    })
    
    // 图层管理相关
    this.layers = new Map()
    this.layerGroups = new Map()
    this.currentLayerGroup = 'default'
    
    // UI组件引用
    this.uiComponent = null
  }

  /**
   * 插件初始化逻辑
   */
  async onInitialize(engine) {
    console.log(`🔧 图层管理器插件初始化 (引擎: ${engine.getType()})`)
    
    // 根据引擎类型执行特定的初始化逻辑
    switch (engine.getType()) {
      case EngineInterface.EngineType.TRILAB:
        await this.initializeForTrilab(engine)
        break
      case EngineInterface.EngineType.CESIUM:
        await this.initializeForCesium(engine)
        break
      case EngineInterface.EngineType.THREEJS:
        await this.initializeForThreeJS(engine)
        break
      default:
        console.warn(`图层管理器插件暂不支持引擎类型: ${engine.getType()}`)
    }
    
    // 加载默认图层配置
    await this.loadDefaultLayers()
    
    // 注册UI组件
    await this.registerUIComponent()
    
    console.log('✅ 图层管理器插件初始化完成')
  }

  /**
   * Trilab引擎特定的初始化
   */
  async initializeForTrilab(engine) {
    console.log('🔧 执行Trilab引擎特定的图层管理器初始化')
    
    // Trilab引擎的图层管理逻辑
    // 这里可以添加Trilab特有的图层处理代码
  }

  /**
   * Cesium引擎特定的初始化
   */
  async initializeForCesium(engine) {
    console.log('🔧 执行Cesium引擎特定的图层管理器初始化')
    
    // Cesium引擎的图层管理逻辑
    // 这里可以添加Cesium特有的图层处理代码
  }

  /**
   * Three.js引擎特定的初始化
   */
  async initializeForThreeJS(engine) {
    console.log('🔧 执行Three.js引擎特定的图层管理器初始化')
    
    // Three.js引擎的图层管理逻辑
    // 这里可以添加Three.js特有的图层处理代码
  }

  /**
   * 加载默认图层
   */
  async loadDefaultLayers() {
    const defaultLayers = this.config.defaultLayers || [
      {
        id: 'base-map',
        name: '底图',
        type: 'tile',
        url: this.getDefaultTileUrl(),
        visible: true,
        opacity: 1.0
      }
    ]
    
    for (const layerConfig of defaultLayers) {
      await this.addLayer(layerConfig)
    }
  }

  /**
   * 获取默认瓦片URL（根据引擎类型）
   */
  getDefaultTileUrl() {
    switch (this.engineType) {
      case EngineInterface.EngineType.CESIUM:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      case EngineInterface.EngineType.TRILAB:
        return this.config.tileUrl || './assets/tiles/{z}/{x}/{y}.png'
      case EngineInterface.EngineType.THREEJS:
        // Three.js通常不使用瓦片地图
        return null
      default:
        return null
    }
  }

  /**
   * 注册UI组件
   */
  async registerUIComponent() {
    try {
      // 动态导入UI组件
      const { default: LayerManagerUI } = await import('../ui/LayerManagerUI.vue')
      
      // 创建UI组件实例
      this.uiComponent = {
        component: LayerManagerUI,
        props: {
          plugin: this,
          layers: Array.from(this.layers.values())
        }
      }
      
      // 通知应用注册UI组件
      this.dispatchEvent('uiComponentReady', {
        componentId: `${this.id}-ui`,
        component: this.uiComponent
      })
      
      console.log('✅ 图层管理器UI组件注册成功')
    } catch (error) {
      console.error('❌ 图层管理器UI组件注册失败:', error)
    }
  }

  /**
   * 添加图层（重写基类方法）
   */
  async addLayer(layerConfig) {
    if (!this.engine) {
      throw new Error('插件未绑定引擎')
    }

    try {
      // 调用引擎的添加图层方法
      const layerId = await this.engine.addLayer(layerConfig)
      
      // 存储图层信息
      this.layers.set(layerId, {
        id: layerId,
        ...layerConfig,
        engineType: this.engineType
      })
      
      // 添加到当前图层组
      if (!this.layerGroups.has(this.currentLayerGroup)) {
        this.layerGroups.set(this.currentLayerGroup, [])
      }
      this.layerGroups.get(this.currentLayerGroup).push(layerId)
      
      // 触发图层添加事件
      this.dispatchEvent('layerAdded', {
        layerId,
        layerConfig
      })
      
      console.log(`✅ 图层添加成功: ${layerId}`)
      return layerId
    } catch (error) {
      console.error('❌ 图层添加失败:', error)
      throw error
    }
  }

  /**
   * 移除图层（重写基类方法）
   */
  async removeLayer(layerId) {
    if (!this.engine) {
      throw new Error('插件未绑定引擎')
    }

    try {
      // 调用引擎的移除图层方法
      await this.engine.removeLayer(layerId)
      
      // 从图层管理中移除
      this.layers.delete(layerId)
      
      // 从所有图层组中移除
      for (const [groupName, layerIds] of this.layerGroups) {
        const index = layerIds.indexOf(layerId)
        if (index > -1) {
          layerIds.splice(index, 1)
        }
      }
      
      // 触发图层移除事件
      this.dispatchEvent('layerRemoved', {
        layerId
      })
      
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
    if (!this.engine) {
      throw new Error('插件未绑定引擎')
    }

    try {
      await this.engine.setLayerVisibility(layerId, visible)
      
      // 更新图层状态
      const layer = this.layers.get(layerId)
      if (layer) {
        layer.visible = visible
      }
      
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
    if (!this.engine) {
      throw new Error('插件未绑定引擎')
    }

    try {
      await this.engine.setLayerOpacity(layerId, opacity)
      
      // 更新图层状态
      const layer = this.layers.get(layerId)
      if (layer) {
        layer.opacity = opacity
      }
      
      console.log(`🎨 图层透明度设置: ${layerId} -> ${opacity}`)
    } catch (error) {
      console.error('❌ 图层透明度设置失败:', error)
      throw error
    }
  }

  /**
   * 创建图层组
   */
  createLayerGroup(groupName) {
    if (!this.layerGroups.has(groupName)) {
      this.layerGroups.set(groupName, [])
      console.log(`📁 创建图层组: ${groupName}`)
    }
    return groupName
  }

  /**
   * 切换当前图层组
   */
  switchLayerGroup(groupName) {
    if (this.layerGroups.has(groupName)) {
      this.currentLayerGroup = groupName
      console.log(`🔄 切换到图层组: ${groupName}`)
    } else {
      console.warn(`图层组不存在: ${groupName}`)
    }
  }

  /**
   * 获取所有图层
   */
  getAllLayers() {
    return Array.from(this.layers.values())
  }

  /**
   * 获取图层组列表
   */
  getLayerGroups() {
    return Array.from(this.layerGroups.keys())
  }

  /**
   * 获取当前图层组的图层
   */
  getCurrentGroupLayers() {
    const layerIds = this.layerGroups.get(this.currentLayerGroup) || []
    return layerIds.map(id => this.layers.get(id)).filter(Boolean)
  }

  /**
   * 插件销毁逻辑
   */
  async onDestroy() {
    console.log('🧹 执行图层管理器插件的销毁逻辑')
    
    // 清理所有图层
    for (const layerId of this.layers.keys()) {
      try {
        await this.removeLayer(layerId)
      } catch (error) {
        console.error(`清理图层失败: ${layerId}`, error)
      }
    }
    
    // 清理图层组
    this.layerGroups.clear()
    
    // 清理UI组件引用
    this.uiComponent = null
    
    console.log('✅ 图层管理器插件销毁完成')
  }

  /**
   * 引擎切换时的回调
   */
  async onEngineChanged(newEngineType, newEngine) {
    console.log(`🔄 图层管理器插件收到引擎切换通知: ${this.engineType} -> ${newEngineType}`)
    
    // 保存当前图层配置
    const currentLayers = this.getAllLayers()
    
    // 销毁当前插件实例
    await this.destroy()
    
    // 使用新引擎重新初始化
    await this.initialize(newEngine)
    
    // 重新加载之前的图层
    for (const layerConfig of currentLayers) {
      try {
        await this.addLayer(layerConfig)
      } catch (error) {
        console.error(`重新加载图层失败: ${layerConfig.id}`, error)
      }
    }
    
    console.log('✅ 图层管理器插件引擎切换完成')
  }

  /**
   * 导出图层配置
   */
  exportLayerConfig() {
    return {
      layers: this.getAllLayers(),
      layerGroups: Object.fromEntries(this.layerGroups),
      currentLayerGroup: this.currentLayerGroup,
      engineType: this.engineType
    }
  }

  /**
   * 导入图层配置
   */
  async importLayerConfig(config) {
    try {
      // 清理现有图层
      for (const layerId of this.layers.keys()) {
        await this.removeLayer(layerId)
      }
      
      // 导入图层组
      this.layerGroups.clear()
      for (const [groupName, layerIds] of Object.entries(config.layerGroups || {})) {
        this.layerGroups.set(groupName, layerIds)
      }
      
      // 设置当前图层组
      this.currentLayerGroup = config.currentLayerGroup || 'default'
      
      // 导入图层
      for (const layerConfig of config.layers || []) {
        await this.addLayer(layerConfig)
      }
      
      console.log('✅ 图层配置导入成功')
    } catch (error) {
      console.error('❌ 图层配置导入失败:', error)
      throw error
    }
  }
}