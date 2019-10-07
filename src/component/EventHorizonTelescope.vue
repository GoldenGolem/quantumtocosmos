<template>
    <div>
        <extended usage="b" fslug="event-horizon-telescope" opened="false" :fid="fid"/>
        <div id="eht_marker_wrapper" v-show="loaded3D">
        </div>
        <div class="eht end_screen" v-show="endScreen">
            <div class="elements">
                <h2>Great job!</h2>
                <p>You aligned the telescopes in {{this.timeNow | moment('subtract', this.startTimer + ' milliseconds', "mm:ss") }} to reveal the black hole at the centre of our galaxy.</p>
                <p>HighScore: {{ this.highScoreString }}</p>
                <button v-on:click="resetAll">
                    <label> RESTART </label>
                </button>
                <video id="final_loop" muted loop width="480" height="270" autoplay poster="/dist/assets/img/srga.jpg">
                 <source src="/dist/assets/vid/frame.mp4" type="video/mp4" />
                 <source src="/dist/assets/vid/frame.webm" type="video/webm"/>

                
                 <!-- <source src="path-to-ogv.ogv" type="video/ogg" /> -->
                </video>
                <!-- <h2>Challenge your friends</h2>
            
                <social-sharing url="http://138.197.151.180/#/event-horizon-telescope"
                          v-bind:title = "'Can you beat it? It took me ' + {{ this.timeNow | moment('subtract', this.startTimer + ' milliseconds', "mm:ss") }} + ' to see the black hole at the centre of our galaxy.'"
                          v-bind:description = "'Can you beat it? It took me ' + {{ this.timeNow | moment('subtract', this.startTimer + ' milliseconds', "mm:ss") }} + ' to see the black hole at the centre of our galaxy.'"
                          v-bind:quote = "'Can you beat it? It took me ' + {{ this.timeNow | moment('subtract', this.startTimer + ' milliseconds', "mm:ss") }} + ' to see the black hole at the centre of our galaxy.'"
                          hashtags="eht,blackHole,perimeter"
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
                </social-sharing> -->
            </div>
        </div>
        <transition name="drawerRight">
            <div id="telescope_wrapper" class="tele" v-show="showRightDrawer">
                <button id="tele_close_drawer"  v-on:click="closeRightDrawer"><i class="material-icons">chevron_right</i></button>
                <div class="tele__select" data-v-step="3">
                    <p class="tele__percent" id="solved" data-v-step="6" v-if="mobileview == true">
                        <span class="hide" v-bind:style="{left:pinSelected.alignment + '%'}">{{pinSelected.alignment}}%</span>
                        <em v-bind:style="{width:pinSelected.alignment + '%'}"></em>
                    </p>
                    <div class="tele__select__label">{{pinSelected.shortname}}</div>
                    <i class="material-icons">arrow_drop_down</i>
                    <select id="eht_select_array" v-model="selectedDropdown"  v-on:change="selectDropdown">
                        <option v-for="t_array in t_arrays">{{t_array.shortname}}</option>
                    </select>
                </div>

                <div class="tele__satelite" data-v-step="5">
                    <p class="tele__percent " id="total_solved" data-v-step="7" v-if="mobileview == true">
                        <span class="hide" v-bind:style="{left:totalAlignment + '%'}">{{totalAlignment}}%</span>
                        <em v-bind:style="{width:totalAlignment + '%'}"></em>
                    </p>
                    <div class="tele__info">
                        <p class="tele__title" id="telescope_title"><strong>{{pinSelected.title}}</strong></p><br>
                        <label id="telescope_status" class="tele__status" v-show="pinSelected.aligned">aligned</label>
                        <label id="telescope_status_perfect" class="tele__perfect" v-show="pinSelected.perfectAligned">perfect</label>
                    </div>
                    <div class="tele__time" v-show="counting">
                        
                        {{this.timeNow | moment('subtract', this.startTimer + ' milliseconds', "mm:ss") }}
                    </div>
                </div>

                <div class="tele__action" data-v-step="4">
                    <p class="tele__percent" id="solved" data-v-step="6" v-if="mobileview == false">
                        <span class="hide" v-bind:style="{left:pinSelected.alignment + '%'}">{{pinSelected.alignment}}%</span>
                        <em v-bind:style="{width:pinSelected.alignment + '%'}"></em>
                    </p>
                    <div class="tele__controls">

                        <div class="tele__control">

                            <p>Vertical: {{pinSelected.vertical}}</p>
                            <div class="tele__vertical"></div>
                            <input class="inputs" type="range" min="-80" max="80" value="0" step="1" id="vertical" v-model="pinSelected.vertical" @input="adjustTelescope" @mousedown = "inputsMouseDown" @mouseup = "inputsMouseUp">

                        </div>

                        <div class="tele__control">

                            <p>Horizontal: {{pinSelected.horizontal}}</p>
                            <div class="tele__horizontal"></div>
                            <input class="inputs" type="range" min="-180" max="180" value="0" step="1" id="horizontal" v-model="pinSelected.horizontal" @input="adjustTelescope" @mousedown = "inputsMouseDown" @mouseup = "inputsMouseUp">

                        </div>

                    </div>
                    <p class="tele__percent " id="total_solved" data-v-step="7" v-if="mobileview == false">
                        <span class="hide" v-bind:style="{left:totalAlignment + '%'}">{{totalAlignment}}%</span>
                        <em v-bind:style="{width:totalAlignment + '%'}"></em>
                    </p>
                </div>

                <div class="tele__universe" data-v-step="8">

                   <img src="/dist/assets/img/SrgA.jpg" alt="Black Hole">
                    
                    
                </div>

            </div>
        </transition>         
        <div id="container"></div>
        <div class="welcome" data-v-step="0"></div>
        <div class="welcome" data-v-step="1"></div>
        <div class="welcome" data-v-step="2"></div>
        <div class="welcome" data-v-step="10"></div>
        <div class="help-me">
            <button id="tour" v-on:click ="$tours['ehtTour'].start()" type="button" data-v-step="9">
                <i class="material-icons">help</i>
            </button>
        </div>
        <v-tour name="ehtTour" :steps="tourSteps" :options="tourOptions" :callbacks="tourCallbacks"></v-tour>
    </div>
