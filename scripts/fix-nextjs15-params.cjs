#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Function to update a single page file
function updatePageFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')

    // Check if the file needs updating (has the old params pattern)
    if (!content.includes('params: Promise<') && content.includes('params: { slug: string[] }')) {
      console.log(`Updating ${filePath}`)

      // Replace the function signature and add await statements
      let updatedContent = content
        .replace(
          /export default function (\w+)\(\{ params, searchParams \}: \{[\s\S]*?\}\) \{/,
          (match, functionName) => {
            return `export default async function ${functionName}({ params, searchParams }: {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams`
          },
        )
        .replace(
          /<CollectionPage[\s\S]*?params=\{params\}[\s\S]*?searchParams=\{searchParams\}/,
          (match) => {
            return match
              .replace('params={params}', 'params={resolvedParams}')
              .replace('searchParams={searchParams}', 'searchParams={resolvedSearchParams}')
          },
        )

      fs.writeFileSync(filePath, updatedContent, 'utf8')
      console.log(`✓ Updated ${filePath}`)
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message)
  }
}

// Function to recursively find and update [slug]/page.tsx files
function updatePageFiles(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      if (file.startsWith('[') && file.endsWith(']')) {
        // Only update [slug] directories
        const pageFile = path.join(filePath, 'page.tsx')
        if (fs.existsSync(pageFile)) {
          updatePageFile(pageFile)
        }
      } else {
        updatePageFiles(filePath)
      }
    }
  }
}

// Start the update process
const srcDir = path.join(__dirname, '..', 'src', 'app')
console.log('Updating [slug] page files for Next.js 15 compatibility...')
updatePageFiles(srcDir)
console.log('Done!')
