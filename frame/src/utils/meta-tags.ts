import { verifyMessage } from 'frog'

/**
 * Adds custom meta tags
 * @param client - the client to support (eg: `"xmtp"`)
 * @param version - defaults to `"vNext"`
 * @returns custom meta tags as object
 */
export function addMetaTags(client: string, version?: string) {
  return {
    title: 'Try Playbook - inline RPG with your NFTs as characters',
    verifyMessage: 'silent',
    unstable_metaTags: [
      { property: `of:accepts`, content: version || 'vNext' },
      { property: `of:accepts:${client}`, content: version || 'vNext' },
    ],
  }
}
