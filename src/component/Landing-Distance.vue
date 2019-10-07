<template>
    <div>
        <div id="container"></div>
        <router-view></router-view>
        <div id="next-screen" class="jump-screen" style="display:none;">
            <div class="jump-screen__inner">
                <div class="jump-screen__caption">Lonely around here …</div>
                <button id="next" type="button" class="jump-screen__button">
                    <i class="material-icons">skip_next</i>
                    <span>Jump</span>
                </button>
            </div>
        </div>

        <div id="prev-screen" class="jump-screen" style="display:none;">
            <div class="jump-screen__inner">
                <div class="jump-screen__caption">Lonely around here …</div>
                <button id="prev" type="button" class="jump-screen__button">
                    <i class="material-icons">skip_previous</i>
                    <span>Jump</span>
                </button>
            </div>
        </div>

        <div id="end-scale" style="display: none; position: absolute; margin: auto; width: 100px; height: 100px;  top: 0; right: 0; bottom: 0; left: 0;">End scale</div>
        <div id="start-scale" style=" display: none; position: absolute; margin: auto; width: 100px; height: 100px;  top: 0; right: 0; bottom: 0; left: 0;">Start scale</div>

        <div class="scale-control">

            <div class="scale-control__home">
                <button id="home" type="button">
                    <i class="material-icons">accessibility</i>
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

        <div id="scale" style="width:150px; margin:0 auto;">
            <div id="distanceText"
                 style="position: fixed; bottom:10%; z-index: 1; width:100%; left:0px; text-align:center"></div>
            <div id="scale_legend"
                 style="height: 1px; transform: scale(1,1); position: absolute; bottom:10%; z-index: 1; background-color:#333; margin: auto">
                <div id="line1"
                     style="width: 1px; height: 10px; transform: scale(1,1); position: absolute; left:calc(0% - 1px); top:-5px; background-color:inherit;"></div>
                <div id="line2"
                     style="width: 1px; height: 10px; transform: scale(1,1); position: absolute; left:calc(100% - 1px); top:-5px; background-color:inherit;"></div>
            </div>
        </div>
    </div>
</template>

