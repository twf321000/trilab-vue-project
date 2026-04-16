<template>
  <div id="app">
    <!-- 菜单头部 -->
    <AppHeader />
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 地图容器 -->
      <div id="map-container" class="map-container"></div>
      
      <!-- 插件组件容器 -->
      <div class="plugin-components-container">
        <!-- 动态渲染插件组件 -->
        <div 
          v-for="pluginComponent in pluginComponents" 
          :key="pluginComponent.id"
          :class="pluginComponent.containerClass"
          :style="pluginComponent.containerStyle"
        >
          <component 
            :is="pluginComponent.component" 
            v-if="pluginComponent.component"
          />
        </div>
      </div>
      
      <!-- 信息面板 -->
      <div id="info" class="info-panel">
        <h3>Trilab 通用三维可视化系统</h3>
        <p>基于插件化架构的三维大屏模板</p>
        
        <div class="status-section">
          <h4>系统状态</h4>
          <div class="status-item">
            <span>引擎状态: </span>
            <span :class="{ 'status-loading': !engineLoaded, 'status-ready': engineLoaded }">
              {{ engineLoaded ? '已加载' : '加载中...' }}
            </span>
          </div>
          <div class="status-item">
            <span>插件系统: </span>
            <span :class="{ 'status-loading': !pluginsLoaded, 'status-ready': pluginsLoaded }">
              {{ pluginStatus }}
            </span>
          </div>
        </div>
        
        <div class="plugins-section" v-if="pluginsLoaded && plugins.length > 0">
          <h4>已加载插件</h4>
          <div class="plugin-list">
            <div 
              v-for="plugin in plugins" 
              :key="plugin.id"
              class="plugin-item"
              :class="{ 'plugin-active': plugin.isActive }">
              <span class="plugin-icon">{{ plugin.config?.icon || '🔌' }}</span>
              <span class="plugin-name">{{ plugin.name }}</span>
              <span class="plugin-status">{{ plugin.isActive ? '运行中' : '已停用' }}</span>
            </div>
          </div>
        </div>
        
        <div class="actions-section">
          <button @click="toggleInfo" class="action-btn">隐藏信息</button>
          <button @click="showPluginManager" class="action-btn">插件管理</button>
        </div>
      </div>
      
      <!-- 底图切换器 -->
      <!-- <MapSwitcher ref="mapSwitcherRef" /> -->
      
      <!-- 底图切换按钮 -->
      <BasemapSwitcherButton 
        ref="basemapSwitcherButtonRef" 
        @toggle="handleBasemapToggle"
      />
      
      <!-- 底图切换面板 -->
      <BasemapSwitcherPanel 
        ref="basemapSwitcherPanelRef" 
        @switch="handleBasemapSwitch"
        @close="handleBasemapClose"
      />
      
      <!-- 图层管理按钮 -->
      <LayerManagerButton ref="layerManagerButtonRef" />
      
      <!-- 图层管理面板 -->
      <LayerManagerPanel ref="layerManagerPanelRef" />
      
      <!-- 工具管理面板 -->
      <ToolsManagerPanel ref="toolsManagerPanelRef" />
      
      <!-- 地图控制按钮 -->
      <MapControls />
      
      <!-- 工具管理按钮 -->
      <ToolsManagerButton ref="toolsManagerButtonRef" />
      
      <!-- 插件UI组件将在这里动态渲染 -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, shallowRef } from 'vue'
import triLab from './TriLab.js'
import { pluginManager } from './plugins/PluginManager.js'
import AppHeader from './components/AppHeader.vue' 
import LayerManagerButton from './components/LayerManagerButton.vue'
import LayerManagerPanel from './components/LayerManagerPanel.vue'
import MapControls from './components/MapControls.vue'
import ToolsManagerButton from './components/ToolsManagerButton.vue'
import ToolsManagerPanel from './components/ToolsManagerPanel.vue'
import BasemapSwitcherButton from './components/BasemapSwitcherButton.vue'
import BasemapSwitcherPanel from './components/BasemapSwitcherPanel.vue'

// 插件组件管理
const pluginComponents = ref([])

// 响应式数据
const engineLoaded = ref(false)
const showInfo = ref(true)
const pluginsLoaded = ref(false)
const mapSwitcherRef = ref(null) 
const basemapSwitcherButtonRef = ref(null)
const basemapSwitcherPanelRef = ref(null)

// 插件管理
const plugins = ref([])
const pluginStatus = ref('初始化中...')

