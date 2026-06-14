import {Sprite, Texture} from "pixi.js-legacy";

const SPRITE_URLS: string[] = [
    'https://pixijs.com/assets/bunny.png',
    'https://pixijs.com/assets/eggHead.png',
    'https://pixijs.com/assets/flowerTop.png',

];


export const generateSprite = async () => {
    const randomIndex = Math.floor(Math.random() * SPRITE_URLS.length);
    const texture = Texture.from(SPRITE_URLS[randomIndex]);


    if (!texture.baseTexture.valid) {
        await new Promise<void>((resolve) => {
            texture.baseTexture.once('loaded', () => resolve());
        });
    }


    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);

    return sprite;
}