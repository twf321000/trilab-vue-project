/**
 * 三维引擎抽象接口定义
 * 支持多种三维引擎的统一接口，便于切换和扩展
 */

export class EngineInterface {
  /**
   * 引擎类型枚举
   */
  static EngineType = {
    TRILAB: 'trilab',
    CESIUM: 'cesium',
    THREEJS: 'threejs',
    MAPBOX: 'mapbox'
  }

  /**
   * 场景配置接口
   */
  static SceneConfig = {
    container: null,           // 容器元素
    camera: {
      position: { x: 0, y: 0, z: 0 },
      target: { x: 0, y: 0, z: 0 }
    },
    renderer: {
      antialias: true,
      alpha: true
    }
  }

  /**
   * 图层配置接口
   */
  static LayerConfig = {
    id: '',
    name: '',
    type: '',           // 'tile', 'vector', '3d-model', 'point-cloud'
    url: '',
    visible: true,
    opacity: 1.0,
    zIndex: 0
  }

  /**
   * 相机操作接口
   */
  static CameraOperation = {
    ZOOM_IN: 'zoomIn',
    ZOOM_OUT: 'zoomOut',
    ROTATE_LEFT: 'rotateLeft',
    ROTATE_RIGHT: 'rotateRight',
    PAN_UP: 'panUp',
    PAN_DOWN: 'panDown',
    RESET: 'reset'
  }

  /**
   * 初始化引擎
   * @param {SceneConfig} config - 场景配置
   * @returns {Promise<boolean>}
   */
  async initialize(config) {
    throw new Error('initialize method must be implemented')
  }

  /**
   * 销毁引擎
   */
  async destroy() {
    throw new Error('destroy method must be implemented')
  }

  /**
   * 添加图层
   * @param {LayerConfig} layerConfig - 图层配置
   * @returns {Promise<string>} - 图层ID
   */
  async addLayer(layerConfig) {
    throw new Error('addLayer method must be implemented')
  }

  /**
   * 移除图层
   * @param {string} layerId - 图层ID
   */
  async removeLayer(layerId) {
    throw new Error('removeLayer method must be implemented')
  }

  /**
   * 设置图层可见性
   * @param {string} layerId - 图层ID
   * @param {boolean} visible - 是否可见
   */
  async setLayerVisibility(layerId, visible) {
    throw new Error('setLayerVisibility method must be implemented')
  }

  /**
   * 设置图层透明度
   * @param {string} layerId - 图层ID
   * @param {number} opacity - 透明度 (0-1)
   */
  async setLayerOpacity(layerId, opacity) {
    throw new Error('setLayerOpacity method must be implemented')
  }

  /**
   * 相机操作
   * @param {CameraOperation} operation - 操作类型
   * @param {number} amount - 操作量
   */
  async cameraOperation(operation, amount = 1) {
    throw new Error('cameraOperation method must be implemented')
  }

  /**
   * 设置相机位置
   * @param {Object} position - 相机位置 {x, y, z}
   * @param {Object} target - 观察目标 {x, y, z}
   */
  async setCamera(position, target) {
    throw new Error('setCamera method must be implemented')
  }

  /**
   * 获取相机信息
   * @returns {Object} - 相机位置和观察目标
   */
  async getCameraInfo() {
    throw new Error('getCameraInfo method must be implemented')
  }

  /**
   * 添加三维模型
   * @param {Object} modelConfig - 模型配置
   * @returns {Promise<string>} - 模型ID
   */
  async addModel(modelConfig) {
    throw new Error('addModel method must be implemented')
  }

  /**
   * 移除三维模型
   * @param {string} modelId - 模型ID
   */
  async removeModel(modelId) {
    throw new Error('removeModel method must be implemented')
  }

  /**
   * 添加标注点
   * @param {Object} markerConfig - 标注配置
   * @returns {Promise<string>} - 标注ID
   */
  async addMarker(markerConfig) {
    throw new Error('addMarker method must be implemented')
  }

  /**
   * 移除标注点
   * @param {string} markerId - 标注ID
   */
  async removeMarker(markerId) {
    throw new Error('removeMarker method must be implemented')
  }

  /**
   * 添加事件监听
   * @param {string} eventType - 事件类型
   * @param {Function} callback - 回调函数
   */
  async addEventListener(eventType, callback) {
    throw new Error('addEventListener method must be implemented')
  }

  /**
   * 移除事件监听
   * @param {string} eventType - 事件类型
   * @param {Function} callback - 回调函数
   */
  async removeEventListener(eventType, callback) {
    throw new Error('removeEventListener method must be implemented')
  }

  /**
   * 获取引擎状态
   * @returns {Object} - 引擎状态信息
   */
  async getStatus() {
    throw new Error('getStatus method must be implemented')
  }

  /**
   * 截图功能
   * @param {Object} options - 截图选项
   * @returns {Promise<string>} - 图片数据URL
   */
  async captureScreenshot(options = {}) {
    throw new Error('captureScreenshot method must be implemented')
  }

  /**
   * 测量功能
   * @param {string} type - 测量类型 ('distance', 'area', 'height')
   * @param {Function} callback - 测量结果回调
   */
  async startMeasurement(type, callback) {
    throw new Error('startMeasurement method must be implemented')
  }

  /**
   * 停止测量
   */
  async stopMeasurement() {
    throw new Error('stopMeasurement method must be implemented')
  }
}