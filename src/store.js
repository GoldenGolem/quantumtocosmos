export default {
    posts: [],
    view: 'desktop',
    display: {
        drawer_reopen: true,
        drawer: false,
        categories: false,
        search: true,
        filters: true
    },
    camera_speed: 700,
    filter: {
        status: false,
        search: '',
        featured: false,
        interactive: false,
        latest: false,
        scaledistance: [
            {
                label: 'scale',
                active: false,
                icon: 'hdr_weak'
            },
            {
                label: 'distance',
                active: false,
                icon: 'keyboard_tab'
            } 
        ],
        categories: [],
        // types: [
        //     {
        //         label: 'interactive',
        //         active: false,
        //         icon: 'mouse'
        //     }, {
        //         label: 'gallery',
        //         active: false,
        //         icon: 'photo_camera'
        //     }, {
        //         label: 'video',
        //         active: false,
        //         icon: 'videocam'
        //     }, {
        //         label: 'info',
        //         active: false,
        //         icon: 'info'
        //     }
        // ]
    }
}