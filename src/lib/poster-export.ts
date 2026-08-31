import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { PosterExportOptions } from './types';

/**
 * Tek bir poster elementini PNG olarak indirir
 */
export async function downloadPosterAsPng(
  options: PosterExportOptions
): Promise<void> {
  const { element, filename, width, height } = options;

  try {
    const dataUrl = await toPng(element, {
      width,
      height,
      pixelRatio: 1, // Zaten 1080px olarak render ediyoruz
      cacheBust: true,
      quality: 1.0,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Poster indirme hatası:', error);
    throw error;
  }
}

/**
 * Birden fazla posteri PNG olarak üretip blob döndürür (ZIP için)
 */
async function posterToBlob(
  options: PosterExportOptions
): Promise<Blob> {
  const { element, width, height } = options;

  const dataUrl = await toPng(element, {
    width,
    height,
    pixelRatio: 1,
    cacheBust: true,
    quality: 1.0,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left',
    },
  });

  const response = await fetch(dataUrl);
  return response.blob();
}

/**
 * Tüm posterleri ZIP dosyası olarak indirir
 */
export async function downloadAllAsZip(
  posters: PosterExportOptions[]
): Promise<void> {
  const zip = new JSZip();

  for (const poster of posters) {
    try {
      const blob = await posterToBlob(poster);
      zip.file(`${poster.filename}.png`, blob);
    } catch (error) {
      console.error(`"${poster.filename}" oluşturulamadı:`, error);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'matchposter-afisler.zip');
}