<script>

    import Raycaster from './Raycaster'
    import Dispose from './Dispose'

    const THREE = require('three')
    const TWEEN = require('@tweenjs/tween.js')
    require("expose-loader?$!jquery")
    require("expose-loader?!jquery-mousewheel")
    require('json-loader')
    const Hammer = require('hammerjs')

    export default {
        mounted: function () {
            this.init()
        },

        beforeRouteLeave(to, from, next) {
            next()
        },
        methods: {

            init() {

                /*
                Use these variables to control the app
                */
                const sceneMultiplier = 100
                const scrollIncrement = sceneMultiplier / 150
                const cameraOffset = 0.18 * sceneMultiplier
                const cameraNear = 3.5
                const gridSize = 300
                const gridDivisions = 30
                const scaleg = 1.5   
                const cameraTweeningType = TWEEN.Easing.Exponential.InOut

                const unW = window.innerWidth/500;
                const unH = window.innerHeight/500;


                const possiblePositions = [
                    {x: 0, y: 0},
                    {x:      unW, y: 2 *  unH},
                    {x: -1 * unW, y: -3 * unH},
                    {x: -3 * unW, y: 3  * unH},
                    {x: -3 * unW, y: -3 * unH},
                    {x: -2 * unW, y: -2 * unH},
                    {x: 2  * unW, y: 2  * unH},
                    {x: -4 * unW, y: -4 * unH},
                    {x: 0  * unW, y: 0  * unH},
                    {x: -1 * unW, y: -2 * unH}
                ]
                 const colorsDefinitions = [

                    [-35,   [249, 255, 228],    [128, 128, 128]],
                    [-25,   [223 , 255, 186],     [90, 90, 90]],
                    [-12,   [186, 255, 238],       [100, 100, 100]],
                    [0,     [247, 254, 252],    [128, 128, 128]],
                    [7,     [30, 185, 191],     [91, 91, 91]],
                    [8,     [0, 158, 168],     [194, 234, 235]],
                    [12,    [3, 55, 89],        [181 , 181, 181]],
                    [26,    [0, 6, 10],         [180, 180, 210]]

                ]

                let appVue = this

                let cameraSpeed = 700
                let scrollCount = 0
                let hexagon, circle, rectangle
                let nameMesh
                let itemHolder
                let group = new THREE.Object3D()
                let container = new THREE.Object3D()
                let toCheckPoint
                let zoomIn

                let min = 0
                let max = 0

                let scalePostion

                let prevScreen = $('#prev-screen'),
                    nextScreen = $('#next-screen'),
                    scaleDiv = $('#scale')[0],
                    scale_legend = $('#scale_legend')[0],
                    ppHolder = $('.pp__holder'),
                    pp = $('.pp'),
                    uiMenu = $('.drawer__open'),
                    legendText = $('#distanceText'),
                    lengendLines = $('#scale_legend'),
                    jumpCaption = $('.jump-screen__caption'),
                    endScale = $('#end-scale'),
                    startScale = $('#start-scale')

                var ID
                setInterval(function(){
                     animate()
                },1000);


                //const womanImg = document.getElementById("woman");


                // setInterval(function(){
                //     womanImg.style.display = 'none';
                // },3000);


                /*
                Use these variables to control the app
                */

                const app = this,
                    scene = new THREE.Scene(),
                    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, cameraNear, 1.4 * sceneMultiplier)

                camera.position.z = cameraOffset
                scene.background = new THREE.Color(colorsDefinitions[0][1])
                scene.fog = new THREE.Fog(colorsDefinitions[0][1], sceneMultiplier*0.1, 1.4 * sceneMultiplier)

                


                var geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1)
                var material = new THREE.MeshBasicMaterial()

                var point = new THREE.Mesh(geometry, material)
                var point2 = new THREE.Mesh(geometry, material)
                point.visible = false
                point2.visible = false

                const jsonLoader = new THREE.FileLoader()
                let json
                let newGrid, newGrid2
                let gridContainer = null
                let meshBoundingBox;

                scene.add(group)
                scene.add(container)

                const frustum = new THREE.Frustum()
                const projScreenMatrix = new THREE.Matrix4()

                let renderer = new THREE.WebGLRenderer({antialias: true}),
                    obj = document.querySelector('#container'),
                    distanceText = document.querySelector('#distanceText')
                renderer.setClearColor(0xffffff, 1)
                renderer.setSize(window.innerWidth, window.innerHeight)
                renderer.setPixelRatio(window.devicePixelRatio || 1)
                renderer.sortObjects = true
                obj.appendChild(renderer.domElement)

                Raycaster.mouse = new THREE.Vector2()
                Raycaster.camera = camera
                Raycaster.raycaster.near = camera.near
                Raycaster.raycaster.far = camera.far
                Raycaster.onClickEntityes = group.children
                Raycaster.container = obj


                let interpolate = function (x1, x2, x3, y1, y3) {
                    return ((x2 - x1) * (y3 - y1)) / (x3 - x1) + y1
                }

                var _interpolateColor = function (color1, color2, factor) {
                    if (arguments.length < 3) {
                        factor = 0.5
                    }
                    var result = color1.slice()
                    for (var i = 0; i < 3; i++) {
                        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]))
                    }
                    return result
                }

                let updateColors = function () {
                    let index = camera.position.z / sceneMultiplier
                    let currentTick = 0
                    let percentOffset = 0
                    let resultBck = []
                    let resultGrid = []
                    for (var i = 0; i < colorsDefinitions.length - 1; i++) {
                        let valueAfter = colorsDefinitions[i + 1]
                        let valueCurrent = colorsDefinitions[i]
                        if (index < valueAfter[0] && index > valueCurrent[0]) {
                            if (valueCurrent[0] >= 0) currentTick = Math.abs(valueCurrent[0] - index)
                            else currentTick = (valueCurrent[0] - index)
                            percentOffset = Math.abs(interpolate(valueCurrent[0], valueCurrent[0] + currentTick, valueAfter[0], 0, 1))
                            resultBck = _interpolateColor(valueCurrent[1], valueAfter[1], percentOffset)
                            resultGrid = _interpolateColor(valueCurrent[2], valueAfter[2], percentOffset)
                        }
                    }

                    scene.background = new THREE.Color("rgb(" + resultBck[0] + "," + resultBck[1] + "," + resultBck[2] + ")")
                    scene.fog.color = scene.background

                    newGrid2.update({
                        color: "rgb(" + resultGrid[0] + "," + resultGrid[1] + "," + resultGrid[2] + ")",
                        opacity: (1-(scalePostion-Math.floor(scalePostion)))/3
                    })
                    newGrid.update({
                        color: "rgb(" + resultGrid[0] + "," + resultGrid[1] + "," + resultGrid[2] + ")",
                        opacity: 0.5
                    })

                    uiMenu.css({'color': "rgb(" + resultGrid[0] + "," + resultGrid[1] + "," + resultGrid[2] + ")"})
                    legendText.css({'color': "rgb(" + resultGrid[0] + "," + resultGrid[1] + "," + resultGrid[2] + ")"})
                    lengendLines.css({'background-color': "rgb(" + resultGrid[0] + "," + resultGrid[1] + "," + resultGrid[2] + ")"})
                    jumpCaption.css({'color': "rgb(" + resultGrid[0] + "," + resultGrid[1] + "," + resultGrid[2] + ")"})
                }

                ////////////////////////////////////
                ////////////////////////////////////


                //////// SCALE LEGEND  ////////////
                ////////////////////////////


                let updateScaleUnit = function () {

                    var scaleValue = Math.floor(scalePostion);

                    var gridPosition = scaleValue

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

                    distanceText.innerHTML = unit + scaleValue.toString().sup() + suffix

                    let proj1 = toScreenPosition(point, camera)
                    let proj2 = toScreenPosition(point2, camera)
                    scale_legend.style.width = (proj2.y - proj1.y) + "px"
                    scale_legend.style.left = proj1.y + "px"
                    

                }
                let animate = function () {
                    scalePostion = (camera.position.z - cameraNear) / sceneMultiplier;
                    updateColors()
                    var gridPosition = Math.floor(scalePostion)
                    gridContainer.position.z = gridPosition * sceneMultiplier
                    renderer.render(scene, camera)
                    updateScaleUnit()

                }


                let toScreenPosition = function (obj, camera) {
                    var vector = new THREE.Vector3()

                    var widthHalf = 0.5 * renderer.context.canvas.width
                    var heightHalf = 0.5 * renderer.context.canvas.height

                    obj.updateMatrixWorld()
                    vector.setFromMatrixPosition(obj.matrixWorld)
                    vector.project(camera)

                    const vx = ( vector.x + 1 ) * renderer.domElement.offsetWidth / 2
                    const vy = ( 1 - vector.y ) * renderer.domElement.offsetHeight / 2

                    return {
                        x: vy,
                        y: vx
                    }

                }

                function getCoordinates(element, camera, userData) {
                    if (element == null) {
                        ppHolder.hide()
                        return
                    }

                    let proj = toScreenPosition(element, camera)
                    var divDistance = camera.position.distanceTo(new THREE.Vector3(0, 0, element.position.z))

                    let ppTop = (proj.x - 650 / divDistance - divDistance * 2) + 'px'
                    let ppLeft = (proj.y - 150) + 'px'

                    let ppIcon = 'info'
                    let ppLabel = 'Find out more'

                    // TODO: we need the final texts here
                    switch (userData.type) {
                        case 'interactive':
                            ppIcon = 'mouse'
                            ppLabel = 'Interactive information'
                            break
                        case 'gallery':
                            ppIcon = 'photo_camera'
                            ppLabel = 'View photo gallery'
                            break
                        case 'video':
                            ppIcon = 'videocam'
                            ppLabel = 'Play the video'
                    }

                    pp.html(`<div class="pp__info"><i class="material-icons">${ppIcon}</i>${ppLabel}</div>`)
                    ppHolder.css({'top': ppTop, 'left': ppLeft})

                    ppHolder.show()

                }

                function ScaleGrid() {
                    this.id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
                    this.gridMaterial = new THREE.LineBasicMaterial({})
                    this.gridGeometry = new THREE.Geometry({})

                    this.init = function (gridSize, gridDivision, color) {
                        var gridCellSize = gridSize / gridDivision
                        for (var i = 0; i < gridSize + 1; i = i + gridCellSize) {
                            this.gridGeometry.vertices.push(
                                new THREE.Vector3(i, 0, 0),
                                new THREE.Vector3(i, gridSize, 0)
                            )
                            this.gridGeometry.vertices.push(
                                new THREE.Vector3(0, i, 0),
                                new THREE.Vector3(gridSize, i, 0)
                            )
                        }

                        this.gridGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(-gridSize / 2, -gridSize / 2, 0))
                        this.gridMaterial.color = new THREE.Color(color)
                        this.gridMaterial.transparent = true
                        this.grid = new THREE.LineSegments(this.gridGeometry, this.gridMaterial)
                    }
                    this.update = function () {
                        for (var i = 0; i < arguments.length; i++) {
                            if (arguments[i].color) {
                                this.gridMaterial.color = new THREE.Color(arguments[i].color)
                                this.gridMaterial.needsUpdate = true
                            }
                            if (arguments[i].opacity) {
                                this.gridMaterial.opacity = arguments[i].opacity
                                this.gridMaterial.needsUpdate = true
                            }
                        }
                    }
                }


                let checkForVisibleObject = (event) => {

                    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
                    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse))
                    prevScreen.hide();
                    nextScreen.hide();

                    for (let i in group.children) {
                        let toCheckPoint = group.children[i].position
                        if (frustum.containsPoint(toCheckPoint) && camera.position.distanceTo(toCheckPoint) < camera.far - cameraOffset && camera.position.distanceTo(toCheckPoint) > 0) {
                            prevScreen.hide();
                            nextScreen.hide();
                            break
                        } else {
                            if (event.deltaY && Number((camera.position.z + cameraOffset - 10).toFixed(0)) >=  min * sceneMultiplier + 1 + cameraOffset && Number((camera.position.z + cameraOffset).toFixed(0)) <= (max + 1) * sceneMultiplier - scrollIncrement) {
                                if (event.deltaY > 0) {
                                    nextScreen.show();
                                    prevScreen.hide();
                                } else if (event.deltaY < 0) {
                                    prevScreen.show();
                                    nextScreen.hide();
                                }
                            }
                        }
                    }
                }


                let getNextAvailablePosition = function (pos, direction) {
                    pos = pos + direction
                    for (let i in json) {
                        if (json[i].distance === pos) {
                            return json[i].distance
                        }
                    }
                    return getNextAvailablePosition(pos, direction)
                }

                const goToNextPrev = (direction) => {
                    let currentCameraPosition = Math.round((camera.position.z - cameraOffset) / sceneMultiplier)
                    let targetPosition = getNextAvailablePosition(currentCameraPosition, direction)

                    prevScreen.hide()
                    nextScreen.hide()

                    goToDistance(targetPosition * sceneMultiplier + cameraOffset)

                }

                const geomLoader = new THREE.JSONLoader()

                geomLoader.load('shapes/Circle.js', function (geometry, materials) {
                        circle = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials))
                    }
                )
                geomLoader.load('shapes/Hexagon.js', function (geometry, materials) {
                        hexagon = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials))
                    }
                )
                geomLoader.load('shapes/Rectangle.js', function (geometry, materials) {
                        rectangle = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials))
                    }
                )

                

                jsonLoader.load('http://138.197.151.180/wordpress/index.php?rest_route=/poi/v1/posts', function (data) {

                    json = JSON.parse(data)

                    let distance
                    let size
                    let usedPosition = {}
                    let colorArrayIndex

                    min = json[0].distance
                    max = json[json.length - 1].distance

                    const textureLoader = new THREE.TextureLoader()


                    gridContainer = new THREE.Object3D()

                    var gridOffset = gridSize/gridDivisions/2;
                    newGrid = new ScaleGrid()
                    newGrid.init(gridSize, gridDivisions, colorsDefinitions[0][1])
                    newGrid.grid.position.set(gridOffset, gridOffset, 0)
                    newGrid.grid.rotation.set(0, 0, 0)
                    newGrid.grid.renderOrder = 0
                    newGrid.update({color: "rgb(0,0,255)", opacity: 0.3})

                    newGrid2 = new ScaleGrid()
                    newGrid2.init(gridSize, gridDivisions*10, colorsDefinitions[0][1])
                    newGrid2.grid.position.set(gridOffset, gridOffset, 0)
                    newGrid2.grid.rotation.set(0, 0, 0)
                    newGrid2.grid.renderOrder = 1
                    newGrid2.update({color: "rgb(255,0,255)", opacity: 0.1})

                    gridContainer.add(newGrid.grid)
                    gridContainer.add(newGrid2.grid)
                    gridContainer.add(point)
                    gridContainer.add(point2)
                    gridContainer.renderOrder = -1000
                    scene.add(gridContainer)

                    point.position.x = -gridOffset
                    point2.position.x = gridOffset

                    for (let i = 0; i < json.length; i++) {

                        distance = (Number(json[i].distance))
                        size = (Number(json[i].size))
                        let title = (json[i].title)
                        let type = json[i].type
                        let mesh;
                        switch (type) {
                            case "gallery":
                                mesh = hexagon.clone()
                                break
                            case "info":
                                mesh = circle.clone()
                                break
                            case "interactive":
                                mesh = hexagon.clone()
                                break
                            case "gallery":
                                mesh = hexagon.clone()
                                break
                            case "video":
                                mesh = circle.clone()
                                break
                        }
 
                        let imageSrc = json[i].image
                        const meshTexture = textureLoader.load(imageSrc)

                        if (imageSrc) {
                            mesh.material = new THREE.MeshBasicMaterial({map: meshTexture, transparent: true})
                        } else {
                            mesh.material = new THREE.MeshBasicMaterial({
                                color: 0xffffff * Math.random(),
                                transparent: true
                            })
                        }

                        if (!usedPosition["Arg" + distance]) {
                            usedPosition["Arg" + distance] = []
                        }
                        usedPosition["Arg" + distance].push("Number")
                        let usedPossiblePosX = possiblePositions[usedPosition["Arg" + distance].length - 1].x;
                        let usedPossiblePosY = possiblePositions[usedPosition["Arg" + distance].length - 1].y;
                        
                        mesh.position.x = usedPossiblePosX + getRandomNumberBetween(-1, 1)
                        mesh.position.y = usedPossiblePosY + getRandomNumberBetween(-1, 1)
                        mesh.position.z = distance * sceneMultiplier;
                        mesh.rotation.x = Math.PI / 2;
                        // mesh.scale.set(1,1,1);
                        
                        mesh.userData = json[i]
                        mesh.renderOrder = i * 10 + 1

                        mesh.geometry.computeBoundingBox();
                        meshBoundingBox = mesh.geometry.boundingBox
                        
                        group.add(mesh)

                        /*
                        NameSprite
                        */
                        const nameGeometry = new THREE.PlaneGeometry(8, 2)
                        const canvas = document.createElement('canvas')
                        const context = canvas.getContext('2d')

                        canvas.width = 2048
                        canvas.height = 512

                        context.font = 100 + "px Arial"
                        context.textAlign = "left"
                        context.textBaseline = "middle";

                        let percentOffset = 0;
                        let currentTick = 0;
                        let resultGrid = [];
                        for (var j = 0; j < colorsDefinitions.length - 1; j++) {
                            let valueAfter = colorsDefinitions[j + 1]
                            let valueCurrent = colorsDefinitions[j]
                            if (distance < valueAfter[0] && distance >= valueCurrent[0]) {
                                if (valueCurrent[0] >= 0) currentTick = Math.abs(valueCurrent[0] - distance)
                                else currentTick = (valueCurrent[0] - distance)
                                
                                percentOffset = Math.abs(interpolate(valueCurrent[0], valueCurrent[0] + currentTick, valueAfter[0], 0, 1));
                                resultGrid = _interpolateColor(valueCurrent[2], valueAfter[2], percentOffset)
                            }
                        }

                        
                        context.fillStyle = "rgb(" + resultGrid[0] + "," + resultGrid[1] + "," + resultGrid[2] + ")"

                        const length = title.length;
                        const charIndex = title.slice(0, 14);
                        const str = '...';
                        let newTitle = charIndex.concat(str);

                        if (length > 14) {
                            context.fillText(newTitle, 10, canvas.height / 2);
                        } else {
                            context.fillText(title, 10, canvas.height / 2);
                        }
                        
                        const canvasTexture = new THREE.Texture(canvas)
                        canvasTexture.needsUpdate = true 
                        canvasTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
                        const nameMaterial = new THREE.MeshBasicMaterial({
                            map: canvasTexture,
                            color: 0xffffff,
                            transparent: true 
                        })
                        nameMesh = new THREE.Mesh(nameGeometry, nameMaterial)
                        
                        let rightSide = getRightSide(mesh.geometry);
                        nameMesh.rotation.x = -Math.PI / 2
                        nameMesh.geometry.computeBoundingBox();
                        
                        let nameMeshBoundingBox = nameMesh.geometry.boundingBox;
                        nameMesh.position.x = (mesh.geometry.boundingBox.max.x + nameMesh.geometry.parameters.width / 2)
                        nameMesh.renderOrder = 410 * (i + 100)
                        nameMesh.renderOrder = true
                        mesh.add(nameMesh);

                    }
                    animate()
                    initEvents()
                })
                
                const getRightSide = (geo) => {
                    let maxX = 0;
                    for (let i=0;i<geo.vertices.length;i++) {
                        if(geo.vertices[i].x>maxX) maxX = geo.vertices[i].x; 
                    }
                   return maxX
                }

                const getRandomNumberBetween = (from, to) => {

                    return Math.random() * (Math.abs(from) + to) + from
                }

                 

                let goToDistance = (cameraTargetPos, animationType) => {
                    if (animationType == undefined) {
                        animationType = cameraTweeningType
                    }
                    updateTween()
                    cameraSpeed = Math.abs(camera.position.z - cameraTargetPos) / 2 + 300

                    appVue.$root.camera_speed = cameraSpeed

                    if (startScale.is(":visible")) {
                        startScale.hide();
                    }
                    if (endScale.is(":visible")) {
                        endScale.hide();
                    }
                    if (nextScreen.is(":visible")) {
                        nextScreen.hide();
                    }
                    if (prevScreen.is(":visible")) {
                        prevScreen.hide();
                    }
                     
                    const tweenDistance = new TWEEN.Tween(camera.position)
                        .to({z: cameraTargetPos}, cameraSpeed)
                        .easing(cameraTweeningType)
                        .onUpdate(function () {
                            animate()
                            gridContainer.position.z = camera.position

                        })
                        .onComplete(function () {
                            gridContainer.position.z = cameraTargetPos
                            cancelAnimationFrame(ID)
                            TWEEN.removeAll()
                            animate()
                        })
                        .start()
                    TWEEN.update()
                }

                let updateTween = function () {

                    ID = requestAnimationFrame(updateTween)
                    TWEEN.update()
                }
                let lastDistance = 0;
                let dir = 1;
                let newDistance = 0;
                function zoomInOut(event) {

                    var preemtiveScrollMax = (max + 1) * sceneMultiplier - scrollIncrement;
                    var preemtiveScrollMin = (min) * sceneMultiplier + 1;

                    if (event.type === "mousewheel") {
                        zoomIn = event.deltaY > 0 ? true : false; 
                        if (zoomIn && camera.position.z >= preemtiveScrollMin) {
                            camera.position.z -= scrollIncrement;                    
                        } else if (camera.position.z <= preemtiveScrollMax) {
                            camera.position.z += scrollIncrement;
                        }
                    } else if (event.type === "pinch") {
                        newDistance = event.scale;
                        if (newDistance < lastDistance) {
                            dir = 1;
                        } else {
                            dir = -1;
                        } 
                        if (camera.position.z >= preemtiveScrollMin && camera.position.z <= preemtiveScrollMax) {
                            camera.position.z += dir * scrollIncrement;   
                        };
                        lastDistance = newDistance;
                    }

                    let cam = camera.position.z + cameraOffset;
                    let camEnd = cam.toFixed();

                    if (camera.position.z + cameraOffset > preemtiveScrollMax) {
                        startScale.show();
                    } else{
                        startScale.hide();
                    }

                    if (camEnd <= preemtiveScrollMin + cameraOffset) {
                        endScale.show();
                    } else {
                        endScale.hide();
                    }

                    ppHolder.hide();
                    checkForVisibleObject.apply(this, arguments)
                    animate()
                }

                let initEvents = function () {

                    let hammer = new Hammer(obj)

                    hammer.get('pinch').set({enable: true})
                    hammer.on('pinch', function (event) {
                        zoomInOut(event)
                    })
                    hammer.on('tap', function (event) {
                        onMouseDown(event)
                    })

                    window.addEventListener('jump', function (e) {
                        goToDistance(e.detail.distance * sceneMultiplier + cameraOffset)
                    })

                    $('#container').on('mousewheel', function (event) {
                        zoomInOut(event)
                    })
                    $('#container').on('mousedown', function (event) {
                        onMouseDown(event)
                    })
                    $('#container').on('mousemove', function (event) {
                        onMouseMove(event)
                    })

                    $("#next").click(function (e) {
                        goToNextPrev(-1)
                    })
                    $("#prev").click(function (e) {
                        goToNextPrev(1)
                    })
                    $("#plus").click(function (e) {
                        goToDistance(camera.position.z - scrollIncrement * 5, TWEEN.Easing.Quadratic.Out)
                    })
                    $("#minus").click(function (e) {
                        goToDistance(camera.position.z + scrollIncrement * 5, TWEEN.Easing.Quadratic.Out)
                    })
                    $("#home").click(function (e) {
                        goToDistance(cameraOffset)
                    })

                    /*
                    Desktop events
                    */

                    window.addEventListener('resize', () => {
                        renderer.setSize(window.innerWidth, window.innerHeight)
                        camera.aspect = window.innerWidth / window.innerHeight
                        camera.updateProjectionMatrix()
                        animate()
                    })

                    let onMouseMove = (event) => {
                        const intersected = Raycaster.cast(event)
                        let maxShowToolTip = cameraOffset * 3
                        let minShowToolTip = 4

                        if (intersected) {
                            $('canvas').css('cursor', 'pointer')
                            let cameraToIntersected = camera.position.distanceTo(intersected.object.position)

                            if (cameraToIntersected <= maxShowToolTip && cameraToIntersected >= minShowToolTip) {
                                getCoordinates(intersected.object, camera, intersected.object.userData)
                            }
                        } else {
                            getCoordinates(null, camera)
                            $('canvas').css('cursor', 'default')
                        }

                    }
                    let onMouseDown = (event) => {
                        const intersected = Raycaster.cast(event)
                        let id
                        if (intersected) {
                            ppHolder.hide();
                            id = intersected.object.userData
                            appVue.$root.itemAction(id)
                        }
                    }

                }
                
            }
        }
    }
</script> 
