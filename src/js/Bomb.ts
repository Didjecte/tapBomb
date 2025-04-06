import { Application, Sprite, Graphics, FillGradient, Rectangle } from 'pixi.js';
import { GameManager } from './GameManager';
import gsap from 'gsap';
import { Howl } from 'howler';
import { ShockwaveFilter } from 'pixi-filters';
import { BombSpawner } from './BombSpawner';

enum ExplosionType {
    none = 1,
    round = 2,
    row = 3,
    collumn = 4
}

export class Bomb {
    id: number;
    hp: number;
    spawnRate: number;
    score: number;
    sprite: Sprite;
    boomType: ExplosionType;
    boomGraphics: Graphics | Sprite;
    boomSound: Howl;
    bombspawner: BombSpawner;
    gameManager: GameManager;
    app: Application | null;

    constructor(gameManager: GameManager, bombSpawner: BombSpawner, id: number, hp: number, spawnRate: number, score: number, sprite: Sprite, boomType: ExplosionType, boomGraphics: Graphics | Sprite, boomSound: Howl) {
        this.id = id;
        this.hp = hp;
        this.spawnRate = spawnRate
        this.score = score;
        this.sprite = sprite;
        this.boomType = boomType;
        this.boomGraphics = boomGraphics;
        this.boomSound = boomSound;
        this.bombspawner = bombSpawner;
        this.gameManager = gameManager;
        this.app = null;
    };

    spawn(app : Application) : void {
        const startRotation = -Math.PI/4;
        this.sprite.anchor.set(0.5);

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

    clicked(): void {
        this.gameManager.addScore(this.score, this.sprite.x, this.sprite.y);
        this.destroyBomb();
    }

    touchedBottom(): void {
        this.gameManager.removeLives();
        this.destroyBomb();
    }

    destroyBomb(): ExplosionType {
        const idx = this.bombspawner.bombs.findIndex(bomb => bomb.id === this.id)
        if (idx !== -1) {
            this.bombspawner.bombs.splice(idx, 1);  // Remove the bomb at the found index
        } else {
            'no bombs'
        }
        const boomType = this.boomType
        const x = this.sprite.x
        const y = this.sprite.y
        setTimeout(() => {
            this.bombspawner.checkExplosion(boomType, x, y);
        }, 10)

        this.sprite.parent.addChild(this.boomGraphics);
        this.boomGraphics.position.set(this.sprite.x, this.sprite.y);
        const scaleIni = this.boomGraphics.scale.x
        this.boomGraphics.scale.set(0)
        this.boomGraphics.hitArea = new Rectangle(0, 0, 0, 0);
        
        this.gameManager.addAnim(
            gsap.to(this.boomGraphics.scale, {
                duration: 0.2,
                x: scaleIni,
                y: scaleIni,
                ease: 'back.out(1.5)',
            })
        )
        
        this.gameManager.addAnim(
            gsap.to(this.boomGraphics, {
                duration: 0.4,
                alpha: 0,
                ease: 'power4.in',
                onComplete: () => {
                    gsap.killTweensOf(this.boomGraphics);
                    this.boomGraphics.parent.removeChild(this.boomGraphics)
                    this.boomGraphics.destroy({
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
        });
        const filterStage = this.sprite.parent.parent;
        filterStage.filters = [shockwaveFilter];
        shockwaveFilter.center = [this.sprite.x, this.sprite.y];

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
        })
        return this.boomType
    }
}

export class Grenade extends Bomb {
    constructor(gameManager: GameManager, bombSpawner: BombSpawner, id: number) {
        const sprite = Sprite.from('bomb1');
        sprite.scale.set(0.4);
        const boomSound = new Howl({
            src: [import.meta.env.BASE_URL + 'assets/boom1.mp3'],
            volume: 1.4,
        });
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
        graphics.scale.set(0.8);
        super(gameManager, bombSpawner, id, 1, 0.5, 1, sprite, ExplosionType.none, graphics, boomSound)
    };
}

export class BlastBomb extends Bomb {
    constructor(gameManager: GameManager, bombSpawner: BombSpawner, id: number) {
        const sprite = Sprite.from('bomb2');
        sprite.scale.set(0.3);
        const boomSound = new Howl({
            src: [import.meta.env.BASE_URL + 'assets/boom2.mp3'],
            volume: 1.2,
        });
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
        graphics.circle(0, 0, 350).fill(fill);
        graphics.scale.set(0.8);
        super(gameManager, bombSpawner, id, 1, 0.25, 1, sprite, ExplosionType.round, graphics, boomSound)
    };
}

export class ColBomb extends Bomb {
    constructor(gameManager: GameManager, bombSpawner: BombSpawner, id: number) {
        const sprite = Sprite.from('bomb3');
        sprite.scale.set(0.3);
        const boomSound = new Howl({
            src: [import.meta.env.BASE_URL + 'assets/boom3.mp3'],
            volume: 0.25,
        });
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
        graphics.ellipse(0, 0, 60, 2000).fill(fill);
        super(gameManager, bombSpawner, id, 1, 0.25, 1, sprite, ExplosionType.collumn, graphics, boomSound)
    };
}

export class GoldBomb extends Bomb {
    constructor(gameManager: GameManager, bombSpawner: BombSpawner, id: number) {
        const sprite = Sprite.from('bomb4');
        sprite.scale.set(0.25);
        const boomSound = new Howl({
            src: [import.meta.env.BASE_URL + 'assets/boom4.mp3'],
            volume: 0.25,
        });
        const graphics = Sprite.from('coin')
        graphics.anchor.set(0.5)
        graphics.scale.set(0.2)
        super(gameManager, bombSpawner, id, 1, 0.25, 10, sprite, ExplosionType.none, graphics, boomSound)
    };
}