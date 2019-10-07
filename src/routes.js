import Info from './component/Info.vue'
import Video from './component/Video.vue'
import Gallery from './component/Gallery.vue'
import ScaleEditMode from './component/ScaleEditMode.vue'
import Scale from './component/Scale.vue'
import ScaleHome from './component/ScaleHome.vue'
import Extended from './component/Extended.vue'
import GravitationalWaves from './component/GravitationalWaves.vue'
import EventHorizonTelescope from './component/EventHorizonTelescope.vue'
import PhotoFilters from './component/PhotoFilters.vue'
import PhotoFiltersExtend from './component/PhotoFiltersExtend.vue'
import QuantumGame from './component/QuantumGame.vue'

export default {
    routes: [        
            
        {
            path: '/scale-edit-mode',
            component: ScaleEditMode,
            name: 'scale-edit-mode',
            props: true
        },
        {
            path: '/gravitational-waves',
            component: GravitationalWaves,
            name: 'gravitational-waves',
            props: true
        },
        {
            path: '/event-horizon-telescope',
            component: EventHorizonTelescope,
            name: 'event-horizon-telescope',
            props: true
        },
        {
            path: '/photo-filters',
            component: PhotoFilters,
            name: 'photo-filters',
            props: true,
        },
        {
            path: '/photo-filters/:slug',
            component: PhotoFiltersExtend,
            name: 'photo-filter',
            props: true
        },
        {
            path: '/quantum-corridor',
            component: QuantumGame,
            name: 'quantum-corridor',
            props: true
        },
        {
            path: '/home',
            redirect: '/scale'
        },
        {
            path : '/',
            redirect: '/scale'
        },
        {
            path: '/scale',
            component: Scale,
            props: true,
            name: 'scale-of-universe',
            children: [
                {
                    path: 'info/:slug',
                    component: Info,
                    name: 'info',
                    props: true
                },
                {
                    path: 'extended/:slug',
                    component: Extended,
                    name: 'extended',
                    props: true
                }
            ]
        },    
    ]
}
