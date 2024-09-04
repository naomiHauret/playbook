import { readFileSync } from 'fs'

export function getFonts() {
  const fonts = [
    {
      name: 'Tinos',
      filename: 'Tinos-Regular.woff',
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Tinos',
      filename: 'Tinos-Italic.woff',
      weight: 400,
      style: 'italic',
    },
    {
      name: 'Tinos',
      filename: 'Tinos-Bold.woff',
      weight: 700,
      style: 'normal',
    },
    {
      name: 'Tinos',
      filename: 'Tinos-BoldItalic.woff',
      weight: 700,
      style: 'italic',
    },
  ]

  return fonts.map((font) => {
    const data = readFileSync(`${process.cwd()}/public/${font.filename}`)
    return {
      name: font.name,
      data,
      weight: font.weight,
      style: font.style,
    }
  })
}
