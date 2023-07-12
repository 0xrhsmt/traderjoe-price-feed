import { createPublicClient, http } from 'viem'
import { arbitrum } from 'viem/chains'

export const publicClient = createPublicClient({
    batch: {
        multicall: true,
    },
    // TODO: use env to switch chain
    chain: arbitrum,
    transport: http()
})

export default publicClient