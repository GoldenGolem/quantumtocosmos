import Vue          from 'vue'
import VueRouter    from 'vue-router'
import VueCookie    from 'vue-cookie'
import VueTour      from 'vue-tour'
import VueHotkey    from 'v-hotkey'
import axios        from 'axios'
import _debounce    from 'lodash.debounce'
import _throttle    from 'lodash.throttle'
import store        from './store'
import routes       from './routes'
import EventBus     from './event-bus'
import VueMoment    from 'vue-moment'
// import VueTouch     from 'vue-touch/dist/vue-touch.js'
import SocialSharing from'vue-social-sharing'
import Vue2Touch from 'vue2-touch'

// var VueTouch = require('vue-touch/dist/vue-touch.js')
// Vue.use(VueTouch, {name: 'v-touch'})


require('vue-tour/dist/vue-tour.css')

Vue.use(VueRouter)
Vue.use(VueCookie)
Vue.use(VueTour)
Vue.use(VueHotkey)
Vue.use(SocialSharing)
// Vue.use(VueTouch)
Vue.use(Vue2Touch)
Vue.use(VueMoment)

const router = new VueRouter(routes)

const app = new Vue({
    router,
    data: store,
    mounted() {
        axios.get(ajaxBaseURL + 'index.php?rest_route=/poi/v1/posts').then(response => {
            this.posts.push(...response.data)
            EventBus.$emit('JSON_LOADED');
        })

        axios.get(ajaxBaseURL + 'index.php?rest_route=/poi/v1/categories').then(response => {
            this.filter.categories.push(...response.data)
        })

        this.determineView()
        window.addEventListener('resize', _throttle(this.determineView, 1000))
    },
    watch: {
        'display.categories'() {
            // generates some random hex
            let event = new CustomEvent('hello', {
                detail: {
                    what: (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)
                },
            })
            window.dispatchEvent(event)
        },
        view() {
            if (this.view === 'mobile') {
                this.switchMobile()
            } else {
                this.switchDesktop()
            }
        },
        items() {
            let filterStatus = false

            if (this.filter.categories.filter(
                item => item.active === true).length > 0) {
                filterStatus = true
            }

            if (this.filter.scaledistance.filter(
                item => item.active === true).length > 0) {
                filterStatus = true
            }

            // if (this.filter.types.filter(
            //     item => item.active === true).length > 0) {
            //     filterStatus = true
            // }

            // if (this.filter.featured === true) {
            //     filterStatus = true
            // }

            // if (this.filter.latest === true) {
            //     filterStatus = true
            // }

            this.filter.status = filterStatus
        }
    },
    computed: {
        items() {
            let elements = this.posts

            // if ( this.filter.scaledistance != '' ) {
            //     elements = this.filterByScdst(elements)
            // }
            if (this.filter.scaledistance.filter(item => item.active === true).length >
                0) {
                elements = this.filterByScaleDistance(elements)
            }

            if (this.filter.categories.filter(
                    item => item.active === true).length > 0) {
                elements = this.filterByCategory(elements)
            }

            if (this.filter.interactive === true) {
                elements = this.filterByInteractive(elements)
            }

            // if (this.filter.types.filter(item => item.active === true).length >
            //     0) {
            //     elements = this.filterByType(elements)
            // }

            if (this.filter.search !== '') {
                elements = this.filterBySearch(elements)
            }

            // if (this.filter.featured === true) {
            //     elements = this.filterByFeatured(elements)
            // }

            // if (this.filter.latest === true) {
            //     elements = this.filterByLatest(elements)
            // }

            return elements
        },
        activeCategories() {
            return this.filter.categories.filter(item => item.active === true)
        },
    },
    methods: {
        // filterByScdst(elements) {
        //     let type = this.filter.scaledistance

        //     return elements.filter(post => post.scaledistance == type)
        // },
        filterByType(elements) {
            let activeTypes = this.filter.types.filter(item => item.active === true),
                activeTypesLabels = activeTypes.map(item => item.label)

            return elements.filter(post => activeTypesLabels.includes(post.type))
        },
        filterByScaleDistance(elements) {
            let activeTypes = this.filter.scaledistance.filter(item => item.active === true),
                activeTypesLabels = activeTypes.map(item => item.label)
            console.log(activeTypesLabels);

            return elements.filter(post => activeTypesLabels.includes(post.scaledistance) && post.interactive !== true)
        },
        filterByCategory(elements) {
            let activeCategories = this.filter.categories.filter(item => item.active === true),
                activeCategoriesLabels = activeCategories.map(item => item.slug)

            return elements.filter(post => activeCategoriesLabels.some(v => post.category.indexOf(v) !== -1))
        },
        filterBySearch(elements) {
            let searchTerms = this.filter.search.trim().toLowerCase(),
                searchWords = searchTerms.split(' '),
                searchRegexDelim = searchWords.join('|'),
                regex = new RegExp(searchRegexDelim)

            return elements.filter(item => item.title.toLowerCase().search(regex) !== -1)
        },
        
        filterByInteractive(elements) {
            return elements.filter(item => item.interactive === true)
        },
        // filterByLatest(elements) {
        //     return elements.filter(item => item.latest === true)
        // },
        // filterByFeatured(elements) {
        //     return elements.filter(item => item.featured === true)
        // },
        itemAction(item, reopen) {

            this.display.drawer_reopen = reopen
            this.display.drawer = false
            if(this.$root.$children[0].$children[1] != undefined || this.$root.$children[0].$children[1] != null) {
                router.push({name: 'scale-of-universe'})
                this.$root.$children[0].$children[1].show = false
            }
            setTimeout(function() {
                if(item.type!="simple"){
                    router.push({name: "info", params: {slug: item.slug, id: item.id}})
                }
                EventBus.$emit('JUMP',
                    {
                    detail: {
                        distance: item.distance,
                        size: item.size,
                    },
                })
            },10);        
            
        },
        toggleCategory(category_id) {
            let category = this.filter.categories.filter(item => item.id === category_id)

            category[0].active = false
        },
        toggleFilter(filter) {
            this.filter[filter] = false
        },
        toggleFilterCategories() {
            this.display.filters = !this.display.filters
            this.display.categories = !this.display.categories
        },
        switchMobile() {
            this.display.filters = false
            this.display.categories = false
            this.display.search = false
        },
        switchDesktop() {
            this.display.filters = true
            this.display.categories = false
            this.display.search = true
        },
        determineView() {
            if (window.window.innerWidth < 768) {
                this.view = 'mobile'
            } else {
                this.view = 'desktop'
            }
        },
        clearFilters() {
            // this.filter.featured = false
            // this.filter.latest = false
            this.filter.interactive = false

            for (let index in this.filter.categories) {
                this.filter.categories[index].active = false
            }
            // for (let index in this.filter.types) {
            //     this.filter.types[index].active = false
            // }
            for (let index in this.filter.types) {
                this.filter.scaledistance[index].active = false
            }
        }
    },
}).$mount('#app')