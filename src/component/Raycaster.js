import { Raycaster } from 'three';

class _Raycaster {
    
      constructor() {
        this.mouse = null;
        this.camera = null;
        this.raycaster = new Raycaster();
        this.onClickEntityes = [];
        this.container = null;
        this.recursive = false;
        this.returnAllIntersections = false;
      }
    
      cast(event) {
        let x = event.center ? event.center.x : event.clientX;
        let y = event.center ? event.center.y : event.clientY;
        if (!x || !y) return;
        this.mouse.x = ( x / this.container.clientWidth ) * 2 - 1;
        this.mouse.y = - ( y / this.container.clientHeight ) * 2 + 1;
        this.raycaster.setFromCamera( this.mouse, this.camera );
        const intersects = this.raycaster.intersectObjects(this.onClickEntityes, this.recursive);
        if (this.returnAllIntersections && intersects) {
          return intersects;
        } else if (intersects && intersects[0]) {
            return intersects[0];
        }
      }
    }
    
    export default new _Raycaster();