// Client-side image compression + ImgBB upload (mockAPI cannot store files).
const IMGBB_ENDPOINT = 'https://api.imgbb.com/1/upload';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_WIDTH = 1280;
const JPEG_QUALITY = 0.8;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function validateFile(file) {
  if (!file) throw new Error('Rasm tanlanmagan.');
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Faqat JPG, PNG yoki WEBP formatdagi rasm yuklash mumkin.');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Rasm hajmi 5 MB dan oshmasligi kerak.');
  }
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Rasmni o'qib bo'lmadi."));
    };
    image.src = objectUrl;
  });
}

async function compressImage(file) {
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_WIDTH / (image.width || MAX_WIDTH));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) resolve(blob);
        else reject(new Error('Rasmni siqishda xatolik yuz berdi.'));
      },
      'image/jpeg',
      JPEG_QUALITY
    );
  });
}

function uploadToImgBB(blob, key, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('key', key);
    formData.append('image', blob, 'blog.jpg');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', IMGBB_ENDPOINT);

    xhr.upload.onprogress = event => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let data = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        data = null;
      }

      if (xhr.status >= 200 && xhr.status < 300 && data?.data?.url) {
        if (onProgress) onProgress(100);
        resolve(data.data.url);
        return;
      }

      reject(new Error(data?.error?.message || "Rasmni yuklashda xatolik yuz berdi."));
    };

    xhr.onerror = () => reject(new Error("ImgBB bilan bog'lanishda xatolik yuz berdi."));
    xhr.send(formData);
  });
}

/**
 * Resize + compress the image, then upload it to ImgBB.
 * Returns the public image URL (used as the post.image value).
 */
export async function uploadImage(file, onProgress) {
  const key = import.meta.env.VITE_IMGBB_KEY;
  if (!key) {
    throw new Error("ImgBB kaliti topilmadi. .env fayliga VITE_IMGBB_KEY qo'shing.");
  }

  validateFile(file);
  if (onProgress) onProgress(0);

  const blob = await compressImage(file);
  return uploadToImgBB(blob, key, onProgress);
}
