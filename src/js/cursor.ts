import { Sprite, Rectangle, Application } from 'pixi.js';
import gsap from 'gsap';

export function setupCustomCursor(app: Application) {

    // Load the cursor image as a sprite
    const cursorSprite = Sprite.from('cursor');
    cursorSprite.x = -100
    cursorSprite.y = -100
    cursorSprite.anchor.set(0.5);
    cursorSprite.scale.set(0.1);
    cursorSprite.interactiveChildren = false;
    
    app.stage.addChild(cursorSprite);
    
    // Follow the pointer
    app.stage.addEventListener('pointermove', (e) =>
    {
        cursorSprite.position.copyFrom(e.global);
    });
}