import { Application, Assets, Sprite, Graphics, Polygon } from 'pixi.js';
import { BombSpawner } from './BombSpawner';
import { GameUI } from './GameUI';
import { setupCustomCursor } from './cursor';
import { startBGM } from './MusicManager';
import { GameManager } from './GameManager';
import { addBackground } from './addBackground';
import { Stats } from 'pixi-stats';
import { PauseScreen } from './pause';

// Create a PixiJS application.
const app = new Application();
const width = 1280;
const height = 720;

// Asynchronous IIFE
(async () =>
{
    await setup();
    await preload();

    startBGM();
    addBackground(app);

    const gameManager = new GameManager(app)
    const bombSpawner = new BombSpawner(app, gameManager);
    const gameUI = new GameUI(app);
    gameManager.setBombSpawner(bombSpawner)
    gameManager.setGameUI(gameUI)
    bombSpawner.startSpawning();

    const pauseScreen = new PauseScreen(app, gameManager);
    
    const stats = new Stats(app);

    setupCustomCursor(app);
})();

async function setup()
{
    // Intialize the application.
    await app.init({ 
        background: '#000000', 
        // width: window.innerWidth,
        // height: window.innerWidth*9/16,
        width: width,
        height: height,
        // resizeTo: window,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        antialias: true // Enable anti-aliasing
    });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    app.renderer.resize

    // const scaleX = app.screen.width / width;
    // app.stage.scale.set(scaleX, scaleX)
        
    // // Override when the window resizes
    // function enforceMinimumSize() {
    //     const width = Math.max(window.innerWidth, 1280);
    //     const height = Math.max(window.innerHeight, 720);
    
    //     app.renderer.resize(width, height)
    // }
    
    // window.addEventListener('resize', enforceMinimumSize);
    // enforceMinimumSize(); // Initial check
    window.addEventListener("resize", resize);

    //replace cursor
    app.renderer.events.cursorStyles.default = 'none';
    app.stage.eventMode = 'static';
    // Make sure the whole canvas area is interactive, not just the circle.
    app.stage.hitArea = app.screen;
}

function resize(): void {
    // Calculate the scaling factor based on the window size
    // let scaleX = window.innerWidth / width;
    // let scaleY = window.innerHeight / height;
    // let scale = Math.min(scaleX, scaleY);  // Maintain aspect ratio
    
    // // Resize the renderer canvas (view)
    // app.renderer.resize(window.innerWidth, window.innerHeight, window.devicePixelRatio || 1);

    // // Scale the stage content to fit the screen
    // app.stage.scale.set(scale);

    // Optional: Center the canvas if needed
    // app.canvas.style.position = 'absolute';
    // app.canvas.style.left = `${(window.innerWidth - app.renderer.width) / 2}px`;
    // app.canvas.style.top = `${(window.innerHeight - app.renderer.height) / 2}px`;
}

async function preload()
{
    // Create an array of asset data to load.
    const assets = [
        { alias: 'background', src: import.meta.env.BASE_URL + '/assets/bg.png' },
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
        { alias: 'play', src: import.meta.env.BASE_URL + '/assets/play.png' },
        { alias: 'restart', src: import.meta.env.BASE_URL + '/assets/restart.png' },
    ];

    // Load the assets defined above.
    await Assets.load(assets);

    Assets.addBundle('fonts', [
        { alias: 'FastHand', src: import.meta.env.BASE_URL + '/assets/FastHand.otf' }
    ]);

    // Load the font bundle
    await Assets.loadBundle('fonts');
}
