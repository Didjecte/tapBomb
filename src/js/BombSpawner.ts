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
    spawnRate: number;
    spawnDelta: number; //randomness of interval
    spawnMin: number; //min interval
    bombContainer: Container;
    gameManager: GameManager;
    bombs: Array<Bomb>;
    idCounter = 1;

    constructor(app: Application, gameManager: GameManager) {
        this.app = app;
        this.spawnRate = gameManager.spawnRate;
        this.spawnDelta = 2
        this.spawnMin = 200
        this.bombContainer = new Container();
        this.gameManager = gameManager;
        this.bombs = [];
        app.stage.addChild(this.bombContainer);
    }

    startSpawning(): void {
        this.spawnBomb();
        
        this.updateSpawnRate();
    }

    spawnBomb(): void {
        const bomb = new BlastBomb(this.gameManager, this, this.idCounter++);
        this.bombs.push(bomb)
        bomb.spawn(this.app);
        this.bombContainer.addChild(bomb.sprite);
    }

    checkExplosion(explosionType : ExplosionType, x: number, y: number): void {
        switch (explosionType) {
            case ExplosionType.none:
                break;
            
            case ExplosionType.round:
                console.log(this.bombs)
                for (let i = this.bombs.length - 1; i >= 0; i--) {
                    const distance = Math.sqrt(Math.pow(this.bombs[i].sprite.x - x, 2) + Math.pow(this.bombs[i].sprite.y - y, 2));
            
                    if (distance <= 300) {
                        setTimeout(() => {
                            console.log(this.bombs)
                            console.log(i)
                            this.bombs[i]?.destroyBomb();
                            console.log('--------')
                        }, 30)
                    }
                }
                console.log('done')
                break;
            
            case ExplosionType.row:
                break;
    
            case ExplosionType.collumn:
                break;
    
            default:
                return;
        }
    }

    getSpawnRate(): number {
        return this.spawnRate
    }

    setSpawnRate(rate: number): void {
        this.spawnRate = rate
    }

    updateSpawnRate() {
        const nextSpawn = Math.max(this.spawnMin, this.spawnRate + this.spawnDelta * this.spawnRate * (Math.random() - 0.5))
        setTimeout(() => {
            if (!this.gameManager.paused) {
                this.spawnBomb();
            }
            this.updateSpawnRate(); // Continue adjusting the spawn interval over time
        }, nextSpawn);
    }

}