<template>
    <div>
        <!-- <div id="container"></div> -->

        <div id="photo-container" style="display: none" >
            <div class="photo-container-inner">
                <div id="text-label">{{textFrame}}</div>
                <img id="photo-frame" src='dist/assets/img/frame.png' class="photo-container-frame">
                <img style="display:block" id="imageContainer" src="dist/assets/img/person.png">
                <img style="display:none" id="imageF">
                <div id="photo-buttons">
                    
                        <button id="retake" v-on:click="retakePhoto" href="#">
                            <!-- <i class="material-icons">photo_camera</i> -->
                            <label>Retake Photo</label>
                        </button>
                    
                        <!-- <button id="share_fb" v-on:click="sharePhoto" href="#"> -->
                             <social-sharing url="https://vuejs.org/"
                                    @open="sharePhoto"
                                    title="The Progressive JavaScript Framework"
                                    description="Intuitive, Fast and Composable MVVM for building interactive interfaces."
                                    quote="Vue is a progressive framework for building user interfaces."
                                    hashtags="vuejs,javascript,framework"
                                    twitter-user="vuejs"
                                    inline-template>
                                <div class="social-icons">
                                    <network network="facebook">
                                        <!-- <i class="fa fa-facebook"></i> Facebook -->
                                        <ion-icon name="logo-facebook" size="large"></ion-icon>
                                    </network>

                                    <network network="twitter">
                                        <!-- <i class="fa fa-twitter"></i> Twitter -->
                                        <ion-icon name="logo-twitter" size="large"></ion-icon>
                                    </network>
                              </div>

                            </social-sharing>
                        <!-- </button>      -->                 
                    
                </div>
            </div>
            
        </div>
        
        <div class="photo-splash">
            <div class="photo-splash__inner">
                <div><video ref="video" id="video" width="640" height="480" autoplay></video></div>
                <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
                <div class="photo-select__types">
                    <div class="photo-select" v-on:click="capture()">

                        <div class="photo-select__label">
                            Take Picture
                        </div>
                        
                        <div class="photo-select__icon">
                            <i class="material-icons">photo_camera</i>
                            
                        <!-- <span v-if="value">Take Picture {{value.name}}</span> -->
                    
                        </div>

                    </div>
                    <label for="frontImage" class="photo-select">

                        <div class="photo-select__label">
                            Upload
                        </div>
                        <div class="photo-select__icon">
                            <i class="material-icons">file_upload</i>
                        </div>

                    </label>
                </div>

            </div>

            <input id="frontImage" type="file" @change="handleFileChange"/>
        </div>
        <div id="photo-effects" style="display: none">
            <ul id="filters">
                <button id='normal' v-on:click="_gotToNormal"><img id="normalFilter" src="dist/assets/img/normal.jpg">
                    <label>Normal</label>
                </button>
                <button id='redshift' v-on:click="applyRedshift"><img id="redFilter" src="dist/assets/img/redshift.jpg">
                    <label>RedShift</label>
                </button>
                <button id='spaghetification' v-on:click="applySpaghetify"><img id="spaghetyFilter" src="dist/assets/img/spaghetification.jpg">
                    <label>Spaghetification</label>
                </button>
                <button id='uncertainty' v-on:click="applyUncertanty"><img id="uncertaintyFilter" src="dist/assets/img/uncertanty.jpg">
                    <label>Uncertainty</label>
                </button>
                <button id='gravitational-lens' v-on:click="applyGravitationalLens"><img id="gravitationalLensFilter" src="dist/assets/img/uncertanty.jpg">
                    <label>Gravitational Lens</label>
                </button>
                <button id='uv' v-on:click="applyUV" ><img id="UVFilter" src="dist/assets/img/uncertanty.jpg">
                    <label>UV</label>
                </button>
                <button id='chalkboard' v-on:click="applyChalkboard"><img id="chalkboardFilter" src="dist/assets/img/normal.jpg">
                    <label>Chalkboard</label>
                </button>
                <button id='entanglements' v-on:click="applyEntanglement"><img id="entanglementFilter" src="dist/assets/img/normal.jpg">
                    <label>Entanglement</label>
                </button>
            </ul>
        </div>
    </div>
