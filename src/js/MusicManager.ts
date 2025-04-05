import { Howl } from 'howler';

const volume = 0.5;
let soundId: number;
let paused = false;
const fadeDuration = 400;

const bgm = new Howl({
    src: [import.meta.env.BASE_URL + 'assets/bgm.mp3'],
    loop: true,
    volume: volume,
});

window.addEventListener('pointerdown', resumeBGM);

export function startBGM() {
    if (!bgm.playing()) {
        if (!soundId) {
            soundId = bgm.play();
        } else {
            bgm.play(soundId);
        }
        bgm.fade(0, volume, fadeDuration);
    }
    window.removeEventListener('pointerdown', resumeBGM);
};


export function resumeBGM() {
    paused = false
    if (!bgm.playing()) {
        if (!soundId) {
            soundId = bgm.play();
        } else {
            bgm.play(soundId);
        }
    }
    bgm.fade(bgm.volume(), volume, fadeDuration);
    window.removeEventListener('pointerdown', resumeBGM);
}

export function pauseBGM() {
    paused = true
    bgm.fade(volume, 0, fadeDuration);
    setTimeout(() => {
        if (paused) bgm.pause(soundId);
    }, fadeDuration);
}