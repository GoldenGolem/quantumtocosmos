<template>
<div>
    <div id="container" v-on:keyup="keymonitor" style="cursor:none"></div>
    <div id="effects">
        <div class="circle" id="effect1">
            <canvas id="pie1" width=100 height=100></canvas>
            <div class="effectImage"></div>
        </div>
        <div class="circle" id="effect2">
            <canvas id="pie2" width=100 height=100></canvas>
            <div class="effectImage"></div>
        </div>
        <div class="circle" id="effect3">
            <canvas id="pie3" width=100 height=100></canvas>
            <div class="effectImage"></div>
        </div>

    </div>
    <div id="preloader">Loading...Please Wait</div>
    <div id="statistics">
        <div id="score">Total Distance: {{ Math.round(totalAdvanced) }}</div>
        <div id="highScore">HIGHSCORE: {{ Math.round(highScore) }}</div>
    </div>
    <div id="message">{{ topMessage }}</div>
    <div id="active_helper">
        <p>Power Activated</p>
        <div id="timerBar"></div>
        <p id="label"></p>
    </div>
    <div id="menu" v-show="showMenu">
         <div id="elements">    
            <h1 id="title">Quantum Ball</h1>
            <p id="subtitle">How far can you get?</p>
            <button id="startgame" v-on:click='startGame'>START</button>
            <div id="gamestatistics">
                <p id="gScore"></p>
                <p id="gHighScore"></p>
                <p id="gthrown"></p>
                <p id="gmissed"></p>
                <p id="gscored"></p>
                <p id="gtotal"></p>
            </div>
        </div>
    </div>
</div>
</template>
<style type="text/css">
    
    #message{
        position: absolute;
        z-index: 100;
        width: 100%;
        text-align: center;
        font-size: 20px;
        top: 100px;
        /*display: none;*/
    }
    #active_helper{
        width: 300px;
        height: 50px;
        position: absolute;
        bottom:200px;
        left: calc(50% - 150px);
        color:#FFF;
        font-weight: 600;
        text-align: center;
        background-color: #7F7FFF;
        border-radius: 25px;

    }
    .circle{
        border-radius: 50%;
        background-color: #49E4B9;
        z-index: 99;
        width: 100px;
        height: 100px; 
        position: absolute;
        bottom: 20px; 
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

    #gamestatistics{

    }
    #menu{
        display: flex;

        flex-direction: row;
        position: fixed;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background-color: #7F7FFF;
        z-index: 99;

    }
    #elements{
        text-align: center;
        width: 300px;
        position: relative;
        margin: 0 auto;
        display: flex;

        flex-direction: column;
        justify-content: center;
        color: #FFF;
    }

    #startgame{
        cursor: pointer;
        border:none;
        width: 100px;
        margin:0 auto;
        height: 40px;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        border-radius: 20px;
        background: #49E4B9;
        margin-bottom: 30px;
    }
    #startgame:hover{
        background-color:#DD3FB9; 
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
        display: none;
    }
    #effect1{
        /*background-color: rgb(66, 0, 0);*/
        cursor: pointer;
        left: calc(50% - 170px);
    }
    #effect2{
        /*background-color: rgb(0, 66, 0);*/
        cursor: pointer;

        left: calc(50% - 50px);
    } 
    #effect3{
        cursor: pointer;

        left: calc(50% + 70px);
    }    
    #effect1 .effectImage{
        /*background-color: rgb(66, 0, 0);*/
        background-image: url("/dist/assets/img/uncertanty.gif");

    }
    #effect2 .effectImage{
        /*background-color: rgb(0, 66, 0);*/
        background-image: url("/dist/assets/img/tunnel.jpg");

    } 
    #effect3 .effectImage{
        background-color: rgb(0, 0, 66);

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
    #statistics{

        z-index: 10;
        font-size: 16px;
        position:absolute;
        top:20px;
        right: 50px;
    }
