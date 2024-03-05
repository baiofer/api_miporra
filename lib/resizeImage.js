import sharp from 'sharp';

export function resizeImage(imageBuffer) {
    // Redimensionar la imagen
    return sharp(imageBuffer)
        .resize(200, 200) // Cambia estos valores a las dimensiones deseadas
        .toBuffer();
}