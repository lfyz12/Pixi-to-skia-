//Расширяем глобальный интерфейс CanvasKit из библиотеки
declare module "canvaskit-wasm" {
    export interface CanvasKit {
        DynamicMemoryWStream: new () => SkWStream;
        MakePDFDocument: (stream: SkWStream) => SkPDFDocument | null;
    }

    export interface SkWStream {
        detachAsData: () => Uint8Array;
        delete: () => void;
    }

    export interface SkPDFDocument {
        beginPage: (width: number, height: number) => Canvas;
        endPage: () => void;
        close: () => void;
        delete: () => void;
    }
}