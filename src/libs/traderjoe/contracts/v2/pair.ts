import { getContract } from 'viem'
import { LBPairV2 } from '../../abis/v2'
import { publicClient } from '../../client'

export const getV2Pair = (address: `0x${string}`) => (getContract({
    address,
    abi: LBPairV2,
    publicClient,
}))

export default getV2Pair