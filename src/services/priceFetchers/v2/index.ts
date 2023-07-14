import { v1Factory, getV1Pair, compareAddressOrder, getTokenDecimals } from '@/libs/traderjoe'
import { isAddress} from 'viem'

const DECIMALS = 1000000000000000000;

export default class PriceFetcherV1Service {
    async execute(baseAsset: `0x${string}`, quoteAsset: `0x${string}`, binStep: number): Promise<number> {
        if (!isAddress(baseAsset) || !isAddress(quoteAsset)) {
            throw new Error()
        }

        const baseDecimals = await getTokenDecimals(baseAsset);
        const quoteDecimals = await getTokenDecimals(quoteAsset);

        // TODO: calculate pair address from baseAsset and quoteAsset
        // TODO: cache pair address by asset address
        const pairAddress = await v1Factory.read.getPair([baseAsset, quoteAsset]) as `0x${string}`;
        const pair = getV1Pair(pairAddress);
        const reserves = await pair.read.getReserves() as [bigint, bigint, bigint];

        return compareAddressOrder(baseAsset, quoteAsset) ? Number((reserves[1] * (10n ** BigInt(baseDecimals)) * BigInt(DECIMALS)) / (reserves[0] * (10n ** BigInt(quoteDecimals)))) / DECIMALS : Number((reserves[0] * (10n ** BigInt(quoteDecimals))) * BigInt(DECIMALS) / (reserves[1] * (10n ** BigInt(baseDecimals)))) / DECIMALS;
    }
}