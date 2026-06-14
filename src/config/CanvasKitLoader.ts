import type {CanvasKit} from "canvaskit-wasm";

let CK: CanvasKit | null = null;

//Загружает и кэширует CanvasKit

export const loadCanvasKit = async (): Promise<CanvasKit> => {
    if (CK !== null) return CK;


    const CanvasKitInit = window.CanvasKitInit ;
    if (!CanvasKitInit) {
        throw new Error("CanvasKit не загрузился");
    }

    CK = await CanvasKitInit({
       locateFile: (file: string) => `/${file}`
    });

    if (!CK) {
        throw new Error("CanvasKit не инициализировался")
    }
    return CK;
};