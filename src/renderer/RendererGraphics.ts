import {type Container, type GraphicsData, SHAPES} from "pixi.js-legacy";
import type {Canvas, CanvasKit, Paint, Path} from "canvaskit-wasm";
import {convertToRgba} from "../utils/ColorHelpers.ts";

export const renderGraphics = (data: GraphicsData[], element: Container, CK: CanvasKit, canvas: Canvas) => {
    data.forEach((graphic: GraphicsData) => {
        const {shape, fillStyle, lineStyle} = graphic

        let ckRect: number[] | null = null;
        let ckRRect: {
            rect: number[]
            radius: number
        } | null = null;
        let ckCircle: {x: number; y: number, radius: number} | null = null;
        let ckEllipse: number[] | null = null;
        let ckPath: Path | null = null;

        //Маппим типы геометрии PIXI для skia
        switch (shape.type) {
            case SHAPES.RECT:
                ckRect = [shape.x, shape.y, shape.x + shape.width, shape.y + shape.height]
                break;
            case SHAPES.RREC:
                ckRRect = {
                    rect: [shape.x, shape.y, shape.x + shape.width, shape.y + shape.height],
                    radius: shape.radius
                }
                break;
            case SHAPES.ELIP:
                ckEllipse = [shape.x - shape.width,
                    shape.y - shape.height,
                    shape.x + shape.width,
                    shape.y + shape.height
                ]
                break;
            case SHAPES.CIRC:
                ckCircle = {x: shape.x, y: shape.y, radius: shape.radius}
                break;
            case SHAPES.POLY:
                if (shape.points && shape.points.length >= 2) {
                    const builder = new CK.PathBuilder()

                    builder.moveTo(shape.points[0], shape.points[1]);

                    for (let i = 2; i < shape.points.length; i += 2) {
                        builder.lineTo(shape.points[i], shape.points[i + 1]);
                    }

                    if (shape.closeStroke) {
                        builder.close()
                    }

                    ckPath = builder.detach()
                    builder.delete()

                }
                break;

        }

        //Функция для отрисвоки объектов
        const drawPaint = (paint: Paint): void => {
            if (ckRect) canvas.drawRect(ckRect, paint)
            else if (ckRRect) canvas.drawRRect(CK.RRectXY(ckRRect.rect, ckRRect.radius, ckRRect.radius), paint)
            else if (ckCircle) canvas.drawCircle(ckCircle.x, ckCircle.y, ckCircle.radius, paint)
            else if (ckEllipse) canvas.drawOval(ckEllipse, paint)
            else if (ckPath) canvas.drawPath(ckPath, paint)
        }

        if (fillStyle && fillStyle.visible) {
            const finalAlpha = fillStyle.alpha * element.worldAlpha;
            const rgba = convertToRgba(fillStyle.color, finalAlpha)
            const paint = new CK.Paint()
            paint.setAntiAlias(true)

            paint.setColor(CK.Color(rgba.r, rgba.g, rgba.b, rgba.a));
            paint.setStyle(CK.PaintStyle.Fill)
            drawPaint(paint)

            paint.delete()
        }

        if (lineStyle && lineStyle.visible && lineStyle.width > 0) {
            const finalAlpha = lineStyle.alpha * element.worldAlpha;
            const rgba = convertToRgba(lineStyle.color, finalAlpha)
            const paint = new CK.Paint()
            paint.setAntiAlias(true)

            paint.setColor(CK.Color(rgba.r, rgba.g, rgba.b, rgba.a));
            paint.setStyle(CK.PaintStyle.Stroke)
            paint.setStrokeWidth(lineStyle.width)

            //Скругляем стыки и концы, чтобы обводка выглядела аккуратно при масштабировании
            paint.setStrokeCap(CK.StrokeCap.Round);
            paint.setStrokeJoin(CK.StrokeJoin.Round);

            drawPaint(paint)
            paint.delete()
        }

        //Чистим память
        if (ckPath) {
            ckPath.delete();
        }
    })
}
