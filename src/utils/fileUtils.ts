export const calculateChecksum = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
};

export const generateThumbnail = async (file: File): Promise<string> => {
  if (file.type.startsWith('image/')) {
    return generateImageThumbnail(file);
  } else if (file.type.startsWith('video/')) {
    return generateVideoThumbnail(file);
  }
  // Fallback transparent pixel
  return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
};

const generateImageThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Increased from 300 to 1280 for better resolution
        const MAX_SIZE = 1280; 
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        // Use higher quality JPEG (0.85)
        resolve(canvas.toDataURL('image/jpeg', 0.85)); 
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    // Capture at 1.0s to ensure we have a valid frame
    video.currentTime = 1.0; 

    const onSeeked = () => {
        // Increased from 300 to 1280 for better resolution
        const MAX_SIZE = 1280;
        let width = video.videoWidth;
        let height = video.videoHeight;

        if (width > height) {
            if (width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
            }
        } else {
            if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
            }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        
        // Clean up
        URL.revokeObjectURL(video.src);
        resolve(dataUrl);
    };

    video.addEventListener('seeked', onSeeked, { once: true });
    video.addEventListener('error', (e) => {
        URL.revokeObjectURL(video.src);
        reject(e);
    }, { once: true });
  });
};