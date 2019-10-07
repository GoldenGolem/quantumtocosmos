<template>
    <div>
        <div id="container">
            <div id="human"></div>
        </div>
        <router-view></router-view>
        
        
        
        <div class="help-me">
            <button id="tour" type="button" data-v-step="4">
                <i class="material-icons">help</i>
            </button>
        </div>
        
        <div class="welcome" data-v-step="0"></div>
        <div class="welcome" data-v-step="1"></div>
        <div class="menu-help-dummy" data-v-step="3"></div>
        <div class="welcome" data-v-step="5"></div>
        <div id="next-screen" class="jump-screen" style="display:none;">
            <div class="jump-screen__inner">
                <div class="jump-screen__caption" v-bind:style="{ color : this.currentTextColor }">Lonely around here … </div>
                <button id="next" type="button" class="jump-screen__button">
                    <i class="material-icons">add</i>
                    <span>Jump in</span>
                </button>   
            </div>
        </div>
        <div class="loading show">
            <label></label>
            <div class="loading__bar"></div>
        </div>

        <div id="prev-screen" class="jump-screen" style="display:none;">
            <div class="jump-screen__inner">
                <div class="jump-screen__caption" v-bind:style="{ color : this.currentTextColor }">Lonely around here … </div>
                <button id="prev" type="button" class="jump-screen__button">
                    <i class="material-icons">remove</i>
                    <span>Jump out</span>
                </button>
            </div>
        </div>

        <div id="end-scale" style="display: none; position: absolute; margin: auto; width: 100px; height: 100px;  top: 0; right: 0; bottom: 0; left: 0;">End scale</div>
        <div id="start-scale" style=" display: none; position: absolute; margin: auto; width: 100px; height: 100px;  top: 0; right: 0; bottom: 0; left: 0;">Start scale</div>

        <div class="scale-control" data-v-step="2">

            <div class="scale-control__home" >
                <button id="home" type="button">
                    <i class="material-icons">accessibility_new</i>
                </button>
            </div>

            <div class="scale-control__zoom">

                <button id="plus" type="button">
                    <i class="material-icons">add</i>
                </button>

                <div class="scale-control__delim"></div>

                <button id="minus" type="button">
                    <i class="material-icons">remove</i>
                </button>
            </div>

        </div>

        <div class="pp__holder">
            <div class="pp__size">
                <div class="pp"></div>
            </div>
        </div>
 
        <div id="legend" style="width:150px; margin:0 auto;">
            <div class="legend__text" v-bind:style="{ color : this.currentTextColor }">{{legendText}}</div>
            <div class="legend__bar" 
                v-bind:style="{ 
                    width   : this.grid_g + 'px', 
                    left    :this.centerScreenX - this.grid_g/2 + 'px', 
                    backgroundColor : currentTextColor 
                }"
            >

                <!-- <div id="line1" class="scale__legend_vline"></div>
                <div id="line2" class="scale__legend_vline"></div> -->
            </div>
        </div>
        <v-tour name="tourScale" :steps="tourSteps" :options="tourOptions" :callbacks="tourCallbacks"></v-tour>

    </div>
</template>

