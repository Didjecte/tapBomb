import { Application, Container } from 'pixi.js';
import { BlastBomb, Bomb, Grenade } from './Bomb';
import { GameManager } from './GameManager';
// import { GameManager } from './GameManager';

enum ExplosionType {
    none = 1,
    round = 2,
    row = 3,
    collumn = 4
}

export class BombSpawner {
    app: Application;
    bombContainer: Container;
    gameManager: GameManager;
    bombs: Array<Bomb>;
    spawnDelta: number; //randomness of interval
    spawnMax: Array<number>; //max spawn rate
    iniSpawnRates: Array<number>;
    spawnRates: Array<number>;
    idCounter = 1;

    constructor(app: Application, gameManager: GameManager) {
        this.app = app;
        this.bombContainer = new Container();
        this.gameManager = gameManager;
        this.bombs = [];
        this.spawnDelta = 2; //randomness
        this.spawnMax = [0.02, 0.002];
        this.iniSpawnRates = [0.007, 0.001]; //grenade, blastbomb, TnT, gold
        this.spawnRates = [...this.iniSpawnRates];
        app.stage.addChild(this.bombContainer);
    }

    // startSpawning(): void {
    //     this.spawnBomb();
        
    //     this.updateSpawnRate();
    // }

    spawnBomb(i : number): void {
        let bomb: Bomb;
        if (i === 0) {
            bomb = new Grenade(this.gameManager, this, this.idCounter++);
        } else if (i === 1) {
            bomb = new BlastBomb(this.gameManager, this, this.idCounter++);
        } else {
            //backup
            bomb = new Grenade(this.gameManager, this, this.idCounter++);
        }
        this.bombs.push(bomb)
        bomb.spawn(this.app);
        this.bombContainer.addChild(bomb.sprite);
    }
    
    spawnBombs(): void {
        for (let i = 0; i < this.spawnRates.length; i++) {
            const spawnChance = Math.min(this.spawnMax[i], this.spawnRates[i] + this.spawnDelta * this.spawnRates[i] * (Math.random() - 0.5))
            // if (i === 0) console.log(spawnChance)
            
            if (Math.random() < spawnChance) {
                this.spawnBomb(i);
            }
        }
    }

    updateSpawnRates(elapsedTime: number) {
        const curveFactor = Math.pow(1 - elapsedTime / 300, 2); 
        this.spawnRates[0] = this.iniSpawnRates[0] + (1 - curveFactor) * 0.013
        console.log(this.spawnRates[0])

        this.spawnRates[1] = this.iniSpawnRates[1] + (1 - curveFactor) * 0.001
    }

    checkExplosion(explosionType : ExplosionType, x: number, y: number): void {
        switch (explosionType) {
            case ExplosionType.none:
                break;
            
            case ExplosionType.round:
                for (let i = this.bombs.length - 1; i >= 0; i--) {
                    const distance = Math.sqrt(Math.pow(this.bombs[i].sprite.x - x, 2) + Math.pow(this.bombs[i].sprite.y - y, 2));
            
                    if (distance <= 350) {
                        setTimeout(() => {
                            this.bombs[i]?.destroyBomb();
                        }, 30)
                    }
                }
                break;
            
            case ExplosionType.row:
                break;
    
            case ExplosionType.collumn:
                break;
    
            default:
                return;
        }
    }

}