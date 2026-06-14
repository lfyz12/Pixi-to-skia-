import {type DisplayObject} from "pixi.js-legacy";
import {generateGraphics} from "./GenerateGraphics.ts";
import {generateSprite} from "./GenerateSprite.ts";

//Генерируем случайные координаты x и y
export const getRandomCoords = () => {
    const x: number = Math.floor(Math.random() * 500)
    const y: number = Math.floor(Math.random() * 500)

    return {x: x, y: y};
}



export const generatePixiObject = async () => {
    const isGraphics = Math.random() > 0.3;

    let displayObject: DisplayObject;

    const globalPosition = getRandomCoords();

    if (isGraphics) {
        displayObject = generateGraphics();
    } else {
        displayObject = await generateSprite();
    }

    //Задаем позицию и повороты объекта
    displayObject.position.set(globalPosition.x, globalPosition.y);
    displayObject.angle = Math.floor(Math.random() * 360);
    displayObject.eventMode = 'static';


    //Добавляем события для каждого элемента PIXI
    displayObject.on('pointerdown', () => {
        displayObject.alpha = 0.5;
    });

    displayObject.on('pointerup', () => {
        displayObject.alpha = 1.0;
    });


    return displayObject;
}