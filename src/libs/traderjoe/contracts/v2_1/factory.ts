import { getContract } from 'viem'
import { LBFactoryV2_1 } from '../../abis/v2_1'
import { publicClient } from '../../client'
import { v2_1JoeFactoryAddress } from '../../constants'

export const getV2_1Factory = () => (getContract({
    address: v2_1JoeFactoryAddress,
    abi: LBFactoryV2_1,
    publicClient,
}))

export const v2_1Factory = getV2_1Factory();

export default getV2_1Factory()