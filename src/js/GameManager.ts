import { Ticker } from 'pixi.js';
import { GameUI } from './GameUI';
import { BombSpawner } from './BombSpawner';

export class GameManager {
    static instance: GameManager;
    gameUI: GameUI | null;
    bombSpawner: BombSpawner | null;
    elapsedTime: number = 0;
    score: number = 0;
    highScore: number = 0;
    lives: number = 9;

    constructor(ui?: GameUI, bombSpawner?: BombSpawner) {
        this.gameUI = ui ?? null,
        this.bombSpawner = bombSpawner ?? null,
        Ticker.shared.add((time) => {
            this.elapsedTime += time.deltaTime / 60;
        });

    }

    setBombSpawner(bombSpawner: BombSpawner) {
        this.bombSpawner = bombSpawner;
    }

    setGameUI(gameUI: GameUI) {
        this.gameUI = gameUI;
    }

    getHighScore(): number {
        return this.highScore
    }

    updateHighscore(score: number): void {
        this.highScore = score;
    }

    getScore(score: number): number {
        return score;
    }
    
    addScore(score: number) : void {
        this.score += score;
        if (this.gameUI) this.gameUI.updateScore(this.score);
    }

    getLives(): number {
        return this.lives;
    }

    removeLives(): void {
        if (this.lives > 0) {
            this.lives--;
            if (this.gameUI) this.gameUI.updateLives(this.lives);
        }
    }
}