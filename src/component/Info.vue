<template>
    <div>
        <div class="info" v-show="show">
            <div class="popup__content">

                    <h1>{{ post.title }}</h1>

                    <div class="is__media" v-show="!extended">

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
                    <div class="popup__info" v-html="post.content"></div>
                    <a href="#"
                        class="is__close"
                        @click.prevent="close">
                        <i class="material-icons">close</i>
                    </a>
                    <button class="popup__more" v-show="extended" v-on:click="opendExtended">more</button>
                </div>
        </div>
        <div class="info__overlay"></div>
    </div>
</template>

<script>
    import axios from 'axios'
    import VueRouter from 'vue-router'
    import EventBus  from '../event-bus'
    import '@fancyapps/fancybox/dist/jquery.fancybox'

    export default {
        data() {
            return {
                'post': '',
                show : false
                
            }
        },
        props:{
            
        },
        created() {
            this.getInfo()
        },
        computed: {
            slug: function () {
                return this.$route.params.slug
            },
            item_id: function() {
                return this.$route.params.id
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
            videoThumbnail: function (){
                if(this.post.video_link){
                    console.log('hasVideo')
                    let str = this.post.video_link                    
                    let video_id = str.split('v=')[1]
                    let ampersandPosition = video_id.indexOf('&');
                    if(ampersandPosition != -1) {
                      video_id = video_id.substring(0, ampersandPosition)
                      
                    }
                    return '//img.youtube.com/vi/'+video_id+'/0.jpg'
                }        
            },            
            extended: function (){
                if(this.post.type == 'extended'){
                    return true
                }
            }

        },
        mounted: function () {
           
        },
        methods: {
            getInfo: function () {
                console.log(this.item_id)
                axios.get(ajaxBaseURL + 'index.php?rest_route=/poi/v1/post-id/' + this.item_id).then(response => {
                    this.post = response.data
                    let app = this
                    app.setScaleValue()

                    setTimeout(function () {
                        app.show = true
                    }, parseInt(app.$root.camera_speed))

                })
            },
            setScaleValue: function() {
                console.log('Info component emitting jump event', this.post.distance, this.post.size, this.item_id)
                EventBus.$emit('INFO_ENTRY',
                    {
                    detail: {
                        distance: this.post.distance,
                        size: this.post.size,
                    },
                })
            },
            close: function () {
                this.$router.push({name: 'scale-of-universe'})
                this.show = false
                if (this.$root.display.drawer_reopen === true) {
                    this.$root.display.drawer = true
                }

            },
            opendExtended: function() {
                //this.$root.display.drawer = false
                this.show = false
                this.$router.push({name: 'extended', params: {slug: this.slug, opened : true, id: this.item_id}})
                
            }
        }
    }
</script>