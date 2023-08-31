import { getAddress, keccak256, encodePacked, toBytes, pad, slice, concat, Address } from 'viem';
import { Token, ChainId } from '@traderjoe-xyz/sdk-core';
import { FACTORY_ADDRESS, INIT_CODE_HASH } from '@traderjoe-xyz/sdk';

export class Pair {
  public static getAddress(tokenA: Token, tokenB: Token, chainId: ChainId): Address {
    const tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

    const from = toBytes(getAddress(FACTORY_ADDRESS[chainId]));
    const salt = pad(
      keccak256(
        encodePacked(
          ['address', 'address'],
          [getAddress(tokens[0].address), getAddress(tokens[1].address)],
        ),
        'bytes',
      ),
      {
        size: 32,
      },
    );
    const bytecodeHash = toBytes(INIT_CODE_HASH[chainId]);

    return getAddress(slice(keccak256(concat([toBytes('0xff'), from, salt, bytecodeHash])), 12));
  }
}
