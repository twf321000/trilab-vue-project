// 插件接口规范 - 定义插件开发的标准接口

/**
 * 插件接口规范
 * 所有插件都应该实现这个接口
 */
export const PluginInterface = {
  // 必需方法
  required: {
    /**
     * 初始化插件
     * @returns {Promise<void>}
     */
    initialize: 'function',
    
    /**
     * 销毁插件
     * @returns {Promise<void>}
     */
    destroy: 'function'
  },
  
  // 可选方法
  optional: {
    /**
     * 激活插件
     * @returns {Promise<void>}
     */
    activate: 'function',
    
    /**
     * 停用插件
     * @returns {Promise<void>}
     */
    deactivate: 'function',
    
    /**
     * 地图准备就绪时调用
     * @param {Object} map - 地图实例
     * @returns {Promise<void>}
     */
    onMapReady: 'function',
    
    /**
     * 地图销毁时调用
     * @returns {Promise<void>}
     */
    onMapDestroy: 'function',
    
    /**
     * 应用启动时调用
     * @returns {Promise<void>}
     */
    onAppStart: 'function',
    
    /**
     * 应用关闭时调用
     * @returns {Promise<void>}
     */
    onAppStop: 'function',
    
    /**
     * 获取插件信息
     * @returns {Object}
     */
    getInfo: 'function',
    
    /**
     * 更新配置
     * @param {Object} newConfig - 新配置
     */
    updateConfig: 'function'
  },
  
  // 事件系统
  events: {
    /**
     * 注册事件监听器
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    on: 'function',
    
    /**
     * 移除事件监听器
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    off: 'function',
    
    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param {any} data - 事件数据
     */
    emit: 'function'
  }
}

/**
 * 插件配置规范
 */
export const PluginConfigSchema = {
  // 必需配置
  required: {
    /**
     * 插件唯一标识
     * @type {string}
     */
    id: 'string',
    
    /**
     * 插件名称
     * @type {string}
     */
    name: 'string',
    
    /**
     * 插件版本
     * @type {string}
     */
    version: 'string'
  },
  
  // 可选配置
  optional: {
    /**
     * 插件描述
     * @type {string}
     */
    description: 'string',
    
    /**
     * 是否启用
     * @type {boolean}
     */
    enabled: 'boolean',
    
    /**
     * 插件路径
     * @type {string}
     */
    path: 'string',
    
    /**
     * 依赖项
     * @type {Array<string>}
     */
    dependencies: 'array',
    
    /**
     * 插件图标
     * @type {string}
     */
    icon: 'string',
    
    /**
     * 插件作者
     * @type {string}
     */
    author: 'string',
    
    /**
     * 插件分类
     * @type {string}
     */
    category: 'string',
    
    /**
     * 插件权限
     * @type {Array<string>}
     */
    permissions: 'array',
    
    /**
     * 插件设置
     * @type {Object}
     */
    settings: 'object'
  }
}

/**
 * 插件类型定义
 */
export const PluginTypes = {
  // 可视化插件 - 提供UI组件
  VISUALIZATION: 'visualization',
  
  // 功能插件 - 提供特定功能
  FUNCTIONAL: 'functional',
  
  // 数据插件 - 提供数据源
  DATA: 'data',
  
  // 工具插件 - 提供工具功能
  TOOL: 'tool',
  
  // 主题插件 - 提供主题样式
  THEME: 'theme',
  
  // 扩展插件 - 扩展核心功能
  EXTENSION: 'extension'
}

/**
 * 插件事件类型
 */
export const PluginEvents = {
  // 生命周期事件
  INITIALIZED: 'initialized',
  DESTROYED: 'destroyed',
  ACTIVATED: 'activated',
  DEACTIVATED: 'deactivated',
  
  // 地图相关事件
  MAP_READY: 'mapReady',
  MAP_DESTROY: 'mapDestroy',
  MAP_LOADED: 'mapLoaded',
  MAP_ERROR: 'mapError',
  
  // 数据相关事件
  DATA_LOADED: 'dataLoaded',
  DATA_UPDATED: 'dataUpdated',
  DATA_ERROR: 'dataError',
  
  // UI相关事件
  UI_READY: 'uiReady',
  UI_DESTROY: 'uiDestroy',
  
  // 自定义事件
  CUSTOM: 'custom'
}

/**
 * 插件验证器
 */
export class PluginValidator {
  /**
   * 验证插件是否符合接口规范
   * @param {Object} plugin - 插件实例
   * @returns {boolean}
   */
  static validatePlugin(plugin) {
    // 检查必需方法
    for (const [method, type] of Object.entries(PluginInterface.required)) {
      if (typeof plugin[method] !== type) {
        console.error(`❌ 插件缺少必需方法: ${method}`)
        return false
      }
    }
    
    // 检查可选方法（不强制要求）
    for (const [method, type] of Object.entries(PluginInterface.optional)) {
      if (plugin[method] && typeof plugin[method] !== type) {
        console.warn(`⚠️ 插件方法类型不匹配: ${method}`)
      }
    }
    
    return true
  }
  
  /**
   * 验证插件配置
   * @param {Object} config - 插件配置
   * @returns {boolean}
   */
  static validateConfig(config) {
    // 检查必需配置
    for (const [key, type] of Object.entries(PluginConfigSchema.required)) {
      if (!config[key] || typeof config[key] !== type) {
        console.error(`❌ 插件配置缺少必需项: ${key}`)
        return false
      }
    }
    
    // 检查可选配置
    for (const [key, type] of Object.entries(PluginConfigSchema.optional)) {
      if (config[key] && typeof config[key] !== type) {
        console.warn(`⚠️ 插件配置类型不匹配: ${key}`)
      }
    }
    
    return true
  }
  
  /**
   * 获取插件验证报告
   * @param {Object} plugin - 插件实例
   * @param {Object} config - 插件配置
   * @returns {Object}
   */
  static getValidationReport(plugin, config) {
    const report = {
      isValid: true,
      errors: [],
      warnings: []
    }
    
    // 验证插件
    for (const [method, type] of Object.entries(PluginInterface.required)) {
      if (typeof plugin[method] !== type) {
        report.errors.push(`缺少必需方法: ${method}`)
        report.isValid = false
      }
    }
    
    // 验证配置
    for (const [key, type] of Object.entries(PluginConfigSchema.required)) {
      if (!config[key] || typeof config[key] !== type) {
        report.errors.push(`缺少必需配置: ${key}`)
        report.isValid = false
      }
    }
    
    return report
  }
}

export default PluginInterface