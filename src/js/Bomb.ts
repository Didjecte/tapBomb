import { Application, Sprite, Graphics, FillGradient } from 'pixi.js';
import { GameManager } from './GameManager';
import gsap from 'gsap';
import { Howl } from 'howler';
import { ShockwaveFilter } from 'pixi-filters';


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
    app: Application | null;
    tl: gsap.core.Timeline;

    constructor(gameManager: GameManager) {
        this.hp = 1;
        this.score = 1;
        this.explosionType = ExplosionType.cross;
        this.gameManager = gameManager;
        this.app = null;
        this.boomSound = new Howl({
            src: [import.meta.env.BASE_URL + 'assets/boom.mp3'],
            volume: 1.4,
        });
        this.sprite = Sprite.from('bomb1');
        this.tl = gsap.timeline()
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
        this.gameManager.addAnim(
            gsap.to(this.sprite, {
                x: destinationx,
                duration: duration,
                ease: 'sine.out',
            })
        )

        //y
        this.gameManager.addAnim(
            gsap.to(this.sprite, {
                y: app.screen.height + this.sprite.height / 2,
                duration: duration,
                ease: 'sine.in',
                onComplete: this.touchedBottom.bind(this),
            })
        )

        //rotation
        this.gameManager.addAnim(
            gsap.to(this.sprite, {
                duration: duration,
                rotation: startRotation - 2 * Math.PI + (4 * Math.PI) * Math.random(),
                ease: 'linear'
            })
        )


        this.sprite.on("pointerdown", () =>  {
            if (!this.gameManager.gameOver) {
                this.clicked()
            }
        });
    }

    clicked() {
        this.gameManager.togglePause
        this.gameManager.addScore(1);
        this.destroyBomb();
    }

    touchedBottom() {
        this.gameManager.removeLives();
        this.destroyBomb();
    }

    destroyBomb() {
        //explosion
        const graphics = new Graphics()
        const fill = new FillGradient({
            type: 'radial',
            center: { x: 0.5, y: 0.5 },
            innerRadius: 0,
            outerCenter: { x: 0.5, y: 0.5 },
            outerRadius: 0.5,
            colorStops: [
                { offset: 0, color: '#ffee00' },
                { offset: 1, color: '#de7e00' },
            ],
        });
        
        graphics.star(0, 0, 4, 200, 10, 2*Math.PI*1/4).fill(fill);
        this.sprite.parent.addChild(graphics);
        graphics.position.set(this.sprite.x, this.sprite.y);
        graphics.scale.set(0)
        
        this.gameManager.addAnim(
            gsap.to(graphics.scale, {
                duration: 0.2,
                x:0.8,
                y:0.8,
                ease: 'back.out(1.5)',
            })
        )
        
        this.gameManager.addAnim(
            gsap.to(graphics, {
                duration: 0.4,
                alpha: 0,
                ease: 'power4.in',
                onComplete: () => {
                    gsap.killTweensOf(graphics);
                    graphics.parent.removeChild(graphics)
                    graphics.destroy({
                        children: true
                    });
                },
            })
        )

        // filter
        const shockwaveFilter = new ShockwaveFilter({
            amplitude : 70,
            wavelength: 100,
            radius: 300,
            speed: 40
        })
        const filterStage = this.sprite.parent.parent
        filterStage.filters = [shockwaveFilter]
        shockwaveFilter.center = [this.sprite.x, this.sprite.y]

        this.gameManager.addAnim(
            gsap.to(shockwaveFilter, {
                time: 10,
                ease: 'power2.out', // Animation easing
                onComplete: () => {
                    filterStage.filters = []
                    gsap.killTweensOf(shockwaveFilter);
                    shockwaveFilter.destroy()
                }
            })
        )
        
        this.boomSound.play();
        this.sprite.parent.removeChild(this.sprite)
        gsap.killTweensOf(this.sprite);
        this.sprite.destroy({
            children: true
        });
    }

}