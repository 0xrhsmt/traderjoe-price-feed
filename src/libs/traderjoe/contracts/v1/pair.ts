import { getContract } from 'viem'
import { JoePairABI } from '../../abis/v1'
import { publicClient } from '../../client'

export const getV1Pair = (address: `0x${string}`) => (getContract({
    address,
    abi: JoePairABI,
    publicClient,
}))

export default getV1Pair