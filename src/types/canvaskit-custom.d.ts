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

import type { CanvasKit, SkCanvas } from "canvaskit-wasm";

//Обучаем TS работе с window.CanvasKitInit
declare global {
    interface Window {
        CanvasKitInit?: (options: { locateFile: (file: string) => string }) => Promise<CanvasKit>;
    }
}

//Расширяем интерфейс CanvasKit кастомными C++ методами из WASM
declare module "canvaskit-wasm" {
    interface CanvasKit {
        // any используется для кастомного указателя на документ, так как в стандартных типах его нет
        PDFDocumentBeginPage(document: any, width: number, height: number): SkCanvas;
        PDFDocumentEndPage(document: any): void;
        PDFDocumentCloseAndRelease(document: any): void;
    }
}

// Экспортируем пустой объект, чтобы файл считался внешним модулем
export {};