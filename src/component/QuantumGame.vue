<template>
<div>
    <extended usage="b" fslug="quantum-corridor" :fid="fid"/>
    <div id="container" style="cursor:none"></div>

    <div class="interface">
        <div class="score_value">{{scoreValue}}</div>
        <div class="active_helper_holder" v-show="showActivePower">
            <div class="active_helper" v-bind:style="{ width:  activePowerLoad + '%' }"></div>            
        </div>
        <p class="activePowerLabel" v-show="showActivePower">{{activePowerLabel}}</p>
        <div id="message">This is a message</div> 
        <div class="meessages_holder">
            
        </div>

        <div id="effects" class="noselect">
            <div class="loaded_indicators">                      
                
                <div class="effect_loaded" id="loaded_1" >
                    <transition name="fade-up">
                        <div class="qg__power" v-if='effect1IsAllowed'>
                            <span class="qg__power__label">A</span>
                        </div>
                    </transition>
                </div> 
                  
                <div class="effect_loaded" id="loaded_2">
                    <transition name="fade-up">
                        <div class="qg__power" v-if='effect2IsAllowed'> 
                            <span class="qg__power__label">S</span>
                        </div>
                    </transition>
                </div>
            
                <div class="effect_loaded" id="loaded_3">
                    <transition name="fade-up">
                        <div class="qg__power" v-if='effect3IsAllowed'>
                            <span class="qg__power__label" >D</span>
                        </div>
                    </transition>
                </div>
            
            </div>
            <div class="powers">
                <div class="circle noselect" id="effect1" data-v-step="5">
                    <canvas id="pie1" width=100 height=100></canvas>
                    <div class="effectImage"></div>
                </div>
               
                <div class="circle noselect" id="effect2" data-v-step="6">
                    <canvas id="pie2" width=100 height=100></canvas>
                    <div class="effectImage"></div>
                </div>
               
                <div class="circle noselect" id="effect3" data-v-step="7">
                    <canvas id="pie3" width=100 height=100></canvas>
                    <div class="effectImage"></div>
                </div>
            </div>
            
            

        </div>
        
    </div>
    
    <div id="preloader">Loading...Please Wait</div>
    <div id="score">
        
        <!-- <label>Total Distance</label> -->
    </div>
    
        
    <div id="highScore"></div>
    
    
    <div class="end_screen" v-show="endScreen">
         <div class="elements"> 

            <div id="gamestatistics" v-show="hasScore">
                <h2>This Round: {{scoreValue}}</h2>
                <h3 id="gHighScore">Highscore: {{highScore}}</h3>
<!--                 <p id="gthrown"></p>
                <p id="gmissed"></p>
                <p id="gscored"></p>
                <p id="gtotal"></p> -->
            </div>
            <div class="endMessage" v-show="hasScore">Try to beat your high score.<br>Use the quantum powers wisely!</div> 

            <h1 id="title" v-show="!hasScore">Quantum Corridor</h1>
            <p id="subtitle" v-show="!hasScore">How far can you get?</p>
            <button id="startgame" >
                <label v-show="!hasScore"> START </label>
                <label v-show="hasScore" > PLAY AGAIN </label>
            </button>             

            <!-- <div class="share_text" v-show="hasScore">
                <h2>Challenge your friends</h2>
                <p>Share your score and challenge your friends to beat you in the Quantum Corridor.</p>
            </div>

            <social-sharing url="http://138.197.151.180/#/quantum-corridor" v-show="hasScore"
                      v-bind:title = "'I just used quantum physics to reach a high score of ' + scoreValue + ' in the Quantum Corridor. Try it for yourself.'"
                      v-bind:description= "'I just used quantum physics to reach a high score of ' + scoreValue + ' in the Quantum Corridor. Try it for yourself.'"
                      v-bind:quote= "'I just used quantum physics to reach a high score of ' + scoreValue + ' in the Quantum Corridor. Try it for yourself.'"
                      hashtags="quantum,game,perimeter"
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
        <div class="welcome" data-v-step="0"></div>
        <div class="welcome" data-v-step="1"></div>
        <div class="welcome" data-v-step="2"></div>
        <div class="welcome" data-v-step="3"></div>
        <div class="welcome" data-v-step="4"></div>
        
        <div class="welcome" data-v-step="5"></div>
        <div class="welcome" data-v-step="9"></div>
        <div class="help-me">
            <button id="tour" v-on:click ="$tours['qgTour'].start()" type="button" data-v-step="8">
                <i class="material-icons">help</i>
            </button>
        </div>
        <v-tour name="qgTour" :steps="tourSteps" :options="tourOptions" :callbacks="tourCallbacks"></v-tour>
  </div>
</template>
<style type="text/css">

    social-sharing{
        margin-top: 20px;
    }
    .endMessage{
        margin-bottom: 30px;
    }
    .share_text h2{
        margin-top: 30px;
        margin-bottom:7px;
    }
    .share_text{
        margin-bottom: 10px
    }
    .interface{
        display: flex;
        z-index: 10;
        justify-content: center;
    }
    .score_value{
        color:white;
        position: absolute;
        right: 80px;
        top:30px;
        background-color: #49E4B9;
        z-index: 2;
        font-size: 20px;
        font-weight: 800;
        padding: 5px 10px 5px 10px;
        border-radius: 20px;
    }
    .meessages_holder{
        position: absolute;
        bottom: 250px;
        width: 100%
    }

    #message{
        
        z-index: 100;
        text-align: center;
        font-size: 20px;        
        text-align: center;
        color: white;
        font-weight: 600;
        background-color: #7F7FFF;
        padding: 5px 10px 5px 10px;
        border-radius: 20px;
        position: absolute;
        bottom: 200px;
        display: none;
    }
    .active_helper_holder, .active_helper,.activePowerLabel{

        left: calc(50% - 150px);;
        width: 300px;
        height: 15px; 
        
    }
    .active_helper_holder{
        border: 1px solid #DD3FB9;
        border-radius: 25px;
        overflow: hidden;
        position: absolute;
        top: 40px;
    }

    .active_helper{
        background-color: #DD3FB9;
    }

    .activePowerLabel{
        color:#7F7FFF;
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        position: absolute;
        top:70px;
        z-index: 2;
    }
    .powers{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .loaded_indicators{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    

    .circle{
        border-radius: 50%;
        background-color: #49E4B9;
        z-index: 8;
        width: 100px;
        height: 100px; 
        position: relative;
        margin:0 5px;
    }
    .effectImage{
        background-position: center; 
        background-size: 90px;
        background-repeat: no-repeat; 
        width: 90px;
        height: 90px;
        position: absolute;
        top: 5px;
        left:5px;
        border-radius: 50%;
    }

    .circle:hover{
        /*border: 5px solid #DD3FB9;*/
    }


    #title{

        text-align: center;
        font-size: 28px;
        padding-bottom: 7px;
        font-weight: 600;
    }
    #subtitle{
        padding-bottom: 30px;
    }
    #effects{
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        position: absolute;
        bottom: 20px;
    }
