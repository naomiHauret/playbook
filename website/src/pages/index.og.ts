import { html } from 'satori-html'
import satori from 'satori'
import sharp from 'sharp'
import { getFonts } from '../utils'

const generateOgImage = async (): Promise<Buffer> => {
  const markup = html(`
  <div
    style="height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #FDFDFD;"
  >

      <div style="font-size:90px; text-align:center; font-family:'Tinos';">Time to wake your NFTs.</div>
      <div style="margin-top: 24px; font-size:36px; text-align:center; font-family:'Inter';">
        Try Playbook, a text-based RPG where your NFTs become the stars of unique adventures.
      </div>

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
