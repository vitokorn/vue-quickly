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
        if (item.value?.tracks?.items && item.value.tracks.items.length > 0) {
            const firstTrack = item.value.tracks.items[0]
            return !!(firstTrack?.preview_url || firstTrack?.previewUrl)
        } else if (item.value?.tracks && item.value?.tracks.length > 0) {
            const firstTrack = item.value.tracks[0]
            return !!(firstTrack?.preview_url || firstTrack?.previewUrl)
        }
        return !!(item.value?.preview_url || item.value?.previewUrl)
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
        // Check direct preview URL first
        const directPreviewUrl = item.value?.preview_url || item.value?.previewUrl
        if (directPreviewUrl) {
            try {
                return encodeURI(directPreviewUrl)
            } catch (error) {
                console.warn('Invalid direct audio URL:', directPreviewUrl, error)
                return ''
            }
        }

        // Check tracks.items structure (Deezer/some Spotify responses)
        if (item.value?.tracks?.items && item.value.tracks.items.length > 0) {
            const firstTrack = item.value.tracks.items[0]
            const trackPreviewUrl = firstTrack?.preview_url || firstTrack?.previewUrl
            if (trackPreviewUrl) {
                try {
                    return encodeURI(trackPreviewUrl)
                } catch (error) {
                    console.warn('Invalid track audio URL:', trackPreviewUrl, error)
                    return ''
                }
            }
        }

        // Check tracks array structure (direct tracks array)
        if (item.value?.tracks && Array.isArray(item.value.tracks) && item.value.tracks.length > 0) {
            const firstTrackWithPreview = item.value.tracks.find(track =>
                track.previewUrl || track.preview_url
            )
            if (firstTrackWithPreview) {
                const trackPreviewUrl = firstTrackWithPreview.previewUrl || firstTrackWithPreview.preview_url
                if (trackPreviewUrl) {
                    try {
                        return encodeURI(trackPreviewUrl)
                    } catch (error) {
                        console.warn('Invalid array track audio URL:', trackPreviewUrl, error)
                        return ''
                    }
                }
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
