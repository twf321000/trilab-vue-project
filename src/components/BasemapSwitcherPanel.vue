<template>
  <div class="basemap-switcher-panel" v-if="showPanel">
    <div class="panel-header">
      <div class="panel-icon">
        <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 44.0002C35.0457 44.0002 44 35.0459 44 24.0002C44 12.9545 35.0457 4.00024 24 4.00024C12.9543 4.00024 4 12.9545 4 24.0002C4 35.0459 12.9543 44.0002 24 44.0002Z" stroke="#41A8FF" stroke-width="4"/>
          <path d="M6 30.9856C8.63192 32.041 10.5266 32.041 11.6839 30.9856C13.4199 29.4025 11.9219 24.5978 14.3532 23.2727C16.7844 21.9476 20.4886 27.8214 23.9508 25.8887C27.4129 23.9559 23.6246 18.8023 26.0272 16.713C28.4298 14.6237 31.554 16.98 32.1001 13.4865C32.6462 9.99304 29.5521 11.5082 28.9584 8.20693C28.5625 6.00611 28.5625 4.84884 28.9584 4.73511" stroke="#41A8FF" stroke-width="4" stroke-linecap="round"/>
          <path d="M29.0209 43.3505C27.1468 41.4325 26.4721 39.6497 26.9969 38.0019C27.7841 35.5303 29.0826 35.6764 29.6488 34.1482C30.2149 32.6199 28.6156 30.4433 32.1643 28.5826C34.5301 27.3421 37.783 28.7794 41.9228 32.8944" stroke="#41A8FF" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="panel-title">底图</div>
      <div class="panel-close" @click="closePanel">
        <svg width="18" height="18" viewBox="0 0 48 48" fill="currentColor">
          <path d="M8 8L40 40" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 40L40 8" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    
    <div class="panel-content">
      <div class="basemap-section">
        <h3 class="section-title">高德地图样式</h3>
        <ul class="basemap-list">
          <li class="basemap-card" :class="{ 'active': activeBasemap === 'gaode_img' }" @click="switchBasemap('gaode_img')">
            <div class="basemap-icon">
              <img src="/src/assets/images/gaode_img.png" alt="高德影像" />
            </div>
            <div class="basemap-name">高德影像</div>
          </li>
          <li class="basemap-card" :class="{ 'active': activeBasemap === 'gaode_vec' }" @click="switchBasemap('gaode_vec')">
            <div class="basemap-icon">
              <img src="/src/assets/images/gaode_vec.png" alt="高德电子" />
            </div>
            <div class="basemap-name">高德电子</div>
          </li>
          <li class="basemap-card" :class="{ 'active': activeBasemap === 'gaode_normal' }" @click="switchBasemap('gaode_normal')">
            <div class="basemap-icon">
              <img src="/src/assets/images/my_blue.png" alt="默认地图" />
            </div>
            <div class="basemap-name">默认地图</div>
          </li>
          <li class="basemap-card" :class="{ 'active': activeBasemap === 'gaode_blue' }" @click="switchBasemap('gaode_blue')">
            <div class="basemap-icon">
              <img src="/src/assets/images/my_blue.png" alt="蓝色地图" />
            </div>
            <div class="basemap-name">蓝色地图</div>
          </li>
          <li class="basemap-card" :class="{ 'active': activeBasemap === 'gaode_black' }" @click="switchBasemap('gaode_black')">
            <div class="basemap-icon">
              <img src="/src/assets/images/my_blue.png" alt="黑色地图" />
            </div>
            <div class="basemap-name">黑色地图</div>
          </li>
          <li class="basemap-card" :class="{ 'active': activeBasemap === 'gaode_gray' }" @click="switchBasemap('gaode_gray')">
            <div class="basemap-icon">
              <img src="/src/assets/images/my_grey.png" alt="灰色地图" />
            </div>
            <div class="basemap-name">灰色地图</div>
          </li>
        </ul>
      </div>
      
      <div class="basemap-section">
        <h3 class="section-title">MapBox地形</h3>
        <ul class="basemap-list">
          <li class="basemap-card" :class="{ 'active': activeBasemap === 'mapbox_terrain' }" @click="switchBasemap('mapbox_terrain')">
            <div class="basemap-icon">
              <img src="/src/assets/images/my_blue.png" alt="MapBox地形" />
            </div>
            <div class="basemap-name">MapBox地形</div>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- <div class="panel-footer">
      <div class="terrain-toggle">
        <div class="toggle-switch" :class="{ 'active': showTerrain }" @click="toggleTerrain">
          <div class="toggle-handle"></div>
        </div>
        <span class="toggle-label">显示地形</span>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import trilab from '../TriLab.js'

const showPanel = ref(false)
const activeBasemap = ref('gaode_vec')
const showTerrain = ref(false)
 

const emit = defineEmits(['switch', 'close'])

