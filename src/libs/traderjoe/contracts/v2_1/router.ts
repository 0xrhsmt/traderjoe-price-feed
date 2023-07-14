
import { getContract } from 'viem'
import { LBRouterV2_1 } from '../../abis/v2_1'
import { publicClient } from '../../client'
import { v2_1JoeRouterAddress } from '../../constants'

export const getV2_1Router = () => (getContract({
    address: v2_1JoeRouterAddress,
    abi: LBRouterV2_1,
    publicClient,
}))

export const v2_1Router = getV2_1Router();

export default getV2_1Router()