</style>
<script>
//import * as THREE from 'three'
const THREE = require('three')
import store from './../store'
import Dispose from './Dispose'
import Raycaster from './Raycaster'
const Hammer = require('hammerjs');
const TWEEN = require('@tweenjs/tween.js')

export default {
    mounted: function () {
        this.init()
        // this.display.drawer = false
    },
    data() {
        return {
            qDotRadius  : 0.7,
            cloudRadius : 13, //uncertanty cloud radius
            ran         : 37, // obstacle frequency
            ballSpeed   : 1,
            camOffset   : 100,
            scene       : '',
            camera      : '',
            renderer    : '',
            world       : '',
            highScore:0,
            obstacles : [],
            obstacleLimit:200,
            spawnerRange:50,
            ball: '',
            obstacleHolder: '',
            timeNow: '',
            timeThen: '',
            timeStep: '',
            GROUP1 : 1, // ground
            GROUP2 : 2, // obstacles
            GROUP3 : 4, // ball
            obstacleMinWidth : 1,
            obstacleMaxWidth : 8,
            projectiles : 1,
            helper1 : 100,
            helper2 : 100,
            helper3 : 100,
            getEffect : false,
            planeSize : 300,
            camMovement : 1,
            speedIncrement : 0.3,
            speedDefault : 1,
            speedIncrementEvery : 300,
            speedInitialEndValue : 100,
            gameRunning : false,      
            planesUsed : 0,
            planeLength : 200,
            planeFocus: '',
            strafeIncrement : 3,
            consecutiveHits : 0,
            lastX : 0,
            planes : [],
            planesGenerated :0,
            staticSpeed : 0,
            incrementCounter :0,
            computedSpeedtIncrement : 0.0,
            quarterPlane : 5, //planeLength/40,
            needNewPlane : false,
            effect1Charged : true,
            effect2Charged : true,
            effect3Charged : true,

            /*
                Main app function
            */

            totalAdvanced : 0.0,
            initialSpeedIncrement : 0.0,
            CIRCLE_CONVERT : 2*Math.PI/100,
            effect1_ctx : '',
            effect2_ctx : '',
            effect3_ctx : '',
            container : '',
            preloader   : '',
            effect1Interval : '',
            effect1IntervalUse : '',
            effect1IntervalCharge : '',
            effect1IsAllowed : true,
            effect2Interval : '',
            effect2IntervalUse : '',
            effect2IntervalCharge : '',
            effect2IsAllowed : true,

            effect3Interval : '',

            messageTimeOut : '',
            effect1Interval : '',
            A : '',
            S : '',
            D : '',

            showMenu: true,
            topMessage : '',

        }
    },
    beforeRouteLeave(to, from, next) {
        next()
    },
    methods: {
        init() {

            this.container = document.querySelector('#container')  
            this.preloader = document.querySelector('#preloader')

            //PieSlice
            let canvasEffect1 = document.getElementById("pie1");
            this.effect1_ctx = canvasEffect1.getContext("2d");
            let canvasEffect2 = document.getElementById("pie2");
            this.effect2_ctx = canvasEffect2.getContext("2d");
            let canvasEffect3 = document.getElementById("pie3");
            this.effect3_ctx = canvasEffect3.getContext("2d");

            // $("#startgame").click(function(){
            //     effect1.style.display = 'block';
            //     effect2.style.display = 'block';
            //     effect3.style.display = 'block';
            // })            

            //Capture the keyboard arrow keys   
                                  
    

            this.effect1IntervalUse = setInterval(function(){},33);
            this.effect1IntervalCharge = setInterval(function(){},33);

            this.effect2IntervalUse = setInterval(function(){},33);
            this.effect2IntervalCharge = setInterval(function(){},33);
            

            this.messageTimeOut = setTimeout(()=>{},1000);

            this.effect1Interval = setInterval(function(){},33);
            this.effect2Interval = setInterval(function(){},33);        

            this.effect3Interval = setInterval(function(){},33);
 
            $(window).mousemove((ev) => {
                let diff = ev.clientX - this.lastX;
                this.lastX = ev.clientX; 
                if (this.gameRunning && this.ball && this.ball.mesh && diff !=0) {
                    this.ball.mesh.position.x = this.interpolate(-window.innerWidth/2, ev.clientX - window.innerWidth/2,  window.innerWidth/2, -50,50)
                    this.ball.plane.position.x = this.ball.mesh.position.x;
                }
            });


            this.initGame(); 
        },
        triggerEffect(effect){
            console('triggered effect:', effect)
        },
        stopEffect(effect){
            console('stopped effect:', effect)
        },
        initGame () {
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.Fog(0xe0e0e0,150,400);
            this.camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 2000 );
            this.camera.position.set(0,50,200);
            this.camera.lookAt(new THREE.Vector3(0,0,0));

            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.shadowMap.enabled = false;
            this.renderer.shadowMap.type = THREE.PCFShadowMap ; // default THREE.PCFShadowMap
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.renderer.setClearColor(0xe0e0e0,1)
            this.container.appendChild(this.renderer.domElement);

            var spotLight = new THREE.SpotLight( 0xDD3FB9, 0.7 );
            spotLight.position.set( 0, 100, 200 );
            spotLight.target.position.set(0,0,-50);
            this.scene.add( spotLight.target );

            spotLight.castShadow = true;

            spotLight.shadow.mapSize.width = 4096;
            spotLight.shadow.mapSize.height = 4096;

            spotLight.shadow.camera.near = 50;
            spotLight.shadow.camera.far = 1000;
            spotLight.shadow.camera.fov = 10;

            this.scene.add( spotLight );
            this.scene.add( new THREE.AmbientLight(0x49E4B9))

            this.obstacleHolder = new THREE.Object3D();
            this.scene.add(this.obstacleHolder);

            this.ball = new this.Ball(this);
            this.ball.init();
            this.initEvents();

            const planeGeometry = new THREE.PlaneGeometry(this.planeSize, this.planeSize, this.planeSize/10, this.planeSize/10);
            const planeMaterial = new THREE.MeshBasicMaterial( {color:0x7f7fff, wireframe:true} );
            this.planes[this.planesUsed] = new THREE.Mesh(planeGeometry, planeMaterial);
            // planes[planesUsed] = new THREE.GridHelper( planeLength, 200, 0x7f7fff, 0x7f7fff );
            
            this.planes[this.planesUsed].rotation.x = Math.PI / 2;
            // planes[planesUsed].position.z = -200;
            this.scene.add(this.planes[this.planesUsed])
            this.planeFocus = this.planes[this.planesUsed]
            this.planesUsed++
        },
        resetVariables () {
            this.score = 0;
            this.projectiles = 1;
            this.helper1 = 100;
            this.helper2 = 100;
            this.helper3 = 100;
            this.ran = 37;
        },
        initEvents () {

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

            // //key press
            // A.press = () => {
            //     triggerEffect1(event)                 
            // }
            // S.press = () => {
            //     triggerEffect2(event)                    
            // }
            // D.press = () => {
            //     triggerEffect3(event)                      
            // }
            // A.release = () => {
            //     stopEffect1(event)                 
            // }
            // S.release = () => {
            //     stopEffect2(event)                    
            // }
            // D.release = () => {
            //     stopEffect3(event)                      
            // }

            window.addEventListener('resize', function() {
                renderer.setSize(window.innerWidth, window.innerHeight)
                camera.aspect = window.innerWidth / window.innerHeight
                camera.updateProjectionMatrix();
                renderer.render(scene, camera);
            })
        },
        startGame () {
               
            setTimeout(()=>{this.topMessage = "Get Ready to Start";},1000);
            setTimeout(()=>{this.topMessage = "3";},2000);
            setTimeout(()=>{this.topMessage = "2";},3000);
            setTimeout(()=>{this.topMessage = "1";},4000);
            setTimeout(()=>{this.topMessage = "GO";},5000);

            for(var i=0;i<this.planes.length;i++) {
                if(this.planes[i]){
                    if(this.planes[i].geometry) this.planes[i].geometry.dispose();
                    if(this.planes[i].material) this.planes[i].material.dispose();
                    if(this.planes[i].parent) this.scene.remove(this.planes[i]);
                }
            }
            this.planes = [];
            this.planesUsed = 0;
            const planeGeometry = new THREE.PlaneGeometry(this.planeSize, this.planeSize, this.planeSize/10, this.planeSize/10);
            const planeMaterial = new THREE.MeshBasicMaterial( {color:0x7f7fff, wireframe:true} );
            this.planes[this.planesUsed] = new THREE.Mesh(planeGeometry, planeMaterial);
            this.planes[this.planesUsed].rotation.x = Math.PI / 2;
            this.scene.add(this.planes[this.planesUsed]);
            this.planeFocus = this.planes[this.planesUsed];
            this.planesUsed++
            this.gameRunning = true;
            this.camera.position.set(0,50,200);
            this.ball.mesh.position.set(0,5,0);
            this.ball.plane.position.set(0,5,0);
            this.stopEffect1();
            this.stopEffect2();
            this.stopEffect3();

            this.effect1Charged = 100;
            this.effect2Charged = 100;
            this.effect3Charged = 100;

            this.incrementCounter = 0;
            this.totalAdvanced = 0;
            this.computedSpeedtIncrement = 0;
            
            this.resetVariables();
            $("#effects").fadeIn(400);
            this.highScore = localStorage.getItem("highscore")                   
            $("#effect1").show();
            $("#effect2").show();
            $("#effect3").show();
            $("#active_helper").hide();
            
            // $("#menu").fadeOut(400);
            this.showMenu = false
            this.animate()
        },
        endGame() {
            this.ball.mesh.visible = false;
            this.ball.plane.visible = false;
            setTimeout(()=>{
                gameRunning = false;
                setHighscore();
                // $("#menu").fadeIn(400);
                this.showMenu = true
                $("#gScore").html("Total Distance: " + Math.round(parseInt(totalAdvanced)));
                $("#gHighScore").html("HIGHSCORE: " + Math.round(highScore));
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
        },
        updateCharge(ctx, charge){
            var angle =  -Math.PI/2 + (this.CIRCLE_CONVERT * this.charge);
            this.drawPieSlice(ctx, 50, 50, -Math.PI/2, angle, 50, "#DD3FB9");
        },
        ObstacleSpawner (time) {
            if (time % Math.floor(this.ran) === 0) {
                let obstacle = new this.Obstacle(this);
                obstacle.init(this.camera.position.z - 400,this.camera.position.z - 700, this.computedSpeedtIncrement);
            }
        },               
        keyboard(keyCode) {
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
        },
        setHighscore() {
            if (totalAdvanced > highScore) {
                highScore = parseInt(totalAdvanced);
                localStorage.setItem("highscore", highScore); 
            }
        },
        triggerEffect1 () {
            if(!effect1IsAllowed){
                return;
            }
            $("#active_helper #label").html("Uncertanty Cloud");

            stopEffect1();
            stopEffect2();
            stopEffect3();
            
            var thisApp = this            
            effect1IntervalUse = setInterval(function(){
                
                thisApp.effect1Charged -= 2;

                if(thisApp.effect1Charged <= 0.1){
                    thisApp.effect1Charged = 0;                       
                    thisApp.stopEffect1(); 
                }
                console.log('inside interval', thisApp)
                updateCharge(thisApp.effect1_ctx, thisApp.effect1Charged);
            },33);
            
            ball.shouldCheck = false;                
            effect1Interval = setInterval(function(){
                if (ball.mesh) {
                    ball.mesh.visible = false;
                    let collisions = ball.getCollisions();
                    if (collisions[0] && collisions[1] && collisions[2]) {
                        thisApp.topMessage = "Chances were against you!";
                        thisApp.endGame();
                    } else if (collisions[1] && collisions[2] || collisions[1] && collisions[0]) {
                        if (Math.random() <= 0.5) {
                            thisApp.topMessage = "Chances were against you!"
                            endGame();
                        } else {
                            thisApp.topMessage = "Chances were with you!"
                        }
                    } 
                }
                if (ball.plane) ball.plane.visible = true;
            },33);
            $("#active_helper").show();
        },
        stopEffect1 () {
            $("#message").hide();
            this.ball.shouldCheck = true;
            $("#active_helper").hide();
            clearInterval(this.effect1Interval);
            clearInterval(this.effect1IntervalUse);
            
            if (this.ball.plane) this.ball.plane.visible = false;
            if (this.ball.mesh) this.ball.mesh.visible = true;

            clearInterval(this.effect1IntervalCharge);
            var thisApp = this
            this.effect1IntervalCharge = setInterval(function(){
                if(thisApp.effect1Charged > 33){
                    thisApp.effect1IsAllowed = true;
                }
                if(thisApp.effect1Charged >= 100){
                    clearInterval(thisApp.effect1IntervalCharge);
                }
                thisApp.effect1Charged += 0.3;
                thisApp.updateCharge(thisApp.effect1_ctx, thisApp.effect1Charged);
            },33);         
        },
        triggerEffect2 () {
            if(!effect2IsAllowed){
                return;
            }
            $("#active_helper #label").html("Qunatum Tunneling");
            stopEffect1();
            stopEffect2();
            stopEffect3();
            thisApp = this
            this.effect2IntervalUse = setInterval(function(){
                thisApp.effect2Charged -= 2;

                if(thisApp.effect2Charged <= 0.1){
                    thisApp.effect2Charged = 0;                       
                    thisApp.stopEffect2(); 
                }
                thisApp.updateCharge(thisApp.effect2_ctx, thisApp.effect2Charged);
            },33);

            this.ball.shouldCheck = false;
            let randomNumber = Math.random();
            this.effect2Interval = setInterval(function(){
                if (thisApp.ball.mesh) {
                    thisApp.ball.mesh.visible = true; 
                    thisApp.ball.mesh.material.opacity = 0.5;
                    if (thisApp.ball.intersections) {
                        let ballsWidth = thisApp.ball.intersections.object.userData.width;
                        let chance = thisApp.interpolate(thisApp.obstacleMinWidth, thisApp.ballsWidth, thisApp.obstacleMaxWidth, 0.8, 0.2);
                        if (randomNumber > chance) {
                            thisApp.topMessage = "You FAILED this time!"
                            endGame();
                        } else {
                            thisApp.topMessage = "You PASSED this time!"
                        }
                    }
                }
                if (ball.plane) ball.plane.visible = false;
            },33);

            $("#active_helper").show();
        },
        stopEffect2() {
            this.ball.shouldCheck = true;
            $("#active_helper").hide();
            clearInterval(this.effect2Interval);
            clearInterval(this.effect2IntervalUse);
            if (this.ball.mesh) {this.ball.mesh.visible = true; this.ball.mesh.material.opacity = 1;}

            clearInterval(this.effect2IntervalCharge);
            var thisApp = this
            this.effect2IntervalCharge = setInterval(function(){
                 
                if(thisApp.effect2Charged > 33){
                    thisApp.effect2IsAllowed = true;
                }
                if(thisApp.effect2Charged >= 100){
                    clearInterval(thisApp.effect2IntervalCharge);
                }
                this.effect2Charged += 0.3;
                thisApp.updateCharge(thisApp.effect2_ctx, thisApp.effect2Charged);
            },33);
        },
        triggerEffect3 () {
            $("#active_helper #label").html("Quantum Entanglement");
            stopEffect1();
            stopEffect2();
            stopEffect3();
            this.ball.shouldCheck = false;
            let randomNumber = Math.random();
            var thisApp = this
            effect3Interval = setInterval(function(){
                if (thisApp.ball.mesh) {thisApp.ball.mesh.visible = true; thisApp.ball.mesh.material.opacity = 0.5;}
                if (thisApp.ball.plane) thisApp.ball.plane.visible = false;
                if (thisApp.ball.intersections) { 
                    let ballsWidth = ball.intersections.object.userData.width;
                    let chance = interpolate(obstacleMinWidth, ballsWidth, obstacleMaxWidth, 0.8, 0.2);
                    if (randomNumber < chance) {
                        thisApp.topMessage = "Yay!"
                    } else {
                        thisApp.topMessage = "Nay!"
                        thisApp.endGame();
                    }
                }
            },33);
            $("#active_helper").show();
        },
        stopEffect3 () {
            this.ball.shouldCheck = true;
            $("#active_helper").hide();
            clearInterval(this.effect3Interval);
            if (this.ball.mesh) {this.ball.mesh.visible = true; this.ball.mesh.material.opacity = 1;}
        },
        animate () {
            this.timeStep = requestAnimationFrame( this.animate );
            if (this.ball && this.ball.raycasters.length) {
                this.ball.update();
            }
            this.ObstacleSpawner(this.timeStep);
            if (this.obstacles.length) {
                for (let i=0;i<this.obstacles.length;i++) {
                    this.obstacles[i].update()
                }
            }
            TWEEN.update()
            this.renderer.render(this.scene, this.camera);
        },
        getRandomArbitrary(min, max) {
            return parseInt(Math.random() * (max - min) + min);
        },
        drawPieSlice(ctx, x, y, startAngle, endAngle, radius, fillStyle) {
            ctx.clearRect(0, 0, 100, 100)
            ctx.fillStyle = fillStyle
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + radius * Math.cos(startAngle), y + radius * Math.sin(startAngle))
            ctx.arc(x, y, radius, startAngle, endAngle)
            ctx.lineTo(x, y)
            ctx.closePath()
            ctx.fill()
        },
        getRoundRandomArbitrary(min, max, round) {
            return Math.round((Math.random()*(max-min)+min)/round)*round;
        },
        interpolate (x1, x2, x3, y1, y3) {
            return ((x2 - x1) * (y3 - y1)) / (x3 - x1) + y1;
        },
        Ball (thisApp) {
            return {
                shouldCheck: true,
                mesh: null,
                life: null,
                plane: null,
                raycasters: [],
                radius: this.qDotRadius,
                collisions: [false,false,false],
                intersections: null,
                thisApp: this,
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
                    thisApp.scene.add(this.mesh);

                    // THREE Plane Object
                    let texture = new THREE.TextureLoader().load( "/dist/assets/img/cloud.png" );
                    this.plane = new THREE.Mesh( 
                        new THREE.PlaneGeometry( thisApp.cloudRadius, thisApp.cloudRadius ),
                        new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, map: texture, transparent:true} ) 
                        );
                    this.plane.visible = false;
                    this.plane.position.y = -thisApp.cloudRadius;
                    this.plane.position.x = -thisApp.cloudRadius;

                    thisApp.scene.add( this.plane );

                    // THREE Plane Object
                    this.raycasters[0] = new THREE.Raycaster(new THREE.Vector3(-thisApp.cloudRadius, 0, 0), new THREE.Vector3(0, 0, 1)); // left
                    this.raycasters[1] = new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1)); // center
                    this.raycasters[2] = new THREE.Raycaster(new THREE.Vector3(thisApp.cloudRadius, 0, 0), new THREE.Vector3(0, 0, 1)); // right
                    let scope = this;
                },
                update: function() {
                    thisApp.incrementCounter++
                    if (thisApp.incrementCounter < thisApp.speedInitialEndValue) {
                        thisApp.computedSpeedtIncrement += thisApp.speedDefault/thisApp.speedInitialEndValue;
                    } else if (thisApp.incrementCounter % thisApp.speedIncrementEvery == 0) {
                        thisApp.computedSpeedtIncrement += thisApp.speedIncrement;
                    }
                    thisApp.totalAdvanced += thisApp.speedIncrement;
                    if(Math.abs(this.mesh.position.z) > (thisApp.planesUsed-1) * thisApp.planeSize - 100) {
                        
                        thisApp.planes[thisApp.planesUsed] = thisApp.planes[thisApp.planesUsed-1].clone();
                        thisApp.planes[thisApp.planesUsed].position.z = - (thisApp.planesUsed *  thisApp.planeSize);
                        thisApp.scene.add(thisApp.planes[thisApp.planesUsed]);
                        if(thisApp.planesUsed - 2 >= 0) {
                            thisApp.planes[thisApp.planesUsed-2].geometry.dispose();
                            thisApp.planes[thisApp.planesUsed-2].material.dispose();
                            thisApp.scene.remove(thisApp.planes[thisApp.planesUsed-2]);
                        }
                        thisApp.planesUsed++
                        if(thisApp.ran > 5) {
                            thisApp.ran = thisApp.ran - 0.1;
                        }
                    }
                    thisApp.camera.lookAt(new THREE.Vector3(0, this.mesh.position.y, this.mesh.position.z))   
                    thisApp.camMovement = thisApp.camera.position.z -= thisApp.computedSpeedtIncrement;                       

                    this.plane.position.z = this.mesh.position.z = thisApp.camMovement - thisApp.camOffset;
                    // $("#score").html("Total Distance: " + Math.round(parseInt(thisApp.totalAdvanced)));   
                    this.raycast();
                    this.checkCollisions();
                },
                checkCollisions: function () {
                    
                    if (!this.shouldCheck) return;

                    let collisions = this.getCollisions()
                    for(let i=0; i<collisions.length; i++) {
                        console.log(collisions)
                        if (collisions[i]) {

                            endGame();
                        }
                    }
                },
                raycast: function () {
                    this.intersections = undefined;
                    this.setCollisions(0, false);
                    this.setCollisions(1, false);
                    this.setCollisions(2, false);

                    let collisionThreshold = 10;
                    this.raycasters[0].ray.origin.x = this.mesh.position.x - this.radius;
                    this.raycasters[0].ray.origin.y = this.mesh.position.y;
                    this.raycasters[0].ray.origin.z = this.mesh.position.z;

                    this.raycasters[0].ray.direction.x = this.mesh.position.x - this.radius;
                    this.raycasters[0].ray.direction.y = this.mesh.position.y;
                    this.raycasters[0].ray.direction.z = this.mesh.position.z - 100;

                    this.raycasters[0].ray.direction = this.raycasters[0].ray.direction.normalize();
                    let ray1Collisions = this.raycasters[0].intersectObjects( thisApp.obstacleHolder.children );
                    if (ray1Collisions.length && ray1Collisions[0].distance <= this.radius + collisionThreshold) {
                        this.setCollisions(0, true);
                    }

                    this.raycasters[1].ray.origin.x = this.mesh.position.x;
                    this.raycasters[1].ray.origin.y = this.mesh.position.y;
                    this.raycasters[1].ray.origin.z = this.mesh.position.z;       

                    this.raycasters[1].ray.direction.x = this.mesh.position.x;
                    this.raycasters[1].ray.direction.y = this.mesh.position.y;
                    this.raycasters[1].ray.direction.z = this.mesh.position.z - 100;

                    this.raycasters[1].ray.direction = this.raycasters[1].ray.direction.normalize();
                    let ray2Collisions = this.raycasters[1].intersectObjects( thisApp.obstacleHolder.children );
                    if (ray2Collisions.length && ray2Collisions[0].distance <= this.radius + collisionThreshold) {
                        this.setCollisions(1, true);
                        this.intersections =  ray2Collisions[0];
                    }

                    this.raycasters[2].ray.origin.x = this.mesh.position.x + this.radius;
                    this.raycasters[2].ray.origin.y = this.mesh.position.y;
                    this.raycasters[2].ray.origin.z = this.mesh.position.z;

                    this.raycasters[2].ray.direction.x = this.mesh.position.x + this.radius;
                    this.raycasters[2].ray.direction.y = this.mesh.position.y;
                    this.raycasters[2].ray.direction.z = this.mesh.position.z - 100;

                    this.raycasters[2].ray.direction = this.raycasters[2].ray.direction.normalize();
                    let ray3Collisions = this.raycasters[2].intersectObjects( thisApp.obstacleHolder.children );
                    if (ray3Collisions.length && ray3Collisions[0].distance <= this.radius + collisionThreshold) {
                        this.setCollisions(2, true);
                    }
                    
                    
                },
                dispose:function () {
                    this.raycasters = [];
                    this.plane.position.z = this.mesh.position.z = 0;
                    this.setCollisions(0,false);this.setCollisions(1,false);this.setCollisions(2,false);
                    this.raycasters[0] = new THREE.Raycaster(new THREE.Vector3(-this.radius, 0, 0), new THREE.Vector3(0, 0, 1)); // left
                    this.raycasters[1] = new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1)); // center
                    this.raycasters[2] = new THREE.Raycaster(new THREE.Vector3(this.radius, 0, 0), new THREE.Vector3(0, 0, 1)); // right
                }
            }
        },
        Obstacle (thisApp) {
            return {
                init: function (depthMin, depthMax, speed) {
                    if (thisApp.spawnerRange < thisApp.obstacleLimit) thisApp.spawnerRange += 10;
                    let length = thisApp.getRandomArbitrary(10,30), height = thisApp.getRandomArbitrary(2,6), width = thisApp.getRandomArbitrary(10,20);
                    let rand = thisApp.getRandomArbitrary(-5,5);

                    let dir = 1;
                    let spwanDistance = 50;
                    if (rand >=0) {
                        dir = -1;
                    }
                    let mesh = new THREE.Mesh(
                        new THREE.BoxGeometry( length, width, height ),
                        new THREE.MeshStandardMaterial( {metalness:0.0, roughness:1.0, color: 0xFFFFFF} )
                    );
                    mesh.position.set(dir * thisApp.getRandomArbitrary(3,63), width/2, thisApp.getRandomArbitrary(depthMin,depthMax))
                    mesh.castShadow = false;
                    mesh.receiveShadow = true;
                    mesh.userData.width = height;
                    thisApp.obstacleHolder.add(mesh);
                    let element = {};
                    element.mesh = mesh;
                    thisApp.obstacles.push(element);
                    element.update = function () {
                        if(mesh.position.z > thisApp.camera.position.z) {
                            mesh.geometry.dispose();
                            mesh.material.dispose();
                            thisApp.obstacleHolder.remove(mesh);
                            mesh = null;
                            thisApp.obstacles.splice(thisApp.obstacles.indexOf(element),1)
                        }
                    }
                }
            }
        },
        keymonitor: function(event) {
            console.log(event.key);
            if(event.key == "Enter")
            {
                console.log("enter key was pressed!");
            }
        },
    },
    computed: {
        setMessage (message) {
            $("#message").show()
            $("#message").html(message)
            this.messageTimeOut = setTimeout(()=>{
                $("#message").hide();
                clearInterval(messageTimeOut)
            },1500);
        },
        keymap () {
            return {
                // 'esc+ctrl' is OK.
                // 'ctrl+esc': this.toggle,
                // 'enter': {
                //     keydown: this.hide,
                //     keyup: this.show
                // },
                'A': {
                    keydown : this.triggerEffect(1),
                    keydown : this.stopEffect(1)

                }
            }
        // A : this.keyboard(65),
        // S : this.keyboard(83),
        // D : this.keyboard(68),
        }
    }
}

</script>   