// 切换到指定地图图层（参考新的简化实现）
const switchToLayer = (layerName) => {
  if (!window.trilabMap) return
  
  try {
    // 删除当前图层（包括初始图层）
    if (window.currentBasemapLayer) {
      window.trilabMap.removeLayer(window.currentBasemapLayer)
      window.currentBasemapLayer = null
    }
    
    // 删除初始图层（如果存在）
    if (window.currentBasemapLayer) {
      try {
        window.trilabMap.removeLayer(window.currentBasemapLayer)
        console.log('删除初始高德地图图层')
      } catch (err) {
        console.warn('删除初始图层失败:', err)
      }
      window.currentBasemapLayer = null
    }
    
    // 根据图层名称创建对应的地图图层
    let newLayer = null
    switch (layerName) {
      case 'img':
        newLayer = new trilab.layer.GaodeSatelliteLayer({
          minLevel: 2,
          maxLevel: 18,
        })
        break
      case 'vec':
        newLayer = new trilab.layer.GaodeLayer({
          style: "7", // 高德电子地图样式
          minLevel: 2,
          maxLevel: 18,
          backgroundColor: 0x112233,
        })
        break
      case 'normal':
        newLayer = new trilab.layer.GaodeLayer({
          style: "8",
          minLevel: 2,
          maxLevel: 18,
          backgroundColor: 0x112233,
        })
        break
      case 'blue':
        newLayer = new trilab.layer.GaodeBlueLayer({
          minLevel: 2,
          maxLevel: 18
        })
        break
      case 'black':
        newLayer = new trilab.layer.GaodeBlackLayer({
          minLevel: 2,
          maxLevel: 18
        })
        break
      case 'gray':
        newLayer = new trilab.layer.GaodeGrayLayer({
          minLevel: 2,
          maxLevel: 18
        })
        break
      case 'mapbox_terrain':
        newLayer = new trilab.layer.MapBoxTerrainLayer({
          imgStyle: "mapbox.satellite", // MapBox 影像样式
          demStyle: "mapbox.terrain-rgb", // MapBox 地形样式
          accessToken: "YOUR_MAPBOX_ACCESS_TOKEN_HERE", // 请替换为您的Mapbox Access Token
          minLevel: 2,
          maxLevel: 18,
          backgroundColor: 0x112233,
        })
        break
      default:
        console.warn('未知的图层类型:', layerName)
        return
    }
    
    // 添加新图层
    if (newLayer) {
      window.trilabMap.addLayer(newLayer)
      window.currentBasemapLayer = newLayer
      console.log('已切换到高德地图样式:', layerName)
    }
  } catch (error) {
    console.error('切换高德地图样式失败:', error)
  }
}

const openPanel = () => {
  showPanel.value = true
}

const closePanel = () => {
  showPanel.value = false
  emit('close')
}

const switchBasemap = (basemapType) => {
  activeBasemap.value = basemapType
  emit('switch', basemapType)
  console.log('切换到底图:', basemapType)
  
  // 根据参考文件的逻辑，实现高德地图样式切换
  if (trilab) {
    switch (basemapType) {
      case 'gaode_img':
        switchToLayer('img')
        break
      case 'gaode_vec':
        switchToLayer('vec')
        break
      case 'gaode_normal':
        switchToLayer('normal')
        break
      case 'gaode_blue':
        switchToLayer('blue')
        break
      case 'gaode_black':
        switchToLayer('black')
        break
      case 'gaode_gray':
        switchToLayer('gray')
        break
      case 'mapbox_terrain':
        switchToLayer('mapbox_terrain')
        break
      default:
        console.log('其他底图类型:', basemapType)
    }
  }
}

const toggleTerrain = () => {
  showTerrain.value = !showTerrain.value
  console.log('地形显示:', showTerrain.value ? '开启' : '关闭')
}

defineExpose({
  openPanel,
  closePanel
})
</script>

<style scoped>
.basemap-switcher-panel {
  position: absolute;
  right: 10px;
  top: 60px;
  width: 340px;
  height: 320px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  z-index: 900;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: move;
}

.panel-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: #41A8FF;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.panel-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.panel-close:hover {
  background: #f0f0f0;
  color: #333;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.basemap-section {
  padding: 0 15px;
  margin-bottom: 10px;
}

.basemap-section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 15px 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 5px;
}

.basemap-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.basemap-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.basemap-card:hover {
  background: #f5f5f5;
  transform: translateY(-1px);
}

.basemap-card.active {
  background: #e6f7ff;
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.basemap-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
  overflow: hidden;
}

.basemap-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.basemap-card.active .basemap-icon {
  background: #1890ff;
  color: white;
}

.basemap-card.active .basemap-icon img {
  opacity: 0.8;
}

.basemap-name {
  font-size: 11px;
  color: #666;
  text-align: center;
  line-height: 1.2;
}

.basemap-card.active .basemap-name {
  color: #1890ff;
  font-weight: 500;
}

.panel-footer {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.terrain-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-switch {
  width: 40px;
  height: 20px;
  background: #ccc;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-switch.active {
  background: #1890ff;
}

.toggle-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toggle-switch.active .toggle-handle {
  left: 22px;
}

.toggle-label {
  font-size: 12px;
  color: #666;
}

/* 滚动条样式 */
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .basemap-switcher-panel {
    right: 5px;
    top: 50px;
    width: 300px;
    height: 220px;
  }
  
  .basemap-list {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .basemap-name {
    font-size: 10px;
  }
}
</style>