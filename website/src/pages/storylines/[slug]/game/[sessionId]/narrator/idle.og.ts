import { html } from 'satori-html'
import satori from 'satori'
import sharp from 'sharp'
import { getFonts } from '~/utils/fonts'

const generateOgImage = async (): Promise<Buffer> => {
  const markup = html(`
  <div
    style="height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #FDFDFD; font-size: 32px;"
  >

      <div style="max-width: 75%; text-align: center; font-size:90px; font-family:'Tinos';">All great stories neeed a narrator.</div>

  </div>`)

  const fonts = getFonts()

  const svg = await satori(markup as React.ReactNode, {
    width: 1200,
    height: 630,
    //@ts-ignore
    fonts,
  })

  const sharpSvg = Buffer.from(svg)

  const buffer = await sharp(sharpSvg).toBuffer()

  return buffer
}

export async function GET() {
  const response = await generateOgImage()
  return new Response(response, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
    },
  })
}
