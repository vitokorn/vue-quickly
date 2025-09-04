import { ref, computed, reactive } from 'vue'

/**
 * Improved error handling composable for desktop components
 * Provides user-friendly error messages, retry mechanisms, and error recovery
 * @param {Object} options - Configuration options
 * @param {Object} options.messages - Custom error messages
 * @param {Object} options.recovery - Recovery options
 * @returns {Object} Error handling utilities
 */
export function useErrorHandler(options = {}) {
  const {
    messages = {},
    recovery = {},
    maxRetries = 3,
    showToast = true
  } = options

  // Error state
  const errors = reactive([])
  const currentError = ref(null)
  const errorHistory = ref([])
  const isRecovering = ref(false)

  // Recovery state
  const recoveryAttempts = ref(0)
  const lastRecoveryAttempt = ref(null)

  // Computed properties
  const hasErrors = computed(() => errors.length > 0)
  const hasCurrentError = computed(() => !!currentError.value)
  const canRetry = computed(() => recoveryAttempts.value < maxRetries)

  const latestError = computed(() => {
    return errors.length > 0 ? errors[errors.length - 1] : null
  })

  const errorCount = computed(() => errors.length)

  // Error classification
  const errorTypes = {
    NETWORK: 'network',
    AUTHENTICATION: 'authentication',
    VALIDATION: 'validation',
    SERVER: 'server',
    CLIENT: 'client',
    UNKNOWN: 'unknown'
  }

  // Default error messages
  const defaultMessages = {
    [errorTypes.NETWORK]: 'Unable to connect to the server. Please check your internet connection.',
    [errorTypes.AUTHENTICATION]: 'Your session has expired. Please log in again.',
    [errorTypes.VALIDATION]: 'The provided data is invalid. Please check your input.',
    [errorTypes.SERVER]: 'Something went wrong on our end. Please try again later.',
    [errorTypes.CLIENT]: 'An unexpected error occurred. Please try again.',
    [errorTypes.UNKNOWN]: 'An unknown error occurred. Please try again.',
    retry: 'Operation failed. Retrying...',
    maxRetries: 'Maximum retry attempts reached. Please try again later.',
    recovery: 'Attempting to recover from error...'
  }

  // Custom messages override defaults
  const errorMessages = { ...defaultMessages, ...messages }

  // Error classification functions
  function classifyError(error) {
    if (!error) return errorTypes.UNKNOWN

    const message = error.message || error.toString()

    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return errorTypes.NETWORK
    }

    if (message.includes('auth') || message.includes('token') || message.includes('unauthorized')) {
      return errorTypes.AUTHENTICATION
    }

    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return errorTypes.VALIDATION
    }

    if (error.status >= 500) {
      return errorTypes.SERVER
    }

    if (error.status >= 400 && error.status < 500) {
      return errorTypes.CLIENT
    }

    return errorTypes.UNKNOWN
  }

  function getErrorMessage(error, type = null) {
    const errorType = type || classifyError(error)
    return errorMessages[errorType] || errorMessages[errorTypes.UNKNOWN]
  }

  // Error handling functions
  function addError(error, context = {}) {
    const errorEntry = {
      id: Date.now(),
      error,
      type: classifyError(error),
      message: getErrorMessage(error),
      context,
      timestamp: new Date(),
      stack: error.stack
    }

    errors.push(errorEntry)
    currentError.value = errorEntry

    // Keep error history (last 10 errors)
    errorHistory.value.push(errorEntry)
    if (errorHistory.value.length > 10) {
      errorHistory.value.shift()
    }

    // Log error
    console.error('Error added:', errorEntry)

    // Show toast notification if enabled
    if (showToast) {
      showErrorToast(errorEntry)
    }

    return errorEntry
  }

  function removeError(errorId) {
    const index = errors.findIndex(e => e.id === errorId)
    if (index > -1) {
      errors.splice(index, 1)
      if (currentError.value?.id === errorId) {
        currentError.value = errors.length > 0 ? errors[errors.length - 1] : null
      }
    }
  }

  function clearErrors() {
    errors.length = 0
    currentError.value = null
  }

  function clearErrorHistory() {
    errorHistory.value.length = 0
  }

  // Recovery functions
  async function retryOperation(operation, context = {}) {
    if (!canRetry.value) {
      addError(new Error(errorMessages.maxRetries), { ...context, operation: 'retry' })
      return false
    }

    recoveryAttempts.value++
    lastRecoveryAttempt.value = new Date()

    try {
      isRecovering.value = true
      console.log(`Retrying operation (attempt ${recoveryAttempts.value}/${maxRetries})`)

      const result = await operation()
      recoveryAttempts.value = 0 // Reset on success
      return result

    } catch (error) {
      console.error(`Retry ${recoveryAttempts.value} failed:`, error)

      if (recoveryAttempts.value >= maxRetries) {
        addError(error, { ...context, operation: 'retry', attempts: recoveryAttempts.value })
        recoveryAttempts.value = 0 // Reset for next operation
      }

      throw error
    } finally {
      isRecovering.value = false
    }
  }

  async function recoverFromError(errorType, context = {}) {
    const recoveryFn = recovery[errorType]

    if (!recoveryFn) {
      console.warn(`No recovery function defined for error type: ${errorType}`)
      return false
    }

    try {
      isRecovering.value = true
      console.log(`Attempting recovery for ${errorType}...`)

      await recoveryFn(context)
      console.log(`Recovery successful for ${errorType}`)
      return true

    } catch (recoveryError) {
      console.error(`Recovery failed for ${errorType}:`, recoveryError)
      addError(recoveryError, { ...context, operation: 'recovery', errorType })
      return false
    } finally {
      isRecovering.value = false
    }
  }

  // Toast notification (can be replaced with actual toast system)
  function showErrorToast(errorEntry) {
    // This is a placeholder - replace with your actual toast system
    console.log('Error Toast:', errorEntry.message)

    // Example: You could integrate with a toast library like vue-toastification
    // toast.error(errorEntry.message)

    // Or use a simple alert for now
    if (errorEntry.type === errorTypes.AUTHENTICATION) {
      // Redirect to login or show login modal
      console.log('Authentication error - user needs to log in')
    }
  }

  // Wrapper function for operations with error handling
  async function withErrorHandling(operation, options = {}) {
    const {
      context = {},
      showError = true,
      retry = false,
      recovery = false
    } = options

    try {
      const result = await operation()

      // Clear any previous errors on success
      if (hasCurrentError.value) {
        clearErrors()
      }

      return result

    } catch (error) {
      const errorEntry = showError ? addError(error, context) : null

      // Attempt retry if enabled
      if (retry && canRetry.value) {
        try {
          return await retryOperation(() => operation(), context)
        } catch (retryError) {
          // Retry failed, continue with original error
        }
      }

      // Attempt recovery if enabled
      if (recovery && errorEntry) {
        await recoverFromError(errorEntry.type, context)
      }

      throw error
    }
  }

  // Error boundary-like functionality
  function createErrorBoundary(operation) {
    return async (...args) => {
      try {
        return await operation(...args)
      } catch (error) {
        // Log error but don't rethrow - for non-critical operations
        console.error('Error boundary caught error:', error)
        addError(error, { operation: operation.name, args })
        return null // Or return a fallback value
      }
    }
  }

  return {
    // State
    errors,
    currentError,
    errorHistory,
    recoveryAttempts,
    isRecovering,

    // Computed
    hasErrors,
    hasCurrentError,
    canRetry,
    latestError,
    errorCount,

    // Constants
    errorTypes,

    // Methods
    addError,
    removeError,
    clearErrors,
    clearErrorHistory,
    retryOperation,
    recoverFromError,
    withErrorHandling,
    createErrorBoundary,

    // Utilities
    classifyError,
    getErrorMessage
  }
}
