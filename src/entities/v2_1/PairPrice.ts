import { Token } from '@traderjoe-xyz/sdk-core';

export class PairPrice {
  constructor(
    private baseToken: Token,
    private quoteToken: Token,
    private binStep: number,
  ) {}

  // @return price: (1 + binStep / 10_000) ^ (activeId - 2^23) * 10 ^ (baseToken.decimals - quoteToken.decimals)
  getPrice(activeId: number): number {
    const decimalsExp = this.baseToken.sortsBefore(this.quoteToken)
      ? this.baseToken.decimals - this.quoteToken.decimals
      : this.quoteToken.decimals - this.baseToken.decimals;

    const price = (1 + this.binStep / 10000) ** (activeId - 8388608) * 10 ** decimalsExp;

    return this.baseToken.sortsBefore(this.quoteToken) ? price : 1 / price;
  }
}
