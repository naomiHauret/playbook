import { deployerAccount, deployerWalletClient, ORACLE_ADDRESS, publicClient } from '../helpers'
import { createSystemPrompt } from '../prompts'
import * as enchantedForestStoryline from '../the-enchanted-forest.json'
import * as mruState from '../with-dumb-narrator.json'
import { abi, bytecode } from '../../../artifacts/contracts/Narrator-Opus.sol/PlaybookNarrator.json'

async function deploy() {
  const prompt = createSystemPrompt({
    storyline: enchantedForestStoryline,
    playerSession:
      mruState.players['0x44817B9B9d0b7Cd4aC7Eb7fb53E3184c4FAC0fb0'].games['the-enchanted-forest']
        .sessions['0x9b0700dcbb28662aa1f8bdcf9359e3aabdb071554b5aae48cbebcedfc80602ae'],
  })
  const hash = await deployerWalletClient.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    account: deployerAccount,
    args: [ORACLE_ADDRESS, prompt],
  })

  const receipt = await publicClient.waitForTransactionReceipt({ hash })

  console.log('contract deployed at this address: ', receipt.contractAddress)
}

deploy()
