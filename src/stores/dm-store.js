import {defineStore} from 'pinia';
import axios from "axios";
import titleCase from "../common/titleCase";
import {Lists} from "../common/lists";
import {toRaw} from "vue";

export const useDMStore = defineStore('dm', {
        state: () => ({
            deeper1: [],
            deeper2: [],
            deeper22: [],
            deeper23: [],
            deeper3: [],
            deeper32: [],
            deeper33: [],
            deeper4: [],
            deeper5: [],
            deeper6: [],
            deeper7: [],
            deeper8: [],
            deeper9: [],
            deepers: [],
            queue: localStorage.getItem('queue') && JSON.parse(localStorage.getItem('queue')).length || null,
            queuearr: localStorage.getItem('queue') && JSON.parse(localStorage.getItem('queue')) || null,
            listplaylists: [],
            playinfo: [],
            playlists: [],
            topartist: [],
            topartist6: [],
            topartista: [],
            taactivetab: null,
            ttactivetab: null,
            savedalbums: [],
            savedtracks: [],
            newreleases: [],
            followedartists: [],
            items: [],
            itemsm: [],
            itemsl: [],
            spotplaylists: [],
            sptinfo: [],
            sptplaylists: [],
            arr: [],
            tracks: [],
            artists: [],
            albums: [],
            splaylists: [],
            currentpl: null,
            currentspl: null,
            searchtimer: null,
            currenttrack: null,
            loader: false,
            selectedArtistsRange: 1,
            selectedTracksRange: 1,
            queueModal: false,
            unplayable_tracks: true,
            audio_preview: true,
            open_links: true,
            restart_song_on_hover: false,
            artists_data: [],
            tracks_data: [],
            albums_data: [],
            seed_artists_data: [],
            seed_tracks_data: []
        }),
        getters: {
            getDeeper1: (state) => state.deeper1,
            getDeeper2: (state) => state.deeper2,
            getDeeper22: (state) => state.deeper22,
            getDeeper23: (state) => state.deeper23,
            getDeeper3: (state) => state.deeper3,
            getDeeper32: (state) => state.deeper32,
            getDeeper33: (state) => state.deeper33,
            getDeeper4: (state) => state.deeper4,
            getDeeper5: (state) => state.deeper5,
            getDeeper6: (state) => state.deeper6,
            getDeeper7: (state) => state.deeper7,
            getDeeper8: (state) => state.deeper8,
            getDeeper9: (state) => state.deeper9,
            getDeepers: (state) => state.deepers,
            getQueue: (state) => state.queue,
            getQueueArr: (state) => state.queuearr,
            getListPlaylists: (state) => state.listplaylists,
            getPlayinfo: (state) => state.playinfo,
            getPlaylists: (state) => state.playlists,
            getTopArtist: (state) => state.topartist,
            getTopArtist6: (state) => state.topartist6,
            getTopArtista: (state) => state.topartista,
            getTaactivetab: (state) => state.taactivetab,
            getTtactivetab: (state) => state.ttactivetab,
            getSavedAlbums: (state) => state.savedalbums,
            getSavedTracks: (state) => state.savedtracks,
            getNewReleases: (state) => state.newreleases,
            getFollowedArtists: (state) => state.followedartists,
            getItems: (state) => state.items,
            getItemsM: (state) => state.itemsm,
            getItemsL: (state) => state.itemsl,
            getSpotPlaylists: (state) => state.spotplaylists,
            getSptInfo: (state) => state.sptinfo,
            getSptPlaylists: (state) => state.sptplaylists,
            getAlbums: (state) => state.albums,
            getArtists: (state) => state.artists,
            getTracks: (state) => state.tracks,
            getSPlaylists: (state) => state.splaylists,
            getCurrentPl: (state) => state.currentpl,
            getCurrentSPl: (state) => state.currentspl,
            getSearchTimer: (state) => state.searchtimer,
            getCurrentTrack: (state) => state.currenttrack,
            getLoader: (state) => state.loader,
        },
        actions: {
            setDeeper1(deeper1) {
                console.log(deeper1)
                this.deeper1.push(deeper1)
            },
            setDeeper2(deeper2) {
                this.deeper2.push(deeper2)
            },
            setDeeper22(deeper22) {
                this.deeper22.push(deeper22);
            },
            setDeeper23(deeper23) {
                this.deeper23.push(deeper23);
            },
            setDeeper3(deeper3) {
                this.deeper3.push(deeper3)
            },
            setDeeper32(deeper32) {
                this.deeper32.push(deeper32);
            },
            setDeeper33(deeper33) {
                this.deeper33.push(deeper33);
            },
            setDeeper4(deeper4) {
                this.deeper4.push(deeper4);
            },
            setDeeper5(deeper5) {
                this.deeper5.push(deeper5);
            },
            setDeeper6(deeper6) {
                this.deeper6.push(deeper6);
            },
            setDeeper7(deeper7) {
                this.deeper7.push(deeper7);
            },
            setDeeper8(deeper8) {
                this.deeper8.push(deeper8);
            },
            setDeeper9(deeper9) {
                this.deeper9.push(deeper9);
            },
            setDeepers(deepers) {
                this.deepers.push(deepers);
            },
            setQueue(queue) {
                this.queue = queue;
            },
            setQueueArr(queuearr) {
                this.queuearr = queuearr;
            },
            setListPlaylists(value, empty) {
                if (empty) {
                    this.listplaylists = []
                } else if (value) {
                    this.listplaylists.push(...value);
                }
            },
            setPlayInfo(playinfo) {
                this.playinfo.push(playinfo);
            },
            setPlaylists(playlists) {
                this.playlists = playlists;
            },
            setPlaylists2(playlists) {
                this.playlists.push(playlists)
            },
            setTopArtist(topartist) {
                this.topartist = topartist
            },
            setTopArtist6(topartist6) {
                this.topartist6 = topartist6
            },
            setTopArtista(topartista) {
                this.topartista = topartista
            },
            setTaactivetab(taactivetab) {
                this.taactivetab = taactivetab
            },
            setTtactivetab(ttactivetab) {
                this.ttactivetab = ttactivetab
            },
            setSavedAlbums(savedalbums) {
                this.savedalbums.push(...savedalbums)
            },
            setSavedTracks(savedtracks) {
                this.savedtracks.push(...savedtracks)
            },
            setNewReleases(newreleases) {
                this.newreleases.push(...newreleases)
            },
            setFollowedArtists(followedartists) {
                this.followedartists = followedartists
            },
            setItems(items) {
                this.items = items
            },
            setItemsM(itemsm) {
                this.itemsm = itemsm
            },
            setItemsL(itemsl) {
                this.itemsl = itemsl
            },
            setSpotPlaylists(spotplaylists) {
                this.spotplaylists.push(...spotplaylists)
            },
            setSptInfo(sptinfo) {
                this.sptinfo = sptinfo
            },
            setSptPlaylists(sptplaylists) {
                this.sptplaylists.push(sptplaylists)
            },
            setAlbums(albums) {
                this.albums = albums
            },
            setArtists(artists) {
                this.artists = artists
            },
            setTracks(tracks) {
                this.tracks = tracks
            },
            setSPlaylists(splaylists) {
                this.splaylists = splaylists
            },
            setCurrentPl(currentPl) {
                this.currentpl = currentPl
            },
            setCurrentSPl(currentSPl) {
                this.currentspl = currentSPl
            },
            setSearchTimer(searchtimer) {
                this.searchtimer = searchtimer
            },
            setCurrentTrack(currentTrack) {
                this.currenttrack = currentTrack
            },
            click(event) {
                let target = event.target
                let audios = target.lastChild
                if (this.currenttrack != null && this.currenttrack !== audios) {
                    this.currenttrack.pause()
                    if (this.restart_song_on_hover) {
                        this.currenttrack.currentTime = 0
                    }
                }
                if (audios.paused === false) {
                    audios.pause()
                    if (this.restart_song_on_hover) {
                        audios.currentTime = 0
                    }
                } else
                    audios.play()
                this.currenttrack = audios
            },
            // action from vuex
            playl(payload) {
                let item = payload.item
                let pls = document.querySelectorAll('#search> .rectrack > div')
                for (let i = 0; i < pls.length; i++) {
                    if (document.getElementById('p' + item.id) != null && pls[i].id === document.getElementById('p' + item.id).id) {
                        document.getElementById('p' + item.id).style.display = 'block'
                    } else {
                        pls[i].style.display = 'none'
                    }
                }
                item.type = 'deeperplaylist'
                let indexing = this.deepers.indexOf(item)
                if (indexing === -1) {
                    this.deepers.push(item)
                }
                // setTimeout(() => {
                //     document.getElementById('p' + item.id).scrollIntoView({behavior: "smooth"})
                // }, 10);
            },
            playlM(payload) {
                let item = payload.item,
                    parent = payload.parent
                let pls = document.querySelectorAll('#search> .rectrack > div')
                for (let i = 0; i < pls.length; i++) {
                    if (document.getElementById('p' + item.id) != null && pls[i].id === document.getElementById('p' + item.id).id) {
                        document.getElementById('p' + item.id).style.display = 'block'
                    } else {
                        pls[i].style.display = 'none'
                    }
                }
                item.type = 'deeperplaylist'
                item.parentId = parent
                let indexing = this.deepers.indexOf(item)
                if (indexing === -1) {
                    this.deepers.push(item)
                }
                // setTimeout(() => {
                //     document.getElementById('p' + item.id).scrollIntoView({behavior: "smooth"})
                // }, 10);
            },
            async deeper(payload) {
                console.log(261)
                let item = payload.item,
                    num = payload.num,
                    event = payload.event
                console.log(item)
                let target = event.target
                let exists = false
                if (item.track) {
                    exists = this.tracks_data.find(dt => dt.id === item.track.id)
                } else {
                    exists = this.tracks_data.find(dt => dt.id === item.id)
                }

                let tracktrack = []
                tracktrack = item
                if (item.track) {
                    tracktrack = item.track
                }
                tracktrack.type = 'pl'
                tracktrack = toRaw(tracktrack)

                let allTracks = document.querySelectorAll(".rectrack > div");
                if (allTracks != null) {
                    for await(let i of allTracks) {
                        // eslint-disable-next-line no-empty
                        console.log(item.id)
                        if (i.id === 'd' + item.id) {
                            i.style.display = 'flex'
                        } else {
                            console.log(301)
                            i.style.display = 'none'
                        }
                    }
                }

                if (exists) {
                    tracktrack = exists
                } else {
                    let clone = structuredClone(tracktrack);
                    this.tracks_data.push(clone)
                }

                if (!exists) {
                    axios.get('https://api.spotify.com/v1/me/tracks/contains?ids=' + tracktrack.id,{
                        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            tracktrack.followed = response.data[0]
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.deeper(payload)
                                    }
                                })
                            }
                        })
                }
                if (num === 1) {
                    let indexing = this.deeper1.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper1(tracktrack)
                    }
                } else if (num === 2) {
                    let indexing = this.deeper2.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper2(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper2)
                } else if (num === 22) {
                    let indexing = this.deeper22.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper22(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper22)
                } else if (num === 23) {
                    let indexing = this.deeper23.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper23(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper23)
                } else if (num === 3) {
                    let indexing = this.deeper3.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper3(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper3)
                } else if (num === 32) {
                    let indexing = this.deeper32.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper32(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper32)
                } else if (num === 33) {
                    let indexing = this.deeper33.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper33(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper33)
                } else if (num === 4) {
                    let indexing = this.deeper4.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper4(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper4)
                } else if (num === 5) {
                    // console.log(item.track)
                    let indexing = this.deeper5.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper5(tracktrack)
                    }
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('d'+ tt.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                    // console.log(this.deeper5)
                } else if (num === 6) {
                    let indexing = this.deeper6.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper6(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper6)
                } else if (num === 7) {
                    tracktrack.preview_url = item.tracks.items[0].preview_url
                    let indexing = this.deeper7.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper7(tracktrack)
                    }
                    // console.log(this.deeper7)
                } else if (num === 8) {
                    let indexing = this.deeper8.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper8(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper8)
                } else if (num === 9) {

                    let indexing = this.deeper9.indexOf(tt)
                    if (!indexing) {
                        this.setDeeper9(tracktrack)
                    }
                    // console.log(tt)
                    // console.log(this.deeper9)
                } else if (num === 10) {
                    let indexing = this.deepers.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeepers(tracktrack)
                    }
                    // console.log(this.deepers)
                }
                if (num !== 1 && num !== 5 && num !== 8 && !exists) {
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('d'+ tracktrack.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                }
                // setTimeout(() => {
                //     document.getElementById('d' + tracktrack.id).scrollIntoView({behavior: "smooth"})
                // }, 10);

            },
            deepermobile: async function (payload) {
                console.log(570)
                let item = payload.item,
                    num = payload.num,
                    event = payload.event,
                    parent = payload.parent
                let target = event.target
                console.log(parent)
                let exists = false
                if (item.track) {
                    exists = this.tracks_data.find(dt => dt.id === item.track.id)
                } else {
                    exists = this.tracks_data.find(dt => dt.id === item.id)
                }

                let tracktrack = []
                tracktrack = item
                if (item.track) {
                    tracktrack = item.track
                }
                tracktrack.type = 'pl'
                tracktrack.parentId = parent
                tracktrack = toRaw(tracktrack)

                let allTracks = document.querySelectorAll(".rectrack > div");
                if (allTracks != null) {
                    for await(let i of allTracks) {
                        // eslint-disable-next-line no-empty
                        console.log(item.id)
                        if (i.id === 'd' + item.id) {
                            i.style.display = 'flex'
                        } else {
                            console.log(301)
                            i.style.display = 'none'
                        }
                    }
                }

                if (exists) {
                    tracktrack = exists
                } else {
                    let clone = structuredClone(tracktrack);
                    this.tracks_data.push(clone)
                }

                if (!exists) {
                    axios.get('https://api.spotify.com/v1/me/tracks/contains?ids=' + tracktrack.id,
                    {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            tracktrack.followed = response.data[0]
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.deeper(payload)
                                    }
                                })
                            }
                        })
                }
                if (num === 1) {
                    let indexing = this.deeper1.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper1(tracktrack)
                    }
                } else if (num === 2) {
                    let indexing = this.deeper2.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper2(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper2)
                } else if (num === 22) {
                    let indexing = this.deeper22.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper22(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper22)
                } else if (num === 23) {
                    let indexing = this.deeper23.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper23(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper23)
                } else if (num === 3) {
                    let indexing = this.deeper3.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper3(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper3)
                } else if (num === 32) {
                    let indexing = this.deeper32.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper32(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper32)
                } else if (num === 33) {
                    let indexing = this.deeper33.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper33(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper33)
                } else if (num === 4) {
                    let indexing = this.deeper4.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper4(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper4)
                } else if (num === 5) {
                    // console.log(item.track)
                    let indexing = this.deeper5.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper5(tracktrack)
                    }
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('d'+ tt.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                    // console.log(this.deeper5)
                } else if (num === 6) {
                    let indexing = this.deeper6.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper6(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper6)
                } else if (num === 7) {
                    tracktrack.preview_url = item.tracks.items[0].preview_url
                    let indexing = this.deeper7.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper7(tracktrack)
                    }
                    // console.log(this.deeper7)
                } else if (num === 8) {
                    let indexing = this.deeper8.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeeper8(tracktrack)
                    }
                    // console.log(tracktrack)
                    // console.log(this.deeper8)
                } else if (num === 9) {

                    let indexing = this.deeper9.indexOf(tt)
                    if (!indexing) {
                        this.setDeeper9(tracktrack)
                    }
                    // console.log(tt)
                    // console.log(this.deeper9)
                } else if (num === 10) {
                    let indexing = this.deepers.find(dt => dt.id === tracktrack.id)
                    if (!indexing) {
                        this.setDeepers(tracktrack)
                    }
                    // console.log(this.deepers)
                }
                if (num !== 1 && num !== 5 && num !== 8 && !exists) {
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('d'+ tracktrack.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                }
                // setTimeout(() => {
                //     document.getElementById('d' + tracktrack.id).scrollIntoView({behavior: "smooth"})
                // }, 10);
            },
            fetchPlaylists(payload) {
                let event = payload.event,
                    offset = payload.offset
                this.loader = true
                axios.get('https://api.spotify.com/v1/me/playlists?fields=items(name,id)&limit=50&offset=' + offset,
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        this.setListPlaylists(response.data['items'])
                        if (response.data['items'].length > 0) {
                            this.setListPlaylists(event.offset += 50)
                        }
                        if (response.data['items'].length > 49) {
                            this.fetchPlaylists({event: event, offset: offset += 50})
                        }
                        this.loader = false
                    })
                    .catch(error => {
                        console.log(error)
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                if (response.status === 200) {
                                    this.fetchPlaylists({event: event, offset: offset})
                                }
                                // let new_token = response.data['new_token']
                                // document.cookie ='access_token=' + new_token
                            })
                        }
                    })
            },
            fetchInit: function (payload) {
                let event = payload.event
                // console.log('167 '  + event.currentTarget.id)
                let id = event.currentTarget.id
                if (document.getElementById('p' + id)) {
                    // console.log(document.getElementById('p'+ id))
                    document.getElementById('p' + id).style.display = 'block'
                    // console.log(this.currentpl)
                    // this.commit('setCurrentPl',document.getElementById(id))

                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('p'+ id)).offsetTop,
                    //     behavior:'smooth'});
                    // },10)
                    return
                }
                let exists = this.playlists.find(dt => dt.id === id)
                if (!exists) {
                    axios.get('https://api.spotify.com/v1/playlists/' + id,
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            // console.log(response.data)
                            let data = response.data
                            console.log(data)
                            this.setCurrentPl(data)
                            this.setPlaylists2(data)
                        })
                } else {
                    this.setCurrentPl(exists)
                }
            },
            fetchArtist(payload) {
                let event = payload.event
                this.loader = true
                axios.get('https://api.spotify.com/v1/me/top/artists?time_range=short_term',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then(async (response) => {
                        let newarr = []
                        let items = response.data['items']
                        // console.log('235' + items[0].id)
                        for await(let i of items) {
                            // console.log('237' + items[i].id)
                            axios.get('https://api.spotify.com/v1/artists/' + i.id + '/top-tracks?market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                                {
                                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                            })
                                .then((response) => {
                                    // console.log('247' + response.data)
                                    let tracks = response.data['tracks']
                                    if (tracks[0]['preview_url']) {
                                        i.preview_url = tracks[0]['preview_url']
                                    }
                                    i.tracks = tracks
                                    newarr.push(i)
                                    if (i === items[items.length - 1]) {
                                        setTimeout(() => {
                                            this.setTopArtist(newarr)
                                        }, 1000)
                                    }
                                })
                        }
                        this.loader = false
                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200) {
                                    this.fetchArtist({event: event})
                                }
                            })
                        }
                    })
            },
            fetchArtist2(payload) {
                let event = payload.event
                this.loader = true
                axios.get('https://api.spotify.com/v1/me/top/artists?time_range=medium_term',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then(async (response) => {
                        let newarr = []
                        let items = response.data['items']
                        // console.log('235' + items[0].id)
                        for await(let i of items) {
                            // console.log('237' + items[i].id)
                            axios.get('https://api.spotify.com/v1/artists/' + i.id + '/top-tracks?market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                                {
                                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                            })
                                .then((response) => {
                                    // console.log('247' + response.data)
                                    let tracks = response.data['tracks']
                                    if (tracks[0]['preview_url']) {
                                        i.preview_url = tracks[0]['preview_url']
                                    }
                                    i.tracks = tracks
                                    newarr.push(i)
                                    if (i === items[items.length - 1]) {
                                        setTimeout(() => {
                                            this.setTopArtist6(newarr)
                                        }, 1000)
                                    }
                                })
                        }
                        this.loader = false
                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200) {
                                    this.fetchArtist2({event: event})
                                }
                            })
                        }
                    })
            },
            fetchArtist3(payload) {
                let event = payload.event
                this.loader = true
                axios.get('https://api.spotify.com/v1/me/top/artists?time_range=long_term',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then(async (response) => {
                        let newarr = []
                        let items = response.data['items']
                        // console.log('235' + items[0].id)
                        for await(let i of items) {
                            // console.log('237' + items[i].id)
                            axios.get('https://api.spotify.com/v1/artists/' + i.id + '/top-tracks?market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                                {
                                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                            })
                                .then((response) => {
                                    // console.log('247' + response.data)
                                    let tracks = response.data['tracks']
                                    if (tracks && tracks[0]['preview_url']) {
                                        i.preview_url = tracks[0]['preview_url']
                                    }
                                    i.tracks = tracks
                                    newarr.push(i)
                                    if (i === items[items.length - 1]) {
                                        setTimeout(() => {
                                            this.setTopArtista(newarr)
                                        }, 1000)
                                    }
                                })
                        }
                        this.loader = false
                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200) {
                                    this.fetchArtist3({event: event})
                                }
                            })
                        }
                    })
            },
            switchTabs(payload) {
                let event = payload.event
                let mobile = payload.mobile
                if (mobile) {
                    let allRecs = document.querySelectorAll(".rectrack")
                    for (let i of allRecs) {
                        i.style.display = 'none'
                    }
                }
                let target = event.target

                // Remove active class from all tab links
                const allTabLinks = document.querySelectorAll('.tab-item a')
                allTabLinks.forEach(link => {
                    link.classList.remove('active')
                })

                // Add active class to clicked tab
                if (target.tagName === 'A') {
                    target.classList.add('active')
                }
            },
            switchArtist(payload) {
                this.selectedArtistsRange = payload.num
            },
            switchTracks(payload) {
                this.selectedTracksRange = payload.num
            },
            fetchApi(payload) {
                let event = payload.event
                this.loader = true
                axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        this.setItems(response.data['items'])
                        this.loader = false

                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200) {
                                    this.fetchApi({event: event})
                                }
                            })
                        }
                    })
            },
            fetchApi2(payload) {
                let event = payload.event
                this.loader = true
                axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        this.setItemsM(response.data['items'])
                        this.loader = false
                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200) {
                                    this.fetchApi2({event: event})
                                }
                            })
                        }
                    })
            },
            fetchApi3(payload) {
                let event = payload.event
                this.loader = true
                axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        this.setItemsL(response.data['items'])
                        this.loader = false
                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200) {
                                    this.fetchApi3({event: event})
                                }
                            })
                        }
                    })
            },
            fetchAlbums(payload) {
                let offset = payload.offset,
                    event = payload.event
                this.loader = true
                axios.get('https://api.spotify.com/v1/me/albums?offset=' + offset + '&limit=20',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        let items = response.data['items']
                        // console.log(items)
                        this.setSavedAlbums(items)
                        this.loader = false
                        if (response.data['items'].length > 0) {
                            this.fetchAlbums({offset: offset += 20, event: event})
                        }
                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200) {
                                    this.fetchAlbums({offset: offset += 20, event: event})
                                }
                            })
                        }
                    })
            },
            fetchTracks(payload) {
                let offset = payload.offset
                this.loader = true
                axios.get('https://api.spotify.com/v1/me/tracks?offset=' + offset + '&limit=50',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        this.setSavedTracks(response.data['items'])
                        if (response.data['items'].length > 0) {
                            // this.fetchTracks',{offset:offset += 50})
                        }
                        this.loader = false
                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200) {
                                    this.fetchTracks({offset: offset += 20})
                                }
                            })
                        }
                    })
            },
            fetchNR(payload) {
                let offset = payload.offset
                this.loader = true
                axios.get('https://api.spotify.com/v1/browse/new-releases?limit=20&offset=' + offset,
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        let newarr = []
                        let items = response.data['albums']['items']
                        // console.log('235' + items[0].id)
                        for (let i = 0; i < items.length; i++) {
                            newarr.push(items[i].id)
                        }
                        if (offset < 100) {
                            this.getNewrelease({newarr: newarr, offset: offset})
                        }
                        this.loader = false
                    })
                    .catch(error => {
                        // console.log(error)
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200 && offset < 100) {
                                    this.fetchNR({offset: offset})
                                }
                            })
                        }
                    })

            },
            getNewrelease(payload) {
                let newarr = payload.newarr
                let offset = payload.offset
                axios.get('https://api.spotify.com/v1/albums?ids=' + newarr,
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        // console.log('452 ' + this.newreleases)
                        // let old = this.newreleases
                        // old.push(response.data['albums'])
                        // old.push(response.data['items'])
                        this.setNewReleases(response.data['albums'])
                        if (response.data['albums'].length > 0 && offset < 100) {
                            this.fetchNR({offset: offset += 20})
                        }
                    })
                    .catch(error => {
                        // console.log(error)
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200) {
                                    this.getNewrelease({newarr: newarr, offset: offset})
                                }
                            })
                        }
                    })
            },
            fetchFA() {
                this.loader = true
                axios.get('https://api.spotify.com/v1/me/following?type=artist&limit=50',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then(async (response) => {
                        let newarr = []
                        let items = response.data['artists']['items']
                        for await(let i of items) {
                            // console.log('237 ' + items[i].id)
                            axios.get('https://api.spotify.com/v1/artists/' + i.id + '/top-tracks?market=UA&limit=10',
                                {
                                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                            })
                                .then((response) => {
                                    let tracks = response.data['tracks']
                                    if (tracks[0]['preview_url']) {
                                        i.preview_url = tracks[0]['preview_url']
                                    }
                                    i.tracks = tracks
                                    newarr.push(i)
                                    if (i === items[items.length - 1]) {
                                        setTimeout(() => {
                                            this.setFollowedArtists(newarr)
                                        }, 1000)
                                    }
                                })
                        }
                        this.loader = false
                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200) {
                                    this.fetchFA()
                                }
                            })
                        }
                    })

            },
            fetchSpotPlaylists(payload) {
                let offset = payload.offset
                this.loader = true
                axios.get('https://api.spotify.com/v1/users/spotify/playlists?fields=items(name,id)&limit=50&offset=' + offset,
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        console.log(offset)
                        this.setSpotPlaylists(response.data['items'])
                        // if (response.data['items'].length > 0) {
                        //     offset += 50
                        //     this.fetchSpotPlaylists({offset})
                        // }
                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200) {
                                    this.fetchSpotPlaylists({offset: offset})
                                }
                            })
                        }
                    })
                this.loader = false
            },
            SpotInit: function (payload) {
                let event = payload.event
                // console.log('167'  + event.currentTarget.id)
                let id = event.currentTarget.id
                if (document.getElementById('s' + id)) {
                    document.getElementById('s' + id).style.display = 'block'
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('s'+ id)).offsetTop,
                    //     behavior:'smooth'});
                    // },10)
                    return
                }
                let exists = this.sptplaylists.find(dt => dt.id === id)
                if (!exists) {
                    axios.get('https://api.spotify.com/v1/playlists/' + id,
                    {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            // console.log(response.data)
                            let data = response.data
                            console.log(1155)
                            console.log(data)
                            this.setCurrentSPl(data)
                            this.setSptPlaylists(data)
                            //раскоментить
                            // axios.request({
                            //   url:'https://api.spotify.com/v1/playlists/'+ id + '/followers/contains?ids=' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                            //   {
                            //   headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                            // })
                            //     .then((response) =>{
                            //       data.followed = response.data[0]
                            //       this.sptplaylists.push(data)
                            //     })


                            // setTimeout(() => {
                            //   window.scrollTo({
                            //     top:(document.getElementById('s'+ id)).offsetTop,
                            //     behavior:'smooth'});
                            // },1000)
                        })
                        .catch(error => {
                            console.log(error)
                            if (error.response.status) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.SpotInit({event: event})
                                    }
                                })
                            }
                        })
                } else {
                    this.setCurrentSPl(exists)
                }
            },
            search(e) {
                // console.log(window.location.href)
                clearTimeout(this.searchtimer)
                this.searchtimer = setTimeout(() => {
                    let event = {}
                    let target = {}
                    target.id = 'sear'
                    event.target = target
                    this.switchTabs({event: event})


                    if (e.target.value) {
                        let value = e.target.value
                        // console.log(value)

                        axios.get('https://api.spotify.com/v1/search/?q=' + value + '&type=album,artist,playlist,track&limit=5',
                            {
                            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                        })
                            .then(async (response) => {
                                // console.log(response.data)
                                this.tracks = []
                                this.artists = []
                                this.albums = []
                                this.splaylists = []
                                let albums = response.data['albums']['items']
                                let artists = response.data['artists']['items']
                                let playlists = response.data['playlists']['items']
                                this.setTracks(response.data['tracks']['items'])

                                // console.log(albums)
                                // console.log(artists)
                                // console.log(playlists)
                                // console.log(response.data['tracks']['items'])
                                let albarr = []
                                for await (let i of albums) {
                                    // console.log('237' + albums[i].id)
                                    axios.get('https://api.spotify.com/v1/albums/' + i.id + '/tracks?market=UA&limit=10',
                                        {
                                        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                                    })
                                        .then((response) => {
                                            // console.log(response.data)
                                            let tracks = response.data['items']
                                            if (tracks[0]['preview_url']) {
                                                i.preview_url = tracks[0]['preview_url']
                                            }
                                            i.tracks = tracks
                                            albarr.push(i)
                                            // console.log(albarr)
                                            // console.log(albums)
                                        })
                                }
                                setTimeout(() => {
                                    this.setAlbums(albarr)
                                }, 2000)

                                let artarr = []
                                for await (let i of artists) {
                                    // console.log('237' + artists[i].id)
                                    axios.get('https://api.spotify.com/v1/artists/' + i.id + '/top-tracks?market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                                        {
                                        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                                    })
                                        .then((response) => {
                                            // console.log(response.data)
                                            let tracks = response.data['tracks']
                                            if (tracks[0]['preview_url']) {
                                                i.preview_url = tracks[0]['preview_url']
                                            }
                                            i.tracks = tracks
                                            artarr.push(i)
                                        })
                                }
                                setTimeout(() => {
                                    this.setArtists(artarr)
                                }, 2000)

                                // console.log(this.artists)
                                let playlist = []
                                for await (let i of playlists) {
                                    // console.log('237' + playlists[i].id)
                                    axios.get('https://api.spotify.com/v1/playlists/' + i.id,
                                        {
                                        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                                    })
                                        .then((response) => {
                                            // console.log(response.data['tracks'])
                                            let tracks = response.data['tracks']
                                            if (tracks['items'][0] && tracks['items'][0]['track']['preview_url']) {
                                                i.preview_url = tracks['items'][0]['track']['preview_url']
                                            }
                                            i.tracks = tracks
                                            playlist.push(i)

                                        })
                                }
                                setTimeout(() => {
                                    this.setSPlaylists(playlist)
                                }, 2000)
                                console.log(this.tracks)

                                // console.log(this.splaylists)

                            }).catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.search({e: e})
                                    }
                                })
                            }
                        })
                    }
                    // if (window.location.hash !=='#srch'){
                    //   window.location.hash = "srch"
                    // }
                }, 1000);
            },
            refreshplaylists(payload) {
                this.loader = true
                let rid = payload.rid
                let id = rid.replace('refresh_', '')
                axios.get('https://api.spotify.com/v1/playlists/' + id,
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        // console.log(response.data)
                        this.playinfo = []
                        this.setPlayInfo([])
                        this.setPlayInfo(response.data)
                        this.setPlaylists(response.data['tracks']['items'])
                        this.loader = false
                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200) {
                                    this.refreshplaylists({rid: rid})
                                }
                            })
                        }
                    })
            },
            reloader(payload) {
                this.loader = true
                let num = payload.num,
                    event = payload.event
                // console.log(id)
                // console.log(num)
                // console.log(event.target)
                // console.log(this.playlists)
                let parent = event.target.parentNode.parentNode.parentNode
                let target = event.target
                // console.log(target)
                target.className = 'refresh-start'
                if (num === 1) {
                    this.loader = true
                    let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                    document.querySelector('#yourplaylists > div.pl').insertAdjacentHTML("afterend", div)
                    // console.log(document.getElementById('loader'))
                    let nid = parent.id.replace('p', '')
                    // console.log(nid)
                    // let sea = this.playlists.find((playlists) => {return playlists.id === nid})
                    let sea = this.playlists.findIndex((playlists) => {
                        return playlists.id === nid
                    })
                    this.playlists.splice(sea, 1)
                    document.getElementById('p' + nid).remove()
                    // console.log(this.playlists)
                    let test = {}
                    let currentTarget = {}
                    currentTarget.id = nid
                    test.currentTarget = currentTarget
                    // console.log(test)
                    setTimeout(() => {
                        this.fetchInit({event: test})
                        document.getElementById("reloader").remove()
                    }, 1000)
                    // console.log(sea)
                } else if (num === 9) {
                    this.loader = true
                    let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                    document.querySelector('#sptplaylists > div.pl').insertAdjacentHTML("afterend", div)
                    let nid = parent.id.replace('s', '')
                    // console.log(nid)
                    let sea = this.sptplaylists.findIndex((sptplaylists) => {
                        return sptplaylists.id === nid
                    })
                    this.sptplaylists.splice(sea, 1)
                    let test = {}
                    let currentTarget = {}
                    currentTarget.id = nid
                    test.currentTarget = currentTarget
                    setTimeout(() => {
                        this.SpotInit({event: test})
                        document.getElementById("reloader").remove()
                    }, 1000)
                }
                setTimeout(() => {
                    target.className = 'refresh-end'
                }, 1000)
                this.loader = false
                // if (id.startsWith('art')){
                //   let cid = id.replace('art','')
                //   if (num===1){
                //     let deeper1 = this.deeper1
                //     deeper1.find(deeper1 => item => item.id === cid)
                //   } else if (num ===2){
                //     let deeper2 = this.deeper2
                //     deeper2.find(deeper2 => item => item.id === cid)
                //   }
                // }
                // if (num === 1){
                //   let indexing = this.deeper1.indexOf(data)
                //   if (indexing === -1){
                //     this.deeper1.push(data)
                //   }
                // } else if (num === 2){
                //   let indexing = this.deeper2.indexOf(data)
                //   if (indexing === -1){
                //     this.deeper2.push(data)
                //   }
                // } else if (num === 22){
                //   let indexing = this.deeper22.indexOf(data)
                //   if (indexing === -1){
                //     this.deeper22.push(data)
                //   }
                // } else if (num === 23){
                //   let indexing = this.deeper23.indexOf(data)
                //   if (indexing === -1){
                //     this.deeper23.push(data)
                //   }
                // } else if (num === 3){
                //   let indexing = this.deeper3.indexOf(data)
                //   if (indexing === -1){
                //     this.deeper3.push(data)
                //   }
                // } else if (num === 32){
                //   let indexing = this.deeper32.indexOf(data)
                //   if (indexing === -1){
                //     this.deeper32.push(data)
                //   }
                // } else if (num === 33){
                //   let indexing = this.deeper33.indexOf(data)
                //   if (indexing === -1){
                //     this.deeper33.push(data)
                //   }
                // } else if (num === 4){
                //   let indexing = this.deeper4.indexOf(data)
                //   if (indexing === -1){
                //     this.deeper4.push(data)
                //   }
                // } else if (num === 5){
                //   let indexing = this.deeper5.indexOf(data)
                //   if (indexing === -1){
                //     this.deeper5.push(data)
                //   }
                // } else if (num === 6){
                //   let indexing = this.deeper6.indexOf(data)
                //   if (indexing === -1){
                //     this.deeper6.push(data)
                //   }
                // } else if (num === 7){
                //   let indexing = this.deeper7.indexOf(data)
                //   if (indexing === -1){
                //     this.deeper7.push(data)
                //   }
                // } else if (num === 8){
                //   let indexing = this.deeper8.indexOf(data)
                //   if (indexing === -1){
                //     this.deeper8.push(data)
                //   }
                // }else if (num === 9){
                //   let indexing = this.deeper9.indexOf(data)
                //   if (indexing === -1){
                //     this.deeper9.push(data)
                //   }
                // } else if (num === 10){
                //   let indexing = this.deepers.indexOf(data)
                //   if (indexing === -1){
                //     this.deepers.push(data)
                //   }
                // }
            },
            reloadpl(payload) {
                let event = payload.event
                let target = event.target
                target.className = 'refresh-start'
                this.setListPlaylists([], true)
                this.setPlaylists([])
                let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                document.querySelector('#yourplaylists').insertAdjacentHTML("afterbegin", div)
                setTimeout(() => {
                    let ne = {}
                    ne.target = document.getElementById('playlistlist')
                    this.fetchPlaylists({event: ne, offset: 0})
                    document.getElementById("reloader").remove()
                    target.className = 'refresh-end'
                }, 1000)
            },
            reloadartists(payload) {
                let num = payload.num,
                    event = payload.event
                let target = event.target
                // console.log(target.previousSibling)
                target.className = 'refresh-start'
                if (num === 1) {
                    let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                    document.querySelector('#topartist').insertAdjacentHTML("afterbegin", div)
                    this.setTopArtist([])
                    setTimeout(() => {
                        let event = {}
                        event.target = document.querySelector('#topartists')
                        this.fetchArtist({event: event})
                        document.getElementById("reloader").remove()
                        target.className = 'refresh-end'
                    }, 1000)
                } else if (num === 2) {
                    this.setTopArtist6([])
                    let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                    document.querySelector('#topartist6').insertAdjacentHTML("afterbegin", div)
                    setTimeout(() => {
                        let event = {}
                        event.target = document.querySelector('#topartists6')
                        this.fetchArtist2({event: event})
                        document.getElementById("reloader").remove()
                        target.className = 'refresh-end'
                    }, 1000)
                } else if (num === 3) {
                    this.setTopArtista([])
                    let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                    document.querySelector('#topartista').insertAdjacentHTML("afterbegin", div)
                    setTimeout(() => {
                        let event = {}
                        event.target = document.querySelector('#topartistsall')
                        this.fetchArtist3(event)
                        document.getElementById("reloader").remove()
                        target.className = 'refresh-end'
                    }, 1000)
                } else if (num === 4) {
                    let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                    document.querySelector('#topartist').insertAdjacentHTML("afterbegin", div)
                    this.setFollowedArtists([])
                    this.followedartists = []
                    setTimeout(() => {
                        this.fetchFA()
                        document.getElementById("reloader").remove()
                        target.className = 'refresh-end'
                    }, 1000)

                }
                if (num === 1) {
                    document.getElementById('topartist').style.display = 'flex'
                    document.getElementById('topartists').className = 'activetab'
                    document.getElementById('topartist6').style.display = 'none'
                    document.getElementById('topartists6').className = ''
                    document.getElementById('topartista').style.display = 'none'
                    document.getElementById('topartistsall').className = ''
                    this.setTaactivetab(document.getElementById('topartist'))
                } else if (num === 2) {
                    document.getElementById('topartist').style.display = 'none'
                    document.getElementById('topartists').className = ''
                    document.getElementById('topartist6').style.display = 'flex'
                    document.getElementById('topartists6').className = 'activetab'
                    document.getElementById('topartista').style.display = 'none'
                    document.getElementById('topartistsall').className = ''
                    this.setTaactivetab(document.getElementById('topartist6'))
                } else if (num === 3) {
                    document.getElementById('topartist').style.display = 'none'
                    document.getElementById('topartists').className = ''
                    document.getElementById('topartist6').style.display = 'none'
                    document.getElementById('topartists6').className = ''
                    document.getElementById('topartista').style.display = 'flex'
                    document.getElementById('topartistsall').className = 'activetab'
                    this.setTaactivetab(document.getElementById('topartista'))
                }
            },
            reloadtracks(payload) {
                let num = payload.num,
                    event = payload.event
                let target = event.target
                // console.log(target.previousSibling)
                target.className = 'refresh-start'
                if (num === 1) {
                    let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                    document.querySelector('#toptrack').insertAdjacentHTML("afterbegin", div)
                    this.setItems([])
                    setTimeout(() => {
                        let event = {}
                        event.target = document.querySelector('#toptracks')
                        this.fetchApi(event)
                        document.getElementById("reloader").remove()
                        target.className = 'refresh-end'
                    }, 1000)
                } else if (num === 2) {
                    this.setItemsM([])
                    let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                    document.querySelector('#toptrack6').insertAdjacentHTML("afterbegin", div)
                    setTimeout(() => {
                        let event = {}
                        event.target = document.querySelector('#toptrackssix')
                        this.fetchApi2(event)
                        document.getElementById("reloader").remove()
                        target.className = 'refresh-end'
                    }, 1000)
                } else if (num === 3) {
                    this.setItemsL([])
                    let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                    document.querySelector('#toptrackall').insertAdjacentHTML("afterbegin", div)
                    setTimeout(() => {
                        let event = {}
                        event.target = document.querySelector('#toptracksall')
                        this.fetchApi3(event)
                        document.getElementById("reloader").remove()
                        target.className = 'refresh-end'
                    }, 1000)
                }
                if (num === 1) {
                    document.getElementById('toptrack').style.display = 'flex'
                    document.getElementById('toptracks').className = 'activetab'
                    document.getElementById('toptrack6').style.display = 'none'
                    document.getElementById('toptrackssix').className = ''
                    document.getElementById('toptrackall').style.display = 'none'
                    document.getElementById('toptracksall').className = ''
                    this.setTtactivetab(document.getElementById('toptrack'))
                } else if (num === 2) {
                    document.getElementById('toptrack').style.display = 'none'
                    document.getElementById('toptracks').className = ''
                    document.getElementById('toptrack6').style.display = 'flex'
                    document.getElementById('toptrackssix').className = 'activetab'
                    document.getElementById('toptrackall').style.display = 'none'
                    document.getElementById('toptracksall').className = ''
                    this.setTtactivetab(document.getElementById('toptrack6'))
                } else if (num === 3) {
                    document.getElementById('toptrack').style.display = 'none'
                    document.getElementById('toptracks').className = ''
                    document.getElementById('toptrack6').style.display = 'none'
                    document.getElementById('toptrackssix').className = ''
                    document.getElementById('toptrackall').style.display = 'flex'
                    document.getElementById('toptracksall').className = 'activetab'
                    this.setTtactivetab(document.getElementById('toptrackall'))
                }
            },
            reloadSA(payload) {
                let num = payload.num,
                    id = payload.id,
                    name = payload.name
                // let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                // document.querySelector('#' + id).insertAdjacentHTML("afterend",div)
                // let target = event.target
                // target.className = 'refresh-start'
                // setTimeout(() => {
                //   target.className = 'refresh-end'
                // },1000)
                if (num === 1) {
                    let sa = this.deeper1.findIndex((deeper1) => {
                        return deeper1.id === id
                    })
                    this.deeper1.splice(sa, 9e9)
                } else if (num === 2) {
                    let sa = this.deeper2.findIndex((deeper2) => {
                        return deeper2.id === id
                    })
                    this.deeper2.splice(sa, 9e9)
                } else if (num === 22) {
                    let sa = this.deeper22.findIndex((deeper22) => {
                        return deeper22.id === id
                    })
                    this.deeper22.splice(sa, 9e9)
                } else if (num === 23) {
                    let sa = this.deeper23.findIndex((deeper23) => {
                        return deeper23.id === id
                    })
                    this.deeper23.splice(sa, 9e9)
                } else if (num === 3) {
                    let sa = this.deeper3.findIndex((deeper3) => {
                        return deeper3.id === id
                    })
                    this.deeper3.splice(sa, 1)
                } else if (num === 32) {
                    let sa = this.deeper32.findIndex((deeper32) => {
                        return deeper32.id === id
                    })
                    this.deeper32.splice(sa, 9e9)
                } else if (num === 33) {
                    let sa = this.deeper33.findIndex((deeper33) => {
                        return deeper33.id === id
                    })
                    this.deeper33.splice(sa, 9e9)
                } else if (num === 4) {
                    let sa = this.deeper4.findIndex((deeper4) => {
                        return deeper4.id === id
                    })
                    this.deeper4.splice(sa, 9e9)
                } else if (num === 5) {
                    let sa = this.deeper5.findIndex((deeper5) => {
                        return deeper5.id === id
                    })
                    this.deeper5.splice(sa, 9e9)
                } else if (num === 6) {
                    let sa = this.deeper6.findIndex((deeper6) => {
                        return deeper6.id === id
                    })
                    this.deeper6.splice(sa, 9e9)
                } else if (num === 7) {
                    let sa = this.deeper7.findIndex((deeper7) => {
                        return deeper7.id === id
                    })
                    this.deeper7.splice(sa, 9e9)
                } else if (num === 8) {
                    let sa = this.deeper8.findIndex((deeper8) => {
                        return deeper8.id === id
                    })
                    this.deeper8.splice(sa, 9e9)
                } else if (num === 9) {
                    let sa = this.deeper9.findIndex((deeper9) => {
                        return deeper9.id === id
                    })
                    this.deeper9.splice(sa, 9e9)
                } else if (num === 10) {
                    let sa = this.deepers.findIndex((deepers) => {
                        return deepers.id === id
                    })
                    this.deepers.splice(sa, 9e9)
                }
                // console.log(id.replace('sa',''))
                axios.get('https://api.spotify.com/v1/recommendations?seed_artists=' + id.replace('sa', '') + '&limit=50&offset=0&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        let data = []
                        // console.log(response.data['tracks'])
                        data.tracks = response.data['tracks']
                        data.type = 'seed_artists'
                        data.id = id
                        data.name = name
                        // console.log(data)
                        if (num === 1) {
                            let indexing = this.deeper1.indexOf(data)
                            if (indexing === -1) {
                                // eslint-disable-next-line no-undef
                                this.setDeeper1(data)
                            }
                        } else if (num === 2) {
                            let indexing = this.deeper2.indexOf(data)
                            if (indexing === -1) {
                                // eslint-disable-next-line no-undef
                                this.setDeeper2(data)
                            }
                        } else if (num === 22) {
                            let indexing = this.deeper22.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper22(data)
                            }
                        } else if (num === 23) {
                            let indexing = this.deeper23.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper23(data)
                            }
                        } else if (num === 3) {
                            let indexing = this.deeper3.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper3(data)
                            }
                        } else if (num === 32) {
                            let indexing = this.deeper32.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper32(data)
                            }
                        } else if (num === 33) {
                            let indexing = this.deeper33.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper33(data)
                            }
                        } else if (num === 4) {
                            let indexing = this.deeper4.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper4(data)
                            }
                        } else if (num === 5) {
                            let indexing = this.deeper5.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper5(data)
                            }
                        } else if (num === 6) {
                            let indexing = this.deeper6.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper6(data)
                            }
                        } else if (num === 7) {
                            let indexing = this.deeper7.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper7(data)
                            }
                        } else if (num === 8) {
                            let indexing = this.deeper8.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper8(data)
                            }
                        } else if (num === 9) {
                            let indexing = this.deeper9.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper9(data)
                            }
                        } else if (num === 10) {
                            let indexing = this.deepers.indexOf(data)
                            if (indexing === -1) {
                                this.setDeepers(data)
                            }
                        }
                        setTimeout(() => {
                            window.scrollTo({
                                top: (document.getElementById(id)).offsetTop,
                                behavior: 'smooth'
                            });
                        }, 10);
                    })
                    .catch()
            },
            reloadST(payload) {
                let num = payload.num,
                    id = payload.id,
                    name = payload.name
                // let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                // document.querySelector('#' + id).insertAdjacentHTML("afterend",div)
                // let target = event.target
                // target.className = 'refresh-start'
                // setTimeout(() => {
                //   target.className = 'refresh-end'
                // },1000)
                if (num === 1) {
                    let st = this.deeper1.findIndex((deeper1) => {
                        return deeper1.id === id
                    })
                    this.deeper1.splice(st, 9e9)
                    // this.deeper1.splice(st, 1)
                } else if (num === 2) {
                    let st = this.deeper2.findIndex((deeper2) => {
                        return deeper2.id === id
                    })
                    this.deeper2.splice(st, 9e9)
                } else if (num === 22) {
                    let st = this.deeper22.findIndex((deeper22) => {
                        return deeper22.id === id
                    })
                    this.deeper22.splice(st, 9e9)
                } else if (num === 23) {
                    let st = this.deeper23.findIndex((deeper23) => {
                        return deeper23.id === id
                    })
                    this.deeper23.splice(st, 9e9)
                } else if (num === 3) {
                    let st = this.deeper3.findIndex((deeper3) => {
                        return deeper3.id === id
                    })
                    this.deeper3.splice(st, 9e9)
                } else if (num === 32) {
                    let st = this.deeper32.findIndex((deeper32) => {
                        return deeper32.id === id
                    })
                    this.deeper32.splice(st, 9e9)
                } else if (num === 33) {
                    let st = this.deeper33.findIndex((deeper33) => {
                        return deeper33.id === id
                    })
                    this.deeper33.splice(st, 9e9)
                } else if (num === 4) {
                    let st = this.deeper4.findIndex((deeper4) => {
                        return deeper4.id === id
                    })
                    this.deeper4.splice(st, 9e9)
                } else if (num === 5) {
                    let st = this.deeper5.findIndex((deeper5) => {
                        return deeper5.id === id
                    })
                    this.deeper5.splice(st, 9e9)
                } else if (num === 6) {
                    let st = this.deeper6.findIndex((deeper6) => {
                        return deeper6.id === id
                    })
                    this.deeper6.splice(st, 9e9)
                } else if (num === 7) {
                    let st = this.deeper7.findIndex((deeper7) => {
                        return deeper7.id === id
                    })
                    this.deeper7.splice(st, 9e9)
                } else if (num === 8) {
                    let st = this.deeper8.findIndex((deeper8) => {
                        return deeper8.id === id
                    })
                    this.deeper8.splice(st, 9e9)
                } else if (num === 9) {
                    let st = this.deeper9.findIndex((deeper9) => {
                        return deeper9.id === id
                    })
                    this.deeper9.splice(st, 9e9)
                } else if (num === 10) {
                    let st = this.deepers.findIndex((deepers) => {
                        return deepers.id === id
                    })
                    this.deepers.splice(st, 9e9)
                }
                // console.log(id.replace('st',''))
                axios.get('https://api.spotify.com/v1/recommendations?seed_tracks=' + id.replace('st', '') + '&limit=50&offset=0&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        let data = []
                        data.tracks = response.data['tracks']
                        data.type = 'seed_tracks'
                        data.id = id
                        data.name = name
                        // console.log(data)
                        if (num === 1) {
                            let indexing = this.deeper1.indexOf(data)
                            if (indexing === -1) {
                                // eslint-disable-next-line no-undef
                                this.setDeeper1(data)
                            }
                        } else if (num === 2) {
                            let indexing = this.deeper2.indexOf(data)
                            if (indexing === -1) {
                                // eslint-disable-next-line no-undef
                                this.setDeeper2(data)
                            }
                        } else if (num === 22) {
                            let indexing = this.deeper22.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper22(data)
                            }
                        } else if (num === 23) {
                            let indexing = this.deeper23.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper23(data)
                            }
                        } else if (num === 3) {
                            let indexing = this.deeper3.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper3(data)
                            }
                        } else if (num === 32) {
                            let indexing = this.deeper32.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper32(data)
                            }
                        } else if (num === 33) {
                            let indexing = this.deeper33.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper33(data)
                            }
                        } else if (num === 4) {
                            let indexing = this.deeper4.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper4(data)
                            }
                        } else if (num === 5) {
                            let indexing = this.deeper5.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper5(data)
                            }
                        } else if (num === 6) {
                            let indexing = this.deeper6.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper6(data)
                            }
                        } else if (num === 7) {
                            let indexing = this.deeper7.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper7(data)
                            }
                        } else if (num === 8) {
                            let indexing = this.deeper8.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper8(data)
                            }
                        } else if (num === 9) {
                            let indexing = this.deeper9.indexOf(data)
                            if (indexing === -1) {
                                this.setDeeper9(data)
                            }
                        } else if (num === 10) {
                            let indexing = this.deepers.indexOf(data)
                            if (indexing === -1) {
                                this.setDeepers(data)
                            }
                        }
                        setTimeout(() => {
                            window.scrollTo({
                                top: (document.getElementById(id)).offsetTop,
                                behavior: 'smooth'
                            });
                        }, 10);
                    })
                    .catch()
            },
            async seedTracks(payload) {
                let pointer,
                    item = payload.item,
                    num = payload.num,
                    sib = payload.sib,
                    child = payload.child
                if (num === 1) {
                    pointer = 'yourplaylists'
                } else if (num === 2) {
                    pointer = 'topartist'
                } else if (num === 22) {
                    pointer = 'topartist6'
                } else if (num === 23) {
                    pointer = 'topartista'
                } else if (num === 3) {
                    pointer = 'toptrack'
                } else if (num === 32) {
                    pointer = 'toptrack6'
                } else if (num === 33) {
                    pointer = 'toptrackall'
                } else if (num === 4) {
                    pointer = 'savedalbum'
                } else if (num === 5) {
                    pointer = 'savedtrack'
                } else if (num === 6) {
                    pointer = 'followedartist'
                } else if (num === 7) {
                    pointer = 'newrelease'
                } else if (num === 8) {
                    pointer = 'sptplaylists'
                } else if (num === 10) {
                    pointer = 'search'
                }
                // console.log(item)
                let alltop = document.querySelectorAll('#' + pointer + '> .rectrack > div.' + sib)
                // console.log(alltop)
                // console.log(sib)
                // console.log(child)
                if (child) {
                    let par = document.getElementById(child).nextElementSibling
                    // console.log(par)
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                } else if (sib !== false && alltop[alltop.length - 1].nextElementSibling !== null) {
                    let par = alltop[alltop.length - 1].nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                }
                if (document.getElementById('st' + item.id)) {
                    document.getElementById('st' + item.id).style.display = 'flex'
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('st'+ item.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                    return
                }
                let exists = this.seed_tracks_data.find(dt => dt.id === 'st' + item.id)

                let data = []
                if (exists) {
                    data = exists
                }
                if (!exists) {
                    await axios.get('https://api.spotify.com/v1/recommendations?seed_tracks=' + item['id'] + '&limit=50&offset=0&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {

                            // console.log(response.data['tracks'])
                            data.tracks = response.data['tracks']
                            data.type = 'seed_tracks'
                            data.id = 'st' + item.id
                            data.name = item.name
                            data.artists = item.artists
                            this.seed_tracks_data.push(data)
                            // console.log(data)


                        })
                        .catch()
                }
                if (num === 1) {
                    let indexing = this.deeper1.find(dt => dt.id === data.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper1(data)
                    }
                } else if (num === 2) {
                    let indexing = this.deeper2.find(dt => dt.id === data.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper2(data)
                    }
                } else if (num === 22) {
                    let indexing = this.deeper22.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper22(data)
                    }
                } else if (num === 23) {
                    let indexing = this.deeper23.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper23(data)
                    }
                } else if (num === 3) {
                    let indexing = this.deeper3.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper3(data)
                    }
                } else if (num === 32) {
                    let indexing = this.deeper32.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper32(data)
                    }
                } else if (num === 33) {
                    let indexing = this.deeper33.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper33(data)
                    }
                } else if (num === 4) {
                    let indexing = this.deeper4.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper4(data)
                    }
                } else if (num === 5) {
                    let indexing = this.deeper5.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper5(data)
                    }
                } else if (num === 6) {
                    let indexing = this.deeper6.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper6(data)
                    }
                } else if (num === 7) {
                    let indexing = this.deeper7.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper7(data)
                    }
                } else if (num === 8) {
                    let indexing = this.deeper8.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper8(data)
                    }
                } else if (num === 9) {
                    let indexing = this.deeper9.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper9(data)
                    }
                } else if (num === 10) {
                    let indexing = this.deepers.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeepers(data)
                    }
                }
                // setTimeout(() => {
                //     document.getElementById('st' + item.id).scrollIntoView({behavior: "smooth"})
                // }, 100);
            },
            async seedTracksM(payload) {
                let pointer,
                    item = payload.item,
                    num = payload.num,
                    sib = payload.sib,
                    child = payload.child,
                    parent = payload.parent
                if (num === 1) {
                    pointer = 'yourplaylists'
                } else if (num === 2) {
                    pointer = 'topartist'
                } else if (num === 22) {
                    pointer = 'topartist6'
                } else if (num === 23) {
                    pointer = 'topartista'
                } else if (num === 3) {
                    pointer = 'toptrack'
                } else if (num === 32) {
                    pointer = 'toptrack6'
                } else if (num === 33) {
                    pointer = 'toptrackall'
                } else if (num === 4) {
                    pointer = 'savedalbum'
                } else if (num === 5) {
                    pointer = 'savedtrack'
                } else if (num === 6) {
                    pointer = 'followedartist'
                } else if (num === 7) {
                    pointer = 'newrelease'
                } else if (num === 8) {
                    pointer = 'sptplaylists'
                } else if (num === 10) {
                    pointer = 'search'
                }
                // console.log(item)
                let alltop = document.querySelectorAll('#' + pointer + '> .rectrack > div.' + sib)
                // console.log(alltop)
                // console.log(sib)
                // console.log(child)
                if (child) {
                    let par = document.getElementById(child).nextElementSibling
                    // console.log(par)
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                } else if (sib !== false && alltop[alltop.length - 1].nextElementSibling !== null) {
                    let par = alltop[alltop.length - 1].nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                }
                if (document.getElementById('st' + item.id)) {
                    document.getElementById('st' + item.id).style.display = 'flex'
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('st'+ item.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                    return
                }
                let exists = this.seed_tracks_data.find(dt => dt.id === 'st' + item.id)

                let data = []
                if (exists) {
                    data = exists
                }
                if (!exists) {
                    await axios.get('https://api.spotify.com/v1/recommendations?seed_tracks=' + item['id'] + '&limit=50&offset=0&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {

                            // console.log(response.data['tracks'])
                            data.tracks = response.data['tracks']
                            data.type = 'seed_tracks'
                            data.id = 'st' + item.id
                            data.name = item.name
                            data.artists = item.artists
                            data.parentId = parent
                            this.seed_tracks_data.push(data)
                            // console.log(data)


                        })
                        .catch()
                }
                if (num === 1) {
                    let indexing = this.deeper1.find(dt => dt.id === data.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper1(data)
                    }
                } else if (num === 2) {
                    let indexing = this.deeper2.find(dt => dt.id === data.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper2(data)
                    }
                } else if (num === 22) {
                    let indexing = this.deeper22.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper22(data)
                    }
                } else if (num === 23) {
                    let indexing = this.deeper23.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper23(data)
                    }
                } else if (num === 3) {
                    let indexing = this.deeper3.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper3(data)
                    }
                } else if (num === 32) {
                    let indexing = this.deeper32.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper32(data)
                    }
                } else if (num === 33) {
                    let indexing = this.deeper33.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper33(data)
                    }
                } else if (num === 4) {
                    let indexing = this.deeper4.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper4(data)
                    }
                } else if (num === 5) {
                    let indexing = this.deeper5.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper5(data)
                    }
                } else if (num === 6) {
                    let indexing = this.deeper6.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper6(data)
                    }
                } else if (num === 7) {
                    let indexing = this.deeper7.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper7(data)
                    }
                } else if (num === 8) {
                    let indexing = this.deeper8.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper8(data)
                    }
                } else if (num === 9) {
                    let indexing = this.deeper9.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeeper9(data)
                    }
                } else if (num === 10) {
                    let indexing = this.deepers.find(dt => dt.id === data.id)
                    if (!indexing) {
                        this.setDeepers(data)
                    }
                }
                // setTimeout(() => {
                //     document.getElementById('st' + item.id).scrollIntoView({behavior: "smooth"})
                // }, 100);
            },
            deeperTracks(payload) {
                let item = payload.item,
                    num = payload.num,
                    flag = payload.flag,
                    sib = payload.sib,
                    child = payload.child,
                    pointer
                item.type = 'deepertracks'
                let exists = this.tracks_data.find(dt => dt.id === item.id)
                // console.log(item)
                // console.log(flag)
                // console.log(sib)
                if (num === 1) {
                    pointer = 'yourplaylists'
                } else if (num === 2) {
                    pointer = 'topartist'
                } else if (num === 22) {
                    pointer = 'topartist6'
                } else if (num === 23) {
                    pointer = 'topartista'
                } else if (num === 3) {
                    pointer = 'toptrack'
                } else if (num === 32) {
                    pointer = 'toptrack6'
                } else if (num === 33) {
                    pointer = 'toptrackall'
                } else if (num === 4) {
                    pointer = 'savedalbum'
                } else if (num === 5) {
                    pointer = 'savedtrack'
                } else if (num === 6) {
                    pointer = 'followedartist'
                } else if (num === 7) {
                    pointer = 'newrelease'
                } else if (num === 8) {
                    pointer = 'sptplaylists'
                } else if (num === 10) {
                    pointer = 'search'
                }
                if (exists) {
                    item = exists
                } else {
                    let clone = structuredClone(toRaw(item));
                    this.tracks_data.push(clone)
                }
                let all = document.querySelectorAll('#' + pointer + '> .rectrack > div')
                if (child) {
                    let par = document.getElementById(child).parentElement.nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                } else if (sib) {
                    let alltop = document.querySelectorAll('#' + pointer + '> .rectrack > div.' + sib)
                    let current = alltop[alltop.length - 1].nextElementSibling
                    while (current != null) {
                        // console.log(current)
                        current.style.display = 'none'
                        if (current.nextElementSibling !== null && current.nextElementSibling.style.display !== 'none') {
                            current = current.nextElementSibling
                        } else if (current.nextElementSibling !== null && current.nextElementSibling.style.display === 'none') {
                            current = current.nextElementSibling.nextElementSibling
                        } else if (current.nextElementSibling === null) {
                            current = null
                        }

                    }
                } else if (flag === true) {
                    if (all.length !== 0 && all.length !== 0) {
                        for (let i = 0; i < all.length; i++) {
                            all[i].style.display = 'none'
                        }
                    }
                }
                if (document.getElementById('d' + item.id)) {
                    document.getElementById('d' + item.id).style.display = 'flex'
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('d'+ item.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                    return
                }
                if (!exists) {
                    axios.get('https://api.spotify.com/v1/me/tracks/contains?ids=' + item.id, {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}})
                        .then((response) => {
                            item.followed = response.data[0]
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.deeperTracks(pointer, item, num, flag, sib, child)
                                    }
                                })
                            }
                        })
                }
                if (num === 1) {
                    let indexing = this.deeper1.find(dt => dt.id === item.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper1(item)
                    }
                } else if (num === 2) {
                    let indexing = this.deeper2.find(dt => dt.id === item.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper2(item)
                    }
                } else if (num === 22) {
                    let indexing = this.deeper22.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper22(item)
                    }
                } else if (num === 23) {
                    let indexing = this.deeper23.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper23(item)
                    }
                } else if (num === 3) {
                    console.log(num)
                    let indexing = this.deeper3.find(dt => dt.id === item.id)
                    if (!indexing) {
                        console.log(indexing)
                        console.log(item)
                        this.setDeeper3(item)
                    }
                } else if (num === 32) {
                    let indexing = this.deeper32.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper32(item)
                    }
                } else if (num === 33) {
                    let indexing = this.deeper33.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper33(item)
                    }
                } else if (num === 4) {
                    let indexing = this.deeper4.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper4(item)
                    }
                } else if (num === 5) {
                    let indexing = this.deeper5.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper5(item)
                    }
                } else if (num === 6) {
                    let indexing = this.deeper6.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper6(item)
                    }
                } else if (num === 7) {
                    let indexing = this.deeper7.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper7(item)
                    }
                } else if (num === 8) {
                    let indexing = this.deeper8.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper8(item)
                    }
                } else if (num === 9) {
                    let indexing = this.deeper9.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper9(item)
                    }
                } else if (num === 10) {
                    let indexing = this.deepers.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeepers(item)
                    }
                }

                // setTimeout(() => {
                //     const element = document.getElementById('d' + item.id);
                //     if (element) {
                //         element.scrollIntoView({behavior: "smooth"});
                //     }
                // }, 100);
            },
            deeperTracks2(payload) {
                let pointer,
                    item = payload.item,
                    d = payload.d,
                    num = payload.num,
                    // flag = payload.flag,
                    sib = payload.sib,
                    child = payload.child
                let exists = this.tracks_data.find(dt => dt.id === item.id)
                if (num === 1) {
                    pointer = 'yourplaylists'
                } else if (num === 2) {
                    pointer = 'topartist'
                } else if (num === 22) {
                    pointer = 'topartist6'
                } else if (num === 23) {
                    pointer = 'topartista'
                } else if (num === 3) {
                    pointer = 'toptrack'
                } else if (num === 32) {
                    pointer = 'toptrack6'
                } else if (num === 33) {
                    pointer = 'toptrackall'
                } else if (num === 4) {
                    pointer = 'savedalbum'
                } else if (num === 5) {
                    pointer = 'savedtrack'
                } else if (num === 6) {
                    pointer = 'followedartist'
                } else if (num === 7) {
                    pointer = 'newrelease'
                } else if (num === 8) {
                    pointer = 'sptplaylists'
                } else if (num === 10) {
                    pointer = 'search'
                }
                item.images = d.images
                item.type = 'deepertracks2'
                let all = document.querySelectorAll('#' + pointer + '> .rectrack > div')
                if (child) {
                    let par = document.getElementById(child).parentElement.nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                } else if (sib) {
                    let alltop = document.querySelectorAll('#' + pointer + '> .rectrack > div.' + sib)
                    // console.log(pointer)
                    // console.log(sib)
                    // console.log(alltop)
                    let current = alltop[alltop.length - 1].nextElementSibling
                    while (current != null) {
                        // console.log(current)
                        current.style.display = 'none'
                        if (current.nextElementSibling !== null && current.nextElementSibling.style.display !== 'none') {
                            current = current.nextElementSibling
                        } else if (current.nextElementSibling !== null && current.nextElementSibling.style.display === 'none') {
                            current = current.nextElementSibling.nextElementSibling
                        } else if (current.nextElementSibling === null) {
                            current = null
                        }

                    }
                }
                if (document.getElementById('d' + item.id)) {
                    document.getElementById('d' + item.id).style.display = 'flex'
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('d'+ item.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                    return
                }

                if (exists) {
                    item = exists
                } else {
                    let clone = structuredClone(toRaw(item));
                    this.tracks_data.push(clone)
                }

                if (num === 1) {
                    let indexing = this.deeper1.find(dt => dt.id === item.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper1(item)
                    }
                } else if (num === 2) {
                    let indexing = this.deeper2.find(dt => dt.id === item.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper2(item)
                    }
                } else if (num === 22) {
                    let indexing = this.deeper22.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper22(item)
                    }
                } else if (num === 23) {
                    let indexing = this.deeper23.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper23(item)
                    }
                } else if (num === 3) {
                    let indexing = this.deeper3.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper3(item)
                    }
                } else if (num === 32) {
                    let indexing = this.deeper32.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper32(item)
                    }
                } else if (num === 33) {
                    let indexing = this.deeper33.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper33(item)
                    }
                } else if (num === 4) {
                    let indexing = this.deeper4.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper4(item)
                    }
                } else if (num === 5) {
                    let indexing = this.deeper5.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper5(item)
                    }
                } else if (num === 6) {
                    let indexing = this.deeper6.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper6(item)
                    }
                } else if (num === 7) {
                    let indexing = this.deeper7.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper7(item)
                    }
                } else if (num === 8) {
                    let indexing = this.deeper8.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper8(item)
                    }
                } else if (num === 9) {
                    let indexing = this.deeper9.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper9(item)
                    }
                } else if (num === 10) {
                    let indexing = this.deepers.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeepers(item)
                    }
                }

                // setTimeout(() => {
                //     document.getElementById('d' + item.id).scrollIntoView({behavior: "smooth"})
                // }, 10);
            },
            deeperTracksM: async function (payload) {
                let pointer,
                    item = payload.item,
                    num = payload.num,
                    flag = payload.flag,
                    sib = payload.sib,
                    child = payload.child,
                    parent = payload.parent
                // console.log(item)
                let exists = this.tracks_data.find(dt => dt.id === item.id)
                item.type = 'deepertracks'
                item.parentId = parent
                // console.log(item)
                // console.log(flag)
                // console.log(sib)
                if (num === 1) {
                    pointer = 'yourplaylists'
                } else if (num === 2) {
                    pointer = 'topartist'
                } else if (num === 22) {
                    pointer = 'topartist6'
                } else if (num === 23) {
                    pointer = 'topartista'
                } else if (num === 3) {
                    pointer = 'toptrack'
                } else if (num === 32) {
                    pointer = 'toptrack6'
                } else if (num === 33) {
                    pointer = 'toptrackall'
                } else if (num === 4) {
                    pointer = 'savedalbum'
                } else if (num === 5) {
                    pointer = 'savedtrack'
                } else if (num === 6) {
                    pointer = 'followedartist'
                } else if (num === 7) {
                    pointer = 'newrelease'
                } else if (num === 8) {
                    pointer = 'sptplaylists'
                } else if (num === 10) {
                    pointer = 'search'
                }
                if (exists) {
                    item = exists
                } else {
                    let clone = structuredClone(toRaw(item));
                    this.tracks_data.push(clone)
                }
                let all = document.querySelectorAll('#' + pointer + '> .rectrack > div')
                if (child) {
                    let par = document.getElementById(child).parentElement.nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                } else if (sib) {
                    let alltop = document.querySelectorAll('#' + pointer + '> .rectrack > div.' + sib)
                    let current = alltop[alltop.length - 1].nextElementSibling
                    while (current != null) {
                        // console.log(current)
                        current.style.display = 'none'
                        if (current.nextElementSibling !== null && current.nextElementSibling.style.display !== 'none') {
                            current = current.nextElementSibling
                        } else if (current.nextElementSibling !== null && current.nextElementSibling.style.display === 'none') {
                            current = current.nextElementSibling.nextElementSibling
                        } else if (current.nextElementSibling === null) {
                            current = null
                        }

                    }
                } else if (flag === true) {
                    if (all.length !== 0 && all.length !== 0) {
                        for (let i = 0; i < all.length; i++) {
                            all[i].style.display = 'none'
                        }
                    }
                }
                if (document.getElementById('d' + item.id)) {
                    document.getElementById('d' + item.id).style.display = 'flex'
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('d'+ item.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                    return
                }
                if (!exists) {
                    axios.get('https://api.spotify.com/v1/me/tracks/contains?ids=' + item.id,
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            item.followed = response.data[0]
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.deeperTracksM(payload)
                                    }
                                })
                            }
                        })
                }
                if (num === 1) {
                    let indexing = this.deeper1.find(dt => dt.id === item.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper1(item)
                    }
                } else if (num === 2) {
                    let indexing = this.deeper2.find(dt => dt.id === item.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper2(item)
                    }
                } else if (num === 22) {
                    let indexing = this.deeper22.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper22(item)
                    }
                } else if (num === 23) {
                    let indexing = this.deeper23.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper23(item)
                    }
                } else if (num === 3) {
                    let indexing = this.deeper3.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper3(item)
                    }
                } else if (num === 32) {
                    let indexing = this.deeper32.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper32(item)
                    }
                } else if (num === 33) {
                    let indexing = this.deeper33.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper33(item)
                    }
                } else if (num === 4) {
                    let indexing = this.deeper4.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper4(item)
                    }
                } else if (num === 5) {
                    let indexing = this.deeper5.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper5(item)
                    }
                } else if (num === 6) {
                    let indexing = this.deeper6.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper6(item)
                    }
                } else if (num === 7) {
                    let indexing = this.deeper7.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper7(item)
                    }
                } else if (num === 8) {
                    let indexing = this.deeper8.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper8(item)
                    }
                } else if (num === 9) {
                    let indexing = this.deeper9.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper9(item)
                    }
                } else if (num === 10) {
                    let indexing = this.deepers.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeepers(item)
                    }
                }

                // setTimeout(() => {
                //     document.getElementById('d' + item.id).scrollIntoView({behavior: "smooth"})
                // }, 10);
            },
            deeperTracks2M(payload) {
                let pointer,
                    item = payload.item,
                    d = payload.d,
                    num = payload.num,
                    sib = payload.sib,
                    child = payload.child,
                    parent = payload.parent
                let exists = this.tracks_data.find(dt => dt.id === item.id)
                if (num === 1) {
                    pointer = 'yourplaylists'
                } else if (num === 2) {
                    pointer = 'topartist'
                } else if (num === 22) {
                    pointer = 'topartist6'
                } else if (num === 23) {
                    pointer = 'topartista'
                } else if (num === 3) {
                    pointer = 'toptrack'
                } else if (num === 32) {
                    pointer = 'toptrack6'
                } else if (num === 33) {
                    pointer = 'toptrackall'
                } else if (num === 4) {
                    pointer = 'savedalbum'
                } else if (num === 5) {
                    pointer = 'savedtrack'
                } else if (num === 6) {
                    pointer = 'followedartist'
                } else if (num === 7) {
                    pointer = 'newrelease'
                } else if (num === 8) {
                    pointer = 'sptplaylists'
                } else if (num === 10) {
                    pointer = 'search'
                }
                item.images = d.images
                item.type = 'deepertracks2'
                item.parentId = parent
                let all = document.querySelectorAll('#' + pointer + '> .rectrack > div')
                if (child) {
                    let par = document.getElementById(child).parentElement.nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                } else if (sib) {
                    let alltop = document.querySelectorAll('#' + pointer + '> .rectrack > div.' + sib)
                    // console.log(pointer)
                    console.log(sib)
                    console.log(alltop)
                    let current = alltop[alltop.length - 1].nextElementSibling
                    while (current != null) {
                        // console.log(current)
                        current.style.display = 'none'
                        if (current.nextElementSibling !== null && current.nextElementSibling.style.display !== 'none') {
                            current = current.nextElementSibling
                        } else if (current.nextElementSibling !== null && current.nextElementSibling.style.display === 'none') {
                            current = current.nextElementSibling.nextElementSibling
                        } else if (current.nextElementSibling === null) {
                            current = null
                        }
                    }


                }
                if (document.getElementById('d' + item.id)) {
                    document.getElementById('d' + item.id).style.display = 'flex'
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('d'+ item.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                    return
                }

                if (exists) {
                    item = exists
                } else {
                    let clone = structuredClone(toRaw(item));
                    this.tracks_data.push(clone)
                }

                if (num === 1) {
                    let indexing = this.deeper1.find(dt => dt.id === item.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper1(item)
                    }
                } else if (num === 2) {
                    let indexing = this.deeper2.find(dt => dt.id === item.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper2(item)
                    }
                } else if (num === 22) {
                    let indexing = this.deeper22.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper22(item)
                    }
                } else if (num === 23) {
                    let indexing = this.deeper23.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper23(item)
                    }
                } else if (num === 3) {
                    let indexing = this.deeper3.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper3(item)
                    }
                } else if (num === 32) {
                    let indexing = this.deeper32.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper32(item)
                    }
                } else if (num === 33) {
                    let indexing = this.deeper33.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper33(item)
                    }
                } else if (num === 4) {
                    let indexing = this.deeper4.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper4(item)
                    }
                } else if (num === 5) {
                    let indexing = this.deeper5.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper5(item)
                    }
                } else if (num === 6) {
                    let indexing = this.deeper6.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper6(item)
                    }
                } else if (num === 7) {
                    let indexing = this.deeper7.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper7(item)
                    }
                } else if (num === 8) {
                    let indexing = this.deeper8.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper8(item)
                    }
                } else if (num === 9) {
                    let indexing = this.deeper9.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper9(item)
                    }
                } else if (num === 10) {
                    let indexing = this.deepers.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeepers(item)
                    }
                }

                // setTimeout(() => {
                //     document.getElementById('d' + item.id).scrollIntoView({behavior: "smooth"})
                // }, 10);
            },
            async seedArtist(payload) {
                let pointer,
                    item = payload.item,
                    num = payload.num,
                    sib = payload.sib,
                    child = payload.child
                if (num === 1) {
                    pointer = 'yourplaylists'
                } else if (num === 2) {
                    pointer = 'topartist'
                } else if (num === 22) {
                    pointer = 'topartist6'
                } else if (num === 23) {
                    pointer = 'topartista'
                } else if (num === 3) {
                    pointer = 'toptrack'
                } else if (num === 32) {
                    pointer = 'toptrack6'
                } else if (num === 33) {
                    pointer = 'toptrackall'
                } else if (num === 4) {
                    pointer = 'savedalbum'
                } else if (num === 5) {
                    pointer = 'savedtrack'
                } else if (num === 6) {
                    pointer = 'followedartist'
                } else if (num === 7) {
                    pointer = 'newrelease'
                } else if (num === 8) {
                    pointer = 'sptplaylists'
                } else if (num === 10) {
                    pointer = 'search'
                }
                let alltop = document.querySelectorAll('#' + pointer + '> .rectrack > div.' + sib)
                // console.log(child)
                if (child) {
                    let par = document.getElementById(child).parentElement.nextElementSibling
                    // console.log(par)
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                } else if (sib !== false && alltop[alltop.length - 1] && alltop[alltop.length - 1].nextElementSibling !== null) {
                    let par = alltop[alltop.length - 1].nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                }
                if (document.getElementById('sa' + item.id)) {
                    document.getElementById('sa' + item.id).style.display = 'flex'
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('sa'+ item.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                    return
                }
                let exists = this.seed_artists_data.find(dt => dt.id === 'sa' + item.id)

                let data = []
                if (exists) {
                    data = exists
                }
                if (!exists) {
                    await axios.get('https://api.spotify.com/v1/recommendations?seed_artists=' + item['id'] + '&limit=50&offset=0&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            data.tracks = response.data['tracks']
                            data.type = 'seed_artists'
                            data.id = 'sa' + item.id
                            data.name = item.name
                            this.seed_artists_data.push(data)
                            // console.log(data)

                            // setTimeout(() => {
                            //   window.scrollTo({
                            //     top:(document.getElementById('sa'+ item.id)).offsetTop,
                            //     behavior:'smooth'});
                            // }, 10);
                        })
                        .catch()
                }
                if (num === 1) {
                    let indexing = this.deeper1.indexOf(data)
                    if (indexing === -1) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper1(data)
                    }
                } else if (num === 2) {
                    let indexing = this.deeper2.indexOf(data)
                    if (indexing === -1) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper2(data)
                    }
                } else if (num === 22) {
                    let indexing = this.deeper22.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper22(data)
                    }
                } else if (num === 23) {
                    let indexing = this.deeper23.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper23(data)
                    }
                } else if (num === 3) {
                    let indexing = this.deeper3.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper3(data)
                    }
                } else if (num === 32) {
                    let indexing = this.deeper32.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper32(data)
                    }
                } else if (num === 33) {
                    let indexing = this.deeper33.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper33(data)
                    }
                } else if (num === 4) {
                    let indexing = this.deeper4.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper4(data)
                    }
                } else if (num === 5) {
                    let indexing = this.deeper5.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper5(data)
                    }
                } else if (num === 6) {
                    let indexing = this.deeper6.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper6(data)
                    }
                } else if (num === 7) {
                    let indexing = this.deeper7.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper7(data)
                    }
                } else if (num === 8) {
                    let indexing = this.deeper8.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper8(data)
                    }
                } else if (num === 9) {
                    let indexing = this.deeper9.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper9(data)
                    }
                } else if (num === 10) {
                    let indexing = this.deepers.indexOf(data)
                    if (indexing === -1) {
                        this.setDeepers(data)
                    }
                }
                // setTimeout(() => {
                //     document.getElementById('sa' + item.id).scrollIntoView({behavior: "smooth"})
                // }, 100);
            },
            async seedArtistM(payload) {
                let pointer,
                    item = payload.item,
                    num = payload.num,
                    sib = payload.sib,
                    child = payload.child,
                    parent = payload.parent
                if (num === 1) {
                    pointer = 'yourplaylists'
                } else if (num === 2) {
                    pointer = 'topartist'
                } else if (num === 22) {
                    pointer = 'topartist6'
                } else if (num === 23) {
                    pointer = 'topartista'
                } else if (num === 3) {
                    pointer = 'toptrack'
                } else if (num === 32) {
                    pointer = 'toptrack6'
                } else if (num === 33) {
                    pointer = 'toptrackall'
                } else if (num === 4) {
                    pointer = 'savedalbum'
                } else if (num === 5) {
                    pointer = 'savedtrack'
                } else if (num === 6) {
                    pointer = 'followedartist'
                } else if (num === 7) {
                    pointer = 'newrelease'
                } else if (num === 8) {
                    pointer = 'sptplaylists'
                } else if (num === 10) {
                    pointer = 'search'
                }
                let alltop = document.querySelectorAll('#' + pointer + '> .rectrack > div.' + sib)
                // console.log(child)
                if (child) {
                    let par = document.getElementById(child).parentElement.nextElementSibling
                    // console.log(par)
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                } else if (sib !== false && alltop[alltop.length - 1].nextElementSibling !== null) {
                    let par = alltop[alltop.length - 1].nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                }
                if (document.getElementById('sa' + item.id)) {
                    document.getElementById('sa' + item.id).style.display = 'flex'
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('sa'+ item.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                    return
                }
                let exists = this.seed_artists_data.find(dt => dt.id === 'sa' + item.id)

                let data = []
                if (exists) {
                    data = exists
                    data.parentId = parent
                }
                if (!exists) {
                    await axios.get('https://api.spotify.com/v1/recommendations?seed_artists=' + item['id'] + '&limit=50&offset=0&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            data.tracks = response.data['tracks']
                            data.type = 'seed_artists'
                            data.id = 'sa' + item.id
                            data.name = item.name
                            data.parentId = parent
                            this.seed_artists_data.push(data)
                        })
                        .catch()
                }
                if (num === 1) {
                    let indexing = this.deeper1.indexOf(data)
                    if (indexing === -1) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper1(data)
                    }
                } else if (num === 2) {
                    let indexing = this.deeper2.indexOf(data)
                    if (indexing === -1) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper2(data)
                    }
                } else if (num === 22) {
                    let indexing = this.deeper22.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper22(data)
                    }
                } else if (num === 23) {
                    let indexing = this.deeper23.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper23(data)
                    }
                } else if (num === 3) {
                    let indexing = this.deeper3.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper3(data)
                    }
                } else if (num === 32) {
                    let indexing = this.deeper32.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper32(data)
                    }
                } else if (num === 33) {
                    let indexing = this.deeper33.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper33(data)
                    }
                } else if (num === 4) {
                    let indexing = this.deeper4.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper4(data)
                    }
                } else if (num === 5) {
                    let indexing = this.deeper5.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper5(data)
                    }
                } else if (num === 6) {
                    let indexing = this.deeper6.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper6(data)
                    }
                } else if (num === 7) {
                    let indexing = this.deeper7.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper7(data)
                    }
                } else if (num === 8) {
                    let indexing = this.deeper8.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper8(data)
                    }
                } else if (num === 9) {
                    let indexing = this.deeper9.indexOf(data)
                    if (indexing === -1) {
                        this.setDeeper9(data)
                    }
                } else if (num === 10) {
                    let indexing = this.deepers.indexOf(data)
                    if (indexing === -1) {
                        this.setDeepers(data)
                    }
                }
                // setTimeout(() => {
                //     document.getElementById('sa' + item.id).scrollIntoView({behavior: "smooth"})
                // }, 100);
            },
            prepare: async function (payload) {
                let num = payload.num

                if (num === 1) {
                    console.log(4225)
                    this.deeper1 = []
                } else if (num === 2 || num === 22 || num === 23) {
                    this.deeper2 = []
                    this.deeper22 = []
                    this.deeper23 = []
                } else if (num === 3 || num === 32 || num === 33) {
                    this.deeper3 = []
                    this.deeper32 = []
                    this.deeper33 = []
                } else if (num === 4) {
                    this.deeper4 = []
                } else if (num === 5) {
                    this.deeper5 = []
                } else if (num === 6) {
                    this.deeper6 = []
                } else if (num === 7) {
                    this.deeper7 = []
                } else if (num === 8) {
                    this.deeper8 = []
                } else if (num === 9) {
                    this.deeper9 = []
                } else if (num === 10) {
                    this.deepers = []
                }
            },
            deeperartist: async function (payload) {
                console.log(4102)
                let pointer,
                    item = payload.item,
                    track = payload.track,
                    num = payload.num,
                    flag = payload.flag,
                    sib = payload.sib,
                    related = payload.related
                if (num === 1) {
                    pointer = 'yourplaylists'
                } else if (num === 2) {
                    pointer = 'topartist'
                } else if (num === 22) {
                    pointer = 'topartist6'
                } else if (num === 23) {
                    pointer = 'topartista'
                } else if (num === 3) {
                    pointer = 'toptrack'
                } else if (num === 32) {
                    pointer = 'toptrack6'
                } else if (num === 33) {
                    pointer = 'toptrackall'
                } else if (num === 4) {
                    pointer = 'savedalbum'
                } else if (num === 5) {
                    pointer = 'savedtrack'
                } else if (num === 6) {
                    pointer = 'followedartist'
                } else if (num === 7) {
                    pointer = 'newrelease'
                } else if (num === 8) {
                    pointer = 'sptplaylists'
                } else if (num === 10) {
                    pointer = 'search'
                }
                let trackartist = []
                trackartist.type = 'trackartist'

                let all = document.querySelectorAll('#' + pointer + '> .rectrack > div')
                let alltop = document.querySelectorAll('#' + pointer + '> .rectrack > div.' + sib)
                let last = document.querySelector('#' + pointer + '> .rectrack > div.trackartist > div[id="art' + item.id + '"]')
                // console.log(last)
                // console.log(item.id)
                if (flag === true) {
                    // console.log(item.id)
                    if (all.length !== 0 && all.length !== 0) {
                        for (let i = 0; i < all.length; i++) {
                            // console.log(all[i])
                            if (last !== null && all[i].firstChild.id === last.id && last.id === item.id) {
                                last.parentElement.style.display = 'block'
                            } else {
                                // console.log(all[i])
                                all[i].style.display = 'none'
                            }
                        }
                    }
                } else if (alltop.length !== 0 && alltop[alltop.length - 1].nextElementSibling !== null) {
                    let par = alltop[alltop.length - 1].nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                } else if (related) {
                    let par = document.getElementById(related).parentElement.nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                }

                let exists = this.artists_data.find(dt => dt.id === item.id)
                if (exists) {
                    console.log(4203)
                    trackartist = exists
                } else {
                    await this.deeperArtistself({
                        item: item,
                        track: track
                    }).then(result => trackartist.push(result))
                    await this.deeperArtisttt({item: item}).then(tt => trackartist.push(tt))
                    await this.deeperArtistAlbums({item: item}).then(album => trackartist.push(album))
                    await this.deeperArtistSingle({item: item}).then(single => trackartist.push(single))
                    await this.deeperArtistAppear({item: item}).then(appear => trackartist.push(appear))
                    await this.deeperArtistRelated({item: item}).then(related => trackartist.push(related))
                    await new Promise(r => setTimeout(r, 2000));
                    console.log(trackartist)
                    let clone = structuredClone(trackartist);
                    clone.id = item.id
                    this.artists_data.push(clone)
                }
                if (num === 1) {
                    console.log(4225)
                    this.setDeeper1(trackartist)
                } else if (num === 2) {
                    this.setDeeper2(trackartist)
                } else if (num === 22) {
                    this.setDeeper22(trackartist)
                } else if (num === 23) {
                    this.setDeeper23(trackartist)
                } else if (num === 3) {
                    console.log(trackartist)
                    this.setDeeper3(trackartist)
                } else if (num === 32) {
                    this.setDeeper32(trackartist)
                } else if (num === 33) {
                    this.setDeeper33(trackartist)
                } else if (num === 4) {
                    this.setDeeper4(trackartist)
                } else if (num === 5) {
                    this.setDeeper5(trackartist)
                } else if (num === 6) {
                    this.setDeeper6(trackartist)
                } else if (num === 7) {
                    this.setDeeper7(trackartist)
                } else if (num === 8) {
                    this.setDeeper8(trackartist)
                } else if (num === 9) {
                    this.setDeeper9(trackartist)
                } else if (num === 10) {
                    this.setDeepers(trackartist)
                }
                // setTimeout(() => {
                //     const element = document.getElementById('art' + item.id);
                //     if (element) {
                //         element.scrollIntoView({behavior: "smooth"});
                //     }
                // }, 100);
                console.log(trackartist)
            },
            deeperartistmob: async function (payload) {
                let pointer,
                    item = payload.item,
                    track = payload.track,
                    num = payload.num,
                    flag = payload.flag,
                    sib = payload.sib,
                    related = payload.related,
                    parent = payload.parent
                console.log(parent)
                if (num === 1) {
                    pointer = 'yourplaylists'
                } else if (num === 2) {
                    pointer = 'topartist'
                } else if (num === 22) {
                    pointer = 'topartist6'
                } else if (num === 23) {
                    pointer = 'topartista'
                } else if (num === 3) {
                    pointer = 'toptrack'
                } else if (num === 32) {
                    pointer = 'toptrack6'
                } else if (num === 33) {
                    pointer = 'toptrackall'
                } else if (num === 4) {
                    pointer = 'savedalbum'
                } else if (num === 5) {
                    pointer = 'savedtrack'
                } else if (num === 6) {
                    pointer = 'followedartist'
                } else if (num === 7) {
                    pointer = 'newrelease'
                } else if (num === 8) {
                    pointer = 'sptplaylists'
                } else if (num === 10) {
                    pointer = 'search'
                }
                let trackartist = []
                trackartist.type = 'trackartist'
                trackartist.parentId = parent
                let all = document.querySelectorAll('#' + pointer + '> .rectrack > div')
                let alltop = document.querySelectorAll('#' + pointer + '> .rectrack > div.' + sib)
                let last = document.querySelector('#' + pointer + '> .rectrack > div.trackartist > div[id="art' + item.id + '"]')
                // console.log(last)
                // console.log(item.id)
                if (flag === true) {
                    // console.log(item.id)
                    if (all.length !== 0 && all.length !== 0) {
                        for (let i = 0; i < all.length; i++) {
                            // console.log(all[i])
                            if (last !== null && all[i].firstChild.id === last.id && last.id === item.id) {
                                last.parentElement.style.display = 'block'
                            } else {
                                // console.log(all[i])
                                all[i].style.display = 'none'
                            }
                        }
                    }
                } else if (alltop.length !== 0 && alltop[alltop.length - 1].nextElementSibling !== null) {
                    let par = alltop[alltop.length - 1].nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                } else if (related) {
                    let par = document.getElementById(related).parentElement.nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                }

                if (document.getElementById('art' + item.id)) {
                    document.getElementById('art' + item.id).parentElement.style.display = 'flex'
                    return
                }

                let exists = this.artists_data.find(dt => dt.id === item.id)
                if (exists) {
                    console.log(4203)
                    trackartist = exists
                    trackartist.parentId = parent
                } else {
                    await this.deeperArtistself({
                        item: item,
                        track: track
                    }).then(result => trackartist.push(result))
                    await this.deeperArtisttt({item: item}).then(tt => trackartist.push(tt))
                    await this.deeperArtistAlbums({item: item}).then(album => trackartist.push(album))
                    await this.deeperArtistSingle({item: item}).then(single => trackartist.push(single))
                    await this.deeperArtistAppear({item: item}).then(appear => trackartist.push(appear))
                    await this.deeperArtistRelated({item: item}).then(related => trackartist.push(related))
                    await new Promise(r => setTimeout(r, 2000));
                    console.log(trackartist)
                    let clone = structuredClone(trackartist);
                    clone.id = item.id
                    this.artists_data.push(clone)
                }
                if (num === 1) {
                    console.log(4225)
                    this.setDeeper1(trackartist)
                } else if (num === 2) {
                    this.setDeeper2(trackartist)
                } else if (num === 22) {
                    this.setDeeper22(trackartist)
                } else if (num === 23) {
                    this.setDeeper23(trackartist)
                } else if (num === 3) {
                    this.setDeeper3(trackartist)
                } else if (num === 32) {
                    this.setDeeper32(trackartist)
                } else if (num === 33) {
                    this.setDeeper33(trackartist)
                } else if (num === 4) {
                    this.setDeeper4(trackartist)
                } else if (num === 5) {
                    this.setDeeper5(trackartist)
                } else if (num === 6) {
                    this.setDeeper6(trackartist)
                } else if (num === 7) {
                    this.setDeeper7(trackartist)
                } else if (num === 8) {
                    this.setDeeper8(trackartist)
                } else if (num === 9) {
                    this.setDeeper9(trackartist)
                } else if (num === 10) {
                    this.setDeepers(trackartist)
                }
                // setTimeout(() => {
                //     const element = document.getElementById('art' + item.id);
                //     if (element) {
                //         element.scrollIntoView({behavior: "smooth"});
                //     }
                // }, 100);
                console.log(trackartist)
            },
            deeperArtistself(payload) {
                let item = payload.item,
                    track = payload.track
                return axios.get('https://api.spotify.com/v1/artists/' + item.id,
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        let trackartist = []
                        trackartist = response.data
                        trackartist.type = 'artist'
                        axios.get('https://api.spotify.com/v1/me/following/contains?type=artist&ids=' + item.id,
                            {
                            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                        })
                            .then((response) => {
                                trackartist.followed = response.data[0]
                            })
                            .catch(error => {
                                if (error.response.status === 401) {
                                    axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                        // console.log(response.data)
                                        if (response.status === 200) {
                                            this.deeperArtistself({item: item, track: track})
                                        }
                                    })
                                }
                            })
                        if (track != null && track[0] != null && track[0].preview_url) {
                            trackartist.preview_url = track[0].preview_url
                        } else if (track != null && track.preview_url) {
                            trackartist.preview_url = track.preview_url
                        }
                        if (trackartist.images.length !== 0 && trackartist.images[0] !== undefined && trackartist.images[0].url !== null) {
                            return trackartist
                        } else {
                            trackartist.images[0] = 'url("")'
                            return trackartist
                        }
                        // } else if (item.preview_url){
                        //   trackartist.preview_url = item.preview_url
                        // }

                    })
                    .catch(error => {
                        console.log(error)
                        // console.log(error.response.data)
                        if (error.response.status === 401) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
                        }
                    })
            },
            deeperArtisttt(payload) {
                let item = payload.item
                // top tracks
                return axios.get('https://api.spotify.com/v1/artists/' + item.id + '/top-tracks?limit=10&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        let tt = []
                        tt = response.data
                        tt.type = 'top_tracks'
                        //console.log(tt)
                        return tt
                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
                        }
                    })
            },
            deeperArtistAlbums(payload) {
                let item = payload.item
                // album
                return axios.get('https://api.spotify.com/v1/artists/' + item.id + '/albums?include_groups=album&limit=10',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        let newarr = []
                        let arr = response.data['items']
                        // console.log(arr)
                        // this.deeper1.push(data)
                        for (let i = 0; i < arr.length; i++) {
                            // console.log('237 ' + arr.items[i].id)
                            axios.get('https://api.spotify.com/v1/albums/' + arr[i].id + '/tracks',
                                {
                                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                            })
                                .then((response) => {
                                    let tracks = response.data['items']
                                    // console.log(333)
                                    // console.log(response.data)
                                    arr[i].tracks = tracks
                                    if (tracks[0]['preview_url']) {
                                        arr[i].preview_url = tracks[0]['preview_url']
                                    }
                                    if (arr[i].images.length !== 0 && arr[i].images !== null && arr[i].images[0] !== undefined && arr[i].images[0].url !== null) {
                                        newarr.push(arr[i])
                                    } else {
                                        arr[i].images[0] = 'url("")'
                                        newarr.push(arr[i])
                                    }

                                })
                        }
                        newarr.type = 'albums'
                        // console.log(newarr)
                        return newarr

                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
                        }
                    })
            },
            deeperArtistSingle(payload) {
                let item = payload.item
                // single,compilation
                return axios.get('https://api.spotify.com/v1/artists/' + item.id + '/albums?include_groups=single,compilation',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        let single = []
                        let arr = response.data['items']
                        // this.deeper1.push(data)
                        for (let i = 0; i < arr.length; i++) {
                            // console.log('237 ' + arr.items[i].id)
                            axios.get('https://api.spotify.com/v1/albums/' + arr[i].id + '/tracks',
                                {
                                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                            })
                                .then((response) => {
                                    let tracks = response.data['items']
                                    // console.log(333)
                                    // console.log(response.data)
                                    arr[i].tracks = tracks
                                    if (tracks[0]['preview_url']) {
                                        arr[i].preview_url = tracks[0]['preview_url']
                                    }
                                    if (arr[i].images.length !== 0 && arr[i].images !== null && arr[i].images[0] !== undefined && arr[i].images[0].url !== null) {
                                        single.push(arr[i])
                                    } else {
                                        arr[i].images[0] = 'url("")'
                                        single.push(arr[i])
                                    }

                                })
                        }
                        single.type = 'single'
                        return single
                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
                        }
                    })
            },
            deeperArtistAppear(payload) {
                let item = payload.item
                // appears_on
                return axios.get('https://api.spotify.com/v1/artists/' + item.id + '/albums?include_groups=appears_on',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        let appears = []
                        let arr = response.data['items']
                        // console.log(arr)
                        // this.deeper1.push(data)
                        for (let i = 0; i < arr.length; i++) {
                            // console.log('237 ' + arr.items[i].id)
                            axios.get('https://api.spotify.com/v1/albums/' + arr[i].id + '/tracks',
                                {
                                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                            })
                                .then((response) => {
                                    let tracks = response.data['items']
                                    arr[i].tracks = tracks
                                    // console.log(333)
                                    // console.log(response.data)
                                    if (tracks[0]['preview_url']) {
                                        arr[i].preview_url = tracks[0]['preview_url']
                                    }
                                    // console.log(response.data['items'])
                                    // console.log(response.data['items'].length)
                                    // console.log(arr[i])
                                    if (arr[i].images.length !== 0 && arr[i].images !== null && arr[i].images[0] !== undefined && arr[i].images[0].url !== null) {
                                        // console.log(arr[i].images[0])
                                        appears.push(arr[i])
                                    } else {
                                        arr[i].images[0] = 'url("")'
                                        appears.push(arr[i])
                                    }

                                })
                        }
                        appears.type = 'appears_on'
                        return appears

                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
                        }
                    })
            },
            deeperArtistRelated(payload) {
                let item = payload.item
                // related-artists
                return axios.get('https://api.spotify.com/v1/artists/' + item.id + '/related-artists',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        let relatedartist = []
                        let fin = []
                        let arr = response.data['artists']
                        // console.log(444)
                        // console.log(arr)
                        // this.deeper1.push(data)
                        for (let i = 0; i < arr.length; i++) {
                            // console.log('447 ' + arr.items[i].id)
                            axios.get('https://api.spotify.com/v1/artists/' + arr[i].id + '/top-tracks?market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                                {
                                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                            })
                                .then((response) => {
                                    // console.log(response.data['tracks'])
                                    // console.log(response.data['tracks'].length)
                                    // console.log(arr[i])
                                    let tracks = response.data['tracks']
                                    if (tracks.length !== 0 && tracks[0]['preview_url']) {
                                        arr[i].preview_url = tracks[0]['preview_url']
                                    }
                                    if (arr[i].images.length !== 0 && arr[i].images !== null && arr[i].images[0] !== undefined && arr[i].images[0].url !== null) {
                                        relatedartist.push(arr[i])
                                    } else {
                                        arr[i].images[0] = 'url("")'
                                        relatedartist.push(arr[i])
                                    }

                                })
                            // if (i===11){
                            //   break
                            // }
                        }
                        fin = relatedartist
                        fin.type = 'related-artists'
                        // console.log(3451)
                        // console.log(fin)
                        return fin
                    })
                    .catch(error => {
                        if (error.response.status) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
                        }
                    })
            },

            deeperAlbum: async function (payload) {
                let item = payload.item,
                    num = payload.num,
                    child = payload.child,
                    search = payload.search
                if (item.album) {
                    item = item.album
                    item.album = true
                }
                item.type = 'deeperalbum'

                let exists = false
                if (item.album) {
                    exists = await this.albums_data.find(dt => dt.id === item.album.id)
                } else {
                    exists = await this.albums_data.find(dt => dt.id === item.id)
                }

                if (exists) {
                    item = exists
                } else {
                    let clone = structuredClone(toRaw(item));
                    this.albums_data.push(clone)
                }
                console.log(exists)
                console.log(child)
                if (child) {
                    let par = document.getElementById(child).parentElement.nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                } else {
                    let albs = document.querySelectorAll(".rectrack > div")
                    console.log(albs)
                    for (let i of albs) {
                        if (i.id === 'alb' + item.id) {
                            i.style.display = 'flex'
                        } else {
                            i.style.display = 'none'
                        }
                    }
                }

                if (document.getElementById('alb' + item.id)) {
                    document.getElementById('alb' + item.id).style.display = 'flex'
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('sa'+ item.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                    return
                }

                // console.log(item.id)
                if (!exists) {
                    axios.get('https://api.spotify.com/v1/me/albums/contains?ids=' + item.id,
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            item.followed = response.data[0]

                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.deeperAlbum(payload)
                                    }
                                })
                            }
                        })
                }


                if (num === 1) {
                    let indexing = this.deeper1.find(dt => dt.id === item.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper1(item)
                    }
                } else if (num === 2) {
                    let indexing = this.deeper2.find(dt => dt.id === item.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper2(item)
                    }
                } else if (num === 22) {
                    let indexing = this.deeper22.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper22(item)
                    }
                } else if (num === 23) {
                    let indexing = this.deeper23.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper23(item)
                    }
                } else if (num === 3) {
                    let indexing = this.deeper3.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper3(item)
                    }
                } else if (num === 32) {
                    let indexing = this.deeper32.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper32(item)
                    }
                } else if (num === 33) {
                    let indexing = this.deeper33.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper33(item)
                    }
                } else if (num === 4) {
                    console.log(item)
                    let indexing = this.deeper4.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper4(item)
                    }
                } else if (num === 5) {
                    let indexing = this.deeper5.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper5(item)
                    }
                } else if (num === 6) {
                    let indexing = this.deeper6.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper6(item)
                    }
                } else if (num === 7) {
                    let indexing = this.deeper7.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper7(item)
                    }
                } else if (num === 8) {
                    let indexing = this.deeper8.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper8(item)
                    }
                } else if (num === 9) {
                    let indexing = this.deeper9.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper9(item)
                    }
                } else if (num === 10) {
                    let indexing = this.deepers.find(dt => dt.id === item.id)
                    console.log(indexing)
                    if (!indexing) {
                        this.setDeepers(item)
                    }
                    console.log(this.deepers)
                }
                // setTimeout(() => {
                //     document.getElementById('alb' + item.id).scrollIntoView({behavior: "smooth"})
                // }, 100);
            },
            async deeperAlbumMob(payload) {
                let item = payload.item,
                    num = payload.num,
                    child = payload.child,
                    search = payload.search,
                    parent = payload.parent
                if (item.album) {
                    item = item.album
                    item.album = true
                }
                item.type = 'deeperalbum'
                item.parentId = parent
                // console.log(item.id)
                let exists = false
                if (item.album) {
                    exists = await this.albums_data.find(dt => dt.id === item.album.id)
                } else {
                    exists = await this.albums_data.find(dt => dt.id === item.id)
                }

                if (exists) {
                    item = exists
                } else {
                    let clone = structuredClone(toRaw(item));
                    this.albums_data.push(clone)
                }
                console.log(exists)
                console.log(child)
                if (child) {
                    let par = document.getElementById(child).parentElement.nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                } else {
                    let albs = document.querySelectorAll(".rectrack > div")
                    console.log(albs)
                    for (let i of albs) {
                        if (i.id === 'alb' + item.id) {
                            i.style.display = 'flex'
                        } else {
                            i.style.display = 'none'
                        }
                    }
                }

                if (document.getElementById('alb' + item.id)) {
                    document.getElementById('alb' + item.id).style.display = 'flex'
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('sa'+ item.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                    return
                }

                // console.log(item.id)
                if (!exists) {
                    axios.get('https://api.spotify.com/v1/me/albums/contains?ids=' + item.id,
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            item.followed = response.data[0]

                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.deeperAlbum(payload)
                                    }
                                })
                            }
                        })
                }


                if (num === 1) {
                    let indexing = this.deeper1.find(dt => dt.id === item.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper1(item)
                    }
                } else if (num === 2) {
                    let indexing = this.deeper2.find(dt => dt.id === item.id)
                    if (!indexing) {
                        // eslint-disable-next-line no-undef
                        this.setDeeper2(item)
                    }
                } else if (num === 22) {
                    let indexing = this.deeper22.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper22(item)
                    }
                } else if (num === 23) {
                    let indexing = this.deeper23.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper23(item)
                    }
                } else if (num === 3) {
                    let indexing = this.deeper3.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper3(item)
                    }
                } else if (num === 32) {
                    let indexing = this.deeper32.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper32(item)
                    }
                } else if (num === 33) {
                    let indexing = this.deeper33.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper33(item)
                    }
                } else if (num === 4) {
                    let indexing = this.deeper4.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper4(item)
                    }
                } else if (num === 5) {
                    let indexing = this.deeper5.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper5(item)
                    }
                } else if (num === 6) {
                    let indexing = this.deeper6.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper6(item)
                    }
                } else if (num === 7) {
                    let indexing = this.deeper7.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper7(item)
                    }
                } else if (num === 8) {
                    let indexing = this.deeper8.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper8(item)
                    }
                } else if (num === 9) {
                    let indexing = this.deeper9.find(dt => dt.id === item.id)
                    if (!indexing) {
                        this.setDeeper9(item)
                    }
                } else if (num === 10) {
                    let indexing = this.deepers.find(dt => dt.id === item.id)
                    console.log(indexing)
                    if (!indexing) {
                        this.setDeepers(item)
                    }
                    console.log(this.deepers)
                }
                // setTimeout(() => {
                //     document.getElementById('alb' + item.id).scrollIntoView({behavior: "smooth"})
                // }, 100);
            },
            deeperAlbum2(payload) {
                let item = payload.item
                item.type = 'deeperalbum2'
                axios.get('https://api.spotify.com/v1/me/albums/contains?ids=' + item.id,
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        item.followed = response.data[0]
                    })
                    .catch(error => {
                        if (error.response.status === 401) {
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                // console.log(response.data)
                                if (response.status === 200) {
                                    this.deeperAlbum2(payload)
                                }
                            })
                        }
                    })
                // setTimeout(() => {
                //   window.scrollTo({
                //     top:(document.getElementById('alb'+ item.id)).offsetTop,
                //     behavior:'smooth'});
                // }, 10);
                // console.log(item)
            },
            thesoundof: async function (payload) {
                let name = payload.name,
                    num = payload.num,
                    sib = payload.sib,
                    child = payload.child
                let value = 'The Sound of ' + name.toUpperCase()
                let neww = titleCase.titleCase(name)
                let newvalue = 'The Sound of ' + neww
                // console.log(await titleCase.titleCase(name))
                // console.log(newvalue)
                axios.get('https://api.spotify.com/v1/search/?q=' + newvalue + '&type=playlist&limit=5',
                    {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then(async (response) => {
                        let playlists = response.data['playlists']['items']
                        // let first = playlists.find(playlists => playlists.name === newvalue && playlists.owner.id === 'thesoundsofspotify')
                        // console.log(first)
                        // let second = playlists.find(playlists => playlists.name === value && playlists.owner.id === 'thesoundsofspotify')
                        // console.log(second)
                        const finded = new Promise(function (resolve, reject) {
                            let first = playlists.find(playlists => playlists.name === newvalue || playlists.name.startsWith('The Sound ') && playlists.owner.id === 'thesoundsofspotify')
                            let second = playlists.find(playlists => playlists.name === value || playlists.name.startsWith('The Sound ') && playlists.owner.id === 'thesoundsofspotify')
                            if (first) {
                                resolve(first)
                            } else if (second) {
                                resolve(second)
                            } else {
                                reject(null)
                            }
                        })
                        finded.then((finded => {
                            let alltop = document.querySelectorAll('.rectrack > div.' + sib)
                            // console.log(alltop)
                            // console.log(child)
                            if (child) {
                                let par = document.getElementById(child).parentElement.nextElementSibling
                                // console.log(par)
                                while (par != null) {
                                    par.style.display = 'none'
                                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                                        par = par.nextElementSibling
                                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                                        par = par.nextElementSibling.nextElementSibling
                                    } else if (par.nextElementSibling === null) {
                                        par = null
                                    }
                                }
                            } else if (sib !== false && alltop.length !== false && alltop[alltop.length - 1].nextElementSibling !== null) {
                                let par = alltop[alltop.length - 1].nextElementSibling
                                while (par != null) {
                                    par.style.display = 'none'
                                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                                        par = par.nextElementSibling
                                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                                        par = par.nextElementSibling.nextElementSibling
                                    } else if (par.nextElementSibling === null) {
                                        par = null
                                    }
                                }
                            }
                            if (document.getElementById('p' + finded.id)) {
                                document.getElementById('p' + finded.id).style.display = 'flex'
                                return
                            }

                            let playlist = []
                            // console.log('237' + playlists[i].id)
                            axios.get('https://api.spotify.com/v1/playlists/' + finded.id,
                                {
                                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                            })
                                .then((response) => {
                                    // console.log(response.data['tracks'])
                                    let tracks = response.data['tracks']
                                    if (tracks['items'][0]['track']['preview_url']) {
                                        finded.preview_url = tracks['items'][0]['track']['preview_url']
                                    }
                                    finded.tracks = tracks
                                    playlist = finded
                                    playlist.type = 'deeperplaylist'
                                    // console.log(playlist)
                                    if (num === 1) {
                                        let indexing = this.deeper1.indexOf(playlist)
                                        if (indexing === -1) {
                                            // eslint-disable-next-line no-undef
                                            this.setDeeper1(playlist)
                                        }
                                    } else if (num === 2) {
                                        let indexing = this.deeper2.indexOf(playlist)
                                        if (indexing === -1) {
                                            // eslint-disable-next-line no-undef
                                            this.setDeeper2(playlist)
                                        }
                                    } else if (num === 22) {
                                        let indexing = this.deeper22.indexOf(playlist)
                                        if (indexing === -1) {
                                            this.setDeeper22(playlist)
                                        }
                                    } else if (num === 23) {
                                        let indexing = this.deeper23.indexOf(playlist)
                                        if (indexing === -1) {
                                            this.setDeeper23(playlist)
                                        }
                                    } else if (num === 3) {
                                        let indexing = this.deeper3.indexOf(playlist)
                                        if (indexing === -1) {
                                            this.setDeeper3(playlist)
                                        }
                                    } else if (num === 32) {
                                        let indexing = this.deeper32.indexOf(playlist)
                                        if (indexing === -1) {
                                            this.setDeeper32(playlist)
                                        }
                                    } else if (num === 33) {
                                        let indexing = this.deeper33.indexOf(playlist)
                                        if (indexing === -1) {
                                            this.setDeeper33(playlist)
                                        }
                                    } else if (num === 4) {
                                        let indexing = this.deeper4.indexOf(playlist)
                                        if (indexing === -1) {
                                            this.setDeeper4(playlist)
                                        }
                                    } else if (num === 5) {
                                        let indexing = this.deeper5.indexOf(playlist)
                                        if (indexing === -1) {
                                            this.setDeeper5(playlist)
                                        }
                                    } else if (num === 6) {
                                        let indexing = this.deeper6.indexOf(playlist)
                                        if (indexing === -1) {
                                            this.setDeeper6(playlist)
                                        }
                                    } else if (num === 7) {
                                        let indexing = this.deeper7.indexOf(playlist)
                                        if (indexing === -1) {
                                            this.setDeeper7(playlist)
                                        }
                                    } else if (num === 8) {
                                        let indexing = this.deeper8.indexOf(playlist)
                                        if (indexing === -1) {
                                            this.setDeeper8(playlist)
                                        }
                                    } else if (num === 9) {
                                        let indexing = this.deeper9.indexOf(playlist)
                                        if (indexing === -1) {
                                            this.setDeeper9(playlist)
                                        }
                                    } else if (num === 10) {
                                        let indexing = this.deepers.indexOf(playlist)
                                        if (indexing === -1) {
                                            this.setDeepers(playlist)
                                        }
                                    }

                                })
                        }))

                    }).catch(error => {
                    if (error.response.status === 401) {
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                            // console.log(response.data)
                            if (response.status === 200) {
                                this.thesoundof({name: name})
                            }
                        })
                    }
                })
            },

            followPlaylist(payload) {
                let playlist = payload.playlist,
                    event = payload.event
                event.target.disabled = true
                if (playlist.followed === false) {
                    axios.put('https://api.spotify.com/v1/playlists/' + playlist.id + '/followers',
                        {},{headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then(() => {
                            playlist.followed = true
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.followPlaylist({playlist: playlist, event: event})
                                    }
                                })
                            }
                        })
                } else {
                    axios.delete('https://api.spotify.com/v1/playlists/' + playlist.id + '/followers',
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then(() => {
                            playlist.followed = false
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.followPlaylist({playlist: playlist, event: event})
                                    }
                                })
                            }
                        })
                }
            },
            followArtist(payload) {
                let artist = payload.artist,
                    event = payload.event
                event.target.disabled = true
                if (artist.followed === false) {
                    axios.put('https://api.spotify.com/v1/me/following?type=artist&ids=' + artist.id,
                        {},{headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            if (response.status === 204) {
                                artist.followed = true
                            }
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.followArtist({name: name})
                                    }
                                })
                            }
                        })
                } else {
                    axios.delete('https://api.spotify.com/v1/me/following?type=artist&ids=' + artist.id,
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            if (response.status === 204) {
                                artist.followed = false
                            }
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.followArtist({artist: artist, event: event})
                                    }
                                })
                            }
                        })
                }
            },
            followAlbum(payload) {
                let album = payload.album,
                    event = payload.event
                // console.log(album.followed)
                event.target.disabled = true
                if (album.followed === false) {
                    axios.put('https://api.spotify.com/v1/me/albums?ids=' + album.id,
                        {}, {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                album.followed = true
                            }
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.followAlbum({album: album, event: event})
                                    }
                                })
                            }
                        })
                } else {
                    axios.delete('https://api.spotify.com/v1/me/albums?ids=' + album.id,
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                album.followed = false
                            }
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.followAlbum({album: album, event: event})
                                    }
                                })
                            }
                        })
                }
            },
            followTrack(payload) {
                let track = payload.track,
                    event = payload.event
                event.target.disabled = true
                if (track.followed === false) {
                    axios.put('https://api.spotify.com/v1/me/tracks?ids=' + track.id,
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                track.followed = true
                            }
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.followTrack({track: track, event: event})
                                    }
                                })
                            }
                        })
                } else {
                    axios.delete('https://api.spotify.com/v1/me/tracks?ids=' + track.id,
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                track.followed = false
                            }
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) => {
                                    // console.log(response.data)
                                    if (response.status === 200) {
                                        this.followTrack({track: track, event: event})
                                    }
                                })
                            }
                        })
                }
            },
            mouseOver: function (event) {
                let target = event.target
                let audios = target.lastChild
                console.log(audios)
                if (typeof audios.play === 'function' && this.audio_preview) {
                    audios.play()
                }
            },
            mouseLeave: function (event) {
                let target = event.target
                let audios = target.lastChild
                console.log(audios)
                if (typeof audios.pause === 'function' && this.audio_preview) {
                    audios.pause()
                    if (this.restart_song_on_hover) {
                        audios.currentTime = 0
                    }
                }
            },
            parentmouseOver: function (event) {
                let target = event.target
                // console.log(target)
                let audios = target.firstChild.lastChild
                // console.log(audios)
                if (audios && this.audio_preview) {
                    audios.play()
                }
            },
            parentmouseLeave: function (event) {
                let target = event.target
                // console.log(target)
                let audios = target.firstChild.lastChild
                // console.log(audios)
                if (audios && this.audio_preview) {
                    audios.pause()
                    if (this.restart_song_on_hover) {
                        audios.currentTime = 0
                    }
                }
            },
            parentClick: function (event) {
                let target = event.target
                console.log(target)
                // console.log(target)
                let audios = target.firstChild.lastChild
                if (this.currenttrack != null && this.currenttrack !== audios) {
                    this.currenttrack.pause()
                    if (this.restart_song_on_hover) {
                        this.currenttrack.currentTime = 0
                    }
                }
                if (this.audio_preview) {
                    if (audios.paused === false) {
                        audios.pause()
                        if (this.restart_song_on_hover) {
                            audios.currentTime = 0
                        }
                    } else
                        audios.play()
                    this.setCurrentTrack(audios)
                }
            },
            specialClick: function (event) {
                let target = event.target
                console.log(target)

                let audios = target.parentElement.parentElement.firstElementChild.lastChild

                // console.log(audios)
                if (this.currenttrack != null && this.currenttrack !== audios) {
                    this.currenttrack.pause()
                    if (this.restart_song_on_hover) {
                        this.currenttrack.currentTime = 0
                    }
                }
                if (this.audio_preview) {
                    if (audios.paused === false) {
                        audios.pause()
                        if (this.restart_song_on_hover) {
                            audios.currentTime = 0
                        }
                    } else
                        audios.play()
                    this.setCurrentTrack(audios)
                }
            },
            searchClick: function (payload) {
                let event = payload.event
                let target = event.target
                // console.log(target)
                let audios = target.parentElement.firstChild.lastChild
                if (this.currenttrack != null && this.currenttrack !== audios) {
                    this.currenttrack.pause()
                    if (this.restart_song_on_hover) {
                        this.currenttrack.currentTime = 0
                    }
                }
                if (this.audio_preview) {
                    if (audios.paused === false) {
                        audios.pause()
                        if (this.restart_song_on_hover) {
                            audios.currentTime = 0
                        }
                    } else
                        audios.play()
                    this.setCurrentTrack(audios)
                }
            },
            backToTop(id) {
                console.log(id)
                // setTimeout(() => {
                //     document.getElementById(id).scrollIntoView({behavior: "smooth"})
                // }, 10);
            },
            paginate(array, page_size, page_number) {
                return array.slice((page_number - 1) * page_size, page_number * page_size)
            },
            // eslint-disable-next-line no-unused-vars
            queuein(track) {
                // console.log(track)
                let current = localStorage.getItem('queue')
                let newque = {}
                newque.id = track.id
                newque.name = track.name
                newque.artists = Lists.Ls(track.artists)
                if (track.album) {
                    newque.image = track.album.images[0]
                } else if (track.images[0]) {
                    newque.image = track.images[0]
                }
                let arr = JSON.parse(current)
                if (arr !== null) {
                    let indexing = arr.findIndex((arr) => arr.id === track.id)
                    // console.log(indexing)
                    if (indexing === -1) {
                        arr.push(newque)
                        localStorage.setItem('queue', JSON.stringify(arr))
                        this.setQueue(arr.length)
                        this.setQueueArr(arr)
                        // console.log(JSON.stringify(arr))
                    }
                } else {
                    let newarr = []
                    newarr.push(newque)
                    localStorage.setItem('queue', JSON.stringify(newarr))
                    this.setQueue(newarr.length)
                    this.setQueueArr(newarr)
                    // console.log(JSON.stringify(newarr))
                }
            },
            savequeue() {
                if (this.queuearr.length > 50) {
                    for (let i = 0; i < this.queuearr.length; i++)
                        axios.put('https://api.spotify.com/v1/me/tracks?ids=' + this.queuearr.slice(i, i + 49).map(a => a.id).join(','),
                            {},{
                            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                        })
                            .then((response) => {
                                if (response.status === 200) {
                                    localStorage.removeItem('queue')
                                    this.setQueue(0)
                                    this.setQueueArr(null)
                                    // console.log('success 6394')
                                }
                            })
                            .catch()
                } else {
                    axios.put('https://api.spotify.com/v1/me/tracks?ids=' + this.queuearr.map(a => a.id).join(','),
                        {headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                localStorage.removeItem('queue')
                                this.setQueue(0)
                                this.setQueueArr(null)
                                // console.log('success 6406')
                            }
                        })
                        .catch()

                }

            },
            removequeue() {
                localStorage.removeItem('queue')
                this.setQueue(0)
                this.setQueueArr(null)
            },
            removequeueitem(id) {
                let que = JSON.parse(localStorage.getItem('queue'))
                const index = que.findIndex((arr) => arr.id === id)
                // console.log(index)
                if (index > -1) {
                    que.splice(index, 1);
                    let newa = JSON.stringify(que)
                    localStorage.setItem('queue', newa)
                    this.setQueueArr(que)
                }
            },
            checkPlaylists() {
                this.queueModal = true
                if (this.listplaylists.length === 0) {
                    let ne = {}
                    ne.target = document.getElementById('playlistlist')
                    this.fetchPlaylists({event: ne, offset: 0})
                }
            },
            createplaylist() {
                let name = prompt('Name for your playlist:', 'Discovered')
                axios.post('https://api.spotify.com/v1/users/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1") + '/playlists',
                    {name: name}, {
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")},
                })
                    .then(() => {
                        let ne = {}
                        ne.target = document.getElementById('playlistlist')
                        this.fetchPlaylists({event: ne, offset: 0})
                        // console.log(this.listplaylists)
                    })

            },
            saveQueueToPlaylist(event) {
                let target = event.target.id
                let que = JSON.parse(localStorage.getItem('queue'))
                axios.post('https://api.spotify.com/v1/playlists/' + target + '/tracks?uris=spotify:track:' + que.map(a => a.id).join(',spotify:track:'),
                    {},{headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        if (response.status === 201) {
                            this.$refs.status.innerText = 'Succesfully save'
                            setTimeout(() => {
                                this.$refs.status.innerText = ''
                            }, 3000);
                            // this.queuearr = localStorage.removeItem('queue')
                            // this.queue = 0
                            // console.log('success 6406')
                        }
                    })
                    .catch()
            },
        },
    })
;
