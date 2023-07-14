import { getContract } from 'viem'
import { LBPairV2_1 } from '../../abis/v2_1'
import { publicClient } from '../../client'

export const getV2_1Pair = (address: `0x${string}`) => (getContract({
    address,
    abi: LBPairV2_1,
    publicClient,
}))

export default getV2_1Pair