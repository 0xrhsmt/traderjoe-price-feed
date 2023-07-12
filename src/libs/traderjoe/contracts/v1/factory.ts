
import { getContract } from 'viem'
import { JoeFactoryABI } from '../../abis/v1'
import { publicClient } from '../../client'
import { v1JoeFactoryAddress } from '../../constants'

export const getV1Factory = () => (getContract({
    address: v1JoeFactoryAddress,
    abi: JoeFactoryABI,
    publicClient,
}))

export const v1Factory = getV1Factory();

export default getV1Factory()