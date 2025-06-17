import sharp from 'sharp'

export const imageProcessing = {
  async resizeImage(
    buffer: Buffer,
    width: number,
    height?: number,
    format: 'jpeg' | 'png' | 'webp' | 'avif' = 'webp',
  ) {
    try {
      const image = sharp(buffer)
      const metadata = await image.metadata()

      // Calculate height if not provided
      if (!height && metadata.width) {
        height = Math.round((width * metadata.height!) / metadata.width)
      }

      return image
        .resize(width, height, {
          fit: 'cover',
          position: 'center',
        })
        .toFormat(format, {
          quality: 80,
          effort: 4,
        })
        .toBuffer()
    } catch (error) {
      console.error('Image Processing Error:', error)
      throw error
    }
  },

  async generateThumbnail(buffer: Buffer, size: number = 200) {
    return this.resizeImage(buffer, size, size)
  },

  async optimizeImage(buffer: Buffer, format: 'jpeg' | 'png' | 'webp' | 'avif' = 'webp') {
    try {
      return sharp(buffer)
        .toFormat(format, {
          quality: 80,
          effort: 4,
        })
        .toBuffer()
    } catch (error) {
      console.error('Image Optimization Error:', error)
      throw error
    }
  },
}