/*    #effect1{

        cursor: pointer;
        left: calc(50% - 170px);
    }
    #effect2{

        cursor: pointer;

        left: calc(50% - 50px);
    } 
    #effect3{
        cursor: pointer;

        left: calc(50% + 70px);
    }*/    
    #effect1 .effectImage{
        /*background-color: rgb(66, 0, 0);*/
        background-image: url("/dist/assets/img/qc_uncertanty.jpg");

    }
    #effect2 .effectImage{
        /*background-color: rgb(0, 66, 0);*/
        background-image: url("/dist/assets/img/tunnel.jpg");

    } 
    #effect3 .effectImage{
        /*background-color: rgb(0, 0, 66);*/
        background-image: url("/dist/assets/img/entanglement.jpg");
    }     

  
    #preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 100px;
        background-color: #fafafa;
        z-index: 99;
        font-size: 30px;
        text-align: center;
        display: none;
    }
    #gamestatistics{
        z-index: 10;
        font-size: 16px;
        font-weight: 600;


    }
    #gamestatistics h2{
        margin-bottom: 10px;
    }
    #gamestatistics h3{
        margin-bottom: 10px;
    }

</style>
<script>
//import * as THREE from 'three'
const THREE = require('three')
import store from './../store'
import Dispose from './Dispose'
import Raycaster from './Raycaster'
const Hammer = require('hammerjs')
const TWEEN = require('@tweenjs/tween.js')
import AudioControls from './audioControls'
import Extended from './Extended'