// 初始化 trilab 引擎
const initTrilab = async () => {
  try {
    // 动态加载 trilab 引擎 
    
    // 地图中心点（UTM 坐标）- 参考 trilab 示例
    const center = [2938834.56, 4851421.1815]
    
    // 初始化 TriLab Map（使用新的Map类）
    const map = new triLab.Map('map-container', {
      center: center,
      zoom: 15,
      yaw: 0,
      pitch: 0,
      controls: {
        locationBar: true,  // 启用位置栏
        scaleLine: true,    // 启用比例尺
        cubeView: true      // 启用立方体视图
      },
      compassImageUrl: "./src/assets/images/compas.svg",  // 通过传值设置指北针图片路径
      compassPosition: "bottom-left",  // 设置指北针位置：top-left, top-right, bottom-left, bottom-right, center-top, center-bottom
      compassCustomPosition: "bottom: 250px; left: 5px;"  // 自定义CSS位置，优先级高于compassPosition
    })
    
    // 将地图实例保存到全局变量，便于其他操作
    window.trilabMap = map
    
    // 添加高德地图图层
    const gaodeLayer = new triLab.layer.GaodeLayer({
      style: "8", // 高德地图样式，8为默认样式
      minLevel: 2,
      maxLevel: 18,
      backgroundColor: 0x112233,
    })
    map.addLayer(gaodeLayer)
    
    // 将初始图层保存到全局变量，便于底图切换组件跟踪
    window.currentBasemapLayer = gaodeLayer
    
    // 标记引擎已加载
    engineLoaded.value = true
    console.log('Trilab 引擎初始化完成，高德地图图层已加载')
    
    // 控制指北针的显示
    if (map.viewer && map.viewer.compass) {
      map.viewer.compass.setVisible(true)
    }
    
  } catch (error) {
    console.error('Trilab 引擎初始化失败:', error)
    
    // 如果 trilab 引擎加载失败，显示错误信息
    const errorDiv = document.createElement('div')
    errorDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      background: rgba(0,0,0,0.8);
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      z-index: 1000;
    `
    errorDiv.innerHTML = `
      <h3>Trilab 引擎加载失败</h3>
      <p>${error.message}</p>
      <p>请检查 trilab 引擎文件是否存在</p>
    `
    document.getElementById('app').appendChild(errorDiv)
  }
}

// 重置视角
const resetView = () => {
  if (window.trilabMap && window.trilabMap.flyTo) {
    const center = [2938834.56, 4851421.1815]
    window.trilabMap.flyTo([center[0], center[1], 1000], [center[0], center[1], 0])
  }
}

// 切换信息面板显示
const toggleInfo = () => {
  showInfo.value = !showInfo.value
  const infoPanel = document.getElementById('info')
  if (infoPanel) {
    infoPanel.style.display = showInfo.value ? 'block' : 'none'
  }
}

// 打开底图切换器
const openMapSwitcher = () => {
  if (mapSwitcherRef.value) {
    mapSwitcherRef.value.openSwitcher()
  }
}

// 底图切换按钮事件处理
const handleBasemapToggle = (show) => {
  if (basemapSwitcherPanelRef.value) {
    if (show) {
      basemapSwitcherPanelRef.value.openPanel()
    } else {
      basemapSwitcherPanelRef.value.closePanel()
    }
  }
}

// 底图切换事件处理
const handleBasemapSwitch = (basemapType) => {
  console.log('切换到底图:', basemapType)
  // 这里可以添加实际的底图切换逻辑
  // 例如：调用 trilab 引擎的底图切换方法
}

// 底图面板关闭事件
const handleBasemapClose = () => {
  if (basemapSwitcherButtonRef.value) {
    basemapSwitcherButtonRef.value.closeBasemapSwitcher()
  }
}

// 显示插件管理器
const showPluginManager = () => {
  alert('插件管理器功能开发中...\n\n当前已加载插件：' + 
    plugins.value.map(p => `${p.name} (${p.isActive ? '运行中' : '已停用'})`).join(', '))
}

// 初始化插件系统
const initPlugins = async () => {
  try {
    pluginStatus.value = '正在加载插件...'
    
    // 初始化插件管理器
    await pluginManager.initialize()
    
    // 获取插件列表
    plugins.value = pluginManager.getPlugins()
    pluginsLoaded.value = true
    pluginStatus.value = `已加载 ${plugins.value.length} 个插件`
    
    console.log('✅ 插件系统初始化完成:', plugins.value)
    
    // 加载插件组件
    await loadPluginComponents()
    
  } catch (error) {
    console.error('❌ 插件系统初始化失败:', error)
    pluginStatus.value = '插件加载失败'
  }
}

// 加载插件组件
const loadPluginComponents = async () => {
  try {
    console.log('🔍 开始加载插件组件...')
    
    // 动态导入仪表盘插件组件
    const { default: DashboardButton } = await import('./plugins/dashboard/DashboardButton.vue')
    const { default: DashboardPanel } = await import('./plugins/dashboard/DashboardPanel.vue')
    
    console.log('✅ 仪表盘组件导入成功')
    
    // 注册插件组件
    registerPluginComponent('dashboard-button', DashboardButton, {
      containerClass: 'plugin-dashboard-button',
      containerStyle: { 
        left: '20px',
        bottom: '20px',
        zIndex: 10000
      }
    })
    
    registerPluginComponent('dashboard-panel', DashboardPanel, {
      containerClass: 'plugin-dashboard-panel',
      containerStyle: { 
        left: '20px',
        bottom: '80px',
        zIndex: 10000
      }
    })
    
    console.log('✅ 插件组件加载完成')
    
  } catch (error) {
    console.error('❌ 加载插件组件失败:', error)
  }
}

// 注册插件组件
const registerPluginComponent = (id, component, config = {}) => {
  const pluginComponent = {
    id,
    component: shallowRef(component),
    containerClass: config.containerClass || '',
    containerStyle: config.containerStyle || {},
    config
  }
  
  pluginComponents.value.push(pluginComponent)
  console.log(`✅ 注册插件组件: ${id}`, config)
}

// 注销插件组件
const unregisterPluginComponent = (id) => {
  const index = pluginComponents.value.findIndex(pc => pc.id === id)
  if (index !== -1) {
    pluginComponents.value.splice(index, 1)
    console.log(`✅ 注销插件组件: ${id}`)
  }
}

// 地图就绪时通知插件
const notifyPluginsMapReady = (map) => {
  plugins.value.forEach(plugin => {
    if (plugin.onMapReady && typeof plugin.onMapReady === 'function') {
      plugin.onMapReady(map)
    }
  })
}

// 组件挂载时初始化
onMounted(async () => {
  // 并行初始化 trilab 引擎和插件系统
  await Promise.all([
    initTrilab(),
    initPlugins()
  ])
  
  // 地图就绪后通知插件
  if (window.trilabMap) {
    notifyPluginsMapReady(window.trilabMap)
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
  background: #000;
}

/* 插件组件容器样式 - 修复遮挡底图问题 */
.plugin-components-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000; /* 与 info-panel 相同的层级 */
  pointer-events: none; /* 允许点击穿透到底图 */
}

/* 插件组件样式 - 确保组件可以接收点击事件，但不遮挡底图 */
.plugin-components-container > div {
  pointer-events: auto;
  /* 确保组件只占用必要的空间，不遮挡整个地图 */
}

.info-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 350px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.3);
}

.info-panel h3 {
  margin-bottom: 10px;
  color: #64ffda;
  font-size: 16px;
}

info-panel h4 {
  margin: 15px 0 10px 0;
  color: #00d4ff;
  font-size: 14px;
  border-bottom: 1px solid rgba(100, 255, 218, 0.3);
  padding-bottom: 5px;
}

.info-panel p {
  margin-bottom: 15px;
  opacity: 0.8;
  font-size: 12px;
}

.status-section {
  margin-bottom: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.status-loading {
  color: #ffa500;
}

.status-ready {
  color: #00ff00;
}

.plugins-section {
  margin-bottom: 15px;
}

.plugin-list {
  max-height: 120px;
  overflow-y: auto;
}

.plugin-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 11px;
  transition: background 0.2s;
}

.plugin-item.plugin-active {
  background: rgba(100, 255, 218, 0.1);
  border-left: 2px solid #64ffda;
}

.plugin-icon {
  margin-right: 8px;
  font-size: 12px;
}

.plugin-name {
  flex: 1;
  font-weight: 500;
}

.plugin-status {
  font-size: 10px;
  opacity: 0.7;
}

.actions-section {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}

.action-btn {
  flex: 1;
  padding: 6px 12px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.controls button {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.controls button:hover {
  background: #66b1ff;
}

.controls button:active {
  background: #3a8ee6;
}
</style>