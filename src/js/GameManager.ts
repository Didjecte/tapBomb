import { Ticker, Application } from 'pixi.js';
import { GameUI } from './GameUI';
import { BombSpawner } from './BombSpawner';
import gsap from 'gsap';

export class GameManager {
    static instance: GameManager;
    app: Application
    gameUI: GameUI | null;
    bombSpawner: BombSpawner | null;
    elapsedTime: number = 0;
    score: number = 0;
    highScore: number = 0;
    lives: number = 9;
    tl: gsap.core.Timeline;
    paused: boolean;

    constructor(app: Application, ui?: GameUI, bombSpawner?: BombSpawner) {
        this.app = app;
        this.gameUI = ui ?? null;
        this.bombSpawner = bombSpawner ?? null;
        this.paused = false;
        Ticker.shared.add((time) => {
            if (!this.paused) this.elapsedTime += time.deltaTime / 60;
        });
        this.tl = gsap.timeline({autoRemoveChildren: true})
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

    updateScore(score: number) : void {
        this.score = score;
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

    updateLives(lives: number) : void {
        this.lives = lives
        if (this.gameUI) this.gameUI.updateLives(this.lives);
    }

    addAnim(anim: gsap.core.Tween): void {
        this.tl.add(anim, this.tl.time())
    }

    togglePause() {
        this.paused = !this.paused
        if (this.paused) {
            this.tl.pause()
        } else {
            this.tl.play()
        }
    }

    restartGame() {
        
        // Optionally clear tweens if using GSAP
        gsap.globalTimeline.clear();
        this.tl.clear();

        // Remove old game objects
        this.bombSpawner?.bombContainer.removeChildren();

        // Reset game
        this.updateScore(0);
        this.elapsedTime = 0;
        this.updateLives(9);
    }
}