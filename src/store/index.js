import { createStore } from 'vuex'
import axios from "axios";
import titleCase from "../common/titleCase";
import {Lists} from "../common/lists";
export default createStore({
    state () {
        return {
            deeper1:[],
            deeper2:[],
            deeper22:[],
            deeper23:[],
            deeper3:[],
            deeper32:[],
            deeper33:[],
            deeper4:[],
            deeper5:[],
            deeper6:[],
            deeper7:[],
            deeper8:[],
            deeper9:[],
            deepers:[],
            queue: localStorage.getItem('queue') && JSON.parse(localStorage.getItem('queue')).length || null,
            queuearr:localStorage.getItem('queue') && JSON.parse(localStorage.getItem('queue')) || null,
            listplaylists:[],
            playinfo:[],
            playlists:[],
            topartist:[],
            topartist6:[],
            topartista:[],
            taactivetab:null,
            ttactivetab:null,
            savedalbums:[],
            savedtracks:[],
            newreleases:[],
            followedartists:[],
            items:[],
            itemsm:[],
            itemsl:[],
            spotplaylists:[],
            sptinfo:[],
            sptplaylists:[],
            arr:[],
            tracks:[],
            artists:[],
            albums:[],
            splaylists:[],
            currentpl:null,
            currentspl:null,
            searchtimer:null,
            currenttrack:null,
        }
    },
    mutations:{
        setDeeper1(state,deeper1){
            state.deeper1.push(deeper1)
        },
        setDeeper2(state,deeper2){
            state.deeper2.push(deeper2)
        },
        setDeeper22(state,deeper22){
            state.deeper22.push(deeper22);
        },
        setDeeper23(state,deeper23){
            state.deeper23.push(deeper23);
        },
        setDeeper3(state,deeper3){
            state.deeper3.push(deeper3)
        },
        setDeeper32(state,deeper32){
            state.deeper32.push(deeper32);
        },
        setDeeper33(state,deeper33){
            state.deeper33.push(deeper33);
        },
        setDeeper4(state,deeper4){
            state.deeper4.push(deeper4);
        },
        setDeeper5(state,deeper5){
            state.deeper5.push(deeper5);
        },
        setDeeper6(state,deeper6){
            state.deeper6.push(deeper6);
        },
        setDeeper7(state,deeper7){
            state.deeper7.push(deeper7);
        },
        setDeeper8(state,deeper8){
            state.deeper8.push(deeper8);
        },
        setDeeper9(state,deeper9){
            state.deeper9.push(deeper9);
        },
        setDeepers(state,deepers){
            state.deepers.push(deepers);
        },
        setQueue(state,queue){
            state.queue = queue;
        },
        setQueueArr(state,queuearr){
            state.queuearr = queuearr;
        },
        setListPlaylists(state,listplaylists,empty){
            if (empty){
                state.listplaylists = []
            } else{
                state.listplaylists.push(...listplaylists);
            }
        },
        setPlayInfo(state,playinfo){
            state.playinfo.push(playinfo);
        },
        setPlaylists(state,playlists){
            state.playlists = playlists;
        },
        setPlaylists2(state,playlists){
            state.playlists.push(playlists)
        },
        setTopArtist(state,topartist){
            state.topartist = topartist
        },
        setTopArtist6(state,topartist6){
            state.topartist6 = topartist6
        },
        setTopArtista(state,topartista){
            state.topartista = topartista
        },
        setTaactivetab(state,taactivetab){
            state.taactivetab = taactivetab
        },
        setTtactivetab(state,ttactivetab){
            state.ttactivetab = ttactivetab
        },
        setSavedAlbums(state,savedalbums){
            state.savedalbums.push(...savedalbums)
        },
        setSavedTracks(state,savedtracks){
            state.savedtracks.push(...savedtracks)
        },
        setNewReleases(state,newreleases){
            state.newreleases.push(...newreleases)
        },
        setFollowedArtists(state,followedartists){
            state.followedartists = followedartists
        },
        setItems(state,items){
            state.items = items
        },
        setItemsM(state,itemsm){
            state.itemsm = itemsm
        },
        setItemsL(state,itemsl){
            state.itemsl = itemsl
        },
        setSpotPlaylists(state,spotplaylists){
            state.spotplaylists.push(...spotplaylists)
        },
        setSptInfo(state,sptinfo){
            state.sptinfo = sptinfo
        },
        setSptPlaylists(state,sptplaylists){
            state.sptplaylists.push(sptplaylists)
        },
        setAlbums(state,albums){
            state.albums = albums
        },
        setArtists(state,artists){
            state.artists = artists
        },
        setTracks(state,tracks){
            state.tracks = tracks
        },
        setSPlaylists(state,splaylists){
            state.splaylists = splaylists
        },
        setCurrentPl(state,currentpl){
            state.currentpl = currentpl
        },
        setCurrentSPl(state,currentspl){
            state.currentspl = currentspl
        },
        setSearchTimer(state,searchtimer){
            state.searchtimer = searchtimer
        },
        setCurrentTrack(state,currenttrack){
            state.currenttrack = currenttrack
        },
        click(state,event){
            let target = event.target
            let audios = target.lastChild
            if (state.currentTrack !=null && state.currentTrack !==audios){
                state.currentTrack.pause()
            }
            if (audios.paused === false) {
                audios.pause()
            } else
                audios.play()
            state.currenttrack = audios
        },
    },
    actions:{
        playl(context,payload){
            let item = payload.item
            let pls = document.querySelectorAll('#search> .rectrack > div')
            for (let i = 0; i < pls.length; i++) {
                if (document.getElementById('p'+  item.id) !=null && pls[i].id === document.getElementById('p'+ item.id).id){
                    document.getElementById('p'+  item.id).style.display = 'block'
                }else {
                    pls[i].style.display = 'none'
                }
            }
            item.type = 'deeperplaylist'
            let indexing = this.state.deepers.indexOf(item)
            if (indexing === -1){
                this.state.deepers.push(item)
            }
        },
        deeper: function(context,payload){
            let item = payload.item,
                num = payload.num,
                event = payload.event
            // console.log(item)
            let target = event.target
            if (num === 10){
                let allTracks = document.querySelectorAll(".rectrack > div:not(.playlist)");
                if (allTracks != null) {
                    for (let i = 0; i < allTracks.length; i++) {
                        // eslint-disable-next-line no-empty
                        if (document.getElementById('d'+  item.id) !=null && allTracks[i].id === document.getElementById('d'+ item.id).id){

                        } else{
                            allTracks[i].style.display = 'none'
                        }


                    }

                }
            } else {
                let allTracks = document.querySelectorAll(".rectrack > div");
                if (allTracks != null) {
                    for (let i = 0; i < allTracks.length; i++) {
                        // eslint-disable-next-line no-empty
                        if (document.getElementById('d'+  item.id) !=null && allTracks[i].id === document.getElementById('d'+ item.id).id){

                        } else{
                            allTracks[i].style.display = 'none'
                        }


                    }

                }
            }
            if (document.getElementById('d'+ item.id) !==null){
                document.getElementById('d'+ item.id).style.display = 'flex'
                return
            }
            let tracktrack = []
            tracktrack = item
            tracktrack.type = 'pl'
            if(num !== 1 && num !==5)
                axios.request({
                    url:'https://api.spotify.com/v1/me/tracks/contains?ids=' + item.id,
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        tracktrack.followed = response.data[0]
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                // console.log(response.data)
                                if (response.status === 200){
                                    context.dispatch('deeper',payload)
                                    context.dispatch('deeper',payload)
                                }
                            })
                        }
                    })
            if (num === 1){
                if (document.getElementById('d'+ item.track.id) !==null){
                    document.getElementById('d'+ item.track.id).style.display = 'flex'
                    let child = target.parentElement.children
                    for (let i = 0; i < child.length; i++) {
                        if (child[i] === target){
                            child[i].className = 'con3 selected'
                        } else{
                            child[i].className = 'con3'
                        }
                    }
                    return
                }
                let tt = []
                tt = item.track
                tt.type = 'pl'
                // console.log(tt)
                // console.log(item.track.id)
                let child = target.parentElement.children
                for (let i = 0; i < child.length; i++) {
                    if (child[i] === target){
                        child[i].className = 'con3 selected'
                    } else{
                        child[i].className = 'con3'
                    }
                }
                if (item.track.id === null)
                    return null
                axios.request({
                    url:'https://api.spotify.com/v1/me/tracks/contains?ids=' + item.track.id,
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        tt.followed = response.data[0]
                        let indexing = this.state.deeper1.indexOf(tt)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit('setDeeper1',tt)
                            // setTimeout(() => {
                            //   // console.log('3542')
                            //   window.scrollTo({
                            //     top:(document.getElementById('d'+ tt.id)).offsetTop + 300,
                            //     behavior:'smooth'});
                            // }, 800);
                        }
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                if (response.status === 200){
                                    context.dispatch('deeper',payload)
                                }
                            })
                        }
                    })
                // console.log(tracktrack)
                // console.log(this.deeper1)
            } else if (num === 2){
                let indexing = this.state.deeper2.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit('setDeeper2',tracktrack)
                }
                // console.log(tracktrack)
                // console.log(this.deeper2)
            } else if (num === 22){
                let indexing = this.state.deeper22.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit('setDeeper22',tracktrack)
                }
                // console.log(tracktrack)
                // console.log(this.deeper22)
            } else if (num === 23){
                let indexing = this.state.deeper23.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit('setDeeper23',tracktrack)
                }
                // console.log(tracktrack)
                // console.log(this.deeper23)
            } else if (num === 3){
                let indexing = this.state.deeper3.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit('setDeeper3',tracktrack)
                }
                // console.log(tracktrack)
                // console.log(this.deeper3)
            } else if (num === 32){
                let indexing = this.state.deeper32.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit('setDeeper32',tracktrack)
                }
                // console.log(tracktrack)
                // console.log(this.deeper32)
            } else if (num === 33){
                let indexing = this.state.deeper33.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit('setDeeper33',tracktrack)
                }
                // console.log(tracktrack)
                // console.log(this.deeper33)
            } else if (num === 4){
                let indexing = this.state.deeper4.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit('setDeeper4',tracktrack)
                }
                // console.log(tracktrack)
                // console.log(this.deeper4)
            } else if (num === 5){
                let child = document.querySelectorAll('#savedtrack > div.albumbody')
                // console.log(child)
                // console.log(target)
                for (let i = 0; i < child.length; i++) {
                    if (child[i].children[0] === target){
                        child[i].children[0].className = 'con3 selected'
                    } else if (child[i].children[0]){
                        child[i].children[0].className = 'con3'
                    }
                }
                if (document.getElementById('d'+ item.track.id) !==null){
                    let recs = document.querySelectorAll('.rectrack > div')
                    for (let i of recs){
                        if (document.getElementById('d'+ item.track.id) === i){
                            i.style.display = 'flex'
                            // i.className = 'card2 plls'
                        } else{
                            i.style.display = 'none'
                        }
                    }
                    // let child = target.parentElement.children
                    // console.log(child)
                    // for (let i = 0; i < child.length; i++) {
                    //   if (child[i] === target){
                    //     console.log('11111')
                    //     console.log(target)
                    //     child[i].className = 'con3 selected'
                    //   } else{
                    //     child[i].className = 'con3'
                    //   }
                    // }
                    return
                }
                let tt = []
                tt = item.track
                tt.type = 'pl'

                axios.request({
                    url:'https://api.spotify.com/v1/me/tracks/contains?ids=' + tt.id,
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        tt.followed =  response.data[0]
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                if (response.status === 200){
                                    context.dispatch('deeper',payload)
                                }
                                // console.log(response.data)
                            })
                        }
                    })
                // console.log(item.track)
                let indexing = this.state.deeper5.indexOf(tt)
                if (indexing === -1){
                    this.commit('setDeeper5',tt)
                }
                // setTimeout(() => {
                //   window.scrollTo({
                //     top:(document.getElementById('d'+ tt.id)).offsetTop,
                //     behavior:'smooth'});
                // }, 10);
                // console.log(this.deeper5)
            } else if (num === 6){
                let indexing = this.state.deeper6.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit('setDeeper6',tracktrack)
                }
                // console.log(tracktrack)
                // console.log(this.deeper6)
            } else if (num === 7){
                tracktrack.preview_url = item.tracks.items[0].preview_url
                let indexing = this.state.deeper7.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit('setDeeper7',tracktrack)
                }
                // console.log(this.deeper7)
            } else if (num === 8){
                let indexing = this.state.deeper8.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit('setDeeper8',tracktrack)
                }
                // console.log(tracktrack)
                // console.log(this.deeper8)
            } else if (num === 9){
                if (document.getElementById('d'+ item.track.id) !==null){
                    document.getElementById('d'+ item.track.id).style.display = 'flex'
                    let child = target.parentElement.children
                    for (let i = 0; i < child.length; i++) {
                        if (child[i] === target){
                            child[i].className = 'con3 selected'
                        } else{
                            child[i].className = 'con3'
                        }
                    }
                    return
                }
                let tt = []
                tt = item.track
                tt.type = 'pl'
                let child = target.parentElement.children
                for (let i = 0; i < child.length; i++) {
                    if (child[i] === target){
                        child[i].className = 'con3 selected'
                    } else{
                        child[i].className = 'con3'
                    }
                }
                let indexing = this.state.deeper9.indexOf(tt)
                if (indexing === -1){
                    this.commit('setDeeper9',tt)
                }
                // console.log(tt)
                // console.log(this.deeper9)
            } else if (num === 10){
                let indexing = this.state.deepers.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit('setDeepers',tracktrack)
                }
                // console.log(this.deepers)
            }
            if (num !== 1 && num !==5){
                // setTimeout(() => {
                //   window.scrollTo({
                //     top:(document.getElementById('d'+ tracktrack.id)).offsetTop,
                //     behavior:'smooth'});
                // }, 10);
            }
        },
        deepermobile:async function(context,payload){
            let item = payload.item,
                num = payload.num,
                event = payload.event
            let target = event.target
            // target.nextElementSibling.offsetHeight
            if (num === 10){
                let allTracks = document.querySelectorAll(".rectrack > div:not(.playlist)");
                if (allTracks != null) {
                    for (let i = 0; i < allTracks.length; i++) {
                        // eslint-disable-next-line no-empty
                        if (document.getElementById('d'+  item.id) !=null && allTracks[i].id === document.getElementById('d'+ item.id).id){

                        } else{
                            allTracks[i].style.display = 'none'
                        }


                    }

                }
            } else {
                let allTracks = document.querySelectorAll(".rectrack > div");
                if (allTracks != null) {
                    for (let i = 0; i < allTracks.length; i++) {
                        // eslint-disable-next-line no-empty
                        if (document.getElementById('d'+  item.id) !=null && allTracks[i].id === document.getElementById('d'+ item.id).id){

                        } else{
                            allTracks[i].style.display = 'none'
                        }


                    }

                }
            }
            if (document.getElementById('d'+ item.id) !==null){
                document.getElementById('d'+ item.id).style.display = 'flex'
                if (num === 3 || num ===32 || num===33 || num === 7){
                    setTimeout(async () => {
                        await context.dispatch('hideall',{elem:target.nextElementSibling})
                        // console.log(target.nextElementSibling)
                        let lst = target.nextElementSibling.children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 50 + 'px'
                    },0)}
                return
            }
            let tracktrack = []
            tracktrack = item
            tracktrack.type = 'pl'
            tracktrack.pid = item.id
            if(num !== 1 && num !==5 && num !== 9)
                await axios.request({
                    url:'https://api.spotify.com/v1/me/tracks/contains?ids=' + item.id,
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        tracktrack.followed = response.data[0]
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                // console.log(response.data)
                                if (response.status === 200){
                                    context.dispatch('deeper',payload)
                                }
                            })
                        }
                    })
            if (num === 1){
                if (document.getElementById('d'+ item.track.id) !==null){
                    document.getElementById('d'+ item.track.id).style.display = 'flex'
                    await context.dispatch('hideall',{elem:target.nextElementSibling})
                    setTimeout(async () => {
                        let lst = target.nextElementSibling.children[0].children
                        let newarray = []
                        for await(let i of lst) {
                            newarray.push(i.offsetHeight)
                        }
                        target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 50 + 'px'
                    },0)
                    return
                }
                let tt = []
                tt = item.track
                tt.type = 'pl'
                tt.pid = item.track.id
                axios.request({
                    url:'https://api.spotify.com/v1/me/tracks/contains?ids=' + item.track.id,
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        tt.followed = response.data[0]
                        let indexing = this.state.deeper1.indexOf(tt)
                        if (indexing === -1){
                            this.commit("setDeeper1",tt)
                            // console.log(this.state)
                            // console.log(tt)
                            setTimeout(async () => {
                                await context.dispatch('hideall',{elem:target.nextElementSibling})

                                // console.log(target.nextElementSibling)
                                let lst = target.nextElementSibling.children[0].children
                                // console.log(lst)
                                let newarray = []
                                for await(let i of lst) {
                                    // console.log(i)
                                    newarray.push(i.offsetHeight)
                                }
                                // console.log(newarray.reduce((a, b) => a + b, 0))
                                target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 50 + 'px'
                            },0)
                            window.addEventListener('resize',function (){
                                setTimeout(async () => {
                                    // console.log('3826')
                                    // console.log(target.nextElementSibling)
                                    let lst = target.nextElementSibling.children[0].children
                                    // console.log(lst)
                                    let newarray = []
                                    for await(let i of lst) {
                                        // console.log(i)
                                        newarray.push(i.offsetHeight)
                                    }
                                    target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 50 + 'px'
                                },0)
                            })
                        }
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                if (response.status === 200){
                                    context.dispatch('deeper',payload)
                                }
                            })
                        }
                    })
            } else if (num === 2){
                let indexing = context.state.deeper2.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit("setDeeper2",tracktrack)
                }
            } else if (num === 22){
                let indexing = context.state.deeper22.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit("setDeeper22",tracktrack)
                }
            } else if (num === 23){
                let indexing = context.state.deeper23.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit("setDeeper23",tracktrack)
                }
            } else if (num === 3){
                let indexing = context.state.deeper3.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit("setDeeper3",tracktrack)
                }
            } else if (num === 32){
                let indexing = context.state.deeper32.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit("setDeeper32",tracktrack)
                }
            } else if (num === 33){
                let indexing = context.state.deeper33.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit("setDeeper33",tracktrack)
                }
            } else if (num === 4){
                let indexing = context.state.deeper4.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit("setDeeper4",tracktrack)
                }
            } else if (num === 5){
                if (document.getElementById('d'+ item.id) !==null){
                    document.getElementById('d'+ item.id).style.display = 'flex'
                    setTimeout(async () => {
                        await context.dispatch('hideall',{elem:target.nextElementSibling})
                        // console.log(target.nextElementSibling)
                        let lst = target.nextElementSibling.children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 50 + 'px'
                    },0)
                    return
                }
                window.addEventListener('resize',function (){
                    setTimeout(async () => {
                        // console.log(target.nextElementSibling)
                        let lst = target.nextElementSibling.children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 50 + 'px'
                    },0)
                })
                let tt = []
                tt = item.track
                tt.type = 'pl'
                tt.pid = tt.id
                await axios.request({
                    url:'https://api.spotify.com/v1/me/tracks/contains?ids=' + tt.id,
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        tt.followed =  response.data[0]
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                if (response.status === 200){
                                    context.dispatch('deeper',payload)
                                }
                            })
                        }
                    })
                let indexing = context.state.deeper5.indexOf(tt)
                if (indexing === -1){
                    this.commit("setDeeper5",tt)
                }
            } else if (num === 6){
                let indexing = context.state.deeper6.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit("setDeeper6",tracktrack)
                }
            } else if (num === 7){
                tracktrack.preview_url = item.tracks.items[0].preview_url
                let indexing = context.state.deeper7.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit("setDeeper7",tracktrack)
                }
                setTimeout(async () => {
                    await context.dispatch('hideall',{elem:target.nextElementSibling})
                    // console.log(target.nextElementSibling)
                    let lst = target.nextElementSibling.children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 50 + 'px'
                },0)
            } else if (num === 8){
                let indexing = context.state.deeper8.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit("setDeeper8",tracktrack)
                }
            } else if (num === 9){
                if (document.getElementById('d'+ item.id) !==null){
                    document.getElementById('d'+ item.id).style.display = 'flex'
                    await setTimeout(async () => {
                        await context.dispatch('hideall',{elem:target.nextElementSibling})
                        let lst = target.nextElementSibling.children[0].children
                        let newarray = []
                        for await(let i of lst) {
                            newarray.push(i.offsetHeight)
                        }
                        target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                    },0)
                    window.addEventListener('resize',function (){
                        setTimeout(async () => {
                            let lst = target.nextElementSibling.children[0].children
                            let newarray = []
                            for await(let i of lst) {
                                newarray.push(i.offsetHeight)
                            }
                            target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                        },0)
                    })


                } else{
                    let tt = []
                    tt = item.track
                    tt.type = 'pl'
                    tt.pid = item.track.id

                    axios.request({
                        url:'https://api.spotify.com/v1/me/tracks/contains?ids=' + item.track.id,
                        method: 'get',
                        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) =>{
                            tt.followed = response.data[0]
                            let indexing = context.state.deeper9.indexOf(tt)
                            if (indexing === -1){
                                context.state.deeper9.push(tt)
                                setTimeout(async () => {
                                    await context.dispatch('hideall',{elem:target.nextElementSibling})
                                    // console.log(target.nextElementSibling)
                                    let lst = target.nextElementSibling.children[0].children
                                    // console.log(lst)
                                    // console.log(lst)
                                    let newarray = []
                                    for await(let i of lst) {
                                        // console.log(i)
                                        newarray.push(i.offsetHeight)
                                    }
                                    // console.log(newarray.reduce((a, b) => a + b, 0))
                                    target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 20 + 'px'
                                },0)
                                window.addEventListener('resize',function (){
                                    setTimeout(async () => {
                                        // console.log('3826')
                                        // console.log(target.nextElementSibling)
                                        let lst = target.nextElementSibling.children[0].children
                                        // console.log(lst)
                                        let newarray = []
                                        for await(let i of lst) {
                                            // console.log(i)
                                            newarray.push(i.offsetHeight)
                                        }
                                        target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'

                                    },0)
                                })
                            }
                        })
                        .catch(error =>{
                            if (error.response.status === 401){
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                    if (response.status === 200){
                                        context.dispatch('deeper',payload)
                                    }
                                })
                            }
                        })
                }
            } else if (num === 10){
                let indexing = context.state.deepers.indexOf(tracktrack)
                if (indexing === -1){
                    this.commit("setDeepers",tracktrack)
                }
            }
            if (num === 3 || num ===32 || num===33 || num === 5 || num === 7){
                setTimeout(async () => {
                    await context.dispatch('hideall',{elem:target.nextElementSibling})

                    // console.log(target.nextElementSibling)
                    let lst = target.nextElementSibling.children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 50 + 'px'
                },0)
                window.addEventListener('resize',function (){
                    setTimeout(async () => {
                        // console.log('3826')
                        // console.log(target.nextElementSibling)
                        let lst = target.nextElementSibling.children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 50 + 'px'
                    },0)
                })}
        },
        fetchPlaylists(context,payload){
            let event = payload.event,
                offset = payload.offset
            // console.log(offset)
            // let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
            // event.target.nextElementSibling.insertAdjacentHTML("afterbegin",div)
            axios.request({
                url:'https://api.spotify.com/v1/me/playlists?fields=items(name,id)&limit=50&offset=' + offset,
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    if (offset === 0){
                        this.commit('setListPlaylists',[],true)
                        this.commit('setListPlaylists',response.data['items'])
                        if (response.data['items'].length > 0){
                            context.dispatch('fetchPlaylists', {event:event,offset:offset+=50})
                        }
                    }else {
                        this.commit('setListPlaylists',response.data['items'])
                        if (response.data['items'].length > 0){
                            context.dispatch('fetchPlaylists', {event:event,offset:offset+=50})
                        }
                    }

                    // document.getElementById("loader").remove()
                })
                .catch(error =>{
                    // console.log(error)
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            if (response.status === 200){
                                context.dispatch('fetchPlaylists', {event:event,offset:offset})
                            }
                            // let new_token = response.data['new_token']
                            // document.cookie ='access_token=' + new_token
                        })
                    }
                })
        },
        fetchInit:function(context,payload){
            let event = payload.event
            // console.log('167 '  + event.currentTarget.id)
            let id = event.currentTarget.id
            let allTracks = document.querySelectorAll("#yourplaylists > .rectrack > div");
            if (allTracks != null) {
                for (let i = 0; i < allTracks.length; i++) {
                    allTracks[i].style.display = 'none'
                }
            }
            let pl = document.querySelectorAll('#yourplaylists > div:not(.rectrack,.pl,.rel)')
            for (let i=0;i <  pl.length;i++){
                pl[i].style.display = 'none'

            }
            if (document.getElementById('p'+ id)){
                // console.log(document.getElementById('p'+ id))
                document.getElementById('p'+ id).style.display = 'block'
                // console.log(this.currentpl)
                // this.commit('setCurrentPl',document.getElementById(id))
                if (context.state.currentpl){
                    context.state.currentpl.className = 'hr-line-dashed'
                    this.commit('setCurrentPl',document.getElementById(id))
                    context.state.currentpl.className = 'hr-line-dashed activetab'
                } else {
                    this.commit('setCurrentPl',document.getElementById(id))
                    context.state.currentpl.className = 'hr-line-dashed activetab'
                }
                // setTimeout(() => {
                //   window.scrollTo({
                //     top:(document.getElementById('p'+ id)).offsetTop,
                //     behavior:'smooth'});
                // },10)
                return
            }
            axios.request({
                url:'https://api.spotify.com/v1/playlists/' + id,
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    // console.log(response.data)
                    let data = response.data
                    this.commit('setPlaylists2',data)
                })
        },
        fetchArtist(context,payload){
            let event = payload.event
            if (event.target.parentElement.id === 'option2'){
                let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
                event.target.nextElementSibling.insertAdjacentHTML("afterbegin",div)
            } else {
                let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
                event.target.parentElement.nextElementSibling.insertAdjacentHTML("afterbegin",div)
            }
            axios.request({
                url:'https://api.spotify.com/v1/me/top/artists?time_range=short_term',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then(async(response) =>{
                    let newarr = []
                    let items =response.data['items']
                    // console.log('235' + items[0].id)
                    for await(let i of items){
                        // console.log('237' + items[i].id)
                        axios.request({
                            url:'https://api.spotify.com/v1/artists/' + i.id + '/top-tracks?market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                            method: 'get',
                            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                        })
                            .then((response) =>{
                                // console.log('247' + response.data)
                                let tracks = response.data['tracks']
                                if (tracks[0]['preview_url']){
                                    i.preview_url = tracks[0]['preview_url']
                                }
                                i.tracks = tracks
                                newarr.push(i)
                                if (i === items[items.length-1]){
                                    setTimeout(() => {
                                        this.commit("setTopArtist",newarr)
                                    },1000)
                                }
                            })
                    }
                    document.getElementById("loader").remove()
                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('fetchArtist', {event:event})
                            }
                        })
                    }
                })
        },
        fetchArtist2(context,payload){
            let event = payload.event
            let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
            event.target.parentElement.nextElementSibling.insertAdjacentHTML("afterbegin",div)
            axios.request({
                url:'https://api.spotify.com/v1/me/top/artists?time_range=medium_term',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then(async(response) =>{
                    let newarr = []
                    let items =response.data['items']
                    // console.log('235' + items[0].id)
                    for await(let i of  items){
                        // console.log('237' + items[i].id)
                        axios.request({
                            url:'https://api.spotify.com/v1/artists/' + i.id + '/top-tracks?market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                            method: 'get',
                            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                        })
                            .then((response) =>{
                                // console.log('247' + response.data)
                                let tracks = response.data['tracks']
                                if (tracks[0]['preview_url']){
                                    i.preview_url = tracks[0]['preview_url']
                                }
                                i.tracks = tracks
                                newarr.push(i)
                                if (i === items[items.length-1]){
                                    setTimeout(() => {
                                        this.commit("setTopArtist6",newarr)
                                    },1000)
                                }
                            })
                    }
                    document.getElementById("loader").remove()
                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('fetchArtist2', {event:event})
                            }
                        })
                    }
                })
        },
        fetchArtist3(context,payload){
            let event = payload.event
            let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
            event.target.parentElement.nextElementSibling.insertAdjacentHTML("afterbegin",div)
            axios.request({
                url:'https://api.spotify.com/v1/me/top/artists?time_range=long_term',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then(async(response) =>{
                    let newarr = []
                    let items =response.data['items']
                    // console.log('235' + items[0].id)
                    for await(let i of items){
                        // console.log('237' + items[i].id)
                        axios.request({
                            url:'https://api.spotify.com/v1/artists/' + i.id + '/top-tracks?market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                            method: 'get',
                            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                        })
                            .then((response) =>{
                                // console.log('247' + response.data)
                                let tracks = response.data['tracks']
                                if (tracks[0]['preview_url']){
                                    i.preview_url = tracks[0]['preview_url']
                                }
                                i.tracks = tracks
                                newarr.push(i)
                                if (i === items[items.length-1]){
                                    setTimeout(() => {
                                        this.commit("setTopArtista",newarr)
                                    },1000)
                                }
                            })
                    }
                    document.getElementById("loader").remove()
                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('fetchArtist3', {event:event})
                            }
                        })
                    }
                })
        },
        switchTabs(context,payload){
            let event = payload.event
            let mobile = payload.mobile
            if (mobile){
                let allRecs = document.querySelectorAll(".rectrack")
                for (let i of allRecs){
                    i.style.display = 'none'
                }
            }
            let target = event.target
            if (target.id === 'playlistlist'){
                if (document.getElementById('playlistlist').className === 'tabs_target'){
                    document.getElementById('playlistlist').className = ''
                    document.getElementById('playlistlist').nextElementSibling.style.height = 0
                    return
                }
                document.getElementById('playlistlist').className = 'tabs_target'
                document.getElementById('playlistlist').nextElementSibling.style.height = 'auto'
                document.getElementById('ta').className = ''
                document.getElementById('ta').nextElementSibling.style.height = 0
                document.getElementById('tt').className = ''
                document.getElementById('tt').nextElementSibling.style.height = 0
                document.getElementById('sa').className = ''
                document.getElementById('sa').nextElementSibling.style.height = 0
                document.getElementById('st').className = ''
                document.getElementById('st').nextElementSibling.style.height = 0
                document.getElementById('fa').className = ''
                document.getElementById('fa').nextElementSibling.style.height = 0
                document.getElementById('nr').className = ''
                document.getElementById('nr').nextElementSibling.style.height = 0
                document.getElementById('spt').className = ''
                document.getElementById('spt').nextElementSibling.style.height = 0
                document.getElementById('sear').className = ''
                document.getElementById('sear').nextElementSibling.style.height = 0
            } else if (target.id === 'ta'){
                if (document.getElementById('ta').className === 'tabs_target'){
                    document.getElementById('ta').className = ''
                    document.getElementById('ta').nextElementSibling.style.height = 0
                    return
                }
                document.getElementById('playlistlist').className = ''
                document.getElementById('playlistlist').nextElementSibling.style.height = 0
                document.getElementById('ta').className = 'tabs_target'
                document.getElementById('ta').nextElementSibling.style.height = 'auto'
                document.getElementById('tt').className = ''
                document.getElementById('tt').nextElementSibling.style.height = 0
                document.getElementById('sa').className = ''
                document.getElementById('sa').nextElementSibling.style.height = 0
                document.getElementById('st').className = ''
                document.getElementById('st').nextElementSibling.style.height = 0
                document.getElementById('fa').className = ''
                document.getElementById('fa').nextElementSibling.style.height = 0
                document.getElementById('nr').className = ''
                document.getElementById('nr').nextElementSibling.style.height = 0
                document.getElementById('spt').className = ''
                document.getElementById('spt').nextElementSibling.style.height = 0
                document.getElementById('sear').className = ''
                document.getElementById('sear').nextElementSibling.style.height = 0
            } else if (target.id === 'tt'){
                if (document.getElementById('tt').className === 'tabs_target'){
                    document.getElementById('tt').className = ''
                    document.getElementById('tt').nextElementSibling.style.height = 0
                    return
                }
                document.getElementById('playlistlist').className = ''
                document.getElementById('playlistlist').nextElementSibling.style.height = 0
                document.getElementById('ta').className = ''
                document.getElementById('ta').nextElementSibling.style.height = 0
                document.getElementById('tt').className = 'tabs_target'
                document.getElementById('tt').nextElementSibling.style.height = 'auto'
                document.getElementById('sa').className = ''
                document.getElementById('sa').nextElementSibling.style.height = 0
                document.getElementById('st').className = ''
                document.getElementById('st').nextElementSibling.style.height = 0
                document.getElementById('fa').className = ''
                document.getElementById('fa').nextElementSibling.style.height = 0
                document.getElementById('nr').className = ''
                document.getElementById('nr').nextElementSibling.style.height = 0
                document.getElementById('spt').className = ''
                document.getElementById('spt').nextElementSibling.style.height = 0
                document.getElementById('sear').className = ''
                document.getElementById('sear').nextElementSibling.style.height = 0
            } else if (target.id === 'sa'){
                if (document.getElementById('sa').className === 'tabs_target'){
                    document.getElementById('sa').className = ''
                    document.getElementById('sa').nextElementSibling.style.height = 0
                    return
                }
                document.getElementById('playlistlist').className = ''
                document.getElementById('playlistlist').nextElementSibling.style.height = 0
                document.getElementById('ta').className = ''
                document.getElementById('ta').nextElementSibling.style.height = 0
                document.getElementById('tt').className = ''
                document.getElementById('tt').nextElementSibling.style.height = 0
                document.getElementById('sa').className = 'tabs_target'
                document.getElementById('sa').nextElementSibling.style.height = 'auto'
                document.getElementById('st').className = ''
                document.getElementById('st').nextElementSibling.style.height = 0
                document.getElementById('fa').className = ''
                document.getElementById('fa').nextElementSibling.style.height = 0
                document.getElementById('nr').className = ''
                document.getElementById('nr').nextElementSibling.style.height = 0
                document.getElementById('spt').className = ''
                document.getElementById('spt').nextElementSibling.style.height = 0
                document.getElementById('sear').className = ''
                document.getElementById('sear').nextElementSibling.style.height = 0
            } else if (target.id === 'st'){
                if (document.getElementById('st').className === 'tabs_target'){
                    document.getElementById('st').className = ''
                    document.getElementById('st').nextElementSibling.style.height = 0
                    return
                }
                document.getElementById('playlistlist').className = ''
                document.getElementById('playlistlist').nextElementSibling.style.height = 0
                document.getElementById('ta').className = ''
                document.getElementById('ta').nextElementSibling.style.height =0
                document.getElementById('tt').className = ''
                document.getElementById('tt').nextElementSibling.style.height = 0
                document.getElementById('sa').className = ''
                document.getElementById('sa').nextElementSibling.style.height = 0
                document.getElementById('st').className = 'tabs_target'
                document.getElementById('st').nextElementSibling.style.height = 'auto'
                document.getElementById('fa').className = ''
                document.getElementById('fa').nextElementSibling.style.height = 0
                document.getElementById('nr').className = ''
                document.getElementById('nr').nextElementSibling.style.height = 0
                document.getElementById('spt').className = ''
                document.getElementById('spt').nextElementSibling.style.height = 0
                document.getElementById('sear').className = ''
                document.getElementById('sear').nextElementSibling.style.height = 0
            } else if (target.id === 'fa'){
                if (document.getElementById('fa').className === 'tabs_target'){
                    document.getElementById('fa').className = ''
                    document.getElementById('fa').nextElementSibling.style.height = 0
                    return
                }
                document.getElementById('playlistlist').className = ''
                document.getElementById('playlistlist').nextElementSibling.style.height = 0
                document.getElementById('ta').className = ''
                document.getElementById('ta').nextElementSibling.style.height = 0
                document.getElementById('tt').className = ''
                document.getElementById('tt').nextElementSibling.style.height = 0
                document.getElementById('sa').className = ''
                document.getElementById('sa').nextElementSibling.style.height = 0
                document.getElementById('st').className = ''
                document.getElementById('st').nextElementSibling.style.height = 0
                document.getElementById('fa').className = 'tabs_target'
                document.getElementById('fa').nextElementSibling.style.height = 'auto'
                document.getElementById('nr').className = ''
                document.getElementById('nr').nextElementSibling.style.height = 0
                document.getElementById('spt').className = ''
                document.getElementById('spt').nextElementSibling.style.height = 0
                document.getElementById('sear').className = ''
                document.getElementById('sear').nextElementSibling.style.height = 0
            } else if (target.id === 'nr'){
                if (document.getElementById('nr').className === 'tabs_target'){
                    document.getElementById('nr').className = ''
                    document.getElementById('nr').nextElementSibling.style.height = 0
                    return
                }
                document.getElementById('playlistlist').className = ''
                document.getElementById('playlistlist').nextElementSibling.style.height = 0
                document.getElementById('ta').className = ''
                document.getElementById('ta').nextElementSibling.style.height = 0
                document.getElementById('tt').className = ''
                document.getElementById('tt').nextElementSibling.style.height = 0
                document.getElementById('sa').className = ''
                document.getElementById('sa').nextElementSibling.style.height = 0
                document.getElementById('st').className = ''
                document.getElementById('st').nextElementSibling.style.height = 0
                document.getElementById('fa').className = ''
                document.getElementById('fa').nextElementSibling.style.height = 0
                document.getElementById('nr').className = 'tabs_target'
                document.getElementById('nr').nextElementSibling.style.height = 'auto'
                document.getElementById('spt').className = ''
                document.getElementById('spt').nextElementSibling.style.height = 0
                document.getElementById('sear').className = ''
                document.getElementById('sear').nextElementSibling.style.height = 0
            } else if (target.id === 'spt'){
                if (document.getElementById('spt').className === 'tabs_target'){
                    document.getElementById('spt').className = ''
                    document.getElementById('spt').nextElementSibling.style.height = 0
                    return
                }
                document.getElementById('playlistlist').className = ''
                document.getElementById('playlistlist').nextElementSibling.style.height = 0
                document.getElementById('ta').className = ''
                document.getElementById('ta').nextElementSibling.style.height = 0
                document.getElementById('tt').className = ''
                document.getElementById('tt').nextElementSibling.style.height = 0
                document.getElementById('sa').className = ''
                document.getElementById('sa').nextElementSibling.style.height = 0
                document.getElementById('st').className = ''
                document.getElementById('st').nextElementSibling.style.height = 0
                document.getElementById('fa').className = ''
                document.getElementById('fa').nextElementSibling.style.height = 0
                document.getElementById('nr').className = ''
                document.getElementById('nr').nextElementSibling.style.height = 0
                document.getElementById('spt').className = 'tabs_target'
                document.getElementById('spt').nextElementSibling.style.height = 'auto'
                document.getElementById('sear').className = ''
                document.getElementById('sear').nextElementSibling.style.height = 0
            } else if (target.id === 'sear'){
                if (document.getElementById('sear').className === 'tabs_target'){
                    document.getElementById('sear').className = ''
                    document.getElementById('sear').nextElementSibling.style.height = 0
                    return
                }
                document.getElementById('playlistlist').className = ''
                document.getElementById('playlistlist').nextElementSibling.style.height = 0
                document.getElementById('ta').className = ''
                document.getElementById('ta').nextElementSibling.style.height = 0
                document.getElementById('tt').className = ''
                document.getElementById('tt').nextElementSibling.style.height = 0
                document.getElementById('sa').className = ''
                document.getElementById('sa').nextElementSibling.style.height = 0
                document.getElementById('st').className = ''
                document.getElementById('st').nextElementSibling.style.height = 0
                document.getElementById('fa').className = ''
                document.getElementById('fa').nextElementSibling.style.height = 0
                document.getElementById('nr').className = ''
                document.getElementById('nr').nextElementSibling.style.height = 0
                document.getElementById('spt').className = ''
                document.getElementById('spt').nextElementSibling.style.height = 0
                document.getElementById('sear').className = 'tabs_target'
                document.getElementById('sear').nextElementSibling.style.height = 'auto'
            }
        },
        switchArtist(context,payload){
            let num = payload.num
            if (num === 1){
                document.getElementById('topartist').style.display = 'flex'
                document.getElementById('topartists').className = 'activetab'
                document.getElementById('topartist6').style.display = 'none'
                document.getElementById('topartists6').className = ''
                document.getElementById('topartista').style.display = 'none'
                document.getElementById('topartistsall').className = ''
                this.commit('setTaactivetab',document.getElementById('topartist'))
            } else if (num === 2){
                document.getElementById('topartist').style.display = 'none'
                document.getElementById('topartists').className = ''
                document.getElementById('topartist6').style.display = 'flex'
                document.getElementById('topartists6').className = 'activetab'
                document.getElementById('topartista').style.display = 'none'
                document.getElementById('topartistsall').className = ''
                this.commit('setTaactivetab',document.getElementById('topartist6'))
            } else if (num === 3){
                document.getElementById('topartist').style.display = 'none'
                document.getElementById('topartists').className = ''
                document.getElementById('topartist6').style.display = 'none'
                document.getElementById('topartists6').className = ''
                document.getElementById('topartista').style.display = 'flex'
                document.getElementById('topartistsall').className = 'activetab'
                this.commit('setTaactivetab',document.getElementById('topartista'))
            }
        },
        switchTracks(context,payload){
            let num = payload.num
            if (num === 1){
                document.getElementById('toptrack').style.display = 'flex'
                document.getElementById('toptracks').className = 'activetab'
                document.getElementById('toptrack6').style.display = 'none'
                document.getElementById('toptrackssix').className = ''
                document.getElementById('toptrackall').style.display = 'none'
                document.getElementById('toptracksall').className = ''
                this.commit('setTtactivetab',document.getElementById('toptrack'))
            } else if (num === 2){
                document.getElementById('toptrack').style.display = 'none'
                document.getElementById('toptracks').className = ''
                document.getElementById('toptrack6').style.display = 'flex'
                document.getElementById('toptrackssix').className = 'activetab'
                document.getElementById('toptrackall').style.display = 'none'
                document.getElementById('toptracksall').className = ''
                this.commit('setTtactivetab',document.getElementById('toptrack6'))
            } else if (num === 3){
                document.getElementById('toptrack').style.display = 'none'
                document.getElementById('toptracks').className = ''
                document.getElementById('toptrack6').style.display = 'none'
                document.getElementById('toptrackssix').className = ''
                document.getElementById('toptrackall').style.display = 'flex'
                document.getElementById('toptracksall').className = 'activetab'
                this.commit('setTtactivetab',document.getElementById('toptrackall'))
            }
        },
        fetchApi(context,payload){
            let event = payload.event
            if (event.target.parentElement.id === 'option3'){
                let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
                event.target.nextElementSibling.insertAdjacentHTML("afterbegin",div)
            } else {
                let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
                event.target.parentElement.nextElementSibling.insertAdjacentHTML("afterbegin",div)
            }
            axios.request({
                url:'https://api.spotify.com/v1/me/top/tracks?time_range=short_term',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    this.commit("setItems",response.data['items'])
                    document.getElementById("loader").remove()
                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('fetchApi', {event:event})
                            }
                        })
                    }
                })
        },
        fetchApi2(context,payload){
            let event = payload.event
            let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
            event.target.parentElement.nextElementSibling.insertAdjacentHTML("afterbegin",div)
            axios.request({
                url:'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    this.commit("setItemsM",response.data['items'])
                    document.getElementById("loader").remove()
                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('fetchApi2', {event:event})
                            }
                        })
                    }
                })
        },
        fetchApi3(context,payload){
            let event = payload.event
            let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
            event.target.parentElement.nextElementSibling.insertAdjacentHTML("afterbegin",div)
            axios.request({
                url:'https://api.spotify.com/v1/me/top/tracks?time_range=long_term',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    this.commit("setItemsL",response.data['items'])
                    document.getElementById("loader").remove()
                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('fetchApi3', {event:event})
                            }
                        })
                    }
                })
        },
        fetchAlbums(context,payload){
            let offset = payload.offset,
                event = payload.event
            let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
            event.target.nextElementSibling.insertAdjacentHTML("afterbegin",div)
            axios.request({
                url: 'https://api.spotify.com/v1/me/albums?offset=' + offset + '&limit=20',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    let items =response.data['items']
                    // console.log(items)
                    this.commit("setSavedAlbums",items)
                    document.getElementById("loader").remove()
                    if (response.data['items'].length > 0){
                        context.dispatch('fetchAlbums',{offset:offset += 20,event:event})
                    }
                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('fetchAlbums',{offset:offset += 20,event:event})
                            }
                        })
                    }
                })
        },
        fetchTracks(context,payload){
            let offset = payload.offset
            axios.request({
                url: 'https://api.spotify.com/v1/me/tracks?offset=' + offset + '&limit=50',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    this.commit("setSavedTracks",response.data['items'])
                    if (response.data['items'].length > 0){
                        // context.dispatch('fetchTracks',{offset:offset += 50})
                    }

                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('fetchTracks',{offset:offset})
                            }
                        })
                    }
                })
        },
        fetchNR(context,payload){
            let offset = payload.offset
            axios.request({
                url: 'https://api.spotify.com/v1/browse/new-releases?limit=20&offset=' + offset,
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    let newarr = []
                    let items = response.data['albums']['items']
                    // console.log('235' + items[0].id)
                    for (let i=0;i <  items.length;i++){
                        newarr.push(items[i].id)
                    }
                    if (offset <100) {
                        context.dispatch('getNewrelease',{newarr:newarr,offset:offset})
                    }
                })
                .catch(error =>{
                    // console.log(error)
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200 && offset <100){
                                context.dispatch('fetchNR',{offset:offset})
                            }
                        })
                    }
                })

        },
        getNewrelease(context,payload){
            let newarr = payload.newarr
            let offset = payload.offset
            axios.request({
                url:'https://api.spotify.com/v1/albums?ids=' + newarr ,
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) => {
                        // console.log('452 ' + this.newreleases)
                        // let old = this.newreleases
                        // old.push(response.data['albums'])
                    // old.push(response.data['items'])
                    this.commit("setNewReleases",response.data['albums'])
                    if (response.data['albums'].length > 0 && offset < 100){
                            context.dispatch('fetchNR',{offset:offset +=20})
                    }
                })
                .catch(error =>{
                    // console.log(error)
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('getNewrelease',{newarr:newarr,offset:offset})
                            }
                        })
                    }
                })
        },
        fetchFA(context){
            axios.request({
                url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then(async(response) =>{
                    let newarr = []
                    let items =response.data['artists']['items']
                    for await(let i of items){
                        // console.log('237 ' + items[i].id)
                        axios.request({
                            url:'https://api.spotify.com/v1/artists/' + i.id + '/top-tracks?market=UA&limit=10',
                            method: 'get',
                            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                        })
                            .then((response) =>{
                                let tracks = response.data['tracks']
                                if (tracks[0]['preview_url']){
                                    i.preview_url = tracks[0]['preview_url']
                                }
                                i.tracks = tracks
                                newarr.push(i)
                                if (i === items[items.length-1]){
                                    setTimeout(() => {
                                        this.commit("setFollowedArtists",newarr)
                                    },1000)
                                }
                            })
                    }
                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('fetchFA')
                            }
                        })
                    }
                })
        },
        fetchSpotPlaylists(context,payload){
            let offset = payload.offset
            axios.request({
                url:'https://api.spotify.com/v1/users/spotify/playlists?fields=items(name,id)&limit=50&offset=' + offset,
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    this.commit("setSpotPlaylists",response.data['items'])
                    // if (response.data['items'].length > 0){
                    //   this.fetchSpotPlaylists(offset+=50)
                    // }
                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('fetchSpotPlaylists',{offset:offset})
                            }
                        })
                    }
                })
        },
        SpotInit:function(context,payload){
            let event = payload.event
            // console.log('167'  + event.currentTarget.id)
            let id = event.currentTarget.id
            let allTracks = document.querySelectorAll("#sptplaylists > .rectrack > div");
            if (allTracks != null) {
                for (let i = 0; i < allTracks.length; i++) {
                    allTracks[i].style.display = 'none'
                }
            }
            let pl = document.querySelectorAll('#sptplaylists > div:not(.rectrack,.pl,.head,.sp)')
            for (let i=0;i <  pl.length;i++){
                pl[i].style.display = 'none'

            }
            if (document.getElementById('s'+ id)){
                document.getElementById('s'+ id).style.display = 'block'
                if (context.state.currentspl){
                    context.state.currentspl.className = 'hr-line-dashed'
                    this.commit('setCurrentSPl',document.getElementById(id))
                    context.state.currentspl.className = 'hr-line-dashed activetab'
                } else {
                    this.commit('setCurrentSPl',document.getElementById(id))
                    context.state.currentspl.className = 'hr-line-dashed activetab'
                }
                // setTimeout(() => {
                //   window.scrollTo({
                //     top:(document.getElementById('s'+ id)).offsetTop,
                //     behavior:'smooth'});
                // },10)
                return
            }
            axios.request({
                url:'https://api.spotify.com/v1/playlists/' + id,
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    // console.log(response.data)
                    let data = response.data
                    this.commit("setSptPlaylists",data)
                    //раскоментить
                    // axios.request({
                    //   url:'https://api.spotify.com/v1/playlists/'+ id + '/followers/contains?ids=' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                    //   method: 'get',
                    //   headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    // })
                    //     .then((response) =>{
                    //       data.followed = response.data[0]
                    //       this.sptplaylists.push(data)
                    //       if (this.currentspl){
                    //         this.currentspl.className = 'hr-line-dashed'
                    //         this.currentspl = document.getElementById(id)
                    //         this.currentspl.className = 'hr-line-dashed activetab'
                    //       } else {
                    //         this.currentspl = document.getElementById(id)
                    //         this.currentspl.className = 'hr-line-dashed activetab'
                    //       }
                    //     })


                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('s'+ id)).offsetTop,
                    //     behavior:'smooth'});
                    // },1000)
                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('SpotInit',{event:event})
                            }
                        })
                    }
                })
        },
        search(context,e){
            // console.log(window.location.href)
            clearTimeout(context.state.searchtimer)
            context.state.searchtimer = setTimeout(() => {
                let event = {}
                let target = {}
                target.id = 'sear'
                event.target = target
                context.dispatch('switchTabs',{event:event})


                if (e.target.value) {
                    let value = e.target.value
                    e.target.parentElement.nextElementSibling.children[0].children[0].innerText = value
                    // console.log(value)

                    axios.request({
                        url: 'https://api.spotify.com/v1/search/?q=' + value + '&type=album,artist,playlist,track&limit=5',
                        method: 'get',
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
                            this.commit('setTracks',response.data['tracks']['items'])

                            // console.log(albums)
                            // console.log(artists)
                            // console.log(playlists)
                            // console.log(response.data['tracks']['items'])
                            let albarr = []
                            for await (let i of albums) {
                                // console.log('237' + albums[i].id)
                                axios.request({
                                    url: 'https://api.spotify.com/v1/albums/' + i.id + '/tracks?market=UA&limit=10',
                                    method: 'get',
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
                                this.commit('setAlbums',albarr)
                            },2000)

                            let artarr = []
                            for await (let i of artists) {
                                // console.log('237' + artists[i].id)
                                axios.request({
                                    url: 'https://api.spotify.com/v1/artists/' + i.id + '/top-tracks?market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                                    method: 'get',
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
                                this.commit('setArtists',artarr)
                            },2000)

                            // console.log(this.artists)
                            let playlist = []
                            for await (let i of playlists) {
                                // console.log('237' + playlists[i].id)
                                axios.request({
                                    url: 'https://api.spotify.com/v1/playlists/' + i.id,
                                    method: 'get',
                                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                                })
                                    .then((response) => {
                                        // console.log(response.data['tracks'])
                                        let tracks = response.data['tracks']
                                        if (tracks['items'][0]['track']['preview_url']) {
                                            i.preview_url = tracks['items'][0]['track']['preview_url']
                                        }
                                        i.tracks = tracks
                                        playlist.push(i)

                                    })
                            }
                            setTimeout(() => {
                                this.commit('setSPlaylists',playlist)
                            },2000)

                            // console.log(this.splaylists)

                        }).catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                // console.log(response.data)
                                if (response.status === 200){
                                    context.dispatch('search',{e:e})
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
        refreshplaylists(context,payload){
            let rid = payload.rid
            // let value = rid
            // let refreshIcon = rid.replace('refresh_', 'icon_')
            // let refreshButton = document.getElementById(value)
            // refreshIcon.class("class", "refresh-start")
            // refreshButton.removeAttribute("class")
            // refreshButton.disabled = true
            let id = rid.replace('refresh_','')
            // refreshButton.setAttribute("class", "refresh-end")
            // refreshButton.disabled = false
            axios.request({
                url:'https://api.spotify.com/v1/playlists/' + id,
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    // console.log(response.data)
                    this.playinfo = []
                    this.commit("setPlayInfo",[])
                    this.commit("setPlayInfo",response.data)
                    this.commit('setPlaylists',response.data['tracks']['items'])
                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('refreshplaylists',{rid:rid})
                            }
                        })
                    }
                })
        },
        reloader(context,payload){
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
            if (num ===1){
                let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                document.querySelector('#yourplaylists > div.pl').insertAdjacentHTML("afterend",div)
                // console.log(document.getElementById('loader'))
                let nid = parent.id.replace('p','')
                // console.log(nid)
                // let sea = this.playlists.find((playlists) => {return playlists.id === nid})
                let sea = context.state.playlists.findIndex((playlists) => {return playlists.id === nid})
                context.state.playlists.splice(sea, 1)
                document.getElementById('p'+ nid).remove()
                // console.log(this.playlists)
                let test = {}
                let currentTarget = {}
                currentTarget.id = nid
                test.currentTarget = currentTarget
                // console.log(test)
                setTimeout(() => {
                    context.dispatch('fetchInit',{event:test})
                    document.getElementById("reloader").remove()
                },1000)
                // console.log(sea)
            } else if (num === 9){
                let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                document.querySelector('#sptplaylists > div.pl').insertAdjacentHTML("afterend",div)
                let nid = parent.id.replace('s','')
                // console.log(nid)
                let sea = context.state.sptplaylists.findIndex((sptplaylists) => {return sptplaylists.id === nid})
                context.state.sptplaylists.splice(sea, 1)
                let test = {}
                let currentTarget = {}
                currentTarget.id = nid
                test.currentTarget = currentTarget
                setTimeout(() => {
                    context.dispatch('SpotInit',{event:test})
                    document.getElementById("reloader").remove()
                },1000)
            }
            setTimeout(() => {
                target.className = 'refresh-end'
            },1000)
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
        reloadpl(context,payload){
            let event = payload.event
            let target = event.target
            target.className = 'refresh-start'
            this.commit('setListPlaylists',[],true)
            this.commit('setPlaylists',[])
            let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
            document.querySelector('#yourplaylists').insertAdjacentHTML("afterbegin",div)
            setTimeout(() => {
                let ne = {}
                ne.target = document.getElementById('playlistlist')
                context.dispatch('fetchPlaylists', {event:ne,offset:0})
                document.getElementById("reloader").remove()
                target.className = 'refresh-end'
            },1000)
        },
        reloadartists(context,payload){
            let num = payload.num,
                event = payload.event
            let target = event.target
            // console.log(target.previousSibling)
            target.className = 'refresh-start'
            if (num === 1){
                let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                document.querySelector('#topartist').insertAdjacentHTML("afterbegin",div)
                this.commit('setTopArtist',[])
                setTimeout(() => {
                    let event = {}
                    event.target = document.querySelector('#topartists')
                    context.dispatch('fetchArtist', {event:event})
                    document.getElementById("reloader").remove()
                    target.className = 'refresh-end'
                },1000)
            } else if (num === 2){
                this.commit('setTopArtist6',[])
                let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                document.querySelector('#topartist6').insertAdjacentHTML("afterbegin",div)
                setTimeout(() => {
                    let event = {}
                    event.target = document.querySelector('#topartists6')
                    context.dispatch('fetchArtist2', {event:event})
                    document.getElementById("reloader").remove()
                    target.className = 'refresh-end'
                },1000)
            } else if (num === 3){
                this.commit('setTopArtista',[])
                let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                document.querySelector('#topartista').insertAdjacentHTML("afterbegin",div)
                setTimeout(() => {
                    let event = {}
                    event.target = document.querySelector('#topartistsall')
                    this.fetchArtist3(event)
                    document.getElementById("reloader").remove()
                    target.className = 'refresh-end'
                },1000)
            } else if (num === 4){
                let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                document.querySelector('#topartist').insertAdjacentHTML("afterbegin",div)
                this.commit('setFollowedArtists',[])
                this.followedartists = []
                setTimeout(() => {
                    context.dispatch('fetchFA')
                    document.getElementById("reloader").remove()
                    target.className = 'refresh-end'
                },1000)

            }
            if (num === 1){
                document.getElementById('topartist').style.display = 'flex'
                document.getElementById('topartists').className = 'activetab'
                document.getElementById('topartist6').style.display = 'none'
                document.getElementById('topartists6').className = ''
                document.getElementById('topartista').style.display = 'none'
                document.getElementById('topartistsall').className = ''
                this.commit('setTaactivetab',document.getElementById('topartist'))
            } else if (num === 2){
                document.getElementById('topartist').style.display = 'none'
                document.getElementById('topartists').className = ''
                document.getElementById('topartist6').style.display = 'flex'
                document.getElementById('topartists6').className = 'activetab'
                document.getElementById('topartista').style.display = 'none'
                document.getElementById('topartistsall').className = ''
                this.commit('setTaactivetab',document.getElementById('topartist6'))
            } else if (num === 3){
                document.getElementById('topartist').style.display = 'none'
                document.getElementById('topartists').className = ''
                document.getElementById('topartist6').style.display = 'none'
                document.getElementById('topartists6').className = ''
                document.getElementById('topartista').style.display = 'flex'
                document.getElementById('topartistsall').className = 'activetab'
                this.commit('setTaactivetab',document.getElementById('topartista'))
            }
        },
        reloadtracks(context,payload){
            let num = payload.num,
                event = payload.event
            let target = event.target
            // console.log(target.previousSibling)
            target.className = 'refresh-start'
            if (num === 1){
                let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                document.querySelector('#toptrack').insertAdjacentHTML("afterbegin",div)
                this.commit('setItems',[])
                setTimeout(() => {
                    let event = {}
                    event.target = document.querySelector('#toptracks')
                    this.fetchApi(event)
                    document.getElementById("reloader").remove()
                    target.className = 'refresh-end'
                },1000)
            } else if (num === 2){
                this.commit('setItemsM',[])
                let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                document.querySelector('#toptrack6').insertAdjacentHTML("afterbegin",div)
                setTimeout(() => {
                    let event = {}
                    event.target = document.querySelector('#toptrackssix')
                    this.fetchApi2(event)
                    document.getElementById("reloader").remove()
                    target.className = 'refresh-end'
                },1000)
            } else if (num === 3){
                this.commit('setItemsL',[])
                let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
                document.querySelector('#toptrackall').insertAdjacentHTML("afterbegin",div)
                setTimeout(() => {
                    let event = {}
                    event.target = document.querySelector('#toptracksall')
                    this.fetchApi3(event)
                    document.getElementById("reloader").remove()
                    target.className = 'refresh-end'
                },1000)
            }
            if (num === 1){
                document.getElementById('toptrack').style.display = 'flex'
                document.getElementById('toptracks').className = 'activetab'
                document.getElementById('toptrack6').style.display = 'none'
                document.getElementById('toptrackssix').className = ''
                document.getElementById('toptrackall').style.display = 'none'
                document.getElementById('toptracksall').className = ''
                this.commit('setTtactivetab',document.getElementById('toptrack'))
            } else if (num === 2){
                document.getElementById('toptrack').style.display = 'none'
                document.getElementById('toptracks').className = ''
                document.getElementById('toptrack6').style.display = 'flex'
                document.getElementById('toptrackssix').className = 'activetab'
                document.getElementById('toptrackall').style.display = 'none'
                document.getElementById('toptracksall').className = ''
                this.commit('setTtactivetab',document.getElementById('toptrack6'))
            } else if (num === 3){
                document.getElementById('toptrack').style.display = 'none'
                document.getElementById('toptracks').className = ''
                document.getElementById('toptrack6').style.display = 'none'
                document.getElementById('toptrackssix').className = ''
                document.getElementById('toptrackall').style.display = 'flex'
                document.getElementById('toptracksall').className = 'activetab'
                this.commit('setTtactivetab',document.getElementById('toptrackall'))
            }
        },
        reloadSA(context,payload){
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
            if (num === 1){
                let sa = context.state.deeper1.findIndex((deeper1) => {return deeper1.id === id})
                context.state.deeper1.splice(sa, 9e9)
            } else if (num === 2){
                let sa = context.state.deeper2.findIndex((deeper2) => {return deeper2.id === id})
                context.state.deeper2.splice(sa, 9e9)
            } else if (num === 22){
                let sa = context.state.deeper22.findIndex((deeper22) => {return deeper22.id === id})
                context.state.deeper22.splice(sa, 9e9)
            } else if (num === 23){
                let sa = context.state.deeper23.findIndex((deeper23) => {return deeper23.id === id})
                context.state.deeper23.splice(sa, 9e9)
            } else if (num === 3){
                let sa = context.state.deeper3.findIndex((deeper3) => {return deeper3.id === id})
                context.state.deeper3.splice(sa, 1)
            } else if (num === 32){
                let sa = context.state.deeper32.findIndex((deeper32) => {return deeper32.id === id})
                context.state.deeper32.splice(sa, 9e9)
            } else if (num === 33){
                let sa = context.state.deeper33.findIndex((deeper33) => {return deeper33.id === id})
                context.state.deeper33.splice(sa, 9e9)
            } else if (num === 4){
                let sa = context.state.deeper4.findIndex((deeper4) => {return deeper4.id === id})
                context.state.deeper4.splice(sa, 9e9)
            } else if (num === 5){
                let sa = context.state.deeper5.findIndex((deeper5) => {return deeper5.id === id})
                context.state.deeper5.splice(sa, 9e9)
            } else if (num === 6){
                let sa = context.state.deeper6.findIndex((deeper6) => {return deeper6.id === id})
                context.state.deeper6.splice(sa, 9e9)
            } else if (num === 7){
                let sa = context.state.deeper7.findIndex((deeper7) => {return deeper7.id === id})
                context.state.deeper7.splice(sa, 9e9)
            } else if (num === 8){
                let sa = context.state.deeper8.findIndex((deeper8) => {return deeper8.id === id})
                context.state.deeper8.splice(sa, 9e9)
            }else if (num === 9){
                let sa = context.state.deeper9.findIndex((deeper9) => {return deeper9.id === id})
                context.state.deeper9.splice(sa, 9e9)
            } else if (num === 10){
                let sa = context.state.deepers.findIndex((deepers) => {return deepers.id === id})
                context.state.deepers.splice(sa, 9e9)
            }
            // console.log(id.replace('sa',''))
            axios.request({
                url: 'https://api.spotify.com/v1/recommendations?seed_artists=' + id.replace('sa','') + '&limit=50&offset=0&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                method: 'get',
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
                    if (num === 1){
                        let indexing = context.state.deeper1.indexOf(data)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit("setDeeper1",data)
                        }
                    } else if (num === 2){
                        let indexing = context.state.deeper2.indexOf(data)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit("setDeeper2",data)
                        }
                    } else if (num === 22){
                        let indexing = context.state.deeper22.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper22",data)
                        }
                    } else if (num === 23){
                        let indexing = context.state.deeper23.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper23",data)
                        }
                    } else if (num === 3){
                        let indexing = context.state.deeper3.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper3",data)
                        }
                    } else if (num === 32){
                        let indexing = context.state.deeper32.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper32",data)
                        }
                    } else if (num === 33){
                        let indexing = context.state.deeper33.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper33",data)
                        }
                    } else if (num === 4){
                        let indexing = context.state.deeper4.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper4",data)
                        }
                    } else if (num === 5){
                        let indexing = context.state.deeper5.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper5",data)
                        }
                    } else if (num === 6){
                        let indexing = context.state.deeper6.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper6",data)
                        }
                    } else if (num === 7){
                        let indexing = context.state.deeper7.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper7",data)
                        }
                    } else if (num === 8){
                        let indexing = context.state.deeper8.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper8",data)
                        }
                    }else if (num === 9){
                        let indexing = context.state.deeper9.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper9",data)
                        }
                    } else if (num === 10){
                        let indexing = context.state.deepers.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeepers",data)
                        }
                    }
                    setTimeout(() => {
                        window.scrollTo({
                            top:(document.getElementById(id)).offsetTop,
                            behavior:'smooth'});
                    }, 10);
                })
                .catch()
        },
        reloadST(context,payload){
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
            if (num === 1){
                let st = context.state.deeper1.findIndex((deeper1) => {return deeper1.id === id})
                context.state.deeper1.splice(st, 9e9)
                // this.deeper1.splice(st, 1)
            } else if (num === 2){
                let st = context.state.deeper2.findIndex((deeper2) => {return deeper2.id === id})
                context.state.deeper2.splice(st, 9e9)
            } else if (num === 22){
                let st = context.state.deeper22.findIndex((deeper22) => {return deeper22.id === id})
                context.state.deeper22.splice(st, 9e9)
            } else if (num === 23){
                let st = context.state.deeper23.findIndex((deeper23) => {return deeper23.id === id})
                context.state.deeper23.splice(st, 9e9)
            } else if (num === 3){
                let st = context.state.deeper3.findIndex((deeper3) => {return deeper3.id === id})
                context.state.deeper3.splice(st, 9e9)
            } else if (num === 32){
                let st = context.state.deeper32.findIndex((deeper32) => {return deeper32.id === id})
                context.state.deeper32.splice(st, 9e9)
            } else if (num === 33){
                let st = context.state.deeper33.findIndex((deeper33) => {return deeper33.id === id})
                context.state.deeper33.splice(st, 9e9)
            } else if (num === 4){
                let st = context.state.deeper4.findIndex((deeper4) => {return deeper4.id === id})
                context.state.deeper4.splice(st, 9e9)
            } else if (num === 5){
                let st = context.state.deeper5.findIndex((deeper5) => {return deeper5.id === id})
                context.state.deeper5.splice(st, 9e9)
            } else if (num === 6){
                let st = context.state.deeper6.findIndex((deeper6) => {return deeper6.id === id})
                context.state.deeper6.splice(st, 9e9)
            } else if (num === 7){
                let st = context.state.deeper7.findIndex((deeper7) => {return deeper7.id === id})
                context.state.deeper7.splice(st, 9e9)
            } else if (num === 8){
                let st = context.state.deeper8.findIndex((deeper8) => {return deeper8.id === id})
                context.state.deeper8.splice(st, 9e9)
            }else if (num === 9){
                let st = context.state.deeper9.findIndex((deeper9) => {return deeper9.id === id})
                context.state.deeper9.splice(st, 9e9)
            } else if (num === 10){
                let st = context.state.deepers.findIndex((deepers) => {return deepers.id === id})
                context.state.deepers.splice(st, 9e9)
            }
            // console.log(id.replace('st',''))
            axios.request({
                url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + id.replace('st','') + '&limit=50&offset=0&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) => {
                    let data = []
                    data.tracks = response.data['tracks']
                    data.type = 'seed_tracks'
                    data.id = id
                    data.name = name
                    // console.log(data)
                    if (num === 1){
                        let indexing = context.state.deeper1.indexOf(data)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit("setDeeper1",data)
                        }
                    } else if (num === 2){
                        let indexing = context.state.deeper2.indexOf(data)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit("setDeeper2",data)
                        }
                    } else if (num === 22){
                        let indexing = context.state.deeper22.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper22",data)
                        }
                    } else if (num === 23){
                        let indexing = context.state.deeper23.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper23",data)
                        }
                    } else if (num === 3){
                        let indexing = context.state.deeper3.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper3",data)
                        }
                    } else if (num === 32){
                        let indexing = context.state.deeper32.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper32",data)
                        }
                    } else if (num === 33){
                        let indexing = context.state.deeper33.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper33",data)
                        }
                    } else if (num === 4){
                        let indexing = context.state.deeper4.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper4",data)
                        }
                    } else if (num === 5){
                        let indexing = context.state.deeper5.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper5",data)
                        }
                    } else if (num === 6){
                        let indexing = context.state.deeper6.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper6",data)
                        }
                    } else if (num === 7){
                        let indexing = context.state.deeper7.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper7",data)
                        }
                    } else if (num === 8){
                        let indexing = context.state.deeper8.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper8",data)
                        }
                    }else if (num === 9){
                        let indexing = context.state.deeper9.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper9",data)
                        }
                    } else if (num === 10){
                        let indexing = context.state.deepers.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeepers",data)
                        }
                    }
                    setTimeout(() => {
                        window.scrollTo({
                            top:(document.getElementById(id)).offsetTop,
                            behavior:'smooth'});
                    }, 10);
                })
                .catch()
        },
        seedTracks(context, payload) {
            let pointer,
                item = payload.item,
                num = payload.num,
                sib = payload.sib,
                child = payload.child
            if (num === 1){
                pointer = 'yourplaylists'
            } else if (num === 2){
                pointer = 'topartist'
            } else if (num === 22){
                pointer = 'topartist6'
            } else if (num === 23){
                pointer = 'topartista'
            } else if (num === 3){
                pointer = 'toptrack'
            } else if (num === 32){
                pointer = 'toptrack6'
            } else if (num === 33){
                pointer = 'toptrackall'
            } else if (num === 4){
                pointer = 'savedalbum'
            } else if (num === 5){
                pointer = 'savedtrack'
            } else if (num === 6){
                pointer = 'followedartist'
            } else if (num === 7){
                pointer = 'newrelease'
            } else if (num === 9){
                pointer = 'sptplaylists'
            } else if (num === 10){
                pointer = 'search'
            }
            // console.log(item)
            let alltop = document.querySelectorAll('#'+ pointer+ '> .rectrack > div.' + sib)
            // console.log(alltop)
            // console.log(sib)
            // console.log(child)
            if (child){
                let par = document.getElementById(child).nextElementSibling
                // console.log(par)
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }} else if (sib!==false && alltop[alltop.length-1].nextElementSibling!== null) {
                let par = alltop[alltop.length-1].nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }
            }
            if(document.getElementById('st'+item.id)){
                document.getElementById('st'+item.id).style.display = 'flex'
                // setTimeout(() => {
                //   window.scrollTo({
                //     top:(document.getElementById('st'+ item.id)).offsetTop,
                //     behavior:'smooth'});
                // }, 10);
                return
            }
            axios.request({
                url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + item['id'] + '&limit=50&offset=0&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) => {
                    let data = []
                    // console.log(response.data['tracks'])
                    data.tracks = response.data['tracks']
                    data.type = 'seed_tracks'
                    data.id = 'st' + item.id
                    data.name = item.name
                    // console.log(data)
                    if (num === 1){
                        let indexing = context.state.deeper1.indexOf(data)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit("setDeeper1",data)
                        }
                    } else if (num === 2){
                        let indexing = context.state.deeper2.indexOf(data)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit("setDeeper2",data)
                        }
                    } else if (num === 22){
                        let indexing = context.state.deeper22.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper22",data)
                        }
                    } else if (num === 23){
                        let indexing = context.state.deeper23.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper23",data)
                        }
                    } else if (num === 3){
                        let indexing = context.state.deeper3.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper3",data)
                        }
                    } else if (num === 32){
                        let indexing = context.state.deeper32.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper32",data)
                        }
                    } else if (num === 33){
                        let indexing = context.state.deeper33.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper33",data)
                        }
                    } else if (num === 4){
                        let indexing = context.state.deeper4.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper4",data)
                        }
                    } else if (num === 5){
                        let indexing = context.state.deeper5.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper5",data)
                        }
                    } else if (num === 6){
                        let indexing = context.state.deeper6.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper6",data)
                        }
                    } else if (num === 7){
                        let indexing = context.state.deeper7.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper7",data)
                        }
                    } else if (num === 8){
                        let indexing = context.state.deeper8.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper8",data)
                        }
                    }else if (num === 9){
                        let indexing = context.state.deeper9.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper9",data)
                        }
                    } else if (num === 10){
                        let indexing = context.state.deepers.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeepers",data)
                        }
                    }
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('st'+ item.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                })
                .catch()
        },
        seedTracksM(context,payload) {
            let pointer,
                item = payload.item,
                num = payload.num,
                sib = payload.sib,
                child = payload.child,
                parent = payload.parent
            if (num === 1){
                pointer = 'yourplaylists'
            } else if (num === 2){
                pointer = 'topartist'
            } else if (num === 22){
                pointer = 'topartist6'
            } else if (num === 23){
                pointer = 'topartista'
            } else if (num === 3){
                pointer = 'toptrack'
            } else if (num === 32){
                pointer = 'toptrack6'
            } else if (num === 33){
                pointer = 'toptrackall'
            } else if (num === 4){
                pointer = 'savedalbum'
            } else if (num === 5){
                pointer = 'savedtrack'
            } else if (num === 6){
                pointer = 'followedartist'
            } else if (num === 7){
                pointer = 'newrelease'
            } else if (num === 9){
                pointer = 'sptplaylists'
            } else if (num === 10){
                pointer = 'search'
            }
            let alltop = document.querySelectorAll('#'+ pointer+ '> .rectrack > div.' + sib)
            // console.log(alltop)
            // console.log(sib)
            // console.log(child)
            if (child){
                let par = document.getElementById(child).nextElementSibling
                // console.log(par)
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }} else if (sib!==false && alltop[alltop.length-1].nextElementSibling!== null) {
                let par = alltop[alltop.length-1].nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }
            }
            if(document.getElementById('st'+item.id)){
                document.getElementById('st'+item.id).style.display = 'flex'
                if (num === 3 || num === 32 || num === 33 || num === 7){
                    setTimeout(async () => {
                        let target = document.getElementById(parent.id)

                        // console.log(target.children[1])
                        let lst = target.children[1].children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                    },0)
                } else if (num === 5) {
                    setTimeout(async () => {
                        let target = document.getElementById(parent.id)

                        // console.log(target.children[1])
                        let lst = target.children[1].children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                    },0)
                } else {
                    setTimeout(async () => {
                        let target = document.getElementById(parent.id)

                        // console.log(target.nextElementSibling)
                        let lst = target.nextElementSibling.children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        if (num === 4){
                            target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 300 + 'px'
                        } else {
                            target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                        }
                    },0)
                }
                return
            }
            axios.request({
                url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + item['id'] + '&limit=50&offset=0&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) => {
                    let data = []
                    // console.log(response.data['tracks'])
                    data.tracks = response.data['tracks']
                    data.type = 'seed_tracks'
                    data.id = 'st' + item.id
                    data.name = item.name
                    data.pid = parent.id
                    // console.log(data)
                    if (num === 1){
                        let indexing = context.state.deeper1.indexOf(data)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit("setDeeper1",data)
                        }
                    } else if (num === 2){
                        let indexing = context.state.deeper2.indexOf(data)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit("setDeeper2",data)
                        }
                    } else if (num === 22){
                        let indexing = context.state.deeper22.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper22",data)
                        }
                    } else if (num === 23){
                        let indexing = context.state.deeper23.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper23",data)
                        }
                    } else if (num === 3){
                        let indexing = context.state.deeper3.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper3",data)
                        }
                    } else if (num === 32){
                        let indexing = context.state.deeper32.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper32",data)
                        }
                    } else if (num === 33){
                        let indexing = context.state.deeper33.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper33",data)
                        }
                    } else if (num === 4){
                        let indexing = context.state.deeper4.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper4",data)
                        }
                    } else if (num === 5){
                        let indexing = context.state.deeper5.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper5",data)
                        }
                    } else if (num === 6){
                        let indexing = context.state.deeper6.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper6",data)
                        }
                    } else if (num === 7){
                        let indexing = context.state.deeper7.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper7",data)
                        }
                    } else if (num === 8){
                        let indexing = context.state.deeper8.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper8",data)
                        }
                    }else if (num === 9){
                        let indexing = context.state.deeper9.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper9",data)
                        }
                    } else if (num === 10){
                        let indexing = context.state.deepers.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeepers",data)
                        }
                    }
                    if (num === 3 || num === 32 || num === 33 || num === 7){
                        setTimeout(async () => {
                            let target = document.getElementById(parent.id)

                            // console.log(target.children[1])
                            let lst = target.children[1].children[0].children
                            // console.log(lst)
                            let newarray = []
                            for await(let i of lst) {
                                // console.log(i)
                                newarray.push(i.offsetHeight)
                            }
                            // console.log(newarray.reduce((a, b) => a + b, 0))
                            target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                        },0)
                    } else if (num === 5 ) {
                        setTimeout(async () => {
                            let target = document.getElementById(parent.id)

                            // console.log(target.children[1])
                            let lst = target.children[1].children[0].children
                            // console.log(lst)
                            let newarray = []
                            for await(let i of lst) {
                                // console.log(i)
                                newarray.push(i.offsetHeight)
                            }
                            // console.log(newarray.reduce((a, b) => a + b, 0))
                            target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                        },0)
                    }else {
                        if (num === 2 || num === 22 || num === 23 || num === 4 || num === 6){
                            setTimeout(async () => {
                                let target = document.getElementById(parent.id)

                                // console.log(target.children[1])
                                let lst = target.children[1].children[0].children
                                // console.log(lst)
                                let newarray = []
                                for await(let i of lst) {
                                    // console.log(i)
                                    newarray.push(i.offsetHeight)
                                }
                                // console.log(newarray.reduce((a, b) => a + b, 0))
                                target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                            },0)
                        } else {
                            setTimeout(async () => {
                                // console.log(parent.id)
                                let target = document.getElementById(parent.id)

                                // console.log(target.nextElementSibling)
                                let lst = target.nextElementSibling.children[0].children
                                // console.log(lst)
                                let newarray = []
                                for await(let i of lst) {
                                    // console.log(i)
                                    newarray.push(i.offsetHeight)
                                }
                                // console.log(newarray.reduce((a, b) => a + b, 0))
                                target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                            },0)
                        }

                    }
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('st'+ item.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                })
                .catch()
        },
        deeperTracks(context, payload){
            let item = payload.item,
                num = payload.num,
                flag = payload.flag,
                sib = payload.sib,
                child = payload.child,
                pointer
            item.type ='deepertracks'
            // console.log(item)
            // console.log(flag)
            // console.log(sib)
            if (num === 1){
                pointer = 'yourplaylists'
            } else if (num === 2){
                pointer = 'topartist'
            } else if (num === 22){
                pointer = 'topartist6'
            } else if (num === 23){
                pointer = 'topartista'
            } else if (num === 3){
                pointer = 'toptrack'
            } else if (num === 32){
                pointer = 'toptrack6'
            } else if (num === 33){
                pointer = 'toptrackall'
            } else if (num === 4){
                pointer = 'savedalbum'
            } else if (num === 5){
                pointer = 'savedtrack'
            } else if (num === 6){
                pointer = 'followedartist'
            } else if (num === 7){
                pointer = 'newrelease'
            } else if (num === 9){
                pointer = 'sptplaylists'
            } else if (num === 10){
                pointer = 'search'
            }
            let all = document.querySelectorAll('#'+ pointer +'> .rectrack > div')
            if (child){
                let par = document.getElementById(child).parentElement.nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }}else if (sib) {
                let alltop = document.querySelectorAll('#'+ pointer +'> .rectrack > div.' + sib)
                let current = alltop[alltop.length-1].nextElementSibling
                while (current != null) {
                    // console.log(current)
                    current.style.display = 'none'
                    if (current.nextElementSibling !== null && current.nextElementSibling.style.display !== 'none'){
                        current = current.nextElementSibling
                    } else if (current.nextElementSibling !== null && current.nextElementSibling.style.display === 'none'){
                        current = current.nextElementSibling.nextElementSibling
                    } else if (current.nextElementSibling === null){
                        current = null
                    }

                }
                let newall = Array.from(all)
                let track = newall.indexOf(document.getElementById('d'+item.id))
                let album = newall.indexOf(alltop[alltop.length-1])
                // console.log(track)
                if (track!== -1 && track < album){
                    alltop[alltop.length-1].insertAdjacentElement('afterend', document.getElementById('d'+item.id));
                    // all.parentNode.insertBefore(newall[album],newall[track])
                }} else  if (flag === true){
                if (all.length !==0 && all.length !==0){
                    for (let i=0;i < all.length;i++){
                        all[i].style.display = 'none'
                    }
                }}
            if (document.getElementById('d'+item.id)){
                document.getElementById('d'+item.id).style.display = 'flex'
                // setTimeout(() => {
                //   window.scrollTo({
                //     top:(document.getElementById('d'+ item.id)).offsetTop,
                //     behavior:'smooth'});
                // }, 10);
                return
            }
            axios.request({
                url:'https://api.spotify.com/v1/me/tracks/contains?ids=' + item.id,
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    item.followed = response.data[0]
                })
                .catch(error =>{
                    if (error.response.status === 401){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.state.deeperTracks(pointer,item,num,flag,sib,child)
                            }
                        })
                    }
                })
            if (num === 1){
                let indexing = context.state.deeper1.indexOf(item)
                if (indexing === -1){
                    // eslint-disable-next-line no-undef
                    this.commit("setDeeper1",item)
                }
            } else if (num === 2){
                let indexing = context.state.deeper2.indexOf(item)
                if (indexing === -1){
                    // eslint-disable-next-line no-undef
                    this.commit("setDeeper2",item)
                }
            } else if (num === 22){
                let indexing = context.state.deeper22.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper22",item)
                }
            } else if (num === 23){
                let indexing = context.state.deeper23.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper23",item)
                }
            } else if (num === 3){
                let indexing = context.state.deeper3.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper3",item)
                }
            } else if (num === 32){
                let indexing = context.state.deeper32.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper32",item)
                }
            } else if (num === 33){
                let indexing = context.state.deeper33.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper33",item)
                }
            } else if (num === 4){
                let indexing = context.state.deeper4.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper4",item)
                }
            } else if (num === 5){
                let indexing = context.state.deeper5.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper5",item)
                }
            } else if (num === 6){
                let indexing = context.state.deeper6.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper6",item)
                }
            } else if (num === 7){
                let indexing = context.state.deeper7.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper7",item)
                }
            } else if (num === 8){
                let indexing = context.state.deeper8.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper8",item)
                }
            }else if (num === 9){
                let indexing = context.state.deeper9.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper9",item)
                }
            } else if (num === 10){
                let indexing = context.state.deepers.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeepers",item)
                }
            }
            // setTimeout(() => {
            //   window.scrollTo({
            //     top:(document.getElementById('alb'+ item.id)).offsetTop,
            //     behavior:'smooth'});
            // }, 10);
        },
        deeperTracks2(context,payload){
        let pointer,
        item = payload.item,
        d = payload.d,
        num = payload.num,
        // flag = payload.flag,
        sib = payload.sib,
        child = payload.child
            if (num === 1){
                pointer = 'yourplaylists'
            } else if (num === 2){
                pointer = 'topartist'
            } else if (num === 22){
                pointer = 'topartist6'
            } else if (num === 23){
                pointer = 'topartista'
            } else if (num === 3){
                pointer = 'toptrack'
            } else if (num === 32){
                pointer = 'toptrack6'
            } else if (num === 33){
                pointer = 'toptrackall'
            } else if (num === 4){
                pointer = 'savedalbum'
            } else if (num === 5){
                pointer = 'savedtrack'
            } else if (num === 6){
                pointer = 'followedartist'
            } else if (num === 7){
                pointer = 'newrelease'
            } else if (num === 9){
                pointer = 'sptplaylists'
            } else if (num === 10){
                pointer = 'search'
            }
            item.images = d.images
            item.type ='deepertracks2'
            let all = document.querySelectorAll('#'+ pointer + '> .rectrack > div')
            if (child){
                let par = document.getElementById(child).parentElement.nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }}else if (sib) {
                let alltop = document.querySelectorAll('#'+ pointer + '> .rectrack > div.' + sib)
                // console.log(pointer)
                // console.log(sib)
                // console.log(alltop)
                let current = alltop[alltop.length-1].nextElementSibling
                while (current != null) {
                    // console.log(current)
                    current.style.display = 'none'
                    if (current.nextElementSibling !== null && current.nextElementSibling.style.display !== 'none'){
                        current = current.nextElementSibling
                    } else if (current.nextElementSibling !== null && current.nextElementSibling.style.display === 'none'){
                        current = current.nextElementSibling.nextElementSibling
                    } else if (current.nextElementSibling === null){
                        current = null
                    }

                }
                let newall = Array.from(all)
                let track = newall.indexOf(document.getElementById('d'+item.id))
                let album = newall.indexOf(alltop[alltop.length-1])
                // console.log(track)
                if (track!== -1 && track < album){
                    alltop[alltop.length-1].insertAdjacentElement('afterend', document.getElementById('d'+item.id));
                    // all.parentNode.insertBefore(newall[album],newall[track])
                }}
            if (document.getElementById('d'+item.id)){
                document.getElementById('d'+item.id).style.display = 'flex'
                // setTimeout(() => {
                //   window.scrollTo({
                //     top:(document.getElementById('d'+ item.id)).offsetTop,
                //     behavior:'smooth'});
                // }, 10);
                return
            }
            if (num === 1){
                let indexing = context.state.deeper1.indexOf(item)
                if (indexing === -1){
                    // eslint-disable-next-line no-undef
                    this.commit("setDeeper1",item)
                }
            } else if (num === 2){
                let indexing = context.state.deeper2.indexOf(item)
                if (indexing === -1){
                    // eslint-disable-next-line no-undef
                    this.commit("setDeeper2",item)
                }
            } else if (num === 22){
                let indexing = context.state.deeper22.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper22",item)
                }
            } else if (num === 23){
                let indexing = context.state.deeper23.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper23",item)
                }
            } else if (num === 3){
                let indexing = context.state.deeper3.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper3",item)
                }
            } else if (num === 32){
                let indexing = context.state.deeper32.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper32",item)
                }
            } else if (num === 33){
                let indexing = context.state.deeper33.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper33",item)
                }
            } else if (num === 4){
                let indexing = context.state.deeper4.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper4",item)
                }
            } else if (num === 5){
                let indexing = context.state.deeper5.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper5",item)
                }
            } else if (num === 6){
                let indexing = context.state.deeper6.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper6",item)
                }
            } else if (num === 7){
                let indexing = context.state.deeper7.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper7",item)
                }
            } else if (num === 8){
                let indexing = context.state.deeper8.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper8",item)
                }
            }else if (num === 9){
                let indexing = context.state.deeper9.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper9",item)
                }
            } else if (num === 10){
                let indexing = context.state.deepers.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeepers",item)
                }
            }
            // setTimeout(() => {
            //   window.scrollTo({
            //     top:(document.getElementById('d'+ item.id)).offsetTop,
            //     behavior:'smooth'});
            // }, 10);
        },
        deeperTracksM: async function(context,payload){
            let item = payload.item,
                num = payload.num,
                flag = payload.flag,
                sib = payload.sib,
                child = payload.child,
                parent = payload.parent
            // console.log(item)
            item.type ='deepertracks'
            item.pid = parent.id
            let all = document.querySelectorAll('.item-container > .rectrack > div.hcontent > div')
            if (child){
                let par = document.getElementById(child).parentElement.nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }}else if (sib) {
                let alltop = document.querySelectorAll('.item-container > .rectrack > div.hcontent > div.' + sib)
                let current = alltop[alltop.length-1].nextElementSibling
                while (current != null) {
                    // console.log(current)
                    current.style.display = 'none'
                    if (current.nextElementSibling !== null && current.nextElementSibling.style.display !== 'none'){
                        current = current.nextElementSibling
                    } else if (current.nextElementSibling !== null && current.nextElementSibling.style.display === 'none'){
                        current = current.nextElementSibling.nextElementSibling
                    } else if (current.nextElementSibling === null){
                        current = null
                    }

                }
                let newall = Array.from(all)
                let track = newall.indexOf(document.getElementById('d'+item.id))
                let album = newall.indexOf(alltop[alltop.length-1])
                // console.log(track)
                if (track!== -1 && track < album){
                    alltop[alltop.length-1].insertAdjacentElement('afterend', document.getElementById('d'+item.id));
                    // all.parentNode.insertBefore(newall[album],newall[track])
                }} else  if (flag === true){
                if (all.length !==0 && all.length !==0){
                    for (let i=0;i < all.length;i++){
                        all[i].style.display = 'none'
                    }
                }}
            if (document.getElementById('d'+item.id)){
                document.getElementById('d'+item.id).style.display = 'flex'
                if (num === 3 || num === 32 || num === 33 || num === 7 || num === 2 || num === 22 || num === 23 || num === 6){
                    setTimeout(async () => {
                        let target = document.getElementById(parent.id)

                        // console.log(target.children[1])
                        let lst = target.children[1].children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                    },0)
                } else if (num === 5) {
                    setTimeout(async () => {
                        let target = document.getElementById(parent.id)

                        // console.log(target.children[1])
                        let lst = target.children[1].children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                    },0)
                }else{
                    setTimeout(async () => {
                        let target = document.getElementById(parent.id)

                        // console.log(target.nextElementSibling)
                        let lst = target.nextElementSibling.children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                    },0)
                }
                return
            }
            await axios.request({
                url:'https://api.spotify.com/v1/me/tracks/contains?ids=' + item.id,
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    item.followed = response.data[0]
                })
                .catch(error =>{
                    if (error.response.status === 401){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('deeperTracksM',{item:item,num:num,flag:flag,sib:sib,child:child,parent:parent})
                            }
                        })
                    }
                })
            if (num === 1){
                let indexing = context.state.deeper1.indexOf(item)
                if (indexing === -1){
                    // eslint-disable-next-line no-undef
                    this.commit("setDeeper1",item)
                }
            } else if (num === 2){
                let indexing = context.state.deeper2.indexOf(item)
                if (indexing === -1){
                    // eslint-disable-next-line no-undef
                    this.commit("setDeeper2",item)
                }
            } else if (num === 22){
                let indexing = context.state.deeper22.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper22",item)
                }
            } else if (num === 23){
                let indexing = context.state.deeper23.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper23",item)
                }
            } else if (num === 3){
                let indexing = context.state.deeper3.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper3",item)
                }
            } else if (num === 32){
                let indexing = context.state.deeper32.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper32",item)
                }
            } else if (num === 33){
                let indexing = context.state.deeper33.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper33",item)
                }
            } else if (num === 4){
                let indexing = context.state.deeper4.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper4",item)
                }
            } else if (num === 5){
                let indexing = context.state.deeper5.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper5",item)
                }
            } else if (num === 6){
                let indexing = context.state.deeper6.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper6",item)
                }
            } else if (num === 7){
                let indexing = context.state.deeper7.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper7",item)
                }
            } else if (num === 8){
                let indexing = context.state.deeper8.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper8",item)
                }
            }else if (num === 9){
                let indexing = context.state.deeper9.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper9",item)
                }
            } else if (num === 10){
                let indexing = context.state.deepers.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeepers",item)
                }
            }
            if (num !==2 && num !==22 && num!==23 && num!==6 && num !==3 && num!==32 && num!==33 && num !==5 && num !== 7 && num !== 4){
                setTimeout(async () => {
                    // console.log(parent.id)
                    let target = document.getElementById(parent.id)

                    // console.log(target.nextElementSibling)
                    let lst = target.nextElementSibling.children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                },0)
            } else if (num === 3 || num === 32 || num === 33 || num === 7 || num === 4 || num === 6){
                setTimeout(async () => {
                    let target = document.getElementById(parent.id)

                    // console.log(target.children[1])
                    let lst = target.children[1].children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                },0)
            } else if (num === 5) {
                setTimeout(async () => {
                    let target = document.getElementById(parent.id)

                    // console.log(target.children[1])
                    let lst = target.children[1].children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                },0)
            }else {
                setTimeout(async () => {
                    let target = document.getElementById(parent.id)

                    // console.log(target.children[0])
                    let lst = target.children[0].nextElementSibling.children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                },0)
            }
        },
        deeperTracks2M(context,payload){
            let item = payload.item,
                d = payload.d,
                num = payload.num,
                sib = payload.sib,
                child = payload.child,
                parent = payload.parent
            item.images = d.images
            item.type ='deepertracks2'
            item.pid = parent.id
            let all = document.querySelectorAll('.item-container > .rectrack > div.hcontent > div')
            if (child){
                let par = document.getElementById(child).parentElement.nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }}else if (sib) {
                let alltop = document.querySelectorAll(' .item-container > .rectrack > div.hcontent > div.' + sib)
                let current = alltop[alltop.length-1].nextElementSibling
                while (current != null) {
                    current.style.display = 'none'
                    if (current.nextElementSibling !== null && current.nextElementSibling.style.display !== 'none'){
                        current = current.nextElementSibling
                    } else if (current.nextElementSibling !== null && current.nextElementSibling.style.display === 'none'){
                        current = current.nextElementSibling.nextElementSibling
                    } else if (current.nextElementSibling === null){
                        current = null
                    }

                }
                let newall = Array.from(all)
                let track = newall.indexOf(document.getElementById('d'+item.id))
                let album = newall.indexOf(alltop[alltop.length-1])
                if (track!== -1 && track < album){
                    alltop[alltop.length-1].insertAdjacentElement('afterend', document.getElementById('d'+item.id));
                }}
            if (document.getElementById('d'+item.id)){
                document.getElementById('d'+item.id).style.display = 'flex'
                setTimeout(async () => {
                    let target = document.getElementById(parent.id)

                    // console.log(target.nextElementSibling)
                    let lst = target.nextElementSibling.children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                },0)
                return
            }
            if (num === 1){
                let indexing = context.state.deeper1.indexOf(item)
                if (indexing === -1){
                    this.commit("setDeeper1",item)
                    setTimeout(async () => {
                        let target = document.getElementById(parent.id)

                        // console.log(target.nextElementSibling)
                        let lst = target.nextElementSibling.children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                    },0)
                }
            } else if (num === 2){
                    let indexing = context.state.deeper2.indexOf(item)
                    if (indexing === -1){
                        // eslint-disable-next-line no-undef
                        this.commit("setDeeper2",item)
                    }
                } else if (num === 22){
                    let indexing = context.state.deeper22.indexOf(item)
                    if (indexing === -1){
                        this.commit("setDeeper22",item)
                    }
                } else if (num === 23){
                    let indexing = context.state.deeper23.indexOf(item)
                    if (indexing === -1){
                        this.commit("setDeeper23",item)
                    }
                } else if (num === 3){
                    let indexing = context.state.deeper3.indexOf(item)
                    if (indexing === -1){
                        this.commit("setDeeper3",item)
                    }
                } else if (num === 32){
                    let indexing = context.state.deeper32.indexOf(item)
                    if (indexing === -1){
                        this.commit("setDeeper32",item)
                    }
                } else if (num === 33){
                    let indexing = context.state.deeper33.indexOf(item)
                    if (indexing === -1){
                        this.commit("setDeeper33",item)
                    }
                } else if (num === 4){
                    let indexing = context.state.deeper4.indexOf(item)
                    if (indexing === -1){
                        this.commit("setDeeper4",item)
                    }
                } else if (num === 5){
                    let indexing = context.state.deeper5.indexOf(item)
                    if (indexing === -1){
                        this.commit("setDeeper5",item)
                    }
                } else if (num === 6){
                    let indexing = context.state.deeper6.indexOf(item)
                    if (indexing === -1){
                        this.commit("setDeeper6",item)
                    }
                } else if (num === 7){
                    let indexing = context.state.deeper7.indexOf(item)
                    if (indexing === -1){
                        this.commit("setDeeper7",item)
                    }
                } else if (num === 8){
                    let indexing = context.state.deeper8.indexOf(item)
                    if (indexing === -1){
                        this.commit("setDeeper8",item)
                    }
                }else if (num === 9){
                    let indexing = context.state.deeper9.indexOf(item)
                    if (indexing === -1){
                        this.commit("setDeeper9",item)
                    }
                } else if (num === 10){
                    let indexing = context.state.deepers.indexOf(item)
                    if (indexing === -1){
                        this.commit("setDeepers",item)
                    }
                }

            if (num !== 1 && num !==5 && num !==2 && num !==22 && num !== 23 && num !== 3 && num !==32 && num !== 33 && num !== 4 && num !== 6 && num !== 7){
                setTimeout(async () => {
                    let target = document.getElementById(parent.id)

                    // console.log(target.children[1])
                    let lst = target.parentElement.children[1].children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(target.parentElement.children[1])
                    // console.log(target.parentElement.children[1].style.height)
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.parentElement.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                    // console.log(target.parentElement.children[1].style.height)
                },0)
            } else if (num === 2 || num === 22|| num === 23 || num === 3 || num === 32 || num === 33 || num === 4 || num === 5 || num === 6 || num === 7){
                setTimeout(async () => {
                    let target = document.getElementById(parent.id)

                    // console.log(target.children[1])
                    let lst = target.children[1].children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                },0)
            } else {
                setTimeout(async () => {
                    // console.log(parent.track.id)
                    // console.log(parent.id)
                    let target = document.getElementById(parent.id)
                    document.getElementById(parent.track.id)
                    // console.log(target.children[1])
                    let lst = target.parentElement.children[1].children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.parentElement.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                },0)
            }
        },
        seedArtist(context,payload) {
            let pointer,
                item = payload.item,
                num = payload.num,
                sib = payload.sib,
                child = payload.child
            if (num === 1){
                pointer = 'yourplaylists'
            } else if (num === 2){
                pointer = 'topartist'
            } else if (num === 22){
                pointer = 'topartist6'
            } else if (num === 23){
                pointer = 'topartista'
            } else if (num === 3){
                pointer = 'toptrack'
            } else if (num === 32){
                pointer = 'toptrack6'
            } else if (num === 33){
                pointer = 'toptrackall'
            } else if (num === 4){
                pointer = 'savedalbum'
            } else if (num === 5){
                pointer = 'savedtrack'
            } else if (num === 6){
                pointer = 'followedartist'
            } else if (num === 7){
                pointer = 'newrelease'
            } else if (num === 9){
                pointer = 'sptplaylists'
            } else if (num === 10){
                pointer = 'search'
            }
            let alltop = document.querySelectorAll('#'+ pointer +'> .rectrack > div.' + sib)
            // console.log(child)
            if (child){
                let par = document.getElementById(child).parentElement.nextElementSibling
                // console.log(par)
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }} else if (sib!==false && alltop[alltop.length-1].nextElementSibling!== null) {
                let par = alltop[alltop.length-1].nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }
            }
            if(document.getElementById('sa'+item.id)){
                document.getElementById('sa'+item.id).style.display = 'flex'
                // setTimeout(() => {
                //   window.scrollTo({
                //     top:(document.getElementById('sa'+ item.id)).offsetTop,
                //     behavior:'smooth'});
                // }, 10);
                return
            }
            axios.request({
                url: 'https://api.spotify.com/v1/recommendations?seed_artists=' + item['id'] + '&limit=50&offset=0&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) => {
                    let data = []
                    data.tracks = response.data['tracks']
                    data.type = 'seed_artists'
                    data.id = 'sa' + item.id
                    data.name = item.name
                    // console.log(data)
                    if (num === 1){
                        let indexing = context.state.deeper1.indexOf(data)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit("setDeeper1",data)
                        }
                    } else if (num === 2){
                        let indexing = context.state.deeper2.indexOf(data)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit("setDeeper2",data)
                        }
                    } else if (num === 22){
                        let indexing = context.state.deeper22.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper22",data)
                        }
                    } else if (num === 23){
                        let indexing = context.state.deeper23.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper23",data)
                        }
                    } else if (num === 3){
                        let indexing = context.state.deeper3.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper3",data)
                        }
                    } else if (num === 32){
                        let indexing = context.state.deeper32.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper32",data)
                        }
                    } else if (num === 33){
                        let indexing = context.state.deeper33.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper33",data)
                        }
                    } else if (num === 4){
                        let indexing = context.state.deeper4.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper4",data)
                        }
                    } else if (num === 5){
                        let indexing = context.state.deeper5.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper5",data)
                        }
                    } else if (num === 6){
                        let indexing = context.state.deeper6.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper6",data)
                        }
                    } else if (num === 7){
                        let indexing = context.state.deeper7.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper7",data)
                        }
                    } else if (num === 8){
                        let indexing = context.state.deeper8.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper8",data)
                        }
                    }else if (num === 9){
                        let indexing = context.state.deeper9.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper9",data)
                        }
                    } else if (num === 10){
                        let indexing = context.state.deepers.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeepers",data)
                        }
                    }
                    // setTimeout(() => {
                    //   window.scrollTo({
                    //     top:(document.getElementById('sa'+ item.id)).offsetTop,
                    //     behavior:'smooth'});
                    // }, 10);
                })
                .catch()
        },
        seedArtistM(context,payload) {
            let item = payload.item,
                num =payload.num,
                sib =payload.sib,
                child = payload.child,
                parent = payload.parent
            let alltop = document.querySelectorAll(' .item-container > .rectrack > div.hcontent > div.' + sib)
            // console.log(child)
            if (child){
                let par = document.getElementById(child).parentElement.nextElementSibling
                // console.log(par)
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }} else if (sib!==false && alltop[alltop.length-1].nextElementSibling!== null) {
                let par = alltop[alltop.length-1].nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }
            }
            if(document.getElementById('sa'+item.id)){
                document.getElementById('sa'+item.id).style.display = 'flex'
                setTimeout(async () => {
                    let target = document.getElementById(parent.id)

                    // console.log(target.nextElementSibling)
                    let lst = target.nextElementSibling.children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                },0)
                return
            }
            axios.request({
                url: 'https://api.spotify.com/v1/recommendations?seed_artists=' + item['id'] + '&limit=50&offset=0&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) => {
                    let data = []
                    data.tracks = response.data['tracks']
                    data.type = 'seed_artists'
                    data.id = 'sa' + item.id
                    data.name = item.name
                    data.pid = parent.id
                    // console.log(data)
                    if (num === 1){
                        let indexing = context.state.deeper1.indexOf(data)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit("setDeeper1",data)
                        }
                    } else if (num === 2){
                        let indexing = context.state.deeper2.indexOf(data)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit("setDeeper2",data)
                        }
                    } else if (num === 22){
                        let indexing = context.state.deeper22.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper22",data)
                        }
                    } else if (num === 23){
                        let indexing = context.state.deeper23.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper23",data)
                        }
                    } else if (num === 3){
                        let indexing = context.state.deeper3.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper3",data)
                        }
                    } else if (num === 32){
                        let indexing = context.state.deeper32.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper32",data)
                        }
                    } else if (num === 33){
                        let indexing = context.state.deeper33.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper33",data)
                        }
                    } else if (num === 4){
                        let indexing = context.state.deeper4.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper4",data)
                        }
                    } else if (num === 5){
                        let indexing = context.state.deeper5.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper5",data)
                        }
                    } else if (num === 6){
                        let indexing = context.state.deeper6.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper6",data)
                        }
                    } else if (num === 7){
                        let indexing = context.state.deeper7.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper7",data)
                        }
                    } else if (num === 8){
                        let indexing = context.state.deeper8.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper8",data)
                        }
                    }else if (num === 9){
                        let indexing = context.state.deeper9.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeeper9",data)
                        }
                    } else if (num === 10){
                        let indexing = context.state.deepers.indexOf(data)
                        if (indexing === -1){
                            this.commit("setDeepers",data)
                        }
                    }
                    if (num === 3 || num === 32 || num === 33 || num === 7 || num === 2 || num === 22 || num === 23 || num === 6){
                        setTimeout(async () => {
                            let target = document.getElementById(parent.id)
                            // console.log(target)

                            // console.log(target.children[1])
                            let lst = target.children[1].children[0].children
                            // console.log(lst)
                            let newarray = []
                            for await(let i of lst) {
                                // console.log(i)
                                newarray.push(i.offsetHeight)
                            }
                            // console.log(newarray.reduce((a, b) => a + b, 0))
                            target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                        },0)
                    } else if (num === 5 ) {
                        setTimeout(async () => {
                            let target = document.getElementById(parent.id)
                            document.getElementById(parent.track.id)
                            // console.log(target.children[1])
                            let lst = target.children[1].children[0].children
                            // console.log(lst)
                            let newarray = []
                            for await(let i of lst) {
                                // console.log(i)
                                newarray.push(i.offsetHeight)
                            }
                            // console.log(newarray.reduce((a, b) => a + b, 0))
                            target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                        },0)
                    }else {
                        setTimeout(async () => {
                            let target = document.getElementById(parent.id)
                            console.log(target)

                            // console.log(target.nextElementSibling)
                            let lst = target.nextElementSibling.children[0].children
                            // console.log(lst)
                            let newarray = []
                            for await(let i of lst) {
                                // console.log(i)
                                newarray.push(i.offsetHeight)
                            }
                            // console.log(newarray.reduce((a, b) => a + b, 0))
                            target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                        },0)
                    }
                })
                .catch()
        },
        deeperartist: async function (context,payload){
            console.log(4102)
            let pointer,
                item = payload.item,
                track = payload.track,
                num = payload.num,
                flag = payload.flag,
                sib = payload.sib,
                related = payload.related
            if (num === 1){
                pointer = 'yourplaylists'
            } else if (num === 2){
                pointer = 'topartist'
            } else if (num === 22){
                pointer = 'topartist6'
            } else if (num === 23){
                pointer = 'topartista'
            } else if (num === 3){
                pointer = 'toptrack'
            } else if (num === 32){
                pointer = 'toptrack6'
            } else if (num === 33){
                pointer = 'toptrackall'
            } else if (num === 4){
                pointer = 'savedalbum'
            } else if (num === 5){
                pointer = 'savedtrack'
            } else if (num === 6){
                pointer = 'followedartist'
            } else if (num === 7){
                pointer = 'newrelease'
            } else if (num === 9){
                pointer = 'sptplaylists'
            } else if (num === 10){
                pointer = 'search'
            }
            let trackartist = []
            trackartist.type = 'trackartist'
            // console.log(item.id)
            // console.log(item)
            // console.log(track)
            // if (document.getElementById('art'+ item.id)){
            //   document.getElementById('art'+ item.id).style.display = 'flex'
            //
            // } else if (document.getElementById('art6'+ item.id)){
            //   document.getElementById('art6'+ item.id).style.display = 'flex'
            //
            // } else if (document.getElementById('artall'+ item.id)){
            //   document.getElementById('artall'+ item.id).style.display = 'flex'
            //
            // } else if (document.getElementById('fa'+ item.id)){
            //   document.getElementById('fa'+ item.id).style.display = 'flex'
            //
            // } else if (document.getElementById('tt'+ item.id)){
            //   document.getElementById('tt'+ item.id).parentElement.style.display = 'flex'
            //
            // } else if (document.getElementById('tt6'+ item.id)){
            //   document.getElementById('tt6'+ item.id).parentElement.style.display = 'flex'
            //
            // } else if (document.getElementById('ta'+ item.id)){
            //   document.getElementById('ta'+ item.id).parentElement.style.display = 'flex'
            //
            // }
            let all = document.querySelectorAll('#'+pointer +'> .rectrack > div')
            let alltop = document.querySelectorAll('#'+pointer +'> .rectrack > div.' + sib)
            let last = document.querySelector('#'+pointer +'> .rectrack > div.trackartist > div[id="art' + item.id + '"]')
            // console.log(last)
            // console.log(item.id)
            if (flag === true){
                // console.log(item.id)
                if (all.length !==0 && all.length !==0){
                    for (let i=0;i < all.length;i++){
                        // console.log(all[i])
                        if (last !== null && all[i].firstChild.id === last.id && last.id === item.id){
                            last.parentElement.style.display = 'block'
                        } else {
                            // console.log(all[i])
                            all[i].style.display = 'none'
                        }
                    }
                }
            }else if (alltop.length!==0 && alltop[alltop.length-1].nextElementSibling!== null) {
                let par = alltop[alltop.length-1].nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }
            } else if (related){

                let par = document.getElementById(related).parentElement.nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }}
            if (last !== null && last.id === 'art' + item.id){
                if (document.getElementById('art'+ item.id)){
                    document.getElementById('art'+ item.id).parentElement.style.display = 'flex'}
                // setTimeout(() => {
                //   window.scrollTo({
                //     top:(document.getElementById('art'+ item.id)).offsetTop,
                //     behavior:'smooth'});
                // }, 10);
                return
            }
            console.log(track)
            await context.dispatch('deeperArtistself', {item: item, track: track}).then(result => trackartist.push(result))
            await context.dispatch('deeperArtisttt', {item: item}).then(tt => trackartist.push(tt))
            await context.dispatch('deeperArtistAlbums', {item: item}).then(album => trackartist.push(album))
            await context.dispatch('deeperArtistSingle', {item: item}).then(single => trackartist.push(single))
            await context.dispatch('deeperArtistAppear', {item: item}).then(appear => trackartist.push(appear))
            await context.dispatch('deeperArtistRelated',{item: item}).then(related => trackartist.push(related))
            await new Promise(r => setTimeout(r, 2000));
            if (num === 1){
                console.log(4225)
                this.commit("setDeeper1",trackartist)
            } else if (num === 2){
                this.commit("setDeeper2",trackartist)
            } else if (num === 22){
                this.commit("setDeeper22",trackartist)
            } else if (num === 23){
                this.commit("setDeeper23",trackartist)
            } else if (num === 3){
                this.commit("setDeeper3",trackartist)
            } else if (num === 32){
                this.commit("setDeeper32",trackartist)
            } else if (num === 33){
                this.commit("setDeeper33",trackartist)
            } else if (num === 4){
                this.commit("setDeeper4",trackartist)
            } else if (num === 5){
                this.commit("setDeeper5",trackartist)
            } else if (num === 6){
                this.commit("setDeeper6",trackartist)
            } else if (num === 7){
                this.commit("setDeeper7",trackartist)
            } else if (num === 8){
                this.commit("setDeeper8",trackartist)
            } else if (num === 9){
                this.commit("setDeeper9",trackartist)
            } else if (num === 10){
                this.commit("setDeepers",trackartist)
            }
            // setTimeout(() => {
            //   window.scrollTo({
            //     top:(document.getElementById('art'+ item.id)).offsetTop,
            //     behavior:'smooth'});
            // }, 10);
            // console.log(trackartist)
        },
        deeperartistmob: async function (context,payload){
            let item = payload.item,
                track = payload.track,
                num = payload.num,
                flag = payload.flag,
                sib = payload.sib,
                related = payload.related,
                parent = payload.parent
            console.log(parent)
            let trackartist = []
            // console.log(parent)
            trackartist.type = 'trackartist'
            trackartist.pid = parent.id
            let all = document.querySelectorAll('.item-container > .rectrack > div.hcontent > div')
            let alltop = document.querySelectorAll('.item-container > .rectrack > div.hcontent > div.' + sib)
            let last = document.querySelector('.item-container > .rectrack > div.hcontent > div.trackartist > div[id="art' + item.id + '"]')
            //  console.log(last)
            // console.log(all)
            // console.log(alltop)
            if (flag === true){
                // console.log(item.id)
                if (all.length !==0 && all.length !==0){
                    for (let i=0;i < all.length;i++){
                        // console.log(all[i])
                        if (last !== null && all[i].firstChild.id === last.id && last.id === item.id){
                            last.parentElement.style.display = 'block'
                        } else {
                            // console.log(all[i])
                            all[i].style.display = 'none'
                        }
                    }
                }
            }else if (alltop.length!==0 && alltop[alltop.length-1].nextElementSibling!== null) {
                let par = alltop[alltop.length-1].nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }
            } else if (related){

                let par = document.getElementById(related).parentElement.nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }}
            if (last !== null && last.id === 'art' + item.id){
                if (document.getElementById('art'+ item.id)){
                    document.getElementById('art'+ item.id).parentElement.style.display = 'flex'}
                if (num ===1 || num===8 || num ===9){
                    setTimeout(async () => {
                        let target = document.getElementById(parent.id)

                        // console.log(target.nextElementSibling)
                        let lst = target.nextElementSibling.children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                    },0)
                } else if (num === 5) {
                    let target = document.getElementById(parent.track.id)
                    document.getElementById(parent.track.id)
                    // console.log(parent.track.id)
                    // console.log(target.children[0])
                    await context.dispatch('hideall',{elem:target.children[0].nextElementSibling})
                    target.children[0].nextElementSibling.style.display = 'block'
                    let lst = target.children[0].nextElementSibling.children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.children[0].nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                }else{
                    setTimeout(async () => {
                        let target = document.getElementById(parent.id)

                            await context.dispatch('hideall',{elem:target.children[0].nextElementSibling})
                            let lst = target.children[0].nextElementSibling.children[0].children
                            // console.log(lst)
                            let newarray = []
                            for await(let i of lst) {
                                // console.log(i)
                                newarray.push(i.offsetHeight)
                            }
                            // console.log(newarray.reduce((a, b) => a + b, 0))
                            target.children[0].nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'


                    },0)
                }

                // setTimeout(() => {
                //   window.scrollTo({
                //     top:(document.getElementById('art'+ item.id)).offsetTop,
                //     behavior:'smooth'});
                // }, 10);
                return
            }
            console.log(track)
            await context.dispatch('deeperArtistself', {item: item, track: track}).then(result => trackartist.push(result))
            await context.dispatch('deeperArtisttt', {item: item}).then(tt => trackartist.push(tt))
            await context.dispatch('deeperArtistAlbums', {item: item}).then(album => trackartist.push(album))
            await context.dispatch('deeperArtistSingle', {item: item}).then(single => trackartist.push(single))
            await context.dispatch('deeperArtistAppear', {item: item}).then(appear => trackartist.push(appear))
            await context.dispatch('deeperArtistRelated',{item: item}).then(related => trackartist.push(related))
            await new Promise(r => setTimeout(r, 2000));
            if (num === 1){
                this.commit("setDeeper1",trackartist)
            } else if (num === 2){
                console.log(trackartist)
                this.commit("setDeeper2",trackartist)
            } else if (num === 22){
                console.log(trackartist)
                this.commit("setDeeper22",trackartist)
            } else if (num === 23){
                this.commit("setDeeper23",trackartist)
            } else if (num === 3){
                this.commit("setDeeper3",trackartist)
            } else if (num === 32){
                this.commit("setDeeper32",trackartist)
            } else if (num === 33){
                this.commit("setDeeper33",trackartist)
            } else if (num === 4){
                this.commit("setDeeper4",trackartist)
            } else if (num === 5){
                trackartist.pid = parent.id
                this.commit("setDeeper5",trackartist)
            } else if (num === 6){
                this.commit("setDeeper6",trackartist)
            } else if (num === 7){
                this.commit("setDeeper7",trackartist)
            } else if (num === 8){
                this.commit("setDeeper8",trackartist)
            } else if (num === 9){
                this.commit("setDeeper9",trackartist)
            } else if (num === 10){
                this.commit("setDeepers",trackartist)
            }
            if (num ===1 || num===8 || num ===9){
                setTimeout(async () => {
                    let target = document.getElementById(parent.id)
                    console.log(target)

                    // console.log(target.nextElementSibling)
                    let lst = target.nextElementSibling.children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                },0)
            } else if (num === 5){
                setTimeout(async () => {
                    let target = document.getElementById(parent.id)

                    // console.log(parent.track.id)

                    // console.log(target.children[0])
                    await context.dispatch('hideall',{elem:target.children[0].nextElementSibling})
                    let lst = target.children[0].nextElementSibling.children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.children[0].nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                },0)
            } else {
                setTimeout(async () => {
                    let target = document.getElementById(parent.id)

                    // console.log(parent.id)

                    // console.log(target.children[0])
                    if (target.children[0].nextElementSibling){
                        await context.dispatch('hideall',{elem:target.children[0].nextElementSibling})
                        let lst = target.children[0].nextElementSibling.children[0].children
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        target.children[0].nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                    }
                },0)
                window.addEventListener('resize',function (){
                    setTimeout(async () => {
                        let target = document.getElementById(parent.id)

                        let lst = target.children[0].nextElementSibling.children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        if (num === 7){
                            target.children[0].nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 50 + 'px'
                        } else {
                            target.children[0].nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 200 + 'px'
                        }
                    },0)
                })
            }
            // setTimeout(() => {
            //   window.scrollTo({
            //     top:(document.getElementById('art'+ item.id)).offsetTop,
            //     behavior:'smooth'});
            // }, 10);
            // console.log(trackartist)
        },
        deeperArtistself(context,payload){
            let item = payload.item,
                track = payload.track
            console.log(track)
            return axios.request({
                url:'https://api.spotify.com/v1/artists/' + item.id,
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    let trackartist = []
                    trackartist = response.data
                    trackartist.type = 'artist'
                    axios.request({
                        url:'https://api.spotify.com/v1/me/following/contains?type=artist&ids=' + item.id,
                        method: 'get',
                        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) =>{
                            trackartist.followed = response.data[0]
                        })
                        .catch(error =>{
                            if (error.response.status === 401){
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                    // console.log(response.data)
                                    if (response.status === 200){
                                        context.dispatch('deeperArtistself', {item: item, track: track})
                                    }
                                })
                            }
                        })
                    if (track != null && track[0] != null && track[0].preview_url){
                        trackartist.preview_url = track[0].preview_url
                    } else if ( track != null && track.preview_url){
                        trackartist.preview_url = track.preview_url}
                    if (trackartist.images.length !== 0 && trackartist.images[0] !== undefined && trackartist.images[0].url !==null){
                        return trackartist
                    } else{
                        trackartist.images[0] = 'url("")'
                        return trackartist
                    }
                    // } else if (item.preview_url){
                    //   trackartist.preview_url = item.preview_url
                    // }

                })
                .catch(error =>{
                    console.log(error)
                    // console.log(error.response.data)
                    if (error.response.status === 401){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
                    }
                })
        },
        deeperArtisttt(context,payload){
            let item = payload.item
            // top tracks
            return axios.request({
                url:'https://api.spotify.com/v1/artists/' + item.id + '/top-tracks?limit=10&market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    let tt = []
                    tt = response.data
                    tt.type = 'top_tracks'
                    //console.log(tt)
                    return tt
                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
                    }
                })
        },
        deeperArtistAlbums(context,payload){
            let item = payload.item
            // album
            return axios.request({
                url:'https://api.spotify.com/v1/artists/' + item.id + '/albums?include_groups=album&limit=10',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    let newarr = []
                    let arr = response.data['items']
                    // console.log(arr)
                    // this.deeper1.push(data)
                    for (let i=0;i <  arr.length;i++){
                        // console.log('237 ' + arr.items[i].id)
                        axios.request({
                            url:'https://api.spotify.com/v1/albums/' + arr[i].id + '/tracks',
                            method: 'get',
                            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                        })
                            .then((response) =>{
                                let tracks = response.data['items']
                                // console.log(333)
                                // console.log(response.data)
                                arr[i].tracks = tracks
                                if (tracks[0]['preview_url']){
                                    arr[i].preview_url = tracks[0]['preview_url']
                                }
                                if (arr[i].images.length!==0 && arr[i].images!==null && arr[i].images[0]!==undefined && arr[i].images[0].url !==null){
                                    newarr.push(arr[i])
                                } else{
                                    arr[i].images[0] = 'url("")'
                                    newarr.push(arr[i])
                                }

                            })
                    }
                    newarr.type = 'albums'
                    // console.log(newarr)
                    return newarr

                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
                    }
                })
        },
        deeperArtistSingle(context,payload){
            let item = payload.item
            // single,compilation
            return axios.request({
                url:'https://api.spotify.com/v1/artists/' + item.id + '/albums?include_groups=single,compilation',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    let single = []
                    let arr = response.data['items']
                    // this.deeper1.push(data)
                    for (let i=0;i <  arr.length;i++){
                        // console.log('237 ' + arr.items[i].id)
                        axios.request({
                            url:'https://api.spotify.com/v1/albums/' + arr[i].id + '/tracks',
                            method: 'get',
                            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                        })
                            .then((response) =>{
                                let tracks = response.data['items']
                                // console.log(333)
                                // console.log(response.data)
                                arr[i].tracks = tracks
                                if (tracks[0]['preview_url']){
                                    arr[i].preview_url = tracks[0]['preview_url']
                                }
                                if (arr[i].images.length!==0 && arr[i].images!==null && arr[i].images[0]!==undefined && arr[i].images[0].url !==null){
                                    single.push(arr[i])
                                } else{
                                    arr[i].images[0] = 'url("")'
                                    single.push(arr[i])
                                }

                            })
                    }single.type = 'single'
                    return single
                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
                    }
                })
        },
        deeperArtistAppear(context,payload){
            let item = payload.item
            // appears_on
            return axios.request({
                url:'https://api.spotify.com/v1/artists/' + item.id + '/albums?include_groups=appears_on',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    let appears = []
                    let arr = response.data['items']
                    // console.log(arr)
                    // this.deeper1.push(data)
                    for (let i=0;i <  arr.length;i++){
                        // console.log('237 ' + arr.items[i].id)
                        axios.request({
                            url:'https://api.spotify.com/v1/albums/' + arr[i].id + '/tracks',
                            method: 'get',
                            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                        })
                            .then((response) =>{
                                let tracks = response.data['items']
                                arr[i].tracks = tracks
                                // console.log(333)
                                // console.log(response.data)
                                if (tracks[0]['preview_url']){
                                    arr[i].preview_url = tracks[0]['preview_url']
                                }
                                // console.log(response.data['items'])
                                // console.log(response.data['items'].length)
                                // console.log(arr[i])
                                if (arr[i].images.length!==0 && arr[i].images!==null && arr[i].images[0]!==undefined && arr[i].images[0].url !==null){
                                    // console.log(arr[i].images[0])
                                    appears.push(arr[i])
                                } else{
                                    arr[i].images[0] = 'url("")'
                                    appears.push(arr[i])
                                }

                            })
                    }appears.type = 'appears_on'
                    return appears

                })
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
                    }
                })
        },
        deeperArtistRelated(context,payload){
            let item = payload.item
            // related-artists
            return axios.request({
                url:'https://api.spotify.com/v1/artists/' + item.id + '/related-artists',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    let relatedartist = []
                    let fin = []
                    let arr = response.data['artists']
                    // console.log(444)
                    // console.log(arr)
                    // this.deeper1.push(data)
                    for (let i=0;i <  arr.length;i++){
                        // console.log('447 ' + arr.items[i].id)
                        axios.request({
                            url:'https://api.spotify.com/v1/artists/' + arr[i].id + '/top-tracks?market=UA' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                            method: 'get',
                            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                        })
                            .then((response) =>{
                                // console.log(response.data['tracks'])
                                // console.log(response.data['tracks'].length)
                                // console.log(arr[i])
                                let tracks = response.data['tracks']
                                if (tracks.length!==0 && tracks[0]['preview_url']){
                                    arr[i].preview_url = tracks[0]['preview_url']
                                }
                                if (arr[i].images.length!==0 && arr[i].images!==null && arr[i].images[0]!==undefined && arr[i].images[0].url !==null){
                                    relatedartist.push(arr[i])
                                } else{
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
                .catch(error =>{
                    if (error.response.status){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
                    }
                })
        },

        deeperAlbum(context,payload){
            let item = payload.item,
                num = payload.num,
                child = payload.child,
                search = payload.search
            if (num === 4 && item.album){
                item = item.album
                item.album = true
            }
            item.type ='deeperalbum'
            // console.log(item.id)
            if (child){
                let par = document.getElementById(child).parentElement.nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }}
            if (search===true){
                let albs = document.querySelectorAll('#search> .rectrack > div')
                for (let i = 0; i < albs.length; i++) {
                    if (document.getElementById('alb'+  item.id) !=null && albs[i].id === document.getElementById('alb'+ item.id).id){
                        document.getElementById('alb'+  item.id).style.display = 'block'
                    }else {
                        albs[i].style.display = 'none'
                    }
                }
            }
            if (num !== 4 && document.getElementById('alb' + item.id)){
                document.getElementById('alb' + item.id).style.display = 'flex'
                // setTimeout(() => {
                //   window.scrollTo({
                //     top:(document.getElementById('alb'+ item.id)).offsetTop,
                //     behavior:'smooth'});
                // }, 10);
                return
            }
            if (num !== 4){
                axios.request({
                    url:'https://api.spotify.com/v1/me/albums/contains?ids=' + item.id,
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        item.followed = response.data[0]
                        if (num === 1){
                            let indexing = context.state.deeper1.indexOf(item)
                            if (indexing === -1){
                                // eslint-disable-next-line no-undef
                                this.commit("setDeeper1",item)
                            }
                        } else if (num === 2){
                            let indexing = context.state.deeper2.indexOf(item)
                            if (indexing === -1){
                                // eslint-disable-next-line no-undef
                                this.commit("setDeeper2",item)
                            }
                        } else if (num === 22){
                            let indexing = context.state.deeper22.indexOf(item)
                            if (indexing === -1){
                                this.commit("setDeeper22",item)
                            }
                        } else if (num === 23){
                            let indexing = context.state.deeper23.indexOf(item)
                            if (indexing === -1){
                                this.commit("setDeeper23",item)
                            }
                        } else if (num === 3){
                            let indexing = context.state.deeper3.indexOf(item)
                            if (indexing === -1){
                                this.commit("setDeeper3",item)
                            }
                        } else if (num === 32){
                            let indexing = context.state.deeper32.indexOf(item)
                            if (indexing === -1){
                                this.commit("setDeeper32",item)
                            }
                        } else if (num === 33){
                            let indexing = context.state.deeper33.indexOf(item)
                            if (indexing === -1){
                                this.commit("setDeeper33",item)
                            }
                        } else if (num === 5){
                            let indexing = context.state.deeper5.indexOf(item)
                            if (indexing === -1){
                                this.commit("setDeeper5",item)
                            }
                        } else if (num === 6){
                            let indexing = context.state.deeper6.indexOf(item)
                            if (indexing === -1){
                                this.commit("setDeeper6",item)
                            }
                        } else if (num === 7){
                            let indexing = context.state.deeper7.indexOf(item)
                            if (indexing === -1){
                                this.commit("setDeeper7",item)
                            }
                        } else if (num === 8){
                            let indexing = context.state.deeper8.indexOf(item)
                            if (indexing === -1){
                                this.commit("setDeeper8",item)
                            }
                        }else if (num === 9){
                            let indexing = context.state.deeper9.indexOf(item)
                            if (indexing === -1){
                                this.commit("setDeeper9",item)
                            }
                        } else if (num === 10){
                            let indexing = context.state.deepers.indexOf(item)
                            if (indexing === -1){
                                this.commit("setDeepers",item)
                            }
                        }
                        // setTimeout(() => {
                        //   window.scrollTo({
                        //     top:(document.getElementById('alb'+ item.id)).offsetTop,
                        //     behavior:'smooth'});
                        // }, 100);
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                // console.log(response.data)
                                if (response.status === 200){
                                    context.dispatch('deeperAlbum',context,payload)
                                }
                            })
                        }
                    })
            }

            if (num === 4){
                if (item.album){
                    axios.request({
                        url:'https://api.spotify.com/v1/me/albums/contains?ids=' + item.id,
                        method: 'get',
                        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then(async (response) =>{
                            item.followed = response.data[0]
                            let albs = document.querySelectorAll("#savedalbum >.rectrack > div")
                            console.log(albs)
                            for await(let i of albs){
                                if (i.id === 'alb' + item.id){
                                    i.style.display = 'flex'
                                } else{
                                    i.style.display = 'none'
                                }
                            }
                console.log(item)
                            let indexing = context.state.deeper4.indexOf(item)
                            if (indexing === -1){
                                this.commit("setDeeper4",item)
                            }
                        })
                        .catch(error =>{
                            console.log(error)
                            if (error.response.status === 401){
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                    // console.log(response.data)
                                    if (response.status === 200){
                                        context.dispatch('deeperAlbum',context,payload)
                                    }
                                })
                            }
                        })

                } else{
                    if (document.getElementById('alb' + item.id)){
                        document.getElementById('alb' + item.id).style.display = 'flex'
                        return
                    }
                    let indexing = context.state.deeper4.indexOf(item)
                    if (indexing === -1){
                        this.commit("setDeeper4",item)
                    }
                }
            }
        },
        deeperAlbumMob(context,payload){
            let item = payload.item,
                num = payload.num,
                child = payload.child,
                search = payload.search,
                parent = payload.parent
            if (num === 4 && item.album){
                item = item.album
                item.album = true
            }
            item.type ='deeperalbum'
            item.pid = parent.id
            // console.log(item.id)
            if (child){
                let par = document.getElementById(child).parentElement.nextElementSibling
                while (par != null) {
                    par.style.display = 'none'
                    if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                        par = par.nextElementSibling
                    } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                        par = par.nextElementSibling.nextElementSibling
                    } else if (par.nextElementSibling === null){
                        par = null
                    }
                }}
            if (search===true){
                let albs = document.querySelectorAll('#search> .rectrack > div')
                for (let i = 0; i < albs.length; i++) {
                    if (document.getElementById('alb'+  item.id) !=null && albs[i].id === document.getElementById('alb'+ item.id).id){
                        document.getElementById('alb'+  item.id).style.display = 'block'
                    }else {
                        albs[i].style.display = 'none'
                    }
                }
            }
            if (num !== 4 && document.getElementById('alb' + item.id)){
                document.getElementById('alb' + item.id).style.display = 'flex'
                setTimeout(async () => {
                    let target = document.getElementById(parent.id)

                    // console.log(target.nextElementSibling)
                    let lst = target.nextElementSibling.children[0].children
                    // console.log(lst)
                    let newarray = []
                    for await(let i of lst) {
                        // console.log(i)
                        newarray.push(i.offsetHeight)
                    }
                    // console.log(newarray.reduce((a, b) => a + b, 0))
                    target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                },0)
                return
            }
            if (num !== 4){
                axios.request({
                    url:'https://api.spotify.com/v1/me/albums/contains?ids=' + item.id,
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        item.followed = response.data[0]
                        if (num === 1){
                            item.pid = parent.id
                            let indexing = context.state.deeper1.indexOf(item)
                            if (indexing === -1){
                                this.commit("setDeeper1",item)
                                setTimeout(async () => {
                                    let target = document.getElementById(parent.id)

                                    // console.log(target.nextElementSibling)
                                    let lst = target.nextElementSibling.children[0].children
                                    // console.log(lst)
                                    let newarray = []
                                    for await(let i of lst) {
                                        // console.log(i)
                                        newarray.push(i.offsetHeight)
                                    }
                                    // console.log(newarray.reduce((a, b) => a + b, 0))
                                    target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                                },0)
                            }
                        } else if (num === 2){
                        let indexing = context.state.deeper2.indexOf(item)
                        if (indexing === -1){
                            // eslint-disable-next-line no-undef
                            this.commit("setDeeper2",item)
                            // console.log(context.state.deeper2)
                        }
                    } else if (num === 22){
                        let indexing = context.state.deeper22.indexOf(item)
                        if (indexing === -1){
                            this.commit("setDeeper22",item)
                        }
                    } else if (num === 23){
                        let indexing = context.state.deeper23.indexOf(item)
                        if (indexing === -1){
                            this.commit("setDeeper23",item)
                        }
                    } else if (num === 3){
                        let indexing = context.state.deeper3.indexOf(item)
                        if (indexing === -1){
                            this.commit("setDeeper3",item)
                        }
                    } else if (num === 32){
                        let indexing = context.state.deeper32.indexOf(item)
                        if (indexing === -1){
                            this.commit("setDeeper32",item)
                        }
                    } else if (num === 33){
                        let indexing = context.state.deeper33.indexOf(item)
                        if (indexing === -1){
                            this.commit("setDeeper33",item)
                        }
                    } else if (num === 5){
                        let indexing = context.state.deeper5.indexOf(item)
                        if (indexing === -1){
                            this.commit("setDeeper5",item)
                        }
                    } else if (num === 6){
                        let indexing = context.state.deeper6.indexOf(item)
                        if (indexing === -1){
                            this.commit("setDeeper6",item)
                        }
                    } else if (num === 7){
                        let indexing = context.state.deeper7.indexOf(item)
                        if (indexing === -1){
                            this.commit("setDeeper7",item)
                        }
                    } else if (num === 8){
                        let indexing = context.state.deeper8.indexOf(item)
                        if (indexing === -1){
                            this.commit("setDeeper8",item)
                        }
                    }else if (num === 9){
                        let indexing = context.state.deeper9.indexOf(item)
                        if (indexing === -1){
                            this.commit("setDeeper9",item)
                        }
                    } else if (num === 10){
                        let indexing = context.state.deepers.indexOf(item)
                        if (indexing === -1){
                            this.commit("setDeepers",item)
                        }
                    }
                        if (num === 2 || num === 22 || num === 23 || num === 6 || num === 3 || num === 32 || num === 33 || num === 7){
                            setTimeout(async () => {
                                let target = document.getElementById(parent.id)

                                // console.log(target.children[1])
                                let lst = target.children[1].children[0].children
                                // console.log(lst)
                                let newarray = []
                                for await(let i of lst) {
                                    // console.log(i)
                                    newarray.push(i.offsetHeight)
                                }
                                // console.log(newarray.reduce((a, b) => a + b, 0))
                                target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                            },0)
                        } else if (num === 5 ){
                            setTimeout(async () => {
                                let target = document.getElementById(parent.id)

                                // console.log(target.children[1])
                                let lst = target.children[1].children[0].children
                                // console.log(lst)
                                let newarray = []
                                for await(let i of lst) {
                                    // console.log(i)
                                    newarray.push(i.offsetHeight)
                                }
                                // console.log(newarray.reduce((a, b) => a + b, 0))
                                target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                            },0)
                        } else if (num === 9){
                            setTimeout(async () => {
                                let target = document.getElementById(parent.id)

                                // console.log(target.nextElementSibling)
                                let lst = target.nextElementSibling.children[0].children
                                // console.log(lst)
                                let newarray = []
                                for await(let i of lst) {
                                    // console.log(i)
                                    newarray.push(i.offsetHeight)
                                }
                                // console.log(newarray.reduce((a, b) => a + b, 0))
                                target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                            },0)
                        }
                        // setTimeout(() => {
                        //   window.scrollTo({
                        //     top:(document.getElementById('alb'+ item.id)).offsetTop,
                        //     behavior:'smooth'});
                        // }, 100);
                    })
                    .catch(error =>{
                        // console.log(error)
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                // console.log(response.data)
                                if (response.status === 200){
                                    context.dispatch('deeperAlbum',context,payload)
                                }
                            })
                        }
                    })
            }

            if (num === 4){
                if (item.album){
                    if (document.getElementById('alb' + item.id)){
                        document.getElementById('alb' + item.id).style.display = 'flex'
                        setTimeout(async () => {
                            let target = document.getElementById(parent.id)

                            // console.log(target)
                            // console.log(target.children[1])
                            await context.dispatch('hideall',{elem:target.children[1]})
                            let lst = target.children[1].children[0].children
                            // console.log(lst)
                            let newarray = []
                            for await(let i of lst) {
                                // console.log(i)
                                newarray.push(i.offsetHeight)
                            }
                            // console.log(newarray.reduce((a, b) => a + b, 0))
                            target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                        },0)
                        return
                    }
                    axios.request({
                        url:'https://api.spotify.com/v1/me/albums/contains?ids=' + item.id,
                        method: 'get',
                        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) =>{
                            item.followed = response.data[0]
                            let albs = document.querySelectorAll(".rectrack > div")
                            for (let i=0;i < albs.length; i++){
                                if (albs[i].id === 'alb' + item.id){
                                    albs[i].style.display = 'flex'
                                } else{
                                    albs[i].style.display = 'none'
                                }
                            }
                            let indexing = context.state.deeper4.indexOf(item)
                            if (indexing === -1){
                                // console.log(item)
                                this.commit("setDeeper4",item)
                            }
                            setTimeout(async () => {
                                let target = document.getElementById(item.id)
                                // console.log(target)
                                // console.log(target.children)
                                document.getElementById(item.id)
                                // console.log(target)
                                // console.log(target.children[1])
                                await context.dispatch('hideall',{elem:target.children[1]})
                                let lst = target.children[1].children[0].children
                                // console.log(lst)
                                let newarray = []
                                for await(let i of lst) {
                                    // console.log(i)
                                    newarray.push(i.offsetHeight)
                                }
                                // console.log(newarray.reduce((a, b) => a + b, 0))
                                target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 300 + 'px'
                            },0)
                        })
                        .catch(error =>{
                            // console.log(error)
                            if (error.response.status === 401){
                                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                    // console.log(response.data)
                                    if (response.status === 200){
                                        context.dispatch('deeperAlbum',context,payload)
                                    }
                                })
                            }
                        })

                } else{
                    if (document.getElementById('alb' + item.id)){
                        document.getElementById('alb' + item.id).style.display = 'flex'
                        setTimeout(async () => {
                            let target = document.getElementById(parent.id)

                            await context.dispatch('hideall',{elem:target.children[1]})
                            let lst = target.children[1].children[0].children
                            // console.log(lst)
                            let newarray = []
                            for await(let i of lst) {
                                // console.log(i)
                                newarray.push(i.offsetHeight)
                            }
                            // console.log(newarray.reduce((a, b) => a + b, 0))
                            target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 400 + 'px'
                        },0)
                        return
                    }
                    item.pid = parent.id
                    item.album = item
                    // console.log(item)
                    let indexing = context.state.deeper4.indexOf(item)
                    // console.log(indexing)
                    if (indexing === -1){
                        this.commit("setDeeper4",item)
                    }
                    setTimeout(async () => {
                        let target = document.getElementById(parent.id)

                        // console.log(target.nextElementSibling)
                        await context.dispatch('hideall',{elem:target.children[1]})
                        let lst = target.children[1].children[0].children
                        // console.log(lst)
                        let newarray = []
                        for await(let i of lst) {
                            // console.log(i)
                            newarray.push(i.offsetHeight)
                        }
                        // console.log(newarray.reduce((a, b) => a + b, 0))
                        target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 100 + 'px'
                    },100)
                }
            }
        },
        deeperAlbum2(context,payload){
            let item = payload.item
            item.type ='deeperalbum2'
            axios.request({
                url:'https://api.spotify.com/v1/me/albums/contains?ids=' + item.id,
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    item.followed = response.data[0]
                })
                .catch(error =>{
                    if (error.response.status === 401){
                        axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                            // console.log(response.data)
                            if (response.status === 200){
                                context.dispatch('deeperAlbum2',context,payload)
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
        thesoundof: async function(context,payload){
            let name = payload.name,
                num = payload.num,
                sib = payload.sib,
                child = payload.child
            let value = 'The Sound of ' + name.toUpperCase()
            let neww = titleCase.titleCase(name)
            let newvalue = 'The Sound of ' + neww
            // console.log(await titleCase.titleCase(name))
            // console.log(newvalue)
            axios.request({
                url: 'https://api.spotify.com/v1/search/?q=' + newvalue + '&type=playlist&limit=5',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then(async (response) => {
                    let playlists = response.data['playlists']['items']
                    // let first = playlists.find(playlists => playlists.name === newvalue && playlists.owner.id === 'thesoundsofspotify')
                    // console.log(first)
                    // let second = playlists.find(playlists => playlists.name === value && playlists.owner.id === 'thesoundsofspotify')
                    // console.log(second)
                    const finded = new Promise(function(resolve, reject) {
                        let first = playlists.find(playlists => playlists.name === newvalue && playlists.owner.id === 'thesoundsofspotify')
                        let second = playlists.find(playlists => playlists.name === value && playlists.owner.id === 'thesoundsofspotify')
                        if (first){
                            resolve(first)
                        } else if(second){
                            resolve(second)
                        } else {
                            reject(null)
                        }
                    })
                    finded.then((finded => {
                        let alltop = document.querySelectorAll('.rectrack > div.' + sib)
                        // console.log(alltop)
                        // console.log(child)
                        if (child){
                            let par = document.getElementById(child).parentElement.nextElementSibling
                            // console.log(par)
                            while (par != null) {
                                par.style.display = 'none'
                                if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                                    par = par.nextElementSibling
                                } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                                    par = par.nextElementSibling.nextElementSibling
                                } else if (par.nextElementSibling === null){
                                    par = null
                                }
                            }} else if (sib!==false && alltop.length!==false && alltop[alltop.length-1].nextElementSibling!== null) {
                            let par = alltop[alltop.length-1].nextElementSibling
                            while (par != null) {
                                par.style.display = 'none'
                                if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                                    par = par.nextElementSibling
                                } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                                    par = par.nextElementSibling.nextElementSibling
                                } else if (par.nextElementSibling === null){
                                    par = null
                                }
                            }
                        }
                        if(document.getElementById('p'+finded.id)){
                            document.getElementById('p'+finded.id).style.display = 'flex'
                            return
                        }

                        let playlist = []
                        // console.log('237' + playlists[i].id)
                        axios.request({
                            url: 'https://api.spotify.com/v1/playlists/' + finded.id,
                            method: 'get',
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
                                if (num === 1){
                                    let indexing = context.state.deeper1.indexOf(playlist)
                                    if (indexing === -1){
                                        // eslint-disable-next-line no-undef
                                        this.commit("setDeeper1",playlist)
                                    }
                                } else if (num === 2){
                                    let indexing = context.state.deeper2.indexOf(playlist)
                                    if (indexing === -1){
                                        // eslint-disable-next-line no-undef
                                        this.commit("setDeeper2",playlist)
                                    }
                                } else if (num === 22){
                                    let indexing = context.state.deeper22.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper22",playlist)
                                    }
                                } else if (num === 23){
                                    let indexing = context.state.deeper23.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper23",playlist)
                                    }
                                } else if (num === 3){
                                    let indexing = context.state.deeper3.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper3",playlist)
                                    }
                                } else if (num === 32){
                                    let indexing = context.state.deeper32.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper32",playlist)
                                    }
                                } else if (num === 33){
                                    let indexing = context.state.deeper33.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper33",playlist)
                                    }
                                } else if (num === 4){
                                    let indexing = context.state.deeper4.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper4",playlist)
                                    }
                                } else if (num === 5){
                                    let indexing = context.state.deeper5.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper5",playlist)
                                    }
                                } else if (num === 6){
                                    let indexing = context.state.deeper6.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper6",playlist)
                                    }
                                } else if (num === 7){
                                    let indexing = context.state.deeper7.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper7",playlist)
                                    }
                                } else if (num === 8){
                                    let indexing = context.state.deeper8.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper8",playlist)
                                    }
                                }else if (num === 9){
                                    let indexing = context.state.deeper9.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper9",playlist)
                                    }
                                } else if (num === 10){
                                    let indexing = context.state.deepers.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeepers",playlist)
                                    }
                                }

                            })
                    }))

                }).catch(error =>{
                if (error.response.status === 401){
                    axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                        // console.log(response.data)
                        if (response.status === 200){
                            context.dispatch('thesoundof', {name: name})
                        }
                    })
                }
            })
        },
        thesoundofmob: async function(context,payload){
            let pointer,
                name = payload.name,
                num = payload.num,
                sib = payload.sib,
                child = payload.child,
                parent = payload.parent
            let value = 'The Sound of ' + name.toUpperCase()
            let neww = titleCase.titleCase(name)
            let newvalue = 'The Sound of ' + neww
            // console.log(await this.titleCase(name))
            // console.log(newvalue)
            axios.request({
                url: 'https://api.spotify.com/v1/search/?q=' + newvalue + '&type=playlist&limit=5',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) => {
                    let playlists = response.data['playlists']['items']
                    const finded = new Promise(function(resolve, reject) {
                        let first = playlists.find(playlists => playlists.name === newvalue && playlists.owner.id === 'thesoundsofspotify')
                        let second = playlists.find(playlists => playlists.name === value && playlists.owner.id === 'thesoundsofspotify')
                        if (first){
                            resolve(first)
                        } else if(second){
                            resolve(second)
                        } else {
                            reject(null)
                        }
                    })
                    finded.then((finded => {
                        let alltop = document.querySelectorAll('.item-container > .rectrack > div.hcontent > div.' + sib)
                        let alltop2 = document.querySelectorAll('#'+pointer +'> .rectrack > div.' + sib)

                        // console.log(child)
                        if (child){
                            let par = document.getElementById(child).parentElement.nextElementSibling
                            // console.log(par)
                            while (par != null) {
                                par.style.display = 'none'
                                if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                                    par = par.nextElementSibling
                                } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                                    par = par.nextElementSibling.nextElementSibling
                                } else if (par.nextElementSibling === null){
                                    par = null
                                }
                            }} else if (sib!==false && num!== 10 && alltop[alltop.length-1].nextElementSibling!== null) {
                            let par = alltop[alltop.length-1].nextElementSibling
                            while (par != null) {
                                par.style.display = 'none'
                                if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                                    par = par.nextElementSibling
                                } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                                    par = par.nextElementSibling.nextElementSibling
                                } else if (par.nextElementSibling === null){
                                    par = null
                                }
                            }
                        } else if (sib!==false && num === 10  && alltop2[alltop2.length-1].nextElementSibling!== null) {
                            let par = alltop2[alltop2.length-1].nextElementSibling
                            while (par != null) {
                                par.style.display = 'none'
                                if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
                                    par = par.nextElementSibling
                                } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
                                    par = par.nextElementSibling.nextElementSibling
                                } else if (par.nextElementSibling === null){
                                    par = null
                                }
                            }
                        }
                        if(document.getElementById('p'+finded.id)){
                            document.getElementById('p'+finded.id).style.display = 'flex'
                            if (num === 2 || num === 22 || num === 23 || num === 3 || num === 32 || num === 33 || num === 7 || num === 4){
                                setTimeout(async () => {
                                    let target = document.getElementById(parent.id)

                                    // console.log(target.children[1])
                                    let lst = target.children[1].children[0].children
                                    // console.log(lst)
                                    let newarray = []
                                    for await(let i of lst) {
                                        // console.log(i)
                                        newarray.push(i.offsetHeight)
                                    }
                                    // console.log(newarray.reduce((a, b) => a + b, 0))
                                    target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 500 + 'px'
                                },100)
                            } else if (num === 5 ) {
                                setTimeout(async () => {
                                    let target = document.getElementById(parent.track.id)
                                    document.getElementById(parent.track.id)
                                    // console.log(target.children[1])
                                    let lst = target.children[1].children[0].children
                                    // console.log(lst)
                                    let newarray = []
                                    for await(let i of lst) {
                                        // console.log(i)
                                        newarray.push(i.offsetHeight)
                                    }
                                    // console.log(newarray.reduce((a, b) => a + b, 0))
                                    target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 500 + 'px'
                                },100)
                            }else {
                                setTimeout(async () => {
                                    let target = document.getElementById(parent.id)

                                    // console.log(target.nextElementSibling)
                                    let lst = target.nextElementSibling.children[0].children
                                    // console.log(lst)
                                    let newarray = []
                                    for await(let i of lst) {
                                        // console.log(i)
                                        newarray.push(i.offsetHeight)
                                    }
                                    // console.log(newarray.reduce((a, b) => a + b, 0))
                                    target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 500 + 'px'
                                },100)
                            }

                            return
                        }

                        let playlist = []
                        // console.log('237' + playlists[i].id)
                        axios.request({
                            url: 'https://api.spotify.com/v1/playlists/' + finded.id,
                            method: 'get',
                            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                        })
                            .then((response) => {
                                // console.log(response.data['tracks'])
                                let tracks = response.data['tracks']
                                finded.tracks = tracks
                                playlist = finded
                                playlist.type = 'deeperplaylist'
                                playlist.pid = parent.id
                                // console.log(playlist)
                                if (num === 1){
                                    let indexing = context.state.deeper1.indexOf(playlist)
                                    if (indexing === -1){
                                        // eslint-disable-next-line no-undef
                                        this.commit("setDeeper1",playlist)
                                    }
                                } else if (num === 2){
                                    let indexing = context.state.deeper2.indexOf(playlist)
                                    if (indexing === -1){
                                        // eslint-disable-next-line no-undef
                                        this.commit("setDeeper2",playlist)
                                    }
                                } else if (num === 22){
                                    let indexing = context.state.deeper22.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper22",playlist)
                                    }
                                } else if (num === 23){
                                    let indexing = context.state.deeper23.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper23",playlist)
                                    }
                                } else if (num === 3){
                                    let indexing = context.state.deeper3.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper3",playlist)
                                    }
                                } else if (num === 32){
                                    let indexing = context.state.deeper32.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper32",playlist)
                                    }
                                } else if (num === 33){
                                    let indexing = context.state.deeper33.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper33",playlist)
                                    }
                                } else if (num === 4){
                                    let indexing = context.state.deeper4.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper4",playlist)
                                    }
                                } else if (num === 5){
                                    let indexing = context.state.deeper5.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper5",playlist)
                                    }
                                } else if (num === 6){
                                    let indexing = context.state.deeper6.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper6",playlist)
                                    }
                                } else if (num === 7){
                                    let indexing = context.state.deeper7.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper7",playlist)
                                    }
                                } else if (num === 8){
                                    let indexing = context.state.deeper8.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper8",playlist)
                                    }
                                }else if (num === 9){
                                    let indexing = context.state.deeper9.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeeper9",playlist)
                                    }
                                } else if (num === 10){
                                    let indexing = context.state.deepers.indexOf(playlist)
                                    if (indexing === -1){
                                        this.commit("setDeepers",playlist)
                                    }
                                }
                                if (num === 2 || num === 22 || num === 23 || num === 3 || num === 32 || num === 33 || num === 7 || num === 4){
                                    setTimeout(async () => {
                                        let target = document.getElementById(parent.id)

                                        // console.log(target.children[1])
                                        let lst = target.children[1].children[0].children
                                        // console.log(lst)
                                        let newarray = []
                                        for await(let i of lst) {
                                            // console.log(i)
                                            newarray.push(i.offsetHeight)
                                        }
                                        // console.log(newarray.reduce((a, b) => a + b, 0))
                                        target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 300 + 'px'
                                    },100)
                                    window.addEventListener('resize',function (){
                                        setTimeout(async () => {
                                            let target = document.getElementById(parent.id)

                                            // console.log(target.children[1])
                                            let lst = target.children[1].children[0].children
                                            // console.log(lst)
                                            let newarray = []
                                            for await(let i of lst) {
                                                // console.log(i)
                                                newarray.push(i.offsetHeight)
                                            }
                                            // console.log(newarray.reduce((a, b) => a + b, 0))
                                            target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 300 + 'px'
                                        },0)
                                    })
                                } else if (num === 5 ) {
                                    setTimeout(async () => {
                                        let target = document.getElementById(parent.track.id)
                                        document.getElementById(parent.track.id)
                                        // console.log(target.children[1])
                                        let lst = target.children[1].children[0].children
                                        // console.log(lst)
                                        let newarray = []
                                        for await(let i of lst) {
                                            // console.log(i)
                                            newarray.push(i.offsetHeight)
                                        }
                                        // console.log(newarray.reduce((a, b) => a + b, 0))
                                        target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 300 + 'px'
                                    },100)
                                    window.addEventListener('resize',function (){
                                        setTimeout(async () => {
                                            let target = document.getElementById(parent.track.id)
                                            document.getElementById(parent.track.id)
                                            // console.log(target.children[1])
                                            let lst = target.children[1].children[0].children
                                            // console.log(lst)
                                            let newarray = []
                                            for await(let i of lst) {
                                                // console.log(i)
                                                newarray.push(i.offsetHeight)
                                            }
                                            // console.log(newarray.reduce((a, b) => a + b, 0))
                                            target.children[1].style.height = newarray.reduce((a, b) => a + b, 0) + 300 + 'px'
                                        },0)
                                    })
                                }else {
                                    setTimeout(async () => {
                                        let target = document.getElementById(parent.id)

                                        // console.log(target.nextElementSibling)
                                        let lst = target.nextElementSibling.children[0].children
                                        // console.log(lst)
                                        let newarray = []
                                        for await(let i of lst) {
                                            // console.log(i)
                                            newarray.push(i.offsetHeight)
                                        }
                                        // console.log(newarray.reduce((a, b) => a + b, 0))
                                        target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 300 + 'px'
                                    },100)
                                    window.addEventListener('resize',function (){
                                        setTimeout(async () => {
                                            let target = document.getElementById(parent.id)

                                            // console.log(target.nextElementSibling)
                                            let lst = target.nextElementSibling.children[0].children
                                            // console.log(lst)
                                            let newarray = []
                                            for await(let i of lst) {
                                                // console.log(i)
                                                newarray.push(i.offsetHeight)
                                            }
                                            // console.log(newarray.reduce((a, b) => a + b, 0))
                                            target.nextElementSibling.style.height = newarray.reduce((a, b) => a + b, 0) + 300 + 'px'
                                        },0)
                                    })
                                }
                            })
                    }))


                }).catch(error =>{
                if (error.response.status === 401){
                    axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                        // console.log(response.data)
                        if (response.status === 200){
                            this.thesoundof(name)
                        }
                    })
                }
            })
        },
        followPlaylist(context,payload){
            let playlist = payload.playlist,
                event = payload.event
            event.target.disabled = true
            if (playlist.followed === false) {
                axios.request({
                    url:'https://api.spotify.com/v1/playlists/' + playlist.id + '/followers',
                    method: 'put',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then(() =>{
                        playlist.followed = true
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                // console.log(response.data)
                                if (response.status === 200){
                                    context.dispatch('followPlaylist',{playlist:playlist,event:event})
                                }
                            })
                        }
                    })
            } else {
                axios.request({
                    url:'https://api.spotify.com/v1/playlists/' + playlist.id + '/followers',
                    method: 'delete',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then(() =>{
                        playlist.followed = false
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                // console.log(response.data)
                                if (response.status === 200){
                                    context.dispatch('followPlaylist',{playlist:playlist,event:event})
                                }
                            })
                        }
                    })
            }
        },
        followArtist(context,payload){
            let artist = payload.artist,
                event = payload.event
            event.target.disabled = true
            if (artist.followed === false) {
                axios.request({
                    url:'https://api.spotify.com/v1/me/following?type=artist&ids=' + artist.id,
                    method: 'put',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        if (response.status === 204){
                            artist.followed = true
                        }
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                // console.log(response.data)
                                if (response.status === 200){
                                    context.dispatch('followArtist', {name: name})
                                }
                            })
                        }
                    })
            } else {
                axios.request({
                    url:'https://api.spotify.com/v1/me/following?type=artist&ids=' + artist.id,
                    method: 'delete',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        if (response.status === 204){
                            artist.followed = false
                        }
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                // console.log(response.data)
                                if (response.status === 200){
                                    context.dispatch('followArtist',{artist:artist,event:event})
                                }
                            })
                        }
                    })
            }
        },
        followAlbum(context,payload){
            let album = payload.album,
                event = payload.event
            // console.log(album.followed)
            event.target.disabled = true
            if (album.followed === false) {
                axios.request({
                    url:'https://api.spotify.com/v1/me/albums?ids=' + album.id,
                    method: 'put',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        if (response.status ===200){
                            album.followed = true
                        }
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                // console.log(response.data)
                                if (response.status === 200){
                                    context.dispatch('followAlbum',{album:album,event:event})
                                }
                            })
                        }
                    })
            } else {
                axios.request({
                    url:'https://api.spotify.com/v1/me/albums?ids=' + album.id,
                    method: 'delete',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        if (response.status ===200) {
                            album.followed = false
                        }
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                // console.log(response.data)
                                if (response.status === 200){
                                    context.dispatch('followAlbum',{album:album,event:event})
                                }
                            })
                        }
                    })
            }
        },
        followTrack(context,payload){
            let track = payload.track,
                event = payload.event
            event.target.disabled = true
            if (track.followed === false) {
                axios.request({
                    url:'https://api.spotify.com/v1/me/tracks?ids=' + track.id,
                    method: 'put',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        if (response.status ===200){
                            track.followed = true
                        }
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                // console.log(response.data)
                                if (response.status === 200){
                                    context.dispatch('followTrack',{track:track,event:event})
                                }
                            })
                        }
                    })
            } else {
                axios.request({
                    url:'https://api.spotify.com/v1/me/tracks?ids=' + track.id,
                    method: 'delete',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        if (response.status ===200){
                            track.followed = false
                        }
                    })
                    .catch(error =>{
                        if (error.response.status === 401){
                            axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                                // console.log(response.data)
                                if (response.status === 200){
                                    context.dispatch('followTrack',{track:track,event:event})
                                }
                            })
                        }
                    })
            }
        },
        mouseOver: function (context,event){
            let target = event.target
            let audios = target.lastChild
            audios.play()
        },
        mouseLeave: function (context,event){
            let target = event.target
            let audios = target.lastChild
            audios.pause()
        },
        parentmouseOver: function (context,event){
            let target = event.target
            // console.log(target)
            let audios = target.firstChild.lastChild
            // console.log(audios)
            if (audios){
                audios.play()
            }
        },
        parentmouseLeave: function (context,event){
            let target = event.target
            // console.log(target)
            let audios = target.firstChild.lastChild
            // console.log(audios)
            if (audios){
                audios.pause()
            }
        },
        click: function (context,payload){
            let event = payload.event
            let target = event.target
            // console.log(target)
            let audios = target.lastChild
            // console.log(audios)
            if (context.state.currenttrack !=null && context.state.currenttrack !==audios){
                context.state.currenttrack.pause()
            }
            // console.log(audios.paused)
            if (audios.paused === false) {
                audios.pause()
            } else
                audios.play()

            this.commit("setCurrentTrack",audios)
        },
        parentClick: function (context,payload){
            let event = payload.event
            let target = event.target
            // console.log(target)
            let audios = target.firstChild.lastChild
            if (context.state.currenttrack !=null && context.state.currenttrack !==audios){
                context.state.currenttrack.pause()
            }
            if (audios.paused === false) {
                audios.pause()
            } else
                audios.play()
            this.commit("setCurrentTrack",audios)
        },
        specialClick: function (context,event){
            let target = event.target.parentElement
            // console.log(target)

            let audios = target.lastChild
            // console.log(audios)
            if (context.state.currenttrack !=null && context.state.currenttrack !==audios){
                context.state.currenttrack.pause()
            }
            if (audios.paused === false) {
                audios.pause()
            } else
                audios.play()
            this.commit("setCurrentTrack",audios)
        },
        searchClick: function (context,payload){
            let event = payload.event
            let target = event.target
            // console.log(target)
            let audios = target.parentElement.firstChild.lastChild
            if (context.state.currenttrack !=null && context.state.currenttrack !==audios){
                context.state.currenttrack.pause()
            }
            if (audios.paused === false) {
                audios.pause()
            } else
                audios.play()
            this.commit("setCurrentTrack",audios)
        },
        paginate(array,page_size,page_number){
            return array.slice((page_number -1) * page_size,page_number * page_size)
        },
        // eslint-disable-next-line no-unused-vars
        queuein(context,track){
            // console.log(track)
            let current = localStorage.getItem('queue')
            let newque = {}
            newque.id = track.id
            newque.name = track.name
            newque.artists = Lists.Ls(track.artists)
            if (track.album){
              newque.image = track.album.images[0]
            } else if (track.images[0]){
              newque.image = track.images[0]
            }
            let arr = JSON.parse(current)
            if (arr !== null){
              let indexing = arr.findIndex((arr) => arr.id === track.id)
              // console.log(indexing)
              if (indexing === -1){
                  arr.push(newque)
                  localStorage.setItem('queue',JSON.stringify(arr))
                  this.commit('setQueue',arr.length)
                  this.commit('setQueueArr',arr)
                // console.log(JSON.stringify(arr))
              }
            } else {
                let newarr = []
                newarr.push(newque)
                localStorage.setItem('queue',JSON.stringify(newarr))
                this.commit('setQueue',newarr.length)
                this.commit('setQueueArr',newarr)
              // console.log(JSON.stringify(newarr))
            }
        },
        savequeue(context){
            if (this.queuearr.length > 50){
                for (let i=0;i <this.queuearr.length; i++)
                    axios.request({
                        url:'https://api.spotify.com/v1/me/tracks?ids=' + context.state.queuearr.slice(i,i+49).map(a => a.id).join(','),
                        method: 'put',
                        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                    })
                        .then((response) =>{
                            if (response.status === 200){
                                localStorage.removeItem('queue')
                                this.commit('setQueue',0)
                                this.commit('setQueueArr',null)
                                // console.log('success 6394')
                            }
                        })
                        .catch()
            } else {
                axios.request({
                    url:'https://api.spotify.com/v1/me/tracks?ids=' + context.state.queuearr.map(a => a.id).join(','),
                    method: 'put',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) =>{
                        if (response.status === 200){
                            localStorage.removeItem('queue')
                            this.commit('setQueue',0)
                            this.commit('setQueueArr',null)
                            // console.log('success 6406')
                        }
                    })
                    .catch()

            }

        },
        removequeue(){
            localStorage.removeItem('queue')
            this.commit('setQueue',0)
            this.commit('setQueueArr',null)
        },
        removequeueitem(id){
            let que = JSON.parse(localStorage.getItem('queue'))
            const index = que.findIndex((arr) => arr.id === id)
            // console.log(index)
            if (index > -1) {
                que.splice(index, 1);
                let newa = JSON.stringify(que)
                localStorage.setItem('queue',newa)
                this.commit('setQueueArr',que)
            }
        },
        checkPlaylists(context){
            if (context.state.listplaylists.length === 0 ){
                let ne = {}
                ne.target = document.getElementById('playlistlist')
                context.dispatch('fetchPlaylists',{event:ne,offset:0})
            }
        },
        createplaylist(context){
            let name = prompt('Name for your playlist:', 'Discovered')
            axios.request({
                url:'https://api.spotify.com/v1/users/'+ document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1") +'/playlists',
                method: 'post',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")},
                data:{
                    name:name
                }
            })
                .then(() =>{
                    let ne = {}
                    ne.target = document.getElementById('playlistlist')
                    context.dispatch('fetchPlaylists',{event:ne,offset:0})
                    // console.log(this.listplaylists)
                })

        },
        hideall(context,payload){
            let elem = payload.elem
            // console.log(context)
            // console.log(elem)
            let all = document.querySelectorAll('.item-container > .rectrack')
            for (let i of all){
                if (i === elem){
                    i.style.display = 'block'
                    i.children[0].style.display = 'block'
                } else {
                    i.style.display = 'none'
                }
            }
        },
        saveQueueToPlaylist(context,event){
            let target = event.target.id
            let que = JSON.parse(localStorage.getItem('queue'))
            axios.request({
                url:'https://api.spotify.com/v1/playlists/'+ target + '/tracks?uris=spotify:track:' + que.map(a => a.id).join(',spotify:track:'),
                method: 'post',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                    if (response.status === 201){
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

    }
})
