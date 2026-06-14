import './style.css';
import { Container } from "pixi.js-legacy";
import { app } from "./config/PixiApp.ts";
import { convertPixiToSkia } from "./renderer/SkiaRenderer.ts";
import { eventOnSkia } from "./events/EventOnSkia.ts";
import {setupUiEvents} from "./events/AppEvents.ts";


const appRoot = document.getElementById('pixi-container');

if (!appRoot) {
    throw new Error("Root element #app not found");
}

export const mainContainer = new Container();
app.stage.addChild(mainContainer);

//Встраиваем Pixi канвас в DOM
appRoot.appendChild(app.view as HTMLCanvasElement);

//Подключаем изолированные модули событий
setupUiEvents(mainContainer);
//Инициализируем синхронизацию pointer событий
eventOnSkia(app, mainContainer);

//Глобальные интерактивные подписки для перерисовки Skia
app.stage.eventMode = 'static';
app.stage.on('pointerdown', () => convertPixiToSkia(mainContainer));
app.stage.on('pointerup', () => convertPixiToSkia(mainContainer));

convertPixiToSkia(mainContainer);