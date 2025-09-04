import { ref, computed, watch, reactive, toRaw } from 'vue'

/**
 * Improved data handling composable for desktop components
 * Provides data validation, fallbacks, caching, and reactive updates
 * @param {Object} options - Configuration options
 * @param {Function} options.fetchData - Function to fetch data
 * @param {Object} options.initialData - Initial data state
 * @param {Object} options.validation - Data validation rules
 * @param {Object} options.transformers - Data transformation functions
 * @returns {Object} Data handling utilities
 */
export function useDataHandler(options = {}) {
  const {
    fetchData,
    initialData = {},
    validation = {},
    transformers = {},
    cache = false,
    cacheKey = null
  } = options

  // Data states
  const data = reactive({ ...initialData })
  const originalData = ref(null)
  const isDirty = ref(false)
  const lastUpdated = ref(null)
  const isStale = ref(false)
  const cacheExpiry = ref(null)

  // Status states
  const isLoading = ref(false)
  const error = ref(null)
  const retryCount = ref(0)
  const maxRetries = ref(3)

  // Computed properties
  const hasData = computed(() => {
    return Object.keys(data).length > 0 && !isEmpty(data)
  })

  const hasError = computed(() => !!error.value)

  const isValid = computed(() => {
    return validateData(data, validation)
  })

  const isCached = computed(() => {
    return cache && cacheExpiry.value && Date.now() < cacheExpiry.value
  })

  // Validation functions
  function validateData(data, rules) {
    if (!rules || Object.keys(rules).length === 0) return true

    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field]
      if (!rule(value)) return false
    }
    return true
  }

  function isEmpty(obj) {
    if (!obj) return true
    if (Array.isArray(obj)) return obj.length === 0
    if (typeof obj === 'object') return Object.keys(obj).length === 0
    return !obj
  }

  // Data transformation
  function transformData(data, transformers) {
    if (!transformers || Object.keys(transformers).length === 0) return data

    let transformed = { ...data }

    for (const [field, transformer] of Object.entries(transformers)) {
      if (transformed[field] !== undefined) {
        transformed[field] = transformer(transformed[field], transformed)
      }
    }

    return transformed
  }

  // Cache management
  function saveToCache(data, key = cacheKey) {
    if (!cache || !key) return

    try {
      const cacheData = {
        data: toRaw(data),
        timestamp: Date.now(),
        expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData))
      cacheExpiry.value = cacheData.expiry
    } catch (e) {
      console.warn('Failed to save to cache:', e)
    }
  }

  function loadFromCache(key = cacheKey) {
    if (!cache || !key) return null

    try {
      const cached = localStorage.getItem(`cache_${key}`)
      if (!cached) return null

      const cacheData = JSON.parse(cached)
      if (Date.now() > cacheData.expiry) {
        localStorage.removeItem(`cache_${key}`)
        return null
      }

      cacheExpiry.value = cacheData.expiry
      return cacheData.data
    } catch (e) {
      console.warn('Failed to load from cache:', e)
      return null
    }
  }

  function clearCache(key = cacheKey) {
    if (!key) return
    localStorage.removeItem(`cache_${key}`)
    cacheExpiry.value = null
  }

  // Data operations
  async function loadData(options = {}) {
    const {
      force = false,
      silent = false,
      useCache = cache
    } = options

    // Check cache first
    if (!force && useCache) {
      const cachedData = loadFromCache()
      if (cachedData) {
        Object.assign(data, cachedData)
        originalData.value = { ...cachedData }
        lastUpdated.value = new Date()
        return data
      }
    }

    if (!silent) isLoading.value = true
    error.value = null

    try {
      if (!fetchData) {
        throw new Error('No fetchData function provided')
      }

      const result = await fetchData()

      // Validate result
      if (!isValid.value && Object.keys(validation).length > 0) {
        throw new Error('Data validation failed')
      }

      // Transform data
      const transformed = transformData(result, transformers)

      // Update data
      Object.assign(data, transformed)
      originalData.value = { ...transformed }
      lastUpdated.value = new Date()
      isStale.value = false

      // Cache if enabled
      if (cache) {
        saveToCache(transformed)
      }

      retryCount.value = 0
      return data

    } catch (err) {
      error.value = err.message || 'Failed to load data'
      console.error('Data loading error:', err)

      // Retry logic
      if (retryCount.value < maxRetries.value) {
        retryCount.value++
        console.log(`Retrying data load (${retryCount.value}/${maxRetries.value})...`)

        setTimeout(() => {
          loadData({ ...options, silent: true })
        }, 1000 * retryCount.value) // Exponential backoff
      }

      throw err
    } finally {
      if (!silent) isLoading.value = false
    }
  }

  async function refreshData() {
    return loadData({ force: true })
  }

  function updateData(updates) {
    if (!updates || typeof updates !== 'object') return

    const updated = { ...data, ...updates }

    // Validate updates
    if (!validateData(updated, validation)) {
      console.warn('Data update validation failed')
      return false
    }

    Object.assign(data, updated)
    isDirty.value = true
    return true
  }

  function resetData() {
    if (originalData.value) {
      Object.assign(data, originalData.value)
      isDirty.value = false
    }
  }

  function clearData() {
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        data[key] = []
      } else if (typeof data[key] === 'object') {
        data[key] = {}
      } else {
        data[key] = null
      }
    })
    originalData.value = null
    isDirty.value = false
    error.value = null
    clearCache()
  }

  // Watch for data changes
  watch(data, (newData) => {
    if (originalData.value) {
      isDirty.value = JSON.stringify(newData) !== JSON.stringify(originalData.value)
    }
  }, { deep: true })

  // Watch for staleness (data older than 5 minutes)
  if (lastUpdated.value) {
    setInterval(() => {
      if (lastUpdated.value && Date.now() - lastUpdated.value.getTime() > 5 * 60 * 1000) {
        isStale.value = true
      }
    }, 60000) // Check every minute
  }

  return {
    // Data
    data,
    originalData,

    // Status
    isLoading,
    error,
    isDirty,
    lastUpdated,
    isStale,
    retryCount,

    // Computed
    hasData,
    hasError,
    isValid,
    isCached,

    // Methods
    loadData,
    refreshData,
    updateData,
    resetData,
    clearData,
    saveToCache,
    loadFromCache,
    clearCache,

    // Utilities
    validateData: (data) => validateData(data, validation),
    transformData: (data) => transformData(data, transformers)
  }
}
