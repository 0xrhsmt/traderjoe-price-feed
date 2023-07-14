import { v2Factory, getV2Pair } from '@/libs/traderjoe'
import { isAddress} from 'viem'

export default class PriceFetcherV2Service {
    async execute(baseAsset: `0x${string}`, quoteAsset: `0x${string}`, binStep: number): Promise<number> {
        if (!isAddress(baseAsset) || !isAddress(quoteAsset)) {
            throw new Error()
        }

        // TODO: calculate pair address from baseAsset and quoteAsset
        // TODO: cache pair address by asset address
        const pairInfo = await v2Factory.read.getLBPairInformation([baseAsset, quoteAsset, BigInt(binStep)]) as {LBPair: `0x${string}`};

        const pair = getV2Pair(pairInfo.LBPair);
        const [, , activeId] = await pair.read.getReservesAndId() as [bigint, bigint, bigint];

        return (1 + binStep / 10000) ** (Number(activeId) - 8388608)
    }
}