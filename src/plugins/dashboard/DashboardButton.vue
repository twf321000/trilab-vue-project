<template>
  <div class="dashboard-button-container">
    <button 
      class="dashboard-button"
      :class="{ active: showDashboard }"
      @click="toggleDashboard"
      title="打开数据仪表盘">
      <span class="button-icon">📊</span>
      <span class="button-text">仪表盘</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式数据
const showDashboard = ref(false)

// 切换仪表盘显示
const toggleDashboard = () => {
  showDashboard.value = !showDashboard.value
  
  // 触发自定义事件
  if (showDashboard.value) {
    window.dispatchEvent(new CustomEvent('dashboardOpened'))
  } else {
    window.dispatchEvent(new CustomEvent('dashboardClosed'))
  }
}

// 监听面板关闭事件
const handlePanelClosed = () => {
  showDashboard.value = false
}

// 组件挂载时监听事件
onMounted(() => {
  window.addEventListener('dashboardPanelClosed', handlePanelClosed)
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener('dashboardPanelClosed', handlePanelClosed)
})

// 暴露方法给父组件
defineExpose({
  toggleDashboard
})
</script>

<style scoped>
.dashboard-button-container {
  position: absolute;
  top: 180px;
  left: 20px;
  z-index: 1000;
}

.dashboard-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dashboard-button:hover {
  background: rgba(100, 255, 218, 0.1);
  border-color: rgba(100, 255, 218, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(100, 255, 218, 0.2);
}

.dashboard-button.active {
  background: rgba(100, 255, 218, 0.2);
  border-color: rgba(100, 255, 218, 0.8);
  color: #64ffda;
}

.button-icon {
  font-size: 16px;
}

.button-text {
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-button-container {
    top: 150px;
    left: 10px;
  }
  
  .dashboard-button {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .button-text {
    display: none;
  }
}
</style>