<template>
  <div class="map-switcher" v-if="showSwitcher">
    <div class="switcher-header">
      <div class="switcher-title">底图切换</div>
      <div class="switcher-close" @click="toggleSwitcher">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </div>
    </div>
    
    <div class="map-list">
      <div 
        v-for="map in mapTypes" 
        :key="map.id"
        class="map-item"
        :class="{ 'active': currentMap === map.id }"
        @click="switchMap(map)"
      >
        <div class="map-preview">
          <div class="map-color" :style="{ background: map.color }"></div>
        </div>
        <div class="map-info">
          <div class="map-name">{{ map.name }}</div>
          <div class="map-desc">{{ map.description }}</div>
        </div>
        <div class="map-check">
          <div class="check-icon" v-if="currentMap === map.id">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 响应式数据
const showSwitcher = ref(false)
const currentMap = ref('gaode')

// 地图类型配置
const mapTypes = [
  {
    id: 'gaode',
    name: '高德地图',
    description: '标准地图样式',
    color: '#409eff',
    style: '8'
  },
  {
    id: 'gaode_satellite',
    name: '高德卫星图',
    description: '卫星影像地图',
    color: '#67c23a',
    style: '6'
  },
  {
    id: 'gaode_dark',
    name: '高德暗色',
    description: '暗色主题地图',
    color: '#909399',
    style: '10'
  },
  {
    id: 'gaode_light',
    name: '高德亮色',
    description: '亮色主题地图',
    color: '#e6a23c',
    style: '7'
  }
]

// 切换底图
const switchMap = async (map) => {
  if (currentMap.value === map.id) return
  
  try {
    console.log('切换底图:', map.name)
    
    // 如果 trilab 引擎已加载，切换地图样式
    if (window.trilabMap && window.trilabMap.layers) {
      // 移除当前图层
      const currentLayers = window.trilabMap.layers || []
      currentLayers.forEach(layer => {
        window.trilabMap.removeLayer(layer)
      })
      
      // 添加新图层
      const TriLab = await import('../TriLab.js')
      const newLayer = new TriLab.layer.GaodeLayer({
        style: map.style,
        minLevel: 2,
        maxLevel: 18,
        backgroundColor: 0x112233
      })
      window.trilabMap.addLayer(newLayer)
    }
    
    currentMap.value = map.id
    
    // 显示切换成功提示
    showMessage(`已切换到${map.name}`)
    
  } catch (error) {
    console.error('切换底图失败:', error)
    showMessage('底图切换失败，请稍后重试', 'error')
  }
}

// 显示消息提示
const showMessage = (message, type = 'success') => {
  // 这里可以集成消息提示组件
  console.log(`${type}: ${message}`)
}

// 切换底图切换器显示状态
const toggleSwitcher = () => {
  showSwitcher.value = !showSwitcher.value
}

// 暴露方法供外部调用
const openSwitcher = () => {
  showSwitcher.value = true
}

const closeSwitcher = () => {
  showSwitcher.value = false
}

// 组件挂载时初始化
onMounted(() => {
  // 可以在这里初始化默认地图
})

// 暴露方法
defineExpose({
  openSwitcher,
  closeSwitcher,
  toggleSwitcher
})
</script>

<style scoped>
.map-switcher {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 280px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  z-index: 999;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.switcher-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.switcher-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.switcher-close {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
  color: #666;
}

.switcher-close:hover {
  background: #f0f0f0;
  color: #333;
}

.map-list {
  max-height: 400px;
  overflow-y: auto;
}

.map-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f8f8f8;
}

.map-item:last-child {
  border-bottom: none;
}

.map-item:hover {
  background: #f8f9fa;
}

.map-item.active {
  background: #f0f7ff;
}

.map-preview {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  margin-right: 12px;
  border: 2px solid transparent;
}

.map-item.active .map-preview {
  border-color: #409eff;
}

.map-color {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.map-info {
  flex: 1;
}

.map-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.map-desc {
  font-size: 12px;
  color: #666;
}

.map-check {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  color: #409eff;
}

/* 滚动条样式 */
.map-list::-webkit-scrollbar {
  width: 4px;
}

.map-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.map-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.map-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>