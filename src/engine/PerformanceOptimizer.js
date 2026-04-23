/**
 * 性能优化器
 * 针对多引擎中间层的性能优化工具
 */

export class PerformanceOptimizer {
  constructor() {
    this.cache = new Map()
    this.performanceStats = new Map()
    this.enabled = true
  }

  /**
   * 方法调用缓存装饰器
   * 缓存方法调用结果，避免重复计算
   */
  static cacheMethod(ttl = 5000) {
    return function (target, propertyName, descriptor) {
      const method = descriptor.value
      const cacheKey = `${target.constructor.name}.${propertyName}`
      
      descriptor.value = async function (...args) {
        const optimizer = this.performanceOptimizer || new PerformanceOptimizer()
        
        // 生成缓存键
        const key = `${cacheKey}:${JSON.stringify(args)}`
        
        // 检查缓存
        if (optimizer.enabled) {
          const cached = optimizer.getCache(key)
          if (cached && Date.now() - cached.timestamp < ttl) {
            return cached.result
          }
        }
        
        // 执行方法
        const startTime = performance.now()
        const result = await method.apply(this, args)
        const endTime = performance.now()
        
        // 记录性能统计
        optimizer.recordPerformance(propertyName, endTime - startTime)
        
        // 缓存结果
        if (optimizer.enabled) {
          optimizer.setCache(key, result, ttl)
        }
        
        return result
      }
      
      return descriptor
    }
  }

  /**
   * 批量操作优化装饰器
   * 将多个操作合并为批量操作
   */
  static batchOperations(batchSize = 10, delay = 16) {
    return function (target, propertyName, descriptor) {
      const method = descriptor.value
      let batchQueue = []
      let batchTimeout = null
      
      descriptor.value = async function (...args) {
        return new Promise((resolve, reject) => {
          batchQueue.push({ args, resolve, reject })
          
          if (batchQueue.length >= batchSize) {
            executeBatch()
          } else if (!batchTimeout) {
            batchTimeout = setTimeout(executeBatch, delay)
          }
        })
      }
      
      const executeBatch = async () => {
        if (batchTimeout) {
          clearTimeout(batchTimeout)
          batchTimeout = null
        }
        
        const currentBatch = [...batchQueue]
        batchQueue = []
        
        if (currentBatch.length === 0) return
        
        try {
          // 执行批量操作
          const startTime = performance.now()
          const results = await method.apply(this, [currentBatch.map(item => item.args)])
          const endTime = performance.now()
          
          // 分发结果
          currentBatch.forEach((item, index) => {
            item.resolve(results[index])
          })
          
          // 记录性能
          const optimizer = this.performanceOptimizer || new PerformanceOptimizer()
          optimizer.recordPerformance(`${propertyName}_batch`, endTime - startTime)
          
        } catch (error) {
          currentBatch.forEach(item => {
            item.reject(error)
          })
        }
      }
      
      return descriptor
    }
  }

  /**
   * 热路径优化装饰器
   * 对高频调用方法进行内联优化
   */
  static hotPathOptimization() {
    return function (target, propertyName, descriptor) {
      const method = descriptor.value
      let callCount = 0
      let optimizedVersion = null
      
      descriptor.value = function (...args) {
        callCount++
        
        // 达到阈值后启用优化版本
        if (callCount > 100 && !optimizedVersion) {
          optimizedVersion = this.createOptimizedVersion(propertyName)
        }
        
        if (optimizedVersion) {
          return optimizedVersion.apply(this, args)
        }
        
        return method.apply(this, args)
      }
      
      return descriptor
    }
  }

  /**
   * 设置缓存
   */
  setCache(key, value, ttl = 5000) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })
    
    // 自动清理过期缓存
    this.cleanupExpiredCache()
  }

  /**
   * 获取缓存
   */
  getCache(key) {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return cached
  }

  /**
   * 清理过期缓存
   */
  cleanupExpiredCache() {
    const now = Date.now()
    for (const [key, cached] of this.cache) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 记录性能统计
   */
  recordPerformance(methodName, duration) {
    if (!this.performanceStats.has(methodName)) {
      this.performanceStats.set(methodName, {
        count: 0,
        totalTime: 0,
        maxTime: 0,
        minTime: Infinity
      })
    }
    
    const stats = this.performanceStats.get(methodName)
    stats.count++
    stats.totalTime += duration
    stats.maxTime = Math.max(stats.maxTime, duration)
    stats.minTime = Math.min(stats.minTime, duration)
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport() {
    const report = {}
    
    for (const [methodName, stats] of this.performanceStats) {
      report[methodName] = {
        callCount: stats.count,
        averageTime: stats.totalTime / stats.count,
        maxTime: stats.maxTime,
        minTime: stats.minTime === Infinity ? 0 : stats.minTime
      }
    }
    
    return report
  }

  /**
   * 启用/禁用优化
   */
  setEnabled(enabled) {
    this.enabled = enabled
    if (!enabled) {
      this.cache.clear()
    }
  }

  /**
   * 重置性能统计
   */
  resetStats() {
    this.performanceStats.clear()
  }
}

/**
 * 性能监控工具
 */
export class PerformanceMonitor {
  static measurements = new Map()
  
  /**
   * 开始测量
   */
  static start(label) {
    if (!this.measurements.has(label)) {
      this.measurements.set(label, [])
    }
    
    const measurement = {
      startTime: performance.now(),
      label
    }
    
    this.measurements.get(label).push(measurement)
    return measurement
  }
  
  /**
   * 结束测量
   */
  static end(measurement) {
    const endTime = performance.now()
    measurement.endTime = endTime
    measurement.duration = endTime - measurement.startTime
    return measurement.duration
  }
  
  /**
   * 获取测量报告
   */
  static getReport() {
    const report = {}
    
    for (const [label, measurements] of this.measurements) {
      const durations = measurements.map(m => m.duration).filter(Boolean)
      if (durations.length === 0) continue
      
      report[label] = {
        count: durations.length,
        average: durations.reduce((a, b) => a + b, 0) / durations.length,
        max: Math.max(...durations),
        min: Math.min(...durations),
        total: durations.reduce((a, b) => a + b, 0)
      }
    }
    
    return report
  }
  
  /**
   * 重置测量
   */
  static reset() {
    this.measurements.clear()
  }
}