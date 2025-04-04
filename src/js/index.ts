import { Application, Assets, Sprite, Graphics, Polygon } from 'pixi.js';
import { BombSpawner } from './BombSpawner';
import { GameUI } from './GameUI';
import { setupCustomCursor } from './cursor';
import { startBGM } from './MusicManager';
import { GameManager } from './GameManager';

// Create a PixiJS application.
const app = new Application();

// Asynchronous IIFE
(async () =>
{
    await setup();
    await preload();

    startBGM();

    const gameManager = new GameManager()
    const bombSpawner = new BombSpawner(app, gameManager);
    const gameUI = new GameUI(app);
    gameManager.setBombSpawner(bombSpawner)
    gameManager.setGameUI(gameUI)
    bombSpawner.startSpawning();

    const spriteTest = Sprite.from('explosionCross')
    spriteTest.anchor.set(0.5)
    spriteTest.scale.set(0.4)
    spriteTest.x = app.screen.width/2
    spriteTest.y = app.screen.height/2
    spriteTest.interactive = true

    const graphics = new Graphics()
    graphics.star(app.screen.width/2, app.screen.height/2, 4, 200, 10, 2*Math.PI*1/4).fill({ color: 0xffdf00});
    graphics.interactive = true;

    // Add the hit area graphics to the stage
    app.stage.addChild(graphics);

    // spriteTest.hitArea = hitArea;
    graphics.on("pointerdown", () => {
        console.log('yup')
    });
    // app.stage.addChild(spriteTest)


    setupCustomCursor(app);
})();

async function setup()
{
    // Intialize the application.
    await app.init({ 
        background: '#0a2b75', 
        resizeTo: window,
        antialias: true // Enable anti-aliasing
    });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    //replace curssor
    app.renderer.events.cursorStyles.default = 'none';
    app.stage.eventMode = 'static';
    // Make sure the whole canvas area is interactive, not just the circle.
    app.stage.hitArea = app.screen;
}

async function preload()
{
    // Create an array of asset data to load.
    const assets = [
        // { alias: 'background', src: 'https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg' },
        { alias: 'bomb1', src: import.meta.env.BASE_URL + '/assets/bomb1.png' },
        { alias: 'bomb2', src: import.meta.env.BASE_URL + '/assets/bomb2.png' },
        { alias: 'bomb3', src: import.meta.env.BASE_URL + '/assets/bomb3.png' },
        { alias: 'bomb4', src: import.meta.env.BASE_URL + '/assets/bomb4.png' },
        { alias: 'heart0', src: import.meta.env.BASE_URL + '/assets/heart0.png' },
        { alias: 'heart1', src: import.meta.env.BASE_URL + '/assets/heart1.png' },
        { alias: 'heart2', src: import.meta.env.BASE_URL + '/assets/heart2.png' },
        { alias: 'heart3', src: import.meta.env.BASE_URL + '/assets/heart3.png' },
        { alias: 'heart4', src: import.meta.env.BASE_URL + '/assets/heart4.png' },
        { alias: 'heart5', src: import.meta.env.BASE_URL + '/assets/heart5.png' },
        { alias: 'heart6', src: import.meta.env.BASE_URL + '/assets/heart6.png' },
        { alias: 'heart7', src: import.meta.env.BASE_URL + '/assets/heart7.png' },
        { alias: 'heart8', src: import.meta.env.BASE_URL + '/assets/heart8.png' },
        { alias: 'heart9', src: import.meta.env.BASE_URL + '/assets/heart9.png' },
        { alias: 'cursor', src: import.meta.env.BASE_URL + '/assets/crosshair1.png' },
    ];

    // Load the assets defined above.
    await Assets.load(assets);

    Assets.addBundle('fonts', [
        { alias: 'DirtyWar', src: import.meta.env.BASE_URL + '/assets/DirtyWar.otf' },
        { alias: 'FastHand', src: import.meta.env.BASE_URL + '/assets/FastHand.otf' }
    ]);

    // Load the font bundle
    await Assets.loadBundle('fonts');
}
