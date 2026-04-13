<template>
  <div class="layer-manager-panel" v-if="showPanel">
    <div class="panel-header">
      <div class="panel-title">图层管理</div>
      <div class="panel-close" @click="closePanel">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </div>
    </div>
    
    <div class="panel-content">
      <!-- 搜索框 -->
      <div class="search-box">
        <input 
          v-model="searchText" 
          type="text" 
          placeholder="搜索图层..." 
          class="search-input"
          @input="handleSearch"
        />
        <div class="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
        
        <!-- 搜索结果显示 -->
        <div v-if="searchText && filteredLayers.length > 0" class="search-results">
          <div class="search-results-header">
            <span class="results-count">找到 {{ filteredLayers.length }} 个图层</span>
            <div class="search-actions">
              <button class="action-btn" @click="showAllSearched" title="显示所有搜索结果">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                </svg>
                显示全部
              </button>
              <button class="action-btn" @click="hideAllSearched" title="隐藏所有搜索结果">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/>
                </svg>
                隐藏全部
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 图层列表 -->
      <div class="layer-list">
        <div 
          v-for="layer in filteredLayers" 
          :key="layer.id"
          class="layer-item"
          :class="{ 'active': layer.visible }"
          :data-layer-id="layer.id"
        >
          <div class="layer-checkbox">
            <input 
              type="checkbox" 
              v-model="layer.visible" 
              @change="handleCheckboxChange(layer)"
              class="checkbox"
            />
          </div>
          
          <div class="layer-info">
            <div class="layer-name">{{ layer.name }}</div>
            <div class="layer-type">{{ layer.type }}</div>
          </div>
          
          <!-- 显示/隐藏控制 -->
          <div class="layer-visibility">
            <button 
              class="visibility-btn" 
              :class="{ 'active': layer.visible }"
              @click="showLayer(layer)"
              title="显示图层"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </button>
            <button 
              class="visibility-btn" 
              :class="{ 'active': !layer.visible }"
              @click="hideLayer(layer)"
              title="隐藏图层"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            </button>
          </div>
          
          <!-- 透明度控制 -->
          <div class="layer-opacity-control">
            <div class="opacity-header">
              <span class="opacity-label">透明度</span>
              <span class="opacity-value" id="opacity-value">{{ Math.round(layer.opacity * 100) }}%</span>
            </div>
            <div class="opacity-controls">
              <input 
                type="range" 
                v-model="layer.opacity" 
                min="0" 
                max="1" 
                step="0.01"
                @input="setLayerOpacity(layer)"
                class="opacity-slider"
                id="opacity-slider"
              />
              <input 
                type="number" 
                v-model="opacityInput" 
                min="0" 
                max="100" 
                @input="setOpacityFromInput(layer)"
                class="opacity-input"
                id="opacity-input"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="filteredLayers.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">暂无图层数据</div>
      </div>
    </div>
    
    <!-- 底部操作 -->
    <div class="panel-footer">
      <button class="btn btn-primary" @click="addNewLayer">添加图层</button>
      <button class="btn btn-secondary" @click="resetLayers">重置图层</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 响应式数据
const showPanel = ref(false)
const searchText = ref('')
const opacityInput = ref('100')

// 图层数据（使用0-1范围的透明度，ID与实际Trilab图层对应）
const layers = ref([
  {
    id: 'gaodeMap', // 对应实际图层名称
    name: '高德底图',
    type: '底图图层',
    visible: true,
    opacity: 1.0
  },
  {
    id: 'gaodeSatellite', // 对应卫星影像图层
    name: '卫星影像',
    type: '影像图层',
    visible: false,
    opacity: 1.0
  },
  {
    id: 'terrain', // 对应地形图层
    name: '地形数据',
    type: '地形图层',
    visible: true,
    opacity: 0.8
  },
  {
    id: 'building',
    name: '建筑模型',
    type: '模型图层',
    visible: true,
    opacity: 1.0
  },
  {
    id: 'road',
    name: '道路网络',
    type: '矢量图层',
    visible: true,
    opacity: 0.7
  },
  {
    id: 'point_cloud',
    name: '点云数据',
    type: '点云图层',
    visible: false,
    opacity: 1.0
  }
])

