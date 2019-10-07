  <style>

    
    #sound-panel{
      position: absolute;
      height: 45px;
      width: 140px;
      bottom: 40px;
      left: calc(50% - 70px);
      background-color: rgb(245, 245, 245);
      border-radius: 22.5px;
      -webkit-box-shadow: 5px 5px 30px 0px rgba(0,0,0,0.14);
      -moz-box-shadow: 5px 5px 30px 0px rgba(0,0,0,0.14);
      box-shadow: 5px 5px 30px 0px rgba(0,0,0,0.14);
      display: inline-block;
    }
    .play-disabled{
      position: absolute;
      width: 25px;
      height: 25px;
      border-radius: 12.5px;
      top: 10px;
      left: 13px;
      cursor: default;
      opacity: 0.2;
      pointer-events: none;
    }
    .play-enabled{
      position: absolute;
      width: 25px;
      height: 25px;
      border-radius: 12.5px;
      top: 10px;
      left: 13px;
      cursor: pointer;
      opacity: 1;
      pointer-events: all;
    }
    .play-enabled:hover{
      opacity: 0.8;
    }
    .button-enabled{
      pointer-events: all;
      opacity: 1 !important;
    }
    .button-disabled{
      pointer-events: none;
      opacity: 0.2 !important;
    }
    #rec{
      position: absolute;
      width: 35px;
      height: 35px;
      border-radius: 17.5px;  
      top: 5px;
      left:52.5px;
      cursor: pointer;
    }
    .share-disabled{
      position: absolute;
      right: 8px;
      top: 13px;
      cursor: default;
      opacity: 0.2;
      pointer-events: none;
    }
    .share-enabled{
      position: absolute;
      right: 8px;
      top: 13px;
      cursor: pointer;
      opacity: 1;
      pointer-events: all;
    }
    .share-enabled:hover{
      opacity: 0.8;
    }
    #upload-image{    
      position: relative;
      left: 120px;
      top: 4px;
    }
    #share-audio{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.33);
      z-index: 999;
      text-align: center;
      display: none;
    }
    #audio{
      position: relative;
      top: 40%;
    }
    #close-audio{
      position: relative;
      top: 50%;
    }
    .overlay-img{
      position: absolute;
      bottom: 25%;
      z-index: 2;
      cursor: pointer;
      user-drag: none; 
      user-select: none;
      -moz-user-select: none;
      -webkit-user-drag: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }
    #mic-img{
      width: 37px;
      height: auto;
      left: 47.5%;
      display: block;
    }
    #visual-img{
      left: 50%;
      display: none;
      position: absolute;
      bottom: 40%;
      z-index: 2;
      cursor: pointer;
      user-drag: none; 
      user-select: none;
      -moz-user-select: none;
      -webkit-user-drag: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      height:150px;
      width: auto;
      transform-origin: 50% 50%;
      transition: transform;
      transition-timing-function: none;
      transition-duration: 0.7s;
    }
    
    #tooltip{
      top: 50%;
      left: 50%;
      width: 170px;
      height: 50px;
      position: absolute;
      background-color: #FFFFFF;
      display: none;
      color: #9E9E9E;
      pointer-events: none;
      border-radius: 2px;
      box-shadow: 0px 4px 10px #D1D1D1;
      text-align: center;
      z-index: 20;  
    }
    #tooltip:after{
      content: '';
      position: absolute;
      top: 50%;
      left: 100%;
      margin-top: -8px;
      width: 0; height: 0;
      border-left: 8px solid #FFFFFF;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
    }
    #tooltip-title{ 
      top:10px; 
      position: relative;
      font-size: 14px;
      font-weight: 600;

    }
    #tooltip-text{    
      position: relative;
      top:5px;
      font-size: 12px;

    }

    select, form label {
      font-family: inherit;
      background-color: transparent;
      width: 100%;
      padding: 4px;
      font-size: 16px;;
      color: #666;
      border: none;

      
    }
    select:focus {
    outline: none}
    /* Hide label */
    .mdl-selectfield label {
      /*display: none;*/
    }
    /* Use custom arrow */
    .mdl-selectfield select {
      appearance: none;
    }
    .mdl-selectfield {
      font-family: 'Roboto','Helvetica','Arial',sans-serif;
      position: relative;
    }



   .mdl-selectfield:after {
        position: absolute;

        /* Styling the down arrow */
        width: 0;
        height: 0;
        padding: 0;
        content: '';
        border-left: .25em solid transparent;
        border-right: .25em solid transparent;
        border-top: .375em solid $select-border-color;
        pointer-events: none;
    }

    #dropdowns{
      width: 150px;
      padding: 20px;
      
      position: absolute;
      right: 148px;
      top: 13px;
      
    }
    .selections{
      position: absolute;
      

    }

  </style>
