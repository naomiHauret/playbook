import { html } from 'satori-html'
import satori from 'satori'
import sharp from 'sharp'
import { getFonts } from '~/utils/fonts'

const generateOgImage = async (args: {
  archetype: string
  nft?: any
  personality?: string
  alignment?: string
  step?: string
}): Promise<Buffer> => {
  const markup = html(`
  <div
    style="height: 100%; text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #FDFDFD; font-size: 32px;"
  >
      ${
        args?.nft && args?.nft !== null
          ? `
        <img height="200px;" src="${args.nft?.image_url}" />
        <div style="margin-top: 24px; max-width: 80%; display:block; font-size:76px; font-weight: bold; font-family:'Tinos';">${args.nft?.name ?? ''}</div>
        <span style="font-size:48px; padding-top:24px; font-family:'Tinos';">as ${args.archetype}</span>
        <span style="font-size:40px; padding-top:20px; font-family:'Tinos';">${args?.personality && args?.personality !== null ? args?.personality : ''} ${args?.alignment && args?.alignment !== null ? `; ${args?.alignment}` : ''}</span>
     `
          : `
        <span style="font-size:90px; font-family:'Tinos';">${args.archetype ?? ''}</span>
        <span style="font-size:48px; padding-top:32px; font-family:'Tinos';">Who will you cast as this character ?</span>
      `
      }

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

export async function GET({ url }) {
  const archetype = url.searchParams.get('archetype')
  const nft = url.searchParams.get('nft')
  const personality = url.searchParams.get('personality')
  const alignment = url.searchParams.get('alignment')
  const step = url.searchParams.get('step')

  const response = await generateOgImage({
    archetype,
    nft: nft ? JSON.parse(decodeURI(nft)) : undefined,
    personality,
    alignment,
    step,
  })
  return new Response(response, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
    },
  })
}
