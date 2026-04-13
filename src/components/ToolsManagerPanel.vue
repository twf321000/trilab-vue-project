<template>
  <div class="tools-manager-panel" v-if="showPanel">
    <div class="panel-header">
      <div class="panel-title">测量工具</div>
      <div class="panel-close" @click="closePanel">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </div>
    </div>
    
    <div class="panel-content">
      <!-- 测量状态显示 -->
      <div class="measure-status" v-if="currentMeasureType">
        <div class="status-icon">📏</div>
        <div class="status-text">{{ measureStatus }}</div>
      </div>
      
      <!-- 测量工具列表 -->
      <div class="tools-list">
        <div 
          class="tool-item" 
          :class="{ 'active': currentMeasureType === 'point' }"
          @click="startPointMeasure"
        >
          <div class="tool-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div class="tool-text">点坐标测量</div>
        </div>
        
        <div 
          class="tool-item" 
          :class="{ 'active': currentMeasureType === 'line' }"
          @click="startLineMeasure"
        >
          <div class="tool-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </div>
          <div class="tool-text">线距离测量</div>
        </div>
        
        <div 
          class="tool-item" 
          :class="{ 'active': currentMeasureType === 'area' }"
          @click="startAreaMeasure"
        >
          <div class="tool-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            </svg>
          </div>
          <div class="tool-text">面面积测量</div>
        </div>
        
        <div 
          class="tool-item" 
          :class="{ 'active': currentMeasureType === 'height' }"
          @click="startHeightMeasure"
        >
          <div class="tool-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L4 21h16L12 3zm0 4.5l4.5 10.5h-9L12 7.5z"/>
            </svg>
          </div>
          <div class="tool-text">高度测量</div>
        </div>
        
        <div 
          class="tool-item" 
          :class="{ 'active': currentMeasureType === 'angle' }"
          @click="startAngleMeasure"
        >
          <div class="tool-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </div>
          <div class="tool-text">角度测量</div>
        </div>
        
        <div class="tool-item" @click="clearMeasurements">
          <div class="tool-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </div>
          <div class="tool-text">清除测量</div>
        </div>
        
        <div class="tool-item" @click="stopMeasure" v-if="isMeasuring">
          <div class="tool-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h12v12H6z"/>
            </svg>
          </div>
          <div class="tool-text">停止测量</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import trilab from '../TriLab.js'

// 响应式数据
const showPanel = ref(false)  // 修改为true，一开始就显示
const isMeasuring = ref(false)
const currentMeasureType = ref('')
const currentMeasure = ref(null)
const measureStatus = ref('请选择测量工具')

// 全局测量工具实例
let measureToolInstance = null

// 测量符号样式（参考代码中的样式）
const measureSymbol = {
  pointStyle: {
    nodeSphereColor: "#ff0000",
    midPointSphereColor: "#ff00000",
    nodeSphereSize: 0.1,
    midPointSphereSize: 0.08,
    sizeAttenuation: false,
  },
  lineStyle: {
    color: "#00aaff",
    vertexColor: "#ffd700",
    lineWidth: 2,
  },
  textStyle: {
    sizeAttenuation: false,
    labelColor: { r: 255, g: 255, b: 255, a: 1 },
    labelFontSize: 24,
    labelBorderColor: { r: 51, g: 51, b: 51, a: 1 },
    labelBgColor: { r: 0, g: 0, b: 0, a: 1 },
  },
  nodeSphereSize: 3,
  midPointSphereSize: 3,
  nodeSphereColor: "#ff0000",
  midPointSphereColor: "#00ff00",
}

// 监听工具管理器显示/隐藏事件
const handleToolsManagerToggle = (event) => {
  showPanel.value = event.detail.show
}

// 关闭面板
const closePanel = () => {
  showPanel.value = false
  stopMeasure()
  const event = new CustomEvent('toolsManagerToggle', {
    detail: { show: false }
  })
  window.dispatchEvent(event)
}

// 更新测量状态显示
const updateMeasureStatus = (message) => {
  measureStatus.value = message
  console.log('测量状态:', message)
}

