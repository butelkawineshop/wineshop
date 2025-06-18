import type { Field } from 'payload'

interface PDFFieldOptions {
  /**
   * Whether the field should be required
   * @default false
   */
  required?: boolean
  /**
   * Custom admin configuration
   */
  admin?: {
    description?: string
  }
}

/**
 * Creates a PDF upload field that stores files in Cloudflare R2
 */
export const pdfField = ({
  required = false,
  admin = {
    description: 'Upload a PDF file',
  },
}: PDFFieldOptions = {}): Field => ({
  name: 'invoice',
  type: 'upload',
  relationTo: 'invoices',
  required,
  admin: {
    ...admin,
  },
  filterOptions: {
    mimeType: {
      equals: 'application/pdf',
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure the file is a PDF
        if (data?.mimeType && data.mimeType !== 'application/pdf') {
          throw new Error('Only PDF files are allowed')
        }
        return data
      },
    ],
  },
})
