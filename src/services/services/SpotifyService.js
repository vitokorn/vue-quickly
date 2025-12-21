import {MusicServiceInterface} from '../MusicServiceInterface.js'
import {
    Album,
    Artist,
    ExternalUrls,
    Image,
    Playlist,
    SearchResults,
    SERVICE_TYPES,
    TIME_RANGES,
    Track,
    User
} from '../types.js'
import axios from 'axios'

export class SpotifyService extends MusicServiceInterface {
    constructor() {
        super()
        this.baseURL = 'https://api.spotify.com/v1'
        this.backendUrl = 'http://localhost:8000'
        this.serviceType = SERVICE_TYPES.SPOTIFY
    }

    getServiceName() {
        return 'Spotify'
    }

    getServiceType() {
        return this.serviceType
    }

    getToken() {
        return document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    }

    getUsername() {
        return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    }

    getCountry() {
        return document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    }

    async request(endpoint, options = {}) {
        const token = this.getToken()
        const config = {
            url: `${this.baseURL}${endpoint}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                ...options.headers
            },
            ...options
        }

        try {
            const response = await axios(config)
            return response
        } catch (error) {
            if (error.response?.status === 401) {
                await this.refreshToken()
                // Retry the request with new token
                config.headers['Authorization'] = `Bearer ${this.getToken()}`
                return axios(config)
            }
            throw error
        }
    }

    async refreshToken() {
        const username = this.getUsername()
        const response = await axios.get(`/spotify/refresh_token/${username}`)
        if (response.status === 200) {
            return response.data
        }
        throw new Error('Failed to refresh token')
    }

    // Authentication methods
    async authenticate() {
        // Redirect to Spotify OAuth
        window.location.href = '/spotify/login'
    }

    logout() {
        window.location.href = '/spotify/logout'
    }

    isAuthenticated() {
        return !!this.getToken()
    }

    // User data methods
    async getCurrentUser() {
        const response = await this.request('/me')
        return this.transformUser({
            id: response.data.id,
            displayName: response.data.display_name,
            email: response.data.email,
            country: response.data.country,
            images: response.data.images?.map(img => new Image(img.url, img.width, img.height)) || [],
            followers: response.data.followers?.total || 0,
            service: this.serviceType
        })
    }

    async getTopTracks(timeRange = TIME_RANGES.SHORT) {
        const response = await this.request(`/me/top/tracks?time_range=${timeRange}`)
        const tracks = response.data.items.map(track => this.transformTrack({
            ...track,
            service: this.serviceType
        }))
        return this.enrichTracksWithDeezerPreview(tracks)
    }

    async getTopArtists(timeRange = TIME_RANGES.SHORT) {
        const response = await this.request(`/me/top/artists?time_range=${timeRange}`)
        return response.data.items.map(artist => this.transformArtist({
            ...artist,
            service: this.serviceType
        }))
    }

    async getSavedAlbums(offset = 0, limit = 20) {
        const response = await this.request(`/me/albums?offset=${offset}&limit=${limit}`)
        const items = await Promise.all(response.data.items.map(async (item) => ({
            ...item,
            album: await this.enrichSingleAlbumWithDeezerPreview(this.transformAlbum({
                ...item.album,
                service: this.serviceType
            }))
        })))

        return items
    }

    async getSavedTracks(offset = 0, limit = 50) {
        const response = await this.request(`/me/tracks?offset=${offset}&limit=${limit}`)
        // Return the original structure with track property for compatibility
        const baseItems = response.data.items.map(item => ({
            ...item,
            track: this.transformTrack({
                ...item.track,
                service: this.serviceType
            })
        }))

        const enrichedTracks = await this.enrichTracksWithDeezerPreview(baseItems.map(item => item.track))
        const items = baseItems.map((item, index) => ({
            ...item,
            track: enrichedTracks[index]
        }))

        // Return both items and total for proper pagination
        return {
            items,
            total: response.data.total
        }
    }

    async getFollowedArtists(limit = 50) {
        const response = await this.request(`/me/following?type=artist&limit=${limit}`)
        return response.data.artists.items.map(artist => this.transformArtist({
            ...artist,
            service: this.serviceType
        }))
    }

    // Playlist methods
    async getPlaylists(offset = 0, limit = 50) {
        const response = await this.request(`/users/spotify/playlists?fields=items(name,id,images,owner,public)&limit=${limit}&offset=${offset}`)
        return response.data.items.map(playlist => this.transformPlaylist({
            ...playlist,
            service: this.serviceType
        }))
    }

    async getPlaylist(id) {
        const playlistResponse = await this.request(`/playlists/${id}`)

        let playlistWithTracks
        if (playlistResponse.data.tracks?.items && playlistResponse.data.tracks.items.length > 0) {
            playlistWithTracks = {
                ...playlistResponse.data
            }
        } else {
            // If no tracks in the response, fetch them separately
            const tracksResponse = await this.request(`/playlists/${id}/tracks?limit=100`)
            playlistWithTracks = {
                ...playlistResponse.data,
                tracks: {
                    items: tracksResponse.data.items,
                    total: tracksResponse.data.total
                }
            }
        }

        // Transform playlist and enhance tracks with Deezer previews
        const transformedPlaylist = this.transformPlaylist({
            ...playlistWithTracks,
            service: this.serviceType
        })

        // Enhance tracks with Deezer previews for tracks without Spotify previews
        if (transformedPlaylist.tracks && transformedPlaylist.tracks.length > 0) {
            const enhancedTracks = await Promise.all(
                transformedPlaylist.tracks.map(async (track) => {
                    if (!track.previewUrl) {
                        try {
                            // Search for Deezer preview using track name and primary artist
                            const artistName = track.artists[0]?.name || ''
                            const searchQuery = `${track.name} ${artistName}`.trim()
                            const deezerPreview = await this.getDeezerPreview(searchQuery)

                            if (deezerPreview?.previewUrl) {
                                return {
                                    ...track,
                                    previewUrl: deezerPreview.previewUrl,
                                    externalUrls: {
                                        ...track.externalUrls,
                                        deezer: deezerPreview.externalUrl || track.externalUrls?.deezer
                                    }
                                }
                            }
                        } catch (error) {
                            console.warn(`Failed to fetch Deezer preview for track "${track.name}":`, error.message)
                        }
                    }
                    return track
                })
            )

            transformedPlaylist.tracks = enhancedTracks
        }

        return transformedPlaylist
    }

    async getPlaylistTracks(id, offset = 0, limit = 100) {
        const response = await this.request(`/playlists/${id}/tracks?offset=${offset}&limit=${limit}`)
        return response.data.items.map(item => this.transformTrack({
            ...item.track,
            service: this.serviceType
        }))
    }

    async getGenrePlaylist(id) {
        // For Spotify, a genre entry refers to a playlist id; fetch full playlist with tracks
        const playlistResponse = await this.request(`/playlists/${id}`)
        const tracksResponse = await this.request(`/playlists/${id}/tracks?limit=50`)

        console.log('Spotify getGenrePlaylist - playlist:', playlistResponse.data.name)
        console.log('Spotify getGenrePlaylist - tracks count:', tracksResponse.data.items.length)

        // Combine playlist metadata with tracks in the format transformPlaylist expects
        const playlistWithTracks = {
            ...playlistResponse.data,
            tracks: {
                items: tracksResponse.data.items,
                total: tracksResponse.data.total
            }
        }

        return this.transformPlaylist(playlistWithTracks)
    }

    async createPlaylist(name, description = '') {
        const username = this.getUsername()
        const response = await this.request(`/users/${username}/playlists`, {
            method: 'POST',
            data: {name, description}
        })
        return this.transformPlaylist({
            ...response.data,
            service: this.serviceType
        })
    }

    async addTracksToPlaylist(playlistId, trackIds) {
        const uris = trackIds.map(id => `spotify:track:${id}`).join(',')
        await this.request(`/playlists/${playlistId}/tracks?uris=${uris}`, {
            method: 'POST'
        })
    }

    // Artist methods
    async getArtist(id) {
        const response = await this.request(`/artists/${id}`)
        return this.transformArtist({
            ...response.data,
            service: this.serviceType
        })
    }

    async getArtistTopTracks(id, market = 'US') {
        const country = this.getCountry()
        const response = await this.request(`/artists/${id}/top-tracks?market=${market}${country}`)
        const tracks = response.data.tracks.map(track => this.transformTrack({
            ...track,
            service: this.serviceType
        }))

        return this.enrichTracksWithDeezerPreview(tracks)
    }

    async getArtistAlbums(id, includeGroups = 'album', limit = 10) {
        const response = await this.request(`/artists/${id}/albums?include_groups=${includeGroups}&limit=${limit}`)
        const albums = response.data.items.map(album => this.transformAlbum({
            ...album,
            service: this.serviceType
        }))
        return this.enrichAlbumsWithDeezerPreview(albums)
    }

    async getArtistSingles(id, limit = 10) {
        const response = await this.request(`/artists/${id}/albums?include_groups=single&limit=${limit}`)
        const albums = response.data.items.map(album => this.transformAlbum({
            ...album,
            service: this.serviceType
        }))
        return this.enrichAlbumsWithDeezerPreview(albums)
    }

    async getArtistAppearances(id, limit = 10) {
        const response = await this.request(`/artists/${id}/albums?include_groups=appears_on&limit=${limit}`)
        return response.data.items.map(album => this.transformAlbum({
            ...album,
            service: this.serviceType
        }))
    }

    async getArtistPlaylists(id, limit = 10) {
        console.warn('getArtistPlaylists not fully implemented for Spotify service (returning empty array for now)')
        return []
    }

    async getRelatedArtists(id) {
        try {
            const response = await this.request(`/artists/${id}/related-artists`)
            return response.data.artists.map(artist => this.transformArtist({
                ...artist,
                service: this.serviceType
            }))
        } catch (error) {
            console.warn('Failed to fetch related artists:', error.message)
            return []
        }
    }

    // Album methods
    async getAlbum(id) {
        const response = await this.request(`/albums/${id}`)
        return this.transformAlbum({
            ...response.data,
            service: this.serviceType
        })
    }

    async getAlbumTracks(id) {
        const response = await this.request(`/albums/${id}/tracks`)
        return response.data.items.map(track => this.transformTrack({
            ...track,
            service: this.serviceType
        }))
    }

    // Track methods
    async getTrack(id) {
        const response = await this.request(`/tracks/${id}`)
        return this.transformTrack({
            ...response.data,
            service: this.serviceType
        })
    }

    // Search and discovery
    async search(query, types = ['track', 'artist', 'album', 'playlist'], limit = 5) {
        const response = await this.request(`/search/?q=${encodeURIComponent(query)}&type=${types.join(',')}&limit=${limit}`)

        return new SearchResults({
            tracks: response.data.tracks?.items.map(track => this.transformTrack({
                ...track,
                service: this.serviceType
            })) || [],
            artists: response.data.artists?.items.map(artist => this.transformArtist({
                ...artist,
                service: this.serviceType
            })) || [],
            albums: response.data.albums?.items.map(album => this.transformAlbum({
                ...album,
                service: this.serviceType
            })) || [],
            playlists: response.data.playlists?.items.map(playlist => this.transformPlaylist({
                ...playlist,
                service: this.serviceType
            })) || [],
            total: response.data.tracks?.total || 0
        })
    }

    async getNewReleases(limit = 20, offset = 0) {
        const response = await this.request(`/browse/new-releases?limit=${limit}&offset=${offset}`)
        return response.data.albums.items.map(album => this.transformAlbum({
            ...album,
            service: this.serviceType
        }))
    }

    async getRecommendations(params) {
        const queryString = Object.entries(params)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')
        const response = await this.request(`/recommendations?${queryString}`)
        return response.data.tracks.map(track => this.transformTrack({
            ...track,
            service: this.serviceType
        }))
    }

    // Categories methods
    async getCategories(offset = 0, limit = 50) {
        const response = await this.request(`/browse/categories?offset=${offset}&limit=${limit}`)
        return {
            items: response.data.categories.items.map(category => ({
                id: category.id,
                name: category.name,
                icons: category.icons,
                href: category.href
            })),
            total: response.data.categories.total,
            next: response.data.categories.next,
            previous: response.data.categories.previous
        }
    }

    async getCategoryPlaylists(categoryId, offset = 0, limit = 50) {
        const response = await this.request(`/browse/categories/${categoryId}/playlists?offset=${offset}&limit=${limit}`)
        return {
            items: response.data.playlists.items.map(playlist => this.transformPlaylist({
                ...playlist,
                service: this.serviceType
            })),
            total: response.data.playlists.total,
            next: response.data.playlists.next,
            previous: response.data.playlists.previous
        }
    }

    // Genres methods
    async getGenres(offset = 0, limit = 50) {
        try {
            // Load genres from the_sound_of.json file
            // Try multiple possible paths for the JSON file
            let response;
            const possiblePaths = [
                '/src/data/the_sound_of.json',
                '/data/the_sound_of.json',
                './data/the_sound_of.json',
                '../data/the_sound_of.json'
            ];

            for (const path of possiblePaths) {
                try {
                    response = await fetch(path);
                    if (response.ok) {
                        console.log('✅ Found genres file at:', path)
                        break;
                    }
                } catch (e) {
                    console.log('❌ Failed to load from:', path, e.message)
                }
            }

            if (!response || !response.ok) {
                throw new Error('Failed to load genres data from any path')
            }

            const genresData = await response.json()

            // Transform the data to match the expected format
            const genres = genresData.slice(offset, offset + limit).map(genre => ({
                id: genre.id,
                name: genre.name,
                type: 'genre',
                icons: [],
                href: `https://open.spotify.com/genre/${genre.id}`,
                description: genre.name,
                // Add additional image sizes if available
                images: []
            }))

            return {
                items: genres,
                total: genresData.length,
                next: offset + limit < genresData.length ? `/genres?offset=${offset + limit}&limit=${limit}` : null,
                previous: offset > 0 ? `/genres?offset=${Math.max(0, offset - limit)}&limit=${limit}` : null
            }
        } catch (error) {
            console.error('Spotify getGenres error:', error)
            throw error
        }
    }


    // Follow/Unfollow methods
    async followArtist(id) {
        await this.request(`/me/following?type=artist&ids=${id}`, {method: 'PUT'})
    }

    async unfollowArtist(id) {
        await this.request(`/me/following?type=artist&ids=${id}`, {method: 'DELETE'})
    }

    async followAlbum(id) {
        await this.request(`/me/albums?ids=${id}`, {method: 'PUT'})
    }

    async unfollowAlbum(id) {
        await this.request(`/me/albums?ids=${id}`, {method: 'DELETE'})
    }

    async followTrack(id) {
        await this.request(`/me/tracks?ids=${id}`, {method: 'PUT'})
    }

    async unfollowTrack(id) {
        await this.request(`/me/tracks?ids=${id}`, {method: 'DELETE'})
    }

    async followPlaylist(id) {
        await this.request(`/playlists/${id}/followers`, {method: 'PUT'})
    }

    async unfollowPlaylist(id) {
        await this.request(`/playlists/${id}/followers`, {method: 'DELETE'})
    }

    // Check following status
    async checkFollowingArtist(id) {
        const response = await this.request(`/me/following/contains?type=artist&ids=${id}`)
        return response.data[0]
    }

    async checkFollowingAlbum(id) {
        const response = await this.request(`/me/albums/contains?ids=${id}`)
        return response.data[0]
    }

    async checkFollowingTrack(id) {
        const response = await this.request(`/me/tracks/contains?ids=${id}`)
        return response.data[0]
    }

    async checkFollowingPlaylist(id) {
        const username = this.getUsername()
        const response = await this.request(`/playlists/${id}/followers/contains?ids=${username}`)
        return response.data[0]
    }

    // Data transformation methods
    transformTrack(data) {
        return new Track({
            id: data.id,
            name: data.name,
            artists: data.artists?.map(artist => this.transformArtist({
                ...artist,
                service: this.serviceType
            })) || [],
            album: data.album ? this.transformAlbum({
                ...data.album,
                service: this.serviceType
            }) : null,
            duration: data.duration_ms || data.duration,
            previewUrl: data.preview_url,
            externalUrls: new ExternalUrls(this.serviceType, data.external_urls || {}),
            service: this.serviceType,
            popularity: data.popularity || 0,
            trackNumber: data.track_number || 0,
            discNumber: data.disc_number || 1,
            followed: data.followed || false
        })
    }

    transformArtist(data) {
        return new Artist({
            id: data.id,
            name: data.name,
            images: data.images?.map(img => new Image(img.url, img.width, img.height)) || [],
            genres: data.genres || [],
            externalUrls: new ExternalUrls(this.serviceType, data.external_urls || {}),
            service: this.serviceType,
            popularity: data.popularity || 0,
            followers: data.followers?.total || 0,
            followed: data.followed || false
        })
    }

    transformAlbum(data) {
        return new Album({
            id: data.id,
            name: data.name,
            artists: data.artists?.map(artist => this.transformArtist({
                ...artist,
                service: this.serviceType
            })) || [],
            images: data.images?.map(img => new Image(img.url, img.width, img.height)) || [],
            releaseDate: data.release_date,
            totalTracks: data.total_tracks || 0,
            externalUrls: new ExternalUrls(this.serviceType, data.external_urls || {}),
            service: this.serviceType,
            albumType: data.album_type || 'album',
            followed: data.followed || false
        })
    }

    transformPlaylist(data) {
        return new Playlist({
            id: data.id,
            name: data.name,
            description: data.description || '',
            images: data.images?.map(img => new Image(img.url, img.width, img.height)) || [],
            owner: data.owner,
            public: data.public || false,
            totalTracks: data.tracks?.total || 0,
            externalUrls: new ExternalUrls(this.serviceType, data.external_urls || {}),
            service: this.serviceType,
            followed: data.followed || false,
            tracks: data.tracks?.items?.map(item => this.transformTrack({
                ...item.track,
                service: this.serviceType
            })) || []
        })
    }

    transformUser(data) {
        return new User({
            id: data.id,
            displayName: data.displayName,
            email: data.email,
            country: data.country,
            images: data.images,
            followers: data.followers,
            service: this.serviceType
        })
    }

    async enrichTracksWithDeezerPreview(tracks = []) {
        if (!Array.isArray(tracks) || tracks.length === 0) {
            return tracks
        }

        return Promise.all(tracks.map(async (track) => {
            if (!track || track.previewUrl) {
                return track
            }

            const artistName = track.artists?.[0]?.name || ''
            const searchQuery = `${track.name || ''} ${artistName}`.trim()
            if (!searchQuery) {
                return track
            }

            try {
                const deezerPreview = await this.getDeezerPreview(searchQuery)
                if (deezerPreview?.previewUrl) {
                    return {
                        ...track,
                        previewUrl: deezerPreview.previewUrl,
                        externalUrls: this.mergeExternalUrls(track.externalUrls, deezerPreview.externalUrl)
                    }
                }
            } catch (error) {
                console.warn(`Failed to enrich track "${track.name}" with Deezer preview:`, error.message)
            }

            return track
        }))
    }

    async enrichAlbumsWithDeezerPreview(albums = []) {
        if (!Array.isArray(albums) || albums.length === 0) {
            return albums
        }

        return Promise.all(albums.map(async (album) => {
            if (!album || album.previewUrl) {
                return album
            }

            const artistName = album.artists?.[0]?.name || ''
            const searchQuery = `${album.name || ''} ${artistName}`.trim()
            if (!searchQuery) {
                return album
            }

            try {
                const deezerPreview = await this.getDeezerPreview(searchQuery)
                if (deezerPreview?.previewUrl) {
                    return {
                        ...album,
                        previewUrl: deezerPreview.previewUrl,
                        externalUrls: this.mergeExternalUrls(album.externalUrls, deezerPreview.externalUrl)
                    }
                }
            } catch (error) {
                console.warn(`Failed to enrich album "${album.name}" with Deezer preview:`, error.message)
            }

            return album
        }))
    }

    async enrichSingleAlbumWithDeezerPreview(album) {
        if (!album) {
            return album
        }

        const [enriched] = await this.enrichAlbumsWithDeezerPreview([album])
        return enriched || album
    }

    mergeExternalUrls(existing, deezerUrl) {
        if (!deezerUrl) {
            return existing
        }

        if (existing instanceof ExternalUrls) {
            return new ExternalUrls(existing.service, {
                ...existing.urls,
                deezer: deezerUrl
            })
        }

        return {
            ...(existing || {}),
            deezer: deezerUrl
        }
    }

    async getUserPlaylists(userId, limit = 20, offset = 0) {
        try {
            let endpoint
            if (userId) {
                // Get playlists for a specific user
                endpoint = `/users/${userId}/playlists?limit=${limit}&offset=${offset}`
            } else {
                // Get current user's playlists
                endpoint = `/me/playlists?limit=${limit}&offset=${offset}`
            }

            const response = await this.request(endpoint)
            const playlists = response.data.items || []
            return playlists.map(playlist => this.transformPlaylist({
                ...playlist,
                service: this.serviceType
            }))
        } catch (error) {
            console.error('Spotify getUserPlaylists error:', error)
            throw error
        }
    }

    // Deezer integration methods
    async getDeezerPreview(query) {
        try {
            const trimmedQuery = query?.trim()
            if (!trimmedQuery) {
                return null
            }

            const response = await axios.get(`${this.backendUrl}/deezer/search/preview`, {
                params: {
                    query: trimmedQuery,
                    limit: 1
                }
            })
            if (!Array.isArray(response.data) || response.data.length === 0) {
                return null
            }

            const track = response.data[0]
            if (!track?.preview) {
                return null
            }

            return {
                previewUrl: track.preview,
                externalUrl: track.link
            }
        } catch (error) {
            console.error('Error fetching Deezer preview:', error)
            return null
        }
    }
}