// 开始点测量
const startPointMeasure = () => {
  if (isMeasuring.value && currentMeasureType.value === 'point') {
    stopMeasure()
    return
  }
  
  if (isMeasuring.value) {
    stopMeasure()
  }
  
  if (window.trilabMap && trilab) {
    try {
      // 使用全局测量工具实例
      if (!measureToolInstance) {
        measureToolInstance = new trilab.tool.Measure()
        window.trilabMap.addTool(measureToolInstance)
      }
      
      isMeasuring.value = true
      currentMeasureType.value = 'point'
      
      currentMeasure.value = measureToolInstance.point({
        onComplete: (measurePoint) => {
          console.log('点测量完成:', measurePoint)
          const coordinates = measurePoint.getCoordinates ? measurePoint.getCoordinates() : 'N/A'
          updateMeasureStatus(`点测量完成 - 坐标: ${coordinates}`)
          
          isMeasuring.value = false
          currentMeasureType.value = ''
          currentMeasure.value = null
        },
        onUpdate: (event) => {
          const measurePoint = event.target
          if (measurePoint && measurePoint.update) {
            measurePoint.update()
          }
        },
        symbol: {
          ...measureSymbol,
          showCoordinates: true,
          textStyle: {
            ...measureSymbol.textStyle,
            labelFontSize: 20,
            labelColor: { r: 255, g: 255, b: 255, a: 1 },
            labelBorderColor: { r: 0, g: 0, b: 0, a: 1 },
            labelBgColor: { r: 0, g: 0, b: 0, a: 0.8 },
            sizeAttenuation: false
          }
        },
      })
      
      updateMeasureStatus('开始点测量 - 左键点击添加点')
    } catch (error) {
      console.error('点测量启动失败:', error)
      updateMeasureStatus('点测量启动失败')
    }
  } else {
    console.log('使用模拟点测量逻辑')
    isMeasuring.value = true
    currentMeasureType.value = 'point'
    updateMeasureStatus('开始点测量 - 左键点击添加点')
  }
}

// 开始线测量
const startLineMeasure = () => {
  if (isMeasuring.value && currentMeasureType.value === 'line') {
    stopMeasure()
    return
  }
  
  if (isMeasuring.value) {
    stopMeasure()
  }
  
  if (window.trilabMap && trilab) {
    try {
      // 使用全局测量工具实例
      if (!measureToolInstance) {
        measureToolInstance = new trilab.tool.Measure()
        window.trilabMap.addTool(measureToolInstance)
      }
      
      isMeasuring.value = true
      currentMeasureType.value = 'line'
      
      currentMeasure.value = measureToolInstance.distance({
        onComplete: (measureLine) => {
          console.log('线测量完成:', measureLine)
          const totalDistance = measureLine.getTotalDistance ? measureLine.getTotalDistance() : 'N/A'
          updateMeasureStatus(`测量完成 - 总长度: ${totalDistance}米`)
          
          isMeasuring.value = false
          currentMeasureType.value = ''
          currentMeasure.value = null
        },
        onUpdate: (event) => {
          const measureLine = event.target
          if (measureLine && measureLine.points) {
            const pointCount = measureLine.points.length
            const currentDistance = measureLine.getCurrentDistance ? measureLine.getCurrentDistance() : 'N/A'
            updateMeasureStatus(`测量中 - 已添加${pointCount}个点，当前长度: ${currentDistance}米`)
          }
        },
        symbol: measureSymbol,
      })
      
      updateMeasureStatus('开始线测量 - 左键添加点，右键结束')
    } catch (error) {
      console.error('线测量启动失败:', error)
      updateMeasureStatus('线测量启动失败')
    }
  } else {
    console.log('使用模拟线测量逻辑')
    isMeasuring.value = true
    currentMeasureType.value = 'line'
    updateMeasureStatus('开始线测量 - 左键添加点，右键结束')
  }
}