export default {
    components: {
        Extended
    },
    mounted: function () {
        this.init()
        // this.display.drawer = false
        
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this.resizeWindow);
        window.removeEventListener('keydown', key.downHandler.bind(key));
        window.removeEventListener('keyup', key.upHandler.bind(key));
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
          fid: -1,
          tourSteps: [
            {
              target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
              content: "<strong>WELCOME!</strong><br> to the Quantum Corridor game" ,
              params: {
                placement: 'top'
              }
            },
            {
              target: '[data-v-step="1"]',  // We're using document.querySelector() under the hood
              content: "In this little game we'll see some weird quantum physics phenomenon in action",
              params: {
                placement: 'top'
              }
            },
            {
              target: '[data-v-step="2"]',  // We're using document.querySelector() under the hood
              content: "The purpose is to get as far as possible and avoid the obstacles",
              params: {
                placement: 'top'
              }
            },
            {
              target: '[data-v-step="3"]',  // We're using document.querySelector() under the hood
              content: "Move the ball left and right to avoid collisions. You can use mouse, arrow keys or your finger.",
              params: {
                placement: 'top'
              }
            },
            {
              target: '[data-v-step="4"]',  // We're using document.querySelector() under the hood
              content: "When it seems like there's no way out, use the 'Quantum Powers' at the botttom<br> use the A, S, D keys to activate them",
              params: {
                placement: 'top'
              }
            },
            {
              target: '[data-v-step="5"]',  // We're using document.querySelector() under the hood
              content: "<strong>(A) Quantum Uncertainty:</strong>  The location of quantum particles can’t ever be measured exactly. Use this power to make your position uncertain at the edges of barriers. If you’re lucky you’ll make it through!",
              params: {
                placement: 'bottom'
              }
            },
            {
              target: '[data-v-step="6"]',  // We're using document.querySelector() under the hood
              content: "<strong>(S) Quantum Tunneling:</strong> Quantum particles can sometimes “tunnel” through walls.  Use this power to help you pass right through the barriers. The thinner the wall, the better your chances!",
              params: {
                placement: 'top'
              }
            },
            {
              target: '[data-v-step="7"]',  // We're using document.querySelector() under the hood
              content: "<strong>(D) Entanglement:</strong>  Two quantum particles can be “entangled” allowing both to behave in the same way. Set up an entangled pair and double your chance of survival. ",
              params: {
                placement: 'top'
              }
            },
            {
              target: '[data-v-step="8"]',  // We're using document.querySelector() under the hood
              content: "If you feel like you missed something this guide can be started by pressing this help icon.",
              params: {
                placement: 'left' 
              }
            },
            {
              target: '[data-v-step="9"]',  // We're using document.querySelector() under the hood
              content: "That's it, let's really get going.",
              params: {
                placement: 'top'
              }
            },
          ],
          tourCallbacks: {
              onPreviousStep: this.tourPreviousStep,
              onNextStep: this.tourNextStep,
              onStop: this.tourStop,
              onStart: this.tourStart
          },
          isPlaying : true,
          scoreValue : 0,
          activePowerLoad : 0,
          showActivePower : false,
          activePowerLabel : '',
          hasScore : false,
          highScore: 0,
          endScreen: true,
          effect1IsAllowed: true,
          effect2IsAllowed: true,
          effect3IsAllowed: true,
      }
    },
    beforeRouteLeave(to, from, next) {
        next()
    },
    methods: {
        resizeWindow(evt) {
            renderer.setSize(window.innerWidth, window.innerHeight)
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
        },
        init() {
            $('body').addClass('overlay')
           
            document.body.style.backgroundColor = '#E0E0E0'
            var thisApp = this
            /*
                Use this variables to control the app
            */
            let qDotRadius = 0.7;
            let cloudRadius = 6.5; //uncertanty cloud radius
            let ran = 8; // obstacle frequency
            let ballSpeed = 1;
            let camOffset = 100;


            let scene, camera, renderer, world;
            let container = document.querySelector('#container'), preloader = document.querySelector('#preloader');
            let hammer = new Hammer(container);
            let obstacles = [], obstacleLimit = 200, ball, spawnerRange = 50, obstacleHolder;

            let score = 0;
            

            let timeNow, timeThen;
            let timeStep;
            let GROUP1 = 1; // ground
            let GROUP2 = 2; // obstacles
            let GROUP3 = 4; // ball
            let obstacleMinWidth = 2, obstacleMaxWidth = 10;

            let projectiles = 1;
            let helper1 = 100;
            let helper2 = 100;
            let helper3 = 100;

            let getEffect = false;
            let planeSize = 300;
            let camMovement = 1;
            let speedIncrement = 0.3;
            let speedDefault = 1;
            let speedIncrementEvery = 300;
            let speedInitialEndValue = 100;
            let isDead = false;
            let strafeIncrement = 3;


            //PieSlice
            let canvasEffect1 = document.getElementById("pie1");
            let effect1_ctx = canvasEffect1.getContext("2d");
            let canvasEffect2 = document.getElementById("pie2");
            let effect2_ctx = canvasEffect2.getContext("2d");
            let canvasEffect3 = document.getElementById("pie3");
            let effect3_ctx = canvasEffect3.getContext("2d");
           
            const CIRCLE_CONVERT = 2*Math.PI/100;

            let effect1Charged;
            let effect2Charged;
            let effect3Charged;

            /*
                Main app function
            */

            let totalAdvanced = 0.0;
            let initialSpeedIncrement = 0.0;


            $("#startgame").click(function(){
                effect1.style.display = 'block';
                effect2.style.display = 'block';
                effect3.style.display = 'block';
                startGame();
            })
            let gameRunning = false;

            function startGame () {
                isDead = false;
                $("#effects").fadeIn(400);
                $("#effect1").show();
                $("#effect2").show();
                $("#effect3").show();
                thisApp.showActivePower = false;               
                thisApp.endScreen = false
                $('body').removeClass('overlay')

                
                for(var i=0;i<planes.length;i++) {
                    if(planes[i]){
                        if(planes[i].geometry) planes[i].geometry.dispose();
                        if(planes[i].material) planes[i].material.dispose();
                        if(planes[i].parent) scene.remove(planes[i]);
                    }
                }
                planes = [];
                planesUsed = 0;
                const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize, planeSize/10, planeSize/10);
                const planeMaterial = new THREE.MeshBasicMaterial( {color:0x7f7fff, wireframe:true} );
                 planes[planesUsed] = new THREE.Mesh(planeGeometry, planeMaterial);
                //planes[planesUsed] = new THREE.GridHelper( planeSize, planeSize/10, 0x7f7fff,0x7f7fff );
                planes[planesUsed].rotation.x = Math.PI / 2;
                scene.add(planes[planesUsed]);
                planeFocus = planes[planesUsed];
                planesUsed++
                gameRunning = true;
                camera.position.set(0, 30, 100);
                ball.mesh.position.set(0,qDotRadius/2,0);
                ball.plane.position.set(0,qDotRadius/2,0);
                stopEffect1();
                stopEffect2();
                stopEffect3();

                effect1Charged = 100;
                effect2Charged = 100;
                effect3Charged = 100;

                incrementCounter = 0;
                totalAdvanced = 0;
                computedSpeedtIncrement = 0;
                
                resetVariables();
                
                thisApp.highScore = localStorage.getItem("poi_QC_highscore")         
                
                animate();
                if(!thisApp.$cookie.get('qg_guide_finished')){
                    thisApp.$tours['qgTour'].start()
                    thisApp.isPlaying = false
                }else{
                    setTimeout(()=>{ setMessage("Get Ready to Start");},1000);
                    setTimeout(()=>{setMessage("3");},2000);
                    setTimeout(()=>{setMessage("2");},3000);
                    setTimeout(()=>{setMessage("1");},4000);
                    setTimeout(()=>{setMessage("GO");},5000);
                       
                }
            };


            let consecutiveHits = 0;

            function getHelper () {
                let random2 = Math.random() * 100;
                consecutiveHits++;
                getEffect = true;
                if (!getEffect) {
                    consecutiveHits = 0;
                }
                if (random > 25 && random <= 50) {
                    helper1 += 1;
                    effect1.style.display = 'block';
                    $("#effect1 label").html(helper1);
                } else if (random > 50 && random <= 75) {
                    helper2 += 1;
                    effect2.style.display = 'block';
                    $("#effect2 label").html(helper2);
                } else {
                    helper3 += 1;
                    effect3.style.display = 'block';
                    $("#effect3 label").html(helper3);
                }
                if (consecutiveHits == 2) {
                    if (random2 < 33.3){
                        helper1 += 1;
                        effect1.style.display = 'block';
                        $("#effect1 label").html(helper1);
                    } else if (random2 > 33.3 && random <= 66.6) {
                        helper2 += 1;
                        effect2.style.display = 'block';
                        $("#effect2 label").html(helper2);
                    } else {
                        helper3 += 1;
                        effect3.style.display = 'block';
                        $("#effect3 label").html(helper3);
                    }
                }
                if (helper1 === 5 || helper2 === 5 || helper3 === 5) {
                    console.log("You`ve got skills!");
                } else if (helper1 === 10 || helper2 === 10|| helper3 === 5) {
                    console.log("Quantum Ninja!!!");
                }
            }

            function endGame () {
                AudioControls.playbackSound("crash");
                isDead = true;
                ball.mesh.material.opacity = 0;
                ball.mesh.visible = false;
                ball.meshLeft.visible = false;
                ball.meshRight.visible = false;
                ball.plane.visible = false;
                ball.colisionPlane.visible = true;
                ball.colisionPlane.position.z = ball.mesh.position.z;
                ball.colisionPlane.position.x = ball.mesh.position.x;
                ball.colisionPlane.position.y = ball.mesh.position.y;
                let gameApp = thisApp
                setTimeout(()=>{
                    let gameAppp = gameApp
                    gameRunning = false;
                    setHighscore();
                    // $("#menu").fadeIn(400);
                    setTimeout(()=>{
                        gameApp.endScreen=true
                        $('body').addClass('overlay')
                    },500);
                    // $("#gScore").html("Total Distance: " + Math.round(parseInt(totalAdvanced)));
                    cancelAnimationFrame( timeStep );
                    camera.position.x = 0;
                    if (obstacleHolder.children) {
                        obstacleHolder.children.forEach(
                            function(children) {
                                children.geometry.dispose();
                                children.material.dispose();
                                obstacleHolder.remove(children);
                            }
                        )
                    }
                    stopEffect1();
                    stopEffect2();
                    stopEffect3();
                    ball.dispose();
                    thisApp.hasScore = true;
                },500)
                new TWEEN.Tween(camera.position)
                    .to({x:3}, 50)
                    .start()
                    .onComplete(()=>{
                        new TWEEN.Tween(camera.position)
                        .to({x:-3}, 50)
                        .onComplete(()=>{
                            new TWEEN.Tween(camera.position)
                            .to({x:1.5}, 100)
                            .onComplete(()=>{
                                new TWEEN.Tween(camera.position)
                                .to({x:-1.5}, 100)
                                .onComplete(()=>{
                                    new TWEEN.Tween(camera.position)
                                    .to({x:0}, 200)
                                    .start()
                                })
                                .start()
                            })
                            .start()
                        })
                        .start()
                    })
                    .start()
                    
                
            }


            let planesUsed = 0;
            let planeLength = 200;
            let planeFocus;

            function initGame () {
                scene = new THREE.Scene();
                scene.fog = new THREE.Fog(0xe0e0e0,150,400);
                camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 500 );
                camera.position.set(0,30,100);
                camera.lookAt(new THREE.Vector3(0,0,0));

                renderer = new THREE.WebGLRenderer({antialias:true});
                renderer.shadowMap.enabled = false;
                renderer.shadowMap.type = THREE.PCFShadowMap ; // default THREE.PCFShadowMap
                renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.setClearColor(0xe0e0e0,1)
                container.appendChild(renderer.domElement);

                var spotLight = new THREE.SpotLight( 0xDD3FB9, 0.7 );
                spotLight.position.set( 0, 100, 200 );
                spotLight.target.position.set(0,0,-50);
                scene.add( spotLight.target );

                spotLight.castShadow = true;

                spotLight.shadow.mapSize.width = 4096;
                spotLight.shadow.mapSize.height = 4096;

                spotLight.shadow.camera.near = 50;
                spotLight.shadow.camera.far = 1000;
                spotLight.shadow.camera.fov = 10;

                scene.add( spotLight );
                scene.add( new THREE.AmbientLight(0x49E4B9))

                obstacleHolder = new THREE.Object3D();
                scene.add(obstacleHolder);

                ball = new Ball();
                ball.init();
                initEvents();

                const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize, planeSize/10, planeSize/10);
                const planeMaterial = new THREE.MeshBasicMaterial( {color:0x7f7fff, wireframe:true} );

                planes[planesUsed] = new THREE.Mesh(planeGeometry, planeMaterial);
                //planes[planesUsed] = new THREE.GridHelper( planeSize, planeSize/10, 0x7f7fff, 0x7f7fff );
                // planes[planesUsed] = new THREE.GridHelper( planeLength, 200, 0x7f7fff, 0x7f7fff );
                
                planes[planesUsed].rotation.x = Math.PI / 2;
                // planes[planesUsed].position.z = -200;
                scene.add(planes[planesUsed]);
                planeFocus = planes[planesUsed];
                planesUsed++
                AudioControls.loadSound("dist/assets/sounds/gw_effect_1.wav","effect1");
                AudioControls.loadSound("dist/assets/sounds/qc_effect_b.wav","effect2");
                AudioControls.loadSound("dist/assets/sounds/qc_effect_a.wav","effect3");
                AudioControls.loadSound("dist/assets/sounds/crash_2.wav","crash");
            }

            function setHighscore() {
                if (totalAdvanced > thisApp.highScore) {
                    thisApp.highScore = Math.round(parseInt(totalAdvanced));
                    localStorage.setItem("poi_QC_highscore", thisApp.highScore); 
                }
            }
            $("#toggle-play").click(()=>{
                this.isPlaying = !this.isPlaying
            })

            function animate () {

                timeStep = requestAnimationFrame( animate );
                if(!thisApp.isPlaying) return;
                if (ball && ball.raycasters.length) {
                    ball.update();
                }
                ObstacleSpawner(timeStep);
                if (obstacles.length) {
                    for (let i=0;i<obstacles.length;i++) {
                        obstacles[i].update()
                    }
                }
                TWEEN.update()
                renderer.render(scene, camera);
            }

            //Capture the keyboard arrow keys   
            let A = keyboard(65),
                S = keyboard(83),
                D = keyboard(68),
                SPACE = keyboard(32),
                LEFT = keyboard(37),
                RIGHT = keyboard(39);             

                    
            function initEvents () {

                $('#effect1').on('touchstart', function (event) {
                    triggerEffect1(event)
                })
                $('#effect1').on('touchend', function (event) {
                    stopEffect1(event)
                })
                $('#effect2').on('touchstart', function (event) {
                    triggerEffect2(event)
                })
                $('#effect2').on('touchend', function (event) {
                    stopEffect2(event)
                })
                $('#effect3').on('touchstart', function (event) {
                    triggerEffect3(event)
                })
                $('#effect3').on('touchend', function (event) {
                    stopEffect3(event)
                })
                $('#effect1').on('mousedown', function (event) {
                    triggerEffect1(event)
                    effect1.style.display = 'block';
                })
                $('#effect1').on('mouseup', function (event) {
                    stopEffect1(event)
                })
                $('#effect2').on('mousedown', function (event) {
                    triggerEffect2(event)
                    effect2.style.display = 'block';
                })
                $('#effect2').on('mouseup', function (event) {
                    stopEffect2(event)
                })
                $('#effect3').on('mousedown', function (event) {
                    triggerEffect3(event)
                    effect3.style.display = 'block';
                })
                $('#effect3').on('mouseup', function (event) {
                    stopEffect3(event)
                })

                //key press
                A.press = () => {
                    triggerEffect1(event)               
                }
                S.press = () => {
                    triggerEffect2(event)                    
                }
                D.press = () => {
                    triggerEffect3(event)                      
                }
                A.release = () => {
                    stopEffect1(event)                 
                }
                S.release = () => {
                    stopEffect2(event)                    
                }
                D.release = () => {
                    stopEffect3(event)                      
                }
                SPACE.press = () => {
                    thisApp.isPlaying = !thisApp.isPlaying
                }
                RIGHT.press = () => {
                    if (gameRunning && ball && ball.mesh) {
                        new TWEEN.Tween(ball.mesh.position)
                            .to({x:ball.mesh.position.x+5}, 50)
                            .onUpdate(()=>{
                                ball.plane.position.x = ball.mesh.position.x;
                                if(ball.mesh.position.x >= -50 + sparseDistance / 2 && ball.mesh.position.x <= 50 - sparseDistance / 2) {
                                    ball.meshLeft.position.x = ball.mesh.position.x - sparseDistance / 2;
                                    ball.meshRight.position.x = ball.mesh.position.x + sparseDistance / 2;
                                }
                            })
                            .start()                        
                    }
                }
                LEFT.press = () => {
                    if (gameRunning && ball && ball.mesh) {
                        new TWEEN.Tween(ball.mesh.position)
                            .to({x:ball.mesh.position.x-5}, 50)
                            .onUpdate(()=>{
                                ball.plane.position.x = ball.mesh.position.x;
                                if(ball.mesh.position.x >= -50 + sparseDistance / 2 && ball.mesh.position.x <= 50 - sparseDistance / 2) {
                                    ball.meshLeft.position.x = ball.mesh.position.x - sparseDistance / 2;
                                    ball.meshRight.position.x = ball.mesh.position.x + sparseDistance / 2;
                                }
                            })
                            .start()                        
                    }
                }

                window.addEventListener('resize', this.resizeWindow)
                
            }

            /*
                Main app classes
            */
            let planes = [];
            let planesGenerated = 0;
            let staticSpeed = 0;
            let incrementCounter = 0;
            let computedSpeedtIncrement = 0.0;
            let quarterPlane = planeLength/40;
            let needNewPlane = false;
            let sparseDistance = 20;
            function Ball () {
                return {
                    shouldCheck: true,
                    mesh: null,
                    life: null,
                    plane: null,
                    meshLeft: null,
                    meshRight: null,
                    raycasters: [],
                    radius: qDotRadius,
                    collisions: [false,false,false],
                    intersections: null,
                    splitBall:false,
                    setCollisions: function (index, value) {
                        this.collisions[index] = value;
                    },
                    getCollisions: function () {
                        return this.collisions;
                    },
                    init: function () {
                        // THREE Ball Object
                        this.mesh = new THREE.Mesh( 
                            new THREE.SphereBufferGeometry( this.radius, 32, 32 ), 
                            new THREE.MeshStandardMaterial( {metalness:0.0, roughness: 1.0, color: 0xDD3FB9, opacity: 1, transparent: true}) 
                            );
                        this.mesh.castShadow = true;
                        this.mesh.receiveShadow = true;
                        this.mesh.visible = true;
                        this.mesh.position.z = 0;
                        this.mesh.position.y = this.radius;
                        this.meshLeft = this.mesh.clone();
                        this.meshLeft.position.x = -sparseDistance/2;
                        this.meshRight = this.mesh.clone();
                        this.meshRight.position.x = sparseDistance/2;
                        scene.add(this.mesh);
                        scene.add(this.meshLeft);
                        scene.add(this.meshRight);
                        this.meshLeft.visible = this.meshRight.visible = false;

                        // THREE Plane Object
                        let texture = new THREE.TextureLoader().load( "/dist/assets/img/cloud.png" );
                        this.plane = new THREE.Mesh( 
                            new THREE.PlaneGeometry( cloudRadius * 2, cloudRadius * 2 ),
                            new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, map: texture, transparent:true} ) 
                            );
                        this.plane.visible = false;
                        this.plane.position.y = -cloudRadius * 2;
                        this.plane.position.x = -cloudRadius * 2;
                        scene.add( this.plane );

                        let colisionTexture = new THREE.TextureLoader().load( "/dist/assets/img/crash.png" );
                        this.colisionPlane = new THREE.Mesh( 
                            new THREE.PlaneGeometry( cloudRadius, cloudRadius ),
                            new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, map: colisionTexture, transparent:true} ) 
                            );
                        this.colisionPlane.visible = false;
                        this.colisionPlane.position.y = -cloudRadius;
                        scene.add( this.colisionPlane );

                        // THREE Plane Object
                        this.raycasters[0] = new THREE.Raycaster(new THREE.Vector3(-cloudRadius, 0, 0), new THREE.Vector3(0, 0, 1)); // left
                        this.raycasters[1] = new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1)); // center
                        this.raycasters[2] = new THREE.Raycaster(new THREE.Vector3(cloudRadius, 0, 0), new THREE.Vector3(0, 0, 1)); // right
                        let scope = this;
                    },
                    update: function() {
                        if(isDead) return;
                        incrementCounter++
                        if (incrementCounter < speedInitialEndValue) {
                            computedSpeedtIncrement += speedDefault/speedInitialEndValue;
                        } else if (incrementCounter % speedIncrementEvery == 0) {
                            computedSpeedtIncrement += speedIncrement;
                        }
                        totalAdvanced += speedIncrement;
                        if(Math.abs(this.mesh.position.z) > (planesUsed-1) * planeSize - 100) {
                            
                            planes[planesUsed] = planes[planesUsed-1].clone()
                            planes[planesUsed].position.z = - (planesUsed *  planeSize);
                            scene.add(planes[planesUsed]);
                            if(planesUsed - 2 >= 0) {
                                planes[planesUsed-2].geometry.dispose();
                                planes[planesUsed-2].material.dispose();
                                scene.remove(planes[planesUsed-2]);
                            }
                            planesUsed++
                            if(ran > 3) {
                                ran = ran - 1;
                            }
                        }
                        camera.lookAt(new THREE.Vector3(0, this.mesh.position.y, this.mesh.position.z))   
                        camMovement = camera.position.z -= computedSpeedtIncrement;                       

                        this.plane.position.z = this.mesh.position.z = this.meshLeft.position.z = this.meshRight.position.z = camMovement - camOffset;
                        thisApp.scoreValue = Math.round(parseInt(totalAdvanced));   
                        if(!this.splitBall){
                            this.raycast();
                        } else {
                            this.raycastSparse(sparseDistance/2);
                        }
                        this.checkCollisions();
                    },
                    checkCollisions: function () {
                        if (!this.shouldCheck) return;
                        let collisions = this.getCollisions()
                        // for(let i=0; i<collisions.length; i++) {
                            if (collisions[1]) {
                                endGame();
                            }
                        // }
                    },
                    raycastSparse: function (offset) {
                        this.intersections = undefined;
                        this.setCollisions(0, false);
                        this.setCollisions(1, false);
                        this.setCollisions(2, false);
                        let collisionThreshold = 6;
                        this.raycasters[0].ray.origin.x = this.mesh.position.x - offset;
                        this.raycasters[0].ray.origin.y = this.mesh.position.y;
                        this.raycasters[0].ray.origin.z = this.mesh.position.z;

                        this.raycasters[0].ray.direction.x = this.mesh.position.x - offset;
                        this.raycasters[0].ray.direction.y = this.mesh.position.y;
                        this.raycasters[0].ray.direction.z = this.mesh.position.z - 100;

                        this.raycasters[0].ray.direction = this.raycasters[0].ray.direction.normalize();
                        let ray1Collisions = this.raycasters[0].intersectObjects( obstacleHolder.children );
                        if (ray1Collisions.length && ray1Collisions[0].distance <= collisionThreshold) {
                            this.setCollisions(0, true);
                        }

                        this.raycasters[2].ray.origin.x = this.mesh.position.x + offset;
                        this.raycasters[2].ray.origin.y = this.mesh.position.y;
                        this.raycasters[2].ray.origin.z = this.mesh.position.z;

                        this.raycasters[2].ray.direction.x = this.mesh.position.x + offset;
                        this.raycasters[2].ray.direction.y = this.mesh.position.y;
                        this.raycasters[2].ray.direction.z = this.mesh.position.z - 100;

                        this.raycasters[2].ray.direction = this.raycasters[2].ray.direction.normalize();
                        let ray3Collisions = this.raycasters[2].intersectObjects( obstacleHolder.children );
                        if (ray3Collisions.length && ray3Collisions[0].distance <= collisionThreshold) {
                            this.setCollisions(2, true);
                        }
                    },
                    raycast: function () {
                        this.intersections = undefined;
                        this.setCollisions(0, false);
                        this.setCollisions(1, false);
                        this.setCollisions(2, false);

                        let collisionThreshold = 3;
                        this.raycasters[0].ray.origin.x = this.mesh.position.x - cloudRadius / 2;
                        this.raycasters[0].ray.origin.y = this.mesh.position.y;
                        this.raycasters[0].ray.origin.z = this.mesh.position.z;

                        this.raycasters[0].ray.direction.x = this.mesh.position.x - cloudRadius / 2;
                        this.raycasters[0].ray.direction.y = this.mesh.position.y;
                        this.raycasters[0].ray.direction.z = this.mesh.position.z - 100;

                        this.raycasters[0].ray.direction = this.raycasters[0].ray.direction.normalize();
                        let ray1Collisions = this.raycasters[0].intersectObjects( obstacleHolder.children );
                        if (ray1Collisions.length && ray1Collisions[0].distance <= collisionThreshold) {
                            this.setCollisions(0, true);
                        }

                        this.raycasters[1].ray.origin.x = this.mesh.position.x;
                        this.raycasters[1].ray.origin.y = this.mesh.position.y;
                        this.raycasters[1].ray.origin.z = this.mesh.position.z;       

                        this.raycasters[1].ray.direction.x = this.mesh.position.x;
                        this.raycasters[1].ray.direction.y = this.mesh.position.y;
                        this.raycasters[1].ray.direction.z = this.mesh.position.z - 100;

                        this.raycasters[1].ray.direction = this.raycasters[1].ray.direction.normalize();
                        let ray2Collisions = this.raycasters[1].intersectObjects( obstacleHolder.children );
                        if (ray2Collisions.length && ray2Collisions[0].distance <= collisionThreshold) {
                            this.setCollisions(1, true);
                            this.intersections =  ray2Collisions[0];
                        }

                        this.raycasters[2].ray.origin.x = this.mesh.position.x + cloudRadius / 2;
                        this.raycasters[2].ray.origin.y = this.mesh.position.y;
                        this.raycasters[2].ray.origin.z = this.mesh.position.z;

                        this.raycasters[2].ray.direction.x = this.mesh.position.x + cloudRadius / 2;
                        this.raycasters[2].ray.direction.y = this.mesh.position.y;
                        this.raycasters[2].ray.direction.z = this.mesh.position.z - 100;

                        this.raycasters[2].ray.direction = this.raycasters[2].ray.direction.normalize();
                        let ray3Collisions = this.raycasters[2].intersectObjects( obstacleHolder.children );
                        if (ray3Collisions.length && ray3Collisions[0].distance <= collisionThreshold) {
                            this.setCollisions(2, true);
                        }
                        
                        
                    },
                    dispose:function () {
                        this.raycasters = [];
                        this.plane.position.z = this.mesh.position.z = this.meshLeft.position.z = this.meshRight.position.z = 0;
                        this.colisionPlane.visible = false;
                        this.setCollisions(0,false);this.setCollisions(1,false);this.setCollisions(2,false);
                        this.raycasters[0] = new THREE.Raycaster(new THREE.Vector3(-this.radius, 0, 0), new THREE.Vector3(0, 0, 1)); // left
                        this.raycasters[1] = new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1)); // center
                        this.raycasters[2] = new THREE.Raycaster(new THREE.Vector3(this.radius, 0, 0), new THREE.Vector3(0, 0, 1)); // right
                    }
                }
            }
            
            function ObstacleSpawner (time) {
                if (time % Math.floor(ran) === 0) {
                    let obstacle = new Obstacle();
                    obstacle.init(camera.position.z - 400,camera.position.z - 700, computedSpeedtIncrement);
                    // for (var i=0; i<obstacles.length; i++) {
                    //     if (obstacles[i].mesh && obstacles[i].mesh.position.x >= obstacleLimit || obstacles[i].mesh && obstacles[i].mesh.position.x <= -obstacleLimit) {
                    //         scene.remove(obstacles[i].mesh);
                    //         obstacles.splice(i, 1);
                    //     } 
                    // }
                }
            }

            function Obstacle () {
                return {
                    init: function (depthMin, depthMax, speed) {
                        if (spawnerRange < obstacleLimit) spawnerRange += 10;
                        let length = getRandomArbitrary(10,30), height = getRandomArbitrary(1,5), width = 7;
                        let rand = getRandomArbitrary(-5,5);

                        let dir = 1;
                        let spwanDistance = 50;
                        if (rand >=0) {
                            dir = -1;
                        }
                        let mesh = new THREE.Mesh(
                            new THREE.BoxGeometry( length, width, height ),
                            new THREE.MeshStandardMaterial( {metalness:0.0, roughness:1.0, color: 0xFFFFFF} )
                        );
                        mesh.position.set(dir * getRandomArbitrary(3,63), width/2, getRandomArbitrary(depthMin,depthMax))
                        mesh.castShadow = false;
                        mesh.receiveShadow = true;
                        mesh.userData.width = height;
                        obstacleHolder.add(mesh);
                        let element = {};
                        element.mesh = mesh;
                        obstacles.push(element);
                        element.update = function () {
                            if(mesh.position.z > camera.position.z) {
                                mesh.geometry.dispose();
                                mesh.material.dispose();
                                obstacleHolder.remove(mesh);
                                mesh = null;
                                obstacles.splice(obstacles.indexOf(element),1)
                            }
                        }
                    }
                }
            }

            /*
                Events functions
            */

            let effect1Interval = setInterval(function(){},33);
            let effect1IntervalUse = setInterval(function(){},33);
            let effect1IntervalCharge = setInterval(function(){},33);


            let effect2Interval = setInterval(function(){},33);
            let effect2IntervalUse = setInterval(function(){},33);
            let effect2IntervalCharge = setInterval(function(){},33);

            let effect3Interval = setInterval(function(){},33);
            let effect3IntervalUse = setInterval(function(){},33);
            let effect3IntervalCharge = setInterval(function(){},33);

            let messageTimeOut = setTimeout(()=>{},2000);

            function triggerEffect1 () {
                if(!thisApp.effect1IsAllowed){
                    return;
                }
                thisApp.activePowerLabel = "Uncertainty Cloud";

                stopEffect1();
                stopEffect2();
                stopEffect3();
                AudioControls.playbackSound("effect1");
                
                effect1IntervalUse = setInterval(function(){
                    
                    effect1Charged -= 2;

                    if(effect1Charged <= 0.1){
                        thisApp.effect1IsAllowed = false
                        effect1Charged = 0;                       
                        stopEffect1(); 
                    }
                    updateCharge(effect1_ctx, effect1Charged);
                },33);
                
                ball.shouldCheck = false;                
                effect1Interval = setInterval(function(){
                    if (ball.mesh) {
                        ball.mesh.visible = false;
                        let collisions = ball.getCollisions();
                        if (collisions[0] && collisions[1] && collisions[2]) {
                            setMessage("Chances were against you!");
                            endGame();
                        }
                    }
                    if (ball.plane) ball.plane.visible = true;
                },33);
                
                thisApp.showActivePower = true
            }

            const setMessage = (message) => {
                $("#message").show();
                $("#message").html(message);
                messageTimeOut = setTimeout(()=>{
                    $("#message").hide();
                    clearInterval(messageTimeOut);
                },1500);
            }

            function stopEffect1 () {
                //$("#message").hide();
                ball.shouldCheck = true;
                thisApp.showActivePower = false
                clearInterval(effect1Interval);
                clearInterval(effect1IntervalUse);
                AudioControls.stopPlaybackSound("effect1");
                
                if (ball.plane) ball.plane.visible = false;
                if (ball.mesh) ball.mesh.visible = true;

                clearInterval(effect1IntervalCharge);
                effect1IntervalCharge = setInterval(function(){
                    if(effect1Charged > 33){
                        thisApp.effect1IsAllowed = true;
                    }
                    if(effect1Charged >= 100){
                        clearInterval(effect1IntervalCharge);
                    }
                    effect1Charged += 0.3;
                    updateCharge(effect1_ctx, effect1Charged);
                },33);
                
            }

            

            function triggerEffect2 () {
                if(!thisApp.effect2IsAllowed){
                    return;
                }
                thisApp.activePowerLabel = "Quantum Tunneling";
                stopEffect1();
                stopEffect2();
                stopEffect3();

                AudioControls.playbackSound("effect2");
                effect2IntervalUse = setInterval(function(){
                    effect2Charged -= 2;

                    if(effect2Charged <= 0.1){
                        effect2Charged = 0;
                        thisApp.effect2IsAllowed = false                   
                        stopEffect2(); 
                    }
                    updateCharge(effect2_ctx, effect2Charged);
                },33);

                ball.shouldCheck = false;
                let randomNumber = Math.random();
                effect2Interval = setInterval(function(){
                    if (ball.mesh) {
                        ball.mesh.visible = true; 
                        ball.mesh.material.opacity = 0.5;
                        if (ball.intersections) {
                            let ballsWidth = ball.intersections.object.userData.width;
                            let chance = interpolate(obstacleMinWidth, ballsWidth, obstacleMaxWidth, 0.8, 0.2);
                            if (randomNumber > chance) {
                                setMessage("You FAILED this time!");
                                endGame();
                            } else {
                                setMessage("You PASSED this time!");
                            }
                        }
                    }
                    if (ball.plane) ball.plane.visible = false;
                },33);

                thisApp.showActivePower = true
            }

            function stopEffect2 () {
                ball.shouldCheck = true;
                thisApp.showActivePower = false
                clearInterval(effect2Interval);
                clearInterval(effect2IntervalUse);
                AudioControls.stopPlaybackSound("effect2");
                if (ball.mesh) {ball.mesh.visible = true; ball.mesh.material.opacity = 1;}

                clearInterval(effect2IntervalCharge);
                effect2IntervalCharge = setInterval(function(){
                     
                    if(effect2Charged > 33){
                        thisApp.effect2IsAllowed = true;
                    }
                    if(effect2Charged >= 100){
                        clearInterval(effect2IntervalCharge);
                    }
                    effect2Charged += 0.3;
                    updateCharge(effect2_ctx, effect2Charged);

                },33);
            }

            

            function triggerEffect3 () {
                if(!thisApp.effect3IsAllowed){
                    return;
                }
                thisApp.activePowerLabel = "Quantum Entanglement";
                stopEffect1();
                stopEffect2();
                stopEffect3();
                AudioControls.playbackSound("effect3");
                ball.shouldCheck = false;
                ball.meshLeft.visible = ball.meshRight.visible = true;
                ball.mesh.visible = false;
                ball.splitBall = true;
                effect3IntervalUse = setInterval(function(){
                    
                    effect3Charged -= 2;

                    if(effect3Charged <= 0.1){
                        effect3Charged = 0; 
                        thisApp.effect3IsAllowed = false                      
                        stopEffect3(); 
                    }
                    updateCharge(effect3_ctx, effect3Charged);
                },33);
                effect3Interval = setInterval(function(){
                    if (ball.collisions && ball.collisions[0] && ball.collisions[2]) { 
                        setMessage("Two chances and still no luck");
                        endGame();
                    }
                },33);
                thisApp.showActivePower = true;
            }

            function stopEffect3 () {
                ball.shouldCheck = true;
                ball.meshLeft.visible = ball.meshRight.visible = false;
                ball.mesh.visible = true;
                ball.splitBall = false;
                thisApp.showActivePower = false
                AudioControls.stopPlaybackSound("effect3");
                clearInterval(effect3Interval);
                clearInterval(effect3IntervalUse);

                clearInterval(effect3IntervalCharge);
                effect3IntervalCharge = setInterval(function(){
                     
                    if(effect3Charged > 33){
                        thisApp.effect3IsAllowed = true;
                    }
                    if(effect3Charged >= 100){
                        clearInterval(effect3IntervalCharge);
                    }
                    effect3Charged += 0.3;
                    updateCharge(effect3_ctx, effect3Charged);
                },33);

            }

            function resetVariables () {
                score = 0;
                projectiles = 1;
                helper1 = 100;
                helper2 = 100;
                helper3 = 100;
                ran = 37;
            }

            let lastX = 0;
            $(window).mousemove((ev) => {
                let diff = ev.clientX - lastX;
                lastX = ev.clientX; 
                if (gameRunning && ball && ball.mesh && diff !=0) {
                    ball.mesh.position.x = interpolate(-window.innerWidth/2, ev.clientX - window.innerWidth/2,  window.innerWidth/2, -50,50)
                    ball.plane.position.x = ball.mesh.position.x;
                    if(ball.mesh.position.x >= -50 + sparseDistance / 2 && ball.mesh.position.x <= 50 - sparseDistance / 2) {
                         ball.meshLeft.position.x = ball.mesh.position.x - sparseDistance / 2;
                         ball.meshRight.position.x = ball.mesh.position.x + sparseDistance / 2;
                    }
                }
            });
            let lastPanX = 0;
            hammer.on('swipe pan', (ev)=>{
                let diff = ev.center.x - lastPanX;
                lastPanX = ev.center.x;
                if (gameRunning && ball && ball.mesh && diff !=0) {
                    ball.mesh.position.x = interpolate(-window.innerWidth/2, ev.center.x - window.innerWidth/2,  window.innerWidth/2, -50,50)
                    ball.plane.position.x = ball.mesh.position.x;
                    if(ball.mesh.position.x <= -50 + sparseDistance / 2) {
                        ball.meshLeft.position.x = -50;
                    } else {
                        ball.meshLeft.position.x = ball.mesh.position.x - sparseDistance / 2;
                    }
                    if(ball.mesh.position.x >= 50 - sparseDistance / 2) {
                        ball.meshRight.position.x = 50;
                    } else {
                        ball.meshRight.position.x = ball.mesh.position.x + sparseDistance / 2;
                    }
                }
            });
            /*
                Util functions
            */
            function keyboard(keyCode) {
                let key = {};
                key.code = keyCode;
                key.isDown = false;
                key.isUp = true;
                key.press = undefined;
                key.release = undefined;
                //The `downHandler`
                key.downHandler = event => {
                if (event.keyCode === key.code) {
                  if (key.isUp && key.press) key.press();
                  key.isDown = true;
                  key.isUp = false;
                }
                event.preventDefault();
                };

                //The `upHandler`
                key.upHandler = event => {
                if (event.keyCode === key.code) {
                  if (key.isDown && key.release) key.release();
                  key.isDown = false;
                  key.isUp = true;
                }
                event.preventDefault();
                };

                //Attach event listeners
                window.addEventListener(
                "keydown", key.downHandler.bind(key), false
                );
                window.addEventListener(
                "keyup", key.upHandler.bind(key), false
                );
                return key;
            }            

            function drawPieSlice(ctx, x, y, startAngle, endAngle, radius, fillStyle) {
                ctx.clearRect(0, 0, 100, 100);
                ctx.fillStyle = fillStyle;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + radius * Math.cos(startAngle), y + radius * Math.sin(startAngle));
                ctx.arc(x, y, radius, startAngle, endAngle);
                ctx.lineTo(x, y);
                ctx.closePath();
                ctx.fill();
            }

            function updateCharge(ctx, charge){

                var angle =  -Math.PI/2 + (CIRCLE_CONVERT * charge);
                thisApp.activePowerLoad = charge;
                drawPieSlice(ctx, 50, 50, -Math.PI/2, angle, 50, "#DD3FB9");

            }

            function interpolate (x1, x2, x3, y1, y3) {
                return ((x2 - x1) * (y3 - y1)) / (x3 - x1) + y1;
            }

            function getRandomArbitrary(min, max) {
                return parseInt(Math.random() * (max - min) + min);
            }    

            function getRoundRandomArbitrary(min, max, round) {
                return Math.round((Math.random()*(max-min)+min)/round)*round;
            } 

            initGame(); 
        },
        tourNextStep (step) {
            
            // console.log('[Vue Tour] A custom nextStep callback has been called on step ' + (step + 1))
            // if (step === 1) {                
            
            // }
            // if (step === 8) {
                
            // }
        },
        tourStart (step) {
            this.isPlaying = false
        },        
        tourPreviousStep (step) {
            console.log('[Vue Tour] A custom previousStep callback has been called on step ' + (step + 1))

            if (step === 2) {
              console.log('[Vue Tour] A custom previousStep callback has been called from step 2 to step 3')
            }
        },
        tourStop (step) {
            this.$cookie.set('qg_guide_finished', 'One year later', { expires: '1Y' });
            this.isPlaying = true
            console.log('[Vue Tour] Finished')                
        }
    }    
}

</script>   