<template>
  <div>
    <extended usage="b" fslug="gravitational-waves" :fid="fid"/>
    <div id="container"></div>    
    <div id="overlay-wrapper">
      <img id="mic-img" class="overlay-img" src="dist/assets/img/mic.png">           
      <img id="visual-img" class="visual-img-static" src="dist/assets/img/earth.png">
    </div>          

    <div id="tooltip">
      <p id="tooltip-title"></p>
      <p id="tooltip-text"></p>
    </div>
    
    <div id="dropdowns">

      <div class="mdl-selectfield" data-v-step="2">                     
            
            <select id="selections-images" class="selections browser-default" name="objects">
                <!-- <option value="" disabled>Choose</option> -->
                <option value="earth" selected>Planet Earth</option>                
                <option value="human">Human</option>
                <option value="cat">Cat</option>
                
            </select>

            <form id="upload-image" method="post" data-v-step="3">
              <label>Upload<input id="frontImage" type="file" accept="image/*" capture="user"></label>
            </form> 

            <select id="selections-sound" class="selections browser-default"  name="sound" data-v-step="9">
              <!-- <option value="" disabled selected>Choose</option> -->
              <option value="none">None</option>
              <option value="beat1" selected>Beat 1</option>
              <option value="beat2">Beat 2</option>
              <option value="beat3">Beat 3</option>

            </select>
        </div>

    </div>

    <!-- <div id="switch-wrapper" data-v-step="7">
      
      <label class="gravity-waves__switch">
        <i class="material-icons sound">volume_mute</i>
        <i class="material-icons visual">visibility</i>
        <input type="checkbox" id="switch">
        <span class="slider round"></span>
        
      </label>
      
    </div> -->
    <div id="sound-panel" data-v-step="8">
      <div disabled id="play" class="play-enabled">
        <img id="play-button" style="width: 25px;" src="dist/assets/img/play.png">
      </div>
      <div id="rec" class="button-enabled">
        <img id="rec-img" style="width: 35px;" src="dist/assets/img/record.png">
      </div>
      <div id="share" class="share-disabled">Share</div>
    </div>
    <div id="share-audio">
      <audio controls  id="audio"> </audio>
      <br>
      <button id="close-audio">Close</button>
    </div>
    <div class="welcome" data-v-step="0"></div>
<!--     <div class="welcome" data-v-step="1"></div>
    <div class="welcome" data-v-step="2"></div>
    <div class="welcome" data-v-step="3"></div>
    <div class="welcome" data-v-step="4"></div>
    <div class="welcome" data-v-step="5"></div>
    <div class="welcome" data-v-step="10"></div>
    <div class="welcome" data-v-step="12"></div> -->
        <div class="help-me">
            <button id="tour" v-on:click ="$tours['gwTour'].start()" type="button" data-v-step="1">
                <i class="material-icons">help</i>
            </button>
        </div>
        <v-tour name="gwTour" :steps="tourSteps" :options="tourOptions" :callbacks="tourCallbacks"></v-tour>
  </div>
</template>
<script>

const THREE = require('three');
const TrackballControls = require('three-trackballcontrols');
import store from './../store'
import Dispose from './Dispose'
import Raycaster from './Raycaster'
const Hammer = require('hammerjs');
import AudioControls from './audioControls';
import Extended from './Extended'
const Bounce = require ('bounce.js')

window.MediaRecorder = require('audio-recorder-polyfill')

