<template>
  <div class="tools-manager-button" :class="{ 'active': showToolsManager }" @click="toggleToolsManager">
    <div class="button-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
    </div>
    <div class="button-text">测量工具</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 响应式数据
const showToolsManager = ref(false)

// 切换工具管理器显示状态
const toggleToolsManager = () => {
  showToolsManager.value = !showToolsManager.value
  
  // 触发工具管理器显示/隐藏事件
  const event = new CustomEvent('toolsManagerToggle', {
    detail: { show: showToolsManager.value }
  })
  window.dispatchEvent(event)
  
  console.log('工具管理器状态:', showToolsManager.value ? '显示' : '隐藏')
}

// 暴露方法供外部调用
const openToolsManager = () => {
  showToolsManager.value = true
  const event = new CustomEvent('toolsManagerToggle', {
    detail: { show: true }
  })
  window.dispatchEvent(event)
}

const closeToolsManager = () => {
  showToolsManager.value = false
  const event = new CustomEvent('toolsManagerToggle', {
    detail: { show: false }
  })
  window.dispatchEvent(event)
}

// 暴露方法
defineExpose({
  openToolsManager,
  closeToolsManager,
  toggleToolsManager
})
</script>

<style scoped>
.tools-manager-button {
  position: absolute;
  right: 14px;
  top: 20px;
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

.tools-manager-button:hover {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.tools-manager-button.active {
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

.tools-manager-button.active .button-icon {
  color: #409eff;
}

.button-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.tools-manager-button.active .button-text {
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tools-manager-button {
    right: 10px;
    top: 10px;
    width: 50px;
    height: 50px;
  }
  
  .button-icon {
    width: 20px;
    height: 20px;
  }
  
  .button-text {
    font-size: 10px;
  }
}
</style>