// 开始面积测量
const startAreaMeasure = () => {
  if (isMeasuring.value && currentMeasureType.value === 'area') {
    stopMeasure()
    return
  }
  
  if (isMeasuring.value) {
    stopMeasure()
  }
  
  if (window.trilabMap && trilab) {
    try {
      // 使用全局测量工具实例
      if (!measureToolInstance) {
        measureToolInstance = new trilab.tool.Measure()
        window.trilabMap.addTool(measureToolInstance)
      }
      
      isMeasuring.value = true
      currentMeasureType.value = 'area'
      
      currentMeasure.value = measureToolInstance.area({
        onComplete: (measureArea) => {
          console.log('面积测量完成:', measureArea)
          const totalArea = measureArea.getTotalArea ? measureArea.getTotalArea() : 'N/A'
          updateMeasureStatus(`面积测量完成 - 总面积: ${totalArea}平方米`)
          
          isMeasuring.value = false
          currentMeasureType.value = ''
          currentMeasure.value = null
        },
        onUpdate: (event) => {
          const measureArea = event.target
          if (measureArea && measureArea.points) {
            const pointCount = measureArea.points.length
            const currentArea = measureArea.getCurrentArea ? measureArea.getCurrentArea() : 'N/A'
            updateMeasureStatus(`测量中 - 已添加${pointCount}个点，当前面积: ${currentArea}平方米`)
          }
        },
        symbol: measureSymbol,
      })
      
      updateMeasureStatus('开始面积测量 - 左键添加点，右键结束')
    } catch (error) {
      console.error('面积测量启动失败:', error)
      updateMeasureStatus('面积测量启动失败')
    }
  } else {
    console.log('使用模拟面积测量逻辑')
    isMeasuring.value = true
    currentMeasureType.value = 'area'
    updateMeasureStatus('开始面积测量 - 左键添加点，右键结束')
  }
}

// 开始高度测量
const startHeightMeasure = () => {
  if (isMeasuring.value && currentMeasureType.value === 'height') {
    stopMeasure()
    return
  }
  
  if (isMeasuring.value) {
    stopMeasure()
  }
  
  if (window.trilabMap && trilab) {
    try {
      // 使用全局测量工具实例
      if (!measureToolInstance) {
        measureToolInstance = new trilab.tool.Measure()
        window.trilabMap.addTool(measureToolInstance)
      }
      
      isMeasuring.value = true
      currentMeasureType.value = 'height'
      
      currentMeasure.value = measureToolInstance.height({
        onComplete: (measureHeight) => {
          console.log('高度测量完成:', measureHeight)
          const heightValue = measureHeight.getHeight ? measureHeight.getHeight() : 'N/A'
          updateMeasureStatus(`高度测量完成 - 高度: ${heightValue}米`)
          
          isMeasuring.value = false
          currentMeasureType.value = ''
          currentMeasure.value = null
        },
        onUpdate: (event) => {
          const measureHeight = event.target
          if (measureHeight && measureHeight.points) {
            const pointCount = measureHeight.points.length
            const currentHeight = measureHeight.getCurrentHeight ? measureHeight.getCurrentHeight() : 'N/A'
            updateMeasureStatus(`测量中 - 已添加${pointCount}个点，当前高度: ${currentHeight}米`)
          }
        },
        symbol: measureSymbol,
      })
      
      updateMeasureStatus('开始高度测量 - 左键点击测量点')
    } catch (error) {
      console.error('高度测量启动失败:', error)
      updateMeasureStatus('高度测量启动失败')
    }
  } else {
    console.log('使用模拟高度测量逻辑')
    isMeasuring.value = true
    currentMeasureType.value = 'height'
    updateMeasureStatus('开始高度测量 - 左键点击测量点')
  }
}

