<template>
    <div>
        <div id="container" v-on:mousewheel.passive="onMouseWheel" v-touch:pinch="pinch">
            <div id="human" v-show="!zoomStarted">
                <img 
                    src="/dist/assets/svg/woman.svg" 
                    alt="human-silhouette"
                />
            </div>
        </div>
        <router-view></router-view>

        <div id="edit-mode">
            
            <label v-html="selectedLabel"></label> 
            <button id="saveItem" type="button" v-bind:class="saveButtonState" ><span v-html="saveButtonLabel"></span></button>
           
            <div></div>
        
        </div>
      
        <div class="help-me">
            <button type="button" v-on:click ="$tours['tourScale'].start()" data-v-step="4">
                <i class="material-icons">help</i>
            </button>
        </div>
        
        <div class="welcome" data-v-step="0"></div>
        <div class="welcome" data-v-step="1"></div>
        <div class="menu-help-dummy" data-v-step="3"></div>
        <div class="welcome" data-v-step="5"></div>

        
        <div class="loading" v-show="!loaded" >
            <label></label>
            <div class="loading__bar" v-bind:style="{ width : loadedAmount + '%' }"></div>
        </div>
        <transition name="fade-up">
            <div class="jump-screen" v-show="skipIn && notJumping">
                <div class="jump-screen__inner">
                    <div class="jump-screen__caption" v-bind:style="{ color : this.currentTextColor }" v-html="jumpString"></div>
                    <button type="button" class="jump-screen__button" v-on:click="goToNextPrev">
                        <i class="material-icons">add</i>
                        <span>Jump in</span>
                    </button>   
                </div>
            </div>
        </transition>
        <transition name="fade-up">
            <div class="jump-screen" v-show="skipOut && notJumping">
                <div class="jump-screen__inner">
                    <div class="jump-screen__caption" v-bind:style="{ color : this.currentTextColor }" v-html="jumpString"></div>
                    <button type="button" class="jump-screen__button" v-on:click="goToNextPrev">
                        <i class="material-icons">remove</i>
                        <span>Jump out</span>
                    </button>
                </div>
            </div>
        </transition>

        <div class="scale-control" data-v-step="2">

            <div class="scale-control__home" >
                <button type="button" v-on:click="goToDistance(0.4)">
                    <i class="material-icons">accessibility_new</i>
                </button>
            </div>

            <div class="scale-control__zoom">

                <button type="button" v-on:click="goToDistance(currentScale- 0.5)">
                    <i class="material-icons">add</i>
                </button>

                <div class="scale-control__delim"></div>

                <button type="button" v-on:click="goToDistance(currentScale+ 0.5)">
                    <i class="material-icons">remove</i>
                </button>
            </div>

        </div>

        
 
        <div class="legend">
            <div class="legend__text"  v-bind:style="{ color : this.currentTextColor }" v-html="legendText"></div>
            <div class="legend__bar" 
                v-bind:style="{ 
                    width   : this.grid_g + 'px', 
                    left    :this.centerScreenX - this.grid_g/2 + 'px', 
                    backgroundColor : currentTextColor 
                }"
                data-v-step="6"
            >

                <!-- <div id="line1" class="scale__legend_vline"></div>
                <div id="line2" class="scale__legend_vline"></div> -->
            </div>
        </div>
        <v-tour name="tourScale" :steps="tourSteps" :options="tourOptions" :callbacks="tourCallbacks"></v-tour>

<!--         <div id="end-scale" style="display: none; position: absolute; margin: auto; width: 100px; height: 100px;  top: 0; right: 0; bottom: 0; left: 0;">End scale</div>
        <div id="start-scale" style=" display: none; position: absolute; margin: auto; width: 100px; height: 100px;  top: 0; right: 0; bottom: 0; left: 0;">Start scale</div> 
        <div class="pp__holder">
            <div class="pp__size">
                <div class="pp"></div>
            </div>
        </div>
-->

        

    </div>
