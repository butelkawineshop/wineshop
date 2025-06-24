import 'dotenv/config'

async function testCloudflareAPI() {
  console.log('Testing Cloudflare API connection...')
  console.log('')

  // Check environment variables
  console.log('Environment variables:')
  console.log(
    `CLOUDFLARE_ACCOUNT_ID: ${process.env.CLOUDFLARE_ACCOUNT_ID ? '✅ Set' : '❌ Missing'}`,
  )
  console.log(
    `CLOUDFLARE_IMAGES_API_TOKEN: ${process.env.CLOUDFLARE_IMAGES_API_TOKEN ? '✅ Set' : '❌ Missing'}`,
  )
  console.log('')

  if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_IMAGES_API_TOKEN) {
    console.error('❌ Missing required environment variables')
    return
  }

  try {
    // First, test the account details endpoint
    console.log('Testing account details...')
    const accountResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )

    console.log(`Account response status: ${accountResponse.status}`)
    const accountText = await accountResponse.text()
    console.log(`Account response:`, accountText)

    if (accountResponse.ok) {
      console.log('✅ Account access successful!')
    } else {
      console.log('❌ Account access failed - API token might not have account permissions')
    }

    console.log('')

    // Test the Images API specifically
    console.log('Testing Images API...')
    const imagesResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )

    console.log(`Images API response status: ${imagesResponse.status}`)
    const imagesText = await imagesResponse.text()
    console.log(`Images API response:`, imagesText)

    if (imagesResponse.ok) {
      console.log('✅ Images API access successful!')
    } else {
      console.log('❌ Images API access failed - API token might not have Images permissions')
    }

    console.log('')

    // Test the direct upload endpoint
    console.log('Testing direct upload endpoint...')
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    )

    console.log(`Direct upload response status: ${response.status}`)
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log(`Direct upload response body:`, responseText)

    if (response.ok) {
      const data = JSON.parse(responseText)
      console.log('✅ Direct upload API connection successful!')
      console.log('Upload URL received:', data.result?.uploadURL ? '✅ Yes' : '❌ No')
    } else {
      console.log('❌ Direct upload API connection failed')
    }
  } catch (error) {
    console.error('❌ Error testing API:', error)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testCloudflareAPI().catch(console.error)
}
