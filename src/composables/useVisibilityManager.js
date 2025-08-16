import { ref, reactive } from 'vue'

// Global visibility state manager
const visibilityState = reactive({
  // Map to track which elements are visible by their unique keys
  visibleElements: new Map(),
  
  // Map to track component refs by their unique keys
  componentRefs: new Map(),
  
  // Current active section
  activeSection: null,
  
  // Current active parent (for nested elements)
  activeParent: null,
  
  // Pending visibility requests for components that haven't been registered yet
  pendingVisibility: new Map()
})

export function useVisibilityManager() {
  // Register a component with a unique key
  const registerComponent = (key, componentRef) => {
    console.log('registerComponent called for:', key)
    visibilityState.componentRefs.set(key, componentRef)
    
    // Check if there's a pending visibility request for this component
    const pendingRequest = visibilityState.pendingVisibility.get(key)
    if (pendingRequest) {
      console.log('Processing pending request for:', key, pendingRequest)
      if (pendingRequest.shouldShow) {
        console.log('Showing component from pending request:', key)
        showComponent(key)
        // Don't initialize as hidden if we're showing it
        visibilityState.visibleElements.set(key, true)
      } else {
        visibilityState.visibleElements.set(key, false)
      }
      visibilityState.pendingVisibility.delete(key)
    } else {
      // Initialize as hidden only if no pending request
      visibilityState.visibleElements.set(key, false)
    }
  }
  
  // Unregister a component
  const unregisterComponent = (key) => {
    visibilityState.componentRefs.delete(key)
    visibilityState.visibleElements.delete(key)
    visibilityState.pendingVisibility.delete(key)
  }
  
  // Show a specific component
  const showComponent = (key) => {
    console.log('showComponent called for:', key)
    const componentRef = visibilityState.componentRefs.get(key)
    if (componentRef && componentRef.value) {
      console.log('Component found, showing:', key)
      componentRef.value.style.display = 'flex'
      visibilityState.visibleElements.set(key, true)
    } else {
      // Component not registered yet, store the request
      console.log('Component not found, storing pending request for:', key)
      visibilityState.pendingVisibility.set(key, { shouldShow: true })
    }
  }
  
  // Hide a specific component
  const hideComponent = (key) => {
    const componentRef = visibilityState.componentRefs.get(key)
    if (componentRef && componentRef.value) {
      componentRef.value.style.display = 'none'
      visibilityState.visibleElements.set(key, false)
    } else {
      // Component not registered yet, store the request
      visibilityState.pendingVisibility.set(key, { shouldShow: false })
    }
  }
  
  // Show only components that match the current section and hide others
  const showSection = (sectionKey, parentKey = null) => {
    visibilityState.activeSection = sectionKey
    visibilityState.activeParent = parentKey
    
    // Hide all components first
    for (const [key, componentRef] of visibilityState.componentRefs) {
      if (componentRef && componentRef.value) {
        componentRef.value.style.display = 'none'
        visibilityState.visibleElements.set(key, false)
      }
    }
    
    // Show only components that belong to the current section
    for (const [key, componentRef] of visibilityState.componentRefs) {
      if (key.startsWith(sectionKey)) {
        // If we have a parent key, only show components that belong to that parent
        if (parentKey && !key.includes(parentKey)) {
          continue
        }
        
        if (componentRef && componentRef.value) {
          componentRef.value.style.display = 'flex'
          visibilityState.visibleElements.set(key, true)
        }
      }
    }
  }
  
  // Hide all components in a section
  const hideSection = (sectionKey) => {
    for (const [key, componentRef] of visibilityState.componentRefs) {
      if (key.startsWith(sectionKey)) {
        if (componentRef && componentRef.value) {
          componentRef.value.style.display = 'none'
          visibilityState.visibleElements.set(key, false)
        }
      }
    }
  }
  
  // Hide all components
  const hideAllComponents = () => {
    for (const [key, componentRef] of visibilityState.componentRefs) {
      if (componentRef && componentRef.value) {
        componentRef.value.style.display = 'none'
        visibilityState.visibleElements.set(key, false)
      }
    }
  }
  
  // Check if a component is currently visible
  const isComponentVisible = (key) => {
    return visibilityState.visibleElements.get(key) || false
  }
  
  // Check if a component is registered
  const isComponentRegistered = (key) => {
    return visibilityState.componentRefs.has(key)
  }
  
  // Get current active section
  const getActiveSection = () => {
    return visibilityState.activeSection
  }
  
  // Get current active parent
  const getActiveParent = () => {
    return visibilityState.activeParent
  }
  
  // Clear all visibility state
  const clearAll = () => {
    visibilityState.visibleElements.clear()
    visibilityState.componentRefs.clear()
    visibilityState.pendingVisibility.clear()
    visibilityState.activeSection = null
    visibilityState.activeParent = null
  }
  
  // Get all registered component keys
  const getRegisteredComponents = () => {
    return Array.from(visibilityState.componentRefs.keys())
  }
  
  // Get all pending visibility requests
  const getPendingRequests = () => {
    return Array.from(visibilityState.pendingVisibility.entries())
  }
  
  return {
    registerComponent,
    unregisterComponent,
    showComponent,
    hideComponent,
    showSection,
    hideSection,
    hideAllComponents,
    isComponentVisible,
    isComponentRegistered,
    getActiveSection,
    getActiveParent,
    clearAll,
    getRegisteredComponents,
    getPendingRequests,
    visibilityState
  }
}
