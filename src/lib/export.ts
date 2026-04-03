import { toPng, toSvg } from "html-to-image";

export async function exportToPng(element: HTMLElement, filename: string) {
  try {
    const dataUrl = await toPng(element, {
      backgroundColor: "#0a0e1a",
      quality: 1,
    });
    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Failed to export PNG:", err);
  }
}

export async function exportToSvg(element: HTMLElement, filename: string) {
  try {
    const dataUrl = await toSvg(element, {
      backgroundColor: "#0a0e1a",
    });
    const link = document.createElement("a");
    link.download = `${filename}.svg`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Failed to export SVG:", err);
  }
}
