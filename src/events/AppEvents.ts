import { Container } from "pixi.js-legacy";
import { app } from "../config/PixiApp.ts";
import { generatePixiObject } from "../renderer/ObjectGenerator.ts";
import { convertPixiToSkia } from "../renderer/SkiaRenderer.ts";
import { exportToPdf } from "../exporter/PdfExporter.ts";


// Инициализация обработчиков интерфейса.
// Передаем mainContainer аргументом, чтобы избежать циклических импортов.

export function setupUiEvents(mainContainer: Container): void {
    const clearBtn = document.getElementById("clear-btn");
    const generateBtn = document.getElementById("generate-btn");
    const pdfButton = document.getElementById("download-pdf-btn");
    const changeBg = document.getElementById("color-input") as HTMLInputElement | null;


    generateBtn?.addEventListener("click", async () => {
        const newObject = await generatePixiObject();
        mainContainer.addChild(newObject);

        mainContainer.updateTransform();
        await convertPixiToSkia(mainContainer);
    });


    pdfButton?.addEventListener("click", async () => {
        await exportToPdf(mainContainer);
    });


    changeBg?.addEventListener("input", async (event) => {
        const target = event.target as HTMLInputElement;
        app.renderer.background.color = target.value;

        await convertPixiToSkia(mainContainer);
    });


    clearBtn?.addEventListener("click", async () => {
        mainContainer.removeChildren();
        app.renderer.background.color = "#ffffff";

        if (changeBg) {
            changeBg.value = "#ffffff";
        }

        mainContainer.updateTransform();
        await convertPixiToSkia(mainContainer);
    });
}