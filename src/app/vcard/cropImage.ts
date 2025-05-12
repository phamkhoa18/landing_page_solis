/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Sử dụng kích thước từ pixelCrop, đảm bảo hình vuông
  const outputSize = Math.max(pixelCrop.width, 120); // Đảm bảo tối thiểu 120px
  canvas.width = outputSize;
  canvas.height = outputSize;

  ctx?.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/jpeg');
  });
}