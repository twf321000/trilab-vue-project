<template>
  <div class="basemap-switcher-button" :class="{ 'active': showBasemapSwitcher }" @click="toggleBasemapSwitcher">
    <div class="button-icon">
      <svg width="16" height="16" viewBox="0 0 48 48" fill="currentColor">
        <path d="M24 44.0002C35.0457 44.0002 44 35.0459 44 24.0002C44 12.9545 35.0457 4.00024 24 4.00024C12.9543 4.00024 4 12.9545 4 24.0002C4 35.0459 12.9543 44.0002 24 44.0002Z" stroke="#41A8FF" stroke-width="4"/>
        <path d="M6 30.9856C8.63192 32.041 10.5266 32.041 11.6839 30.9856C13.4199 29.4025 11.9219 24.5978 14.3532 23.2727C16.7844 21.9476 20.4886 27.8214 23.9508 25.8887C27.4129 23.9559 23.6246 18.8023 26.0272 16.713C28.4298 14.6237 31.554 16.98 32.1001 13.4865C32.6462 9.99304 29.5521 11.5082 28.9584 8.20693C28.5625 6.00611 28.5625 4.84884 28.9584 4.73511" stroke="#41A8FF" stroke-width="4" stroke-linecap="round"/>
        <path d="M29.0209 43.3505C27.1468 41.4325 26.4721 39.6497 26.9969 38.0019C27.7841 35.5303 29.0826 35.6764 29.6488 34.1482C30.2149 32.6199 28.6156 30.4433 32.1643 28.5826C34.5301 27.3421 37.783 28.7794 41.9228 32.8944" stroke="#41A8FF" stroke-width="4" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="button-text">底图</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showBasemapSwitcher = ref(false)

const emit = defineEmits(['toggle'])

const toggleBasemapSwitcher = () => {
  showBasemapSwitcher.value = !showBasemapSwitcher.value
  emit('toggle', showBasemapSwitcher.value)
}

const openBasemapSwitcher = () => {
  showBasemapSwitcher.value = true
  emit('toggle', true)
}

const closeBasemapSwitcher = () => {
  showBasemapSwitcher.value = false
  emit('toggle', false)
}

defineExpose({
  openBasemapSwitcher,
  closeBasemapSwitcher,
  toggleBasemapSwitcher
})
</script>

<style scoped>
.basemap-switcher-button {
  position: absolute;
  right: 230px;
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

.basemap-switcher-button:hover {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.basemap-switcher-button.active {
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

.basemap-switcher-button.active .button-icon {
  color: #409eff;
}

.button-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.basemap-switcher-button.active .button-text {
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .basemap-switcher-button {
    right: 10px;
    top: 80px;
    padding: 6px 10px;
  }
  
  .button-text {
    font-size: 12px;
  }
}
</style>