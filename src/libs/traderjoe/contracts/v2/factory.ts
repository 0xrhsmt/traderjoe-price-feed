import { getContract } from 'viem'
import { LBFactoryV2 } from '../../abis/v2'
import { publicClient } from '../../client'
import { v2JoeFactoryAddress } from '../../constants'

export const getV2Factory = () => (getContract({
    address: v2JoeFactoryAddress,
    abi: LBFactoryV2,
    publicClient,
}))

export const v2Factory = getV2Factory();

export default getV2Factory()