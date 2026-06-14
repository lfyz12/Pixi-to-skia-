import {Application} from "pixi.js-legacy";
import {PIXI_CONFIG} from "./Consts.ts";


export const app: Application = new Application(PIXI_CONFIG);

app.view.id = "pixi-canvas";