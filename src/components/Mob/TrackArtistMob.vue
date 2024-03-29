<template>
  <div class="trackartist card2" style="gap: 16px;text-align: left" v-bind:key="'ta'+index">
    <template v-for="(ta,index) in d">
      <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="'art'+ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
        <div class="con3" v-if="ta.preview_url && ta.images[0]" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="this.$store.dispatch('click',{event:$event})">{{ta.name}}
          <audio preload="auto" v-bind:src="ta.preview_url"></audio>
        </div>
        <div class="con3" v-else-if="!ta.preview_url && ta.images[0]" style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" >{{ta.name}}
          <audio></audio>
        </div>
        <div class="con3" v-else-if="ta.preview_url && !ta.images[0]" style="text-align: left;" v-on:click="this.$store.dispatch('click',{event:$event})">{{ta.name}}
          <audio preload="auto" v-bind:src="ta.preview_url"></audio>
        </div>
        <div class="con3" v-else style="text-align: left; opacity: .5" >{{ta.name}}
          <audio></audio>
        </div>
        <div >{{ta.name}}
          <div>{{ta['followers']['total'] + ' followers'}}</div>
          <div style="display: flex">
            <template v-for="(g,index) in ta['genres']">
              <div v-if="g === ta['genres'][ta['genres'].length - 1]" v-on:click="thesoundofmob(g,num,'trackartist',false,item)" style="margin-left: 4px;" v-bind:key="'2'+index">{{g}}</div>
              <div v-else-if="g === ta['genres'][ta['genres'].length - 2]" v-bind:key="'3'+index" v-on:click="thesoundofmob(g,num,'trackartist',false,item)">{{g}} &</div>
              <div v-else v-bind:key="'4'+index" v-on:click="thesoundofmob(g,num,'trackartist',false,item)">{{g}},</div>
            </template>
          </div>
          <div style="color: rgb(240, 55, 165);" v-on:click="this.$store.dispatch('seedArtistM',{item:ta,num:num,sib:'trackartist',parent:item})">Recommended artists songs based on this</div>
          <div><button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
            Follow<input type="checkbox" v-if="ta.followed" @click.once="this.$store.dispatch('followArtist',{artist:ta,event:$event})"  checked v-model="ta.followed">
            <input type="checkbox" v-else @click.once="this.$store.dispatch('followArtist',{artist:ta,event:$event})" v-model="ta.followed">
          </div>
        </div>
      </div>
      <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
      <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
        <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
          <div v-if="tt.preview_url && tt.album.images[0]" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="this.$store.dispatch('click',{event:$event}),this.$store.dispatch('deeperTracksM',{item:tt,num:num,flag:false,sib:'trackartist',child:'art' + d[0].id,parent:item}); this.$store.dispatch('queuein',tt)">{{tt.name}}
            <audio v-bind:src="tt.preview_url"></audio>
          </div>
          <div v-else-if="!tt.preview_url && tt.album.images[0]" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5" v-on:click="this.$store.dispatch('deeperTracksM',{item:tt,num:num,flag:false,sib:'trackartist',child:'art' + d[0].id,parent:item}); this.$store.dispatch('queuein',tt)">{{tt.name}}
            <audio></audio>
          </div>
          <div v-else-if="tt.preview_url && !tt.album.images[0]" class="con3" v-on:click="this.$store.dispatch('click',{event:$event}), this.$store.dispatch('deeperTracksM',{item:tt,num:num,flag:false,sib:'trackartist',child:'art' + d[0].id,parent:item}); this.$store.dispatch('queuein',tt)">{{tt.name}}
            <audio v-bind:src="tt.preview_url"></audio>
          </div>
          <div v-else class="con3" style="opacity: .5" v-on:click="this.$store.dispatch('deeperTracksM',{item:tt,num:num,flag:false,sib:'trackartist',child:'art' + d[0].id,parent:item}); this.$store.dispatch('queuein',tt)">{{tt.name}}
            <audio></audio>
          </div>
        </div>
      </div>
      <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
      <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
      <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
      <div v-if="ta.type==='albums' && ta.length > 0 || ta.type==='single' && ta.length > 0 || ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="card2">
        <div v-for="(a,index) in ta" v-bind:key="index">
          <div v-if="a.preview_url && a.images[0]" class="con3" v-on:click="this.$store.dispatch('deeperAlbumMob',{item:a,num:num,child:'art' + d[0].id,search:false,parent:item}),this.$store.dispatch('click',{event:$event})" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }">{{a.name}}
            <audio preload="auto" v-bind:src="a.preview_url"></audio>
          </div>
          <div v-else-if="!a.preview_url && a.images[0]" class="con3" v-on:click="this.$store.dispatch('deeperAlbumMob',{item:a,num:num,child:'art' + d[0].id,search:false,parent:item})" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
            <audio></audio>
          </div>
          <div v-else-if="a.preview_url && !a.images[0]" class="con3" v-on:click="this.$store.dispatch('deeperAlbumMob',{item:a,num:num,child:'art' + d[0].id,search:false,parent:item}),this.$store.dispatch('click',{event:$event})">{{a.name}}
            <audio preload="auto" v-bind:src="a.preview_url"></audio>
          </div>
          <div v-else class="con3" v-on:click="this.$store.dispatch('deeperAlbumMob',{item:a,num:num,child:'art' + d[0].id,search:false,parent:item})" style="opacity: .5">{{a.name}}
            <audio></audio>
          </div>
        </div>
      </div>
      <div v-if="ta.type==='related-artists' && ta.length > 0" class="break" v-bind:key="index" >Related Artist</div>
      <div v-if="ta.type==='related-artists' && ta.length > 0"  v-bind:key="index" class="card2">
        <div v-for="(r,index) in ta" v-bind:key="index">
          <div v-if="r.preview_url && r.images[0]" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:click="this.$store.dispatch('click',{event:$event}),this.$store.dispatch('deeperartist',{item:r,track:ta[index],num:num,flag:false,sib:'trackartist',related:'art' + d[0].id})">
            <audio preload="auto" v-bind:src="r.preview_url"></audio>
          </div>
          <div v-else-if="!r.preview_url && r.images[0]" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5" v-on:click="this.$store.dispatch('deeperartist',{item:r,track:ta[index],num:num,flag:false,sib:'trackartist',related:'art' + d[0].id})">
            <audio></audio>
          </div>
          <div v-else-if="r.preview_url && !r.images[0]" tabindex="0" class="img-xs" v-on:click="this.$store.dispatch('click',{event:$event}),this.$store.dispatch('deeperartist',{item:r,track:ta[index],num:num,flag:false,sib:'trackartist',related:'art' + d[0].id})">
            <audio preload="auto" v-bind:src="r.preview_url"></audio>
          </div>
          <div v-else class="img-xs" style="opacity: .5" v-on:click="this.$store.dispatch('deeperartist',{item:r,track:ta[index],num:num,flag:false,sib:'trackartist',related:'art' + d[0].id})">
            <audio></audio>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import titleCase from "@/common/titleCase";
import axios from "axios";

export default {
  name: "track-artist",
  props: ['d','num','item'],
  methods: {
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
  }
}
</script>

<style scoped>

</style>