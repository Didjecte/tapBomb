import { Application, Container } from 'pixi.js';
import { Bomb } from './Bomb';
import { GameManager } from './GameManager';
// import { GameManager } from './GameManager';

export class BombSpawner {
    app: Application;
    spawnRate: number;
    spawnDelta: number; //randomness of interval
    spawnMin: number; //min interval
    bombContainer: Container;
    gameManager: GameManager;

    constructor(app: Application, gameManager: GameManager) {
        this.app = app;
        this.spawnRate = gameManager.spawnRate;
        this.spawnDelta = 2
        this.spawnMin = 200
        this.bombContainer = new Container();
        this.gameManager = gameManager;
        app.stage.addChild(this.bombContainer);
    }

    startSpawning(): void {
        this.spawnBomb();
        
        this.updateSpawnRate();
    }

    spawnBomb(): void {
        const bomb = new Bomb(this.gameManager);
        bomb.spawn(this.app);
        this.bombContainer.addChild(bomb.sprite);
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