export default {
  components: {
    Extended
  },
  mounted: function () {
    this.init()
    // this.display.drawer = false
    document.body.style.backgroundColor = '#E0E0E0'
    if(!this.$cookie.get('gw_guide_finished')){
        this.$tours['gwTour'].start()
    }  
  },
  created: function () {
      if(this.$route.params.id)
          this.fid = this.$route.params.id
  },
  data() {
      return {
          tourOptions: {
            useKeyboardNavigation: true
          },
          fid : -1,
          tourSteps: [
            {
              target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
              content: "<strong>WELCOME!</strong><br> To gravitational waves interactive" ,
              params: {
                placement: 'top'
              }
            },
            {
              target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
              content: "This little app will illustrate how spacetime acts like a fabric and how ripples in it would deform any object",
              params: {
                placement: 'top'
              }
            },
            {
              target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
              content: "For Example, the Earth",
              params: {
                placement: 'left'
              }
            },
            {
              target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
              content: "Click and hold anywhere to create an object",
              params: {
                placement: 'top'
              }
            },
            {
              target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
              content: "Releasing the click/tap creates a ripple in spacetime that deforms the object",
              params: {
                placement: 'top'
              }
            },
            {
              target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
              content: "drag the object around",
              params: {
                placement: 'top'
              }
            },
            {
              target: '[data-v-step="2"]',  // We're using document.querySelector() under the hood
              content: "Here you can change the object for a little fun. Cats, everyone loves cats.",
              params: {
                placement: 'bottom'
              }
            },
            {
              target: '[data-v-step="3"]',  // We're using document.querySelector() under the hood
              content: "Or upload your own image. See how ripples in spacetime affect your selfie.",
              params: {
                placement: 'left'
              }
            },
            {
              target: '[data-v-step="1"]',  // We're using document.querySelector() under the hood
              content: "You can play this tour again anytime by clicking on the question mark.",
              params: {
                placement: 'left'
              }
            },
            {
              target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
              content: "Have fun with this little physics experiment",
              params: {
                placement: 'top'
              }
            }
            // {
            //   target: '[data-v-step="7"]',  // We're using document.querySelector() under the hood
            //   content: "Here you can switch from visual to audio mode, which would play a representation of the gravitational wave. Please switch to audio",
            //   params: {
            //     placement: 'bottom'
            //   }
            // },
            // {
            //   target: '[data-v-step="8"]',  // We're using document.querySelector() under the hood
            //   content: "This area alows you to play/record the sounds you make with or without a background beat",
            //   params: {
            //     placement: 'top'
            //   }
            // },
            // {
            //   target: '[data-v-step="9"]',  // We're using document.querySelector() under the hood
            //   content: "Beats can be selected from this area",
            //   params: {
            //     placement: 'bottom'
            //   }
            // },
            // {
            //   target: '[data-v-step="10"]',  // We're using document.querySelector() under the hood
            //   content: "Drag the microphone around",
            //   params: {
            //     placement: 'bottom'
            //   }
            // },
            
          ],
          tourCallbacks: {
              onPreviousStep: this.tourPreviousStep,
              onNextStep: this.tourNextStep,
              onStop: this.tourStop
          },
      }
  },
  beforeRouteLeave(to, from, next) {
    next()
  },
  methods: {
    init(){
      /* init takes 2 argumnets: the minimum amount of pitch and the maximum */
      let isMobile = false;
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
          || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
          isMobile = true;
      /*
        Controller variables
      */
      let micSize = 30;
      let visualSize = 200;
      // simulation resolution
      let N = isMobile ? 50 : 150;
      var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
      if(isMac) N = 80
      // simulation size (in x and z directions)
      let W = 2200, H = 1200;
      let waveSpeed = 6.0;
      let waveLifeSpan = 100;
      let waveColor = '#c4c5ed';
      
      /*
        Global Variables
      */

      let currentSelection;
      let beat1,beat2,beat3;
      let dest, mediaRecorder;
      let element = document.querySelector('#container');
      let hammer = new Hammer(element);
      let overlayElement = document.querySelector('#overlay-wrapper');  
      let overlayHammer = new Hammer(overlayElement);
      let selectedOverlay = $("#mic-img");
      let isPlaying = false;
      let recStarted = false;

      let SELECTED = undefined;
      let selectedSound, targetSound = undefined;
      let scene, camera, renderer, plane, mass, mic, visual, human, earth, planeLines;
      let adding_mass = false;
      let isAudio = false;
      const textureLoader = new THREE.TextureLoader();
      let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      let img1, img2, img3, img4;
      let waveSound, waveSoundClone;
      let numberOfDefinedWaves = -1;
      let thingsToUpdate = [];
      let counter = 1;
      let scale = 1;
      let wave;
      let wavesToUpdate = [];
      let spherGrowthInterval = setInterval(function () {}, 1);
      let p; // intersection point on click.
      let wasIntersected;
      let isPanning = false;
      let needNewMap = false;
      let audioRecorded = false;

      AudioControls.init(5, 1000);

      /*
        Shaders
      */
      let vertShader = `         
        const int maxRipples = 20;
        uniform vec3 MOUSE_CLICKS[maxRipples];
        uniform float MULTIPLE_AMPLITUDES[maxRipples];
        uniform float initialMultiplier[maxRipples];
        uniform float afterMultiplier[maxRipples];
        uniform float waveMovement[maxRipples];
        uniform float waveWidth[maxRipples];
        uniform float waveMultiplier[maxRipples];

        const float SIGMA = 0.03;
        const float waveGap = 10.0;
        float interpolate (float x1, float x2, float x3, float y1, float y3) {
          return ((x2 - x1) * (y3 - y1)) / (x3 - x1) + y1;
        }
        void main() {
          vec3 p = position;
          for(int i = 0; i < maxRipples; i++) {
            float x = p.x - MOUSE_CLICKS[i].x;
            float z = p.z - MOUSE_CLICKS[i].z;
            float inverseAmplitude = 1.0;
            float after = 0.0;
            float initial = 0.0;

            if (MULTIPLE_AMPLITUDES[i] == 0.0) {
              inverseAmplitude = 1.0;
            } else {
              inverseAmplitude = 1.0 / MULTIPLE_AMPLITUDES[i];
              initial = -initialMultiplier[i] * MULTIPLE_AMPLITUDES[i] * exp( -SIGMA * inverseAmplitude * x * x) * exp( -SIGMA * inverseAmplitude * z * z);
              float outerCurve = exp( -SIGMA * 1.0/waveWidth[i] * x * x) * exp( -SIGMA * 1.0/waveWidth[i] * z * z);
              float innerCurve = exp( -SIGMA * 1.0/(waveWidth[i] - 20.0) * x * x) * exp( -SIGMA * 1.0/(waveWidth[i] - 20.0) * z * z);
              after = afterMultiplier[i] * MULTIPLE_AMPLITUDES[i] * ( outerCurve-innerCurve );
            }
            p.y += initial;

            if (distance(MOUSE_CLICKS[i],p) < waveMovement[i] + waveWidth[i]/2.0 && distance(MOUSE_CLICKS[i],p) > waveMovement[i]) {
              p.y += afterMultiplier[i] * waveMultiplier[i] * interpolate(distance(MOUSE_CLICKS[i],p), waveMovement[i], distance(MOUSE_CLICKS[i],p) +  waveWidth[i]/2.0, 0.0, -30.0);
            } else if (distance(MOUSE_CLICKS[i],p) < waveMovement[i] + waveWidth[i]/2.0 + waveGap && distance(MOUSE_CLICKS[i],p) > waveMovement[i] +  waveWidth[i]/2.0){
              p.y += afterMultiplier[i] * waveMultiplier[i] * 30.0;
            } else if (distance(MOUSE_CLICKS[i],p) < waveMovement[i] + waveWidth[i] + waveGap && distance(MOUSE_CLICKS[i],p) > waveMovement[i] + waveWidth[i]/2.0 + waveGap) {
              p.y += afterMultiplier[i] * waveMultiplier[i] * -interpolate(distance(MOUSE_CLICKS[i],p), waveMovement[i] + waveWidth[i]/2.0 + waveGap, distance(MOUSE_CLICKS[i],p) + waveWidth[i] + waveGap, -30.0, -90.0);
            }
          };
          vec4 mvPosition = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
          gl_Position = mvPosition;
      }`;

      let fragShader = `
        uniform vec3 color;
        uniform float opacity;
        varying float ampNormalized;
        uniform vec3 fogColor;
        uniform float fogNear;
        uniform float fogFar;
        void main() {
          vec3 c = color;
          gl_FragColor = vec4(c, opacity);
          #ifdef USE_FOG
              #ifdef USE_LOGDEPTHBUF_EXT
                  float depth = gl_FragDepthEXT / gl_FragCoord.w;
              #else
                  float depth = gl_FragCoord.z / gl_FragCoord.w;
              #endif
              float fogFactor = smoothstep( fogNear, fogFar, depth );
              gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
          #endif
      }`;

      /*
        Webgl functions
      */
      let initGL = function () {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        camera.position.z = 600;
        camera.position.y = 250;
        scene.add(new THREE.AmbientLight(0xffffff,1))
        renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor(0xffffff,0);
        document.querySelector('#container').appendChild( renderer.domElement );
        window.camera = camera;
        camera.lookAt( new THREE.Vector3(0,-150,200) );
        Raycaster.mouse = new THREE.Vector2();
        Raycaster.camera = camera;
        Raycaster.raycaster.near = camera.near;
        Raycaster.raycaster.far = camera.far;
        Raycaster.onClickEntityes = scene.children;
        Raycaster.container = element;     
        Raycaster.recursive = false;
        Raycaster.returnAllIntersections = true; 



        AudioControls.loadSounds({
          "waveSound":"dist/assets/sounds/wave_short.wav",
          "silent": "dist/assets/sounds/silent.wav",
          "beat1": "dist/assets/sounds/001.wav",
          "beat2": "dist/assets/sounds/002.wav",
          "beat3": "dist/assets/sounds/003.wav",
          });
        
        let planeGeometry = new THREE.PlaneGeometry(W, H, N, N);
        let planeMaterial = new THREE.MeshBasicMaterial({ color: 0x7F7FFF, opacity: 0, alphaTest: 0.9999 });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        for (let i = 0; i < planeGeometry.vertices.length; i = i + 2) {
            planeGeometry.vertices[i].x += W / N;
        }
        planeGeometry.verticesNeedUpdate = true;
        planeGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        scene.add(plane);

        let massGeometry = new THREE.SphereGeometry(1, 32, 32);
        let massMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        mass = new THREE.Mesh(massGeometry, massMaterial);

        textureLoader.load("dist/assets/img/ice.jpg", function(texture){
          img1 = texture;
        })
        textureLoader.load("dist/assets/img/blackhole.jpg", function(texture){
          img2 = texture;
        })
        textureLoader.load("dist/assets/img/massive_black_hole.jpg", function(texture){
          img3 = texture;
        })
        textureLoader.load("dist/assets/img/massive_black_hole.jpg", function(texture){
          img4 = texture;
        })        

			  scene.fog = new THREE.Fog( 0xe0e0e0, 400,800 );
        planeLines = new THREE.LineSegments(planeGeometry, new THREE.ShaderMaterial({
            uniforms: {
                color: {
                    value: new THREE.Color(waveColor)
                },
                initialMultiplier: {
                    type: 'v3v',
                    value: new Array(20).fill(0.0)
                },
                afterMultiplier: {
                    type: 'v3v',
                    value: new Array(20).fill(0.0)
                },
                waveWidth: {
                    type: 'v3v',
                    value:  new Array(20).fill(40.0)
                },
                waveMultiplier: {
                    type: 'v3v',
                    value:  new Array(20).fill(0.5)
                },
                opacity: {
                    value: 1.0
                },
                MOUSE_CLICKS: {
                    type: 'v3v',
                    value: new Array(20).fill(new THREE.Vector3())
                },
                waveMovement: {
                    type: "fv1",
                    value: new Array(20).fill(0.0)
                },
                MULTIPLE_AMPLITUDES: {
                    type: "fv1",
                    value: new Array(20).fill(0)
                },
                alreadyRecorded: {
                    type: "fv1",
                    value: new Array(20).fill(false)
                },
                fogColor:    { type: "c", value: scene.fog.color },
                fogNear:     { type: "f", value: scene.fog.near },
                fogFar:      { type: "f", value: scene.fog.far }
            },
            vertexShader: vertShader,
            fragmentShader: fragShader,
            fog: true
        }));

        scene.add(planeLines);
        // create web audio api context
        dest = audioCtx.createMediaStreamDestination();
        mediaRecorder = new MediaRecorder(dest.stream);
        mic = new THREE.Mesh(
          new THREE.SphereGeometry(0.001, 8, 8),
          new THREE.MeshLambertMaterial( { color: 0xff0000, transparent:true} )
        );
        let waveSoundPlaying = false;
        let dummyHelper = new THREE.Object3D();
        mic.name = "mic";
        mic.position.z = 475;
        let source;
        mic.removeMe = true;
        mic.update = function (frequency) {
          AudioControls.playWaveSound("highpass", frequency);
        }
        mic.stopUpdate = function () {
        }
        dummyHelper.add(mic);
        
        visual = new THREE.Mesh(
          new THREE.SphereGeometry(0.001, 8, 8),
          new THREE.MeshLambertMaterial( { color: 0x0000ff} )
        );
        visual.name = "visual";
        

        visual.update = function (delay) {
            console.log(delay)
            var bounce = new Bounce();
            let deformA = 1 + delay/100
            let deformB = 1 - delay/100

            console.log(deformA, deformB)

            bounce            
            .scale({
              from: { x: 1, y: 1 },
              to: { x: deformA, y: deformB },
              easing: "sway",
              duration: 1000,
              delay: 0,
              stiffness: 1,
              bounces:6
            })
            .scale({
              from: { x: 1, y: 1 },
              to: { x: deformB, y: deformA },
              easing: "sway",
              duration: 800,
              delay: 220,
              stiffness: 1,
              bounces:6
            })                          
            .applyTo(document.querySelectorAll("#visual-img"))
            .then(function() {
              bounce.remove() 
              console.log("Animation Complete"); 
            });                  
        }



        visual.stopUpdate = function () {}
        visual.position.z = 475;
        currentSelection = visual;
        dummyHelper.add(visual);

        scene.add(dummyHelper);

        // AudioControls.stopBackgroundSound();
        $("#selections-images").show();
        $("#upload-image").show();
        $("#selections-sound").hide();
        $("#sound-panel").hide();
        $("#mic-img").hide();
        $("#visual-img").show();
        currentSelection = visual;
        selectedOverlay = $("#visual-img");
        if(visual) visual.visible = true;
        if(mic) mic.visible = false;

        animate();
      }

      let Wave = function (position) {
        numberOfDefinedWaves++

        if (numberOfDefinedWaves >= 20)
            numberOfDefinedWaves = 0;

        planeLines.material.uniforms.MOUSE_CLICKS.value[numberOfDefinedWaves] = position;

        let startingSpan = 0;
        let growRate = 0;
        let enabled = false;
        let counter;
        let fadeTime = 0;
        let startTime = 0;
        let enable = function (bool) {
            enabled = bool;
        }
        let cate = 0.0;
        let spinning = 0;
        let setInitialWave = function (growthRate) {
          planeLines.material.uniforms.alreadyRecorded.value[counter] = false;
          planeLines.material.uniforms.MULTIPLE_AMPLITUDES.value[numberOfDefinedWaves] = growthRate;
          planeLines.material.uniforms.initialMultiplier.value[numberOfDefinedWaves] = 1.0;
          planeLines.material.uniforms.afterMultiplier.value[numberOfDefinedWaves] = 0.0;
          planeLines.material.uniforms.waveMovement.value[numberOfDefinedWaves] = 0.0;
          let waveSpanValue = growRate * 1.3;
          if(waveSpanValue >= 60.0) waveSpanValue = 60.0;
          planeLines.material.uniforms.waveWidth.value[numberOfDefinedWaves] = waveSpanValue;
          let waveHeightRatio = growthRate * 0.01;
          if (waveHeightRatio >= 2.0) waveHeightRatio = 2.0;
          planeLines.material.uniforms.waveMultiplier.value[numberOfDefinedWaves] = waveHeightRatio;

          cate = growthRate;
          startTime = growthRate / 5.0;
          growRate = growthRate;
          waveLifeSpan = growthRate * 5.0;
          fadeTime = growthRate * 3.0;
          spinning = Number(JSON.parse(JSON.stringify(growthRate)));

          counter = Number(JSON.parse(JSON.stringify(numberOfDefinedWaves)));
        }
        let setAmplitude = function () {
          if (!enabled) return;
          startingSpan++;
          if (startingSpan < startTime) {
            planeLines.material.uniforms.MULTIPLE_AMPLITUDES.value[counter] += 3.0;
            planeLines.material.uniforms.initialMultiplier.value[counter] -= 1 / startTime;
            planeLines.material.uniforms.afterMultiplier.value[counter] += 1 / startTime;
          } else if (startingSpan < waveLifeSpan) {
            cate += 3.0;
            planeLines.material.uniforms.MULTIPLE_AMPLITUDES.value[counter] += 5.0;
            planeLines.material.uniforms.initialMultiplier.value[counter] = 0;
            planeLines.material.uniforms.waveMovement.value[counter] += waveSpeed;
            let waveMinLimit = planeLines.material.uniforms.waveMovement.value[counter] - planeLines.material.uniforms.waveWidth.value[counter] ;
            let waveMaxLimit = planeLines.material.uniforms.waveMovement.value[counter] + 10;
            let dist = currentSelection.position.distanceTo(planeLines.material.uniforms.MOUSE_CLICKS.value[counter]);
            
            if (dist < waveMaxLimit * 1.3 && dist > waveMinLimit / 1.2 && !planeLines.material.uniforms.alreadyRecorded.value[counter]) {
                planeLines.material.uniforms.alreadyRecorded.value[counter] = true;
                // currentSelection.update(spinning * 10);
                mic.update(spinning);
               visual.update(spinning);
            }

          } else if (startingSpan < waveLifeSpan + fadeTime - 1) {
            planeLines.material.uniforms.MULTIPLE_AMPLITUDES.value[counter] -= cate / fadeTime;
            planeLines.material.uniforms.initialMultiplier.value[counter] = 0;
            planeLines.material.uniforms.afterMultiplier.value[counter] -= 1 / fadeTime;
            planeLines.material.uniforms.waveMovement.value[counter] += waveSpeed;
          } else {startingSpan = 0;
            planeLines.material.uniforms.MULTIPLE_AMPLITUDES.value[counter] = 0;
            planeLines.material.uniforms.initialMultiplier.value[counter] = 0;
            planeLines.material.uniforms.afterMultiplier.value[counter] = 0;
            enabled = false;
          }
        }
        return {
            setInitialWave: setInitialWave,
            setAmplitude: setAmplitude,
            enable: enable
        }
      };
      let timeID;
      const allTimes = [];
      const checkIfRenderTakesTooMuch = (newTime) => {
        allTimes.push(newTime);
        if(allTimes.length >= 100) allTimes.shift();
        let mediumTime = 0;
        for(let i=0;i<allTimes.length;i++) {
          mediumTime += allTimes[i];
        }
        let timeframe = mediumTime / allTimes.length;
        if(timeframe >= 300) {
          // alert("It seems things are running incredibly low. We suggest to upgrade your device or make sure you use your video card!App will now stop");
          // kill the renderer
          // cancelAnimationFrame(timeID);
        }
       
      }
      let lastTime = 0, thisTime = 0;
      let animate = function () {
        thisTime = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
        timeID = requestAnimationFrame( animate );
        renderer.render(scene, camera);
        thingsToUpdate.forEach(function(element){if(!element.removeMe) element.update(counter)});
        for (let i = 0; i < wavesToUpdate.length; i++) {
          wavesToUpdate[i].setAmplitude();
        }
        counter += 0.1;
        if (counter > 10) checkIfRenderTakesTooMuch(thisTime - lastTime)
        lastTime = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
      };


      /*
        Event functions
      */
      let maxGrowtInterval = setTimeout(function(){},10)
      let onMouseDown = function (e) {
        e.preventDefault();
        // prevent right or mmb clicks
        if (e.button === 1 || e.button === 2) return false;
        let vector;
        let theX = e.clientX || e.center.x;
        let theY = e.clientY || e.center.y;

        vector = new THREE.Vector3((theX / window.innerWidth) * 2 - 1, -(theY / window.innerHeight) * 2 + 1, 0.5);
        vector.unproject(camera);

        let intersected = Raycaster.cast(e);
        $("#tooltip").css({top: theY - $("#tooltip").height()/2, left: theX - $("#tooltip").width() - 20});
        $("#tooltip").show();
        if (intersected && intersected[0] && !intersected[0].object.name) {
          clearInterval(maxGrowtInterval);
           maxGrowtInterval = setTimeout(function(){
             clearInterval(spherGrowthInterval);
             
              adding_mass = false;
           },5000)

          adding_mass = true;
          wasIntersected = true;
          p = intersected[0].point;
          // create a new initial condition (droplet) based on clicked location
          mass.position.set(p.x, p.y, p.z);//

          mass.scale.x = scale;
          mass.scale.y = scale;
          mass.scale.z = scale;

          wave = new Wave(new THREE.Vector3(intersected[0].point.x, 0, intersected[0].point.z));
          wavesToUpdate.push(wave);

          let start = 0xFF0000,
              end = 0x00000, temp;

          spherGrowthInterval = setInterval(function () {
              let temp = (start).toString(16);
              if (temp.length < 8) {
                  temp = "0000000".substring(0, 8 - temp.length) + temp;
              }
              start -= 0xFF0000;
              scale += 0.2;
              changeMap(scale)
              mass.scale.x = scale * 0.7;
              mass.scale.y = scale * 0.7;
              mass.scale.z = scale * 0.7;
              wave.setInitialWave(scale);
              $("#tooltip").css({left: theX - $("#tooltip").width() - scale * 2 - 20});
              
          }, 10);

          scene.add(mass);
        }
      }

      let onMouseUp = function (e) {
        scene.remove(mass);
        if (wasIntersected) {
          $("#tooltip").hide();
          adding_mass = false;
          scale = 1; // adjust the multiplier to whatever
          clearInterval(spherGrowthInterval);
          wave.enable(true);
          wasIntersected = false;
        }
      }

      let changeMap = function (time) {
        if (time >= 0 && time < 25.0) {
          $("#tooltip-title").html("Neutron Star");
          $("#tooltip-text").html(Math.round((0.9 + time/20) * 10) / 10 + " solar masses");

          mass.material.map = img1;
        } else if (time >= 25.0 && time < 50.0) {
          $("#tooltip-title").html("Black Hole");
           $("#tooltip-text").html(Math.round(5 + time/2) + " solar masses");

          mass.material.map = img2;
        } else if (time >= 50.0 && time < 75.0) {
          $("#tooltip-title").html("Massive Black Hole");
           $("#tooltip-text").html(Math.round(100 + time*2) + " solar masses");
          mass.material.map = img3;
        } else if (time >= 75.0 && time < 100.0) {
          $("#tooltip-title").html("Supermassive black hole");
           $("#tooltip-text").html(Math.round(1000 + time*10) + " solar masses");
          mass.material.map = img4;
        }
        mass.material.needsUpdate = true;
      }

      let onMouseMove = function (event) {
        const intersected = Raycaster.cast(event); 
        document.getElementById("container").style.cursor = "default";
        if (!intersected) {
          document.getElementById("container").style.cursor = "default";
          return;
        }
        for(let i=0;i<intersected.length;i++) {
          if (intersected[i].object.name) {
            document.getElementById("container").style.cursor = "pointer";
          }
        }
      }

      let resizeWindow = function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix(); 
      }

      let stopRecorder = function () {
        if (recStarted) {
          selectedSound.disconnect(dest);
          if(!waveSound.removeMe) waveSound.disconnect(dest);
          isPlaying = false;
          selectedSound.disconnect(audioCtx.destination);
          mediaRecorder.stop();
          recStarted = false;
        }

      }

      let readURL = (input) => {
        return new Promise(function(resolve, reject) {
          let reader = new FileReader();
          if (input.files && input.files[0]) {
              reader.onload = function(e) {
                resolve(e.target.result);
              };
            reader.readAsDataURL(input.files[0]);
          }
        })
      };
   

      let playAndRecSongAudio = function (boolean) {
        $("#rec-img").attr("src","shapes/stop.png");
        targetSound = selectedSound;
        targetSound.connect(audioCtx.destination);
        targetSound.connect(dest);
        mediaRecorder.start();
      }        

      let stopAndRecSongAudio = function () {
        if (targetSound) {
          $("#rec-img").attr("src","shapes/record.png");
          targetSound.disconnect(audioCtx.destination);
          targetSound.disconnect(dest);
          mediaRecorder.stop();
          targetSound = undefined;
          recStarted = false;
        }
      }

      let toggleSongAudio = function () {
        if (!targetSound) {
          playAndRecSongAudio();
        } else {
          stopAndRecSongAudio();
        }
      }

      /*
        Events
      */

      $("#share").click(function(){
        $("#share-audio").show();
        stopAndRecSongAudio();
      });

      $("#close-audio").click(function(){
         $("#share-audio").hide();
      });

      $("#selections-images").change(function(){
        switch($("#selections-images")[0].value) {
          case "human":
            $("#visual-img").attr("src","dist/assets/img/woman.png");
            break;
          case "earth":
            $("#visual-img").attr("src","dist/assets/img/earth.png");
            break;
          case "cat":
            $("#visual-img").attr("src","dist/assets/img/cat.png");
          break;
        }
      })

      $("#selections-sound").change(function(ev){ 
        AudioControls.stopBackgroundSound();
        switch(ev.target.value) {
          case "none":
            AudioControls.setBackgroundSound("silent");
            break;
          case "beat1":
            AudioControls.setBackgroundSound("beat1");
            break;
          case "beat2":
            AudioControls.setBackgroundSound("beat2");
            break;
          case "beat3":
            AudioControls.setBackgroundSound("beat3");
            break;
        }
      });

      $("#play").click( () => {
        if(!AudioControls.backgroundIsPlaying) {
           $("#play-button").attr("src","dist/assets/img/pause.png");
           $("#rec").attr('class', 'button-disabled');
           AudioControls.playBackgroundSound();
           AudioControls.backgroudStopedPlaying = () =>{
              $("#play-button").attr("src","dist/assets/img/play.png");
              $("#rec").attr('class', 'button-enabled');
            }
        } else {
          $("#play-button").attr("src","dist/assets/img/play.png");
           $("#rec").attr('class', 'button-enabled');
           AudioControls.stopBackgroundSound();
        }
      })

      $("#rec").click(function(){
        if(!AudioControls.isRecording) {
          $("#rec-img").attr("src","dist/assets/img/stop.png");
          AudioControls.recordSounds();
           $("#play").attr('class', 'play-disabled');
           $("#share").attr('class', 'share-disabled');
           $("#switch-wrapper").css('pointer-events', 'none');
           $("#selections-sound").css('pointer-events', 'none');
           AudioControls.isRecording = true;
        } else {
          AudioControls.stopRecording();
          $("#play").attr('class', 'play-enabled');
          AudioControls.isRecording = false;
          $("#rec-img").attr("src","dist/assets/img/record.png");
           $("#switch-wrapper").css('pointer-events', 'all');
           $("#selections-sound").css('pointer-events', 'all');
           $("#share").attr('class', 'share-enabled');
        }

        AudioControls.mediaRecorder.addEventListener('stop', e => {
          let blob = new Blob(AudioControls.chunks, { 'type': 'audio/ogg; codecs=opus' });
          document.querySelector("audio").src = URL.createObjectURL(blob);
          AudioControls.isRecording = false;
          $("#share").attr('class', 'share-enabled');
          $("#play").attr('class', 'play-enabled');
          $("#rec-img").attr("src","dist/assets/img/record.png");
          $("#switch-wrapper").css('pointer-events', 'all');
          $("#selections-sound").css('pointer-events', 'all');
          $("#share").attr('class', 'share-enabled');
          });
      });

      $("#frontImage").change(function(e) {
          readURL(this).then(function(img){
            $("#visual-img").attr("src",img);
          });
      });

      $("#switch").change(function() {
        isAudio = !isAudio;
        if(isAudio) {
          visual.stopUpdate();
          $("#selections-sound").show();
          $("#selections-images").hide();
          $("#upload-image").hide();
          $("#sound-panel").show();
          currentSelection = mic;
          selectedOverlay = $("#mic-img");
          $("#mic-img").show();
          $("#visual-img").hide();
          if(visual) visual.visible = false;
          if(mic) mic.visible = true;
        } else {
          AudioControls.stopBackgroundSound();
          $("#selections-sound").hide();
          $("#selections-images").show();
          $("#upload-image").show();
          $("#sound-panel").hide();
          $("#mic-img").hide();
          $("#visual-img").show();
          currentSelection = visual;
          selectedOverlay = $("#visual-img");
          if(visual) visual.visible = true;
          if(mic) mic.visible = false;
        }
      });

      overlayHammer.on('pan panstart swipe', function(event) { 
        event.preventDefault();
        if (event.center.x && event.center.y) {
          selectedOverlay.css({top: event.center.y - selectedOverlay.height(), left: event.center.x - selectedOverlay.width()/2});
           let intersected = Raycaster.cast(event);
           if(intersected && intersected.length) {
             currentSelection.position.copy(intersected[0].point)
           }
        }

      });

      hammer.on('press', onMouseDown);
      // hammer.on('pressup', onMouseUp);
      $('#container').on('touchend mouseup', onMouseUp);

      document.addEventListener('mousemove', onMouseMove, false);
      // document.addEventListener('mousedown', onMouseDown, false);
      // document.addEventListener('mouseup', onMouseUp, false);
      window.addEventListener('resize', resizeWindow);

      initGL();
    },
    tourNextStep (step) {
        // console.log('[Vue Tour] A custom nextStep callback has been called on step ' + (step + 1))
        if (step === 1) {
            
        
        }
        if (step === 8) {
            
        }
    },
    tourPreviousStep (step) {
        console.log('[Vue Tour] A custom previousStep callback has been called on step ' + (step + 1))

        if (step === 2) {
          console.log('[Vue Tour] A custom previousStep callback has been called from step 2 to step 3')
        }
    },

    tourStop (step) {
        this.$cookie.set('gw_guide_finished', 'One year later', { expires: '1Y' });
        console.log('[Vue Tour] Finished')                
    }
  }
}

</script>