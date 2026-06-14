import {Graphics, Polygon, SHAPES} from "pixi.js-legacy";
import {getRandomCoords} from "./ObjectGenerator.ts";

interface IShapeParam {
    size: {width: number; height: number};
    radius: number;
}

//Генерирует случайные размеры объекта от 50 до 250px
const getRandomSize = () => {
    const width: number = 50 + Math.floor(Math.random() * 200);
    const height: number = 50 + Math.floor(Math.random() * 200);

    return{width:width, height: height}
}

//Генерация объектов Graphics рандомной формы, цвета и размера
export const generateGraphics = (): Graphics => {
    const randomColor: number = Math.floor(Math.random() * 0xFFFFFF);


    let graphics = new Graphics();
    graphics.beginFill(randomColor)


    let shape: number = Math.floor(Math.random() * 5)

    switch (shape) {
        case SHAPES.RECT:
            const rect: Omit<IShapeParam, 'radius'> = {
                size: getRandomSize()
            }

            graphics.drawRect(0, 0, rect.size.width, rect.size.height)
            break;

        case SHAPES.RREC:
            const rrect: IShapeParam = {
                size: getRandomSize(),
                radius: 5 + Math.floor(Math.random() * 20),
            }

            graphics.drawRoundedRect(0, 0, rrect.size.width, rrect.size.height, rrect.radius)
            break;


        case SHAPES.CIRC:
            const circ: Omit<IShapeParam, 'size'> = {
                radius: 25 + Math.floor(Math.random() * 50),
            }

            graphics.drawCircle(0, 0, circ.radius)
            break;


        case SHAPES.ELIP:
            const elip: Omit<IShapeParam, 'radius'> = {
                size: getRandomSize()
            }

            graphics.drawEllipse(0, 0, elip.size.width, elip.size.height)
            break;


        case SHAPES.POLY:
            const isShape = Math.random() > 0.5;
            //Генерирует количество вершин сложной фигуры, либо же количсетво точек для линии
            const pointsCount: number = 3 + Math.floor(Math.random() * 5);

            if (isShape) {
                const polyPoints: number[] = [];
                //Получаем точку вокруг которой будет строиться фигура
                const center = getRandomCoords();

                for (let i = 0; i < pointsCount; i++) {
                    //Для каждой точки определяем сектор в окружности
                    const angle = (i / pointsCount) * Math.PI * 2;

                    //Плавающий радиус для каждой вершины, чтобы форма получилась уникальной
                    const radius = 30 + Math.random() * 70;


                    const x = center.x + Math.cos(angle) * radius;
                    const y = center.y + Math.sin(angle) * radius;

                    polyPoints.push(x, y);
                }

                graphics.drawShape(new Polygon(polyPoints));
            } else {
                graphics.endFill();
                graphics.lineStyle(Math.floor(Math.random() * 4), randomColor);

                for (let i = 0; i < pointsCount; i++) {
                    const point = getRandomCoords()

                    if (i === 0) {
                        graphics.moveTo(point.x, point.y);
                    } else {
                        graphics.lineTo(point.x, point.y);
                    }
                }
            }
            break;
    }

    graphics.endFill()

    return graphics;
}