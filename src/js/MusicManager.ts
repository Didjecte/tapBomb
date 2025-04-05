import { Howl } from 'howler';

export class MusicManager {
    static instance: MusicManager;
    volume = 0.5;
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
    
    // startBGM(): number {
    //     this.paused = false;
    //     let id = 0;
    //     console.log(this.bgm.playing(this.soundId))
    //     if (!this.bgm.playing()) {
    //         if (!this.soundId) {
    //             id = this.bgm.play();

    //         } else {
    //             console.log('playing')
    //             this.bgm.play(this.soundId);
    //             id = this.soundId;
    //         }
    //     }
    //     this.bgm.fade(this.bgm.volume(), this.volume, this.fadeDuration, this.soundId);
    //     return id
    // };

    // unlockAudioContext() {
    //     if (Howler.ctx.state === 'suspended') {
    //         Howler.ctx.resume().then(() => {
    //             console.log('Audio context resumed');
    //         });
    //     }
    
    //     // Optionally: start your BGM or play a sound
    //     this.startBGM(); // your function
    // }
    
    startBGM(): void {
        this.paused = false;

        if (this.soundId !== null && this.bgm.playing(this.soundId)) {
            return;
        }
        console.log('startsBGM')
        this.soundId = this.bgm.play();
        this.bgm.fade(0, this.volume, this.fadeDuration, this.soundId);
    }

    // pauseBGM(): void {
    //     this.paused = true;
    //     if (this.soundId !== null && this.bgm.playing(this.soundId) && !this.isFading) {
    //         this.isFading = true
    //         this.bgm.fade(this.volume, 0, this.fadeDuration, this.soundId);
    //         setTimeout(() => {
    //             if (this.paused) {
    //                 this.bgm.pause(this.soundId!);
    //             }
    //             this.isFading = false
    //         }, this.fadeDuration);
    //     }
    // }

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
            // console.log(this.isFading)
            // this.isFading = true
            this.bgm.play(this.soundId);
            // console.log('playing')
            this.bgm.fade(this.bgm.volume(), this.volume, this.fadeDuration, this.soundId);
            
            // setTimeout(() => {
            //     this.isFading = false;
            //     console.log('finsihed')
            // }, this.fadeDuration);
        }
    }

    changePlaybackRate(rate: number): void {
        if (this.soundId) {
            console.log(rate)
            this.bgm.rate(rate)
        }
    }

    // stopBGM(): void {
    //     this.bgm.fade(this.volume, 0, this.fadeDuration, this.soundId!);
    //     setTimeout(() => {
    //         this.bgm.stop(this.soundId!);
    //     }, this.fadeDuration);
    // }

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
