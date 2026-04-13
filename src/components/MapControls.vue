<template>
  <div class="map-controls">
    <!-- 放大缩小 -->
    <div class="viewport-wrap">
      <div class="viewport-item" title="放大" @click="zoomIn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </div>
      
      <div class="viewport-item" title="缩小" @click="zoomOut">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13H5v-2h14v2z"/>
        </svg>
      </div>
    </div>

    <!-- 全屏按钮 -->
    <div class="viewport-wrap">
      <div class="viewport-item" title="全屏" @click="toggleFullscreen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path v-if="!isFullscreen" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          <path v-else d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
        </svg>
      </div>
    </div>

    <!-- 视角还原 -->
    <div class="viewport-wrap">
      <div class="viewport-item" title="视角还原" @click="resetViewClick">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
        </svg>
      </div>
    </div>

    <!-- 操作指南 -->
    <div class="viewport-wrap">
      <div class="viewport-item" title="操作指南" @click="toggleOperateGuide">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
      </div>
    </div>

    <!-- 鼠标操作指南 -->
    <div class="tp-operate" :class="{ 'active': showOperateGuide }">
      <div class="tp-tabs-wrap">
        <div class="tp-tab-item" :class="{ 'active': operateActiveIndex === 0 }" @click="operateActiveChange(0)">鼠标操作</div>
        <div class="tp-tab-item" :class="{ 'active': operateActiveIndex === 1 }" @click="operateActiveChange(1)">触摸手势</div>
      </div>

      <!-- 内容 -->
      <div class="tp-operate-content">
        <div class="tp-operate-wrap" v-if="operateActiveIndex === 0">
          <div class="tp-operate-item">
            <div class="tp-operate-img">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 6v3h3v2h-3v3h-2v-3H8V9h3V6h2zm5 4.5C18 5.57 15.35 3 12 3S6 5.57 6 10.5c0 3.03 2.21 5.55 5.12 5.96V21h1.76v-4.54c2.91-.41 5.12-2.93 5.12-5.96z"/>
              </svg>
            </div>
            <div class="tp-operate-info">
              <div class="tp-operate-title">平移视图</div>
              <div class="tp-operate-text">鼠标左键+拖拽</div>
            </div>
          </div>

          <div class="tp-operate-item">
            <div class="tp-operate-img">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>
            <div class="tp-operate-info">
              <div class="tp-operate-title">缩放视图</div>
              <div class="tp-operate-text">右键+拖拽，或者中间滚动</div>
            </div>
          </div>

          <div class="tp-operate-item">
            <div class="tp-operate-img">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.5-12.5L12 6l-4.5 1.5L6 12l1.5 4.5L12 18l4.5-1.5L18 12l-1.5-4.5z"/>
              </svg>
            </div>
            <div class="tp-operate-info">
              <div class="tp-operate-title">旋转视图</div>
              <div class="tp-operate-text">按ctrl键同时左/右键拖拽</div>
            </div>
          </div>
        </div>

        <div class="tp-operate-wrap" v-if="operateActiveIndex === 1">
          <div class="tp-operate-item">
            <div class="tp-operate-img">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
              </svg>
            </div>
            <div class="tp-operate-info">
              <div class="tp-operate-title">平移视图</div>
              <div class="tp-operate-text">单指拖动</div>
            </div>
          </div>

          <div class="tp-operate-item">
            <div class="tp-operate-img">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>
            <div class="tp-operate-info">
              <div class="tp-operate-title">缩放视图</div>
              <div class="tp-operate-text">双指向内或者向外滑动</div>
            </div>
          </div>

          <div class="tp-operate-item">
            <div class="tp-operate-img">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.5-12.5L12 6l-4.5 1.5L6 12l1.5 4.5L12 18l4.5-1.5L18 12l-1.5-4.5z"/>
              </svg>
            </div>
            <div class="tp-operate-info">
              <div class="tp-operate-title">倾斜视图</div>
              <div class="tp-operate-text">双指按相同方向拖动</div>
            </div>
          </div>

          <div class="tp-operate-item">
            <div class="tp-operate-img">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.5-12.5L12 6l-4.5 1.5L6 12l1.5 4.5L12 18l4.5-1.5L18 12l-1.5-4.5z"/>
              </svg>
            </div>
            <div class="tp-operate-info">
              <div class="tp-operate-title">旋转视图</div>
              <div class="tp-operate-text">双指按相反方向拖动</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式数据
