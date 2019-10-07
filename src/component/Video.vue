<template>
    <div></div>
</template>

<script>
    import axios from 'axios'
    import VueRouter from 'vue-router'
    import '@fancyapps/fancybox/dist/jquery.fancybox'

    export default {
        data() {
            return {
                'post': '',
            }
        },
        created() {
            this.getInfo()
        },
        computed: {
            slug: function () {
                return this.$route.params.slug
            }
        },
        methods: {
            getInfo: function () {
                axios.get(ajaxBaseURL + 'index.php?rest_route=/poi/v1/post/' + this.slug).then(response => {

                    this.post = response.data

                    let app = this

                    // TODO: remove we have more stuff filled in
                    let videoLink = 'https://youtu.be/mPjgRKW_Jmk'

                    if ( this.post.info.video != null ) {
                        videoLink = this.post.info.video
                    }

                    setTimeout(function () {
                        $.fancybox.open({
                            src: videoLink,
                            media : {
                                youtube : {
                                    params : {
                                        autoplay : 0
                                    }
                                }
                            },
                            afterClose: function () {
                                app.$router.push({name: 'scale-of-universe'})

                                if (app.$root.display.drawer_reopen === true) {
                                    app.$root.display.drawer = true
                                }
                            }
                        })
                    }, parseInt(app.$root.camera_speed))

                })
            },
        }
    }
</script>