import { getContract } from 'viem'
import { ERC20ABI } from '../abis/v1'
import { publicClient } from '../client'

export const getERC20 = (address: `0x${string}`) => (getContract({
    address,
    abi: ERC20ABI,
    publicClient,
}))

export default getERC20