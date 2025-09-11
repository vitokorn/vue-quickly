import { computed } from 'vue'

/**
 * Composable to handle media display logic for mobile components
 * @param {Object} item - The item object (track, album, artist)
 * @param {Object} cover - Optional cover image object
 * @returns {Object} Object with computed properties for mobile display logic
 */
export function useMobileMediaDisplay(item, cover = null) {
  // Get the image to use (either from cover parameter or item.images[0])
  const image = computed(() => {
    if (cover) return cover
    if (item.value?.images?.[0]) return item.value.images[0]
    if (item.value?.album?.images?.[0]) return item.value.album.images[0]
    return null
  })

  // Check if item has preview URL
  const hasPreview = computed(() => {
    return !!(item.value?.preview_url || item.value?.previewUrl)
  })

  // Check if item has an image
  const hasImage = computed(() => {
    return !!image.value
  })

  // Determine the display class based on preview and image availability
  const displayClass = computed(() => {
    if (hasPreview.value && hasImage.value) {
      return 'mobile-playable'
    } else if (!hasPreview.value && hasImage.value) {
      return 'mobile-unplayable mobile-half-opacity'
    } else if (hasPreview.value && !hasImage.value) {
      return 'mobile-playable mobile-no-image'
    } else {
      return 'mobile-unplayable mobile-no-image mobile-half-opacity'
    }
  })

  // Get background image style if image exists
  const backgroundStyle = computed(() => {
    if (hasImage.value) {
      return { 'background-image': `url(${image.value.url})` }
    }
    return {}
  })

  // Get preview URL for mobile audio
  const previewUrl = computed(() => {
    return hasPreview.value ? (item.value.preview_url || item.value.previewUrl) : null
  })

  // Get track ID for mobile audio
  const trackId = computed(() => {
    return item.value?.id || null
  })

  return {
    image,
    hasPreview,
    hasImage,
    displayClass,
    backgroundStyle,
    previewUrl,
    trackId
  }
}
