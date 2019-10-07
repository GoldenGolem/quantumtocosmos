const MediaRecorder = require('audio-recorder-polyfill')

class AudioControls {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {};
        this.soundsLoaded = false;
        this.backgroundIsPlaying = false;
        this.waveIsPlaying = false;
        this.lastGoodWave = "beat1";
        this.backgroudStopedPlaying = () => { };
        this.dest = this.audioContext.createMediaStreamDestination();
        this.mediaRecorder = new MediaRecorder(this.dest.stream);
        this.chunks = [];
        this.recordedSound;
        this.isRecording = false;
        this.gainNode = this.audioContext.createGain();
        this.filterM = this.audioContext.createBiquadFilter();
    };

    loadSounds(arg) {
        let soundsToLoad = [];
        for (let name in arg) {
            soundsToLoad.push(this.loadSound(arg[name], name))
        }
        Promise.all(soundsToLoad).then((sounds) => {
            //console.log("Finished loading all sounds", sounds);
            this.soundsLoaded = true;
            this.setBackgroundSound();
            this.setWaveSound();
        })
    }

    setBackgroundSound(name) {
        if (name) this.lastGoodWave = name;
        this.backgroundSource = this.audioContext.createBufferSource();
        this.backgroundSource.buffer = this.sounds[this.lastGoodWave].buffer;
    }

    setWaveSound() {
        this.waveSource = this.audioContext.createBufferSource();
        this.waveSource.buffer = this.sounds["waveSound"].buffer;
    }

    playBackgroundSound() {
        if (this.backgroundIsPlaying) this.stopBackgroundSound();
        this.backgroundSource.connect(this.audioContext.destination);
        this.backgroundSource.start(0);
        this.backgroundIsPlaying = true;
        this.backgroundSource.onended = () => {
            this.stopBackgroundSound();
        }
    }

    recordSounds() {
        this.chunks = [];
        this.isRecording = true;
        this.playBackgroundSound();
        this.backgroundSource.connect(this.dest);
        this.mediaRecorder.addEventListener('dataavailable', evt => {
            this.chunks.push(evt.data);
        })
        this.mediaRecorder.start();
    }

    stopRecording() {
        if (!this.isRecording) return;
        this.stopBackgroundSound();
        this.backgroundSource.disconnect(0);
        this.waveSource.disconnect(0);
        this.mediaRecorder.stop();
        this.isRecording = false;
    }

    playWaveSound(filter, value) {
        if (this.waveIsPlaying) this.stopWaveSound();
        if (this.isRecording) {
            this.createWaveSound(filter, value, this.audioContext.destination, this.dest);
        } else {
            this.createWaveSound(filter, value, this.audioContext.destination);
        }
    }

    createWaveSound(filter, value, destination, additionalDestination) {
        this.stopWaveSound();
        this.waveIsPlaying = true;
        if (filter) {
            this.gainNode.gain.value = this.interpolate(this.minPitch, value, this.maxPitch, 1, 10);
            this.filterM.type = filter;
            this.filterM.frequency.value = value ? value : 440;
            this.waveSource.playbackRate.value = this.interpolate(this.minPitch, value, this.maxPitch, 2.2, 0.3);
            this.waveSource.connect(this.gainNode);
            this.gainNode.connect(this.filterM);
            this.filterM.connect(destination);
            if (additionalDestination) {
                this.filterM.connect(additionalDestination);
            }


            this.waveSource.start(0);
        } else {
            this.waveSource.connect(destination);
            this.waveSource.start(0);
        }
        this.waveSource.onended = () => {
            this.stopWaveSound();
        }
    }

    stopBackgroundSound() {
        if (this.backgroundIsPlaying) {
            this.backgroundSource.stop(0);
        }
        this.backgroundSource.disconnect(0);
        this.setBackgroundSound();
        this.backgroundIsPlaying = false;
        this.backgroudStopedPlaying()

    }

    stopWaveSound() {
        if (!this.waveIsPlaying) return;
        this.waveSource.stop(0);
        this.waveSource.disconnect(0);
        this.setWaveSound();
        this.waveIsPlaying = false;
    }


    init(min, max) {
        this.minPitch = min ? min : 6;
        this.maxPitch = max ? max : 306;
    }

    interpolate(x1, x2, x3, y1, y3) {
        return ((x2 - x1) * (y3 - y1)) / (x3 - x1) + y1
    }

    stopPlaybackSound(name) {
        if (this.sounds[name].isPlaying) {
            this.sounds[name].stop(0);
            this.sounds[name].disconnect(0);
            this.sounds[name] = this.loadSound(this.sounds[name].url, name)
            this.sounds[name].isPlaying = false;
        }

    }

    playbackSound(name) {
        if (this.sounds[name].isPlaying) this.stopPlaybackSound(name);
        this.sounds[name].isPlaying = true;
        this.sounds[name].connect(this.audioContext.destination);
        this.sounds[name].start(0);
        this.sounds[name].onended = () => {
            this.stopPlaybackSound(name);
        }
       //console.log("Should Play sound: ", this.sounds[name])
    }

    loadSound(url, name) {
        let request = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            // Decode asynchronously
            request.onload = () => {
                this.audioContext.decodeAudioData(request.response, (buffer) => {
                    let source = this.audioContext.createBufferSource();
                    source.buffer = buffer;
                    this.sounds[name] = source;
                    this.sounds[name].url = url;
                    resolve(name)
                }, function (err) {
                    reject(err)
                });
            };
            request.send();
        })
    }
}
export default new AudioControls();