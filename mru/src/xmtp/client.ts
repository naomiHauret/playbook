import { Client } from '@xmtp/xmtp-js'
import { Wallet } from 'ethers'

// using a `viem` account doesn't seem to work with xmtp client, have to use ethers instead
const devAccount = new Wallet(process.env.XMTP_BOT_PRIVATE_KEY!!)
export const xmtpClient = await Client.create(devAccount, { env: 'dev' })
