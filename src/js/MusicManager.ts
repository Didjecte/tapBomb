import { Howl } from 'howler';

export class MusicManager {
    static instance: MusicManager;
    volume = 0.4;
    soundId: number | null = null;
    paused = false;
    isFading = false;
    fadeDuration = 400;
    bgm: Howl;

    constructor() {
        this.bgm = new Howl({
            src: [import.meta.env.BASE_URL + 'assets/bgm.mp3'],
            loop: true,
            volume: this.volume,
        })
    }
    
    
    startBGM(): void {
        this.paused = false;

        if (this.soundId !== null && this.bgm.playing(this.soundId)) {
            return;
        }
        this.soundId = this.bgm.play();
        this.bgm.fade(0, this.volume, this.fadeDuration, this.soundId);
    }

    pauseBGM(): void {
        this.paused = true
        this.bgm.fade(this.volume, 0, this.fadeDuration, this.soundId!);
        setTimeout(() => {
            if (this.paused) this.bgm.pause(this.soundId!);
        }, this.fadeDuration);
    }


    resumeBGM(): void {
        this.paused = false;
        if (this.soundId !== null) {
            this.bgm.play(this.soundId);
            this.bgm.fade(this.bgm.volume(), this.volume, this.fadeDuration, this.soundId);
            
        }
    }

    changePlaybackRate(rate: number): void {
        if (this.soundId) {
            this.bgm.rate(rate)
        }
    }


    stopBGM(): void {
        if (this.soundId !== null) {
            this.bgm.fade(this.volume, 0, this.fadeDuration, this.soundId);
            setTimeout(() => {
                this.bgm.stop(this.soundId!);
                this.soundId = null;
            }, this.fadeDuration);
        }
    }
}
