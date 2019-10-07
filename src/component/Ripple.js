class Wave {

    constructor() {
        // this.scale = null;
        // this.amplitude = null;
        this.interval = null;
    }
    start(scale, amplitude) {
        this.interval = setInterval(function () {
            scale += 0.2;
            amplitude = scale;
            console.log(amplitude)
        }, 100);
    }
    stop(interval){
        clearInterval(this.interval);
    }
}
export default Wave;