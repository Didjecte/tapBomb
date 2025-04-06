import { Application, Text, TextStyle, FillGradient, Sprite, Texture, Container, Graphics, Rectangle } from 'pixi.js';
import { DropShadowFilter } from 'pixi-filters';
import { GameManager } from './GameManager';
import gsap from 'gsap';

export class GameUI {
    app: Application;
    gameManager: GameManager;
    currentScore: number;
    scoreText: Text;
    lives: number;
    livesSprite: Sprite;
    uiContainer: Container;
    gameOverContainer: Container;
    startContainer: Container;
    gameOverText: Text;
    newText: Text;
    finalScoreText: Text;
    highScoreText: Text;
    titleText: Text;
    startText: Text;
    hintText: Text;

    constructor(app: Application, gameManager: GameManager) {
        this.app = app;
        this.gameManager = gameManager;
        this.currentScore = 0;
        this.lives = 9;

        //start container
        this.startContainer = new Container();
        this.app.stage.addChild(this.startContainer);
        this.startContainer.scale.set(1);

        //dropshadow for UI
        const dropShadowFilter = new DropShadowFilter({
            blur: 4,
            alpha: 0.6,
            offset: {x:0, y:0},
            color: 0x000000
        });

        //start Text
        const startFill = new FillGradient({
            type: 'linear',
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 },
            colorStops: [
                { offset: 0, color: '#194d19' },
                { offset: 0.5, color: '#2d862d' },
                { offset: 1, color: '#91FF00' }
            ],
        });

        this.titleText = new Text({text: 'Tap Bomb', style: {
            fontFamily: 'FastHand',
            fontSize: 140,
            fill: startFill,
            stroke: { color: '#753b00', width: 3, join: 'round' },
            letterSpacing: 6,
            align: 'left',
        }})
        this.titleText.filters = [dropShadowFilter];
        this.titleText.anchor.set(0.5)
        this.titleText.x = this.app.screen.width/2;
        this.titleText.y = this.app.screen.height/3;
        this.app.stage.addChild(this.titleText);
        gsap.to(this.titleText, {
            duration: 1.5,
            alpha: 0.7,
            repeat: -1,
            yoyo: true,
            ease: 'power1.in'
        })
        
        this.startText = new Text({text: 'click anywhere to start', style: {
            fontFamily: 'FastHand',
            fontSize: 25,
            fill: startFill,
            stroke: { color: '#753b00', width: 3, join: 'round' },
            letterSpacing: 6,
            align: 'left',
        }})
        this.startText.filters = [dropShadowFilter];
        this.startText.anchor.set(0.5)
        this.startText.x = this.app.screen.width/2;
        this.startText.y = this.app.screen.height/2;
        this.app.stage.addChild(this.startText);
        gsap.to(this.startText, {
            duration: 1.5,
            alpha: 0.7,
            repeat: -1,
            yoyo: true,
            ease: 'power1.in'
        })
        
        //ui container
        this.uiContainer = new Container();
        this.app.stage.addChild(this.uiContainer);
        this.uiContainer.scale.set(1);
        this.uiContainer.visible = false;
        this.uiContainer.hitArea = new Rectangle(0,0,0,0)

