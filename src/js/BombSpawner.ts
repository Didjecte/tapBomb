import { Application, Container } from 'pixi.js';
import { Bomb } from './Bomb';
import { GameManager } from './GameManager';
// import { GameManager } from './GameManager';

export class BombSpawner {
    app: Application;
    spawnInterval: number;
    spawnDelta: number; //randomness of interval
    spawnMin: number; //min interval
    bombContainer: Container;
    gameManager: GameManager;

    constructor(app: Application, gameManager: GameManager) {
        this.app = app;
        this.spawnInterval = 1500; //1.5s
        this.spawnDelta = 2
        this.spawnMin = 200
        this.bombContainer = new Container();
        this.gameManager = gameManager;
        app.stage.addChild(this.bombContainer);
    }

    startSpawning() {
        this.spawnBomb();
        
        this.updateSpawnInterval();
    }

    spawnBomb() {
        const bomb = new Bomb(this.gameManager);
        bomb.spawn(this.app);
        this.bombContainer.addChild(bomb.sprite);
    }

    updateSpawnInterval() {
        const nextSpawn = Math.max(this.spawnMin, this.spawnInterval + this.spawnDelta * this.spawnInterval * (Math.random() - 0.5))
        
        // Schedule next bomb spawn with the updated interval
        setTimeout(() => {
            this.spawnBomb();
            this.updateSpawnInterval(); // Continue adjusting the spawn interval over time
        }, nextSpawn);
    }

}