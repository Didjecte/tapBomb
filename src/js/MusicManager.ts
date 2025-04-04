import { Howl } from 'howler';

const bgm = new Howl({
    src: [import.meta.env.BASE_URL + 'assets/bgm.mp3'],
    loop: true,
    volume: 0.5,
});

export function startBGM() {
    if (!bgm.playing()) {
        bgm.play();
    }
};

//try auto play, if not, fallback to play on interact
bgm.playing()

function resumeAudio() {
    if (!bgm.playing()) {
        bgm.play();
    }
    window.removeEventListener('pointerdown', resumeAudio);
}
window.addEventListener('pointerdown', resumeAudio);