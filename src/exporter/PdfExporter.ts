import {loadCanvasKit} from "../config/CanvasKitLoader.ts";
import type {CanvasKit} from "canvaskit-wasm";
import {pixiToSkia} from "../renderer/SkiaRenderer.ts";
import type {Container} from "pixi.js-legacy";
import {getBackGroundColor} from "../utils/ColorHelpers.ts";
import {app} from "../config/PixiApp.ts";

export async function exportToPdf (container: Container){
    const CK: CanvasKit = await loadCanvasKit()


    //Выделяем буфер в WASM-памяти под бинарный поток PDF
    const stream = new CK.DynamicMemoryWStream()
    const pdfDocument = CK.MakePDFDocument(stream)


    if (!pdfDocument) {
        console.error("Не удалось создать PDF документ.");
        stream.delete();
        return;
    }


    const pdfWidth = 600;
    const pdfHeight = 600;


    //Открываем векторную страницу
    const pdfCanvas = CK.PDFDocumentBeginPage(pdfDocument, pdfWidth, pdfHeight);


    //Вместо WebGL контекста рендерим ту же самую сцену на векторный холст skia pdf
    getBackGroundColor(pdfCanvas, CK, app.renderer.background.color, app.renderer.background.alpha);
    pixiToSkia(container, pdfCanvas, CK)


    //Закрываем страницу
    CK.PDFDocumentEndPage(pdfDocument);
    CK.PDFDocumentCloseAndRelease(pdfDocument);


    //Вытаскиваем готовый массив байт из памяти  wasm
    const pdfData: Uint8Array = stream.detachAsData();
    downloadPdf(pdfData, "pixi-scene-export.pdf");


    //Чистим память
    stream.delete();
}

function downloadPdf(data: Uint8Array, fileName: string): void {
    //Копируем данные из WASM-памяти в обычный безопасный ArrayBuffer
    const safeData = data.slice();

    const blob = new Blob([safeData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const rootApp: HTMLElement | null = document.getElementById("app");
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    if (!rootApp) {
        return;
    }

    link.click();
    URL.revokeObjectURL(url);
}