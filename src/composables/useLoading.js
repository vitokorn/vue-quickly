import { ref, computed } from 'vue'

/**
 * Standardized loading composable for consistent loading state management
 * @param {Object} options - Configuration options
 * @param {string} options.message - Default loading message
 * @param {boolean} options.initialState - Initial loading state
 * @returns {Object} Loading state management utilities
 */
export function useLoading(options = {}) {
  const {
    message = 'Loading...',
    initialState = false
  } = options

  // Main loading state
  const loading = ref(initialState)

  // Loading message
  const loadingMessage = ref(message)

  // Loading progress (0-100)
  const loadingProgress = ref(0)

  // Computed property for loading state
  const isLoading = computed(() => loading.value)

  // Computed property for loading percentage
  const progressPercentage = computed(() => `${loadingProgress.value}%`)

  /**
   * Start loading with optional message
   * @param {string} msg - Optional loading message
   */
  const startLoading = (msg) => {
    loading.value = true
    if (msg) loadingMessage.value = msg
    loadingProgress.value = 0
  }

  /**
   * Stop loading
   */
  const stopLoading = () => {
    loading.value = false
    loadingProgress.value = 100
  }

  /**
   * Set loading progress
   * @param {number} progress - Progress value (0-100)
   */
  const setProgress = (progress) => {
    loadingProgress.value = Math.max(0, Math.min(100, progress))
  }

  /**
   * Execute an async operation with loading state
   * @param {Function} asyncFn - Async function to execute
   * @param {Object} options - Options for the operation
   * @param {string} options.message - Loading message
   * @param {Function} options.onProgress - Progress callback
   * @param {Function} options.onError - Error callback
   * @returns {Promise} Result of the async operation
   */
  const withLoading = async (asyncFn, options = {}) => {
    const { message: msg, onProgress, onError } = options

    try {
      startLoading(msg)

      const result = await asyncFn((progress) => {
        if (onProgress) {
          setProgress(progress)
          onProgress(progress)
        }
      })

      stopLoading()
      return result
    } catch (error) {
      stopLoading()
      if (onError) {
        onError(error)
      } else {
        console.error('Loading operation failed:', error)
        throw error
      }
    }
  }

  /**
   * Execute multiple async operations with loading state
   * @param {Array} operations - Array of async operations
   * @param {Object} options - Options for the operations
   * @returns {Promise} Array of results
   */
  const withMultipleLoading = async (operations, options = {}) => {
    const { message: msg, onProgress } = options

    try {
      startLoading(msg)
      const total = operations.length
      const results = []

      for (let i = 0; i < total; i++) {
        const result = await operations[i]
        results.push(result)

        const progress = ((i + 1) / total) * 100
        setProgress(progress)
        if (onProgress) onProgress(progress)
      }

      stopLoading()
      return results
    } catch (error) {
      stopLoading()
      console.error('Multiple loading operations failed:', error)
      throw error
    }
  }

  return {
    // State
    loading,
    loadingMessage,
    loadingProgress,

    // Computed
    isLoading,
    progressPercentage,

    // Methods
    startLoading,
    stopLoading,
    setProgress,
    withLoading,
    withMultipleLoading
  }
}
