import { Application, Sprite } from 'pixi.js';
import { GameManager } from './GameManager';
import gsap from 'gsap';
import { Howl } from 'howler';


enum ExplosionType {
    cross = 1,
    plus = 2,
    row = 3,
    collumn
}

export class Bomb {
    hp: number;
    explosionType: ExplosionType;
    score: number;
    sprite: Sprite;
    gameManager: GameManager;
    boomSound: Howl;

    constructor(gameManager: GameManager) {
        this.hp = 1;
        this.score = 1;
        this.explosionType = ExplosionType.cross;
        this.gameManager = gameManager;
        this.boomSound = new Howl({
            src: [import.meta.env.BASE_URL + 'assets/boom.mp3'],
            volume: 1.4,
        });
        this.sprite = Sprite.from('bomb1');
    };

    spawn(app : Application) : void {
        const startRotation = -Math.PI/4;
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.4);

        //random spawn point along y
        this.sprite.x = this.sprite.width / 2 + (app.screen.width - this.sprite.width) * Math.random();
        this.sprite.y = - this.sprite.height / 2;

        this.sprite.rotation = startRotation; //change starting angle
        this.sprite.interactive = true; // Enable interaction

        const duration = 3;

        // can fall 2x size left or right vertically
        let destinationx = this.sprite.x - 8 * this.sprite.width * (Math.random() - 0.5);

        //make sure the bomb doesnt curve offscreen
        destinationx = Math.max(this.sprite.width / 2, destinationx);
        destinationx = Math.min(app.screen.width - this.sprite.width / 2, destinationx);

        //x
        gsap.to(this.sprite, {
            x: destinationx,
            duration: duration,
            ease: 'sine.out',
        });

        //y
        gsap.to(this.sprite, {
            y: app.screen.height + this.sprite.height / 2,
            duration: duration,
            ease: 'sine.in',
            onComplete: this.touchedBottom.bind(this),
        });

        //rotation
        gsap.to(this.sprite, {
            duration: duration,
            rotation: startRotation - 2 * Math.PI + (4 * Math.PI) * Math.random(),
            ease: 'linear'
        });

        // app.stage.addChild(this.sprite)

        this.sprite.on("pointerdown", () =>  this.clicked());
    }

    clicked() {
        console.log('clicked');
        this.gameManager.addScore(1);
        this.destroyBomb();
    }

    touchedBottom() {
        console.log('fell');
        this.gameManager.removeLives();
        this.destroyBomb();
    }

    destroyBomb() {
        this.boomSound.play();
        gsap.killTweensOf(this.sprite)
        this.sprite.destroy();
    }

}