import { Sprite, Rectangle } from 'pixi.js';
import gsap from 'gsap';

export function setupCustomCursor(app) {

    // Load the cursor image as a sprite
    const cursorSprite = Sprite.from('cursor');
    cursorSprite.x = -100
    cursorSprite.y = -100
    cursorSprite.anchor.set(0.5);  // Center the cursor on the mouse position
    cursorSprite.scale.set(0.1);
    cursorSprite.interactiveChildren = false;
    
    app.stage.addChild(cursorSprite);
    
    // Follow the pointer
    app.stage.addEventListener('pointermove', (e) =>
    {
        cursorSprite.position.copyFrom(e.global);
        // gsap.to(cursorSprite, {
        //     duration: 0.1, // Adjust for smoother or snappier feel
        //     x: e.global.x,
        //     y: e.global.y,
        //     ease: 'power2.out' 
        // });
    });
}