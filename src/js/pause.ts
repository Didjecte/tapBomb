import { Application, Container, Graphics, Text, Sprite } from "pixi.js";
import gsap from "gsap";
import { GameManager } from "./GameManager";


export class PauseScreen {
    app: Application
    isPaused: Boolean
    pauseOverlay: Container
    resumeButton: Sprite
    restartButton: Sprite
    gameManager: GameManager
    scale: number

    constructor(app: Application, gameManager: GameManager) {
        this.scale = 1
        this.app = app; // The PixiJS Application instance
        this.isPaused = false; // Track the pause state
        this.gameManager = gameManager

        this.pauseOverlay = new Container();

        this.createPauseBackground();

        this.resumeButton = Sprite.from('play');
        this.resumeButton.anchor.set(0.5);
        this.resumeButton.scale.set(0.3);
        this.resumeButton.alpha = 0.9
        this.resumeButton.x = this.app.screen.width/2 - this.resumeButton.width * 0.7
        this.resumeButton.y = this.app.screen.height/2
        this.resumeButton.interactive = true

        this.resumeButton.on('pointerover', () => {
            gsap.to(this.resumeButton, {
                duration: 0.4,
                alpha: 1
            })
            gsap.to(this.resumeButton.scale, {
                duration: 0.4,
                x: 0.32,
                y: 0.32
            })
        });
        this.resumeButton.on('pointerout', () => {
            gsap.to(this.resumeButton, {
                duration: 0.2,
                alpha: 0.9,
                overwrite: 'auto'
            })
            gsap.to(this.resumeButton.scale, {
                duration: 0.2,
                x: 0.3,
                y: 0.3,
                overwrite: 'auto'
            })
        });
        
        this.resumeButton.on('pointerdown', () => {
            this.togglePause()
        })
        
        this.restartButton = Sprite.from('restart');
        this.restartButton.anchor.set(0.5)
        this.restartButton.scale.set(0.3);
        this.restartButton.alpha = 0.9
        this.restartButton.x = this.app.screen.width/2 + this.restartButton.width * 0.7
        this.restartButton.y = this.app.screen.height/2
        this.restartButton.interactive = true

        this.restartButton.on('pointerover', () => {
            gsap.to(this.restartButton, {
                duration: 0.4,
                alpha: 1
            })
            gsap.to(this.restartButton.scale, {
                duration: 0.4,
                x: 0.32,
                y: 0.32
            })
        });
        this.restartButton.on('pointerout', () => {
            gsap.to(this.restartButton, {
                duration: 0.2,
                alpha: 0.9,
                overwrite: 'auto'
            })
            gsap.to(this.restartButton.scale, {
                duration: 0.2,
                x: 0.3,
                y: 0.3,
                overwrite: 'auto'
            })
        });

        this.restartButton.on('pointerdown', () => {
            this.togglePause();
            this.gameManager.restartGame();
        });

        this.pauseOverlay.addChild(this.resumeButton);
        this.pauseOverlay.addChild(this.restartButton);

        // Initially hide the pause screen
        this.pauseOverlay.visible = false;

        // Add the pause overlay to the stage
        this.app.stage.addChild(this.pauseOverlay);

        window.addEventListener("keydown", (event) => this.handlePauseToggle(event));
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !this.isPaused && !this.gameManager.gameOver) {
                this.togglePause();
            }
        });
    }

    createPauseBackground() {
        const pauseBackground = new Graphics()
            .rect(0, 0, this.app.screen.width, this.app.screen.height)
            .fill({color: '0x000000', alpha: 0.6})
        this.pauseOverlay.addChild(pauseBackground);
    }


    // Handle the toggle of the pause state with key press
    handlePauseToggle(event: KeyboardEvent) {
        if (event.key === "p" || event.key === "P" || event.key === 'Escape') {
            if (!this.gameManager.gameOver) {
                this.togglePause();
            }
        }
    }

    // Toggle between pause and resume
    togglePause() {
        this.isPaused = !this.isPaused;
        this.gameManager.togglePause();

        if (this.isPaused) {
            this.pauseOverlay.visible = true; // Show the pause screen
            gsap.fromTo(this.pauseOverlay, {
                    alpha: 0,
                }, {
                    duration: 0.3,
                    alpha: 0.9,
                    overwrite: 'auto',
                }
            )
        } else {
            gsap.fromTo(this.pauseOverlay, {
                    duration: 0.3,
                    alpha: 0.9,
                }, {
                    alpha: 0,
                    overwrite: 'auto',
                    onComplete: () => {
                        this.pauseOverlay.visible = false; // Hide the pause screen
                    }
                }
            )
        }
    }
}