<template>
  <div class="layer-manager-button" :class="{ 'active': showLayerManager }" @click="toggleLayerManager">
    <div class="button-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
      </svg>
    </div>
    <div class="button-text">图层管理</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 响应式数据
const showLayerManager = ref(false)

// 切换图层管理器显示状态
const toggleLayerManager = () => {
  showLayerManager.value = !showLayerManager.value
  
  // 触发图层管理器显示/隐藏事件
  const event = new CustomEvent('layerManagerToggle', {
    detail: { show: showLayerManager.value }
  })
  window.dispatchEvent(event)
  
  console.log('图层管理器状态:', showLayerManager.value ? '显示' : '隐藏')
}

// 暴露方法供外部调用
const openLayerManager = () => {
  showLayerManager.value = true
  const event = new CustomEvent('layerManagerToggle', {
    detail: { show: true }
  })
  window.dispatchEvent(event)
}

const closeLayerManager = () => {
  showLayerManager.value = false
  const event = new CustomEvent('layerManagerToggle', {
    detail: { show: false }
  })
  window.dispatchEvent(event)
}

// 暴露方法
defineExpose({
  openLayerManager,
  closeLayerManager,
  toggleLayerManager
})
</script>

<style scoped>
.layer-manager-button {
  position: absolute;
  top: 20px;
  right: 120px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  z-index: 998;
}

.layer-manager-button:hover {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.layer-manager-button.active {
  background: rgba(64, 158, 255, 0.1);
  border-color: #409eff;
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #333;
}

.layer-manager-button.active .button-icon {
  color: #409eff;
}

.button-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.layer-manager-button.active .button-text {
  color: #409eff;
}

.layer-manager-button.active:hover {
  background: rgba(64, 158, 255, 0.98);
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.button-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.layer-manager-button.active .button-icon {
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layer-manager-button {
    top: 10px;
    right: 10px;
    padding: 8px 12px;
  }
  
  .button-text {
    font-size: 12px;
  }
}
</style>