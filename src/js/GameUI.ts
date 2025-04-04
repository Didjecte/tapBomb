import { Application, Text, TextStyle, FillGradient, Sprite, Texture, Container } from 'pixi.js';
import { DropShadowFilter } from 'pixi-filters';

export class GameUI {
    app: Application;
    currentScore: number;
    scoreText: Text;
    lives: number;
    livesSprite: Sprite;
    uiContainer: Container;

    constructor(app: Application) {
        this.app = app;

        this.currentScore = 0;
        this.lives = 9;

        //dropshadow for UI
        const dropShadowFilter = new DropShadowFilter({
            blur: 4,
            alpha: 0.6,
            offset: {x:0, y:0},
            color: 0x000000
        });

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
        this.scoreText.filters = [dropShadowFilter]
        this.scoreText.x = 50; // Right side of the screen
        this.scoreText.y = 20; // Slightly below the top


        //add HP
        this.livesSprite = Sprite.from('heart' + this.lives)
        this.livesSprite.anchor.set(0.5)
        this.livesSprite.x = app.screen.width - 90
        this.livesSprite.y = 65
        this.livesSprite.scale.set(0.2)
        this.livesSprite.filters = [dropShadowFilter]


        //ui container
        this.uiContainer = new Container();
        this.uiContainer.addChild(this.scoreText);
        this.uiContainer.addChild(this.livesSprite);
        this.app.stage.addChild(this.uiContainer);
    }

    updateScore(score: number) {
        this.scoreText.text = score;
    }

    updateLives(lives: number) {
        this.lives = lives;
        this.livesSprite.texture = Texture.from('heart' + lives);
    }
}