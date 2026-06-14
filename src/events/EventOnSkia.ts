import { type Application, type Container, type DisplayObject, Point } from "pixi.js-legacy";
import { convertPixiToSkia } from "../renderer/SkiaRenderer.ts";

//Синхронизиуем события на PIXI канвасе с событиями на skia канвасе
export const eventOnSkia = (app: Application, mainContainer: Container) => {
    const skiaCanvas = document.getElementById('foo') as HTMLCanvasElement | null;

    if (!skiaCanvas) return;

    //Сохраняем объект, на который нажали, чтобы корректно отпустить его даже за пределами канваса
    let currentDisplayObject: DisplayObject | null = null;

    //Получеаем координать клика на skia канвасе
    const getLocalCoords = (e: MouseEvent) => {
        const rect = skiaCanvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };


    skiaCanvas.addEventListener('mousedown', async (event) => {
        const { x, y } = getLocalCoords(event);
        const pixiPoint = new Point(x, y);

        //По координатам получаем объект на PIXI канвасе
        const hitObject = app.renderer.events.rootBoundary.hitTest(x, y)

        if (hitObject) {
            currentDisplayObject = hitObject;

            //Инициируем событие нажатия в Pixi
            hitObject.emit('pointerdown', {
                global: pixiPoint,
                target: hitObject,
                type: 'pointerdown'
            } as any);

            //Принудительно обновляем skia канвас, чтобы отобразить alpha = 0.5
            await convertPixiToSkia(mainContainer);
        }
    });


    //Вешаем на window, чтобы если пользователь увёл мышку с фигуры и отпустил, альфа всё равно сбросилась
    window.addEventListener('mouseup', async (event) => {
        if (currentDisplayObject) {
            const { x, y } = getLocalCoords(event);
            const pixiPoint = new Point(x, y);

            //Инициируем событие отпускания в Pixi
            currentDisplayObject.emit('pointerup', {
                global: pixiPoint,
                target: currentDisplayObject,
                type: 'pointerup'
            } as any);

            currentDisplayObject = null;

            //Принудительно обновляем Skia-холст, чтобы вернуть alpha = 1.0
            await convertPixiToSkia(mainContainer);
        }
    });
};