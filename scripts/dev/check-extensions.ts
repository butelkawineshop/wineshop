import 'dotenv/config'
import { readdir } from 'fs/promises'

async function checkExtensions(directory: string) {
  try {
    const files = await readdir(directory)
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))

    console.log(`Found ${imageFiles.length} image files in ${directory}`)
    console.log('')

    // Count extensions
    const extensions = imageFiles.reduce(
      (acc, file) => {
        const ext = file.split('.').pop()?.toLowerCase() || 'unknown'
        acc[ext] = (acc[ext] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    console.log('File extension breakdown:')
    Object.entries(extensions).forEach(([ext, count]) => {
      console.log(`  ${ext}: ${count} files`)
    })

    console.log('')
    console.log('First 10 image files:')
    imageFiles.slice(0, 10).forEach((file, index) => {
      const nameWithoutExt = file.replace(/\.[^/.]+$/, '')
      console.log(`${index + 1}. ${file} (base: ${nameWithoutExt})`)
    })
  } catch (error) {
    console.error('Error reading directory:', error)
  }
}

async function main() {
  const directory = process.argv[2] || './wine-images'
  await checkExtensions(directory)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
