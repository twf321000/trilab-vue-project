<template>
  <div class="app-header">
    <div class="logo">
      <!-- Logo区域背景SVG - 科技风格优化 -->
      <svg class="logo-bg" width="320" height="64" viewBox="0 0 320 64">
        <defs>
          <!-- 主背景渐变 -->
          <linearGradient id="techBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0a192f;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#112240;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0a192f;stop-opacity:1" />
          </linearGradient>
          
          <!-- 科技光效渐变 -->
          <linearGradient id="techGlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:0.4" />
            <stop offset="50%" style="stop-color:#64ffda;stop-opacity:0.5" />
            <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:0.4" />
          </linearGradient>
          
          <!-- 精细网格图案 -->
          <pattern id="techGridPattern" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#64ffda" stroke-width="0.2" opacity="0.15"/>
          </pattern>
          
          <!-- 数据流效果 - 更精致 -->
          <pattern id="dataFlowPattern" width="120" height="64" patternUnits="userSpaceOnUse">
            <rect width="120" height="64" fill="none"/>
            <path d="M0,18 L120,18" stroke="#00d4ff" stroke-width="1.5" opacity="0.4" stroke-dasharray="8,4">
              <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/>
            </path>
            <path d="M0,46 L120,46" stroke="#64ffda" stroke-width="1" opacity="0.3" stroke-dasharray="6,3">
              <animate attributeName="stroke-dashoffset" from="9" to="0" dur="2s" repeatCount="indefinite"/>
            </path>
          </pattern>
          
          <!-- 光晕效果 -->
          <filter id="techGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="glow"/>
          </filter>
          
          <!-- 扫描线效果 -->
          <pattern id="scanlinePattern" width="1" height="2" patternUnits="userSpaceOnUse">
            <rect width="1" height="1" fill="rgba(100, 255, 218, 0.08)"/>
            <rect y="1" width="1" height="1" fill="transparent"/>
          </pattern>
          
          <!-- 文字阴影效果 -->
          <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.3 0"/>
          </filter>
        </defs>
        
        <!-- 主背景 -->
        <rect width="320" height="64" fill="url(#techBgGradient)" />
        
        <!-- 精细网格背景 -->
        <rect width="320" height="64" fill="url(#techGridPattern)" opacity="0.3" />
        
        <!-- 扫描线效果 -->
        <rect width="320" height="64" fill="url(#scanlinePattern)" opacity="0.08" />
        
        <!-- 数据流动画 -->
        <rect width="320" height="64" fill="url(#dataFlowPattern)" opacity="0.25" />
        
        <!-- 中心光晕效果 -->
        <ellipse cx="160" cy="32" rx="140" ry="25" fill="url(#techGlowGradient)" opacity="0.12" filter="url(#techGlowFilter)" />
        
        <!-- 科技光带 - 顶部 -->
        <rect x="40" y="8" width="240" height="1" fill="#00d4ff" opacity="0.6" filter="url(#techGlowFilter)">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite"/>
        </rect>
        
        <!-- 科技光带 - 底部 -->
        <rect x="20" y="55" width="280" height="1" fill="#64ffda" opacity="0.5" filter="url(#techGlowFilter)">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite"/>
        </rect>
        
        <!-- 科技节点 - 更精致 -->
        <circle cx="60" cy="20" r="1.5" fill="#00d4ff" opacity="0.9">
          <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="260" cy="44" r="1.5" fill="#64ffda" opacity="0.9">
          <animate attributeName="r" values="1.5;2.5;1.5" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        
        <!-- 连接线 - 更优雅 -->
        <path d="M60,20 Q160,32 260,44" stroke="rgba(100, 255, 218, 0.25)" stroke-width="0.8" fill="none" stroke-dasharray="4,3">
          <animate attributeName="stroke-dashoffset" from="0" to="7" dur="2.5s" repeatCount="indefinite"/>
        </path>
        
        <!-- 边框光效 - 双层 -->
        <rect x="0" y="0" width="320" height="64" fill="none" stroke="rgba(100, 255, 218, 0.15)" stroke-width="0.8" />
        <rect x="1" y="1" width="318" height="62" fill="none" stroke="rgba(0, 212, 255, 0.08)" stroke-width="0.5" />
        
        <!-- 文字区域背景光效 -->
        <rect x="80" y="16" width="160" height="32" fill="rgba(0, 212, 255, 0.05)" rx="4" filter="url(#techGlowFilter)" />
      </svg>
      
      <!-- Logo内容 -->
      <div class="logo-content">
        <img src="/src/assets/images/logo.png" alt="Trilab Logo" class="logo-img" />
        <div class="logo-text">Trilab 通用三维可视化系统</div>
        <div class="logo-divider"></div>
      </div>
    </div>
    
    <div class="menu">
      <div 
        v-for="item in menuItems" 
        :key="item.path"
        class="menu-item"
        :class="{ 'active': activeMenu === item.path }"
        @click="handleMenuClick(item)"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-text">{{ item.name }}</span>
        <div class="menu-indicator"></div>
      </div>
    </div>
    
    <div class="header-right">
      <div class="user-info">
        <div class="user-avatar">
          <span class="avatar-text">{{ username.charAt(0).toUpperCase() }}</span>
        </div>
        <span class="username">{{ username }}</span>
        <div class="user-dropdown">
          <button class="dropdown-btn" @click="toggleDropdown">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
          <div v-if="showDropdown" class="dropdown-menu">
            <div class="dropdown-item" @click="handleUserAction('info')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span>个人信息</span>
            </div>
            <div class="dropdown-item" @click="handleUserAction('logout')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              <span>退出登录</span>
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
const activeMenu = ref('/')
const username = ref('admin')
const showDropdown = ref(false)

