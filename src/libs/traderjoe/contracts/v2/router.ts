
import { getContract } from 'viem'
import { LBRouterV2 } from '../../abis/v2'
import { publicClient } from '../../client'
import { v2JoeRouterAddress } from '../../constants'

export const getV2Router = () => (getContract({
    address: v2JoeRouterAddress,
    abi: LBRouterV2,
    publicClient,
}))

export const v2Router = getV2Router();

export default getV2Router()