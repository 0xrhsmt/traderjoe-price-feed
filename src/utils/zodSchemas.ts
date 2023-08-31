import { z } from 'zod';
import { Address, isAddress } from 'viem';

export const addressSchema = z.custom<Address>(
  val => {
    return typeof val === 'string' && isAddress(val);
  },
  { message: 'Invalid address' },
);