<script>

    import axios from 'axios'
    import * as PIXI from 'pixi.js';

    const TWEEN = require('@tweenjs/tween.js')
    const Hammer = require('hammerjs')


    export default {

        data () {
            return {
                tourOptions: {
                  useKeyboardNavigation: true
                },
                tourSteps: [
                  {
                    target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
                    content: "<strong>WELCOME!</strong><br> How big are the things in our universe? <br>Let's start with the size of a human being.",
                    params: {
                      placement: 'top'
                    }
                  },
                  {
                    target: '[data-v-step="1"]',  // We're using document.querySelector() under the hood
                    content: "Start scrolling (or pinch/zoom on your phone) to begin your journey.",
                    params: {
                      placement: 'top'
                    }
                  },
                  {
                    target: '[data-v-step="2"]',  // We're using document.querySelector() under the hood
                    content: "Or use the + and - to navigate. You can also return to the human using the icon here.",
                    params: {
                      placement: 'left'
                    }
                  },
                  {
                    target: '[data-v-step="3"]',  // We're using document.querySelector() under the hood
                    content: "Looking for something in particular? You can see every element on the scale here and jump to whatever interests you.",
                    params: {
                      placement: 'right'
                    }
                  },
                  {
                    target: '[data-v-step="4"]',  // We're using document.querySelector() under the hood
                    content: "Use the question mark to see the tour again at any time.",
                    params: {
                      placement: 'left'
                    }
                  },
                  {
                    target: '[data-v-step="5"]',  // We're using document.querySelector() under the hood
                    content: "Ready to fly through the universe? <br><strong>Let's go!</strong>",
                    params: {
                      placement: 'top'
                    }
                  }
                ],
                tourCallbacks: {
                    onPreviousStep: this.tourPreviousStep,
                    onNextStep: this.tourNextStep,
                    onStop: this.tourStop
                },
                appPixi : null,
                container : null,
                grid : null,
                loader : null,
                loaded : false,
                zoomStarted : false,
                currentScale : 0.4,
                jSonData : null,
                minScale : 0,
                maxScale : 0,
                scaleMin : 0,
                scaleMax : 0,
                lastScale : 1,
                direction : 1,
                currentTextColor : null,
                grid_g : 0, // variable grid gutter;
                grid_c : null, //grid color
                grid_s : 50, //scale value of distance between grid lines.
                cameraSpeed : 0,
                scaleOnlyItems : [], //sort only scale elements
                distanceOnlyItems : [], //sort only distance elements
                itemTextures : {}, //loaded images
                prevScale : 0.4,
                colorsDefinitions : [

                    [-35,   [249, 255, 228],    [128, 128, 128]],
                    [-25,   [223 , 255, 186],     [90, 90, 90]],
                    [-12,   [186, 255, 238],       [100, 100, 100]],
                    [0,     [247, 254, 252],    [128, 128, 128]],
                    [7,     [30, 185, 191],     [91, 91, 91]],
                    [8,     [0, 158, 168],     [194, 234, 235]],
                    [12,    [3, 55, 89],        [181 , 181, 181]],
                    [24,    [0, 6, 10],         [180, 180, 210]],
                    [25,    [0, 6, 10],         [255, 255, 255]]

                ],
                allItems : [],     //array of all itmes
                gridLinesH_u : [], //gird horizontal lines - above center
                gridLinesH_d : [], //grid horizontal lines - bellow center
                gridLinesV_l : [], // grid vertical lines - left
                gridLinesV_r : [], // grid vertical lines - right
                centerScreenX : window.innerWidth/2,
                centerScreenY : window.innerHeight/2,
                legendText : "",
                uiMenu : null,
                piLogo : null,
                hammer : null,

            }
        },
        mounted: function () {
            var thisApp = this
            this.init()

            if(!this.$cookie.get('scale_guide_finished')){
                this.$tours['tourScale'].start()
            }         
        },

        beforeRouteLeave(to, from, next) {
            next()
        },
        beforeDestroy() {
            //remove eventsListeners
        },

        methods: {

            init() {
                let appVue = this;
                let appContainer = document.getElementById('container')
                this.grid = new PIXI.Graphics();

                var devicePixelRatio = window.devicePixelRatio;


                const cameraTweeningType = TWEEN.Easing.Exponential.InOut
                this.hammer = new Hammer(appContainer)
         
                //html elements
                let prevScreen = $('#prev-screen'),
                    nextScreen = $('#next-screen'),
                    scaleDiv = $('#scale')[0],
                    ppHolder = $('.pp__holder'),
                    pp = $('.pp'),                  
                    lengendLines = $('.legend__bar'),
                    endScale = $('#end-scale'),
                    startScale = $('#start-scale'),
                    loadDiv = $('.loading'),
                    loadBar = $('.loading__bar')

                // $('.drawer__open').addClass('hide')
                $('#human').load('/dist/assets/svg/woman.svg');                

                this.uiMenu = $('.drawer__open'),
                this.piLogo = $('#pi-logo-svg')

                this.appPixi = new PIXI.Application({width: window.innerWidth* devicePixelRatio, height: window.innerHeight* devicePixelRatio,
                  transparent: true,
                  resolution: devicePixelRatio
                })


                appContainer.appendChild(this.appPixi.view);
                this.container = new PIXI.Container();
                this.appPixi.stage.addChild(this.container);

                this.doGridLines();
                this.container.addChild(this.grid);
                container.x = this.centerScreenX;
                container.y = this.centerScreenY;

                this.updateScaleGrid();
                this.updateScaleUnit();
                this.updateColors();

                /// Load jSon ///
                this.loadJSON(function(response) {
                    jSonData = JSON.parse(response);
                    this.loadAssets();
                });

                this.loader = PIXI.loader;
                this.resize();

                this.initSceneEvents()

                

                loader.onProgress.add(function(loader, resource){

                    //console.log('Loaded : ' + loader.progress + '%' + ', name : ' + resource.name + ', url : ' + resource.url);
                    loadBar[0].style.width = loader.progress + '%';
                });

                loader.onComplete.add(() => { 

                    loadDiv.removeClass('show').addClass('hide');
                    this.loaded = true;                              
                });                


                appPixi.ticker.add(function(delta) {
                    TWEEN.update();
                });


                

                
            },
            loadAssets(){

                scaleMin = jSonData[0].distance +0.01;
                scaleMax = jSonData[jSonData.length-1].distance-0.01;

                console.log(scaleMin, scaleMax);
                for (let i = 0; i < jSonData.length; i++) {

                    //allItems.push(jSonData[i]);

                    if(jSonData[i].scdst == 'scale'){
                        scaleOnlyItems.push(jSonData[i]);
                    }else if(jSonData[i].scdst == 'distance'){
                        distanceOnlyItems.push(jSonData[i]);
                    }
                }
                for (let  j= scaleOnlyItems.length-1; j >= 0; j--) {
                    let obj = scaleOnlyItems[j];
                    loader.add("image_"+obj.id, obj.image);
                }

                loader.load((loader, resources) => {});
            },
            startZoomFunction(){
                console.log("startZoomFunction() called, loaded:", appVue.loaded)

                if(appVue.loaded && !appVue.zoomStarted){
                    $('#human').hide()
                    setupItems()
                    appVue.zoomStarted = true
                    
                }                        
            },
            loadJSON(callback) {

                var xobj = new XMLHttpRequest();
                    xobj.overrideMimeType("application/json");
                xobj.open('GET', 'http://138.197.151.180/wordpress/index.php?rest_route=/poi/v1/posts', true); // Replace 'my_data' with the path to your file
                xobj.onreadystatechange = function () {
                      if (xobj.readyState == 4 && xobj.status == "200") {
                        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                        callback(xobj.responseText);
                      }
                };
                xobj.send(null);
            },
            goToDistance (scale){

                scale = limitScale(scale);
                cameraSpeed = Math.abs(scale - this.currentScale)*80 + 300
                appVue.$root.camera_speed = cameraSpeed;

                const tweenDistance = new TWEEN.Tween(appPixi)
                    .to({currentScale:scale}, cameraSpeed)
                    .easing(cameraTweeningType)
                    .onUpdate(function () {
                        updateSceneScale();
                        updateColors();

                    })
                    .onComplete(function () {
                        TWEEN.removeAll()

                    })
                    .start()
                TWEEN.update()
            },
            zoomInOut(event){
                    
                if(appVue.loaded){
                    this.currentScale += event.deltaY/5000;
                    this.currentScale = limitScale(this.currentScale);
                        
                    updateColors();
                    updateScaleGrid();
                    updateSceneScale(); 
                }else{
                    startZoomFunction()
                }     
            },
            closestObject(direction, currentScale){
                    
                if(direction == 1){

                    for(let i = 0; i < allItems.length; i++){

                        if(allItems[i].obj.distance>currentScale){

                            return allItems[i]
                        }
                    }
                    
                }else{

                    for(let i = allItems.length - 1; i >= 0; i--){

                        if( allItems[i].obj.distance < currentScale){

                            return allItems[i]
                        }
                    }
                }                   
            },            
            goToNextPrev() {
                let item = closestObject(direction, this.currentScale)
                console.log(item.obj.distance)
                goToDistance(item.obj.distance)
            },
            limitScale(scale){
                if(scale < scaleMin){scale = scaleMin}
                if(scale > scaleMax){scale = scaleMax}
                return scale;
            },
            resize(){
                var W = window.innerWidth;
                var H = window.innerHeight;
                
                this.centerScreenX = W/2;
                this.centerScreenY = H/2;

                this.container.x = this.centerScreenX;
                this.container.y = this.centerScreenY;

                this.appPixi.view.width = W * this.devicePixelRatio;
                this.appPixi.view.height = H * this.devicePixelRatio;
                this.appPixi.view.style.width = W + 'px';
                this.appPixi.view.style.height = H + 'px';
                this.appPixi.renderer.resize(W, H);

                for (var i = this.grid.children.length - 1; i >= 0; i--) { 
                    this.grid.removeChild(this.grid.children[i])
                }
                this.doGridLines()
                this.updateScaleUnit()
                this.updateScaleGrid()
            },
            initScaleEvents(){
                    
                hammer.on('pinchstart', function (event) {
                    lastScale = this.currentScale
                })

                hammer.on('pinchout', function (event){
                    this.currentScale = lastScale - event.scale/5 + 0.2;
                    updateColors()
                    updateSceneScale()
                    
                })

                hammer.on('pinchin', function (event) {
                    this.currentScale = lastScale + (1 - event.scale)
                    updateColors()
                    updateSceneScale()
                    
                })                    


                // appContainer.addEventListener('dblclick', function (event) {
                //     goToDistance(Math.round(this.currentScale)-1)
                // })

                // appContainer.addEventListener('mousedown', function (event) {
                //     onMouseDown(event)
                // })
                // appContainer.addEventListener('mousemove', function (event) {
                //     onMouseMove(event)
                // })

                appContainer.removeEventListener('mousewheel', startZoomFunction)
                appContainer.addEventListener('mousewheel',zoomInOut)

                $(nextScreen).click(function (e) {
                    goToNextPrev()
                })
                $(prevScreen).click(function (e) {
                    goToNextPrev()
                })
                $("#plus").unbind()

                $("#plus").click(function (e) {
                    goToDistance(Math.round(this.currentScale)- 1);
                })
                $("#minus").unbind()

                $("#minus").click(function (e) {
                    goToDistance(Math.round(this.currentScale)+ 1);
                })
                $("#home").click(function (e) {
                    goToDistance(0.4);
                })
            },
            initSceneEvents() {

                this.hammer.get('pinch').set({enable: true})
                // appContainer.addEventListener('mousewheel', zoomInOut)

                // appContainer.addEventListener('mousewheel', function (event) {
                //     zoomInOut(event);
                // })
                // appContainer.addEventListener('mousewheel', startZoomFunction)

                appContainer.addEventListener('mousewheel', startZoomFunction)
                // appContainer.addEventListener('mousewheel', function() {
                //     console.log('something')
                // })

                $("#plus").click(startZoomFunction)
                $("#minus").click(startZoomFunction)

                $("#tour").click(function (e) {
                    appVue.$tours['tourScale'].start()
                })

                /*
                Desktop events
                */
                window.addEventListener('jump', function (e) {

                    if(appVue.loaded){
                        startZoomFunction()
                        goToDistance(e.detail.distance-(1-e.detail.size)+0.2);
                    }         
                })

                window.addEventListener('resize', () => {                        

                    resize();
                })
            },
            setupItems() {

                for (let i = jSonData.length-1; i >= 0; i--) {

                    let obj = jSonData[i]
                    let item = new PIXI.Container();

                    item.title = new PIXI.Text(obj.title,{fontFamily : 'Roboto', fontSize: 24, fill : 0xff1010, align : 'left'});
                    

                    if(obj.scdst == 'scale') {

                        var texture

                        if(obj.id==191){                                
                            texture = PIXI.Texture.fromImage('/dist/assets/img/universe-simulation.jpg')
                        }else{
                            texture = PIXI.loader.resources["image_"+obj.id].texture
                        }

                        item.sprite = new PIXI.Sprite(texture)
                        if(obj.id != 191){ item.sprite.width = item.sprite.height = grid_s*10 }
                        item.addChild(item.sprite)
                        item.scale.set(0,0)
                        item.sprite.anchor.set(.5, .5)

                        item.ix = obj.ix ? obj.ix : 0
                        item.iy = obj.iy ? obj.iy : 0
                        item.nx = obj.nx ? obj.nx : 270
                        

                    }else{

                        item.iy = obj.iy ? obj.iy : 1
                        item.nx = obj.nx ? obj.nx : 0
                        
                        item.dot = new PIXI.Graphics()
                        item.dot.beginFill(0xffd900)
                        item.dot.drawStar(0,0,3,6,3,1.5708)
                        item.dot.pivot.set(6,0)

                        item.vLine = new PIXI.Graphics()
                        item.vLine.lineStyle(1, 0xffd900, 1);
                        item.vLine.moveTo(0,0)
                        item.vLine.lineTo(0,-500)
                        item.vLine.endFill()

                        item.hLine = new PIXI.Graphics()
                        item.hLine.lineStyle(1, 0xffd900, 1);
                        item.hLine.moveTo(0,0)
                        item.hLine.lineTo(500,0)
                        item.hLine.endFill()

                        item.grid_s = grid_s*10
                        item.title.anchor.set(0,1)

                        item.addChild(item.vLine)
                        item.addChild(item.hLine)
                        item.addChild(item.dot)
                       
                    }    

                    item.title.x = item.nx
                    item.interactive = true
                    item.buttonMode = true
                    item.scdst = obj.scdst
                    item.obj = obj                        
                    item.size = obj.size
                    item.visible = false;

                    
                    allItems[i] = item
                    item.addChild(item.title);
                    container.addChild(item)
                    
                    item.click = function(e) {

                            ppHolder.hide();
                            appVue.$root.itemAction(this.obj);
                        
                    }

                    // if(!item.obj.type=="info"){

                       
                    // }
                    

                    // sprite.mouseover = function(mouseData) {
                    //   //this.alpha = 0.2;
                    // }

                    // // make circle half-transparent when mouse leaves
                    // sprite.mouseout = function(mouseData) {
                    //   //this.alpha = 1;
                    // }
                }

                updateSceneScale();
                initScaleEvents();                
            },
            updateSceneScale() {

                let items = 0;
                
                for (let i = 0; i < allItems.length; i++) {

                    let element = allItems[i]                        
                    let scale = Math.pow(10, element.obj.distance - this.currentScale) * element.obj.size
                    

                    if (scale > 0.006 && scale < 7){
                        items++;
                        element.visible = true;

                        if(element.scdst=='scale'){
                            element.scale.set(scale,scale)
                            element.x = element.obj.ix*scale
                            element.y = element.obj.iy*scale
                            
                        }else{
                            
                            let sc_n = scale * element.grid_s
                            let sc_n_v = scale * element.grid_s/3 - scale*element.iy
                            // console.log(element.obj.title, scale, element.grid_s)
                            element.vLine.x = sc_n
                            element.dot.scale.set(scale,scale)
                            element.dot.x = sc_n
                            element.vLine.height = sc_n_v
                            element.hLine.width = sc_n
                            element.hLine.y = element.dot.y = -sc_n_v
                            element.title.y = -sc_n_v
                            element.title.scale.set(scale,scale)
                            element.hLine.tint = element.vLine.tint = grid_c                            
                        }
                        
                        let alpha;

                        if(scale*scale*scale > 15){
                            alpha = 15/scale/scale/scale;
                        }else{
                            alpha = 1;
                        }

                        element.alpha = alpha;
                        element.title.style.fill = currentTextColor;


                      }else{

                         element.visible = false;

                    }
                }                   

                this.direction = this.prevScale < this.currentScale ? 1 : -1

                if(items == 0){                        
                //console.log(direction)
                    if(direction == 1){
                        prevScreen.show()
                        nextScreen.hide()
                    }else{
                        nextScreen.show()
                    }
                }else{
                    nextScreen.hide()
                    prevScreen.hide()
                }


                this.prevScale = this.currentScale
                updateScaleUnit();
                updateScaleGrid();
            },
            doGridLines (){

                var vLines = Math.round(window.innerWidth/2/this.grid_s);
                var hLines = Math.round(window.innerHeight/2/this.grid_s);

                //vertical Lines;
                for(var i=0; i<hLines; i++){

                    var line = new PIXI.Graphics(true);
                    //line.cacheAsBitmap = true;
                    line.lineStyle(1, 0xCCCCCC);
                    line.moveTo(-innerWidth/2,0);
                    line.lineTo(innerWidth/2,0);

                    this.grid.addChild(line);

                    var line2 = new PIXI.Graphics(true);
                    //line2.cacheAsBitmap = true;
                    line2.lineStyle(1, 0xCCCCCC);
                    line2.moveTo(-innerWidth/2,0);
                    line2.lineTo(innerWidth/2,0);

                    this.grid.addChild(line2);


                    this.gridLinesH_u[i] = line;
                    this.gridLinesH_d[i] = line2;
                }

                for(var i=0; i<vLines; i++){

                    var line = new PIXI.Graphics(true);
                    //line.cacheAsBitmap = true;
                    line.lineStyle(1, 0xCCCCCC);
                    line.moveTo(0,-innerHeight/2);
                    line.lineTo(0,innerHeight/2);

                    this.grid.addChild(line);

                    var line2 = new PIXI.Graphics(true);
                    //line2.cacheAsBitmap = true;
                    line2.lineStyle(1, 0xCCCCCC);
                    line2.moveTo(0,-innerHeight/2);
                    line2.lineTo(0,innerHeight/2);

                    this.grid.addChild(line2);

                    this.gridLinesV_l[i] = line;
                    this.gridLinesV_r[i] = line2;
                }
            },
            updateScaleGrid() {
                var g
                if(this.currentScale > 0){
                    g = Math.pow(10, (1 - (Math.abs(this.currentScale) % 1)));
                }else{
                    g = Math.pow(10, (Math.abs(this.currentScale) % 1));
                }

                this.grid.alpha = 0.2 + g/50
                this.grid_g = g * this.grid_s
                for(let i = 0; i < this.gridLinesH_u.length; i++) {

                    this.gridLinesH_u[i].tint = this.grid_c
                    this.gridLinesH_d[i].tint = this.grid_c
                    this.gridLinesH_d[i].y = (i+1) * this.grid_g - this.grid_g/2 
                    this.gridLinesH_u[i].y = -(i+1) * this.grid_g + this.grid_g/2

                }

                for(let i = 0; i < this.gridLinesV_l.length; i++) {

                    this.gridLinesV_l[i].tint = this.grid_c
                    this.gridLinesV_r[i].tint = this.grid_c
                    this.gridLinesV_l[i].x = (i+1) * this.grid_g - this.grid_g/2 
                    this.gridLinesV_r[i].x = -(i+1) * this.grid_g + this.grid_g/2

                }
            },            
            updateScaleUnit() {

                var scaleValue = Math.floor(this.currentScale);

                var gridPosition = scaleValue;

                var suffix = " m"
                var unit = 10

                if (scaleValue >= 15) {

                    suffix = " ly"

                    if (scaleValue == 15) {
                        scaleValue = ""
                        unit = 1
                    } else {
                        scaleValue = scaleValue - 15
                    }

                }
                if (scaleValue == 0) {
                    unit = 1
                    scaleValue = ""
                }
                if (scaleValue == 1) {
                    scaleValue = ""
                }

                this.legendText = unit + scaleValue.toString().sup() + suffix
            },
            updateColors() {

                let index = this.currentScale;
                let currentTick = 0
                let percentOffset = 0
                let resultBck = []
                let resultGrid = []
                for (var i = 0; i < this.colorsDefinitions.length - 1; i++) {
                    let valueAfter = this.colorsDefinitions[i + 1]
                    let valueCurrent = this.colorsDefinitions[i]
                    if (index < valueAfter[0] && index >= valueCurrent[0]) {
                        if (valueCurrent[0] >= 0) currentTick = Math.abs(valueCurrent[0] - index)
                        else currentTick = (valueCurrent[0] - index)
                        percentOffset = Math.abs(this.interpolate(valueCurrent[0], valueCurrent[0] + currentTick, valueAfter[0], 0, 1))
                        resultBck = this._interpolateColor(valueCurrent[1], valueAfter[1], percentOffset)
                        resultGrid = this._interpolateColor(valueCurrent[2], valueAfter[2], percentOffset)
                    }
                }

                document.body.style.backgroundColor = 'rgb(' + resultBck[0] + ',' + resultBck[1] + ',' + resultBck[2] + ')';

                this.currentTextColor = 'rgb(' + resultGrid[0] + ',' + resultGrid[1] + ',' + resultGrid[2] + ')';

                this.uiMenu.css({'color': this.currentTextColor})           
                this.piLogo.css({'fill': this.currentTextColor})

                this.grid_c = this.rgbToHex(resultGrid[0],resultGrid[1],resultGrid[2]);
            },
            rgbToHex(r, g, b) {
                // if(!componentToHex(r) || !componentToHex(r) || !componentToHex())
                return "0x" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
            },
            componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            },
            _interpolateColor(color1, color2, factor) {
                if (arguments.length < 3) {
                    factor = 0.5
                }
                var result = color1.slice()
                for (var i = 0; i < 3; i++) {
                    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]))
                }
                return result
            },
            interpolate(x1, x2, x3, y1, y3) {

                return ((x2 - x1) * (y3 - y1)) / (x3 - x1) + y1
            },
            openDrawer() {

                this.$root.display.drawer = true
            },
            tourNextStep (step) {
                console.log('[Vue Tour] A custom nextStep callback has been called on step ' + (step + 1))
                if (step === 3) {
                    
                    console.log('[Vue Tour] A custom nextStep callback has been called from step 2 to step 3')
                    // this.openDrawer()

                }
            },
            tourPreviousStep (step) {
                console.log('[Vue Tour] A custom previousStep callback has been called on step ' + (step + 1))

                if (step === 1) {
                  console.log('[Vue Tour] A custom previousStep callback has been called from step 2 to step 3')
                }
            },
            tourStop (step) {
                this.$cookie.set('scale_guide_finished', 'One year later', { expires: '1Y' });
                console.log('[Vue Tour] Finished')                
            }
        }
    }
</script>

