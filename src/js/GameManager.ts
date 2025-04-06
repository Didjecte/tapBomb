import { Ticker, Application } from 'pixi.js';
import { GameUI } from './GameUI';
import { BombSpawner } from './BombSpawner';
import { MusicManager } from './MusicManager';
import gsap from 'gsap';

export class GameManager {
    static instance: GameManager;
    musicManager: MusicManager;
    app: Application
    gameUI: GameUI | null;
    bombSpawner: BombSpawner | null;
    spawnRate: number = 1000;
    spawnRateScaling: number = 15;
    elapsedTime: number = 0;
    score: number = 0;
    highScore: number = 0;
    lives: number = 9;
    tl: gsap.core.Timeline;
    paused = true;
    gameOver = true;
    stage1 = false;
    stage2 = false;
    comboWindow = 0.5; //0.5s
    comboTime = 0; //when is last combo chain
    comboMulti = 1;
    comboTierTable = [1,2,3,4,5] // how much each combo chains gives u


    constructor(app: Application, musicManager: MusicManager, ui?: GameUI, bombSpawner?: BombSpawner) {
        this.app = app;
        this.musicManager = musicManager;
        this.gameUI = ui ?? null;
        this.bombSpawner = bombSpawner ?? null;
        this.tl = gsap.timeline({autoRemoveChildren: true});
        
        window.addEventListener('click', () => {
            this.gameUI?.start()
            const gameOverSound = new Howl({
                src: [import.meta.env.BASE_URL + 'assets/start.mp3'],
                volume: 0.6,
            });
            gameOverSound.play();
            setTimeout(() => {
                this.musicManager.startBGM()
                setTimeout(() => {
                    this.paused = false;
                    this.gameOver = false;
                    // this.bombSpawner?.startSpawning();
                }, 800);
            }, 2200);
        }, { once: true });

        Ticker.shared.add((time) => {
            if (!this.paused) {
                //speed up music
                if (this.elapsedTime > 66 && !this.stage1) {
                    this.musicManager.changePlaybackRate(1.1)
                    this.stage1 = true
                }
                //speed up music
                if (this.elapsedTime > 132 && !this.stage2) {
                    this.musicManager.changePlaybackRate(1.2)
                    this.stage2 = true
                }

                this.elapsedTime += time.deltaTime / 60;
                this.bombSpawner?.updateSpawnRates(this.elapsedTime);
                this.bombSpawner?.spawnBombs();
            }
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
    
    addScore(score: number,x: number, y: number) {
        if (this.elapsedTime - this.comboTime > this.comboWindow) {
            this.comboMulti = 1;
        } else {
            this.comboMulti++;
        }
        this.comboTime = this.elapsedTime;
        
        const comboTier = Math.trunc(this.comboMulti / 5)

        if (comboTier >= this.comboTierTable.length) {
            this.score += score * this.comboTierTable[this.comboTierTable.length - 1]
            console.log(score * this.comboTierTable[this.comboTierTable.length - 1])
        } else {
            this.score += score * this.comboTierTable[comboTier];
        }
        this.gameUI?.updateScore(this.score);
        
        if (this.comboMulti % 5 === 0) {
            this.gameUI?.multiText(this.comboMulti, x, y)
        }
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
            if (this.gameUI) {
                this.gameUI.updateLives(this.lives);
            }
        }
        if (this.lives === 0) {
            if(!this.paused) {
                this.setGameOver();
            }
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
            this.musicManager.pauseBGM()
        } else {
            this.tl.play()
            this.musicManager.resumeBGM()
        }
    }

    setGameOver() {
        this.paused = true;
        this.gameOver = true;
        if (this.score > this.highScore) {
            this.highScore = this.score
        }
        this.gameUI?.showGameOverScreen(this.score, this.highScore);
        this.musicManager.stopBGM();
    }

    restartGame() {
        // gsap.globalTimeline.clear(); //buggy for restart UI
        this.bombSpawner?.bombContainer.removeChildren();
        this.bombSpawner!.bombs = [];
        this.bombSpawner!.idCounter = 1;
        this.updateScore(0);
        this.updateLives(9);
        this.elapsedTime = 0;
        this.comboTime = 0;
        this.musicManager.changePlaybackRate(1);
        this.musicManager.stopBGM();
        this.paused = true;
        this.gameOver = true;
        this.stage1 = false;
        this.stage2 = false;

        this.tl.clear();
        this.tl.pause();
        setTimeout(() => {
            this.musicManager.startBGM();
            this.tl.play();
            this.paused = false;
            this.gameOver = false;
        }, 500)
    }
}