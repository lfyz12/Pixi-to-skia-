import {Container, DisplayObject, Graphics, Sprite} from "pixi.js-legacy";
import type {Canvas, CanvasKit, Surface} from "canvaskit-wasm";
import {loadCanvasKit} from "../config/CanvasKitLoader.ts";
import {getBackGroundColor} from "../utils/ColorHelpers.ts";
import {SKIA_CANVAS_ID} from "../config/Consts.ts";
import {renderGraphics} from "./RendererGraphics.ts";
import {rendererSprite} from "./RendererSprite.ts";
import {app} from "../config/PixiApp.ts";

let cachedSurface: Surface | null = null;


export async function convertPixiToSkia(container: Container): Promise<void> {
    try {
        const CK: CanvasKit = await loadCanvasKit();


        const canvasElement = document.getElementById(SKIA_CANVAS_ID) as HTMLCanvasElement | null


        if (!canvasElement) {
            console.error('Элемент не найден')
            return;
        }


        if (!cachedSurface) {
            cachedSurface = CK.MakeWebGLCanvasSurface(canvasElement)
        }


        if (!cachedSurface) {
            console.error('Skia surface не найден');
            return;
        }


        const canvas: Canvas = cachedSurface.getCanvas()

        // Стираем старый кадр актуальным цветом фона из Pixi
        getBackGroundColor(canvas, CK, app.renderer.background.color, app.renderer.background.alpha);
        // Синхроним все трансформации перед рендером skia
        container.updateTransform()
        pixiToSkia(container, canvas, CK)

        cachedSurface.flush()

    } catch (e) {
        console.error('Init error', e)
    }
}

export const pixiToSkia: (element: Container, canvas: Canvas, CK: CanvasKit) => void = (element: Container, canvas: Canvas, CK: CanvasKit): void => {
    //Изолируем матрицу для текущего элемента и его чилдрен
    canvas.save()

    //Переносим локальную матрицу PIXi в skia
    const {a, b, c, d, tx, ty} = element.transform.localTransform
    canvas.concat([a, c, tx, b, d, ty, 0, 0, 1])


    if (element instanceof Graphics) {
        renderGraphics(element.geometry.graphicsData, element, CK, canvas)
    } else if (element instanceof Sprite) {
        rendererSprite(element, CK, canvas)
    }

    //Рекурсией проходимся по дереву компонентов, чтобы ничего не забыть и перерисовать всё
    if (element.children.length > 0) {
        element.children.forEach((child: DisplayObject) => {
            if (child instanceof Container) pixiToSkia(child, canvas, CK)
        })
    }

    //Возвращаем матрицу в исходное состояние
    canvas.restore();
}
