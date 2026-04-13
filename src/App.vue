<template>
  <div id="app">
    <!-- 菜单头部 -->
    <AppHeader />
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 地图容器 -->
      <div id="map-container" class="map-container"></div>
      
      <!-- 信息面板 -->
      <div id="info" class="info-panel">
        <h3>Trilab 高德地图示例</h3>
        <p>基于 trilab 引擎的高德地图集成</p>
        <div class="status">
          <span>引擎状态: </span>
          <span :class="{ 'status-loading': !engineLoaded, 'status-ready': engineLoaded }">
            {{ engineLoaded ? '已加载' : '加载中...' }}
          </span>
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
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import triLab from './TriLab.js'
import AppHeader from './components/AppHeader.vue'
import MapSwitcher from './components/MapSwitcher.vue'
import LayerManagerButton from './components/LayerManagerButton.vue'
import LayerManagerPanel from './components/LayerManagerPanel.vue'
import MapControls from './components/MapControls.vue'
import ToolsManagerButton from './components/ToolsManagerButton.vue'
import ToolsManagerPanel from './components/ToolsManagerPanel.vue'
import BasemapSwitcherButton from './components/BasemapSwitcherButton.vue'
import BasemapSwitcherPanel from './components/BasemapSwitcherPanel.vue'

// 响应式数据
const engineLoaded = ref(false)
const showInfo = ref(true)
const mapSwitcherRef = ref(null)
const layerManagerButtonRef = ref(null)
const layerManagerPanelRef = ref(null)
const toolsManagerButtonRef = ref(null)
const toolsManagerPanelRef = ref(null)
const basemapSwitcherButtonRef = ref(null)
const basemapSwitcherPanelRef = ref(null)

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

// 组件挂载时初始化
onMounted(() => {
  initTrilab()
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

.info-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  border-radius: 8px;
  z-index: 100;
  max-width: 300px;
}

.info-panel h3 {
  margin-bottom: 10px;
  color: #409eff;
}

.info-panel p {
  margin-bottom: 15px;
  opacity: 0.8;
}

.status {
  margin-bottom: 15px;
  padding: 5px 10px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.status-loading {
  color: #e6a23c;
}

.status-ready {
  color: #67c23a;
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