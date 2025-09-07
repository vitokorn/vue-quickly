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
        console.log('Current pending requests:', Array.from(visibilityState.pendingVisibility.keys()))

        // Check if component is already registered
        if (visibilityState.componentRefs.has(key)) {
            console.log('Component already registered, skipping:', key)
            return
        }

        visibilityState.componentRefs.set(key, componentRef)

        // Add a small delay to ensure pending requests are processed
        setTimeout(() => {
            // Check if there's a pending visibility request for this component
            const pendingRequest = visibilityState.pendingVisibility.get(key)
            console.log('Looking for pending request for key:', key, 'Found:', pendingRequest)
            if (pendingRequest) {
                console.log('Processing pending request for:', key, pendingRequest)
                if (pendingRequest.shouldShow) {
                    console.log('Showing component from pending request:', key)
                    if (componentRef.value.classList.contains('row')) {
                        componentRef.value.style.display = 'flex'
                    } else if (componentRef.value.classList.contains('deeper-header')) {
                        componentRef.value.style.display = 'grid'
                    } else {
                        componentRef.value.style.display = 'block'
                    }
                    visibilityState.visibleElements.set(key, true)

                    // Scroll to the component after a short delay to ensure it's rendered
                    setTimeout(() => {
                        if (componentRef.value) {
                            console.log('Scrolling to component from pending request:', key)

                            // Try multiple scroll methods for better compatibility
                            try {
                                // Method 1: scrollIntoView
                                componentRef.value.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start',
                                    inline: 'nearest'
                                })
                            } catch (error) {
                                console.log('scrollIntoView failed, trying alternative method:', error)

                                // Method 2: Find scrollable parent and scroll to element
                                let scrollableParent = componentRef.value.parentElement
                                while (scrollableParent && scrollableParent !== document.body) {
                                    const style = window.getComputedStyle(scrollableParent)
                                    if (style.overflow === 'auto' || style.overflow === 'scroll' || style.overflowY === 'auto' || style.overflowY === 'scroll') {
                                        const rect = componentRef.value.getBoundingClientRect()
                                        const parentRect = scrollableParent.getBoundingClientRect()
                                        const scrollTop = scrollableParent.scrollTop + rect.top - parentRect.top
                                        scrollableParent.scrollTo({
                                            top: scrollTop,
                                            behavior: 'smooth'
                                        })
                                        break
                                    }
                                    scrollableParent = scrollableParent.parentElement
                                }

                                // Method 3: Fallback to window scroll
                                if (!scrollableParent || scrollableParent === document.body) {
                                    const rect = componentRef.value.getBoundingClientRect()
                                    window.scrollTo({
                                        top: window.pageYOffset + rect.top - 100, // 100px offset from top
                                        behavior: 'smooth'
                                    })
                                }
                            }
                        } else {
                            console.log('Component ref not available for scrolling from pending request:', key)
                        }
                    }, 100)
                } else {
                    visibilityState.visibleElements.set(key, false)
                }
                visibilityState.pendingVisibility.delete(key)
            } else {
                // Initialize as hidden only if no pending request
                visibilityState.visibleElements.set(key, false)
            }
        }, 10)
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
        console.log('Registered components at showComponent time:', Array.from(visibilityState.componentRefs.keys()))
        const componentRef = visibilityState.componentRefs.get(key)
        if (componentRef && componentRef.value) {
            console.log('Component found, showing:', key)
            if (componentRef.value.classList.contains('row')) {
                componentRef.value.style.display = 'flex'
            } else if (componentRef.value.classList.contains('deeper-header')) {
                componentRef.value.style.display = 'grid'
            } else {
                componentRef.value.style.display = 'block'
            }
            visibilityState.visibleElements.set(key, true)

            // Scroll to the component after a short delay to ensure it's rendered
            setTimeout(() => {
                if (componentRef.value) {
                    console.log('Scrolling to component:', key)

                    // Try multiple scroll methods for better compatibility
                    try {
                        // Method 1: scrollIntoView
                        componentRef.value.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest'
                        })
                    } catch (error) {
                        console.log('scrollIntoView failed, trying alternative method:', error)

                        // Method 2: Find scrollable parent and scroll to element
                        let scrollableParent = componentRef.value.parentElement
                        while (scrollableParent && scrollableParent !== document.body) {
                            const style = window.getComputedStyle(scrollableParent)
                            if (style.overflow === 'auto' || style.overflow === 'scroll' || style.overflowY === 'auto' || style.overflowY === 'scroll') {
                                const rect = componentRef.value.getBoundingClientRect()
                                const parentRect = scrollableParent.getBoundingClientRect()
                                const scrollTop = scrollableParent.scrollTop + rect.top - parentRect.top
                                scrollableParent.scrollTo({
                                    top: scrollTop,
                                    behavior: 'smooth'
                                })
                                break
                            }
                            scrollableParent = scrollableParent.parentElement
                        }

                        // Method 3: Fallback to window scroll
                        if (!scrollableParent || scrollableParent === document.body) {
                            const rect = componentRef.value.getBoundingClientRect()
                            window.scrollTo({
                                top: window.pageYOffset + rect.top - 100, // 100px offset from top
                                behavior: 'smooth'
                            })
                        }
                    }
                } else {
                    console.log('Component ref not available for scrolling:', key)
                }
            }, 100)
        } else {
            // Component not registered yet, store the request
            console.log('Component not found, storing pending request for:', key)
            visibilityState.pendingVisibility.set(key, { shouldShow: true })
            console.log('Pending requests after storing:', Array.from(visibilityState.pendingVisibility.keys()))
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
                    componentRef.value.style.display = 'block'
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

    // Scroll to a specific component
    const scrollToComponent = (key) => {
        const componentRef = visibilityState.componentRefs.get(key)
        if (componentRef && componentRef.value) {
            console.log('Manual scroll to component:', key)
            console.log('Component element:', componentRef.value)
            console.log('Component position:', componentRef.value.getBoundingClientRect())

            // Try multiple scroll methods for better compatibility
            try {
                // Method 1: scrollIntoView
                componentRef.value.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                })
            } catch (error) {
                console.log('scrollIntoView failed, trying alternative method:', error)

                // Method 2: Find scrollable parent and scroll to element
                let scrollableParent = componentRef.value.parentElement
                while (scrollableParent && scrollableParent !== document.body) {
                    const style = window.getComputedStyle(scrollableParent)
                    if (style.overflow === 'auto' || style.overflow === 'scroll' || style.overflowY === 'auto' || style.overflowY === 'scroll') {
                        const rect = componentRef.value.getBoundingClientRect()
                        const parentRect = scrollableParent.getBoundingClientRect()
                        const scrollTop = scrollableParent.scrollTop + rect.top - parentRect.top
                        scrollableParent.scrollTo({
                            top: scrollTop,
                            behavior: 'smooth'
                        })
                        break
                    }
                    scrollableParent = scrollableParent.parentElement
                }

                // Method 3: Fallback to window scroll
                if (!scrollableParent || scrollableParent === document.body) {
                    const rect = componentRef.value.getBoundingClientRect()
                    window.scrollTo({
                        top: window.pageYOffset + rect.top - 100, // 100px offset from top
                        behavior: 'smooth'
                    })
                }
            }
        } else {
            console.log('Component ref not available for manual scroll:', key)
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
        scrollToComponent,
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
