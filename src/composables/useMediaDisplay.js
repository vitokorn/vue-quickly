import {computed} from 'vue'

/**
 * Composable to handle media display logic for tracks, albums, and artists
 * @param {Object} item - The item object (track, album, artist)
 * @param {Object} cover - Optional cover image object
 * @returns {Object} Object with computed properties for display logic
 */
export function useMediaDisplay(item, cover = null) {
    // Get the image to use (either from cover parameter or item.images[0])
    const image = computed(() => {
        if (cover && cover.value) return cover.value
        if (cover) return cover
        if (item.value?.images?.[0]) return item.value.images[0]
        if (item.value?.album?.images?.[0]) return item.value.album.images[0]
        return null
    })

    // Check if item has preview URL
    const hasPreview = computed(() => {
        if (item.value?.tracks?.items) {
            return item.value?.tracks?.items[0].preview_url
        }
        return !!item.value?.preview_url
    })

    // Check if item has an image
    const hasImage = computed(() => {
        return !!image.value
    })

    // Determine the display class based on preview and image availability
    const displayClass = computed(() => {
        if (hasPreview.value && hasImage.value) {
            return 'playable'
        } else if (!hasPreview.value && hasImage.value) {
            return 'unplayable half-opacity'
        } else if (hasPreview.value && !hasImage.value) {
            return 'playable no-image'
        } else {
            return 'unplayable no-image half-opacity'
        }
    })

    // Get background image style if image exists
    const backgroundStyle = computed(() => {
        if (hasImage.value && image.value?.url) {
            try {
                // Use encodeURI to properly encode the URL
                const encodedUrl = encodeURI(image.value.url)
                return {'background-image': `url(${encodedUrl})`}
            } catch (error) {
                console.warn('Invalid image URL:', image.value.url, error)
                return {}
            }
        }
        return {}
    })

    // Determine if audio should be preloaded
    const audioPreload = computed(() => {
        return hasPreview.value ? 'auto' : 'none'
    })

    // Get audio source
    const audioSrc = computed(() => {
        if (hasPreview.value && item.value?.preview_url) {
            try {
                // Use encodeURI to properly encode the URL
                return encodeURI(item.value.preview_url)
            } catch (error) {
                console.warn('Invalid audio URL:', item.value.preview_url, error)
                return ''
            }
        } else if (item.value?.tracks?.items) {
            try {
                // Use encodeURI to properly encode the URL
                return encodeURI(item.value.tracks.items[0].preview_url)
            } catch (error) {
                console.warn('Invalid audio URL:', item.value.preview_url, error)
                return ''
            }
        }
        return ''
    })

    return {
        image,
        hasPreview,
        hasImage,
        displayClass,
        backgroundStyle,
        audioPreload,
        audioSrc
    }
}