// 过滤后的图层列表
const filteredLayers = computed(() => {
  if (!searchText.value) {
    return layers.value
  }
  return layers.value.filter(layer => 
    layer.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
    layer.type.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// 获取实际图层对象
const getActualLayer = (layer) => {
  try {
    // 通过全局的map对象获取实际图层
    if (window.trilabMap) {
      const actualLayer = window.trilabMap.getLayer(layer.id)
      if (actualLayer) {
        console.log('获取到实际图层:', layer.name, actualLayer)
        return actualLayer
      }
    }
    console.warn('未找到实际图层:', layer.name)
    return null
  } catch (error) {
    console.error('获取图层时出错:', error)
    return null
  }
}

// 显示图层
const showLayer = (layer) => {
  layer.visible = true
  console.log('显示图层:', layer.name)
  updateButtonStates(layer)
  
  // 调用实际图层显示逻辑
  const actualLayer = getActualLayer(layer)
  if (actualLayer && actualLayer.show) {
    actualLayer.show()
    console.log('实际图层显示成功:', layer.name)
  }
}

// 隐藏图层
const hideLayer = (layer) => {
  layer.visible = false
  console.log('隐藏图层:', layer.name)
  updateButtonStates(layer)
  
  // 调用实际图层隐藏逻辑
  const actualLayer = getActualLayer(layer)
  if (actualLayer && actualLayer.hide) {
    actualLayer.hide()
    console.log('实际图层隐藏成功:', layer.name)
  }
}

// 设置图层透明度
const setLayerOpacity = (layer) => {
  console.log('设置图层透明度:', layer.name, layer.opacity)
  updateOpacityDisplay(layer)
  updateButtonStates(layer)
  
  // 调用实际图层透明度调整逻辑
  const actualLayer = getActualLayer(layer)
  if (actualLayer && actualLayer.opacity !== undefined) {
    actualLayer.opacity = layer.opacity
    console.log('实际图层透明度设置成功:', layer.name, layer.opacity)
  }
}

// 从输入框设置透明度
const setOpacityFromInput = (layer) => {
  let value = parseInt(opacityInput.value)
  if (isNaN(value)) value = 100
  value = Math.max(0, Math.min(100, value))
  
  const opacityValue = value / 100
  layer.opacity = opacityValue
  opacityInput.value = value
  setLayerOpacity(layer)
}

// 更新透明度显示
const updateOpacityDisplay = (layer) => {
  const opacityValue = Math.round(layer.opacity * 100)
  opacityInput.value = opacityValue
}

// 更新按钮状态
const updateButtonStates = (layer) => {
  // 显示/隐藏按钮状态
  const showBtn = document.querySelector(`[data-layer-id="${layer.id}"] .visibility-btn:nth-child(1)`)
  const hideBtn = document.querySelector(`[data-layer-id="${layer.id}"] .visibility-btn:nth-child(2)`)
  
  if (showBtn && hideBtn) {
    showBtn.classList.toggle('active', layer.visible)
    hideBtn.classList.toggle('active', !layer.visible)
  }
}

// 处理复选框变化
const handleCheckboxChange = (layer) => {
  console.log('复选框状态变化:', layer.name, layer.visible)
  
  if (layer.visible) {
    // 如果复选框被选中，显示图层
    showLayer(layer)
  } else {
    // 如果复选框被取消，隐藏图层
    hideLayer(layer)
  }
}

// 切换图层可见性（保留函数，但不再使用）
const toggleLayerVisibility = (layer) => {
  console.log('切换图层可见性:', layer.name, layer.visible)
  updateButtonStates(layer)
}

// 改变图层透明度
const changeLayerOpacity = (layer) => {
  console.log('改变图层透明度:', layer.name, layer.opacity)
  // 这里可以添加实际的图层透明度调整逻辑
}

// 打开图层设置
const openLayerSettings = (layer) => {
  console.log('打开图层设置:', layer.name)
  // 这里可以打开图层详细设置面板
}

// 添加新图层
const addNewLayer = () => {
  console.log('添加新图层')
  // 这里可以打开添加图层的对话框
}

// 重置图层
const resetLayers = () => {
  layers.value.forEach(layer => {
    layer.visible = true
    layer.opacity = 100
  })
  console.log('重置所有图层')
}

// 打开面板
const openPanel = () => {
  showPanel.value = true
}

// 关闭面板
const closePanel = () => {
  showPanel.value = false
}

// 监听图层管理器切换事件
const handleLayerManagerToggle = (event) => {
  showPanel.value = event.detail.show
}

// 初始化图层管理器
const initLayerManager = () => {
  console.log('初始化图层管理器...')
  
  // 检查全局的trilabMap对象
  if (window.trilabMap) {
    console.log('找到全局trilabMap对象:', window.trilabMap)
    
    // 尝试获取所有图层并同步状态
    layers.value.forEach(layer => {
      try {
        const actualLayer = window.trilabMap.getLayer(layer.id)
        if (actualLayer) {
          // 同步实际图层的可见性状态
          if (actualLayer.visible !== undefined) {
            layer.visible = actualLayer.visible
          }
          
          // 同步实际图层的透明度状态
          if (actualLayer.opacity !== undefined) {
            layer.opacity = actualLayer.opacity
          }
          
          console.log('同步图层状态:', layer.name, {
            visible: layer.visible,
            opacity: layer.opacity
          })
        }
      } catch (error) {
        console.warn('同步图层状态时出错:', layer.name, error)
      }
    })
  } else {
    console.warn('未找到全局trilabMap对象，图层控制将使用模拟数据')
  }
}

onMounted(() => {
  window.addEventListener('layerManagerToggle', handleLayerManagerToggle)
  
  // 初始化图层管理器
  setTimeout(() => {
    initLayerManager()
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('layerManagerToggle', handleLayerManagerToggle)
})

// 搜索处理
const handleSearch = () => {
  console.log('搜索关键词:', searchText.value)
  console.log('找到图层数量:', filteredLayers.value.length)
}

// 显示所有搜索结果
const showAllSearched = () => {
  filteredLayers.value.forEach(layer => {
    layer.visible = true
    updateButtonStates(layer)
    
    // 调用实际图层显示逻辑
    const actualLayer = getActualLayer(layer)
    if (actualLayer && actualLayer.show) {
      actualLayer.show()
    }
  })
  console.log('显示所有搜索结果')
}

// 隐藏所有搜索结果
const hideAllSearched = () => {
  filteredLayers.value.forEach(layer => {
    layer.visible = false
    updateButtonStates(layer)
    
    // 调用实际图层隐藏逻辑
    const actualLayer = getActualLayer(layer)
    if (actualLayer && actualLayer.hide) {
      actualLayer.hide()
    }
  })
  console.log('隐藏所有搜索结果')
}

// 暴露方法
defineExpose({
  openPanel,
  closePanel
})
</script>

<style scoped>
.layer-manager-panel {
  position: absolute;
  right: 140px;
  top: 70px;
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  z-index: 998;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 170px);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.panel-close {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
  color: #666;
}

.panel-close:hover {
  background: #f0f0f0;
  color: #333;
}

.panel-content {
  flex: 1;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-box {
  position: relative;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #409eff;
}

.search-icon {
  position: absolute;
  left: 32px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

/* 搜索结果显示 */
.search-results {
  margin-top: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.search-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-count {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.search-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f0f0f0;
  border-color: #ccc;
}

.action-btn:active {
  background: #e0e0e0;
}

.layer-list {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.layer-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #f8f8f8;
  transition: background 0.2s;
}

.layer-item:hover {
  background: #f8f9fa;
}

.layer-item:last-child {
  border-bottom: none;
}

.layer-item.active {
  background: #f0f7ff;
}

.layer-checkbox {
  margin-right: 12px;
}

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.layer-info {
  flex: 1;
  min-width: 0;
}

.layer-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.layer-type {
  font-size: 12px;
  color: #666;
}

/* 显示/隐藏控制 */
.layer-visibility {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 16px;
}

.visibility-btn {
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
}

.visibility-btn:hover {
  background: #e0e0e0;
  border-color: #ccc;
}

.visibility-btn.active {
  background: #409eff;
  border-color: #409eff;
  color: white;
}

/* 透明度控制 */
.layer-opacity-control {
  flex: 1;
  min-width: 0;
}

.opacity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.opacity-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.opacity-value {
  font-size: 11px;
  color: #409eff;
  font-weight: 600;
  min-width: 30px;
  text-align: right;
}

.opacity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.opacity-slider {
  flex: 1;
  height: 4px;
  cursor: pointer;
  background: #e0e0e0;
  border-radius: 2px;
  outline: none;
}

.opacity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #409eff;
  border-radius: 50%;
  cursor: pointer;
}

.opacity-input {
  width: 40px;
  padding: 2px 4px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 11px;
  text-align: center;
  outline: none;
}

.opacity-input:focus {
  border-color: #409eff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
}

.panel-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #409eff;
  color: white;
}

.btn-primary:hover {
  background: #337ecc;
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* 滚动条样式 */
.layer-list::-webkit-scrollbar {
  width: 4px;
}

.layer-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.layer-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.layer-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layer-manager-panel {
    width: 280px;
    right: 10px;
  }
  
  .layer-controls {
    flex-direction: column;
    gap: 4px;
  }
  
  .opacity-slider {
    width: 40px;
  }
}
</style>