// 菜单配置
const menuItems = [
  { path: '/', name: '系统首页', icon: '🏠' },
  { path: '/map', name: '三维地图', icon: '🗺️' },
  { path: '/screen', name: '大屏展示', icon: '📺' },
  { path: '/settings', name: '系统设置', icon: '⚙️' }
]

// 菜单点击处理
const handleMenuClick = (item) => {
  activeMenu.value = item.path
  console.log('切换到菜单:', item.name)
  
  // 这里可以添加路由跳转逻辑
  // router.push(item.path)
}

// 用户操作处理
const handleUserAction = (action) => {
  showDropdown.value = false
  
  switch (action) {
    case 'info':
      console.log('查看个人信息')
      break
    case 'logout':
      console.log('退出登录')
      // 这里可以添加退出登录逻辑
      break
  }
}

// 切换下拉菜单
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// 点击其他地方关闭下拉菜单
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.user-dropdown')
  if (dropdown && !dropdown.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  background: linear-gradient(135deg, #0f1b2d 0%, #1a2b4a 100%);
  color: white;
  padding: 0 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  padding: 0 20px;
  margin-right: 20px;
  overflow: hidden;
}

.logo-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logo:hover .logo-bg {
  opacity: 1;
}

.logo-content {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 2;
}

.logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain; 
  transition: transform 0.3s ease;
}

.logo:hover .logo-img {
  transform: scale(1.1);
}

.logo-text {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1px;
  text-shadow: 
    0 0 10px rgba(0, 212, 255, 0.5),
    0 0 20px rgba(100, 255, 218, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.8);
  background: linear-gradient(135deg, #fff 0%, #e0f7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
  position: relative;
}

.logo:hover .logo-text {
  text-shadow: 
    0 0 15px rgba(0, 212, 255, 0.7),
    0 0 30px rgba(100, 255, 218, 0.5),
    0 2px 6px rgba(0, 0, 0, 0.9);
  transform: scale(1.02);
}

.logo-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.3);
}

.menu {
  display: flex;
  gap: 0;
  flex: 1;
  justify-content: center;
  height: 100%;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 32px;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-width: 120px;
  backdrop-filter: blur(10px);
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.menu-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #409eff, #67c23a);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.menu-item.active .menu-indicator {
  width: 60px;
}

.menu-icon {
  font-size: 18px;
  opacity: 0.9;
}

.menu-text {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.08);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #67c23a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.avatar-text {
  color: white;
}

.username {
  font-size: 14px;
  font-weight: 500;
}

.user-dropdown {
  position: relative;
}

.dropdown-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  min-width: 160px;
  z-index: 1001;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item svg {
  color: #666;
}

.dropdown-item:hover svg {
  color: #409eff;
}
</style>