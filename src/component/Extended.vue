<template>

    <transition name="drawer">

        <div>
            <div class="open_details">
                <a @click.prevent="showDetails = !showDetails" href="#"><i class="material-icons">menu</i></a>
            </div>

        <div class="is" v-if="showDetails">

            <div class="is__inner">

                <div class="is__head">


                    <div class="is__back" v-if="usage == 'b'">
                        <a @click.prevent="close" href="#"><i class="material-icons">keyboard_backspace</i>Back to Scale</a>
                    </div>

                    <div class="is__title">{{post.title}}</div>

                    <div class="is__distance">
                        <i class="material-icons">power_input</i>
                        <span>10<sup>{{post.distance}}</sup> m</span>
                    </div>

                    <a href="#"
                        v-if="usage !== 'b'"
                        class="is__close"
                        @click.prevent="close">
                        <i class="material-icons">close</i>
                    </a>
                    <a href="#"
                        v-if="usage == 'b'"
                        class="is__close"
                        @click.prevent="showDetails = !showDetails">
                        <i class="material-icons">close</i>
                    </a>

                    <div class="is__info" v-html="post.short_desc"></div>

                    <div class="is__open" v-if="usage !== 'b' && this.showInteractive">
                        <a @click.prevent="start" href="#">open interactive</a>
                    </div>

                </div>

                <div class="is__content">

                    <div class="is__track">

                        <div class="is__media">

                            <a      class="is__video" 
                                    v-bind:data-fancybox="[hasVideo ? 'gallery' : '']"
                                    data-width = "1280"
                                    data-height = "720"
                                    data-ratio="16/9"
                                    v-bind:href="this.post.video_link"
                                    v-show="hasVideo"                                    
                                    >
                                <img v-bind:src="videoThumbnail" alt="Video Link">
                                <span class="is__media__icon"><i class="material-icons">play_arrow</i></span>
                            </a>
                            
                            <div class="is__gallery" v-show="hasGallery">
                                
                                <!-- <a v-bind:href="image.url" v-for="image in this.post.gallery" data-fancybox="gallery"><img v-bind:href="image.url"></a> -->
                                <a  
                                    v-for="image in this.post.gallery" 
                                    v-bind:data-thumb="image.url"
                                    v-bind:href="image.url"
                                    v-bind:alt="image.alt" 
                                    v-bind:description="image.description"
                                    v-bind:caption="image.caption"
                                    data-fancybox="gallery">
                                        <img v-bind:src="image.sizes.block">
                                          
                                </a>
                                <span class="is__media__icon"><i class="material-icons">camera_alt</i></span> 
                            </div>
                        </div>

                        <div class="is__section">

                            <div class="is__text">

                               <span v-html="post.more_info"></span>

                            </div>

                        </div>
                        <div class="is__section" v-if="post.link.length > 0">

                            <div class="is__text">

                                <h2>Further exploration</h2>

                                <ul>
                                    <li v-for="link in post.link">
                                        <a v-bind:href="link.link.url" target="_blank">{{link.link.title}}</a>
                                    </li>
                                </ul>

                            </div>

                        </div>
                         <div class="is__section" v-if="hasRelated">
                            <h2>Related items</h2>
                            
                        </div>
                        <div class="d-list" v-if="hasRelated">
                            <div class="d-list__inner">
                                <transition-group name="list" tag="div">
                                    <a v-if='item!=undefined' v-for="item in related"
                                       :key="item.slug"
                                       class="d-item"
                                       @click.prevent="openRelated(item)"
                                       :class="'d-item--' + item.type">
                                        <i class="material-icons">{{ item.icon }}</i>
                                        <span>{{ item.title }}</span>
                                    </a>
                                </transition-group>
                            </div>
                        </div>

                        

                        <!-- <div class="is__section">

                            <div class="is__text">

                                <h2>Share</h2>

                                <social-sharing 
                                        v-bind:url="shareLink"
                                        v-bind:title = "post.i_share_text"
                                        v-bind:description = "post.i_share_text"
                                        v-bind:quote = "post.i_share_text"
                                        v-bind:hashtags="tagNames"
                                        twitter-user="Perimeter"
                                        inline-template>
                                  <div>
                                      <network network="facebook">
                                        
                                        <ion-icon name="logo-facebook" size="large"></ion-icon>
                                        
                                        
                                      </network>
                                      <network network="twitter">
                                        <ion-icon name="logo-twitter" size="large"></ion-icon>
                                        
                                      </network>                  
                                  </div>
                                </social-sharing>

                            </div>

                        </div>
 -->
                    </div>

                </div>

            </div>

        </div>
        </div>

    </transition>

