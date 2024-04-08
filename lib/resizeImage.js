import sharp from 'sharp';

export function resizeImage(imageBuffer, isBadge=false) {
    // Redimensionar la imagen
    if (isBadge) {
        return sharp(imageBuffer)
            .resize(50, 50) // Cambia estos valores a las dimensiones deseadas
            .toBuffer();
    } else {
        return sharp(imageBuffer)
        .resize(600, 200) // Cambia estos valores a las dimensiones deseadas
        .toBuffer();
    }
}