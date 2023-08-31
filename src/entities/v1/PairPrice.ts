import { Token } from '@traderjoe-xyz/sdk-core';
import { PairNoLiquidityError } from '../../errors.js';

export class PairPrice {
  constructor(
    private baseToken: Token,
    private quoteToken: Token,
    private resveres: readonly [bigint, bigint],
  ) {}

  getPrice(): number {
    const [baseReserve, quoteReserve] = this.baseToken.sortsBefore(this.quoteToken)
      ? [this.resveres[0], this.resveres[1]]
      : [this.resveres[1], this.resveres[0]];
    if (baseReserve === 0n) {
      throw new PairNoLiquidityError();
    }
    if (baseReserve !== 0n && quoteReserve === 0n) {
      return 0;
    }

    const numerator = quoteReserve * 10n ** BigInt(this.baseToken.decimals);
    const denominator = baseReserve * 10n ** BigInt(this.quoteToken.decimals);
    const price =
      Number((numerator * BigInt(Number.MAX_SAFE_INTEGER)) / denominator) / Number.MAX_SAFE_INTEGER;

    return price;
  }
}
