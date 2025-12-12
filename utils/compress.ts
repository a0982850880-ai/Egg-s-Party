export const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Limit width to 800px for performance
        const scaleSize = MAX_WIDTH / img.width;
        
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
           width = MAX_WIDTH;
           height = img.height * scaleSize;
        }

        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject("Canvas context error");
            return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.7 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};