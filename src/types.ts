import core from 'express-serve-static-core';
import { RequestHandler } from 'express-serve-static-core';
import { Address, Chain, PublicClient } from 'viem';

export interface RequestHandlerWithLocals<Locals extends Record<string, unknown>>
  extends RequestHandler<core.ParamsDictionary, unknown, unknown, core.Query, Locals> {}

export type BaseRequestLocals = { chain: Chain; publicClient: PublicClient };
export interface BaseRequestHandler extends RequestHandlerWithLocals<BaseRequestLocals> {}
export interface ValidatedRequestHandler<TInput>
  extends RequestHandlerWithLocals<BaseRequestLocals & { input: TInput }> {}

export interface PriceWithTokens {
  base: Address;
  quote: Address;
  price: number;
}

export interface PriceWithTokensAndBinStep extends PriceWithTokens {
  binStep: number;
}

export interface PriceWithPairAddress {
  pair: Address;
  price: number;
}
