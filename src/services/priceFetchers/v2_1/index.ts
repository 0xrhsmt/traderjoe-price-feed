import { v2_1Factory, getV2_1Pair, getTokenDecimals, compareAddressOrder } from '@/libs/traderjoe'
import { isAddress} from 'viem'

export default class PriceFetcherV2_1Service {
    async execute(baseAsset: `0x${string}`, quoteAsset: `0x${string}`, binStep: number): Promise<number> {
        if (!isAddress(baseAsset) || !isAddress(quoteAsset)) {
            throw new Error()
        }

        const baseDecimals = await getTokenDecimals(baseAsset);
        const quoteDecimals = await getTokenDecimals(quoteAsset);

        // TODO: calculate pair address from baseAsset and quoteAsset
        // TODO: cache pair address by asset address
        const pairInfo = await v2_1Factory.read.getLBPairInformation([baseAsset, quoteAsset, BigInt(binStep)]) as {LBPair: `0x${string}`};

        const pair = getV2_1Pair(pairInfo.LBPair);
        const activeId = await pair.read.getActiveId() as [bigint, bigint, bigint];

        if (compareAddressOrder(baseAsset, quoteAsset)) {
            return (1 + binStep / 10000) ** (Number(activeId) - 8388608) * (10 ** baseDecimals) / (10 ** quoteDecimals)
        } else {
            return (1 / (1 + binStep / 10000) ** (Number(activeId) - 8388608) * (10 ** baseDecimals) / (10 ** quoteDecimals))
        }
    }
}