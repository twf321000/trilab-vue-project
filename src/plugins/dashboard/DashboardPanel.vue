<template>
  <div class="dashboard-panel" v-show="showPanel">
    <div class="dashboard-header">
      <h3>📊 数据仪表盘</h3>
      <button class="dashboard-close-btn" @click="closePanel">×</button>
    </div>
    
    <div class="dashboard-content">
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalData }}</div>
            <div class="stat-label">总数据量</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⚡</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.efficiency }}%</div>
            <div class="stat-label">处理效率</div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-controls">
        <button class="dashboard-refresh-btn" @click="refreshData" :disabled="refreshing">
          {{ refreshing ? '刷新中...' : '🔄 刷新数据' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

// 响应式数据
const showPanel = ref(false)
const refreshing = ref(false)

// 统计数据
const stats = reactive({
  totalData: '1,234',
  efficiency: '98'
})

// 打开面板
const openPanel = () => {
  showPanel.value = true
}

// 关闭面板
const closePanel = () => {
  showPanel.value = false
  // 触发关闭事件
  window.dispatchEvent(new CustomEvent('dashboardPanelClosed'))
}

// 刷新数据
const refreshData = async () => {
  refreshing.value = true
  
  // 模拟数据加载延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 更新模拟数据
  stats.totalData = Math.floor(Math.random() * 1000 + 1000).toLocaleString()
  stats.efficiency = Math.floor(Math.random() * 20 + 80)
  
  refreshing.value = false
  alert('数据已刷新！')
}

// 监听打开事件
const handleDashboardOpened = () => {
  openPanel()
}

// 监听关闭事件
const handleDashboardClosed = () => {
  closePanel()
}

// 组件挂载时监听事件
onMounted(() => {
  window.addEventListener('dashboardOpened', handleDashboardOpened)
  window.addEventListener('dashboardClosed', handleDashboardClosed)
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener('dashboardOpened', handleDashboardOpened)
  window.removeEventListener('dashboardClosed', handleDashboardClosed)
})

// 暴露方法给父组件
defineExpose({
  openPanel,
  closePanel,
  refreshData
})
</script>

<style scoped>
.dashboard-panel {
  position: absolute;
  top: 180px;
  left: 20px;
  width: 400px;
  max-height: 600px;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: 12px;
  color: white;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(100, 255, 218, 0.2);
}

.dashboard-header h3 {
  margin: 0;
  color: #64ffda;
  font-size: 16px;
}

.dashboard-close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background 0.2s;
}

.dashboard-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dashboard-content {
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
}

.stats-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-icon {
  font-size: 24px;
  margin-right: 12px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #64ffda;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.dashboard-controls {
  text-align: center;
}

.dashboard-refresh-btn {
  padding: 8px 16px;
  background: rgba(100, 255, 218, 0.2);
  color: white;
  border: 1px solid rgba(100, 255, 218, 0.4);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dashboard-refresh-btn:hover {
  background: rgba(100, 255, 218, 0.3);
  border-color: rgba(100, 255, 218, 0.6);
}

.dashboard-refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-panel {
    width: 90%;
    left: 5%;
    top: 150px;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>