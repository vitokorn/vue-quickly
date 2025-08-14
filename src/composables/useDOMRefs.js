import { ref, nextTick } from 'vue'

export function useDOMRefs() {
  // Tab refs
  const playlistlistRef = ref(null)
  const taRef = ref(null)
  const ttRef = ref(null)
  const saRef = ref(null)
  const stRef = ref(null)
  const faRef = ref(null)
  const nrRef = ref(null)
  const sptRef = ref(null)
  const searRef = ref(null)

  // Content section refs
  const yourplaylistsRef = ref(null)
  const topartistRef = ref(null)
  const topartist6Ref = ref(null)
  const topartistaRef = ref(null)
  const toptrackRef = ref(null)
  const toptrack6Ref = ref(null)
  const toptrackallRef = ref(null)
  const sptplaylistsRef = ref(null)

  // Dynamic refs map for elements with IDs like 'p' + id or 'd' + id
  const dynamicRefs = ref(new Map())

  // Helper function to get or create a dynamic ref
  const getDynamicRef = (prefix, id) => {
    const key = `${prefix}${id}`
    if (!dynamicRefs.value.has(key)) {
      dynamicRefs.value.set(key, ref(null))
    }
    return dynamicRefs.value.get(key)
  }

  // Helper function to get playlist ref
  const getPlaylistRef = (id) => getDynamicRef('p', id)

  // Helper function to get deeper ref
  const getDeeperRef = (id) => getDynamicRef('d', id)

  // Helper function to get artist ref
  const getArtistRef = (id) => getDynamicRef('art', id)

  // Helper function to get track ref
  const getTrackRef = (id) => getDynamicRef('track', id)

  // Helper function to scroll to element
  const scrollToElement = async (elementRef, options = { behavior: 'smooth' }) => {
    await nextTick()
    if (elementRef.value) {
      elementRef.value.scrollIntoView(options)
    }
  }

  // Helper function to show/hide element
  const toggleElementVisibility = async (elementRef, show = true) => {
    await nextTick()
    if (elementRef.value) {
      elementRef.value.style.display = show ? 'block' : 'none'
    }
  }

  // Helper function to set element class
  const setElementClass = async (elementRef, className) => {
    await nextTick()
    if (elementRef.value) {
      elementRef.value.className = className
    }
  }

  // Helper function to add element class
  const addElementClass = async (elementRef, className) => {
    await nextTick()
    if (elementRef.value) {
      elementRef.value.classList.add(className)
    }
  }

  // Helper function to remove element class
  const removeElementClass = async (elementRef, className) => {
    await nextTick()
    if (elementRef.value) {
      elementRef.value.classList.remove(className)
    }
  }

  // Helper function to insert HTML
  const insertHTML = async (elementRef, position, html) => {
    await nextTick()
    if (elementRef.value) {
      elementRef.value.insertAdjacentHTML(position, html)
    }
  }

  // Helper function to remove element
  const removeElement = async (elementRef) => {
    await nextTick()
    if (elementRef.value) {
      elementRef.value.remove()
    }
  }

  // Helper function to get all elements with a specific selector
  const querySelectorAll = (selector) => {
    return document.querySelectorAll(selector)
  }

  // Helper function to get element by ID (fallback)
  const getElementById = (id) => {
    return document.getElementById(id)
  }

  // Helper function to get element by selector
  const querySelector = (selector) => {
    return document.querySelector(selector)
  }

  // Helper function to show only specific element and hide others
  const showOnlyElement = async (targetRef, allRefs) => {
    await nextTick()
    allRefs.forEach(ref => {
      if (ref.value) {
        ref.value.style.display = 'none'
      }
    })
    if (targetRef.value) {
      targetRef.value.style.display = 'block'
    }
  }

  // Helper function to show only specific element and hide others by class
  const showOnlyElementByClass = async (targetRef, className) => {
    await nextTick()
    const elements = document.querySelectorAll(`.${className}`)
    elements.forEach(element => {
      element.style.display = 'none'
    })
    if (targetRef.value) {
      targetRef.value.style.display = 'block'
    }
  }

  // Helper function to show only specific element and hide others by class (without target ref)
  const showOnlyElementByClassWithoutRef = async (className, targetId) => {
    await nextTick()
    const elements = document.querySelectorAll(`.${className}`)
    elements.forEach(element => {
      element.style.display = 'none'
    })
    if (targetId) {
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.style.display = 'block'
      }
    }
  }

  // Helper function to reset all tab classes
  const resetTabClasses = async () => {
    await nextTick()
    const tabRefs = [playlistlistRef, taRef, ttRef, saRef, stRef, faRef, nrRef, sptRef, searRef]
    tabRefs.forEach(ref => {
      if (ref.value) {
        ref.value.className = ''
      }
    })
  }

  // Helper function to set active tab
  const setActiveTab = async (tabRef) => {
    await nextTick()
    await resetTabClasses()
    if (tabRef.value) {
      tabRef.value.className = 'tabs_target'
    }
  }

  return {
    // Static refs
    playlistlistRef,
    taRef,
    ttRef,
    saRef,
    stRef,
    faRef,
    nrRef,
    sptRef,
    searRef,
    yourplaylistsRef,
    topartistRef,
    topartist6Ref,
    topartistaRef,
    toptrackRef,
    toptrack6Ref,
    toptrackallRef,
    sptplaylistsRef,

    // Dynamic refs
    dynamicRefs,
    getDynamicRef,
    getPlaylistRef,
    getDeeperRef,
    getArtistRef,
    getTrackRef,

    // Utility functions
    scrollToElement,
    toggleElementVisibility,
    setElementClass,
    addElementClass,
    removeElementClass,
    insertHTML,
    removeElement,
    querySelectorAll,
    getElementById,
    querySelector,
    showOnlyElement,
    showOnlyElementByClass,
    showOnlyElementByClassWithoutRef,
    resetTabClasses,
    setActiveTab
  }
}
