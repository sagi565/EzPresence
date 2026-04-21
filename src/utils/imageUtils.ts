/**
 * Convert a remote image URL to a base64 string (no `data:` prefix).
 * Matches the shape produced by `fileToBase64` and expected by `BrandInitializeDto.logoObject`.
 *
 * Strategy:
 *   1. fetch() + blob -> FileReader.readAsDataURL.
 *   2. On failure (CORS / network), fall back to <img crossorigin="anonymous"> + canvas.
 *   3. If both fail, throw — caller surfaces a user-facing error.
 */
export const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    return await blobToBase64(blob);
  } catch {
    return await imageElementToBase64(url);
  }
};

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(blob);
  });

const imageElementToBase64 = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl.split(',')[1]);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });
