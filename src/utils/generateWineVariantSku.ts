interface WineData {
  id: string
  title: string
  winery: {
    id: string
    title: string
    wineryCode: string
  }
  region: {
    id: string
    title: string
    country: {
      id: string
      title: string
    }
  }
}

interface GenerateSkuParams {
  wine: WineData
  size: string
  vintage: string
}

export function generateWineVariantSku({ wine, size, vintage }: GenerateSkuParams): string {
  const wineryCode = wine.winery.wineryCode
  const wineNumber = wine.id.toString().padStart(4, '0')
  const sizeCode = size.toString().padStart(4, '0')
  const vintageCode = vintage === 'NV' ? '0000' : vintage.padStart(4, '0')

  return `${wineryCode}${wineNumber}${sizeCode}${vintageCode}`
}