</template>
<script>
    const THREE = require('three')
    const TWEEN = require('@tweenjs/tween.js')
    const OrbitControls = require('three-orbit-controls')(THREE)
    const ColladaLoader = require('three-collada-loader')
    require("expose-loader?$!jquery")
    import store from './../store'
    import Dispose from './Dispose'
    import Raycaster from './Raycaster'
    import DummyRigControls from './DummyRigControls'
    import Extended from './Extended'
    const Hammer = require('hammerjs')

    export default {
        components: {
            Extended
        },
        mounted: function () {

            this.init()
            //this.display.drawer = false
            if(!this.$cookie.get('eht_guide_finished')){
                this.$tours['ehtTour'].start()
            }
        },
        beforeDestroy: function () {
            window.removeEventListener('resize', this.updateViewport)
        },
        created: function () {
            if(this.$route.params.id)
                this.fid = this.$route.params.id
        },
        data () {
          return {
            tourOptions: {
              useKeyboardNavigation: true
            },
            fid: -1,
            mobileview: false,
            tourSteps: [
              {
                target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
                content: "<strong>WELCOME!</strong><br> To Event Horizon Telescope" ,
                params: {
                  placement: 'top'
                }
              },
              {
                target: '[data-v-step="1"]',  // We're using document.querySelector() under the hood
                content: "In this game, you will use the whole Earth as a telescope to see something incredible.",
                params: {
                  placement: 'top'
                }
              },
              {
                target: '[data-v-step="2"]',  // We're using document.querySelector() under the hood
                content: "Each pin is a telescope that is part of the EHT network of telescopes. Find them all by spinning the earth.",
                params: {
                  placement: 'right'
                }
              },
              {
                target: '[data-v-step="3"]',  // We're using document.querySelector() under the hood
                content: "Or by selecting them from the dropdown menu.",
                params: {
                  placement: 'left'
                }
              },
              {
                target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
                content: "Click on a pin and use the tools to aim the telescope at Sagittarius A*, the super massive black hole at the centre of our galaxy.",
                params: {
                  placement: 'right'
                }
              },
              {
                target: '[data-v-step="4"]',  // We're using document.querySelector() under the hood
                content: "Point the telescopes in the right direction by coordinating the vertical and horizontal orientation to a perfect alignment.",
                params: {
                  placement: 'left'
                }
              },
              {
                target: '[data-v-step="6"]',  // We're using document.querySelector() under the hood
                content: "You can see your progress for each telescope here",
                params: {
                  placement: 'left'
                }
              },
              {
                target: '[data-v-step="7"]',  // We're using document.querySelector() under the hood
                content: "You can see your progress for the all seven of the telescopes here",
                params: {
                  placement: 'left'
                }
              },
              {
                target: '[data-v-step="8"]',  // We're using document.querySelector() under the hood
                content: "Once you have aligned telescopes, the resulting picture will start to develop here.",
                params: {
                  placement: 'left'
                }
              },
              {
                target: '[data-v-step="9"]',  // We're using document.querySelector() under the hood
                content: "Use the question mark to see the tour again at any time.",
                params: {
                  placement: 'left'
                }
              },
              {
                target: '[data-v-step="10"]',  // We're using document.querySelector() under the hood
                content: "Play again and try to beat your time, or challenge your friends to align their telescopes faster than you.",
                params: {
                  placement: 'top'
                }
              }
            ],
            t_arrays: [
                {  
                    "shortname": "Chile",
                    "title":"APEX, ASTE, ALMA",
                    "location":"",
                    "lon":-22.9475831, 
                    "lat":-68.2128454,
                    "horizontal":40,
                    "vertical":35
                },
                {  
                    "shortname": "Hawaii (USA)",
                    "title":"JCMT, SMA",
                    "location":"",
                    "lon":24, 
                    "lat":-158,
                    "horizontal":10,
                    "vertical":-45
                },
                {  
                    "shortname": "Spain",
                    "title":"IRAM 30-meter telescope",
                    "location":"",
                    "lon":44.5020298, 
                    "lat":5.6439367,
                    "horizontal":22,
                    "vertical":23
                },
                {  
                    "shortname": "Greenland",
                    "title":"Greenland",
                    "location":"",
                    "lon":72.583333, 
                    "lat":-38.416667,
                    "horizontal":180,
                    "vertical":45
                },
                {  
                    "shortname": "Mexico Array",
                    "title":"LMT",
                    "location":"",
                    "lon":23, 
                    "lat":-96,
                    "horizontal":97,
                    "vertical":80
                },
                {  
                    "shortname": "Arizona (USA)",
                    "title":"ARO/SMT",
                    "location":"",
                    "lon":37, 
                    "lat":-115,
                    "horizontal":97,
                    "vertical":80
                },
                {  
                    "shortname": "South Pole",
                    "title":"South Pole Telescope",
                    "location":"",
                    "lon":-80, 
                    "lat":-115,
                    "horizontal":97,
                    "vertical":80
                }
            ],
            tourCallbacks: {
                onPreviousStep: this.tourPreviousStep,
                onNextStep: this.tourNextStep,
                onStop: this.tourStop
            },
            scene :null,
            camera :null, 
            renderer :null, 
            controls :null, 
            container :null,
            mobile: false, 
            earth :null, 
            earthRotationDummy :null, 
            hammer :null, 
            WIDTH :null, 
            HEIGHT :null,           
            tScene :null, 
            tCamera :null, 
            tRenderer :null,            
            tWIDTH :null, 
            tHEIGHT :null,
            earthRadius : 38,
            minAlignment : 98,
            imageOpned : false,
            DaeLoader:null,
            dropdownSelector : null,
            teleSatelite : null,
            tick : {value: 100},
            DummyRigControls,                        
            showRightDrawer : false,
            completedOnce: false,
            completedTime: '',
            timeNow : '00:00',
            loaded3D :false,
            finishedOnce: false,
            startTimer : null, 
            counting : false,

            telescope :null,
            /////Selected Telescope properties
            selectedDropdown: '',
            // selectedAligned : false,
            // selectedPerfect : false,
            // selectedAlignment: 0,
            // selectedVertical: 0,
            // selectedHorizontal: 0,
            totalAlignment: 0,
            timeNowMiliseconds: 0,
            highScore : null,
            highScoreString : null,
            endScreen : false,
            pinSelected : {
                vertical:0,
                horizontal:0,
                alignment:0,
                aligned: false,
                perfectAligned: false,
                title : '',
                shortname: '',
                dummy3d : null,
                div: null,
            }
          }
        },

        beforeRouteLeave(to, from, next) {
            next()
        },

        methods: {
            selectDropdown() { 
                this.pinSelected = this.selectPinByProperty("shortname", this.selectedDropdown)
                this.DummyRigControls.rotateToPoint(this.pinSelected.object3D.position)
                this.telescope.children[0].children[2].rotation.z = this.toRadians(this.pinSelected.vertical)
                this.telescope.children[0].rotation.y = this.toRadians(this.pinSelected.horizontal)
                this.tRenderer.render(this.tScene, this.tCamera)
                this.updateHTMLValues()
            },
            inputsMouseDown(e){
                $('.tele__percent span').removeClass('hide').addClass('show-flex');
            },            
            inputsMouseUp(e){
                $('.tele__percent span').removeClass('show-flex').addClass('hide');
            },
            init() {
                document.body.style.backgroundColor = '#E0E0E0'
                let appVueEHT = this;                
                let appVue = this;
                if ($(window).width() < 768) {
                    this.mobileview = true;
                }
                this.DaeLoader = new ColladaLoader()

                this.dropdownSelector = $("#eht_select_array")
                this.teleSatelite = $('.tele__satelite')
                
                //localStorage.setItem("poi_EHT_highscore", 124545454)
                this.highScore = localStorage.getItem("poi_EHT_highscore")
                this.setHighScoreString()
                console.log(this.highScoreString)
                console.log("do we have highscore", localStorage.getItem("poi_EHT_highscore"))
                console.log(this.highScore)
                this.initTelescopeScene()
                
                this.initGlobeScene()
            },               
            
            setHighScoreString() {
                var minutes = Math.floor(this.highScore / 60 / 1000)
                var seconds = Math.floor(this.highScore / 1000) - (minutes * 60)
                if (minutes < 10) minutes = '0' + minutes
                if (seconds < 10) seconds = '0' + seconds
                this.highScoreString = minutes + ':' + seconds
            },

            toRadians (degrees) {
                return degrees * Math.PI / 180
            },

            toDegrees (radians) {
                return radians * 180 / Math.PI
            },
            getRandomInt (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            interpolate (x1, x2, x3, y1, y3) {
                    return ((x2 - x1) * (y3 - y1)) / (x3 - x1) + y1
            },
            renderScene () {
                this.renderer.render(this.scene, this.camera)
            },
            adjustTelescope (){
                if(!this.endScreen){
                    if(this.counting==false){
                        this.counting = true;
                        this.startTimer = Date.now()
                    }
                    this.telescope.children[0].children[2].rotation.z = this.toRadians(this.pinSelected.vertical)
                    this.telescope.children[0].rotation.y =  this.toRadians(this.pinSelected.horizontal)

                    // this.pinSelected.vertical = this.selectedVertical
                    // this.pinSelected.horizontal = this.selectedHorizontal
                    this.tRenderer.render(this.tScene, this.tCamera)
                    this.calculateTelesopeAlignment()
                }
                

                          
                // this.selectedAlignment = this.pinSelected.alignment
            },
            calculateTelesopeAlignment() {

                var allPercetanges = 0, allArrays = this.t_arrays.length;

                for (var i = 0; i < allArrays; i++) {

                    let t_array = this.t_arrays[i]
                    var currentVSolved = 0, currentHSolved = 0, currentSolved = 0

                    currentVSolved = 100 - Math.abs((t_array.vertical - t_array.lon) / 160 * 100)
                    currentHSolved = 100 - Math.abs((t_array.horizontal - t_array.lat) / 360 * 100)

                    
                   //console.log(earth.children[i].userData.vertical + " - "+ earth.children[i].userData.targetVertical + " - "+  currentVSolved)
                    currentSolved = ((currentHSolved + currentVSolved) / 2).toFixed(0)
                    t_array.alignment = currentSolved;

                    allPercetanges += Number(currentSolved);

                    if (currentSolved > this.minAlignment) {
                        t_array.marker.addClass("solved")
                    }else{
                        t_array.marker.removeClass("solved") 
                    } 

                    if (currentSolved == 100) {
                        t_array.marker.addClass("solved_perfect")
                    }else{
                        t_array.marker.removeClass("solved_perfect") 
                    }
                }

                this.totalAlignment = (allPercetanges / allArrays).toFixed(0);
                let blurValue = this.interpolate(100, allPercetanges / allArrays, 0, 0, 20);
                    blurValue = Math.pow(blurValue, 3);
                   
                $(".tele__universe > img")
                    .css({
                        'filter': 'blur(' + blurValue + 'px)',
                        '-webkit-filter': 'blur(' + blurValue + 'px)',
                        '-moz-filter': 'blur(' + blurValue + 'px)',
                        '-o-filter': 'blur(' + blurValue + 'px)',
                        '-ms-filter': 'blur(' + blurValue + 'px)'
                    })
                if(this.pinSelected.alignment > this.minAlignment){
                   this.pinSelected.aligned = true
                }else{
                    this.pinSelected.aligned = false
                }
                if(this.pinSelected.alignment == 100){
                   this.pinSelected.perfectAligned = true
                }else{
                    this.pinSelected.perfectAligned = false
                }

                if(this.totalAlignment > this.minAlignment){
                    this.setHighscore()
                    this.endScreen = true
                    this.finishedOnce = true
                    this.counting = false

                    this.closeRightDrawer()
                    // this.timeNowMiliseconds = Date.now() - this.startTimer;

                    // let timeFormated = this.milisecondsToReadable(this.timeNowMiliseconds)
                    // this.completedTime = timeFormated[0] + " minutes and " + timeFormated[1] + " seconds"


                    // if(!this.imageOpned){
                    //     this.imageOpned = true;
                        
                        // var thisApp = this
                        // $.fancybox.open({
                        //     src: '#popup',
                        //     type: 'inline',
                        //     afterClose: function () {
                        //         thisApp.$router.push({name: 'event-horizon-telescope'})
                        //         thisApp.imageOpned = false;
                        //         // if (appVue.$root.display.drawer_reopen === true) {
                        //         //     appVue.$root.display.drawer = true
                        //         // }
                        //     }
                        // })

                    // }
                    
                }
            },
            milisecondsToReadable (miliseconds){
                miliseconds = Math.floor(miliseconds/1000)
                let minutes = Math.floor(miliseconds/60)
                return [minutes , miliseconds - minutes * 60]
            },
            initGlobeScene () {
                this.WIDTH = $('#container').width()
                this.HEIGHT = $('#container').height()
                this.scene = new THREE.Scene()
                var cameraz = 500
                if($(window).width() < 768) cameraz = 1000
                if($(window).width() < 375) cameraz = 1200
                this.camera = new THREE.PerspectiveCamera(10, this.WIDTH / this.HEIGHT, 1, cameraz)
                this.camera.position.set(0, 0, cameraz)

                this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
                this.renderer.setPixelRatio(window.devicePixelRatio)
                this.renderer.setSize(this.WIDTH, this.HEIGHT)

                this.container = document.querySelector('#container')
                this.container.appendChild(this.renderer.domElement)
                this.DummyRigControls.rotateSpeed = 0.07             
                this.DummyRigControls.dampingFactor = 0.05
                this.DummyRigControls.enabled = true
                this.DummyRigControls.autoRotateInterval = 600
                this.DummyRigControls.minVertical = -1.4
                this.DummyRigControls.maxVertical = 1.4
                this.DummyRigControls.init(this.camera, this.scene, this.container)
                var thisApp = this

                this.DummyRigControls.endRotation = function () {
                    thisApp.showRightDrawer = true
                    if($(window).width() >= 768)
                        $('#container').css({"width": "calc(100% - 412px)"})
                    else {
                        $('#container').css({
                            "top": "25%",
                            "left": "45%"
                        })
                        $('#eht_marker_wrapper').css({
                            "top": "25%",
                            "left": "45%"
                        })
                    }
                    DummyRigControls.enabled = false;
                    thisApp.updateViewport()
                }               

                this.hammer = new Hammer(container)

                var earth_color = '#FAFAFA',
                    ambientLight = new THREE.AmbientLight('#EEEEEE'),
                    hemiLight = new THREE.HemisphereLight(earth_color, earth_color, 0),
                    light = new THREE.PointLight(earth_color, 1, 10000)


                hemiLight.position.set(0, 5000, 0)
                light.position.set(0, 2000, 1000)

                this.scene.add(ambientLight)
                this.scene.add(hemiLight)
                this.scene.add(light)

                this.loadAssets()
                this.bindEvents()
                
            },
            closeRightDrawer(){
                this.showRightDrawer = false
                $('#container').css({"width": "100%"})
                $('#container').css({
                    "top": "0",
                    "left": "0"
                })
                $('#eht_marker_wrapper').css({
                    "top": "0",
                    "left": "0"
                })
                this.DummyRigControls.enabled = true
                this.updateViewport()
            },
            animateGlobeScene () {
                requestAnimationFrame(this.animateGlobeScene)
                this.renderScene()
                this.DummyRigControls.update()
                TWEEN.update()

                for (var i = 0; i < this.t_arrays.length; i++) {
                    var pos = this.toScreenPosition(this.t_arrays[i].object3D)
                    this.t_arrays[i].marker.css({top: pos.y + "px", left: pos.x + "px", position: "absolute"})
                    this.checkPinVisibility(this.t_arrays[i].object3D, this.t_arrays[i].marker)
                }
                if(this.counting){
                    this.timeNow = Date.now()
                }                
            },
            loadAssets () {
                this.DaeLoader.options.convertUpAxis = true
                var thisApp = this
                this.DaeLoader.load('/dist/assets/3d_objects/earth_low_poly.dae', function (collada) {
                    thisApp.earth = collada.scene
                    thisApp.earth.scale.set(1, 1, 1)
                    thisApp.earth.children[1].children[0].material = new THREE.MeshNormalMaterial()
                    thisApp.earth.position.set(0, 0, 0)
                    thisApp.earthRotationDummy = new THREE.Object3D()
                    thisApp.earthRotationDummy.position.set(0, 0, 0)
                    thisApp.earthRotationDummy.lookAt(thisApp.camera.position)
                    thisApp.scene.add(thisApp.earth)
                    thisApp.loaded3D = true
                    for (var i=0; i < thisApp.t_arrays.length; i++){
                        thisApp.addMarker(thisApp.t_arrays[i], i)                        
                    }
                    thisApp.animateGlobeScene()
                })
            },
            bindEvents () {
                window.addEventListener('resize', this.updateViewport)
                this.hammer.get('press').set({enable: true})
                this.hammer.on('press', function (e) {
                    onMouseDown(e)
                })
            },            
            loadTelescope () {
                this.DaeLoader.options.convertUpAxis = true
                var thisApp = this
                this.DaeLoader.load('/dist/assets/3d_objects/radio_telescope.dae', function (collada) {
                    thisApp.telescope = collada.scene;
                    thisApp.telescope.rotation.set(0,Math.PI/2,0);
                    thisApp.telescope.children[0].children[2].rotation.set(0,0,-80 + Math.random(160))
                    thisApp.telescope.scale.set(.1, .1, .1)
                    thisApp.tScene.add(thisApp.telescope)
                    thisApp.tRenderer.render(thisApp.tScene, thisApp.tCamera)
                })
            },
            addMarker (val, index) {

                var lonRad = val.lon * (Math.PI / 180)
                var latRad = -val.lat * (Math.PI / 180)
                
                var dummy = new THREE.Object3D()
                dummy.position.set(
                    Math.cos(lonRad) * Math.cos(latRad) * this.earthRadius,
                    Math.sin(lonRad) * this.earthRadius,
                    Math.cos(lonRad) * Math.sin(latRad) * this.earthRadius)

                this.earth.add(dummy)

                var defaultHorizontalPlane = new THREE.Vector3(0, -1, 0)
                var defaultVerticalPlane = new THREE.Vector3(0, 0, 1)

                var img = $('<div class="eht_marker" id="eht_marker_' + index + '"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 61 85" enable-background="new 0 0 61 85" xml:space="preserve"><path d="M31.75,0C48.318,0,61,12.488,61,29.057V30c0,21.834-19.322,49-29.75,55H31C20.572,79,0,51.834,0,30v-0.943  C0,12.488,13.932,0,30.5,0C30.667,0,31.583,0,31.75,0z"></path><path fill="#000000" d="M31.688,2C47.428,2,59,13.989,59,29.729v0.896C59,51.367,41.119,77,31.212,83h-0.237  C21.069,77,2,51.367,2,30.625v-0.896C2,13.989,14.76,2,30.5,2C30.659,2,31.529,2,31.688,2z"></path></svg></div>')
                // img.attr('src', "assets/svg/pin.svg")

                this.t_arrays[index].object3D = dummy
                this.t_arrays[index].marker = img
                
                img.appendTo('#eht_marker_wrapper')

                var thisApp = this

                img.click(function () {
                    // thisApp.pinSelected = thisApp.getDummyByProperty("name", "eht_marker_" + index)
                    thisApp.pinSelected = thisApp.t_arrays[index]
                    thisApp.telescope.children[0].children[2].rotation.z = thisApp.toRadians(thisApp.pinSelected.vertical)
                    thisApp.telescope.children[0].rotation.y = thisApp.toRadians(thisApp.pinSelected.horizontal)
                    thisApp.updateHTMLValues(thisApp.pinSelected)
                    DummyRigControls.rotateToPoint(dummy.position)
                    thisApp.tRenderer.render(thisApp.tScene, thisApp.tCamera)

                })
            },
            selectPinByProperty(property, value) {
                for (var i = 0; i < this.t_arrays.length; i++) {
                    
                    if (this.t_arrays[i][property] === value) {
                        return this.t_arrays[i]
                    }
                }
            },
            toScreenPosition(object) {
                var vector = new THREE.Vector3(0, 1, 0)
                vector.setFromMatrixPosition(object.matrixWorld)
                vector.project(this.camera)
                
                var widthHalf   = $('#container').width()/2 
                var heightHalf  = $('#container').height()/2

                vector.x = (vector.x * widthHalf) + widthHalf
                vector.y = -(vector.y * heightHalf) + heightHalf

                return vector
            },
            updateViewport () {
                let WIDTH = $('#container').width();
                let HEIGHT = $('#container').height();
                var sat_canvas = $('.tele__satelite canvas')[0];
                if(HEIGHT < 900 && HEIGHT > 300){
                    var h = HEIGHT/3.7;
                    var w = h*1.47333;
                    sat_canvas.style.height = h+"px";
                    sat_canvas.style.width = w+"px";
                }else{
                    sat_canvas.style.height = 300+"px";
                    sat_canvas.style.width = 442+"px";
                }
                this.camera.aspect = WIDTH / HEIGHT;
                this.camera.updateProjectionMatrix()
                this.renderer.setSize(WIDTH, HEIGHT)
                this.renderScene();                    
            },
            checkPinVisibility(pin, img) {

                var vector = new THREE.Vector3()
                vector.setFromMatrixPosition(this.camera.matrixWorld)
                var cameraToEarth = this.earth.position.clone().sub(vector)
                var L = Math.sqrt(Math.pow(cameraToEarth.length(), 2) - Math.pow(this.earthRadius, 2))

                var cameraToPin = pin.position.clone().sub(vector)

                if (cameraToPin.length() > L) {
                    img.fadeOut(100)
                } else {
                    img.fadeIn(100)
                }
            },
            resetAll(){

                this.counting = false
                this.timeNowMiliseconds = null

                for(let i=0; i < this.t_arrays.length; i++){
                    let t_array = this.t_arrays[i]
                    t_array.horizontal = this.getRandomInt(-180,180)
                    t_array.vertical = this.getRandomInt(-80,80)
                    t_array.aligned = 0
                    t_array.alignment = 0
                    t_array.perfectAligned =0
                    
                }
                this.totalAlignment = 0
               
                $('#eht_marker_wrapper').children().each(function () {
                    $(this).removeClass("selected")
                })
                $('#eht_marker_wrapper').children().each(function () {
                    $(this).removeClass("solved")
                })
                $('#eht_marker_wrapper').children().each(function () {
                    $(this).removeClass("solved_perfect")
                })
                this.calculateTelesopeAlignment()
                
                this.endScreen = false
                this.initGlobeScene()


            },
            updateHTMLValues() {

                this.calculateTelesopeAlignment()
                $('#eht_marker_wrapper').children().each(function () {
                    $(this).removeClass("selected")
                })
                
                this.pinSelected.marker.addClass("selected");
            },
            setHighscore() {
                console.log('loadedHighScore', this.highScore, this.timeNow, this.startTimer)
                if ((this.timeNow - this.startTimer) < this.highScore || !this.highScore) {
                    this.highScore = this.timeNow - this.startTimer
                    this.setHighScoreString()
                    localStorage.setItem("poi_EHT_highscore", this.highScore)
                }
            },
            initTelescopeScene () {
                this.tWIDTH = 442
                this.tHEIGHT = 300
                this.tScene = new THREE.Scene()
                this.tCamera = new THREE.PerspectiveCamera(18, this.tWIDTH / this.tHEIGHT, 1, 100)
                this.tCamera.position.set(0, 3.3, 20)
                

                this.tRenderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
                this.tRenderer.setPixelRatio(window.devicePixelRatio)
                this.tRenderer.setSize(this.tWIDTH, this.tHEIGHT)

                //this.tContainer = document.querySelector('#telescope_wrapper')
                this.teleSatelite.prepend(this.tRenderer.domElement)

                this.tScene.add(new THREE.HemisphereLight(0xFFFFFF, 0xCCCCCC, 0.97))

                var light1 = new THREE.PointLight(0x005dc4, 0.3)
                light1.position.set(-55, 45, 45)
                this.tScene.add(light1)

                var light2 = new THREE.PointLight(0xe24abc, 0.2)
                light2.position.set(55, 45, 45)
                this.tScene.add(light2)

                var light3 = new THREE.PointLight(0x7afea0, 0.2)
                light3.position.set(0, 50, 0)
                this.tScene.add(light3)

                this.loadTelescope()
                this.tRenderer.render(this.tScene, this.tCamera)                
            },
            tourNextStep (step) {
                // console.log('[Vue Tour] A custom nextStep callback has been called on step ' + (step + 1))
                if (step === 1) {
                    this.showRightDrawer = true
                    //getDummyByProperty("shortname", this.dropdownSelector.val()
                    this.pinSelected = this.t_arrays[0]

                    this.DummyRigControls.rotateToPoint(this.pinSelected.object3D.position)
                    this.telescope.children[0].children[2].rotation.z = this.toRadians(this.pinSelected.vertical)
                    this.telescope.children[0].rotation.y = this.toRadians(this.pinSelected.horizontal)
                    this.tRenderer.render(this.tScene, this.tCamera)
                    this.updateHTMLValues()
                
                }
                if (step === 8) {
                    this.closeRightDrawer()
                }
            },
            tourPreviousStep (step) {                

            },

            tourStop (step) {
                this.$cookie.set('eht_guide_finished', 'One year later', { expires: '1Y' });                               
            }


        }

    }
</script>
<style>
/*#container, canvas{
    -webkit-transition: all .2s cubic-bezier(0.445, 0.050, 0.550, 0.950); 
    transition: all .2s cubic-bezier(0.445, 0.050, 0.550, 0.950);
}*/
</style>
