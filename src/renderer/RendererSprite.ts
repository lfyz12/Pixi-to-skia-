import type {BaseTexture, Container, Texture} from "pixi.js-legacy";
import type {Canvas, CanvasKit, Image} from "canvaskit-wasm";


export const rendererSprite = (element: Container, CK: CanvasKit, canvas: Canvas): void => {
    const texture: Texture = element.texture

    if (texture && texture.valid) {
        const baseTexture: BaseTexture = element.texture.baseTexture

        const imageSource = baseTexture.resource.source

        if (imageSource) {
            //Конвертируем изображение из html источника в нужный формат для skia
            const ckImage: Image = CK.MakeImageFromCanvasImageSource(imageSource)

            if (ckImage) {
                const frame = element.texture.frame
                //Вырезаем нужный кадр по известным данным
                const srcRect = [frame.x, frame.y, frame.x + frame.width, frame.y + frame.height]


                const anchorX = element.anchor ? element.anchor.x : 0
                const anchorY = element.anchor ? element.anchor.y : 0

                const w = frame.width
                const h = frame.height

                //Считаем прямоугольник с изображением, чтобы правильно работали rotate scale и тд
                const destRect = [-anchorX * w, -anchorY * h, (1 - anchorX) * w, (1 - anchorY) * h]

                const paint = new CK.Paint()
                paint.setAntiAlias(true)
                paint.setAlphaf(element.worldAlpha)


                canvas.drawImageRect(ckImage, srcRect, destRect, paint)

                //Чистим память
                paint.delete();
                ckImage.delete();

            }
        }
    }
}