// 开始角度测量
const startAngleMeasure = () => {
  if (isMeasuring.value && currentMeasureType.value === 'angle') {
    stopMeasure()
    return
  }
  
  if (isMeasuring.value) {
    stopMeasure()
  }
  
  if (window.trilabMap && trilab) {
    try {
      // 使用全局测量工具实例
      if (!measureToolInstance) {
        measureToolInstance = new trilab.tool.Measure()
        window.trilabMap.addTool(measureToolInstance)
      }
      
      isMeasuring.value = true
      currentMeasureType.value = 'angle'
      
      currentMeasure.value = measureToolInstance.angle({
        onComplete: (measureAngle) => {
          console.log('角度测量完成:', measureAngle)
          const angleValue = measureAngle.getAngle ? measureAngle.getAngle() : 'N/A'
          updateMeasureStatus(`角度测量完成 - 角度: ${angleValue}°`)
          
          isMeasuring.value = false
          currentMeasureType.value = ''
          currentMeasure.value = null
        },
        onUpdate: (event) => {
          const measureAngle = event.target
          if (measureAngle && measureAngle.points) {
            const pointCount = measureAngle.points.length
            const currentAngle = measureAngle.getCurrentAngle ? measureAngle.getCurrentAngle() : 'N/A'
            updateMeasureStatus(`测量中 - 已添加${pointCount}个点，当前角度: ${currentAngle}°`)
          }
        },
        symbol: measureSymbol,
      })
      
      updateMeasureStatus('开始角度测量 - 左键添加点，右键结束')
    } catch (error) {
      console.error('角度测量启动失败:', error)
      updateMeasureStatus('角度测量启动失败')
    }
  } else {
    console.log('使用模拟角度测量逻辑')
    isMeasuring.value = true
    currentMeasureType.value = 'angle'
    updateMeasureStatus('开始角度测量 - 左键添加点，右键结束')
  }
}

// 停止测量
const stopMeasure = () => {
  if (currentMeasure.value && currentMeasure.value.complete) {
    currentMeasure.value.complete()
  }
  
  isMeasuring.value = false
  currentMeasureType.value = ''
  currentMeasure.value = null
  updateMeasureStatus('测量已结束')
}

// 清除测量
const clearMeasurements = () => {
  console.log('清除所有测量结果')
  
  // 停止当前测量
  stopMeasure()
  
  // 清除测量结果（通过测量工具实例）
  if (window.trilabMap && measureToolInstance) {
    try {
      // 使用全局测量工具实例来清除
      if (measureToolInstance.clear) {
        measureToolInstance.clear()
        console.log('使用全局测量工具实例清除测量结果')
      } else {
        console.log('测量工具没有clear方法，使用默认清除逻辑')
      }
    } catch (error) {
      console.error('清除测量失败:', error)
    }
  } else {
    console.log('测量工具实例不存在，使用默认清除逻辑')
  }
  
  updateMeasureStatus('测量结果已清除')
}

onMounted(() => {
  window.addEventListener('toolsManagerToggle', handleToolsManagerToggle)
})

onUnmounted(() => {
  window.removeEventListener('toolsManagerToggle', handleToolsManagerToggle)
  stopMeasure()
})

// 暴露方法
defineExpose({
  closePanel
})
</script>

<style scoped>
.tools-manager-panel {
  position: absolute;
  right: 40px;
  top: 70px;
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  z-index: 998;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
}

.panel-title {
  font-size: 16px;
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
  border-radius: 4px;
  transition: background 0.3s ease;
}

.panel-close:hover {
  background: rgba(0, 0, 0, 0.05);
}

.panel-content {
  padding: 0 20px 20px;
  max-height: 400px;
  overflow-y: auto;
}

/* 测量状态显示 */
.measure-status {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f0f7ff;
  border-bottom: 1px solid #e1f0ff;
  margin-bottom: 8px;
}

.status-icon {
  font-size: 16px;
  margin-right: 8px;
}

.status-text {
  font-size: 13px;
  color: #1890ff;
  font-weight: 500;
  flex: 1;
}

.tools-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.tool-item:hover {
  background: rgba(64, 158, 255, 0.1);
  border-color: #409eff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.tool-item:active {
  transform: translateY(0);
}

.tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #333;
  margin-bottom: 6px;
}

.tool-item:hover .tool-icon {
  color: #409eff;
}

.tool-text {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

.tool-item:hover .tool-text {
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tools-manager-panel {
    right: 70px;
    top: 10px;
    width: 250px;
  }
  
  .panel-header {
    padding: 12px 16px;
  }
  
  .panel-content {
    padding: 0 16px 16px;
  }
  
  .tools-list {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .tool-item {
    padding: 10px 8px;
  }
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
</style>