</template>
<script>

    import EventBus  from '../event-bus'
    import * as PIXI from 'pixi.js'
    import axios        from 'axios'
    // const Hammer = require('hammerjs')

    const TWEEN = require('@tweenjs/tween.js')

    export default {

        data () {
            return {
                tourOptions: {
                  useKeyboardNavigation: true
                },
                tourSteps: [
                
                  {
                    target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
                    content: "Select an item on the scale to edit its position.",
                    params: {
                      placement: 'top'
                    }
                  },
                  {
                    target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
                    content: "Then use the keyboard arrows (UP / DOWN / LEFT / RIGHT) to reposition it. For faster movement, hold down the SHIFT key when using the arrows. For finer adjustments, hold down the F key while using the arrows. ",
                    params: {
                      placement: 'top'
                    }
                  },
                  {
                    target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
                    content: "Holding down the SPACE bar while using LEFT / RIGHT arrows will move the title. You can also use SHIFT to go faster and F for fine adjustments when positioning the title.",
                    params: {
                      placement: 'top'
                    }
                  },
                  {
                    target: '[data-v-step="0"]',  // We're using document.querySelector() under the hood
                    content: "Click SAVE to store the new position.",
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
                loaded : false,
                loadedAmount: 0,
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
                grid_g : 0,             // variable grid gutter;
                grid_c : null,          //grid color
                grid_s : 50,            //scale value of distance between grid lines.
                cameraSpeed : 0,
                itemTextures : {},      //loaded images
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
                    [28,    [0, 6, 10],         [255, 217, 0]]
                ],
                // currentScale: {
                //     type: Number,
                //     required: true,
                //     value : 0.4
                // },
                allItems : [],
                gridLinesH_u : [],      //gird horizontal lines - above center
                gridLinesH_d : [],      //grid horizontal lines - bellow center
                gridLinesV_l : [],      // grid vertical lines - left
                gridLinesV_r : [],      // grid vertical lines - right
                centerScreenX : window.innerWidth/2,
                centerScreenY : window.innerHeight/2,
                legendText : "",
                uiMenu : null,
                piLogo : null,
                appContainer: null,
                skipIn : null,
                skipOut: null,
                cameraTweeningType : TWEEN.Easing.Exponential.InOut,
                notJumping: true,
                alreadyLoaded :false,
                jumpString : '',
                moveIncrement : 1,
                selectedItem : null,
                selectedLabel : "Select an object",
                nameMove : false,
                saveButtonLabel: "save",
                saveButtonState: "inactive",

            }
        },
        props: {

        },
        // beforeMount () {
        //     this.appContainer = $('#container')
        //     this.appContainer.addEventListener('mousewheel', this.onScroll);
        // },
        // beforeDestroy () {
        //     this.appContainer.removeEventListener('mousewheel', this.onScroll);
        // },

        watch: {
            currentScale(newVal, oldVal) {
              if(this.loaded){
                this.updateColors()
                this.updateScaleGrid()
                this.updateSceneScale()
                this.changeJumpText()                             
                
              }
            }
        },
        created: function(){
            let thisApp = this
            EventBus.$on('JSON_LOADED', this.init)
            EventBus.$on('JUMP', function(e){
                thisApp.goToDistance(e.detail.distance - (1-e.detail.size) + 0.2)
            })
            EventBus.$on('INFO_ENTRY', function(e){
                thisApp.currentScale = e.detail.distance - (1-e.detail.size) + 0.2
                thisApp.zoomStarted = true
            })
            this.grid = new PIXI.Graphics()               
        },
        mounted: function () {

            if(!this.$cookie.get('scale_guide_finished')){
                this.$tours['tourScale'].start()
            }

            let devicePixelRatio = window.devicePixelRatio

            this.appPixi = new PIXI.Application({width: window.innerWidth * devicePixelRatio, height: window.innerHeight* devicePixelRatio,
                transparent: true,
                resolution: devicePixelRatio
            })
            if(this.elementsNr > 0){
                console.log('init because elemebtsNr')
                this.init()
                               
            }  
        },

        beforeRouteLeave(to, from, next) {
            next()
        },
        beforeDestroy() {
            //remove eventsListeners
        },
        computed: {
            elementsNr: function() {
                return this.$root.posts.length
            }
        },

        methods: {
            changeJumpText: function(){
                this.jumpString = "Lonely around here ..."
                if(this.currentScale < -32){
                    this.jumpString = "Currently, we do not have evidence of many items at this scale.<br> Scroll through to see how big this void is, or JUMP to the next item on the scale"
                }
            },            
            init() {

                let thisApp = this
                if(this.$route.query.value != undefined){
                    this.currentScale = parseFloat(this.$route.query.value)
                    this.zoomStarted = true
                }
                this.alreadyLoaded = true
                this.appContainer = document.getElementById('container')
                
                
                //this.hammer = new Hammer(this.appContainer)

                this.uiMenu = $('.drawer__open'),
                this.piLogo = $('#pi-logo-svg')


                this.scaleMin = this.$root.posts[0].distance + 0.01;
                this.scaleMax = this.$root.posts[this.$root.posts.length-1].distance-0.01;

                let loader = PIXI.loader
                loader.reset() 

                for (let  i = this.elementsNr-1; i >= 0; i--) {

                    if(this.$root.posts[i].scaledistance == 'scale'){
                        loader.add("image_"+this.$root.posts[i].id, this.$root.posts[i].image);
                    }
                }
                           
                loader.load((loader, resources) => {})
                loader.onProgress.add((loader, resource)    => { thisApp.loadedAmount = loader.progress })            
                loader.onComplete.add(()                    => { 
                    thisApp.setupItems()
                    thisApp.loaded = true 
                })


                this.appContainer.appendChild(this.appPixi.view);
                this.container = new PIXI.Container();
                this.appPixi.stage.addChild(this.container);

                this.doGridLines();
                this.container.addChild(this.grid);

                this.container.x = this.centerScreenX;
                this.container.y = this.centerScreenY;

                this.updateScaleGrid();
                this.updateScaleUnit();
                this.updateColors();
                             
                this.resize();

                this.appPixi.ticker.add(function(delta) {
                    TWEEN.update();
                });
                window.addEventListener('resize', () => {                        

                    this.resize();
                })


                //Capture the keyboard arrow keys
                    let left = keyboard(37), // LEFT ARROW
                        up = keyboard(38),   // UP ARROW
                        right = keyboard(39),// RIGHT ARROW
                        down = keyboard(40), // DOWN ARROW
                        shift = keyboard(16),// SHIFT
                        fine = keyboard(70), // F
                        name = keyboard(32); // SPACE                  

                    left.press = () => {
                        if(thisApp.selectedItem){
                            if(thisApp.nameMove){
                                thisApp.selectedItem.title.x -= 10*thisApp.moveIncrement; 
                                thisApp.selectedItem.nx = thisApp.selectedItem.title.x;
                            }else{
                                console.log(thisApp.selectedItem.ix)
                                thisApp.selectedItem.ix -= 10*thisApp.moveIncrement;
                                
                            }
                            thisApp.updateSceneScale();  
                        }                        
                    }
                    right.press = () => {
                        if(thisApp.selectedItem){
                            if(thisApp.nameMove){
                                thisApp.selectedItem.title.x += 10*thisApp.moveIncrement;
                                thisApp.selectedItem.nx = thisApp.selectedItem.title.x;
                            }else{
                                thisApp.selectedItem.ix += 10*thisApp.moveIncrement; 
                            }
                            thisApp.updateSceneScale();  
                        }                           
                    }
                    up.press = () => {
                        if(thisApp.selectedItem){
                            thisApp.selectedItem.iy -= 10*thisApp.moveIncrement; 
                            thisApp.updateSceneScale();
                        }                        
                    }
                    down.press = () => {
                        if(thisApp.selectedItem){
                            thisApp.selectedItem.iy += 10*thisApp.moveIncrement; 
                            thisApp.updateSceneScale();
                        }                        
                    }
                    shift.press = () => {
                        thisApp.moveIncrement = 5;
                    };
                    shift.release = () => {
                        thisApp.moveIncrement = 1;                        
                    };
                    fine.press = () => {
                        thisApp.moveIncrement = 0.1;
                    };
                    fine.release = () => {
                        thisApp.moveIncrement = 1;                        
                    };
                    name.press = () => {
                        thisApp.nameMove = true;
                    };
                    name.release = () => {
                        thisApp.nameMove = false;                        
                    };

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
                      window.addEventListener("keydown", key.downHandler.bind(key), false)
                      window.addEventListener("keyup", key.upHandler.bind(key), false)
                      return key;
                    }
                    $("#saveItem").click(function (e) {
                        $("#status_saved").html('')
                        if(thisApp.selectedItem){
                            console.log(Math.round(thisApp.selectedItem.ix), Math.round(thisApp.selectedItem.iy), Math.round(thisApp.selectedItem.nx), thisApp.selectedItem.obj.id);
                            axios.post(ajaxBaseURL + 'index.php?rest_route=/poi/v1/position/' + thisApp.selectedItem.obj.id, {
                                ix: Math.round(thisApp.selectedItem.ix),
                                iy: Math.round(thisApp.selectedItem.iy),
                                nx: Math.round(thisApp.selectedItem.nx)
                            }).then(response => {
                                console.log(response.statusText)
                                thisApp.saveButtonLabel = "saved"
                                thisApp.saveButtonState = "saved"
                                setTimeout(function() {
                                    thisApp.selectedItem = null
                                    thisApp.selectedLabel = "Select an object"
                                    thisApp.saveButtonLabel = "save"
                                    thisApp.saveButtonState = "inactive"
                                }, 300)
                                //$("#status_saved").html(response.statusText)
                            })
                        }                        
                    });               

            },
            goToDistance (scale){
                if(this.loaded){
                    console.log(scale, this.currentScale)
                    this.zoomStarted = true

                    this.notJumping = false
                    scale = this.limitScale(scale)
                    this.cameraSpeed = Math.abs(scale - this.currentScale)*90 + 300
                    this.$root.camera_speed = this.cameraSpeed
                    
                    let thisApp = this

                    let tweenCurrentScale = new TWEEN.Tween(this)
                        .to({currentScale:scale}, this.cameraSpeed)
                        .easing(this.cameraTweeningType)
                        .onComplete(function () {
                            thisApp.notJumping = true
                            // thisApp.$router.replace({ name: 'scale-of-universe', query: { value: thisApp.currentScale } }) 
                            TWEEN.removeAll()
                        })
                        .start()
                    TWEEN.update()
                   }              
            },
            onMouseWheel (){
                let thisApp = this
                if(this.loaded){
                    this.zoomStarted = true
                    this.currentScale = this.limitScale(this.currentScale + event.deltaY/5000)
                    
                    // clearTimeout($.data(this, 'timer'));
                    // $.data(this, 'timer', setTimeout(function() {
                    //    thisApp.$router.replace({ name: 'scale-of-universe', query: { value: thisApp.currentScale } }) 
                    // }, 250));
                }
            },
            closestObject(){
                if(this.direction == 1){

                    for(let i = 0; i < this.elementsNr; i++){

                        if(this.allItems[i].obj.distance>this.currentScale){

                            return this.allItems[i]
                        }
                    }
                    
                }else{

                    for(let i = this.elementsNr - 1; i >= 0; i--){

                        if( this.allItems[i].obj.distance < this.currentScale){

                            return this.allItems[i]
                        }
                    }
                }                   
            },            
            goToNextPrev() {
                let item = this.closestObject()
                this.goToDistance(item.obj.distance)
            },
            limitScale(scale){
                return Math.min(Math.max(scale, this.scaleMin), this.scaleMax);
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
                this.updateScaleGrid()
                this.updateScaleUnit()
            },

            pinch(direction, e){
                
                if(this.loaded){
                    console.log(direction,this.lastScale, e.scale)
                    this.zoomStarted = true
                    
                    switch(direction) {
                        case "pinchstart":
                            this.lastScale = this.currentScale
                            break;
                        case "pinchin":
                            //this.currentScale = this.lastScale - e.scale/5 + 0.5
                            this.currentScale = this.limitScale( this.lastScale + (1 - e.scale) )
                            break;
                        case "pinchout":
                            
                            this.currentScale = this.limitScale( this.lastScale - event.scale/5 + 0.2)
                            break;
                        case "pinchend":
                            this.$router.replace({ name: 'scale-of-universe', query: { value: this.currentScale } })
                            break;
                        default:

                    }
                }     
            },
            setupItems() {

                let infoSvg = "/dist/assets/svg/info3.svg"
                let infoTexture = PIXI.Texture.fromImage(infoSvg)

                let earthPath = "/dist/assets/img/earth.png"
                let earthTexture = PIXI.Texture.fromImage(earthPath)

                for (let i = this.elementsNr-1; i >= 0; i--) {

                    let obj = this.$root.posts[i]
                    let item = new PIXI.Container();

                    item.title = new PIXI.Text(obj.title,{fontFamily : 'Roboto', fontSize: 24, fill : 0xff1010, align : 'left'});
                    if(obj.type!="simple"){                       
                        item.icon = new PIXI.Sprite(infoTexture)
                        item.title.addChild(item.icon)
                        item.icon.x = -30
                        item.icon.scale.set(0.5,0.5)
                        item.icon.y = 2
                        item.hasIcon = true

                        if(obj.scaledistance == 'distance'){
                            item.icon.x = -48
                            item.icon.y = -24
                        }
                    }

                    if(obj.scaledistance == 'scale') {

                        var texture
                        texture = PIXI.loader.resources["image_"+obj.id].texture
                        

                        item.sprite = new PIXI.Sprite(texture)
                        if(obj.id != 191){ item.sprite.width = item.sprite.height = this.grid_s*10 }
                        item.addChild(item.sprite)
                        item.scale.set(0,0)
                        item.sprite.anchor.set(.5, .5)

                        item.ix = obj.ix ? obj.ix : 0
                        item.iy = obj.iy ? obj.iy : 0
                        item.nx = obj.nx ? obj.nx : 270
                        

                    }else{

                        item.earthIcon = new PIXI.Sprite(earthTexture)
                        item.title.addChild(item.earthIcon)
                        item.earthIcon.x = -25
                        item.earthIcon.y = -57
                        item.earthIcon.scale.set(0.1,0.1)

                        item.iy = obj.iy ? obj.iy : 1
                        item.nx = obj.nx ? obj.nx : 0
                        
                        item.rightArrow = new PIXI.Graphics()
                        item.rightArrow.beginFill(0xFFFFFF)
                        item.rightArrow.drawStar(0,0,3,6,3,1.5708)
                        item.rightArrow.pivot.set(6,0)

                        // item.leftArrow = new PIXI.Graphics()
                        // item.leftArrow.beginFill(0xFFFFFF)
                        // item.leftArrow.drawStar(0,0,3,6,3,-1.5708)
                        // item.leftArrow.pivot.set(-6,0)

                        item.vLine = new PIXI.Graphics()
                        item.vLine.lineStyle(1, 0xFFFFFF, 1);
                        item.vLine.moveTo(0,0)
                        item.vLine.lineTo(0,-500)
                        item.vLine.endFill()

                        item.vLineCenter = new PIXI.Graphics()
                        item.vLineCenter.lineStyle(1, 0xFFFFFF, 1);
                        item.vLineCenter.moveTo(0,0)
                        item.vLineCenter.lineTo(0,-500)
                        item.vLineCenter.endFill()

                        item.hLine = new PIXI.Graphics()
                        item.hLine.lineStyle(1, 0xFFFFFF, 1);
                        item.hLine.moveTo(0,0)
                        item.hLine.lineTo(500,0)
                        item.hLine.endFill()

                        item.grid_s = this.grid_s*10
                        item.title.anchor.set(0,1)

                        item.addChild(item.vLine)
                        item.addChild(item.vLineCenter)
                        item.addChild(item.hLine)
                        item.addChild(item.rightArrow)
                        // item.addChild(item.leftArrow)
                       
                    }    

                    item.title.x = item.nx
                    
                    item.buttonMode = true
                    item.scaledistance = obj.scaledistance
                    item.obj = obj                        
                    item.size = obj.size
                    item.visible = false;

                    
                    this.allItems[i] = item
                    item.addChild(item.title);
                    this.container.addChild(item)
                    let thisApp = this

                    
                    item.interactive = true
                    item.click = function(e) {
                        thisApp.saveButtonState = "active"; 
                        thisApp.selectedItem = this;
                        console.log(thisApp.selectedItem.ix,thisApp.selectedItem.iy )
                        thisApp.selectedLabel = this.obj.title;                            
                    }
                    // if(item.obj.type!="simple"){
                    //     item.interactive = true
                    //     item.click = function(e) {
                    //         thisApp.singleOutElement(item)
                    //         thisApp.$root.itemAction(this.obj)
                        
                    //     }                       
                    // }                    
                }

                this.updateSceneScale();             
            },
            singleOutElement(element){
                
                for (let item of this.allItems){
                   if(item === element){
                        console.log("this is what you clicked on:", element);
                   }
                }
            },
            updateSceneScale() {
               
                let items = 0;
                
                for (let i = 0; i < this.elementsNr; i++) {

                    let element = this.allItems[i]                        
                    let scale = Math.pow(10, element.obj.distance - this.currentScale) * element.obj.size
                 
                    if (scale > 0.006 && scale < 7){
                        items++;
                        element.visible = true;

                        if(element.scaledistance=='scale'){
                            element.scale.set(scale,scale)
                            element.x = element.ix*scale
                            element.y = element.iy*scale
                            
                        }else{
                            
                            let sc_n = scale * element.grid_s
                            let sc_n_v = scale * element.grid_s/3 - scale*element.iy
                            element.vLine.x = sc_n
                            element.rightArrow.scale.set(scale,scale)
                            //element.leftArrow.scale.set(scale,scale)
                            element.rightArrow.x = sc_n
                            element.vLineCenter.height = sc_n_v + sc_n_v*0.2
                            element.vLine.height = sc_n_v
                            element.hLine.width = sc_n
                            element.hLine.y = element.rightArrow.y = -sc_n_v
                            element.title.y = -sc_n_v - sc_n_v*0.05
                            element.title.x = sc_n * 0.02
                            element.title.scale.set(scale,scale)
                            element.hLine.tint = element.vLine.tint = element.vLineCenter.tint = element.rightArrow.tint = this.grid_c                            
                        }
                        
                        let alpha

                        if(scale*scale*scale > 15){
                            alpha = 15/scale/scale/scale
                        }else{
                            alpha = 1
                        }

                        element.alpha = alpha
                        element.title.style.fill = this.currentTextColor
                        // if(element.hasIcon){
                        //     element.icon.tint = this.grid_c
                        // }
                        


                      }else{

                         element.visible = false;

                    }
                }                   

                this.direction = this.prevScale < this.currentScale ? 1 : -1

                if(items == 0){ 

                    if(this.direction == 1){
                        this.skipIn = false
                        this.skipOut = true
                    }else{
                        this.skipIn = true;
                        this.skipOut = false;
                    }
                }else{
                    this.skipIn = false;
                    this.skipOut = false;
                }                


                this.prevScale = this.currentScale
                this.updateScaleUnit();
                this.updateScaleGrid();
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

                if (scaleValue >= 16) {

                    suffix = " ly"

                    if (scaleValue == 16) {
                        scaleValue = ""
                        unit = 1
                    } else {
                        scaleValue = scaleValue - 16
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
            tourNextStep (step) {

                if (step === 3) {
                    
                     // this.$root.display.drawer = true

                }
            },
            tourPreviousStep (step) {


                if (step === 1) {
                  
                }
            },
            tourStop (step) {
                this.$cookie.set('scale_guide_finished', 'One year later', { expires: '1Y' });
                               
            }
        }
    }
</script>