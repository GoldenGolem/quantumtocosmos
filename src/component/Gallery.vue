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

                    // TODO: remove we have more stuff filled in.
                    let images = [
                        {
                            src: 'http://www.photodenature.fr/wp-content/uploads/2014/09/photo-Lama-2.jpg',
                        },
                        {
                            src: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Lama-001.jpg',
                        }
                    ]

                    if ( this.post.info.gallery != null ) {
                        images = []

                        for(var img in this.post.info.gallery) {
                            images.push({ src: this.post.info.gallery[img].url})
                        }
                    }

                    let app = this
                    setTimeout(function () {
                        $.fancybox.open(images, {
                            buttons : [
                                'close'
                            ],
                            loop: true,
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