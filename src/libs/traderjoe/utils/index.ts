import { getERC20 } from '../contracts'

let TOKEN_DECIMALS_CACHE: { [address: string]: number } = {}

export async function getTokenDecimals(address: `0x${string}`): Promise<number> {
    if (TOKEN_DECIMALS_CACHE[address]) {
        return TOKEN_DECIMALS_CACHE[address];
    }

    const token = getERC20(address);
    const decimals = await token.read.decimals() as number;
    
    TOKEN_DECIMALS_CACHE = {
        ...TOKEN_DECIMALS_CACHE,
        [address]: decimals
    }

    return decimals;
}

export const compareAddressOrder = (addressA: string, addressB: string): boolean => {
    return addressA.toLowerCase() < addressB.toLowerCase()
}