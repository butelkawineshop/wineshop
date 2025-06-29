import { logger } from '../lib/logger'

export interface PerformanceMetrics {
  operation: string
  duration: number
  timestamp: string
  success: boolean
  error?: string
  metadata?: Record<string, unknown>
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private isEnabled =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_PERFORMANCE_MONITORING === 'true'

  /**
   * Measure the performance of an async operation
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>,
  ): Promise<T> {
    if (!this.isEnabled) {
      return fn()
    }

    const startTime = Date.now()
    const timestamp = new Date().toISOString()

    try {
      const result = await fn()
      const duration = Date.now() - startTime

      this.recordMetric({
        operation,
        duration,
        timestamp,
        success: true,
        metadata,
      })

      // Log slow operations
      if (duration > 1000) {
        logger.warn('Slow operation detected', {
          operation,
          duration,
          metadata,
        })
      }

      return result
    } catch (error) {
      const duration = Date.now() - startTime

      this.recordMetric({
        operation,
        duration,
        timestamp,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata,
      })

      throw error
    }
  }

  /**
   * Record a performance metric
   */
  private recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric)

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }
  }

  /**
   * Get performance statistics for an operation
   */
  getStats(operation: string) {
    const operationMetrics = this.metrics.filter((m) => m.operation === operation)

    if (operationMetrics.length === 0) {
      return null
    }

    const durations = operationMetrics.map((m) => m.duration)
    const successful = operationMetrics.filter((m) => m.success)
    const failed = operationMetrics.filter((m) => !m.success)

    return {
      operation,
      totalCalls: operationMetrics.length,
      successfulCalls: successful.length,
      failedCalls: failed.length,
      successRate: (successful.length / operationMetrics.length) * 100,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      p95Duration: this.percentile(durations, 95),
      p99Duration: this.percentile(durations, 99),
    }
  }

  /**
   * Get all performance statistics
   */
  getAllStats() {
    const operations = Array.from(new Set(this.metrics.map((m) => m.operation)))
    return operations.map((op) => this.getStats(op)).filter(Boolean)
  }

  /**
   * Calculate percentile
   */
  private percentile(values: number[], p: number): number {
    const sorted = values.sort((a, b) => a - b)
    const index = Math.ceil((p / 100) * sorted.length) - 1
    return sorted[index] || 0
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = []
  }

  /**
   * Enable/disable performance monitoring
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * Decorator for measuring method performance
 */
export function measurePerformance(operation?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value
    const operationName = operation || `${target.constructor.name}.${propertyKey}`

    descriptor.value = async function (...args: any[]) {
      return performanceMonitor.measure(operationName, () => method.apply(this, args))
    }

    return descriptor
  }
}