</template>

<script>
    import axios from 'axios'
    import VueRouter from 'vue-router'
    import EventBus  from '../event-bus'
    import '@fancyapps/fancybox/dist/jquery.fancybox'
    import store from './../store'


    export default {
        props: ['usage', 'fslug', 'fid'],
        data() {
            return {
                'post': '',
                store,
                showDetails: true,
                showInteractive: false
            }
        },
        created() {
            if( !this.$route.params.slug && this.fid == -1 )
                this.getInfofSlug()
            else
                this.getInfo()
            if(this.opened!=undefined){
                this.showDetails = this.opened
            }
            
        },
        watch: { 
            opened: function(val){
               // this.showDetails = val
            }
        },
        computed: {
            slug: function () {
                if ( this.$route.params.slug == undefined ) {
                    return this.fslug
                }
                return this.$route.params.slug
            },
            item_id: function() {
                if ( !this.$route.params.id ) {
                    return this.fid
                }
                return this.$route.params.id
            },
            opened: function() {
                this.showDetails = this.$route.params.opened
            },       
            related: function(){
                var ids = this.post.related
                var items = []
                if(ids){
                    for (var i=0; i<ids.length;i++){
                        var item = this.store.posts.find(item => item.id === ids[i])
                        items.push(item)
                    }
                    return items
                }              
            },            
            hasRelated: function() {
                if(this.related != undefined && this.related.length>0){
                    return true
                }
            },
            hasGallery: function() {
                if(this.post.gallery){
                    return true
                }
            },
            hasVideo: function() {
                if(this.post.video_link){
                    return true
                }
            },
            videoThumbnail(){
                if(this.post.video_link){
                    let str = this.post.video_link                    
                    let video_id = str.split('v=')[1]
                    let ampersandPosition = video_id.indexOf('&')
                    if(ampersandPosition != -1) {
                      video_id = video_id.substring(0, ampersandPosition)                      
                    }
                    return '//img.youtube.com/vi/'+video_id+'/0.jpg'
                }        
            },
            tagNames() {
                let tags=''
                if(this.post.tags){
                    for(let i=0; i<this.post.tags.length; i++){

                        tags = tags  + this.post.tags[i].name + ","
                    }
                    return tags
                }
            },               
            shareLink(){
                let getUrl = window.location
                let baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
                return baseUrl+this.post.i_slug
            }
        },
        methods: {
            close: function () {
                // this.$router.push({name: 'scale-of-universe'})
                let scale = this.post.distance - (1-this.post.size) + 0.2
                this.$router.push({ name: 'scale-of-universe', query: { value: scale } }) 
            
                if (this.$root.display.drawer_reopen === true) {
                    this.$root.display.drawer = true
                }
            },
            openRelated(item){
                this.$router.push({name: 'scale-of-universe'})
                if (this.$root.display.drawer_reopen === true) {
                    this.$root.display.drawer = true
                }
                this.$root.itemAction(item, true)
            },
            hideInfo(){

            },
            start: function () {               
                this.$router.push({name: this.post.i_slug, params: {id: this.item_id}})
            },            
            getInfo: function () {
                axios.get(ajaxBaseURL + 'index.php?rest_route=/poi/v1/post-id/' + this.item_id).then(response => {
                    this.post = response.data
                    if (this.post.interactive == true) this.showInteractive = true
                })
            },
            getInfofSlug: function () {
                axios.get(ajaxBaseURL + 'index.php?rest_route=/poi/v1/post/' + this.fslug).then(response => {
                    this.post = response.data
                    if (this.post.interactive == true) this.showInteractive = true
                })
            }
        }
    }
</script>

<style scoped>
    .open_details {
        display: block;
        position: absolute;
        text-decoration: none;
        top: 0;
        z-index: 12;
        
        width: 24px;
        height: 24px;
        left: 30px;
        top: 30px;

    }
    .open_details a{
        
        color: #9E9E9E;
        
    }
</style>