        // Create the high score text
        const fill = new FillGradient({
            type: 'linear',
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 },
            colorStops: [
                { offset: 0, color: '#ffee00' },
                { offset: 1, color: '#de7e00' }
            ],
        });
        const style = new TextStyle({
            fontFamily: 'FastHand',
            fontSize: 80,
            fill: { fill },
            stroke: { color: '#753b00', width: 3, join: 'round' },
            letterSpacing: 6,
            align: 'left',
        });

        this.scoreText = new Text({text : '0', style});
        this.scoreText.filters = [dropShadowFilter];
        this.scoreText.x = 50; // Right side of the screen
        this.scoreText.y = 20; // Slightly below the top

        this.uiContainer.addChild(this.scoreText);

        //add HP
        this.livesSprite = Sprite.from('heart' + this.lives);
        this.livesSprite.anchor.set(0.5);
        this.livesSprite.x = app.screen.width - 90;
        this.livesSprite.y = 65;
        this.livesSprite.scale.set(0.18);
        this.livesSprite.filters = [dropShadowFilter];

        this.uiContainer.addChild(this.livesSprite);

        //'Esc to Pause'
        this.hintText = new Text({text: 'ESC to Pause', style: {
            fontFamily: 'FastHand',
            fontSize: 20,
            fill: fill,
            stroke: { color: '#753b00', width: 3, join: 'round' },
            letterSpacing: 6,
            align: 'left',
        }})
        this.hintText.filters = [dropShadowFilter];
        this.hintText.anchor.set(0.5)
        this.hintText.x = this.app.screen.width - 150;
        this.hintText.y = this.app.screen.height - 40;
        this.uiContainer.addChild(this.hintText);

        const goFill = new FillGradient({
            type: 'linear',
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 },
            colorStops: [
                { offset: 0, color: '#960000' },
                { offset: 1, color: '#ff2424' }
            ],
        });

        //game over text
        this.gameOverText = new Text({text: 'Game over', style: {
            fontFamily: 'FastHand',
            fontSize: 120,
            fill: goFill,
            stroke: { color: '#753b00', width: 3, join: 'round' },
            letterSpacing: 6,
            align: 'left',
        }})
        this.gameOverText.filters = [dropShadowFilter];
        this.gameOverText.anchor.set(0.5)
        this.gameOverText.x = this.app.screen.width/2;
        this.gameOverText.y = this.app.screen.height/2 - 80;
        this.app.stage.addChild(this.gameOverText);
        this.gameOverText.visible = false;

        //game over container
        this.gameOverContainer = new Container();
        this.app.stage.addChild(this.gameOverContainer);
        this.gameOverContainer.scale.set(1);
        this.gameOverContainer.visible = false;
        this.createGameOverTexts();
        
        this.finalScoreText = new Text({text: this.currentScore, style: {
            fontFamily: 'FastHand',
            fontSize: 100,
            fill: { fill },
            stroke: { color: '#753b00', width: 3, join: 'round' },
            letterSpacing: 6,
            align: 'left',
        }})
        this.finalScoreText.anchor.set(0.5);
        this.finalScoreText.filters = [dropShadowFilter];
        this.finalScoreText.x = this.app.screen.width/2;
        this.finalScoreText.y = this.app.screen.height/5 + 70;
        this.gameOverContainer.addChild(this.finalScoreText);

        this.highScoreText = new Text({text: 'Best: ' + this.currentScore, style: {
            fontFamily: 'FastHand',
            fontSize: 30,
            fill: { fill },
            stroke: { color: '#753b00', width: 3, join: 'round' },
            letterSpacing: 6,
            align: 'left',
        }})
        this.highScoreText.anchor.set(0.5);
        this.highScoreText.filters = [dropShadowFilter];
        this.highScoreText.x = this.app.screen.width/2;
        this.highScoreText.y = this.app.screen.height/2 - 40;
        this.gameOverContainer.addChild(this.highScoreText);
        
        const newFill = new FillGradient({
            type: 'linear',
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 },
            colorStops: [
                { offset: 0, color: '#ffee00' },
                { offset: 1, color: '#ff0000' }
            ],
        });
        this.newText = new Text({text: 'New', style: {
            fontFamily: 'FastHand',
            fontSize: 20,
            fill: newFill,
            stroke: { color: '#753b00', width: 3, join: 'round' },
            letterSpacing: 6,
            align: 'left',
        }})
        this.newText.anchor.set(0.5)
        this.newText.filters = [dropShadowFilter]
        this.newText.x = this.app.screen.width/2 - this.highScoreText.width/2 - 10;
        this.newText.y = this.app.screen.height/2 - 60;
        this.newText.skew.y = -0.4;
        this.gameOverContainer.addChild(this.newText);
        this.newText.visible = false;
        
    }

    createGameOverTexts() {
        //gradient for UI
        const fill = new FillGradient({
            type: 'linear',
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 },
            colorStops: [
                { offset: 0, color: '#ffee00' },
                { offset: 1, color: '#de7e00' }
            ],
        });
        //dropshadow for UI
        const dropShadowFilter = new DropShadowFilter({
            blur: 4,
            alpha: 0.6,
            offset: {x:0, y:0},
            color: 0x000000
        });
        const style = new TextStyle({
            fontFamily: 'FastHand',
            fontSize: 60,
            fill: { fill },
            stroke: { color: '#753b00', width: 3, join: 'round' },
            letterSpacing: 6,
            align: 'left',
        });
        const scoreText = new Text({text : 'Score', style});
        scoreText.anchor.set(0.5)
        scoreText.filters = [dropShadowFilter];
        scoreText.x = this.app.screen.width/2;
        scoreText.y = this.app.screen.height/5;
        this.gameOverContainer.addChild(scoreText);

        const restartButton = Sprite.from('restart');
        restartButton.anchor.set(0.5)
        restartButton.scale.set(0.2);
        restartButton.alpha = 0.9
        restartButton.x = this.app.screen.width/2
        restartButton.y = this.app.screen.height * 3/5
        restartButton.interactive = true

        restartButton.on('pointerover', () => {
            gsap.to(restartButton.scale, {
                duration: 0.4,
                x: 0.21,
                y: 0.21
            })
        });
        restartButton.on('pointerout', () => {
            gsap.to(restartButton.scale, {
                duration: 0.2,
                x: 0.2,
                y: 0.2,
                overwrite: 'auto'
            })
        });

        restartButton.on('pointerdown', () => {
            this.gameManager.restartGame();
            this.gameOverContainer.visible = false;
            this.newText.visible = false;
            this.showUI();
        });

        this.gameOverContainer.addChild(restartButton);
    }

    updateScore(score: number): void {
        this.scoreText.text = score;
        this.currentScore = score;
    }

    updateLives(lives: number): void {
        this.lives = lives;
        this.livesSprite.texture = Texture.from('heart' + lives);
        if (this.lives !== 9) {
            this.shakeHeart();
        }
    }
    
    shakeHeart(): void {
        gsap.to(this.livesSprite, {
            x: this.livesSprite.x + 5,
            duration: 0.05,
            repeat: 5,
            yoyo: true,
            ease: 'power1.inOut',
            onComplete: () => {
                this.livesSprite.x = Math.round(this.livesSprite.x); // clean-up float errors
            }
        })
    }

    hideUI(): void {
        this.uiContainer.visible = false;
    }

    showUI(): void {
        this.uiContainer.visible = true;
    }

    start(): void {
        
        setTimeout(() => {
            this.hintText
            gsap.to(this.hintText, {
                duration: 2,
                alpha: 0,
                onComplete: () => {
                    this.hintText.visible = false
                }
            })    
        }, 30000);
        setTimeout(() => {
            gsap.to(this.startText, {
                duration: 1,
                alpha: 0,
                ease: 'power1.out'
            })
            gsap.to(this.titleText, {
                duration: 1,
                alpha: 0,
                ease: 'power1.out',
                onComplete: () => {
                    this.titleText.visible = false
                    this.startText.visible = false
                }
            })
            
            this.showUI()
            gsap.fromTo(this.uiContainer, {
                alpha: 0
            }, {
                duration: 1,
                alpha: 1,
                ease: 'power1.in'
            })
        }, 2000);
    }

    showGameOverScreen(score: number, highscore: number): void {
        const gameOverSound = new Howl({
            src: [import.meta.env.BASE_URL + 'assets/gameOver.mp3'],
            volume: 1.2,
        });

        if (score === highscore) {
            this.newText.visible = true;
        }
        this.highScoreText.text = 'Best: ' + highscore;
        this.finalScoreText.text = score;

        setTimeout(() => {
            gameOverSound.play();
        }, 100);

        this.gameOverText.visible = true;
        gsap.fromTo(this.gameOverText, {
            alpha: 0,
        }, {
            duration: 0.6,
            alpha: 1
        })
        gsap.fromTo(this.gameOverText, {
            y: this.gameOverText.y - 100
        }, {
            duration: 1.4,
            y: this.gameOverText.y,
            ease: 'elastic.out'
        })

        setTimeout(() => {
            this.gameOverText.visible = false
            this.gameOverContainer.visible = true
            this.hideUI()
        }, 4000);
    }
}