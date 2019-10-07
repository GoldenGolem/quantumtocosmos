import { Object3D } from 'three';
import { Vector3 } from 'three';
const Hammer = require('hammerjs');
const TWEEN = require('@tweenjs/tween.js')

class _DummyRigControls {
    
    constructor(){
        this.rotateSpeed = null;
        this.dampingFactor = null;
        this.enabled = null;
        this.autoRotateInterval = null;
        this.minVertical = null;
        this.maxVertical = null;
    };

    init (camera, scene, container) {
        this.scene = scene;
        this.camera = camera;
        this.container = container;

        this.horizontalDummy = new Object3D();

        this.verticalDummy = new Object3D();

        this.horizontalDummy.add(this.verticalDummy);
        this.horizontalDummy.up.set( 0, 1, 0 );

        this.verticalDummy.add(this.camera);
        this.verticalDummy.up.set( 0, 1, 0 );
        this.verticalDummy.lookAt(this.camera.position)

        scene.add(this.horizontalDummy);

        this.needsUpdate = false;
        this.horizontalCompensationAngle = null;
        this.verticalCompensationAngle = null;

        this.endRotation = function (argument) {
            return undefined;
        };

        this.velocityX = 0;
        this.velocityY = 0;

        this.bindEvents()
    }

    bindEvents () {
        let hammer = new Hammer(this.container);
        let scope = this;
        hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        hammer.on('panstart panmove', function (event) {
            if (!scope.enabled) return;
            scope.horizontalDummy.rotation.y -= event.velocityX * scope.rotateSpeed;
            if (scope.verticalDummy.rotation.x - event.velocityY * scope.rotateSpeed > scope.minVertical && scope.verticalDummy.rotation.x - event.velocityY * scope.rotateSpeed < scope.maxVertical) {
                scope.verticalDummy.rotation.x -= event.velocityY * scope.rotateSpeed;
            }
            scope.velocityX = 0;
            scope.velocityY = 0;
           
        });
        hammer.on('panend', function (event) {
            if (!scope.enabled) return;
            scope.velocityX = event.velocityX;
            scope.velocityY = event.velocityY;
        });        
       
    }

    reset () {
        if (!this.enabled) return;
        this.horizontalDummy.rotation.y = 0;
        this.verticalDummy.rotation.x = 0;

    };

    update() {

        if (this.velocityX > 0) {
            if (this.velocityX - this.dampingFactor <= 0) this.velocityX = 0;
            this.velocityX -= this.dampingFactor;
            this.horizontalDummy.rotation.y -= this.velocityX * this.rotateSpeed;
        } 
        if (this.velocityX < 0) {
            if (this.velocityX + this.dampingFactor >= 0) this.velocityX = 0;
            this.velocityX += this.dampingFactor;
            this.horizontalDummy.rotation.y -= this.velocityX * this.rotateSpeed;
        }
        if (this.velocityY > 0 && this.verticalDummy.rotation.x - this.dampingFactor < this.minVertical && this.verticalDummy.rotation.x + this.dampingFactor > this.maxVertical) {
            if (this.velocityY - this.dampingFactor <= 0) this.velocityY = 0;
            this.velocityY -= this.dampingFactor;
            this.verticalDummy.rotation.x -= this.velocityY * this.rotateSpeed;
        } 
        if (this.velocityY < 0 && this.verticalDummy.rotation.x - this.dampingFactor < this.minVertical && this.verticalDummy.rotation.x + this.dampingFactor > this.maxVertical) {
            if (this.velocityY + this.dampingFactor >= 0) this.velocityY = 0;
            this.velocityY += this.dampingFactor;
            this.verticalDummy.rotation.x -= this.velocityY * this.rotateSpeed;
        }     

        if (this.needsUpdate) {
             TWEEN.update()
        }


    }   

    rotateToPoint (point) {
        this.scene.updateMatrixWorld();
        var vector = new Vector3();
            vector.setFromMatrixPosition( this.camera.matrixWorld );

        let horizontalPoint = new Vector3(point.x,0,point.z);
        let verticalPoint = new Vector3(point.x,point.y,point.z);
        let vertiAbsolute = new Vector3(1,0,0);

        this.horizontalCompensationAngle = horizontalPoint.angleTo(new Vector3(vector.x,0,vector.z));
        this.horizontalDirection = horizontalPoint.cross(vector).y;
        this.horizontalDirection = Math.abs(this.horizontalDirection) / this.horizontalDirection;
            var scope = this;
        console.log(this.horizontalDummy.rotation.y * 180 / Math.PI, this.horizontalDirection, this.horizontalCompensationAngle  * 180 / Math.PI);
        if($(window).width() < 768) {
            new TWEEN.Tween(this.verticalDummy.rotation)
            .to({x: point.angleTo(new Vector3(0, 1, 0)) - Math.PI / 4}, this.autoRotateInterval)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()

            new TWEEN.Tween(this.horizontalDummy.rotation)
            .to({y: this.horizontalDummy.rotation.y - this.horizontalDirection * this.horizontalCompensationAngle + Math.PI / 4}, this.autoRotateInterval)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function () {
                scope.needsUpdate = false;
                scope.endRotation()
            })
            .start()
        }
        else {
            new TWEEN.Tween(this.verticalDummy.rotation)
            .to({x: point.angleTo(new Vector3(0, 1, 0)) - Math.PI / 2}, this.autoRotateInterval)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()

            new TWEEN.Tween(this.horizontalDummy.rotation)
            .to({y: this.horizontalDummy.rotation.y - this.horizontalDirection * this.horizontalCompensationAngle}, this.autoRotateInterval)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function () {
                scope.needsUpdate = false;
                scope.endRotation()
            })
            .start()
        }

        
        this.needsUpdate = true;
        // this.enabled = false;

    }

}
    
export default new _DummyRigControls();