import type { Canvas, CanvasKit } from "canvaskit-wasm";
import {Color} from "pixi.js-legacy";

// Конвертирует шестнадцатеричное число цвета pixi в объект rgba для CanvasKit
export function convertToRgba(colorNumber: number, alpha: number) {
    return {
        r: (colorNumber >> 16) & 0xff,
        g: (colorNumber >> 8) & 0xff,
        b: colorNumber & 0xff,
        a: alpha
    };
}

// Синхронизирует цвет фона skia канваса с настройками Pixi
export const getBackGroundColor = (canvas: Canvas, CK: CanvasKit, color: number | string, alpha: number): void => {
    const colorInstance = new Color(color);
    const backgroundColorNumber = colorInstance.toNumber();
    const backgroundAlpha = alpha;

    const bgRgba = convertToRgba(backgroundColorNumber, backgroundAlpha);
    canvas.clear(CK.Color(bgRgba.r, bgRgba.g, bgRgba.b, bgRgba.a));
};