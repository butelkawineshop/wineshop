import sharp from 'sharp'

interface ImageProcessingOptions {
  quality?: number
  effort?: number
}

/**
 * Image processing utilities using Sharp library
 * Provides functions for resizing, optimizing, and generating thumbnails
 */
export const imageProcessing = {
  /**
   * Resizes an image to specified dimensions while maintaining aspect ratio
   *
   * @param buffer - Input image buffer
   * @param width - Target width in pixels
   * @param height - Optional target height in pixels (calculated if not provided)
   * @param format - Output image format
   * @returns Promise resolving to processed image buffer
   * @throws {Error} If image processing fails
   *
   * @example
   * ```typescript
   * const resizedBuffer = await imageProcessing.resizeImage(
   *   originalBuffer,
   *   800,
   *   600,
   *   'webp'
   * )
   * ```
   */
  async resizeImage(
    buffer: Buffer,
    width: number,
    height?: number,
    format: 'jpeg' | 'png' | 'webp' | 'avif' = 'webp',
  ): Promise<Buffer> {
    if (!buffer || buffer.length === 0) {
      throw new Error('Input buffer is empty or invalid')
    }

    if (width <= 0) {
      throw new Error('Width must be a positive number')
    }

    try {
      const image = sharp(buffer)
      const metadata = await image.metadata()

      // Calculate height if not provided
      if (!height && metadata.width && metadata.height) {
        height = Math.round((width * metadata.height) / metadata.width)
      }

      if (!height || height <= 0) {
        throw new Error('Invalid height calculated or provided')
      }

      return await image
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
      throw new Error(
        `Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  },

  /**
   * Generates a square thumbnail from an image
   *
   * @param buffer - Input image buffer
   * @param size - Size of the square thumbnail in pixels
   * @returns Promise resolving to thumbnail buffer
   * @throws {Error} If thumbnail generation fails
   *
   * @example
   * ```typescript
   * const thumbnail = await imageProcessing.generateThumbnail(originalBuffer, 200)
   * ```
   */
  async generateThumbnail(buffer: Buffer, size: number = 200): Promise<Buffer> {
    if (size <= 0) {
      throw new Error('Thumbnail size must be a positive number')
    }

    return this.resizeImage(buffer, size, size)
  },

  /**
   * Optimizes an image by converting to specified format with compression
   *
   * @param buffer - Input image buffer
   * @param format - Output image format
   * @param options - Optional processing options
   * @returns Promise resolving to optimized image buffer
   * @throws {Error} If image optimization fails
   *
   * @example
   * ```typescript
   * const optimized = await imageProcessing.optimizeImage(
   *   originalBuffer,
   *   'webp',
   *   { quality: 85, effort: 6 }
   * )
   * ```
   */
  async optimizeImage(
    buffer: Buffer,
    format: 'jpeg' | 'png' | 'webp' | 'avif' = 'webp',
    options: ImageProcessingOptions = {},
  ): Promise<Buffer> {
    if (!buffer || buffer.length === 0) {
      throw new Error('Input buffer is empty or invalid')
    }

    const { quality = 80, effort = 4 } = options

    if (quality < 1 || quality > 100) {
      throw new Error('Quality must be between 1 and 100')
    }

    if (effort < 0 || effort > 6) {
      throw new Error('Effort must be between 0 and 6')
    }

    try {
      return await sharp(buffer)
        .toFormat(format, {
          quality,
          effort,
        })
        .toBuffer()
    } catch (error) {
      throw new Error(
        `Image optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  },
}
