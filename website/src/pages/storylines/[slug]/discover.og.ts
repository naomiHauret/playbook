import { html } from 'satori-html'
import satori from 'satori'
import sharp from 'sharp'
import { getFonts } from '~/utils/fonts'

const generateOgImage = async (title?: string): Promise<Buffer> => {
  const markup = html(`
  <div
    style="height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #FDFDFD; font-size: 32px;"
  >
      <span style="font-size:90px; font-family:'Tinos';">${title ?? 'Play this story'}</span>

      <span style="font-size:36px; padding-top:24px; font-family:'Tinos';">Adventure awaits...</span>

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

export async function GET({ params, url }) {
  const title = url.searchParams.get('title')
  const response = await generateOgImage(title)
  return new Response(response, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
    },
  })
}