</template>

    <script>
    // const TWEEN = require('@tweenjs/tween.js');
    require("expose-loader?$!jquery");
    const Hammer = require('hammerjs');
    const SocialSharing = require('vue-social-sharing');
    import store from './../store';
    import Vue from 'vue';
    

    import * as PIXI from 'pixi.js'
    import * as filters from 'pixi-filters';
    import { Container } from 'pixi.js';

    /* 
        Each filter must be installed separately with npm then imported here
        For an up-to-date documentation please visit:
        https://github.com/pixijs/pixi-filters/tree/master/filters
    */

    import { TwistFilter } from '@pixi/filter-twist';
    import { ColorReplaceFilter } from '@pixi/filter-color-replace';
    import { RGBSplitFilter } from '@pixi/filter-rgb-split';
    import { BulgePinchFilter } from '@pixi/filter-bulge-pinch';
    import { EmbossFilter } from '@pixi/filter-emboss';
    import { ReflectionFilter } from '@pixi/filter-reflection';
    import { KawaseBlurFilter } from '@pixi/filter-kawase-blur';
    
    Vue.use(SocialSharing);

    export default {
        data: function() {
            return {
                store,
                captureImage: $('#frontImage'),
                textFrame:'',
                share_fb: document.getElementById('share_fb'),
                lastImageSelected: null,
                img: new Image(),
                xStart: null,
                yStart: null,
                renderableHeight: null,
                renderableWidth: null,
                app,
                container: new Container(),

                video: {},
                canvas: {},

                filters: ['normal', 'spaghetification', 'redshift', 'uncertainty', 'gravitational-lens', 'uv', 'chalkboard', 'entanglements']
            }
        },
        computed: {
            slug: function () {
                var slug = this.$route.params.slug;
                if(this.filters.includes(slug)) {
                    return slug;
                }
                else {
                    return 'normal';
                }
            }
        },
        beforeDestroy : function () {
            this.captureImage.removeEventListener('change', this.handleFileChange);
        },
        mounted: function () {
            this.video = this.$refs.video;
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                    this.video.src = window.URL.createObjectURL(stream);
                });
            }
            var active_filter = '#' + this.slug;
            $(active_filter).addClass('active-filter');         
        },

        beforeRouteLeave(to, from, next) {
            next()
        },

        methods: {
            capture() {
                this.init();
                this.canvas = this.$refs.canvas;
                this.canvas.getContext("2d").drawImage(this.video, 0, 0, 640, 480);
                var url = this.canvas.toDataURL('image/png');
                this.img.src = url;
                this.img.width = 640;
                this.img.height = 480;
                this.fitImageOn(this.img, $('#photo-frame')[0]).then(() => {
                    this.app = PIXI.autoDetectRenderer(this.originalImage.width, this.originalImage.height, {transparent: true});
                    this.sprite = new PIXI.Sprite(new PIXI.Texture.from(this.originalImage));
                    this.container.addChild(this.sprite); 
                    this.applyFiltersOnLoad();
                })
                $('.photo-splash').hide();
                $('#photo-container, #photo-effects').show();
                $('#imageContainer').attr('src',url);
                this.openFilters();
                var btn = '#' + this.slug;
                setTimeout(() => $(btn).trigger('click'), 1500);
            },

            handleFileChange(e) {
                this.init();
                this.readURL(e.target);
                $('.photo-splash').hide();
                $('#photo-container, #photo-effects').show();
                this.openFilters();
                var btn = '#' + this.slug;
                setTimeout(() => $(btn).trigger('click'), 1500);
            },
            init() {
                this.originalImage = document.getElementById('imageContainer');
                this.modifiedImage = document.getElementById('imageF');
                this.photoFrame = $('#photo-frame');
                this.photoFrame[0].style.width = this.originalImage.width;
                this.photoFrame[0].style.height = this.originalImage.height;
                
            },

            readURL(input) {
                return new Promise((resolve, reject) => {                    
                    let reader = new FileReader();
                    if (input.files && input.files[0]) {
                        reader.onload = (e) => {
                            this.img.onload = () => {
                                this.fitImageOn(this.img, $('#photo-frame')[0]).then(() => {
                                    this.app = PIXI.autoDetectRenderer(this.originalImage.width, this.originalImage.height, {transparent: true});
                                    this.sprite = new PIXI.Sprite(new PIXI.Texture.from(this.originalImage));
                                    this.container.addChild(this.sprite); 
                                    this.applyFiltersOnLoad();
                                    this._gotToNormal();
                                })
                            }
                            this.img.src = e.target.result;
                        };
                    reader.readAsDataURL(input.files[0]);
                    }
                })
            },

            applyFiltersOnLoad() {
                let redFilter = document.getElementById('redFilter');
                let spaghetyFilter = document.getElementById('spaghetyFilter');
                let uncertaintyFilter = document.getElementById('uncertaintyFilter');
                let gravitationalLensFilter = document.getElementById('gravitationalLensFilter');
                let UVFilter = document.getElementById('UVFilter');
                let chalkboardFilter = document.getElementById('chalkboardFilter');
                let entanglementFilter = document.getElementById('entanglementFilter');
                this.normalFilter = document.getElementById('normalFilter');
                this.originalImage = document.getElementById('imageContainer');
                normalFilter.src = this.originalImage.src;

                this.redShift(this.originalImage, redFilter);
                this.uncertanty(this.originalImage, uncertaintyFilter);
                this.spaghetify(this.originalImage, spaghetyFilter);
                this.gravitationalLens(this.originalImage, gravitationalLensFilter);
                this.UV(this.originalImage, UVFilter);
                this.chalkboard(this.originalImage, chalkboardFilter);
                this.entanglement(this.originalImage, entanglementFilter);
            },

            fitImageOn(incomingImage, referenceImage) {
                return new Promise((resolve) => {
                    let incomingImgAspectRatio = incomingImage.width / incomingImage.height;
                    let referenceImgAspectRatio = referenceImage.width / referenceImage.height;
                    let resultingCanvas = document.createElement('canvas');
                    let resultingContext = resultingCanvas.getContext("2d");

                    if(incomingImgAspectRatio < referenceImgAspectRatio) {
                        this.renderableWidth = referenceImage.width;
                        this.renderableHeight = incomingImage.height * (this.renderableWidth / incomingImage.width);
                        this.xStart = 0;
                        this.yStart = (referenceImage.height - this.renderableHeight) / 2;
                    } else if(incomingImgAspectRatio > referenceImgAspectRatio) {
                        this.renderableHeight = referenceImage.height;
                        this.renderableWidth = incomingImage.width * (this.renderableHeight / incomingImage.height);
                        this.xStart = (referenceImage.width - this.renderableWidth) / 2;
                        this.yStart = 0
                    } else {
                        this.renderableHeight = referenceImage.width;
                        this.renderableWidth = referenceImage.height;
                        this.xStart = 0;
                        this.yStart = 0;
                    }
                    resultingCanvas.width = referenceImage.width;
                    resultingCanvas.height = referenceImage.height;
                    resultingContext.drawImage(incomingImage, this.xStart, this.yStart, this.renderableWidth, this.renderableHeight);
                    this.originalImage.src = resultingCanvas.toDataURL('image/png');
                    this.originalImage.onload = function() {
                        resolve();
                    }

                })
            },

/*
    To add multiple filters, add the new filter to the container.filters array
*/

            // spaghetify(incomingImage, outgoingImage) {
            //     return new Promise((resolve,reject) => {                   
            //         const fltr = new TwistFilter();
            //         fltr.offset = new PIXI.Point(incomingImage.width/2, incomingImage.height);
            //         fltr.radius = incomingImage.height/2;
            //         fltr.angle = 0.1;
            //         this.container.filters = [fltr];
            //         this.app.render(this.container);
            //         this.app.view.toBlob((src) => {
            //             outgoingImage.src = URL.createObjectURL(src);
            //             resolve();
            //         });
            //     });
            // },
            spaghetify(incomingImage, outgoingImage) {
                return new Promise((resolve,reject) => {                    
                    const fltr = new BulgePinchFilter();
                    fltr.center = new PIXI.Point(0.5, 1);
                    fltr.strength = -1;
                    fltr.radius = incomingImage.height;
                    this.container.filters = [fltr];
                    this.app.render(this.container);

                    this.app.view.toBlob((src) => {
                        outgoingImage.src = URL.createObjectURL(src);
                        resolve();
                    });
                })
            },

            redShift(incomingImage, outgoingImage) {
                return new Promise((resolve,reject) => {
                    this.container.filters = [new ColorReplaceFilter(0xB0B0B0, 0xD40606, 0.50)];
                    this.app.render(this.container);
                    this.app.view.toBlob((src) => {
                        outgoingImage.src = URL.createObjectURL(src);
                        resolve();
                    });
                });
            },            

            // uncertanty(incomingImage, outgoingImage) {
            //     return new Promise((resolve,reject) => {                    
            //         this.container.filters = [new RGBSplitFilter([-5,0], [5,0], [10,0])];
            //         this.app.render(this.container);
                
            //         this.app.view.toBlob((src) => {
            //             outgoingImage.src = URL.createObjectURL(src);
            //             resolve();
            //         });
            //     })
            // },

            uncertanty(incomingImage, outgoingImage) {
                return new Promise((resolve,reject) => {
                    const fltr = new KawaseBlurFilter();
                    fltr.quality = 2;
                    fltr.pixelSize.x = 1.9;
                    fltr.pixelSize.y = 1.9;
                    fltr.blur = 7;
                    // this.container.filters = [new KawaseBlurFilter(13, false, 0, [2.3,2.3], 4 )];
                    this.container.filters = [fltr];
                    this.app.render(this.container);
                
                    this.app.view.toBlob((src) => {
                        outgoingImage.src = URL.createObjectURL(src);
                        resolve();
                    });
                })
            },        

            gravitationalLens(incomingImage, outgoingImage) {
                return new Promise((resolve,reject) => {                    
                    const fltr = new BulgePinchFilter();
                    fltr.center = new PIXI.Point(0.5, 0.5);
                    fltr.strength = 1;
                    fltr.radius = incomingImage.width/1.5;
                    this.container.filters = [fltr];
                    this.app.render(this.container);

                    this.app.view.toBlob((src) => {
                        outgoingImage.src = URL.createObjectURL(src);
                        resolve();
                    });
                })
            },

            UV(incomingImage, outgoingImage) {
                return new Promise((resolve,reject) => {
                    this.container.filters =  [new ColorReplaceFilter(0x000000, 0x740098, 0.50)];
                    this.app.render(this.container);
                    
                    this.app.view.toBlob((src) => {
                        outgoingImage.src = URL.createObjectURL(src);
                        resolve();
                    });                
                })
            },

            chalkboard(incomingImage, outgoingImage) {
                return new Promise((resolve,reject) => {
                    this.container.filters = [new EmbossFilter(3)];
                    this.app.render(this.container);
                    
                    this.app.view.toBlob((src) => {
                        outgoingImage.src = URL.createObjectURL(src);
                        resolve();
                    });
                })
            },

            entanglement(incomingImage, outgoingImage) {
                return new Promise((resolve,reject) => {
                    const fltr = new ReflectionFilter();
                    fltr.boundary = 0.5
                    fltr.mirror = true
                    fltr.amplitude = [0,0]
                    this.container.filters = [fltr];
                    this.app.render(this.container);

                    this.app.view.toBlob((src) => {
                        outgoingImage.src = URL.createObjectURL(src);
                        resolve();
                    });
                })
            },

            _gotToNormal() {
                this.originalImage.style.display = "block";
                this.modifiedImage.style.display = "none";
                this.lastImageSelected = this.originalImage;
            },

            applyRedshift() {
                this.redShift(this.originalImage, this.modifiedImage).then(() => {
                    this.modifiedImage.style.display = "block";
                    this.originalImage.style.display = "none";
                    this.lastImageSelected = this.modifiedImage;
                })
            },

            applySpaghetify() {
                this.spaghetify(this.originalImage, this.modifiedImage).then(() => {
                    this.modifiedImage.style.display = "block";
                    this.originalImage.style.display = "none";
                    this.lastImageSelected = this.modifiedImage;
                    this.textFrame = "I got spaghetified"
                })
            },

            applyUncertanty() { 
                this.uncertanty(this.originalImage, this.modifiedImage).then(() => {
                    this.modifiedImage.style.display = "block";
                    this.originalImage.style.display = "none";
                    this.lastImageSelected = this.modifiedImage;
                    this.textFrame = "Not sure where i am"
                });
            },

            applyGravitationalLens() {
                this.gravitationalLens(this.originalImage, this.modifiedImage).then(() => {
                    this.modifiedImage.style.display = "block";
                    this.originalImage.style.display = "none";
                    this.lastImageSelected = this.modifiedImage;
                });
            },

            applyUV () {
                this.UV(this.originalImage, this.modifiedImage).then(() => {
                    this.modifiedImage.style.display = "block";
                    this.originalImage.style.display = "none";
                    this.lastImageSelected = this.modifiedImage;
                });
            },

             applyChalkboard () {
                this.chalkboard(this.originalImage, this.modifiedImage).then(() => {
                    this.modifiedImage.style.display = "block";
                    this.originalImage.style.display = "none";
                    this.lastImageSelected = this.modifiedImage;
                });
            },

            applyEntanglement () {
                this.entanglement(this.originalImage, this.modifiedImage).then(() => {
                    this.modifiedImage.style.display = "block";
                    this.originalImage.style.display = "none";
                    this.lastImageSelected = this.modifiedImage;
                });
            },

            createImage() {
                this.lastImageSelected = this.originalImage;
                return new Promise((resolve) => {
                    let newCanvas = document.createElement('canvas');
                        newCanvas.width = this.lastImageSelected.width;
                        newCanvas.height = this.lastImageSelected.height;
                    let newContext = newCanvas.getContext("2d");
                    newContext.drawImage(this.lastImageSelected, 0, 0, this.lastImageSelected.width, this.lastImageSelected.height);
                    newContext.drawImage(this.photoFrame[0], 0, 0, this.lastImageSelected.width, this.lastImageSelected.height);
                    resolve(newCanvas);
                })
            },
            
            sharePhoto() {
                this.createImage().then((img) => {
                    var data = img.toDataURL("image/png;base64");
                    FB.getLoginStatus(function(response) {
                        if (response.status === "connected") {
                            postImageToFacebook(response.authResponse.accessToken, "heroesgenerator", "image/png", data, "www.heroesgenerator.com");
                        }
                    })
                })
            },

            retakePhoto(){
                $('.photo-splash').show()
                $('#photo-container').hide()
                this.closeFilters();
            },

            closeFilters() {
                document.getElementById("photo-effects").style.height = "0";
                document.getElementById("photo-container").style.marginBottom = "0";
            },

            openFilters() {
                document.getElementById("photo-effects").style.height = "150px";
                document.getElementById("photo-container").style.marginBottom = "150px";
            }, 

        }
    }
</script>

            
<style>
    body: {
        background-color: #F0F0F0;
    }
    #video {
        background-color: #000000;
    }
    #canvas {
        display: none;
    }
    li {
        display: inline;
        padding: 5px;
    }
</style>