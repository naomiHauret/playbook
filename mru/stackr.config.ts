import { DA, KeyPurpose, SignatureScheme, type StackrConfig } from '@stackr/sdk'
import dotenv from 'dotenv'

dotenv.config()

const stackrConfig: StackrConfig = {
  isSandbox: true,
  sequencer: {
    blockSize: 16,
    blockTime: 10,
  },
  syncer: {
    vulcanRPC: process.env.VULCAN_RPC as string,
    L1RPC: process.env.L1_RPC as string,
  },
  operator: {
    accounts: [
      {
        privateKey: process.env.MRU_PRIVATE_KEY as string,
        purpose: KeyPurpose.BATCH,
        scheme: SignatureScheme.ECDSA,
      },
    ],
  },
  domain: {
    name: 'Playbook MVP v0',
    version: '1',
    salt: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  },
  datastore: {
    type: 'sqlite',
    uri: process.env.DATABASE_URI as string,
  },
  registryContract: process.env.REGISTRY_CONTRACT as string,
  preferredDA: DA.CELESTIA,
  logLevel: 'log',
}

export { stackrConfig }