const isFullscreen = ref(false)
const showOperateGuide = ref(false)
const operateActiveIndex = ref(0)

// 视角还原
const resetViewClick = () => {
  console.log('视角还原')
  if (window.trilabMap && window.trilabMap.flyTo) {
    const center = [2938834.56, 4851421.1815]
    window.trilabMap.flyTo([center[0], center[1], 1000], [center[0], center[1], 0])
  } else {
    console.log('使用默认视角还原逻辑')
  }
}

// 放大功能
const zoomIn = () => {
  console.log('放大地图')
  if (window.trilabMap && window.trilabMap.zoomIn) {
    window.trilabMap.zoomIn()
  } else {
    console.log('使用默认放大逻辑')
  }
}

// 缩小功能
const zoomOut = () => {
  console.log('缩小地图')
  if (window.trilabMap && window.trilabMap.zoomOut) {
    window.trilabMap.zoomOut()
  } else {
    console.log('使用默认缩小逻辑')
  }
}

// 切换全屏功能
const toggleFullscreen = () => {
  const element = document.documentElement
  
  if (!isFullscreen.value) {
    // 进入全屏
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}

// 切换操作指南显示
const toggleOperateGuide = () => {
  showOperateGuide.value = !showOperateGuide.value
}

// 切换操作指南标签页
const operateActiveChange = (index) => {
  operateActiveIndex.value = index
}

// 监听全屏变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  )
}

onMounted(() => {
  // 添加全屏变化监听器
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)
})

onUnmounted(() => {
  // 移除全屏变化监听器
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
})
</script>

<style scoped>
.map-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 1;
}

.viewport-wrap {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-top: 10px;
  padding: 0 4px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #ffffff;
  border-radius: 6px;
}

.viewport-item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: 22px;
  padding: 6px 0;
  color: #0D867F;
  cursor: pointer;
}

.viewport-item:first-child:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  border-bottom: 1px solid #ffffff;
}

.viewport-item:hover {
  background: rgba(13, 134, 127, 0.1);
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-controls {
    left: 10px;
    bottom: 10px;
  }
}

/* 操作指南样式 */
.tp-operate {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: absolute;
  right: -14px;
  bottom: 0;
  transform-origin: left bottom;
  transform: translateX(100%) scale(0);
  box-sizing: border-box;
  width: 224px;
  height: 280px;
  border-radius: 8px;
  background: rgba(6, 6, 6, 0.6);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  box-shadow: inset 0px 0px 14.22px 0px rgba(16, 16, 16, 0.3);
  transition: all 0.3s ease-in-out;
}

.tp-operate.active {
  transform: translateX(100%) scale(1);
}

/* tabs */
.tp-tabs-wrap {
  flex: 0 0 34px;
  display: flex;
  width: 100%;
  height: 34px;
}

.tp-tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  color: #ffffff;
  font-family: Source Han Sans;
  font-size: 14px;
  cursor: pointer;
}

.tp-tab-item.active {
  background: rgba(13, 134, 127, 0.6);
}

.tp-operate-content {
  box-sizing: border-box;
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  max-height: 230px;
}

.tp-operate-content::-webkit-scrollbar {
  width: 4px;
}

.tp-operate-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.tp-operate-content::-webkit-scrollbar-thumb {
  background: rgba(13, 134, 127, 0.6);
  border-radius: 2px;
}

.tp-operate-content::-webkit-scrollbar-thumb:hover {
  background: rgba(13, 134, 127, 0.8);
}

.tp-operate-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: fit-content;
}

.tp-operate-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.tp-operate-img {
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0D867F;
}

.tp-operate-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tp-operate-title {
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
}

.tp-operate-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
}

/* 全屏状态下的样式调整 */
@media (min-width: 1200px) {
  .map-controls {
    left: 30px;
    bottom: 40px;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .map-controls {
    background: rgba(0, 0, 0, 0.8);
    border: 1.5px solid #ffffff;
  }
  
  .viewport-item:hover {
    background: rgba(13, 134, 127, 0.6);
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .viewport-item {
    transition: none;
  }
  
  .viewport-item:hover {
    transform: none;
  }
}
</style>